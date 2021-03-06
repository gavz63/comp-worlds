class SceneManager {
    constructor(game) {
        this.game = game;
        this.revived = [];
        this.npcsAtStartOfLevel = [];
        this.currentLevel = null;
    }

    LoadLevel(levelFile, npcs) {
        this.levelFile = levelFile;
        this.level = new Level(this.game, this.levelFile);
        this.npcsAtStartOfLevel = npcs;

        let string_npcs = [];
        npcs.forEach(function(elem) {
            string_npcs.push(elem.constructor.name);
        });

        string_npcs = string_npcs.join(" ");
        //console.log(string_npcs);
        sessionStorage.setItem('npcs', string_npcs);
    }

    endGame() {

        this.game.audioManager.pauseMusic();
        this.game.audioManager.setMusic('changingLevel');
        this.game.audioManager.restartMusic();
        this.game.audioManager.playMusic();
        window.onbeforeunload = null;
        this.game._camera.shake(15, 10, 10);
        let that = this;
        new TimerCallback(this.game, 1, false, function () {
            that.game._camera.zoomCam(DEFAULT_ZOOM * 50);
        });
        new TimerCallback(this.game, 5, false, function () {
            window.location.href = '../credits.html';
        });
    }

    levelComplete() {

        this.game.game_state = GAME_STATES.CHANGING_LEVEL;

        this.game.audioManager.pauseMusic();
        this.game.audioManager.setMusic('changingLevel');
        this.game.audioManager.restartMusic();
        this.game.audioManager.playMusic();
        // Player's final position
        let playPos = {x: this.game.player.x, y: this.game.player.y};
        // Remaining party members as NPC's.
        let remaining = [];

        remaining.push(new NPC(this.game, this.game.player.characterClass, this.game.player.characterClass.stats.maxHP));
        this.game.player.destroy();
        this.game.player = {x: 0, y: 0};
        //this.game.player.removeFromWorld = true;
        this.game._entities[LAYERS.MAIN].forEach((ent) => {
            if (ent instanceof NPC) {
                remaining.push(new NPC(this.game, ent.characterClass, ent.characterClass.stats.maxHP));
            }
        });
        let that = this;
        this.revived.forEach(function (elem) {
            remaining.push(new NPC(that.game, elem.characterClass, that.game._player.characterClass.stats.maxHP));
        });
        if(this.levelFile.nextLevel !== null)
        {
          new Transition(this.game, remaining, playPos, new this.levelFile.nextLevel.constructor());
        }
        else // end of game. YOU WIN
        {
          new Transition(this.game, remaining, playPos, null);
        }
        this.revived = [];
    }

    resetLevel() {
        this.game.LoadLevel(this.levelFile, this.npcsAtStartOfLevel);
    }
}