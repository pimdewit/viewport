import { EventDispatcher } from '@pdw.io/event-dispatcher';
import { debounce } from 'lodash-es';

export enum ViewportEventName {
  RESIZE,
  SCROLL,
}

enum ViewportDimensionProperty {
  WIDTH,
  HEIGHT,
  PIXEL_DENSITY,
}

enum ViewportVisibleAreaProperty {
  X,
  Y,
  WIDTH,
  HEIGHT,
  SCALE,
}

class Viewport extends EventDispatcher<ViewportEventName> {
  /** Canvas dimensions. [width, height, pixelDensity, scale]. */
  readonly dimensions = new Float32Array([320, 150, 1, 1]);
  /** Rect currently visible in the viewport. [x, y, width, height, scale]. */
  readonly visibleArea = new Float32Array([0, 0, 320, 150, 1]);
  isListening = false;
  /** Maximum allowed pixel density. */
  maxPixelDensity = 2;
  /** Debounce time before resize callback triggers. */
  resizeDebounce = 200;

  get width() {
    return this.dimensions[ViewportDimensionProperty.WIDTH];
  }

  get height() {
    return this.dimensions[ViewportDimensionProperty.HEIGHT];
  }

  get pixelDensity() {
    return this.dimensions[ViewportDimensionProperty.PIXEL_DENSITY];
  }

  get aspect() {
    return this.width / this.height;
  }

  get visualX() {
    return this.visibleArea[ViewportVisibleAreaProperty.X];
  }

  get visualY() {
    return this.visibleArea[ViewportVisibleAreaProperty.Y];
  }

  get visualWidth() {
    return this.visibleArea[ViewportVisibleAreaProperty.WIDTH];
  }

  get visualHeight() {
    return this.visibleArea[ViewportVisibleAreaProperty.HEIGHT];
  }

  get zoom() {
    return this.visibleArea[ViewportVisibleAreaProperty.SCALE];
  }

  private readonly onResize = () => this.resizeDebounced();

  private readonly onViewportScroll = () => {
    this.calculateVisualArea();
    this.dispatchEvent(ViewportEventName.SCROLL);
  };

  private calculateVisualArea() {
    const {
      offsetLeft,
      offsetTop,
      width,
      height,
      scale
    } = window.visualViewport;

    const y = height - window.innerHeight + offsetTop;
    this.visibleArea[ViewportVisibleAreaProperty.X] = offsetLeft;
    this.visibleArea[ViewportVisibleAreaProperty.Y] = y;
    this.visibleArea[ViewportVisibleAreaProperty.WIDTH] = width;
    this.visibleArea[ViewportVisibleAreaProperty.HEIGHT] = height;
    this.visibleArea[ViewportVisibleAreaProperty.SCALE] = scale;
  }

  readonly resize = (
    width = window.innerWidth,
    height = window.innerHeight,
    pixelDensity = window.devicePixelRatio
  ) => {
    const _pixelDensity = Math.min(pixelDensity, this.maxPixelDensity);
    this.dimensions[ViewportDimensionProperty.WIDTH] = width;
    this.dimensions[ViewportDimensionProperty.HEIGHT] = height;
    this.dimensions[ViewportDimensionProperty.PIXEL_DENSITY] =
      _pixelDensity;

    this.calculateVisualArea();

    this.dispatchEvent(ViewportEventName.RESIZE);
  };

  private readonly resizeDebounced = debounce(this.resize, this.resizeDebounce);

  addEventListeners() {
    if (this.isListening) return;
    this.isListening = true;
    window.addEventListener('resize', this.onResize);
    window.addEventListener('visibilitychange', this.onResize);
    window.visualViewport.addEventListener('resize', this.onResize);
    window.visualViewport.addEventListener('scroll', this.onViewportScroll);
  }

  removeEventListeners() {
    if (!this.isListening) return;
    this.isListening = false;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('visibilitychange', this.onResize);
    window.visualViewport.removeEventListener('resize', this.onResize);
    window.visualViewport.removeEventListener('scroll', this.onViewportScroll);
  }

  initialise() {
    this.addEventListeners();
    this.resize();
  }

  dispose() {
    this.removeEventListeners();
  }
}

export { Viewport };
