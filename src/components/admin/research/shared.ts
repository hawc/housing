import type { getResearchDashboard } from '@/lib/research/service';

export type Dashboard = Awaited<ReturnType<typeof getResearchDashboard>>;
export type Proposal = Dashboard['proposals'][number];
export type Status = 'PENDING' | 'APPLIED' | 'REJECTED' | 'STALE';
export const labels: Record<string, string> = {
  PENDING: 'Offen',
  APPLIED: 'Übernommen',
  REJECTED: 'Abgelehnt',
  STALE: 'Erneut recherchieren',
  QUEUED: 'Wartet',
  RUNNING: 'Recherchiert',
  COMPLETED: 'Abgeschlossen',
  FAILED: 'Fehlgeschlagen',
};
export const inputClass = 'w-full border border-text bg-bg p-2 mt-1';
export const date = (value: unknown) =>
  new Date(String(value)).toLocaleString('de-DE');

export async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'Anfrage fehlgeschlagen.');
  return result as T;
}
