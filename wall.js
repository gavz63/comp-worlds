const WALL_A_SCALE = 1.04;
const WALL_B_SCALE = 1.08;
const WALL_C_SCALE = 1.12;

class Wall {
    constructor(game, spritesheet) {
        this._game = game;
        this._game.addEntity(this, "floor");
        this._level = this._game._level;
        this._spritesheet = spritesheet;
        this._removeFromWorld = false;
        this._outsideWall0 = new Animation(spritesheet, 128, 128, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, STANDARD_DRAW_SCALE);
        this._insideWall0 = new Animation(spritesheet, 128, 128, {x: 0, y: 1}, {x: 0, y: 1}, 0, true, STANDARD_DRAW_SCALE);
        this._outsideWall1 = new Animation(spritesheet, 128, 128, {x: 1, y: 0}, {x: 1, y: 0}, 0, true, STANDARD_DRAW_SCALE * WALL_A_SCALE);
        this._insideWall1 = new Animation(spritesheet, 128, 128, {x: 1, y: 1}, {x: 1, y: 1}, 0, true, STANDARD_DRAW_SCALE * WALL_A_SCALE);
        this._outsideWall2 = new Animation(spritesheet, 128, 128, {x: 2, y: 0}, {x: 2, y: 0}, 0, true, STANDARD_DRAW_SCALE * WALL_B_SCALE);
        this._insideWall2 = new Animation(spritesheet, 128, 128, {x: 2, y: 1}, {x: 2, y: 1}, 0, true, STANDARD_DRAW_SCALE * WALL_B_SCALE);
        this._outsideWall3 = new Animation(spritesheet, 128, 128, {x: 3, y: 0}, {x: 3, y: 0}, 0, true, STANDARD_DRAW_SCALE * WALL_C_SCALE);
        this._insideWall3 = new Animation(spritesheet, 128, 128, {x: 3, y: 1}, {x: 3, y: 1}, 0, true, STANDARD_DRAW_SCALE * WALL_C_SCALE);
    }

    draw(ctx) {
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                if (this._level._map[i][j] === "W") {
                    let pos = this._game._camera.translate({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)});
                    if (this._level._wallType === "0") {
                        this._outsideWall0.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    } else {
                        this._insideWall0.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    }
                }
            }
        }
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                if (this._level._map[i][j] === "W") {
                    let pos1 = this._game._camera.translateWithScale({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)}, WALL_A_SCALE);
                    if (this._level._wallType === "0") {
                        this._outsideWall1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                    } else {
                        this._insideWall1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                    }
                }
            }
        }
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                if (this._level._map[i][j] === "W") {
                    let pos2 = this._game._camera.translateWithScale({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)}, WALL_B_SCALE);
                    if (this._level._wallType === "0") {
                        this._outsideWall2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                    } else {
                        this._insideWall2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                    }
                }
            }
        }
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                if (this._level._map[i][j] === "W") {
                    let pos3 = this._game._camera.translateWithScale({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)}, WALL_C_SCALE);
                    if (this._level._wallType === "0") {
                        this._outsideWall3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                    } else {

                        this._insideWall3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                    }
                }
            }
        }
    }

    update() {

    }
}