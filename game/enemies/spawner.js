class RoomSpawner
{
	constructor(game, x, y, spawners, room, lockCam, dropKey)
	{
		this.game = game;
		this.x = indexToCoordinate(x);
		this.y = indexToCoordinate(y);
		this.spawners = spawners;
		this.room = room;
		this.dropKey = dropKey;
		this.finishedCount = 0;
		this.removeFromWorld = false;
    this.lastCam = false;
    this.lockCam = lockCam;
    this.camLocked = false;
		
		this.game.addEntity(this, LAYERS.SPAWNERS);
	}
	
	draw()
	{
	}
	
	update()
	{
    if(this.lockCam && this.lastCam != this.camLocked)
    {
      this.game.player.camLocked = this.camLocked;
      this.lastCam = this.camLocked;
    }
		if(this.finishedCount === this.spawners.length)
		{
			if(this.dropKey)
			{
				//drop Key
				new Key(this.game, this.x, this.y);
				
			}
			this.destroy();
		}
	}
	
	destroy()
	{
		this.game.player.camLocked = false;
		this.removeFromWorld = true;
	}
}

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
    constructor(game, x, y, maxAtOnce, frequency, spawnList, random, radius, maxSpawn, owner, delay) {
        this.game = game;
        this.x = indexToCoordinate(x);
        this.y = indexToCoordinate(y);
        this.maxAtOnce = maxAtOnce;
        this.frequency = frequency;
        this.spawnList = spawnList;
        this.random = random;
        this.radius = radius;
        this.maxSpawn = maxSpawn;
        this.numOut = 0;
        this.totalSpawned = 0;
        this.choice = 0;
        this.hasSpawned = false;
        this.owner = owner;
        this.removeFromWorld = false;

        var that = this;

        this.spawn_timer = new TimerCallback(game, frequency, true,
            function () {
                if (that.shouldSpawn()) {
                    that.spawn();
                }
            }
        );
        this.spawn_timer.pause();
        this.delayTimer = new TimerCallback(game, delay, false, function() {that.spawn_timer.unpause();});
        this.delayTimer.pause();
        

        this.game.addEntity(this, LAYERS.SPAWNERS);
    }

    // Make sure the player is in the radius of the spawner, if not reset and pause the spawn timer.
    update() {
        if (this.game.player !== undefined) {
            //If player is in radius
			if(this.owner === null)
			{
				if (circleToCircle(this.game.player, this)) {
					// Spawn immediately the first time
					this.trySpawn();
				} else {
					this.spawn_timer.pause();
				}
			}
			else
			{
				let x = coordinateToIndex(this.game.player.x);
				let y = coordinateToIndex(this.game.player.y);
				if(x <= this.owner.room.bottomRight.x && x >= this.owner.room.upperLeft.x && y <= this.owner.room.bottomRight.y && y >= this.owner.room.upperLeft.y)
				{
          if(this.delayTimer.removeFromWorld !== true)
          {
            this.delayTimer.unpause();
          }
          else
          {
            this.trySpawn();
          }
          if(this.owner.lockCam === true)
          {
            this.game._camera._desiredLoc.x = this.owner.x;
            this.game._camera._desiredLoc.y = this.owner.y;
            this.owner.camLocked = true;
          }
				}
				else
				{
          if(this.delayTimer.removeFromWorld !== true)
          {
            this.delayTimer.reset();
          }
          else
          {
            this.spawn_timer.pause();
          }
          this.owner.camLocked = false;
				}
				if(!this.shouldSpawn() && this.numOut === 0){
					this.owner.finishedCount++;
					this.destroy();
					return false;
				}
			}
        }
    }
	
	trySpawn()
	{
		if (!this.hasSpawned) {
			this.spawn();
			this.hasSpawned = true;
		} else {
			this.spawn_timer.unpause();
		}
	}

    draw() {
    }

    shouldSpawn() {
        // If we haven't already spawned the max TOTAL
        if (this.maxSpawn === 0 || this.totalSpawned < this.maxSpawn) {
            // If there are not already the max number of enemies spawned at once.
            if (this.maxAtOnce === 0 || this.numOut < this.maxAtOnce) {
                return true;
            }
        }
        return false;
    }

    spawn() {
        if (this.random) {
            this.choice = Math.ceil(Math.random() * this.spawnList.length) - 1;
        } else {
            if (this.choice >= this.spawnList.length) {
                this.choice = 0;
            }
        }
        let spawn = new this.spawnList[this.choice].constructor(this.game, this.x, this.y, this);
        this.totalSpawned++;
        this.numOut++;
        this.choice++;
        if (this.numOut >= this.maxAtOnce && this.maxAtOnce !== 0) {
            this.spawn_timer.reset();
            this.spawn_timer.pause();
        }
    }

    destroy() {
        this.spawn_timer.destroy();
		this.removeFromWorld = true;
    }
}
