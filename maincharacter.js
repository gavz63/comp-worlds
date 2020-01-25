// Gordon McCreary (January 2020)

/** The main character's top speed. (Recommended range: 2 to 4) */
const MAIN_CHARACTER_TOP_SPEED = [3];

/**
 * The MainCharacter class is how the user interacts with the game world.
 */
class MainCharacter {

    /**
     * @param {GameEngine} game The game engine that this entity exists in.
     */
    constructor(game) {
        this._game = game;
        this._game.addEntity(this, "main");
        this._level = game._level;
        this._camera = game._camera;
        this._camera.x = this._x;
        this._camera.y = this._y;
        this._x = this._level.indexToCoordinate(this._level._spawn.x);
        this._y = this._level.indexToCoordinate(this._level._spawn.y);
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._removeFromWorld = false;
        this._upAccelSteps = 0;
        this._downAccelSteps = 0;
        this._leftAccelSteps = 0;
        this._rightAccelSteps = 0;
    }

    /**
     * Mandatory draw method; called by the GameEngine to draw the entity.
     * @param {*} ctx The canvas' 2D context.
     */
    draw(ctx) {
        let pos = this._camera.drawPosTranslation({x: this._x, y: this._y}, 1);
        ctx.fillText(`O`, pos.x, pos.y);
    }

    /**
     * Mandatory update method; called by the GameEngine to update the entity.
     */
    update() {

        // Update position
        this._x += this._xVelocity;
        this._y += this._yVelocity;

        //Update velocity
        if (this._game.up) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED && this._game.upAccelStep === 0) this._yVelocity -= 1;
        } else {
            if (this._yVelocity < 0 && this._game.upAccelStep === 0) {
                this._yVelocity += 1;
            }
        }
        if (this._game.down) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED && this._game.downAccelStep === 0) this._yVelocity += 1;
        } else {
            if (this._yVelocity > 0 && this._game.downAccelStep === 0) {
                this._yVelocity -= 1;
            }
        }
        if (this._game.left) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED && this._game.leftAccelStep === 0) this._xVelocity -= 1;
        } else {
            if (this._xVelocity < 0 && this._game.leftAccelStep === 0) {
                this._xVelocity += 1;
            }
        }
        if (this._game.right) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED && this._game.rightAccelStep === 0) this._xVelocity += 1;
        } else {
            if (this._xVelocity > 0 && this._game.rightAccelStep === 0) {
                this._xVelocity -= 1;
            }
        }

        // Update camera
        // Replace this with camera bounding box eventually.
        this._camera.x = this._x;
        this._camera.y = this._y;

        this._game.upAccelStep = (this._game.upAccelStep + 1) % 4;
        this._game.downAccelStep = (this._game.downAccelStep + 1) % 4;
        this._game.leftAccelStep = (this._game.leftAccelStep + 1) % 4;
        this._game.rightAccelStep = (this._game.rightAccelStep + 1) % 4;
    }

    /**
     * @returns {num} Returns the current speed of the main character.
     */
    calculateSpeed() {
        return Math.abs(this._xVelocity) + Math.abs(this._yVelocity);
    }


    get removeFromWorld() {return this._removeFromWorld;}
}