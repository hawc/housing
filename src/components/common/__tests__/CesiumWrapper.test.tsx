import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CesiumWrapper } from '../CesiumWrapper';
import { SettlementMeta } from '@/components/settlements/SettlementsMeta';
import { SettingsProvider } from '@/lib/settingsContext';

const mockMount = jest.fn();
const mockDestroy = jest.fn();
jest.mock('cesium', () => ({ Ion: { defaultAccessToken: '' } }));
jest.mock('next/dynamic', () => {
  const { useEffect } = jest.requireActual<typeof import('react')>('react');
  return () =>
    function MockCesiumContainer() {
      useEffect(() => {
        mockMount();
        return () => mockDestroy();
      }, []);
      return <p>3D map</p>;
    };
});
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('opening and closing the 3D map', () => {
  let container: HTMLDivElement;
  let root: Root;
  const button = () => container.querySelector('button')!;
  const render = async (lat = 53) => {
    await act(async () =>
      root.render(
        <SettingsProvider>
          <SettlementMeta location={null} />
          <CesiumWrapper position={{ lat, lng: 10 }} />
        </SettingsProvider>,
      ),
    );
  };
  beforeEach(() => {
    mockMount.mockClear();
    mockDestroy.mockClear();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('loads only when opened and unmounts the viewer when closed', async () => {
    await render();
    expect(mockMount).not.toHaveBeenCalled();
    await act(async () => button().click());
    expect(mockMount).toHaveBeenCalledTimes(1);
    await act(async () => button().click());
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain('3D map');
    await act(async () => button().click());
    expect(mockMount).toHaveBeenCalledTimes(2);
  });

  it('allows closing while the SDK loads and ignores its late result', async () => {
    await render();
    act(() => button().click());
    expect(button().textContent).toContain('schließen');
    expect(button()).not.toBeDisabled();
    act(() => button().click());
    await act(async () => {});
    expect(mockMount).not.toHaveBeenCalled();
    expect(button().textContent).toContain('öffnen');
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it('creates a fresh viewer when navigating to a different settlement', async () => {
    await render();
    await act(async () => button().click());
    await render(52);
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockMount).toHaveBeenCalledTimes(2);
  });
});
