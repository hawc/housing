'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/common/form/Button';
import { ProposalCard } from './ProposalCard';
import { ResearchSelection } from './ResearchSelection';
import { ResearchRunHistory } from './ResearchRunHistory';
import { api, labels } from './shared';
import type { Dashboard, Proposal, Status } from './shared';

export function ResearchDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<Status>('PENDING');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(
    () =>
      api<Dashboard>(`/api/research?status=${filter}`)
        .then((data) => {
          setData(data);
          setError('');
        })
        .catch((error) => {
          setError(
            error instanceof Error ? error.message : 'Laden fehlgeschlagen.',
          );
        })
        .finally(() => setLoading(false)),
    [filter],
  );

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => {
      void refresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function start() {
    setStarting(true);
    setMessage('');
    try {
      await api('/api/research', { settlementIds: selected });
      setMessage(
        'Recherche vorgemerkt. Der Worker verarbeitet die ausgewählten Siedlungen nacheinander. Du kannst diese Seite schließen.',
      );
      await refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Start fehlgeschlagen.',
      );
    } finally {
      setStarting(false);
    }
  }

  async function cancel(runId: string) {
    setStarting(true);
    try {
      await api(`/api/research/runs/${runId}/cancel`, {});
      setMessage(
        'Lauf abgebrochen. Noch laufende API-Anfragen können Kosten verursachen; ihre Ergebnisse werden nicht mehr gespeichert. Bereits vorhandene Vorschläge bleiben erhalten.',
      );
      await refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Abbruch fehlgeschlagen.',
      );
    } finally {
      setStarting(false);
    }
  }

  const active = Boolean(
    data?.runs.some((run) =>
      run.jobs.some(
        (job) => job.status === 'QUEUED' || job.status === 'RUNNING',
      ),
    ),
  );
  const groups = new Map<string, Proposal[]>();
  for (const proposal of data?.proposals ?? [])
    groups.set(proposal.settlementId, [
      ...(groups.get(proposal.settlementId) ?? []),
      proposal,
    ]);

  return (
    <div className='space-y-6 my-6'>
      <div>
        <h1 className='text-3xl font-semibold'>Recherche & Review</h1>
        <p className='mt-2'>
          Quellen finden, Angaben prüfen und einzeln freigeben. Erst deine
          Freigabe veröffentlicht einen Eintrag.
        </p>
      </div>
      {error && (
        <p role='alert' className='border-2 border-text p-3'>
          {error}
        </p>
      )}
      {message && (
        <p role='status' className='border border-text p-3'>
          {message}
        </p>
      )}
      {loading && <p role='status'>Recherche wird geladen …</p>}
      {data && (
        <>
          <ResearchSelection
            data={data}
            search={search}
            selected={selected}
            active={active}
            starting={starting}
            setSearch={setSearch}
            setSelected={setSelected}
            start={start}
          />
          <ResearchRunHistory
            runs={data.runs}
            starting={starting}
            cancel={cancel}
          />
          <div className='flex flex-wrap gap-3 items-center'>
            <h2 className='text-2xl font-semibold'>Vorschläge</h2>
            <label>
              <span className='sr-only'>Reviewstatus</span>
              <select
                className='border border-text bg-bg p-2'
                value={filter}
                onChange={(event) => setFilter(event.target.value as Status)}
              >
                {(['PENDING', 'APPLIED', 'REJECTED', 'STALE'] as const).map(
                  (status) => (
                    <option key={status} value={status}>
                      {labels[status]}
                    </option>
                  ),
                )}
              </select>
            </label>
            <Button ghost onClick={refresh}>
              Aktualisieren
            </Button>
          </div>
          {!data.proposals.length && <p>Keine Vorschläge mit diesem Status.</p>}
          {data.proposals.length === 200 && (
            <p>Es werden die letzten 200 Vorschläge angezeigt.</p>
          )}
          {[...groups.entries()].map(([settlementId, proposals]) => (
            <section key={settlementId} className='space-y-4'>
              <h3 className='text-xl font-semibold'>
                {proposals[0].settlement.name}
              </h3>
              {proposals.map((proposal) => (
                <ProposalCard
                  key={`${proposal.id}-${proposal.revision}`}
                  proposal={proposal}
                  detailTypes={data.detailTypes}
                  resourceTypes={data.resourceTypes}
                  onRefresh={refresh}
                  onReviewed={setMessage}
                />
              ))}
            </section>
          ))}
        </>
      )}
    </div>
  );
}
