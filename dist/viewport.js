var $ePUDy$lodashes = require("lodash-es");
var $ePUDy$pdwioeventdispatcher = require("@pdw.io/event-dispatcher");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ViewportEventName", () => $53ffd25df6034fb9$export$c505ba0c2f17c402);
$parcel$export(module.exports, "Viewport", () => $53ffd25df6034fb9$export$d5c6c08dc2d3ca7);


let $53ffd25df6034fb9$export$c505ba0c2f17c402;
(function($53ffd25df6034fb9$export$c505ba0c2f17c402) {
    $53ffd25df6034fb9$export$c505ba0c2f17c402[$53ffd25df6034fb9$export$c505ba0c2f17c402["RESIZE"] = 0] = "RESIZE";
    $53ffd25df6034fb9$export$c505ba0c2f17c402[$53ffd25df6034fb9$export$c505ba0c2f17c402["SCROLL"] = 1] = "SCROLL";
})($53ffd25df6034fb9$export$c505ba0c2f17c402 || ($53ffd25df6034fb9$export$c505ba0c2f17c402 = {
}));
let $53ffd25df6034fb9$var$ViewportDimensionProperty;
(function(ViewportDimensionProperty) {
    ViewportDimensionProperty[ViewportDimensionProperty["WIDTH"] = 0] = "WIDTH";
    ViewportDimensionProperty[ViewportDimensionProperty["HEIGHT"] = 1] = "HEIGHT";
    ViewportDimensionProperty[ViewportDimensionProperty["PIXEL_DENSITY"] = 2] = "PIXEL_DENSITY";
})($53ffd25df6034fb9$var$ViewportDimensionProperty || ($53ffd25df6034fb9$var$ViewportDimensionProperty = {
}));
let $53ffd25df6034fb9$var$ViewportVisibleAreaProperty;
(function(ViewportVisibleAreaProperty) {
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["X"] = 0] = "X";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["Y"] = 1] = "Y";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["WIDTH"] = 2] = "WIDTH";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["HEIGHT"] = 3] = "HEIGHT";
    ViewportVisibleAreaProperty[ViewportVisibleAreaProperty["SCALE"] = 4] = "SCALE";
})($53ffd25df6034fb9$var$ViewportVisibleAreaProperty || ($53ffd25df6034fb9$var$ViewportVisibleAreaProperty = {
}));
class $53ffd25df6034fb9$export$d5c6c08dc2d3ca7 extends $ePUDy$pdwioeventdispatcher.EventDispatcher {
    get width() {
        return this.dimensions[$53ffd25df6034fb9$var$ViewportDimensionProperty.WIDTH];
    }
    get height() {
        return this.dimensions[$53ffd25df6034fb9$var$ViewportDimensionProperty.HEIGHT];
    }
    get pixelDensity() {
        return this.dimensions[$53ffd25df6034fb9$var$ViewportDimensionProperty.PIXEL_DENSITY];
    }
    get aspect() {
        return this.width / this.height;
    }
    get visualX() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.X];
    }
    get visualY() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.Y];
    }
    get visualWidth() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.WIDTH];
    }
    get visualHeight() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.HEIGHT];
    }
    get zoom() {
        return this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.SCALE];
    }
    calculateVisualArea() {
        const { offsetLeft: offsetLeft , offsetTop: offsetTop , width: width , height: height , scale: scale  } = window.visualViewport;
        const y = height - window.innerHeight + offsetTop;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.X] = offsetLeft;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.Y] = y;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.WIDTH] = width;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.HEIGHT] = height;
        this.visibleArea[$53ffd25df6034fb9$var$ViewportVisibleAreaProperty.SCALE] = scale;
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
            this.dispatchEvent($53ffd25df6034fb9$export$c505ba0c2f17c402.SCROLL);
        };
        this.resize = (width = window.innerWidth, height = window.innerHeight, pixelDensity = window.devicePixelRatio)=>{
            const _pixelDensity = Math.min(pixelDensity, this.maxPixelDensity);
            this.dimensions[$53ffd25df6034fb9$var$ViewportDimensionProperty.WIDTH] = width;
            this.dimensions[$53ffd25df6034fb9$var$ViewportDimensionProperty.HEIGHT] = height;
            this.dimensions[$53ffd25df6034fb9$var$ViewportDimensionProperty.PIXEL_DENSITY] = _pixelDensity;
            this.calculateVisualArea();
            this.dispatchEvent($53ffd25df6034fb9$export$c505ba0c2f17c402.RESIZE);
        };
        this.resizeDebounced = $ePUDy$lodashes.debounce(this.resize, this.resizeDebounce);
    }
}


//# sourceMappingURL=viewport.js.map
