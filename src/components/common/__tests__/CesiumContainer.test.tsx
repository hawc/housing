import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CesiumContainer } from '../CesiumContainer';
import { CesiumMapController } from '../CesiumMapController';
import { SettingsContext } from '@/lib/settingsContext';
import type { CesiumType } from '@/types/cesium';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function event() {
  const listeners = new Set<(...args: unknown[]) => void>();
  return {
    addEventListener: jest.fn((listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }),
    raise: (...args: unknown[]) =>
      [...listeners].forEach((listener) => listener(...args)),
    listeners,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((accept, fail) => {
    resolve = accept;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function fixture() {
  let destroyed = false;
  let tilesDestroyed = false;
  const initialTilesLoaded = event();
  const allTilesLoaded = event();
  const tileFailed = event();
  const tick = event();
  const tileset = {
    initialTilesLoaded,
    allTilesLoaded,
    tileFailed,
    getHeight: jest.fn(),
    destroy: jest.fn(() => {
      tilesDestroyed = true;
    }),
    isDestroyed: () => tilesDestroyed,
  };
  const ground = { x: 10, y: 53, z: 30 };
  const camera = {
    position: { x: 866, y: 0, z: 500 },
    positionWC: { x: 10, y: 53, z: 1000 },
    positionCartographic: { longitude: 0.1, latitude: 0.9, height: 1000 },
    heading: 0.4,
    pitch: -0.5,
    direction: { x: -0.866, y: 0, z: -0.5 },
    up: { x: -0.5, y: 0, z: 0.866 },
    right: { x: 0, y: 1, z: 0 },
    lookAt: jest.fn(),
    rotate: jest.fn(),
    zoomIn: jest.fn(),
    worldToCameraCoordinatesPoint: jest.fn((point) => point),
  };
  const scene = {
    canvas: document.createElement('canvas'),
    screenSpaceCameraController: {},
    primitives: { add: jest.fn() },
    clampToHeightSupported: true,
    clampToHeight: jest.fn(() => ground),
    pickPositionSupported: true,
    pickPosition: jest.fn(),
    requestRender: jest.fn(),
    postUpdate: event(),
  };
  const viewer = {
    camera,
    scene,
    clock: { onTick: tick },
    useDefaultRenderLoop: true,
    screenSpaceEventHandler: { setInputAction: jest.fn() },
    destroy: jest.fn(() => {
      destroyed = true;
    }),
    isDestroyed: () => destroyed,
  };
  const request = deferred<typeof tileset>();
  const sdk = {
    Viewer: jest.fn((...args: [HTMLElement, unknown]) => {
      args[0].append(scene.canvas);
      return viewer;
    }),
    Cartesian3: {
      clone: (value, result = {}) => Object.assign(result, value),
      UNIT_Z: { x: 0, y: 0, z: 1 },
      fromDegrees: jest.fn((lng, lat) => ({ x: lng, y: lat, z: 0 })),
      fromElements: jest.fn((x, y, z) => ({ x, y, z })),
      fromRadians: jest.fn((longitude, latitude, height) => ({
        x: longitude,
        y: latitude,
        z: height,
      })),
      magnitude: (p: { x: number; y: number; z: number }) =>
        Math.hypot(p.x, p.y, p.z),
      distance: jest.fn(() => 600),
    },
    Cartographic: { clone: (value) => ({ ...value }) },
    HeadingPitchRange: jest.fn((heading, pitch, range) => ({
      heading,
      pitch,
      range,
    })),
    Math: { PI_OVER_TWO: Math.PI / 2, PI_OVER_SIX: Math.PI / 6 },
    ScreenSpaceEventType: { LEFT_DOUBLE_CLICK: 'double-click' },
    Cesium3DTileset: { fromIonAssetId: jest.fn(() => request.promise) },
  };
  return { sdk, viewer, camera, scene, tick, tileset, request, ground };
}

describe('interactive 3D settlement map', () => {
  let container: HTMLDivElement;
  let root: Root;
  let f: ReturnType<typeof fixture>;
  let now: number;
  let visibility: (entries: { isIntersecting: boolean }[]) => void;
  let disconnect: jest.Mock;
  let setLoading: jest.Mock;
  const originalObserver = global.IntersectionObserver;

  beforeEach(() => {
    now = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => now);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    disconnect = jest.fn();
    global.IntersectionObserver = jest.fn((callback) => {
      visibility = callback;
      return { observe: jest.fn(), disconnect };
    }) as unknown as typeof IntersectionObserver;
    f = fixture();
    setLoading = jest.fn();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    global.IntersectionObserver = originalObserver;
    jest.restoreAllMocks();
  });
  const render = async () => {
    await act(async () =>
      root.render(
        <SettingsContext.Provider
          value={{
            enable3D: true,
            setEnable3D: jest.fn(),
            is3DLoading: true,
            setIs3DLoading: setLoading,
          }}
        >
          <CesiumContainer
            CesiumJs={f.sdk as unknown as CesiumType}
            position={{ lat: 53, lng: 10 }}
          />
        </SettingsContext.Provider>,
      ),
    );
  };
  const load = async () => {
    await render();
    await act(async () => f.request.resolve(f.tileset));
    await act(async () => f.tileset.initialTilesLoaded.raise());
  };
  const click = async (label: string) => {
    const button = [...container.querySelectorAll('button')].find(
      (button) =>
        button.getAttribute('aria-label') === label ||
        button.textContent === label,
    )!;
    await act(async () => button.click());
  };
  const frame = (milliseconds = 33) => {
    now += milliseconds;
    f.tick.raise();
    f.scene.postUpdate.raise();
  };

  it('makes controller cleanup idempotent and ignores controls after destruction', async () => {
    const onReady = jest.fn();
    const onError = jest.fn();
    const controller = new CesiumMapController(
      f.sdk as unknown as CesiumType,
      container,
      { lat: 53, lng: 10 },
      false,
      { onReady, onError },
    );
    await f.request.resolve(f.tileset);
    f.tileset.initialTilesLoaded.raise();
    f.tileset.initialTilesLoaded.raise();
    expect(onReady).toHaveBeenCalledTimes(1);
    controller.destroy();
    controller.destroy();
    f.camera.lookAt.mockClear();
    controller.reset();
    controller.zoom(0.8);
    controller.setRotating(true);
    frame();
    expect(f.camera.lookAt).not.toHaveBeenCalled();
    expect(f.camera.zoomIn).not.toHaveBeenCalled();
    expect(f.camera.rotate).not.toHaveBeenCalled();
    expect(f.viewer.destroy).toHaveBeenCalledTimes(1);
    expect(f.tileset.destroy).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it('releases a partially initialized controller and reports initialization errors once', () => {
    const error = new Error('invalid coordinates');
    f.sdk.Cartesian3.fromDegrees.mockImplementationOnce(() => {
      throw error;
    });
    const onError = jest.fn();
    const controller = new CesiumMapController(
      f.sdk as unknown as CesiumType,
      container,
      { lat: 53, lng: 10 },
      true,
      { onReady: jest.fn(), onError },
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(error);
    expect(f.viewer.destroy).toHaveBeenCalledTimes(1);
    expect(f.sdk.Cesium3DTileset.fromIonAssetId).not.toHaveBeenCalled();
    controller.destroy();
    expect(f.viewer.destroy).toHaveBeenCalledTimes(1);
  });

  it('keeps the current zoom and tilt during orbit and samples ground only once', async () => {
    await load();
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(f.sdk.Viewer.mock.calls[0][1]).toMatchObject({
      requestRenderMode: true,
      targetFrameRate: 30,
      scene3DOnly: true,
    });
    f.camera.lookAt.mockClear();
    f.camera.position = { x: 200, y: 100, z: 60 };
    f.camera.pitch = -0.7;
    for (let i = 0; i < 10; i++) frame();
    expect(f.camera.rotate).toHaveBeenCalledTimes(10);
    expect(f.camera.lookAt).not.toHaveBeenCalled();
    expect(f.scene.clampToHeight).toHaveBeenCalledTimes(1);
    expect(f.camera.pitch).toBe(-0.7);
    await click('Vergrößern');
    const range = Math.hypot(200, 100, 60);
    expect(f.camera.zoomIn).toHaveBeenLastCalledWith(
      expect.closeTo(range * 0.2),
    );
    frame();
    expect(f.camera.lookAt).not.toHaveBeenCalled();
  });

  it('rotates at the same speed at different frame rates and avoids a jump after a long gap', async () => {
    await load();
    frame(20);
    frame(40);
    const angles = f.camera.rotate.mock.calls.map((call) => call[1]);
    expect(angles[1]).toBeCloseTo(angles[0] * 2);
    frame(10000);
    expect(f.camera.rotate.mock.calls[2][1]).toBeLessThan(0.01);
  });

  it('stops at a roof or tree without relocating or turning the camera', async () => {
    f.tileset.getHeight.mockImplementation((location) =>
      location.longitude === 0.2 ? 200 : 0,
    );
    await load();
    await click('Rundflug pausieren');
    const position = { ...f.camera.position };
    const direction = { ...f.camera.direction };
    f.camera.position = { x: 180, y: 40, z: 120 };
    f.camera.direction = { x: 1, y: 0, z: 0 };
    f.camera.positionCartographic.longitude = 0.2;
    f.camera.positionCartographic.height = 100;
    f.camera.lookAt.mockClear();
    frame();
    expect(f.camera.position).toEqual(position);
    expect(f.camera.direction).toEqual(direction);
    expect(f.camera.lookAt).toHaveBeenLastCalledWith(f.ground, position);
    expect(f.sdk.Cartesian3.fromRadians).not.toHaveBeenCalled();
    expect(f.camera.rotate).not.toHaveBeenCalled();
  });

  it('prevents dragging below the orbit surface when no terrain height is available', async () => {
    await load();
    const position = { ...f.camera.position };
    f.scene.canvas.dispatchEvent(new Event('pointerdown'));
    f.camera.position = { x: 500, y: 0, z: -100 };
    frame();
    expect(f.camera.rotate).not.toHaveBeenCalled();
    expect(f.camera.position).toEqual(position);
    expect(f.camera.lookAt).toHaveBeenLastCalledWith(f.ground, position);
    expect(f.sdk.Cartesian3.fromElements).not.toHaveBeenCalled();
    expect(f.scene.screenSpaceCameraController).toMatchObject({
      enableCollisionDetection: false,
      inertiaSpin: 0,
      inertiaZoom: 0,
      maximumTiltAngle: expect.any(Number),
    });
  });

  it('recovers gradually when new tiles cover the current view and caches stationary samples', async () => {
    f.tileset.getHeight.mockReturnValue(100);
    await load();
    f.camera.positionCartographic.height = 300;
    frame();
    frame();
    expect(f.tileset.getHeight).toHaveBeenCalledTimes(1);
    f.tileset.getHeight.mockReturnValue(400);
    f.tileset.allTilesLoaded.raise();
    frame();
    const height = f.sdk.Cartesian3.fromRadians.mock.calls.at(-1)![2];
    expect(height).toBeGreaterThan(300);
    expect(height).toBeLessThanOrEqual(303);
    expect(height).not.toBe(410);
    f.camera.positionCartographic.height = height;
    frame();
    const nextHeight = f.sdk.Cartesian3.fromRadians.mock.calls.at(-1)![2];
    expect(nextHeight).toBeGreaterThan(height);
    expect(nextHeight - height).toBeLessThanOrEqual(3);
  });

  it.each([20, 6000])(
    'keeps native zoom within bounds without jumping when the range reaches %i',
    async (range) => {
      await load();
      const position = { ...f.camera.position };
      f.camera.position = { x: range * 0.866, y: 0, z: range * 0.5 };
      frame();
      expect(f.camera.position).toEqual(position);
      expect(f.sdk.Cartesian3.fromRadians).not.toHaveBeenCalled();
    },
  );

  it('orbits a double-clicked area at a closer distance and can reset to the settlement', async () => {
    await load();
    const point = { x: 12, y: 54, z: 20 };
    f.scene.pickPosition.mockReturnValue(point);
    const focus =
      f.viewer.screenSpaceEventHandler.setInputAction.mock.calls[0][0];
    focus({ position: { x: 200, y: 150 } });
    expect(f.camera.lookAt).toHaveBeenLastCalledWith(point, {
      heading: 0.4,
      pitch: -0.5,
      range: 420,
    });
    f.camera.lookAt.mockClear();
    frame();
    expect(f.camera.rotate).toHaveBeenCalled();
    expect(f.camera.lookAt).not.toHaveBeenCalled();
    f.scene.pickPosition.mockReturnValue(undefined);
    focus({ position: { x: 0, y: 0 } });
    expect(f.camera.lookAt).not.toHaveBeenCalled();
    await click('Siedlung zentrieren');
    expect(f.camera.lookAt).toHaveBeenLastCalledWith(
      f.ground,
      expect.objectContaining({ range: 1000 }),
    );
  });

  it('pauses while dragging or zooming and supports an explicit pause', async () => {
    await load();
    f.scene.canvas.dispatchEvent(new Event('pointerdown'));
    frame();
    expect(f.camera.rotate).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('pointerup'));
    frame(300);
    expect(f.camera.rotate).toHaveBeenCalledTimes(1);
    f.scene.canvas.dispatchEvent(new Event('wheel'));
    frame();
    expect(f.camera.rotate).toHaveBeenCalledTimes(1);
    frame(300);
    expect(f.camera.rotate).toHaveBeenCalledTimes(2);
    await click('Rundflug pausieren');
    frame();
    expect(f.camera.rotate).toHaveBeenCalledTimes(2);
    await click('Rundflug fortsetzen');
    frame();
    expect(f.camera.rotate).toHaveBeenCalledTimes(3);
  });

  it('stops rendering off-screen or in a hidden tab and releases resources on close', async () => {
    await load();
    visibility([{ isIntersecting: false }]);
    expect(f.viewer.useDefaultRenderLoop).toBe(false);
    frame();
    expect(f.camera.rotate).not.toHaveBeenCalled();
    visibility([{ isIntersecting: true }]);
    expect(f.viewer.useDefaultRenderLoop).toBe(true);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(f.viewer.useDefaultRenderLoop).toBe(false);
    await act(async () => root.render(null));
    expect(f.viewer.destroy).toHaveBeenCalledTimes(1);
    expect(f.tileset.destroy).toHaveBeenCalledTimes(1);
    expect(f.tick.listeners.size).toBe(0);
    expect(f.scene.postUpdate.listeners.size).toBe(0);
    expect(f.tileset.allTilesLoaded.listeners.size).toBe(0);
    expect(f.tileset.initialTilesLoaded.listeners.size).toBe(0);
    expect(f.tileset.tileFailed.listeners.size).toBe(0);
    expect(disconnect).toHaveBeenCalled();
  });

  it('destroys a tileset that finishes loading after the map was closed', async () => {
    await render();
    await act(async () => root.render(null));
    await act(async () => f.request.resolve(f.tileset));
    expect(f.tileset.destroy).toHaveBeenCalledTimes(1);
    expect(f.scene.primitives.add).not.toHaveBeenCalled();
    expect(f.viewer.destroy).toHaveBeenCalledTimes(1);
  });

  it('shows an actionable error and cleans up if metadata or initial tiles fail', async () => {
    await render();
    await act(async () => f.request.reject(new Error('network failure')));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'erneut',
    );
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(f.viewer.destroy).toHaveBeenCalledTimes(1);
  });

  it('stops waiting if the initial tile download fails', async () => {
    await render();
    await act(async () => f.request.resolve(f.tileset));
    await act(async () =>
      f.tileset.tileFailed.raise({ message: 'unavailable' }),
    );
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(f.viewer.destroy).toHaveBeenCalledTimes(1);
  });

  it('respects reduced motion and keeps zoom within useful bounds', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn(() => ({ matches: true })),
    });
    try {
      await load();
      frame();
      expect(f.camera.rotate).not.toHaveBeenCalled();
      expect(container.textContent).toContain('Rundflug fortsetzen');
      f.camera.position = { x: 80, y: 0, z: 0 };
      await click('Vergrößern');
      expect(f.camera.zoomIn).toHaveBeenLastCalledWith(0);
      f.camera.position = { x: 5000, y: 0, z: 0 };
      await click('Verkleinern');
      expect(f.camera.zoomIn).toHaveBeenLastCalledWith(0);
    } finally {
      Reflect.deleteProperty(window, 'matchMedia');
    }
  });
});
