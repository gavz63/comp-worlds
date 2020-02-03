class Enemy extends Entity {
    constructor(game, x, y, spawner) {
        super(game, x, y);
        this.spawner = spawner;
    }

    destroy() {
        super.destroy();
        this.spawner.numOut--;
    }
}