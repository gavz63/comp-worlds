const DIRECTION_LEFT = "LEFT";
const DIRECTION_RIGHT = "RIGHT";
const DIRECTION_UP = "UP";
const DIRECTION_DOWN = "DOWN";
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
		
		this.timers = [];
		this.click = false;
		this.hasReticle = false;
		this.score = 0;
		this.chars = [];
		this.keyStack = [];
		this.lastChar = null;
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
        this._clock = new Clock();
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
    startInput = Input; 
	/* removing this will mess up maincharacter
	{

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
		
    }*/

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
		entity.layer = layer;
		let choice = -1; // if an entity is added without a proper layer this will throw an error.
        if (typeof(layer) === "string") {
            if ("floor" === layer) {
				choice = 0;
            } else if ("enemy" === layer) {
				choice = 1;
            } else if ("pps" === layer) {
				choice = 2;
            } else if ("main" === layer) {
				choice = 3;
            } else if ("hud" === layer) {
				choice = 4;
            } else {
                throw "Invalid layer string parameter.";
            }
			
			entity.id = this._entities[choice].length;
			this._entities[choice].push(entity);

			
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
	
	removeEntity (entity, layer) {
		this.entities[layer][entity.id] = this.entities[layer][this.entities[layer].length-1];
		this.entities[layer][entity.id].id = entity.id;
		this.entities[layer][this.entities[layer].length-1] = entity;
		this.entities[layer].pop();
	}
	
	addTimer(timer) {
		timer.id = this.timers.length;
		this.timers.push(timer);
	}
	
	removeTimer(timer) {
		this.timers[timer.id] = this.timers[this.timers.length-1];
		this.timers[timer.id].id = timer.id;
		this.timers[this.timers.length-1] = timer;
		this.timers.pop();
	}
	
	
	setReticle(reticle) {
		//console.log("This");
		this.reticle = reticle;
		this.hasReticle = true;
	}

	setPlayer(player) {
		this.player = player;
	}

	setAssetManager(manager) {
		this.AM = manager;
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
		
		if(this.hasReticle)
		{
			this.reticle.draw();
		}
		
        this._ctx.restore();
    }

    /**
     * Calls update() on every entity while disposing of entities that aren't
     * needed anymore.
     */
    update() {

		for (var i = 0; i < this._entities.length; i++) {
			let entityCount = this._entities[i].length;
			for(var j = 0; j < entityCount; j++)
			{
				if(this.entities[i][j].removeFromWorld)
				{
					this.removeEntity(this.entities[i][j], i);
					entityCount = this.entities[i].length;
					j--;
					continue;
				}
				
				this.entities[i][j].update();
			}
	    }
		
		var timersCount = this.timers.length;
		
		for (var i = 0; i < timersCount; i++)
		{
			let tim = this.timers[i];
			if(tim.removeFromWorld)
			{
				this.removeTimer(tim);
				timersCount = this.timers.length;
				i--;
				continue;
			}
			this.timers[i].update(this._clockTick);
		}

		
		if(this.hasReticle === true)
		{
			this.reticle.update(this.mouseX, this.mouseY);
		}

        // Clear input
        this._clicks = [];
    }

    /**
    * Loops while calling update() and draw().
    */
    loop() {
        this._clockTick = this._clock.tick();
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