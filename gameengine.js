const DIRECTION_LEFT = "LEFT";
const DIRECTION_RIGHT = "RIGHT";
const DIRECTION_UP = "UP";
const DIRECTION_DOWN = "DOWN";

const GAME_STATES = {
    CHARACTER_SELECT: "char_select",
    PLAYING: "playing_level",
    CHANGING_LEVEL: "changing level"
};

const LAYERS = {
    FLOOR: 0,
    ENEMIES: 1,
    ENEMY_PROJECTILES: 2,
    PICKUPS: 3,
    PLAYER_PROJECTILES: 4,
    MAIN: 5,
    WALL: 6,
    HUD: 7
};

// ORIGINAL LAYERS WERE
// 1 -> Floor/wall
// 2 -> enemies
// 3 -> pps
// 4 -> hud

/**
 * The GameEngine class is the heart our game. It maintains the render-update
 * loop and provides all entities with the resources they need to exist and
 * interact.
 */
class GameEngine {

    /**
     * @param {Camera} camera The camera that's attached to the main character.
     * @param {Level} level The level being played by the main character.
     * @param {[]} spawners The list of spawners that will create enemies.
     */
    constructor(camera) {
        this._camera = camera;
        this._entities = [];
        this._entities[LAYERS.FLOOR] = [];
        this._entities[LAYERS.ENEMIES] = [];
        this._entities[LAYERS.ENEMY_PROJECTILES] = [];
        this._entities[LAYERS.PICKUPS] = [];
        this._entities[LAYERS.PLAYER_PROJECTILES] = [];
        this._entities[LAYERS.MAIN] = [];
        this._entities[LAYERS.WALL] = [];
        this._entities[LAYERS.HUD] = [];
        this._ctx = null;

        this.timers = [];
        this.click = false;
        this.rightClick = false;
        this.score = 0;
        this.chars = [];
        this.keyStack = [];
        this.lastChar = null;

        this.currentLevel = 0;
        this.levels = [Level1.prototype, Level2.prototype, Level3.prototype, Level4.prototype, Level5.prototype, Level6.prototype, Level7.prototype];

        this._sceneManager = new SceneManager(this);

        this.game_state = GAME_STATES.CHARACTER_SELECT;
    }

    LoadLevel(levelFile) {
        this.destroyLevel();
        this.game_state = GAME_STATES.CHARACTER_SELECT;

        this._sceneManager.LoadLevel(levelFile);

        this.addEntity(this._camera, "hud");
        this._camera.update();
        this.camera.x = 0;
        this.camera.y = this.sceneManager.level.spawn.y * 96;

        new WallHUD(this);

        new Floor(this);
        new Wall(this);

        let charClasses = [new BlackMage(), new Lancer()];

        let hover = true;
        this.addEntity(new ChooseYourFighter(this), "hud");
        for (var i = 0; i < charClasses.length; i++) {
            this.addEntity(new NPC(this, charClasses[i], hover), "main");
            if (i === 0) {
                hover = false;
            }
        }
        new Crosshair(this);
    }

    /**
     * Initializes the game.
     * @param {*} ctx The HTML canvas' 2D context.
     */
    init(ctx) {
        this.LoadLevel(new Level1());
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
        if (typeof (layer) === "string") {
            if ("floor" === layer) {
                choice = LAYERS.FLOOR;
            } else if ("enemy" === layer) {
                choice = LAYERS.ENEMIES;
            } else if ("player_projectiles" === layer) {
                choice = LAYERS.PLAYER_PROJECTILES;
            } else if ("enemy_projectiles" === layer) {
                choice = LAYERS.ENEMY_PROJECTILES;
            } else if ("main" === layer) {
                choice = LAYERS.MAIN;
            } else if ("hud" === layer) {
                choice = LAYERS.HUD;
            } else {
                throw "Invalid layer string parameter.";
            }

            entity.id = this._entities[choice].length;
            this._entities[choice].push(entity);


        } else if (typeof (layer) === "number") {
            if (layer === Math.floor(layer) && layer >= LAYERS.FLOOR && layer <= LAYERS.HUD ) {
                this._entities[layer].push(entity);
            } else {
                throw "Invalid layer number parameter.";
            }
        } else {
            throw "Incorrect layer parameter type.";
        }

        //console.log("CREATED ENTITY");
    }

    removeEntity(entity, layer, index) {
        if (entity instanceof Key || entity instanceof HealthPotion) {
            console.log("here");
        }
        this.entities[layer][index] = this.entities[layer][this.entities[layer].length - 1];
        // this.entities[layer][entity.id].id = entity.id;
        this.entities[layer][this.entities[layer].length - 1] = entity;
        this.entities[layer].pop();
    }

    addTimer(timer) {
        timer.id = this.timers.length;
        this.timers.push(timer);
    }

    removeTimer(timer) {
        this.timers[timer.id] = this.timers[this.timers.length - 1];
        this.timers[timer.id].id = timer.id;
        this.timers[this.timers.length - 1] = timer;
        this.timers.pop();
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

        this._ctx.restore();
    }

    destroyLevel() {
        for (let i = 0; i < this._entities.length; i++) {
            this._entities[i] = [];
        }
        this.timers = []
    }

    /**
     * Calls update() on every entity while disposing of entities that aren't
     * needed anymore.
     */
    update() {

        switch (this.game_state) {
            case GAME_STATES.CHARACTER_SELECT:
                var i = 0;
                for (i = 0; i < this._entities[LAYERS.FLOOR].length; i++) {
                    if (this.entities[LAYERS.FLOOR][i].removeFromWorld) {
                        this.removeEntity(this.entities[LAYERS.FLOOR][i], LAYERS.FLOOR, i);
                        continue;
                    }
                    this.entities[LAYERS.FLOOR][i].update();
                }
                for (i = 0; i < this.entities[LAYERS.MAIN].length; i++) {
                    if (this.entities[LAYERS.MAIN][i].removeFromWorld) {
                        this.removeEntity(this.entities[LAYERS.MAIN][i], LAYERS.MAIN, i);
                        continue;
                    }
                    this.entities[LAYERS.MAIN][i].update();
                }
                for (i = 0; i < this.entities[LAYERS.WALL].length; i++) {
                    if (this.entities[LAYERS.WALL][i].removeFromWorld) {
                        this.removeEntity(this.entities[LAYERS.WALL][i], LAYERS.WALL, i);
                        continue;
                    }
                    this.entities[LAYERS.WALL][i].update();
                }
                for (i = 0; i < this._entities[LAYERS.HUD].length; i++) {
                    if (this.entities[LAYERS.HUD][i].removeFromWorld) {
                        this.removeEntity(this.entities[LAYERS.HUD][i], LAYERS.HUD, i);
                        continue;
                    }
                    this.entities[LAYERS.HUD][i].update();
                }
                this.click = false;

                break;

            case GAME_STATES.PLAYING:
                for (var i = 0; i < this._entities.length; i++) {
                    let entityCount = this._entities[i].length;
                    for (var j = 0; j < entityCount; j++) {
                        if (this.entities[i][j].removeFromWorld) {
                            this.removeEntity(this.entities[i][j], i, j);
                            entityCount = this.entities[i].length;
                            j--;
                            continue;
                        }

                        this.entities[i][j].update();
                    }
                }

                var timersCount = this.timers.length;

                for (var i = 0; i < timersCount; i++) {
                    let tim = this.timers[i];
                    if (tim.removeFromWorld) {
                        this.removeTimer(tim);
                        timersCount = this.timers.length;
                        i--;
                        continue;
                    }
                    this.timers[i].update();
                }

                break;
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

    switchToPlayMode(npc) {
        for (let i = 0; i < this.entities[LAYERS.HUD].length; i++) {
            if (this.entities[LAYERS.HUD][i] instanceof HoverArrow
                || this.entities[LAYERS.HUD][i] instanceof ChooseYourFighter) {
                this.entities[LAYERS.HUD][i].destroy();
            }
        }
        npc.destroy();
        new Player(this, npc.characterClass);
        this.addEntity(new Tutorial(this), "hud");
        this.game_state = GAME_STATES.PLAYING;
    }

    switchToCharacterChooserMode(player = null) {
        this.camera.x = 0;
        this.camera.y = this.sceneManager.level.spawn.y * 96;
        for (let i = 0; i < this.entities[LAYERS.MAIN].length; i++) {
            let flag = true;
            if (this.entities[LAYERS.MAIN][i] instanceof NPC) {
                if (flag) {
                    this.entities[LAYERS.MAIN][i].setHover();
                    flag = false;
                    break;
                }
            }
        }

        for (let i = 0; i < this.entities[LAYERS.HUD].length; i++) {
            if (this.entities[LAYERS.HUD][i] instanceof Tutorial) {
                this.entities[LAYERS.HUD][i].destroy();
            }
        }

        this.addEntity(new ChooseYourFighter(this), "hud");
        if (player) player.destroy();
        this.game_state = GAME_STATES.CHARACTER_SELECT;
    }

    // Getters and setters.
    get camera() {
        return this._camera;
    }

    get sceneManager() {
        return this._sceneManager;
    }

    get entities() {
        return this._entities;
    }

    get ctx() {
        return this._ctx;
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