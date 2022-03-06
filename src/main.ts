import { EventDispatcher } from '@pdw.io/eventdispatcher';
import { debounce } from 'lodash-es';

export enum ViewportObserverEventName {
  RESIZE,
  SCROLL,
}

enum ViewportObserverDimensionProperty {
  WIDTH,
  HEIGHT,
  PIXEL_DENSITY,
}

enum ViewportObserverVisibleAreaProperty {
  X,
  Y,
  WIDTH,
  HEIGHT,
  SCALE,
}

class ViewportObserver extends EventDispatcher<ViewportObserverEventName> {
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
    return this.dimensions[ViewportObserverDimensionProperty.WIDTH];
  }

  get height() {
    return this.dimensions[ViewportObserverDimensionProperty.HEIGHT];
  }

  get pixelDensity() {
    return this.dimensions[ViewportObserverDimensionProperty.PIXEL_DENSITY];
  }

  get aspect() {
    return this.width / this.height;
  }

  get visualX() {
    return this.visibleArea[ViewportObserverVisibleAreaProperty.X];
  }

  get visualY() {
    return this.visibleArea[ViewportObserverVisibleAreaProperty.Y];
  }

  get visualWidth() {
    return this.visibleArea[ViewportObserverVisibleAreaProperty.WIDTH];
  }

  get visualHeight() {
    return this.visibleArea[ViewportObserverVisibleAreaProperty.HEIGHT];
  }

  get zoom() {
    return this.visibleArea[ViewportObserverVisibleAreaProperty.SCALE];
  }

  private readonly onResize = () => this.resizeDebounced();

  private readonly onViewportScroll = () => {
    this.calculateVisualArea();
    this.dispatchEvent(ViewportObserverEventName.SCROLL);
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
    this.visibleArea[ViewportObserverVisibleAreaProperty.X] = offsetLeft;
    this.visibleArea[ViewportObserverVisibleAreaProperty.Y] = y;
    this.visibleArea[ViewportObserverVisibleAreaProperty.WIDTH] = width;
    this.visibleArea[ViewportObserverVisibleAreaProperty.HEIGHT] = height;
    this.visibleArea[ViewportObserverVisibleAreaProperty.SCALE] = scale;
  }

  readonly resize = (
    width = window.innerWidth,
    height = window.innerHeight,
    pixelDensity = window.devicePixelRatio
  ) => {
    const _pixelDensity = Math.min(pixelDensity, this.maxPixelDensity);
    this.dimensions[ViewportObserverDimensionProperty.WIDTH] = width;
    this.dimensions[ViewportObserverDimensionProperty.HEIGHT] = height;
    this.dimensions[ViewportObserverDimensionProperty.PIXEL_DENSITY] =
      _pixelDensity;

    this.calculateVisualArea();

    this.dispatchEvent(ViewportObserverEventName.RESIZE);
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

export { ViewportObserver };
