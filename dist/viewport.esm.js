import {EventDispatcher as $doaur$EventDispatcher} from "@pdw.io/eventdispatcher";
import {debounce as $doaur$debounce} from "lodash-es";



let $b013a5dd6d18443e$export$642f3d8a78dc3e22;
(function($b013a5dd6d18443e$export$642f3d8a78dc3e22) {
    $b013a5dd6d18443e$export$642f3d8a78dc3e22[$b013a5dd6d18443e$export$642f3d8a78dc3e22["RESIZE"] = 0] = "RESIZE";
    $b013a5dd6d18443e$export$642f3d8a78dc3e22[$b013a5dd6d18443e$export$642f3d8a78dc3e22["SCROLL"] = 1] = "SCROLL";
})($b013a5dd6d18443e$export$642f3d8a78dc3e22 || ($b013a5dd6d18443e$export$642f3d8a78dc3e22 = {
}));
let $b013a5dd6d18443e$var$ViewportObserverDimensionProperty;
(function(ViewportObserverDimensionProperty) {
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["WIDTH"] = 0] = "WIDTH";
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["HEIGHT"] = 1] = "HEIGHT";
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["PIXEL_DENSITY"] = 2] = "PIXEL_DENSITY";
})($b013a5dd6d18443e$var$ViewportObserverDimensionProperty || ($b013a5dd6d18443e$var$ViewportObserverDimensionProperty = {
}));
let $b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty;
(function(ViewportObserverVisibleAreaProperty) {
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["X"] = 0] = "X";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["Y"] = 1] = "Y";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["WIDTH"] = 2] = "WIDTH";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["HEIGHT"] = 3] = "HEIGHT";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["SCALE"] = 4] = "SCALE";
})($b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty || ($b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty = {
}));
class $b013a5dd6d18443e$export$da1a095605e6aa3c extends $doaur$EventDispatcher {
    get width() {
        return this.dimensions[$b013a5dd6d18443e$var$ViewportObserverDimensionProperty.WIDTH];
    }
    get height() {
        return this.dimensions[$b013a5dd6d18443e$var$ViewportObserverDimensionProperty.HEIGHT];
    }
    get pixelDensity() {
        return this.dimensions[$b013a5dd6d18443e$var$ViewportObserverDimensionProperty.PIXEL_DENSITY];
    }
    get aspect() {
        return this.width / this.height;
    }
    get visualX() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.X];
    }
    get visualY() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.Y];
    }
    get visualWidth() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.WIDTH];
    }
    get visualHeight() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.HEIGHT];
    }
    get zoom() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.SCALE];
    }
    calculateVisualArea() {
        const { offsetLeft: offsetLeft , offsetTop: offsetTop , width: width , height: height , scale: scale  } = window.visualViewport;
        const y = height - window.innerHeight + offsetTop;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.X] = offsetLeft;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.Y] = y;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.WIDTH] = width;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.HEIGHT] = height;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportObserverVisibleAreaProperty.SCALE] = scale;
    }
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
    constructor(...args){
        super(...args);
        /** Canvas dimensions. [width, height, pixelDensity, scale]. */ this.dimensions = new Float32Array([
            320,
            150,
            1,
            1
        ]);
        /** Rect currently visible in the viewport. [x, y, width, height, scale]. */ this.visibleArea = new Float32Array([
            0,
            0,
            320,
            150,
            1
        ]);
        this.isListening = false;
        /** Maximum allowed pixel density. */ this.maxPixelDensity = 2;
        /** Debounce time before resize callback triggers. */ this.resizeDebounce = 200;
        this.onResize = ()=>this.resizeDebounced()
        ;
        this.onViewportScroll = ()=>{
            this.calculateVisualArea();
            this.dispatchEvent($b013a5dd6d18443e$export$642f3d8a78dc3e22.SCROLL);
        };
        this.resize = (width = window.innerWidth, height = window.innerHeight, pixelDensity = window.devicePixelRatio)=>{
            const _pixelDensity = Math.min(pixelDensity, this.maxPixelDensity);
            this.dimensions[$b013a5dd6d18443e$var$ViewportObserverDimensionProperty.WIDTH] = width;
            this.dimensions[$b013a5dd6d18443e$var$ViewportObserverDimensionProperty.HEIGHT] = height;
            this.dimensions[$b013a5dd6d18443e$var$ViewportObserverDimensionProperty.PIXEL_DENSITY] = _pixelDensity;
            this.calculateVisualArea();
            this.dispatchEvent($b013a5dd6d18443e$export$642f3d8a78dc3e22.RESIZE);
        };
        this.resizeDebounced = $doaur$debounce(this.resize, this.resizeDebounce);
    }
}


export {$b013a5dd6d18443e$export$642f3d8a78dc3e22 as ViewportObserverEventName, $b013a5dd6d18443e$export$da1a095605e6aa3c as ViewportObserver};
//# sourceMappingURL=viewport.esm.js.map
