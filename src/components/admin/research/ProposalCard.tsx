'use client';

import Link from 'next/link';
import { useState } from 'react';
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

import { api, date, inputClass, labels } from './shared';
import type { Proposal } from './shared';

export function ProposalCard({
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
