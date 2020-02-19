class GameOver extends Entity {
    constructor(game) {
        super(game, -128, game.sceneManager.level.spawn.y * 96);
        this._myScale = [STANDARD_DRAW_SCALE * 4];
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/hud/GameOver.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 2, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 0, y: 0},
            11, false, this._myScale);
        this.animation.pause();
    }
    update() {
        this._myScale = [STANDARD_DRAW_SCALE * 4];
    }
}