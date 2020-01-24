// Gordon McCreary (January, 2020)

/** The radius of the camera bounding box around the player. */
const CAMERA_BOUNDING_BOX = 25;

/**
 * The Camera class is used to change which part of the map is being viewed.
 */
class Camera {

    /**
     * @param {*} ctx The canvas' 2D context.
     */
    constructor(ctx) {
        this._x = 0;
        this._y = 0;
        this._width = ctx.canvas.width;
        this._height = ctx.canvas.height;
    }

    /**
     * Translates a physical point on the map to a point that's relative to the
     * camera.
     * @param {object} physicalPoint The {x: , y: } of the object that you want
     *      to translate.
     */
    translate(physicalPoint) {
        return {x: (physicalPoint.x - this._x) + (this._width / 2), y: (physicalPoint.y - this._y) + (this._height / 2)};
    }

    /**
     * Translates a physical point on the map to a point that's relative to the
     * camera. Uses scale to simulate a z axis.
     * @param {object} physicalPoint The {x: , y: } of the object that you want
     *      to translate.
     * @param {*} scale The amount that scaling compared to the common objects.
     *      For example:
     *          If all the main objects are 32bit and scaled by 5, but the
     *          object you want to translate is scaled by 6, then pass the
     *          result of (6 / 5).
     */
    translateWithScale(physicalPoint, scale) {
        return {x: ((physicalPoint.x - this._x) * scale) + (this._width / 2), y: ((physicalPoint.y - this._y) * scale) + (this._height / 2)};
    }
    
    set x(val) {
        this._x = val;
    }
    
    set y(y) {
        this._y = y;
    }
}