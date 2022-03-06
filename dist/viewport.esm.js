import {debounce as $doaur$debounce} from "lodash-es";
import {EventDispatcher as $doaur$EventDispatcher} from "@pdw.io/event-dispatcher";



let $b013a5dd6d18443e$export$c505ba0c2f17c402;
(function($b013a5dd6d18443e$export$c505ba0c2f17c402) {
    $b013a5dd6d18443e$export$c505ba0c2f17c402[$b013a5dd6d18443e$export$c505ba0c2f17c402["RESIZE"] = 0] = "RESIZE";
    $b013a5dd6d18443e$export$c505ba0c2f17c402[$b013a5dd6d18443e$export$c505ba0c2f17c402["SCROLL"] = 1] = "SCROLL";
})($b013a5dd6d18443e$export$c505ba0c2f17c402 || ($b013a5dd6d18443e$export$c505ba0c2f17c402 = {
}));
let $b013a5dd6d18443e$var$ViewportDimensionProperty;
(function(ViewportDimensionProperty) {
    ViewportDimensionProperty[ViewportDimensionProperty["WIDTH"] = 0] = "WIDTH";
    ViewportDimensionProperty[ViewportDimensionProperty["HEIGHT"] = 1] = "HEIGHT";
    ViewportDimensionProperty[ViewportDimensionProperty["PIXEL_DENSITY"] = 2] = "PIXEL_DENSITY";
})($b013a5dd6d18443e$var$ViewportDimensionProperty || ($b013a5dd6d18443e$var$ViewportDimensionProperty = {
}));
let $b013a5dd6d18443e$var$ViewportVisibleAreaProperty;
(function(ViewportVisibleAreaProperty) {
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["X"] = 0] = "X";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["Y"] = 1] = "Y";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["WIDTH"] = 2] = "WIDTH";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["HEIGHT"] = 3] = "HEIGHT";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["SCALE"] = 4] = "SCALE";
})($b013a5dd6d18443e$var$ViewportVisibleAreaProperty || ($b013a5dd6d18443e$var$ViewportVisibleAreaProperty = {
}));
class $b013a5dd6d18443e$export$d5c6c08dc2d3ca7 extends $doaur$EventDispatcher {
    get width() {
        return this.dimensions[$b013a5dd6d18443e$var$ViewportDimensionProperty.WIDTH];
    }
    get height() {
        return this.dimensions[$b013a5dd6d18443e$var$ViewportDimensionProperty.HEIGHT];
    }
    get pixelDensity() {
        return this.dimensions[$b013a5dd6d18443e$var$ViewportDimensionProperty.PIXEL_DENSITY];
    }
    get aspect() {
        return this.width / this.height;
    }
    get visualX() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.X];
    }
    get visualY() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.Y];
    }
    get visualWidth() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.WIDTH];
    }
    get visualHeight() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.HEIGHT];
    }
    get zoom() {
        return this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.SCALE];
    }
    calculateVisualArea() {
        const { offsetLeft: offsetLeft , offsetTop: offsetTop , width: width , height: height , scale: scale  } = window.visualViewport;
        const y = height - window.innerHeight + offsetTop;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.X] = offsetLeft;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.Y] = y;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.WIDTH] = width;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.HEIGHT] = height;
        this.visibleArea[$b013a5dd6d18443e$var$ViewportVisibleAreaProperty.SCALE] = scale;
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
            this.dispatchEvent($b013a5dd6d18443e$export$c505ba0c2f17c402.SCROLL);
        };
        this.resize = (width = window.innerWidth, height = window.innerHeight, pixelDensity = window.devicePixelRatio)=>{
            const _pixelDensity = Math.min(pixelDensity, this.maxPixelDensity);
            this.dimensions[$b013a5dd6d18443e$var$ViewportDimensionProperty.WIDTH] = width;
            this.dimensions[$b013a5dd6d18443e$var$ViewportDimensionProperty.HEIGHT] = height;
            this.dimensions[$b013a5dd6d18443e$var$ViewportDimensionProperty.PIXEL_DENSITY] = _pixelDensity;
            this.calculateVisualArea();
            this.dispatchEvent($b013a5dd6d18443e$export$c505ba0c2f17c402.RESIZE);
        };
        this.resizeDebounced = $doaur$debounce(this.resize, this.resizeDebounce);
    }
}


export {$b013a5dd6d18443e$export$c505ba0c2f17c402 as ViewportEventName, $b013a5dd6d18443e$export$d5c6c08dc2d3ca7 as Viewport};
//# sourceMappingURL=viewport.esm.js.map
