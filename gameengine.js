/**
 * The GameEngine class is the heart our game. It maintains the render-update
 * loop and provides all entities with the resources they need to exist and
 * interact.
 */
class GameEngine {

    /**
     * @param {Camera} camera The camera that's attached to the main character.
     * @param {Level} level The level being played by the main character.
     */
    constructor(camera, level) {
        this._camera = camera;
        this._level = level;
        this._entities = [];
        this._entities[0] = []; // Floor & Wall
        this._entities[1] = []; // Enemies
        this._entities[2] = []; // Pickups & Projectiles
        this._entities[3] = []; // Playable Characters
        this._entities[4] = []; // HUD
        this._ctx = null;
        this._up = null;
        this._down = null;
        this._left = null;
        this._right = null;
        this._clicks = [];
        this._upAccelStep = 0;
        this._downAccelStep = 0;
        this._leftAccelStep = 0;
        this._rightAccelStep = 0;
    }

    /**
     * Initializes the game.
     * @param {*} ctx The HTML canvas' 2D context.
     */
    init(ctx) {
        this._ctx = ctx;
        this._surfaceWidth = this._ctx.canvas.width;
        this._surfaceHeight = this._ctx.canvas.height;
        this.startInput();
        this._timer = new Timer();
    }

    /**
     * Starts the render-update loop.
     */
    start() {
        let that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that._ctx.canvas);
        })();
    }

    /**
    * Initializes all event listeners for user input.
    */
    startInput() {
        let that = this;
        this._ctx.canvas.addEventListener("keydown", function (e) {
            let c = e.code;
            if (c === "KeyW" || c === "ArrowUp") {
                that._up = true;
                that._upAccelStep = 0;
            }
            if (c === "KeyS" || c === "ArrowDown") {
                that._down = true;
                that._downAccelStep = 0;
            }
            if (c === "KeyA" || c === "ArrowLeft") {
                that._left = true;
                that._leftAccelStep = 0;
            }
            if (c === "KeyD" || c === "ArrowRight") {
                that._right = true;
                that._rightAccelStep = 0;
            }
            e.preventDefault();
        }, false);
        this._ctx.canvas.addEventListener("keyup", function (e) {
            let c = e.code;
            if (c === "KeyW" || c === "ArrowUp") {
                that._up = false;
                that._upAccelStep = 0;
            }
            if (c === "KeyS" || c === "ArrowDown") {
                that._down = false;
                that._downAccelStep = 0;
            }
            if (c === "KeyA" || c === "ArrowLeft") {
                that._left = false;
                that._leftAccelStep = 0;
            }
            if (c === "KeyD" || c === "ArrowRight") {
                that._right = false;
                that._rightAccelStep = 0;
            }
            e.preventDefault();
        }, false);
        this._ctx.canvas.addEventListener("click", function (e) {
            console.log(that._camera.clickPosTranslation({x: e.clientX, y: e.clientY}));
            that._clicks.push({x: e.clientX, y: e.clientY, type: "left"});
            e.preventDefault();
        }, false);
        this._ctx.canvas.addEventListener("contextmenu", function (e) {
            that._clicks.push({x: e.clientX, y: e.clientY, type: "right"});
            e.preventDefault();
        }, false);
    }

    /**
     * Adds the given entity to the list of entities in the requested layer.
     * @param {*} entity The entity to be added.
     * @param {number | string} layer The entity destination layer.
     *      Pass 0 or "floor" for layer 0 (floor & wall tiles);
     *      Pass 1 or "enemy" for layer 1 (enemies);
     *      Pass 2 or "pps" for layer 2 (projectiles and pickups);
     *      Pass 3 or "main" for layer 3 (playable characters);
     *      Pass 4 or "hud" for layer 4 (HUD);
     */
    addEntity(entity, layer) {
        if (typeof(layer) === "string") {
            if ("floor" === layer) {
                this._entities[0].push(entity);
            } else if ("enemy" === layer) {
                this._entities[1].push(entity);
            } else if ("pps" === layer) {
                this._entities[2].push(entity);
            } else if ("main" === layer) {
                this._entities[3].push(entity);
            } else if ("hud" === layer) {
                this._entities[4].push(entity);
            } else {
                throw "Invalid layer string parameter.";
            }
        } else if (typeof(layer) === "number") {
            if (layer === Math.floor(layer) && layer >= 0 && layer < 5) {
                this._entities[layer].push(entity);
            } else {
                throw "Invalid layer number parameter.";
            }
        } else {
            throw "Incorrect layer parameter type.";
        }
    }

    /**
    * Calls draw() on every entity in memory.
    */
    draw() {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._ctx.save();
        for (let i = 0; i < this._entities.length; i++) {
            for (let j = 0; j < this._entities[i].length; j++) {
                this._entities[i][j].draw(this._ctx);
            }
        }
        this._ctx.restore();
    }

    /**
     * Calls update() on every entity while disposing of entities that aren't
     * needed anymore.
     */
    update() {

        // Update entities
        for (let i = 0; i < this._entities.length; i++) {
            for (let j = 0; j < this._entities[i].length; j++) {
                if (!(this._entities[i][j].removeFromWorld)) this._entities[i][j].update();
            }
        }

        // Remove unnecessary entities
        for (let i = 0; i < this._entities.length; i++) {
            for (let j = this._entities[i].length - 1; j >= 0; j--) {
                if (this._entities[i][j].removeFromWorld) this._entities[i].splice(j, 1);
            }
        }

        // Clear input
        this._clicks = [];
    }

    /**
    * Loops while calling update() and draw().
    */
    loop() {
        this._clockTick = this._timer.tick();
        this.update();
        this.draw();
    }

    // Getters and setters.
    get camera() {return this._camera;}
    get level() {return this._level;}
    get entities() {return this._entities;}
    get ctx() {return this._ctx;}
    get up() {return this._up;}
    get upAccelStep() {return this._upAccelStep;}
    set upAccelStep(val) {this._upAccelStep = val;}
    get down() {return this._down;}
    get downAccelStep() {return this._downAccelStep;}
    set downAccelStep(val) {this._downAccelStep = val;}
    get left() {return this._left;}
    get leftAccelStep() {return this._leftAccelStep;}
    set leftAccelStep(val) {this._leftAccelStep = val;}
    get right() {return this._right;}
    get rightAccelStep() {return this._rightAccelStep;}
    set rightAccelStep(val) {this._rightAccelStep = val;}
}

// Used in start() to cap framerate.
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();