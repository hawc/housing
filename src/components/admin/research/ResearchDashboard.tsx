'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { getResearchDashboard } from '@/lib/research/service';
import {
  resolveProposalDraft,
  detailValuesFromDraft,
  resourceValuesFromDraft,
} from '@/lib/research/proposalDraft';
import type {
  ProposalDraft,
  ResolvedProposalDraft,
} from '@/lib/research/proposalDraft';
import type { TypeOption } from '@/lib/settlementFormFields';
import { dateInputValue, requiresDetailDate } from '@/lib/settlementFormFields';
import { detailDateFromDraft } from '@/lib/research/proposalDraft';
import {
  DetailFields,
  ResourceFields,
} from '@/components/admin/settlements/forms/RecordFields';
import { ProposalComparison } from './ProposalComparison';
import { ReviewHints } from './ReviewHints';
import { detailValueError } from '@/lib/detailValue';
import { detailScopeError } from '@/lib/detailScope';
import { Button } from '@/components/common/form/Button';
import { Box } from '@/components/common/Box';

type Dashboard = Awaited<ReturnType<typeof getResearchDashboard>>;
type Proposal = Dashboard['proposals'][number];
type Status = 'PENDING' | 'APPLIED' | 'REJECTED' | 'STALE';
const labels: Record<string, string> = {
  PENDING: 'Offen',
  APPLIED: 'Übernommen',
  REJECTED: 'Abgelehnt',
  STALE: 'Erneut recherchieren',
  QUEUED: 'Wartet',
  RUNNING: 'Recherchiert',
  COMPLETED: 'Abgeschlossen',
  FAILED: 'Fehlgeschlagen',
};
const inputClass = 'w-full border border-text bg-bg p-2 mt-1';
const date = (value: unknown) =>
  new Date(String(value)).toLocaleString('de-DE');

async function api<T>(path: string, body?: unknown): Promise<T> {
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

function ProposalCard({
  proposal,
  detailTypes,
  resourceTypes,
  onRefresh,
  onReviewed,
}: {
  proposal: Proposal;
  detailTypes: TypeOption[];
  resourceTypes: TypeOption[];
  onRefresh: () => Promise<void>;
  onReviewed: (message: string) => void;
}) {
  const original = proposal.payload as unknown as ProposalDraft;
  const approved = (
    proposal.changeLog?.after as unknown as
      | {
          approvedDraft?: ProposalDraft;
          record?: { detailDate?: string | null };
        }
      | undefined
  )?.approvedDraft;
  const logRecord = (
    proposal.changeLog?.after as
      | { record?: { detailDate?: string | null; source?: string | null } }
      | undefined
  )?.record;
  const savedDetailDate =
    proposal.status === 'APPLIED' && logRecord
      ? dateInputValue(logRecord.detailDate)
      : undefined;
  const [draft, setDraft] = useState<ResolvedProposalDraft>(() =>
    resolveProposalDraft(
      approved
        ? {
            ...approved,
            source: approved.source ?? logRecord?.source ?? undefined,
          }
        : proposal.kind === 'RESOURCE' &&
            original.source === proposal.source.title &&
            /^(website|webseite)\b/i.test(
              resourceTypes.find((type) => type.id === original.typeId)?.name ??
                '',
            )
          ? { ...original, source: '' }
          : original,
      proposal.kind,
      proposal.source,
    ),
  );
  const typeName =
    (proposal.kind === 'DETAIL' ? detailTypes : resourceTypes).find(
      (type) => type.id === draft.typeId,
    )?.name ?? 'Typ nicht mehr verfügbar';
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const pending = proposal.status === 'PENDING';
  const resource = proposal.kind === 'RESOURCE';

  async function review(action: 'approve' | 'reject') {
    setSaving(true);
    setError('');
    try {
      const result = await api<{ status: string }>(
        `/api/research/proposals/${proposal.id}`,
        { action, revision: proposal.revision, draft, note },
      );
      onReviewed(
        result.status === 'STALE'
          ? 'Die Daten wurden inzwischen geändert. Es wurde nichts übernommen. Bitte die Siedlung erneut recherchieren.'
          : result.status === 'APPLIED'
            ? 'Der freigegebene Eintrag wurde übernommen und protokolliert.'
            : 'Vorschlag abgelehnt.',
      );
      await onRefresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Review fehlgeschlagen.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box className='gap-4'>
      <div className='flex flex-wrap justify-between gap-2'>
        <div>
          <span className='font-semibold'>
            {resource ? `Quellenlink · ${typeName}` : typeName}
          </span>{' '}
          · <span>{labels[proposal.status]}</span>
        </div>
        <Link
          className='underline'
          href={`/admin/siedlungen/${proposal.settlement.slug}`}
        >
          Siedlung bearbeiten ↗
        </Link>
      </div>
      <section aria-label='Neuen Eintrag prüfen' className='space-y-3'>
        <h4 className='font-semibold'>Neuen Eintrag prüfen</h4>
        <p className='text-sm'>
          Siedlung: {proposal.settlement.name} · Veröffentlichung nach Freigabe:
          veröffentlicht
        </p>
        {resource ? (
          <ResourceFields
            value={resourceValuesFromDraft(draft)}
            types={resourceTypes}
            disabled={!pending || saving}
            lockedFields={['resourceTypeId', 'url']}
            onChange={(value) =>
              setDraft({
                ...draft,
                typeId: value.resourceTypeId,
                name: value.name,
                value: value.description,
                source: value.source,
                url: value.url,
                license: value.license,
                copyright: value.copyright,
              })
            }
          />
        ) : (
          <>
            <DetailFields
              value={detailValuesFromDraft(draft, false, savedDetailDate)}
              types={detailTypes}
              disabled={!pending || saving}
              lockedFields={['detailTypeId']}
              onChange={(value) => {
                const dateChanged =
                  value.detailDate !== detailValuesFromDraft(draft).detailDate;
                setDraft({
                  ...draft,
                  typeId: value.detailTypeId,
                  name: value.name,
                  value: value.description,
                  annotation: value.annotation,
                  detailDate: dateChanged
                    ? value.detailDate || null
                    : draft.detailDate,
                  source: value.source,
                  referenceYear: dateChanged ? null : draft.referenceYear,
                });
              }}
            />
            <label className='block'>
              Bezugsjahr (nur Jahresangabe)
              <input
                type='number'
                className={inputClass}
                min={1800}
                max={new Date().getUTCFullYear()}
                value={draft.referenceYear ?? ''}
                disabled={!pending || saving}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    referenceYear:
                      event.target.value === ''
                        ? null
                        : Number(event.target.value),
                    detailDate: event.target.value ? null : draft.detailDate,
                  })
                }
              />
            </label>
            <p className='text-sm'>
              Bei einer reinen Jahresangabe wird der 31.12. des Jahres als Datum
              gespeichert und die Jahresangabe in der Anmerkung gekennzeichnet.
              Ein genau belegter Stichtag bleibt unverändert. Statistische
              Angaben brauchen ein Bezugsdatum oder Bezugsjahr.
            </p>
          </>
        )}
        <p className='text-sm'>
          Der Typ{resource ? ' und die URL sind' : ' ist'} an den
          Recherchevorschlag gebunden. Die übrigen Angaben kannst du vor der
          Freigabe bearbeiten. Leere Felder werden ebenfalls im Vergleich
          angezeigt.
        </p>
      </section>
      <ProposalComparison
        kind={proposal.kind}
        baseline={proposal.baseline}
        draft={draft}
        detailTypes={detailTypes}
        resourceTypes={resourceTypes}
        savedDetailDate={savedDetailDate}
      />
      <ReviewHints
        kind={proposal.kind}
        typeName={typeName}
        draft={draft}
        baseline={proposal.baseline}
        evidence={proposal.evidence}
        savedDetailDate={savedDetailDate}
      />
      <aside
        aria-label='Recherchebelege'
        className='border-l-2 border-text pl-3 space-y-2'
      >
        <h4 className='font-semibold'>Recherchebelege</h4>
        <p className='text-sm'>
          Unveränderter Beleg zur Recherche, unabhängig von deinen Eingaben für
          den neuen Eintrag.
        </p>
        <blockquote>„{proposal.evidence}“</blockquote>
        <p className='text-sm'>{proposal.locator}</p>
        <a
          className='underline break-words'
          href={proposal.source.url}
          target='_blank'
          rel='noopener noreferrer'
        >
          {proposal.source.title} ↗
        </a>
        <p className='text-sm break-all'>{proposal.source.url}</p>
        <p className='text-sm'>
          Abgerufen: {date(proposal.source.retrievedAt)}
        </p>
      </aside>
      {proposal.warnings && (
        <p className='border border-text p-2'>
          <strong>Zu prüfen:</strong> {proposal.warnings}
        </p>
      )}
      {pending && (
        <>
          <label>
            Reviewnotiz (bei Ablehnung erforderlich)
            <textarea
              className={inputClass}
              maxLength={1000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={saving}
            />
          </label>
          <p className='text-sm'>
            Die Freigabe veröffentlicht diesen{' '}
            {resource ? 'Quellenlink' : 'Detaileintrag'} mit den oben
            angezeigten Werten. Prüfe die Quelle auch bei bearbeiteten Werten.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Button
              disabled={
                saving ||
                !draft.name.trim() ||
                (!resource &&
                  (!draft.value.trim() ||
                    Boolean(detailValueError(typeName, draft.value)) ||
                    Boolean(detailScopeError(typeName, draft.annotation)) ||
                    (requiresDetailDate(typeName) &&
                      !detailDateFromDraft(draft))))
              }
              loading={saving}
              onClick={() => review('approve')}
            >
              Freigeben & übernehmen
            </Button>
            <Button
              ghost
              disabled={saving || !note.trim()}
              onClick={() => review('reject')}
            >
              Ablehnen
            </Button>
          </div>
        </>
      )}
      {proposal.reviewedAt && (
        <p className='text-sm'>
          Entschieden am {date(proposal.reviewedAt)} von {proposal.reviewedBy}
          {proposal.reviewNote ? ` · ${proposal.reviewNote}` : ''}
          {proposal.changeLog ? ` · Protokoll ${proposal.changeLog.id}` : ''}
        </p>
      )}
      {proposal.status === 'STALE' && (
        <p>
          Die vorhandenen Daten haben sich seit der Recherche geändert. Starte
          für diese Siedlung einen neuen Lauf.
        </p>
      )}
      {error && <p role='alert'>{error}</p>}
    </Box>
  );
}

export function ResearchDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<Status>('PENDING');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setData(await api<Dashboard>(`/api/research?status=${filter}`));
      setError('');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Laden fehlgeschlagen.',
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

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
          <Box className='gap-3'>
            <h2 className='text-xl font-semibold'>Recherche starten</h2>
            {!data.configured && (
              <p>
                Die Webrecherche ist noch nicht eingerichtet: OPENAI_API_KEY auf
                dem Server und beim Worker hinterlegen.
              </p>
            )}
            <p role='status'>
              Worker: {data.workerOnline ? 'bereit' : 'nicht erreichbar'} ·{' '}
              {data.pendingCount} offene Vorschläge
            </p>
            {!data.workerOnline && (
              <p>
                Zum Verarbeiten muss der Rechercheworker laufen. Vorgemerkte
                Aufträge bleiben gespeichert, bis er verfügbar ist.
              </p>
            )}
            <label>
              Siedlungen suchen
              <input
                className={inputClass}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Name oder Stadt'
              />
            </label>
            <div className='flex flex-wrap gap-3 items-center'>
              <Button
                ghost
                disabled={active || starting || data.settlements.length < 1}
                onClick={() =>
                  setSelected(
                    [...data.settlements]
                      .sort((a, b) => a._count.details - b._count.details)
                      .slice(0, 5)
                      .map((item) => item.id),
                  )
                }
              >
                Bis zu fünf mit wenigen Details auswählen
              </Button>
              <span>{selected.length} von 1–5 ausgewählt</span>
            </div>
            <fieldset
              disabled={active || starting}
              className='max-h-64 overflow-y-auto border border-text p-2 grid gap-2 md:grid-cols-2'
            >
              <legend className='sr-only'>Siedlungen für die Recherche</legend>
              {data.settlements
                .filter((item) =>
                  `${item.name} ${item.location?.city ?? ''}`
                    .toLocaleLowerCase('de')
                    .includes(search.toLocaleLowerCase('de')),
                )
                .map((item) => (
                  <label key={item.id} className='flex items-start gap-2 p-1'>
                    <input
                      type='checkbox'
                      className='mt-1'
                      checked={selected.includes(item.id)}
                      disabled={
                        !selected.includes(item.id) && selected.length >= 5
                      }
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? [...selected, item.id]
                            : selected.filter((id) => id !== item.id),
                        )
                      }
                    />
                    <span>
                      {item.name}
                      {item.location?.city ? ` · ${item.location.city}` : ''}
                      <small className='block'>
                        {item._count.details} Details
                      </small>
                    </span>
                  </label>
                ))}
            </fieldset>
            <p className='text-sm'>
              Pro Siedlung höchstens acht Vorschläge, sechs Quellenabrufe und
              zwei KI-Anfragen. Die Recherche verursacht API-Kosten. Im Pilot
              werden HTML- und Textquellen ausgewertet.
            </p>
            <div>
              <Button
                loading={starting}
                disabled={
                  active ||
                  !data.configured ||
                  selected.length < 1 ||
                  selected.length > 5 ||
                  data.pendingCount >= 100
                }
                onClick={start}
              >
                {active
                  ? 'Recherche läuft bereits'
                  : 'Recherche für Auswahl starten'}
              </Button>
            </div>
          </Box>
          {data.runs.length > 0 && (
            <Box className='gap-3'>
              <h2 className='text-xl font-semibold'>Letzte Rechercheläufe</h2>
              {data.runs.map((run) => (
                <details key={run.id} className='border-t border-text pt-2'>
                  <summary className='cursor-pointer'>
                    {date(run.createdAt)} · {run.jobs.length} Siedlungen ·{' '}
                    {
                      run.jobs.filter((job) => job.status === 'COMPLETED')
                        .length
                    }{' '}
                    abgeschlossen
                    {run.jobs.some((job) => job.status === 'FAILED')
                      ? ' · mit Fehlern'
                      : ''}
                  </summary>
                  {run.jobs.some(
                    (job) =>
                      job.status === 'QUEUED' || job.status === 'RUNNING',
                  ) && (
                    <Button
                      ghost
                      className='my-2'
                      disabled={starting}
                      onClick={() => cancel(run.id)}
                    >
                      Lauf abbrechen
                    </Button>
                  )}
                  <ul className='mt-2 space-y-2'>
                    {run.jobs.map((job) => (
                      <li key={job.id}>
                        <strong>{job.settlement.name}</strong>:{' '}
                        {labels[job.status]} · {job._count.proposals} neue
                        Vorschläge
                        {job.error && <p role='alert'>{job.error}</p>}
                        {job.notes && (
                          <details className='ml-3'>
                            <summary className='cursor-pointer'>
                              Recherchehinweise
                            </summary>
                            <p className='whitespace-pre-wrap break-words text-sm'>
                              {job.notes}
                            </p>
                          </details>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </Box>
          )}
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
