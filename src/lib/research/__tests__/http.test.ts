/** @jest-environment node */
jest.mock('../../auth0', () => ({ auth0: { getSession: jest.fn() } }));
// Jest 27 does not expose Node's Fetch globals. Only the response factory is
// replaced; authorization, origin checks, and callback execution are real.
jest.mock('next/server', () => ({
  NextResponse: {
    json: (
      body: unknown,
      init?: { status?: number; headers?: Record<string, string> },
    ) => ({
      status: init?.status ?? 200,
      headers: {
        get: (name: string) =>
          init?.headers?.[name === 'cache-control' ? 'Cache-Control' : name] ??
          null,
      },
      text: async () => JSON.stringify(body),
    }),
  },
}));
import { auth0 } from '../../auth0';
import { guardAdminRequest } from '../../adminAuth';
import { researchRequest } from '../http';

const session = auth0.getSession as jest.Mock;
const request = (origin = 'https://grosswohnsiedlungen.de', method = 'POST') =>
  ({
    url: 'https://grosswohnsiedlungen.de/api/research',
    method,
    headers: { get: (name: string) => (name === 'origin' ? origin : null) },
  }) as unknown as Request;

describe('Admin API access', () => {
  const saved = {
    admins: process.env.ADMIN_USER_SUBS,
    base: process.env.APP_BASE_URL,
  };
  beforeEach(() => {
    process.env.ADMIN_USER_SUBS = 'auth0|owner';
    process.env.APP_BASE_URL = 'https://grosswohnsiedlungen.de';
    session.mockResolvedValue(null);
  });
  afterAll(() => {
    if (saved.admins === undefined) delete process.env.ADMIN_USER_SUBS;
    else process.env.ADMIN_USER_SUBS = saved.admins;
    if (saved.base === undefined) delete process.env.APP_BASE_URL;
    else process.env.APP_BASE_URL = saved.base;
  });

  it('does not execute research for anonymous or non-admin accounts', async () => {
    const action = jest.fn();
    expect((await researchRequest(request(), action)).status).toBe(403);
    session.mockResolvedValue({ user: { sub: 'auth0|stranger' } });
    expect((await researchRequest(request(), action)).status).toBe(403);
    expect(action).not.toHaveBeenCalled();
  });

  it('blocks cross-site approval even with an admin session', async () => {
    session.mockResolvedValue({ user: { sub: 'auth0|owner' } });
    const action = jest.fn();
    expect(
      (await researchRequest(request('https://evil.example'), action)).status,
    ).toBe(403);
    expect(action).not.toHaveBeenCalled();
  });

  it('allows an explicit admin from the configured site', async () => {
    session.mockResolvedValue({ user: { sub: 'auth0|owner' } });
    const action = jest.fn().mockResolvedValue({ ok: true });
    const response = await researchRequest(request(), action);
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(action).toHaveBeenCalledWith('auth0|owner');
  });

  it('also protects old content mutation endpoints', async () => {
    expect((await guardAdminRequest(request()))?.status).toBe(403);
    session.mockResolvedValue({ user: { sub: 'auth0|owner' } });
    expect(await guardAdminRequest(request())).toBeNull();
    expect(
      (await guardAdminRequest(request('https://evil.example')))?.status,
    ).toBe(403);
    const deletion = {
      method: 'GET',
      url: 'https://grosswohnsiedlungen.de/api/details/delete/id',
      headers: { get: () => 'cross-site' },
    } as unknown as Request;
    expect((await guardAdminRequest(deletion))?.status).toBe(403);
  });

  it('does not leak database errors to clients', async () => {
    session.mockResolvedValue({ user: { sub: 'auth0|owner' } });
    const response = await researchRequest(request(), async () => {
      throw new Error('secret-db-password');
    });
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain('secret-db-password');
  });
});
