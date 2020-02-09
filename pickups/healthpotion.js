class HealthPotion extends Entity {
    constructor(game, x, y) {
        super(game, x, y);
        game.addEntity(this, "pps");
        this.addScale = 1.5;
        this.scale = [STANDARD_DRAW_SCALE * this.addScale];
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/pickups/potions.png"), 32, 32, {x: 0, y: 1}, {x: 1, y: 1}, 7, true, this.scale);
        this.collider = new Collider(0, 0, 8, 8, 8, 8, 12, Infinity);
    }

    update() {
        this.scale[0] = STANDARD_DRAW_SCALE * this.addScale;
        if (checkCollision({x: this.x, y: this.y}, this.collider, {x: this.game._player.x, y: this.game._player.y}, this.game._player._collider)) {
            this.game._player.heal(1);
            this.destroy();
        }
    }
}