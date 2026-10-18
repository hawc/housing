import { act, PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import Updates from '../page';
import { getUpdates } from '../utils/getUpdates';

jest.mock('../utils/getUpdates', () => ({ getUpdates: jest.fn() }));
jest.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: PropsWithChildren) => <main>{children}</main>,
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

it('renders current section labels and generic legacy entries on the existing feed', async () => {
  (getUpdates as jest.Mock).mockResolvedValue([
    [
      '2026-10-18',
      [
        {
          id: 's',
          name: 'Siedlung',
          slug: 's',
          type: 'settlement',
          location: { city: 'Hamburg' },
          changeType: 'updated',
          sections: ['Details', 'Fotos'],
        },
        {
          id: 'a',
          name: 'Architektin',
          slug: 'a',
          type: 'architect',
          changeType: 'created',
          sections: [],
        },
      ],
    ],
  ]);
  const container = document.createElement('div');
  const root = createRoot(container);
  try {
    await act(async () => root.render(await Updates()));
    expect(container.textContent).toContain('aktualisiert · Details, Fotos');
    expect(container.textContent).toContain('neu hinzugefügt');
    expect(container.textContent).toContain('18. Oktober 2026');
    expect(container.querySelector('a[href="/siedlungen/s"]')).not.toBeNull();
    expect(container.querySelector('a[href="/architekten/a"]')).not.toBeNull();
  } finally {
    await act(async () => root.unmount());
  }
});
