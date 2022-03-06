import { EventDispatcher } from "@pdw.io/eventdispatcher";
export enum ViewportObserverEventName {
    RESIZE = 0,
    SCROLL = 1
}
export class ViewportObserver extends EventDispatcher<ViewportObserverEventName> {
    /** Canvas dimensions. [width, height, pixelDensity, scale]. */
    readonly dimensions: Float32Array;
    /** Rect currently visible in the viewport. [x, y, width, height, scale]. */
    readonly visibleArea: Float32Array;
    isListening: boolean;
    /** Maximum allowed pixel density. */
    maxPixelDensity: number;
    /** Debounce time before resize callback triggers. */
    resizeDebounce: number;
    get width(): number;
    get height(): number;
    get pixelDensity(): number;
    get aspect(): number;
    get visualX(): number;
    get visualY(): number;
    get visualWidth(): number;
    get visualHeight(): number;
    get zoom(): number;
    readonly resize: (width?: number, height?: number, pixelDensity?: number) => void;
    addEventListeners(): void;
    removeEventListeners(): void;
    initialise(): void;
    dispose(): void;
}

//# sourceMappingURL=viewport.d.ts.map
