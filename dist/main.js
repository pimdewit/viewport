import { EventDispatcher } from '@pdw.io/eventdispatcher';
import { debounce } from 'lodash-es';
export var ViewportObserverEventName;
(function (ViewportObserverEventName) {
    ViewportObserverEventName[ViewportObserverEventName["RESIZE"] = 0] = "RESIZE";
    ViewportObserverEventName[ViewportObserverEventName["SCROLL"] = 1] = "SCROLL";
})(ViewportObserverEventName || (ViewportObserverEventName = {}));
var ViewportObserverDimensionProperty;
(function (ViewportObserverDimensionProperty) {
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["WIDTH"] = 0] = "WIDTH";
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["HEIGHT"] = 1] = "HEIGHT";
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["PIXEL_DENSITY"] = 2] = "PIXEL_DENSITY";
})(ViewportObserverDimensionProperty || (ViewportObserverDimensionProperty = {}));
var ViewportObserverVisibleAreaProperty;
(function (ViewportObserverVisibleAreaProperty) {
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["X"] = 0] = "X";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["Y"] = 1] = "Y";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["WIDTH"] = 2] = "WIDTH";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["HEIGHT"] = 3] = "HEIGHT";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["SCALE"] = 4] = "SCALE";
})(ViewportObserverVisibleAreaProperty || (ViewportObserverVisibleAreaProperty = {}));
/**
 * Observe changes of a target element.
 */
class ViewportObserver extends EventDispatcher {
    constructor() {
        super(...arguments);
        /** Canvas dimensions. [width, height, pixelDensity, scale]. */
        this.dimensions = new Float32Array([320, 150, 1, 1]);
        /** Rect currently visible in the viewport. [x, y, width, height, scale]. */
        this.visibleArea = new Float32Array([0, 0, 320, 150, 1]);
        this.isListening = false;
        /** Maximum allowed pixel density. */
        this.maxPixelDensity = 2;
        /** Debounce time before resize callback triggers. */
        this.resizeDebounce = 200;
        this.onResize = () => this.resizeDebounced();
        this.onViewportScroll = () => {
            this.calculateVisualArea();
            this.dispatchEvent(ViewportObserverEventName.SCROLL);
        };
        this.resize = (width = window.innerWidth, height = window.innerHeight, pixelDensity = window.devicePixelRatio) => {
            const _pixelDensity = Math.min(pixelDensity, this.maxPixelDensity);
            this.dimensions[ViewportObserverDimensionProperty.WIDTH] = width;
            this.dimensions[ViewportObserverDimensionProperty.HEIGHT] = height;
            this.dimensions[ViewportObserverDimensionProperty.PIXEL_DENSITY] =
                _pixelDensity;
            this.calculateVisualArea();
            this.dispatchEvent(ViewportObserverEventName.RESIZE);
        };
        this.resizeDebounced = debounce(this.resize, this.resizeDebounce);
    }
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
    calculateVisualArea() {
        const { offsetLeft, offsetTop, width, height, scale } = window.visualViewport;
        const y = height - window.innerHeight + offsetTop;
        this.visibleArea[ViewportObserverVisibleAreaProperty.X] = offsetLeft;
        this.visibleArea[ViewportObserverVisibleAreaProperty.Y] = y;
        this.visibleArea[ViewportObserverVisibleAreaProperty.WIDTH] = width;
        this.visibleArea[ViewportObserverVisibleAreaProperty.HEIGHT] = height;
        this.visibleArea[ViewportObserverVisibleAreaProperty.SCALE] = scale;
    }
    addEventListeners() {
        if (this.isListening)
            return;
        this.isListening = true;
        window.addEventListener('resize', this.onResize);
        window.addEventListener('visibilitychange', this.onResize);
        window.visualViewport.addEventListener('resize', this.onResize);
        window.visualViewport.addEventListener('scroll', this.onViewportScroll);
    }
    removeEventListeners() {
        if (!this.isListening)
            return;
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
