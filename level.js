// Gordon McCreary (January 2020)

/**
 * The Level class is used to generate and represent the current level being
 * played by the main character.
 */
class Level {

    /**
     * @param {string) levelString A string that stores the information for the
     *      requested level. Formatting (all in one line):
     *          first: WIDTHxHEIGHTy            example: 20x15y
     *          second: WALLTYPEwFLOORTYPEf     example: 1w3f
     *          third: Row-major representation of the map
     *              W is a wall.
     *              F is a floor.
     *              S is the spawn point (must be on left border of map).
     *              E is the exit point (must be on right border of map).
     *              H is a horizontal door.
     *              V is a vertical door.
     *       Pass null for a random level.
     * @param {array} spawners An array of spawner objects
     */
    constructor(game, level) {
		this.game = game;
		this.levelFile = level;
        this.resetLevel(level);
    }

    /**
     * @param {string) levelString A string that stores the information for the
     *      requested level. Formatting (all in one line):
     *          first: WIDTHxHEIGHTy            example: 20x15y
     *          second: WALLTYPEwFLOORTYPEf     example: 1w3f
     *          third: Row-major representation of the map
     *              W is a wall.
     *              F is a floor.
     *              S is the spawn point (must be on left border of map).
     *              E is the exit point (must be on right border of map).
     *              H is a horizontal door.
     *              V is a vertical door.
     *       Pass null for a random level.
     */
    buildLevel(string) {
        let seed = string;
        for (let i = 0; i < this._width; i++) {
            this._map[i] = [];
        }
        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                let type = seed[(this._width * i) + j];
                if (type === "S") {
                    this._spawn = {x: j, y: i};
                    console.log(this._spawn);
                }
                if (type === "-") {
                    this._floors.push({x: j, y: i});
                }
                if (type === "#") {
                    this._walls.push({x: j, y: i});
                }
                if (type === "H") {
                    this._doors.push({x: j, y: i, d: "H"});
                }
                if (type === "V") {
                    this._doors.push({x: j, y: i, d: "V"});
                }
                if (type === "E") {
                    this._exit = {x: j, y: i};
                }
                this._map[j][i] = type;
            }
        }
		let that = this;
		this.spawners.forEach(function (elem) 
		{
			new Spawner(that.game, elem.x, elem.y, elem.max, elem.freq, elem.list, elem.rand, elem.radius, elem.total);
		});
		/*this.pickups.forEach(function (elem) 
		{
			new Spawner(this.game, elem.x, elem.y, elem.max, elem.freq, elem.list, elem.rand, elem.radius, elem.total);
		});*/
		this.hazards.forEach(function (elem) 
		{
			new Turret(that.game, elem.x, elem.y, elem.fireRate, elem.spinning, elem.cross, elem.pSpeed, elem.pLifeTime, elem.pMove, elem.pEasing);
		});

    }

    /**
     * @param {string) levelString A string that stores the information for the
     *      requested level. Formatting (all in one line):
     *          first: WIDTHxHEIGHTy            example: 20x15y
     *          second: WALLTYPEwFLOORTYPEf     example: 1w3f
     *          third: Row-major representation of the map
     *              W is a wall.
     *              F is a floor.
     *              S is the spawn point (must be on left border of map).
     *              E is the exit point (must be on right border of map).
     *              H is a horizontal door.
     *              V is a vertical door.
     *       Pass null for a random level.
     * @param {array} spawners An array of spawner objects.
     */
    resetLevel(level) {
        this._map = [];
        this._width = level.width;
        this._height = level.height;
        this._spawn = null;
        this._floors = [];
        this._walls = [];
        this._doors = [];
        this._exit = null;
        this._wallType = level.wallType;
        this._floorType = level.floorType;
        this.spawners = level.spawnerList;
        this.pickups = level.pickupList;
        this.hazards = level.hazardList;
        this.buildLevel(level.layout);
    }
	
	

    /**
     * @param {object} point The indices of the array youd like to access.
     *      Example: {x: 0, y: 0}.
     * @returns {string} Returns the map element at the given indices.
     *      W is a wall.
     *      F is a floor.
     *      S is the spawn point (must be on left border of map).
     *      E is the exit point (must be on right border of map).
     *      H is a horizontal door.
     *      V is a vertical door.
     */
    mapElementAt(point){
        if (point.x >= 0 && point.y >= 0 && point.x < this._width && point.y < this._height) {
            return this._map[point.x][point.y];
        }
        return null;
    }

    move(collider, prevPos, newPos) {
        let updatedPos = newPos;
        let origin = {x: coordinateToIndex(prevPos.x), y: coordinateToIndex(prevPos.y)};
        // Check if reached end of level.
        if (this.mapElementAt({x: coordinateToIndex(updatedPos.x), y: coordinateToIndex(updatedPos.y)}) === "E") {
            console.log("END OF LEVEL REACHED!");
        }
        // Center
        if (this.mapElementAt({x: origin.x, y: origin.y}) === "#") {
            let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: indexToCoordinate(origin.x), y: indexToCoordinate(origin.y)}, 
                new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
            updatedPos.x = c.pos1.x;
            updatedPos.y = c.pos1.y;
        } else if (this.mapElementAt({x: origin.x, y: origin.y}) === "H") {
            if (this.game.player.keys
                && checkCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: indexToCoordinate(origin.x), y: indexToCoordinate(origin.y)}, 
                new Collider(0, 0, 48, 48, 8, 8, null, Infinity))) {
                    this._map[origin.x][origin.y] = "-";
                    var removeDoor = -1;
                    for (var i = 0; i < this._doors.length; i++) {
                        if (this._doors[i].d === "H" && this._doors[i].x === origin.x && this._doors[i].y === origin.y) {
                            removeDoor = i;
                        }
                    }
                    this._doors.splice(removeDoor, 1);
                    this._floors.push({x: origin.x, y: origin.y});
                    this.game.player.keys -= 1;
            } else {
                let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                    collider,
                    {x: indexToCoordinate(origin.x), y: indexToCoordinate(origin.y)}, 
                    new Collider(0, 0, 48, 48, 8, 8, null, Infinity));
                updatedPos.x = c.pos1.x;
                updatedPos.y = c.pos1.y;
            }
        } else if (this.mapElementAt({x: origin.x, y: origin.y}) === "V") {
            if (this.game.player.keys
                && checkCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: indexToCoordinate(origin.x), y: indexToCoordinate(origin.y)}, 
                new Collider(0, 0, 8, 8, 48, 48, null, Infinity))) {
                    this._map[origin.x][origin.y] = "-";
                    var removeDoor = -1;
                    for (var i = 0; i < this._doors.length; i++) {
                        if (this._doors[i].d === "V" && this._doors[i].x === origin.x && this._doors[i].y === origin.y) {
                            removeDoor = i;
                        }
                    }
                    this._doors.splice(removeDoor, 1);
                    this._floors.push({x: origin.x, y: origin.y});
                    this.game.player.keys -= 1;
            } else {
                let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                    collider,
                    {x: indexToCoordinate(origin.x), y: indexToCoordinate(origin.y)}, 
                    new Collider(0, 0, 8, 8, 48, 48, null, Infinity));
                updatedPos.x = c.pos1.x;
                updatedPos.y = c.pos1.y;
            }
        }

        // Left
        if (origin.x > 0) {
            if (this.mapElementAt({x: origin.x - 1, y: origin.y}) === "#") {
                let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                    collider,
                    {x: indexToCoordinate(origin.x - 1), y: indexToCoordinate(origin.y)}, 
                    new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
                updatedPos.x = c.pos1.x;
                updatedPos.y = c.pos1.y;
            }
        }

        // Up
        if (origin.y > 0) {
            if (this.mapElementAt({x: origin.x, y: origin.y - 1}) === "#") {
                let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                    collider,
                    {x: indexToCoordinate(origin.x), y: indexToCoordinate(origin.y - 1)}, 
                    new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
                updatedPos.x = c.pos1.x;
                updatedPos.y = c.pos1.y;
            }
        }

        // Right
        if (origin.x < this._width - 1) {
            if (this.mapElementAt({x: origin.x + 1, y: origin.y}) === "#") {
                let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                    collider,
                    {x: indexToCoordinate(origin.x + 1), y: indexToCoordinate(origin.y)}, 
                    new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
                updatedPos.x = c.pos1.x;
                updatedPos.y = c.pos1.y;
            }
        }

        // Down
        if (origin.y < this._height - 1) {
            if (this.mapElementAt({x: origin.x, y: origin.y + 1}) === "#") {
                let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                    collider,
                    {x: indexToCoordinate(origin.x), y: indexToCoordinate(origin.y + 1)}, 
                    new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
                updatedPos.x = c.pos1.x;
                updatedPos.y = c.pos1.y;
            }
        }

        return updatedPos;
    }

    get spawn() {
        return this._spawn;
    }
}

/**
 * @param {num} index An index from the level array.
 * @returns Returns center coordinate of the tile referenced by index.
 */
function indexToCoordinate(index) {
	return index * 96 + 48;
}

function coordinateToIndex(coordinate) {
	return Math.floor(coordinate / 96);
}
