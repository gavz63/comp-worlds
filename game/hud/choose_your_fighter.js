class ChooseYourFighter extends Entity{
    constructor(game) {
        super(game, -128, game.sceneManager.level.spawn.y * 96);

        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/hud/ChooseYourFighter.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            12, true, STANDARD_DRAW_SCALE * 4);
        this.animation.unpause();
    }
}