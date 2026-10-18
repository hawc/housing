'use client';

import { Box } from '@/components/common/Box';
import { Button } from '@/components/common/form/Button';
import { date, labels } from './shared';
import type { Dashboard } from './shared';

export function ResearchRunHistory({
  runs,
  starting,
  cancel,
}: {
  runs: Dashboard['runs'];
  starting: boolean;
  cancel: (runId: string) => Promise<void>;
}) {
  if (!runs.length) return null;
  return (
    <Box className='gap-3'>
      <h2 className='text-xl font-semibold'>Letzte Rechercheläufe</h2>
      {runs.map((run) => (
        <details key={run.id} className='border-t border-text pt-2'>
          <summary className='cursor-pointer'>
            {date(run.createdAt)} · {run.jobs.length} Siedlungen ·{' '}
            {run.jobs.filter((job) => job.status === 'COMPLETED').length}{' '}
            abgeschlossen
            {run.jobs.some((job) => job.status === 'FAILED')
              ? ' · mit Fehlern'
              : ''}
          </summary>
          {run.jobs.some(
            (job) => job.status === 'QUEUED' || job.status === 'RUNNING',
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
                <strong>{job.settlement.name}</strong>: {labels[job.status]} ·{' '}
                {job._count.proposals} neue Vorschläge
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
  );
}
