class Key extends Entity {
    constructor(game, x, y) {
        super(game, x, y);
        game.addEntity(this, "pps");
        let fps = 7;
        if (Math.random() > .5) fps = -7;
        this.addScale = 1.5;
        this.scale = [STANDARD_DRAW_SCALE * this.addScale];
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/pickups/key.png"), 32, 32, {x: 0, y: 0}, {x: 7, y: 0}, fps, true, this.scale);
        this.collider = new Collider(0, 0, 10, 9, 4, 4, 15, Infinity);
    }

    update() {
        this.scale[0] = STANDARD_DRAW_SCALE * this.addScale;

        if (checkCollision({x: this.x, y: this.y}, this.collider, {x: this.game._player.x, y: this.game._player.y}, this.game._player._collider)) {
            this.game._player.keys += 1;
            this.destroy();
        }

    }
}