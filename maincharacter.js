// Gordon McCreary (January 23, 2020)

const MAIN_CHARACTER_TOP_SPEED = 2 * STANDARD_DRAW_SCALE;

/*
MainCharacter
*/

class MainCharacter {
    constructor(game, level, camera) {
        this._game = game;
        this._game.addEntity(this, "main");
        this._level = level;
        this._x = (this._level._spawn.x) * STANDARD_DRAW_SCALE * 96 + 48;
        this._y = (this._level._spawn.y) * STANDARD_DRAW_SCALE * 96 + 48;
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._removeFromWorld = false;
        this._camera = camera;
        this._camera.x = this._x;
        this._camera.y = this._y;
        this._game._camera = this._camera;
    }

    draw(ctx) {
        console.log(`${this._x}, ${this._y}`);
    }

    update() {
        // Update position
        this._x += this._xVelocity;
        this._y += this._yVelocity;

        //Update velocity
        if (this._game._up) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED) this._yVelocity -= .25;
        } else {
            if (this._yVelocity < 0) {
                this._yVelocity += .25;
                if (this._yVelocity > 0) this._yVelocity = 0;
            }
        }
        if (this._game._down) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED) this._yVelocity += .25;
        } else {
            if (this._yVelocity > 0) {
                this._yVelocity -= .25;
                if (this._yVelocity < 0) this._yVelocity = 0;
            }
        }
        if (this._game._left) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED) this._xVelocity -= .25;
        } else {
            if (this._xVelocity < 0) {
                this._xVelocity += .25;
                if (this._xVelocity > 0) this._xVelocity = 0;
            }
        }
        if (this._game._right) {
            if (this.calculateSpeed() < MAIN_CHARACTER_TOP_SPEED) this._xVelocity += .25;
        } else {
            if (this._xVelocity > 0) {
                this._xVelocity -= .25;
                if (this._xVelocity < 0) this._xVelocity = 0;
            }
        }

        // Update camera
        this._camera.x = this._x;
        this._camera.y = this._y;
        /*let xDif = this._x - this._camera._x;
        let yDif = this._y - this._camera._y;
        while (Math.sqrt((xDif * xDif) + (yDif * yDif)) > CAMERA_BOUNDING_BOX) {
            this._camera._x += (xDif / yDif);
            this._camera._y += (yDif / xDif);
            console.log(`CAMERA: ${this._camera._x}, ${this._camera._y}`);
        }*/

    }

    calculateSpeed() {
        return Math.abs(this._xVelocity) + Math.abs(this._yVelocity);
    }

    get removeFromWorld() {
        return this._removeFromWorld;
    }
}