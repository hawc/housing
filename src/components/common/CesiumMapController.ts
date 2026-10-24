import type {
  Cartesian2,
  Cartesian3,
  Cartographic,
  Cesium3DTileset,
  Viewer,
} from 'cesium';
import type { Coordinates } from '@/components/settlements/Map';
import type { CesiumType } from '@/types/cesium';
import { logger } from '@/lib/logger';

const MIN_RANGE = 80;
const MAX_RANGE = 5000;
const INITIAL_RANGE = 1000;
const ORBIT_SPEED = Math.PI / 40;
const SURFACE_CLEARANCE = 10;
const MIN_ELEVATION = Math.PI / 36;
const RECOVERY_SPEED = 30;
const clampRange = (range: number) =>
  Math.min(MAX_RANGE, Math.max(MIN_RANGE, range));

interface Callbacks {
  onReady: () => void;
  onError: (error: unknown) => void;
}

interface CameraView {
  target: Cartesian3;
  position: Cartesian3;
  direction: Cartesian3;
  up: Cartesian3;
  right: Cartesian3;
  location: Cartographic;
}

/** Owns one settlement's viewer, camera, tileset, and event subscriptions. */
export class CesiumMapController {
  private viewer?: Viewer;
  private tileset?: Cesium3DTileset;
  private defaultTarget!: Cartesian3;
  private target!: Cartesian3;
  private disposed = false;
  private loaded = false;
  private visible = true;
  private lastFrame = performance.now();
  private interactionUntil = 0;
  private pointers = new Set<number>();
  private cleanups: (() => void)[] = [];
  private sampledLongitude = NaN;
  private sampledLatitude = NaN;
  private surfaceHeight?: number;
  private previousView?: CameraView;
  private lastSurfaceCheck = performance.now();

  constructor(
    private readonly CesiumJs: CesiumType,
    element: HTMLElement,
    position: Coordinates,
    private orbiting: boolean,
    private readonly callbacks: Callbacks,
  ) {
    try {
      this.createViewer(element);
      this.configureCamera(position);
      this.attachCameraEvents();
      this.attachPointerEvents();
      this.attachVisibilityEvents(element);
      void this.loadTileset().catch((error) => this.fail(error));
    } catch (error) {
      this.fail(error);
    }
  }

  reset(): void {
    if (!this.viewer || this.disposed) return;
    const { camera, scene } = this.viewer;
    this.target = this.defaultTarget;
    camera.lookAt(
      this.target,
      new this.CesiumJs.HeadingPitchRange(
        -this.CesiumJs.Math.PI_OVER_TWO,
        -this.CesiumJs.Math.PI_OVER_SIX,
        INITIAL_RANGE,
      ),
    );
    scene.requestRender();
  }

  zoom(factor: number): void {
    if (!this.viewer || this.disposed) return;
    const { camera, scene } = this.viewer;
    const range = this.CesiumJs.Cartesian3.magnitude(camera.position);
    camera.zoomIn(range - clampRange(range * factor));
    scene.requestRender();
  }

  setRotating(value: boolean): void {
    this.orbiting = value;
    this.lastFrame = performance.now();
  }

  destroy(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
    if (this.viewer && !this.viewer.isDestroyed()) this.viewer.destroy();
    if (this.tileset && !this.tileset.isDestroyed()) this.tileset.destroy();
  }

  private createViewer(element: HTMLElement): void {
    this.viewer = new this.CesiumJs.Viewer(element, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      globe: false,
      homeButton: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      timeline: false,
      creditContainer: 'credits',
      skyBox: false,
      infoBox: false,
      selectionIndicator: false,
      scene3DOnly: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      targetFrameRate: 30,
    });
  }

  private configureCamera(position: Coordinates): void {
    const { camera, scene } = this.viewer!;
    const controller = scene.screenSpaceCameraController;
    controller.minimumZoomDistance = MIN_RANGE;
    controller.maximumZoomDistance = MAX_RANGE;
    controller.enableLook = false;
    // Validate movement ourselves: Cesium's height projection can jump over roofs.
    controller.enableCollisionDetection = false;
    controller.inertiaSpin = 0;
    controller.inertiaZoom = 0;
    controller.inertiaTranslate = 0;
    controller.maximumTiltAngle = Math.PI / 2 - MIN_ELEVATION;
    camera.constrainedAxis = this.CesiumJs.Cartesian3.UNIT_Z;
    this.defaultTarget = this.CesiumJs.Cartesian3.fromDegrees(
      position.lng,
      position.lat,
    );
    this.reset();
  }

  private attachCameraEvents(): void {
    const viewer = this.viewer!;
    this.cleanups.push(
      viewer.scene.postUpdate.addEventListener(() => this.keepAboveSurface()),
      viewer.clock.onTick.addEventListener(() => this.updateOrbit()),
    );
    viewer.screenSpaceEventHandler.setInputAction(
      (event: { position: Cartesian2 }) => this.focusArea(event.position),
      this.CesiumJs.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );
  }

  private updateOrbit(): void {
    const now = performance.now();
    const elapsed = Math.min((now - this.lastFrame) / 1000, 0.1);
    this.lastFrame = now;
    if (
      !this.loaded ||
      this.disposed ||
      !this.orbiting ||
      !this.visible ||
      document.hidden ||
      this.pointers.size ||
      now < this.interactionUntil
    )
      return;
    const { camera, scene } = this.viewer!;
    // Rotate the current offset without overwriting the user's zoom or tilt.
    camera.rotate(this.CesiumJs.Cartesian3.UNIT_Z, ORBIT_SPEED * elapsed);
    scene.requestRender();
  }

  private focusArea(position: Cartesian2): void {
    if (!this.loaded || this.disposed) return;
    const { camera, scene } = this.viewer!;
    const point = scene.pickPositionSupported
      ? scene.pickPosition(position)
      : undefined;
    if (!point) return;
    const range = clampRange(
      this.CesiumJs.Cartesian3.distance(camera.positionWC, point) * 0.7,
    );
    this.target = point;
    camera.lookAt(
      this.target,
      new this.CesiumJs.HeadingPitchRange(camera.heading, camera.pitch, range),
    );
    scene.requestRender();
  }

  /** Run after input and orbit updates, before the scene is drawn. */
  private keepAboveSurface(): void {
    if (!this.loaded || this.disposed) return;
    const { camera, scene } = this.viewer!;
    const now = performance.now();
    const elapsed = Math.min((now - this.lastSurfaceCheck) / 1000, 0.1);
    this.lastSurfaceCheck = now;
    const range = this.CesiumJs.Cartesian3.magnitude(camera.position);
    const minimumHeight = Math.max(
      SURFACE_CLEARANCE,
      range * Math.sin(MIN_ELEVATION),
    );
    if (
      range < MIN_RANGE - 0.01 ||
      range > MAX_RANGE + 0.01 ||
      camera.position.z < minimumHeight - 0.01
    ) {
      if (this.previousView) this.restorePreviousView();
      else this.reset();
    }
    const location = camera.positionCartographic;
    if (
      location.longitude !== this.sampledLongitude ||
      location.latitude !== this.sampledLatitude
    ) {
      // CPU picking of loaded tiles; reuse the result while stationary.
      this.surfaceHeight = this.tileset?.getHeight(location, scene);
      this.sampledLongitude = location.longitude;
      this.sampledLatitude = location.latitude;
    }
    if (
      this.surfaceHeight === undefined ||
      !Number.isFinite(this.surfaceHeight) ||
      location.height >= this.surfaceHeight + SURFACE_CLEARANCE - 0.01
    ) {
      this.rememberView();
      return;
    }

    const previousSurface = this.previousView
      ? this.tileset?.getHeight(this.previousView.location, scene)
      : undefined;
    if (
      this.previousView &&
      (previousSurface === undefined ||
        !Number.isFinite(previousSurface) ||
        this.previousView.location.height >=
          previousSurface + SURFACE_CLEARANCE - 0.01)
    ) {
      this.restorePreviousView();
      return;
    }

    // Detailed tiles can appear around an already stationary camera. Recover
    // gently in place rather than snapping to a different height or heading.
    if (this.previousView) this.restorePreviousView();
    const recoveryLocation = camera.positionCartographic;
    const surface = previousSurface ?? this.surfaceHeight;
    if (surface === undefined || !Number.isFinite(surface)) return;
    const aboveSurface = this.CesiumJs.Cartesian3.fromRadians(
      recoveryLocation.longitude,
      recoveryLocation.latitude,
      Math.min(
        surface + SURFACE_CLEARANCE,
        recoveryLocation.height + RECOVERY_SPEED * elapsed,
      ),
    );
    camera.lookAt(
      this.target,
      camera.worldToCameraCoordinatesPoint(aboveSurface),
    );
    this.rememberView();
    scene.requestRender();
  }

  private rememberView(): void {
    const camera = this.viewer!.camera;
    const { Cartesian3, Cartographic } = this.CesiumJs;
    this.previousView = {
      target: Cartesian3.clone(this.target),
      position: Cartesian3.clone(camera.position),
      direction: Cartesian3.clone(camera.direction),
      up: Cartesian3.clone(camera.up),
      right: Cartesian3.clone(camera.right),
      location: Cartographic.clone(camera.positionCartographic),
    };
  }

  private restorePreviousView(): void {
    if (!this.previousView) return;
    const { camera, scene } = this.viewer!;
    const view = this.previousView;
    this.target = view.target;
    camera.lookAt(this.target, view.position);
    const { Cartesian3 } = this.CesiumJs;
    Cartesian3.clone(view.position, camera.position);
    Cartesian3.clone(view.direction, camera.direction);
    Cartesian3.clone(view.up, camera.up);
    Cartesian3.clone(view.right, camera.right);
    this.sampledLongitude = NaN;
    scene.requestRender();
  }

  private attachPointerEvents(): void {
    const { canvas } = this.viewer!.scene;
    const pointerDown = (event: PointerEvent) =>
      this.pointers.add(event.pointerId);
    const pointerUp = (event: PointerEvent) => {
      this.pointers.delete(event.pointerId);
      this.interactionUntil = performance.now() + 250;
    };
    const wheel = () => {
      this.interactionUntil = performance.now() + 250;
    };
    const clearPointers = () => this.pointers.clear();
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('wheel', wheel, { passive: true });
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
    window.addEventListener('blur', clearPointers);
    this.cleanups.push(() => {
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('wheel', wheel);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      window.removeEventListener('blur', clearPointers);
    });
  }

  private attachVisibilityEvents(element: HTMLElement): void {
    const update = () => this.updateVisibility();
    document.addEventListener('visibilitychange', update);
    this.cleanups.push(() =>
      document.removeEventListener('visibilitychange', update),
    );
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        this.updateVisibility();
      });
      observer.observe(element);
      this.cleanups.push(() => observer.disconnect());
    }
    this.updateVisibility();
  }

  private updateVisibility(): void {
    if (!this.viewer || this.disposed) return;
    this.viewer.useDefaultRenderLoop = this.visible && !document.hidden;
    this.lastFrame = performance.now();
    if (this.viewer.useDefaultRenderLoop) this.viewer.scene.requestRender();
  }

  private async loadTileset(): Promise<void> {
    const tileset = await this.CesiumJs.Cesium3DTileset.fromIonAssetId(
      2275207,
      { enableCollision: true },
    );
    if (this.disposed) {
      tileset.destroy();
      return;
    }
    this.tileset = tileset;
    this.cleanups.push(
      tileset.allTilesLoaded.addEventListener(() => {
        this.sampledLongitude = NaN;
      }),
      tileset.tileFailed.addEventListener((error) => {
        if (!this.loaded)
          this.fail(new Error('Die 3D-Daten konnten nicht geladen werden.'));
        else logger(error, 'Could not load a 3D tile.');
      }),
      tileset.initialTilesLoaded.addEventListener(() => this.finishLoading()),
    );
    this.viewer!.scene.primitives.add(tileset);
    this.viewer!.scene.requestRender();
  }

  private finishLoading(): void {
    if (this.disposed || this.loaded) return;
    const { scene } = this.viewer!;
    if (scene.clampToHeightSupported) {
      this.defaultTarget =
        scene.clampToHeight(this.defaultTarget) ?? this.defaultTarget;
    }
    this.reset();
    this.loaded = true;
    this.keepAboveSurface();
    this.callbacks.onReady();
  }

  private fail(error: unknown): void {
    if (this.disposed) return;
    logger(error, 'Could not load 3D map.');
    this.callbacks.onError(error);
    this.destroy();
  }
}
