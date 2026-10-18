import { fetchData, fetchMutation } from '../fetch';

jest.mock('../logger', () => ({ logger: jest.fn() }));

describe('Explicit mutation feedback', () => {
  let fetchMock: jest.Mock;
  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  it('returns successful JSON and sends JSON headers', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'detail' }),
    });
    await expect(
      fetchMutation('/api/details/add', { method: 'POST', body: '{}' }),
    ).resolves.toEqual({ id: 'detail' });
    expect(fetchMock.mock.calls[0][1].headers.get('Content-Type')).toBe(
      'application/json',
    );
  });

  it.each([400, 403])(
    'reports the server error for HTTP %i',
    async (status) => {
      fetchMock.mockResolvedValue({
        ok: false,
        status,
        json: async () => ({ error: 'Keine Administratorberechtigung.' }),
      });
      await expect(fetchMutation('/api/details/add')).rejects.toThrow(
        'Keine Administratorberechtigung.',
      );
    },
  );

  it('handles non-JSON failures without showing an HTML error page', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('<html>error</html>');
      },
    });
    await expect(fetchMutation('/api/details/add')).rejects.toThrow(/HTTP 500/);
  });

  it('reports network failures and invalid success responses', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failed'));
    await expect(fetchMutation('/api/details/add')).rejects.toThrow(
      /Verbindung prüfen/,
    );
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });
    await expect(fetchMutation('/api/details/add')).rejects.toThrow(
      /Eintrag neu laden/,
    );
  });

  it('supports the legacy same-origin GET delete endpoints explicitly', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'detail', published: false }),
    });
    await fetchMutation('/api/details/delete/detail', { method: 'GET' });
    expect(fetchMock.mock.calls[0][1].method).toBe('GET');
  });

  it('retains fallback behavior for read requests', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchData('/api/details/get/all', [])).resolves.toEqual([]);
  });
});
