export function isAdminSubject(subject: unknown): subject is string {
  const allowed = (process.env.ADMIN_USER_SUBS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return typeof subject === 'string' && allowed.includes(subject);
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const configured = process.env.APP_BASE_URL;
  const expected = configured
    ? new URL(configured).origin
    : new URL(request.url).origin;
  return origin === expected;
}
