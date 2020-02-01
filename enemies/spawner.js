/**
 * An object that will create enemies at a certain point in the game world
 * @author Joel Johnson, Gavin Montes
 */
class Spawner {
	/**
	 * Creates the spawner object
	 * @param game, a reference to the game engine (so we can add enemies to the game).
	 * @param x, the x coordinate of the spawner
	 * @param y, the y coordinate of the spawner
     * @param maxAtOnce, how many enemies should be allowed to spawn at once before spawning pauses
     * For example: If maxAtOnce = 5, the spawner will create 5 enemies before disabling. The spawn timer will be reset,
     * and will not start again until  the number of alive enemies that it has created becomes less than 5 (if you kill them).
	 * @param frequency, how often the spawner creates enemies.
	 * @param spawnList, a list of enemy types that this spawner can create.
     * @param random, true if we want to randomly spawn enemies from the spawnList, false if we want to generate enemies
     * in the order that they appear in the spawnList
	 * @param radius, if the player is within the radius of the spawner it will be active, otherwise, the spawner will stop spawning
	 * @param maxSpawn, How many total enemies the spawner can create before permanently self destructing. (Think battle room).
     * Set to 0 if no maximum
	 */
    constructor(game, x, y, maxAtOnce, frequency, spawnList, random, radius, maxSpawn) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.maxAtOnce = maxAtOnce;
        this.frequency = frequency;
        this.spawnList = spawnList;
        this.random = random;
        this.radius = radius;
        this.maxSpawn = maxSpawn;
        this.numOut = 0;
        this.totalSpawned = 0;
        this.choice = 0;

        var that = this;
        this.spawn_timer = new TimerCallBack(game, frequency, true,
            function () {
                    if (that.shouldSpawn()) {
                        that.spawn();
                    }
            }
        );
    }

    shouldSpawn() {
        // If we haven't already spawned the max TOTAL
        if (this.maxSpawn === 0 || this.totalSpawned < this.maxSpawn) {
            // If there are not already the max number of enemies spawned at once.
            if (this.maxAtOnce === 0 || this.numOut < this.maxAtOnce) {
                return true;
            }
        } else {
            this.spawn_timer.destroy();
            return false;
        }
    }

    spawn() {
        if (this.random) {
            this.choice = Math.ceil(Math.random() * this.spawnList.length) - 1;
        } else {
            if (this.choice >= this.spawnList.length) {
                this.choice = 0;
            }
        }
        let spawn = new this.spawnList[this.choice].constructor(this.game, this.x, this.y);
        this.totalSpawned++;
        this.numOut++;
        this.choice++;
    }

    pause() {
    	this.spawn_timer.pause();
    }

    unpause() {
    	this.spawn_timer.unpause();
    }

    reset() {
        this.spawn_timer.reset();
    }
}