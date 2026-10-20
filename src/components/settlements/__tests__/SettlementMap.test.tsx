import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { SettlementMap } from '../SettlementMap';

jest.mock('next/dynamic', () => {
  const { useState } = jest.requireActual<typeof import('react')>('react');
  return () =>
    function MockMap({ center }: { center: { lat: number; lng: number } }) {
      const [zoom, setZoom] = useState(1);
      return (
        <button onClick={() => setZoom(zoom + 1)}>
          {center.lat}, {center.lng}, zoom {zoom}
        </button>
      );
    };
});

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

it('preserves map interaction state when its parent updates the location', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  try {
    await act(async () => {
      root.render(<SettlementMap markers={[]} center={{ lat: 53, lng: 10 }} />);
    });
    await act(async () => container.querySelector('button')!.click());
    expect(container.textContent).toContain('zoom 2');

    await act(async () => {
      root.render(<SettlementMap markers={[]} center={{ lat: 52, lng: 13 }} />);
    });
    expect(container.textContent).toBe('52, 13, zoom 2');
  } finally {
    await act(async () => root.unmount());
  }
});
