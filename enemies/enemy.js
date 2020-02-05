class Enemy extends Entity {
    constructor(game, x, y, spawner) {
        super(game, x, y);
        this.spawner = spawner;
        this.game.addEntity(this, "enemy");
    }

    destroy() {
        this.spawner.numOut--;
        this.spawner.spawn_timer.unpause();
        new Remnant(this.game, this.x, this.y, this.deathAnimation);
        super.destroy();
    }
}