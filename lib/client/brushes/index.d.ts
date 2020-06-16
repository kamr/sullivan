import { BRUSH } from "../../server/rooms/State";
declare const _default: {
    /**
     * "Sketch" brush: https://codepen.io/kangax/pen/EjivI
     */
    [BRUSH.SKETCH]: (ctx: CanvasRenderingContext2D, color: number, points: number[], isPreview?: boolean) => void;
    /**
     * Pen: https://codepen.io/kangax/pen/aoxwb
     */
    [BRUSH.PEN]: (ctx: CanvasRenderingContext2D, color: number, points: number[], isPreview?: boolean) => void;
    /**
     * Marker: https://codepen.io/kangax/pen/jLDAf
     */
    [BRUSH.MARKER]: (ctx: CanvasRenderingContext2D, color: number, points: number[], isPreview?: boolean) => void;
};
export default _default;
