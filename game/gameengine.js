const DIRECTION_LEFT = "LEFT";
const DIRECTION_RIGHT = "RIGHT";
const DIRECTION_UP = "UP";
const DIRECTION_DOWN = "DOWN";

const GAME_STATES = {
    CHARACTER_SELECT: "char_select",
    PLAYING: "playing_level",
    CHANGING_LEVEL: "changing level",
    CONTROLS_TUTORIAL: "controls tutorial",
    GAME_OVER: "you lose loser"
};

const LAYERS = {
    FLOOR: 0,
    SPAWNERS: 1,
    REMNANTS: 2,
    PUDDLEREMNANTS: 3,
    ENEMIES: 4,
    ENEMY_PROJECTILES: 5,
    PICKUPS: 6,
    MAIN: 7,
    PLAYER_PROJECTILES: 8,
    WALL: 9,
    DOOR: 10,
    PARTICLES: 11,
    HUD: 12,
    PRIORITY: 13
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
        this._entities[LAYERS.REMNANTS] = [];
        this._entities[LAYERS.PUDDLEREMNANTS] = [];
        this._entities[LAYERS.ENEMIES] = [];
        this._entities[LAYERS.ENEMY_PROJECTILES] = [];
        this._entities[LAYERS.PICKUPS] = [];
        this._entities[LAYERS.PLAYER_PROJECTILES] = [];
        this._entities[LAYERS.MAIN] = [];
        this._entities[LAYERS.WALL] = [];
        this._entities[LAYERS.PARTICLES] = [];
        this._entities[LAYERS.HUD] = [];
        this._entities[LAYERS.PRIORITY] = [];
        this._ctx = null;

        this.timers = [];
        this.click = false;
        this.rightClick = false;
        this.score = 0;
        this.chars = [];
        this.keyStack = [];
        this.lastChar = null;

        this.currentLevel = 0;
        this.levels = [Level1.prototype, Level2.prototype];

        this._sceneManager = new SceneManager(this);

        this.game_state = GAME_STATES.CHARACTER_SELECT;
        this.mousePos = {x: 0, y: 0};
    }

    LoadLevel(levelFile, npcClasses) {
        this.player = null;
        if (this.audioManager.music) {
            this.audioManager.pauseMusic();
        }
        this.audioManager.setMusic(levelFile.musicId);
        this.audioManager.restartMusic();
        this.audioManager.playMusic();
        this.destroyLevel();
        this.game_state = GAME_STATES.CHARACTER_SELECT;

        this._sceneManager.LoadLevel(levelFile, npcClasses);
        this._camera.update();
        this.camera.x = 0;
        this.camera.y = this.sceneManager.level.spawn.y * 96;

        new WallHUD(this);

        new Floor(this);
        new Wall(this);

        let hover = true;
        this.addEntity(new ChooseYourFighter(this), LAYERS.HUD);
        for (var i = 0; i < npcClasses.length; i++) {
            this.addEntity(new NPC(this, npcClasses[i], hover), LAYERS.MAIN);
            if (i === 0) {
                hover = false;
            }
        }
    }

    /**
     * Initializes the game.
     * @param {*} ctx The HTML canvas' 2D context.
     */
    init(ctx) {
        this.audioManager = new AudioManager();
        //this.LoadLevel(new Level1(), [new BlackMage(), new Ninja()]);
        let level;
        if (sessionStorage.getItem('level') === 'endless') {
            level = new Endless();
        } else {
            level = new (eval("Level" + sessionStorage.getItem('level')))();
        }
        this.LoadLevel(level, parseNPC(sessionStorage.getItem('npcs')));
        this._ctx = ctx;
        ctx.canvas.click();
        this._surfaceWidth = this._ctx.canvas.width;
        this._surfaceHeight = this._ctx.canvas.height;
        this.startInput();
        this._clock = new Clock();
        new Crosshair(this);
        this.addEntity(this._camera, LAYERS.PRIORITY);
    }

    controlsPageInit(ctx) {
        this.destroyLevel();
        this._sceneManager.LoadLevel(new LevelFake(), []);

        this._ctx = ctx;
        this._surfaceWidth = this._ctx.canvas.width;
        this._surfaceHeight = this._ctx.canvas.height;
        this._clock = new Clock();
        this.game_state = GAME_STATES.CONTROLS_TUTORIAL;

        this.addEntity(this._camera, LAYERS.HUD);
        this._camera.update();
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
     *      Pass 0 or LAYERS.FLOOR for layer 0 (floor & wall tiles);
     *      Pass 1 or "enemy" for layer 1 (enemies);
     *      Pass 2 or "pps" for layer 2 (projectiles and pickups);
     *      Pass 3 or "main" for layer 3 (playable characters);
     *      Pass 4 or "hud" for layer 4 (HUD);
     */
    addEntity(entity, layer) {

        entity.layer = layer;
        if(layer < LAYERS.FLOOR || layer > LAYERS.PRIORITY) {
            throw "Invalid layer int parameter.";
        }

        entity.id = this._entities[layer].length;
        this._entities[layer].push(entity);
    }

    removeEntity(entity) {
        this.entities[entity.layer][entity.id] = this.entities[entity.layer][this.entities[entity.layer].length - 1];
        this.entities[entity.layer][entity.id].id = entity.id;
        this.entities[entity.layer][this.entities[entity.layer].length - 1] = entity;
        this.entities[entity.layer].pop();
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
        //this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        //this._ctx.save();
        for (let i = 0; i < this._entities.length; i++) {
            for (let j = 0; j < this._entities[i].length; j++) {
                this._entities[i][j].draw(this._ctx);
            }
        }
        
        //this._ctx.restore();
    }

    destroyLevel() {
        for (let i = 0; i < this._entities.length - 1; i++) {
            this._entities[i] = [];
        }
        this.timers = []
    }

    /**
     * Calls update() on every entity while disposing of entities that aren't
     * needed anymore.
     */
    update() {

        let entityCount = this.entities[LAYERS.PRIORITY].length;
        for (let i = 0; i < entityCount; i++) {
            if (this.entities[LAYERS.PRIORITY][i].removeFromWorld) {
                this.removeEntity(this.entities[LAYERS.PRIORITY][i]);
                entityCount = this.entities[LAYERS.PRIORITY].length;
                i--;
                continue;
            }
            this.entities[LAYERS.PRIORITY][i].update();
        }
        
        if(this.entities[LAYERS.PUDDLEREMNANTS].length >= 90)
        {
          this.entities[LAYERS.PUDDLEREMNANTS].length = 3;
        }
    
        switch (this.game_state) {
            case GAME_STATES.CHARACTER_SELECT:
                for (var i = 0; i < this._entities.length; i++) {
                    entityCount = this._entities[i].length;
                    for (var j = 0; j < entityCount; j++) {
                        if (this.entities[i][j].removeFromWorld) {
                            this.removeEntity(this.entities[i][j]);
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
            case GAME_STATES.CONTROLS_TUTORIAL:
            case GAME_STATES.PLAYING:
            case GAME_STATES.CHANGING_LEVEL:
            case GAME_STATES.GAME_OVER:

                for (var i = 0; i < this._entities.length; i++) {
                    entityCount = this._entities[i].length;
                    for (var j = 0; j < entityCount; j++) {
                        if (this.entities[i][j].removeFromWorld) {
                            this.removeEntity(this.entities[i][j]);
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
        this.click = false;
    }

    /**
     * Loops while calling update() and draw().
     */
    loop() {
        this._clockTick = this._clock.tick();
        this.update();
        this.draw();
    }

    gameOver() {
        this.game_state = GAME_STATES.GAME_OVER;
        this.entities[LAYERS.HUD].forEach(function(elem) {
            if (elem instanceof ChooseYourFighter) {
                elem.destroy();
            }
        });

        this.timers.forEach(function(elem) {
            elem.destroy();
        });
        this.addEntity(new GameOver(this), LAYERS.HUD);
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
        this.addEntity(new Tutorial(this), LAYERS.HUD);
        this.game_state = GAME_STATES.PLAYING;
    }

    switchToCharacterChooserMode(player = null) {
        
		let that = this;
		if(player === null)
		{
      new TimerCallback(this, 2, false, function () {
				that.camera._desiredLoc.x = 0;
				that.camera._desiredLoc.y = that.sceneManager.level.spawn.y * 96;
				that.game_state = GAME_STATES.CHARACTER_SELECT;
			});
		}
		else
		{
			that.camera._desiredLoc.x = 0;
			that.camera._desiredLoc.y = that.sceneManager.level.spawn.y * 96;
			that.game_state = GAME_STATES.CHARACTER_SELECT;
		}
		
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

        if (player) player.destroy();

        this.addEntity(new ChooseYourFighter(this), LAYERS.HUD);
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