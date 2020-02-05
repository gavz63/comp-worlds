class Enemy extends Entity {
    constructor(game, x, y, spawner) {
        super(game, x, y);
        this.spawner = spawner;
    }

    destroy() {
        this.spawner.numOut--;
        this.spawner.spawn_timer.unpause();
        super.destroy();
    }
}