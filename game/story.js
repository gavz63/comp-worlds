class Story {
    constructor(game) {
        this._game = game;
        game.addEntity(this, LAYERS.FLOOR);
        this._animation = new Animation(game.AM.getAsset("./img/story.png"), 192, 192,
            {x: 0, y: 0}, {x: 8, y: 0}, 0, false, STANDARD_DRAW_SCALE);
        this._phase = 0;
        this._locked = false;
        this._timed = 0;
    }

    update() {
        if (this._game.click && !this._locked) {
            this._phase++;
            if (this._phase === 1) this._locked = true;
            if (this._phase >= 9) this.destroy();
        }
        if (this._phase > 0 && this._phase < 5) {
            this._timed += this._game._clockTick;
            this._phase = Math.floor(1 + this._timed);
            if (this._phase >= 5) this._locked = false;
        }

        this._animation.setFrame(this._phase);

    }

    draw(ctx) {
        this._animation.drawFrame(this._game._clockTick, ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, true);
    }

    destroy() {
        this.removeFromWorld = true;
        sessionStorage.setItem('level', '1');

        this._game.audioManager = new AudioManager();
        let level;
        if (sessionStorage.getItem('level') === 'endless') {
            level = new Endless();
        } else {
            level = new (eval("Level" + sessionStorage.getItem('level')))();
        }

        let c = new BlackMage();
        let remaining = [new NPC(this._game, c, c.stats.maxHP)];
        this._game._camera._zoom = (224 * 224);
        this._game._camera._desiredZoom = (224 * 224);
        let trans = new Transition(this._game, remaining, {x: 0, y: 0}, new level.constructor());
        trans._phase = 1;
        this._game.audioManager.setMasterVolume(parseFloat(sessionStorage.getItem('master_volume')));
        this._game.audioManager.setMusicVolume(parseFloat(sessionStorage.getItem('music_volume')));
        this._game.audioManager.setSFXVolume(parseFloat(sessionStorage.getItem('gameplay_volume')));
        this._game.audioManager.setMusic('changingLevel');
        this._game.audioManager.pauseMusic();
        this._game.audioManager.restartMusic();
        this._game.audioManager.playMusic();
        //this._game.LoadLevel(level, parseNPC(sessionStorage.getItem('npcs')));
    }
}