'use client';

import { Box } from '@/components/common/Box';
import { Button } from '@/components/common/form/Button';
import { inputClass } from './shared';
import type { Dashboard } from './shared';

export function ResearchSelection({
  data,
  search,
  selected,
  active,
  starting,
  setSearch,
  setSelected,
  start,
}: {
  data: Dashboard;
  search: string;
  selected: string[];
  active: boolean;
  starting: boolean;
  setSearch: (search: string) => void;
  setSelected: (ids: string[]) => void;
  start: () => Promise<void>;
}) {
  return (
    <Box className='gap-3'>
      <h2 className='text-xl font-semibold'>Recherche starten</h2>
      {!data.configured && (
        <p>
          Die Webrecherche ist noch nicht eingerichtet: OPENAI_API_KEY auf dem
          Server und beim Worker hinterlegen.
        </p>
      )}
      <p role='status'>
        Worker: {data.workerOnline ? 'bereit' : 'nicht erreichbar'} ·{' '}
        {data.pendingCount} offene Vorschläge
      </p>
      {!data.workerOnline && (
        <p>
          Zum Verarbeiten muss der Rechercheworker laufen. Vorgemerkte Aufträge
          bleiben gespeichert, bis er verfügbar ist.
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
                disabled={!selected.includes(item.id) && selected.length >= 5}
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
                <small className='block'>{item._count.details} Details</small>
              </span>
            </label>
          ))}
      </fieldset>
      <p className='text-sm'>
        Pro Siedlung höchstens acht Vorschläge, sechs Quellenabrufe und zwei
        KI-Anfragen. Die Recherche verursacht API-Kosten. Im Pilot werden HTML-
        und Textquellen ausgewertet.
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
          {active ? 'Recherche läuft bereits' : 'Recherche für Auswahl starten'}
        </Button>
      </div>
    </Box>
  );
}
