const STANDARD_DRAW_SCALE = 1.75;

/*
GameEngine

The GameEngine class is the heart our game. It maintains the render-update loop
and provides all entities with the resources they need to exist and interact.
*/
class GameEngine {

    /*
    Default constructor.
    */
    constructor(camera, level) {
        this._camera = camera;
        this._level = level;
        this._entities = [];
        this._entities[0] = []; // Floor & Wall Bottoms
        this._entities[1] = []; // Enemies
        this._entities[2] = []; // Pickups & Projectiles
        this._entities[3] = []; // Playable Characters
        this._entities[4] = []; // Wall Half Emptys
        this._entities[5] = []; // Wall Half Fulls
        this._entities[6] = []; // Wall Tops
        this._entities[7] = []; // HUD
        this._ctx = null;
        this._up = null;
        this._down = null;
        this._left = null;
        this._right = null;
        this._surfaceWidth = null;
        this._surfaceHeight= null;
    }

    /*
    Initializes the game.

    ctx:
    The HTML canvas' context.
    */
    init(ctx) {
        this._ctx = ctx;
        this._surfaceWidth = this._ctx.canvas.width;
        this._surfaceHeight = this._ctx.canvas.height;
        this.startInput();
        this._timer = new Timer();
    }

    /*
    Starts the render-update loop.
    */
    start() {
        let that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that._ctx.canvas);
        })();
    }

    /*
    Initializes all event listeners for user input.
    */
    startInput() {
        let that = this;
        this._ctx.canvas.addEventListener("keydown", function (e) {
            let c = e.code;
            if (c === "KeyW" || c === "ArrowUp") that._up = true;
            if (c === "KeyS" || c === "ArrowDown") that._down = true;
            if (c === "KeyA" || c === "ArrowLeft") that._left = true;
            if (c === "KeyD" || c === "ArrowRight") that._right = true;
            e.preventDefault();
        }, false);
        this._ctx.canvas.addEventListener("keyup", function (e) {
            let c = e.code;
            if (c === "KeyW" || c === "ArrowUp") that._up = false;
            if (c === "KeyS" || c === "ArrowDown") that._down = false;
            if (c === "KeyA" || c === "ArrowLeft") that._left = false;
            if (c === "KeyD" || c === "ArrowRight") that._right = false;
            e.preventDefault();
        }, false);
    }

    /*
    Adds the given entity to the list of entities in the requested layer.

    entity:
    The entity to be added.

    layer:
    The layer that the entity should be added to.
    Pass 0 or "floor" for layer 0 (floor tiles & bottom wall tiles);
    Pass 1 or "enemy" for layer 1 (enemies);
    Pass 2 or "pps" for layer 2 (projectiles and pickups);
    Pass 3 or "main" for layer 3 (playable characters);
    Pass 4 or "wal" for layer 4 (first wall layer);
    Pass 5 or "wall" for layer 5 (second wall layer);
    Pass 6 or "walll" for layer 6 (top wall layer);
    Pass 7 or "hud" for layer 7 (HUD);
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
            } else if ("wal" === layer) {
                this._entities[4].push(entity);
            } else if ("wall" === layer) {
                this._entities[5].push(entity);
            } else if ("walll" === layer) {
                this._entities[6].push(entity);
            } else if ("hud" === layer) {
                this._entities[7].push(entity);
            } else {
                throw "Invalid layer string parameter.";
            }
        } else if (typeof(layer) === "number") {
            if (layer === Math.floor(layer) && layer >= 0 && layer < 8) {
                this._entities[layer].push(entity);
            } else {
                throw "Invalid layer number parameter.";
            }
        } else {
            throw "Incorrect layer parameter type.";
        }
    }

    /*
    Calls draw() on every entity in memory.
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

    /*
    Calls update() on every entity while disposing of entities that aren't
    needed anymore. Input history is cleared after calling update() on all
    entities.
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
    }

    /*
    Loops while calling update() and draw().
    */
    loop() {
        this._clockTick = this._timer.tick();
        this.update();
        this.draw();
    }
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