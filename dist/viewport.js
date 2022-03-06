var $ePUDy$pdwioeventdispatcher = require("@pdw.io/eventdispatcher");
var $ePUDy$lodashes = require("lodash-es");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ViewportObserverEventName", () => $53ffd25df6034fb9$export$642f3d8a78dc3e22);
$parcel$export(module.exports, "ViewportObserver", () => $53ffd25df6034fb9$export$da1a095605e6aa3c);


let $53ffd25df6034fb9$export$642f3d8a78dc3e22;
(function($53ffd25df6034fb9$export$642f3d8a78dc3e22) {
    $53ffd25df6034fb9$export$642f3d8a78dc3e22[$53ffd25df6034fb9$export$642f3d8a78dc3e22["RESIZE"] = 0] = "RESIZE";
    $53ffd25df6034fb9$export$642f3d8a78dc3e22[$53ffd25df6034fb9$export$642f3d8a78dc3e22["SCROLL"] = 1] = "SCROLL";
})($53ffd25df6034fb9$export$642f3d8a78dc3e22 || ($53ffd25df6034fb9$export$642f3d8a78dc3e22 = {
}));
let $53ffd25df6034fb9$var$ViewportObserverDimensionProperty;
(function(ViewportObserverDimensionProperty) {
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["WIDTH"] = 0] = "WIDTH";
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["HEIGHT"] = 1] = "HEIGHT";
    ViewportObserverDimensionProperty[ViewportObserverDimensionProperty["PIXEL_DENSITY"] = 2] = "PIXEL_DENSITY";
})($53ffd25df6034fb9$var$ViewportObserverDimensionProperty || ($53ffd25df6034fb9$var$ViewportObserverDimensionProperty = {
}));
let $53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty;
(function(ViewportObserverVisibleAreaProperty) {
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["X"] = 0] = "X";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["Y"] = 1] = "Y";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["WIDTH"] = 2] = "WIDTH";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["HEIGHT"] = 3] = "HEIGHT";
    ViewportObserverVisibleAreaProperty[ViewportObserverVisibleAreaProperty["SCALE"] = 4] = "SCALE";
})($53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty || ($53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty = {
}));
class $53ffd25df6034fb9$export$da1a095605e6aa3c extends $ePUDy$pdwioeventdispatcher.EventDispatcher {
    get width() {
        return this.dimensions[$53ffd25df6034fb9$var$ViewportObserverDimensionProperty.WIDTH];
    }
    get height() {
        return this.dimensions[$53ffd25df6034fb9$var$ViewportObserverDimensionProperty.HEIGHT];
    }
    get pixelDensity() {
        return this.dimensions[$53ffd25df6034fb9$var$ViewportObserverDimensionProperty.PIXEL_DENSITY];
    }
    get aspect() {
        return this.width / this.height;
    }
    get visualX() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.X];
    }
    get visualY() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.Y];
    }
    get visualWidth() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.WIDTH];
    }
    get visualHeight() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.HEIGHT];
    }
    get zoom() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.SCALE];
    }
    calculateVisualArea() {
        const { offsetLeft: offsetLeft , offsetTop: offsetTop , width: width , height: height , scale: scale  } = window.visualViewport;
        const y = height - window.innerHeight + offsetTop;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.X] = offsetLeft;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.Y] = y;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.WIDTH] = width;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.HEIGHT] = height;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportObserverVisibleAreaProperty.SCALE] = scale;
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
            this.dispatchEvent($53ffd25df6034fb9$export$642f3d8a78dc3e22.SCROLL);
        };
        this.resize = (width = window.innerWidth, height = window.innerHeight, pixelDensity = window.devicePixelRatio)=>{
            const _pixelDensity = Math.min(pixelDensity, this.maxPixelDensity);
            this.dimensions[$53ffd25df6034fb9$var$ViewportObserverDimensionProperty.WIDTH] = width;
            this.dimensions[$53ffd25df6034fb9$var$ViewportObserverDimensionProperty.HEIGHT] = height;
            this.dimensions[$53ffd25df6034fb9$var$ViewportObserverDimensionProperty.PIXEL_DENSITY] = _pixelDensity;
            this.calculateVisualArea();
            this.dispatchEvent($53ffd25df6034fb9$export$642f3d8a78dc3e22.RESIZE);
        };
        this.resizeDebounced = $ePUDy$lodashes.debounce(this.resize, this.resizeDebounce);
    }
}


//# sourceMappingURL=viewport.js.map
