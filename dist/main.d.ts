import { EventDispatcher } from '@pdw.io/eventdispatcher';
export declare enum ViewportObserverEventName {
    RESIZE = 0,
    SCROLL = 1
}
/**
 * Observe changes of a target element.
 */
declare class ViewportObserver extends EventDispatcher<ViewportObserverEventName> {
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
    private readonly onResize;
    private readonly onViewportScroll;
    private calculateVisualArea;
    readonly resize: (width?: number, height?: number, pixelDensity?: number) => void;
    private readonly resizeDebounced;
    addEventListeners(): void;
    removeEventListeners(): void;
    initialise(): void;
    dispose(): void;
}
export { ViewportObserver };
