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
     */
    constructor(levelString) {
        this.resetLevel(levelString);
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
        this._width = seed.slice(0, seed.indexOf("x"));
        seed = seed.slice(seed.indexOf("x") + 1, seed.length);
        this._height = seed.slice(0, seed.indexOf("y"));
        seed = seed.slice(seed.indexOf("y") + 1, seed.length);
        this._wallType = seed.slice(0, seed.indexOf("w"));
        seed = seed.slice(seed.indexOf("w") + 1, seed.length);
        this._floorType = seed.slice(0, seed.indexOf("f"));
        seed = seed.slice(seed.indexOf("f") + 1, seed.length);
        for (let i = 0; i < this._width; i++) {
            this._map[i] = [];
        }
        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                let type = seed[(this._width * i) + j];
                if (type === "S") {
                    this._spawn = {x: j, y: i};
                }
                if (type === "F") {
                    this._floors.push({x: j, y: i});
                }
                if (type === "W") {
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
    resetLevel(string) {
        this._map = [];
        this._width = null;
        this._height = null;
        this._spawn = null;
        this._floors = [];
        this._walls = [];
        this._doors = [];
        this._exit = null;
        this._wallType = null;
        this._floorType = null;
        this.buildLevel(string);
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

    /**
     * @param {num} index An index from the level array.
     * @returns Returns center coordinate of the tile referenced by index.
     */
    indexToCoordinate(index) {
        return index * 96 + 48;
    }

    coordinateToIndex(coordinate) {
        return Math.floor(coordinate / 96);
    }


    move(collider, prevPos, newPos) {
        let updatedPos = newPos;
        let origin = {x: this.coordinateToIndex(prevPos.x), y: this.coordinateToIndex(prevPos.y)};

        // Center
        if (this.mapElementAt({x: origin.x, y: origin.y}) === "W") {
            let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: this.indexToCoordinate(origin.x), y: this.indexToCoordinate(origin.y)}, 
                new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
            updatedPos.x = c.pos1.x;
            updatedPos.y = c.pos1.y;
        }

        // Left
        if (origin.x > 0 && this.mapElementAt({x: origin.x - 1, y: origin.y}) === "W") {
            let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: this.indexToCoordinate(origin.x - 1), y: this.indexToCoordinate(origin.y)}, 
                new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
            updatedPos.x = c.pos1.x;
            updatedPos.y = c.pos1.y;
        }

        // Up
        if (origin.y > 0 && this.mapElementAt({x: origin.x, y: origin.y - 1}) === "W") {
            let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: this.indexToCoordinate(origin.x), y: this.indexToCoordinate(origin.y - 1)}, 
                new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
            updatedPos.x = c.pos1.x;
            updatedPos.y = c.pos1.y;
        }

        // Right
        if (origin.x < this._width - 1 && this.mapElementAt({x: origin.x + 1, y: origin.y}) === "W") {
            let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: this.indexToCoordinate(origin.x + 1), y: this.indexToCoordinate(origin.y)}, 
                new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
            updatedPos.x = c.pos1.x;
            updatedPos.y = c.pos1.y;
        }

        // Down
        if (origin.y < this._height - 1 && this.mapElementAt({x: origin.x, y: origin.y + 1}) === "W") {
            let c = pushCollision({x: updatedPos.x, y: updatedPos.y},
                collider,
                {x: this.indexToCoordinate(origin.x), y: this.indexToCoordinate(origin.y + 1)}, 
                new Collider(0, 0, 48, 48, 48, 48, null, Infinity));
            updatedPos.x = c.pos1.x;
            updatedPos.y = c.pos1.y;
        }

        if (this.mapElementAt({x: this.coordinateToIndex(updatedPos.x), y: this.coordinateToIndex(updatedPos.y)}) === "E") {
            console.log("END OF LEVEL REACHED!");
        }
        

        return updatedPos;
    }
}