class Transition {
    constructor(game, npcList, pos, nextLevel) {
        this._game = game;
        game.addEntity(this, LAYERS.MAIN);
        game.game_state = GAME_STATES.CHANGING_LEVEL;
        this._npcList = npcList;
        npcList.forEach((npc) => {
            npc.animation = npc.characterClass.animation.walkingRight;
        });
        npcList[0].x = pos.x;
        npcList[0].y = pos.y;
        this._x = pos.x;
        this._y = pos.y;
        this._nextLevel = nextLevel;
        this._phase = 0;
        this._progress = 0;
    }

    draw(ctx) {
        this._npcList.forEach((npc) => {
            npc.draw(ctx);
        });
    }

    update() {
        if (this._phase === 0) {
            this._x += Math.ceil(150 * this._game._clockTick);
            this._game._camera._desiredZoom = (224 * 224);
            this._game._camera._desiredLoc.x = this._x;
            this._game._camera._desiredLoc.y = this._y;
            this._npcList[0].x = this._x + this._game._camera._x - this._game._camera._desiredLoc.x;
            if (this._game._camera.drawPosTranslation({x: this._game.sceneManager.level._width * 96, y: 0}, 1).x < 0) {
                this._phase = 1;
                for (let i = 1; i < this._npcList.length; i++) {
                    this._npcList[i].y = this._y;
                    this._npcList[i].x = this._game._camera.clickPosTranslation({x: 0, y: 0}).x - i * 32;
                }
            }
        } else if (this._phase === 1) {
            this._x += Math.ceil(150 * this._game._clockTick);
            this._game._camera.x = this._x;
            this._game._camera.y = this._y;

            for (let i = this._npcList.length - 1; i >= 0; i--) {
                let initPos;
                if (i === 0) {
                    initPos = this._x;
                } else {
                    initPos = this._game._camera.clickPosTranslation({x: 0, y: 0}).x - i * 32;
                }
                let desiPos;
                if (this._npcList.length % 2 === 0) {
                    this._npcList[i].y = this._y;
                    desiPos = this._x - 16;
                    let linePos = this._npcList.length / 2 - i;
                    desiPos += linePos * 32;
                } else {
                    this._npcList[i].y = this._y;
                    desiPos = this._x;
                    let linePos = Math.floor(this._npcList.length / 2) - i;
                    desiPos += linePos * 32;
                }
                this._npcList[i].x = initPos + (desiPos - initPos) * (this._progress / 100);
            }

            this._progress++;
            if (this._progress === 100) {
                this._phase = 2;
                this._progress = 0;
            }
        } else if (this._phase === 2) {
            this._x += Math.ceil(150 * this._game._clockTick);
            this._game._camera.x = this._x;
            this._game._camera.y = this._y;
            for (let i = this._npcList.length - 1; i >= 0; i--) {
                if (this._npcList.length % 2 === 0) {
                    this._npcList[i].y = this._y;
                    this._npcList[i].x = this._x - 16;
                    let linePos = this._npcList.length / 2 - i;
                    this._npcList[i].x += linePos * 32;
                } else {
                    this._npcList[i].y = this._y;
                    this._npcList[i].x = this._x;
                    let linePos = Math.floor(this._npcList.length / 2) - i;
                    this._npcList[i].x += linePos * 32;
                }
            }
            this._progress++;
            if (this._progress === 250) {
                this._progress = 0;
                this._game.LoadLevel(this._nextLevel);
                this._game._camera._desiredZoom = DEFAULT_ZOOM;
            }
        }
    }

    destroy() {
        this.removeFromWorld = true;
        this._game.game_state = GAME_STATES.CHARACTER_SELECT;
    }
}