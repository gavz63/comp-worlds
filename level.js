// Gordon McCreary (January 23, 2020)

/*
Level


*/
class Level {

    constructor(string) {
        this._map = [];
        this._width = null;
        this._height = null;
        this._spawn = null;
        this._doors = [];
        this._exit = null;
        this._wallType = null;
        this._floorType = null;
        this.buildLevel(string);
    }

    buildLevel(string) {
        let seed = string;
        this._width = seed.slice(0, seed.indexOf("x"));
        seed = seed.slice(seed.indexOf("x") + 1, seed.length);
        this._height = seed.slice(0, seed.indexOf("y"));
        seed = seed.slice(seed.indexOf("y") + 1, seed.length);
        this._wallType = seed.slice(0, seed.indexOf("w"));
        seed = seed.slice(seed.indexOf("w") + 1, seed.length);
        this._floorType = seed.slice(0, seed.indexOf("f"));
        console.log(`FLOOR TYPE: ${this._floorType}`);
        seed = seed.slice(seed.indexOf("f") + 1, seed.length);
        for (let i = 0; i < this._width; i++) {
            this._map[i] = [];
        }
        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                let type = seed[(this._width * i) + j];
                if (type === "S") {
                    this._spawn = {x: i, y: j};
                }
                if (type === "H") {
                    this._door.push({x: i, y: j, d: "H"});
                }
                if (type === "V") {
                    this._door.push({x: i, y: j, d: "V"});
                }
                if (type === "E") {
                    this._exit = {x: i, y: j};
                }
                this._map[j][i] = type;
            }
        }
    }

    resetLevel(string) {
        this._map = [];
        this._width = null;
        this._height = null;
        this._spawn = null;
        this._doors = [];
        this._exit = null;
        this._wallType = null;
        this._floorType = null;
        this.buildLevel(string);
    }

    mapElementAt(point){
        return this._map[point.x][point.y];
    }

    indexToCoordinate(index) {
        return index * STANDARD_DRAW_SCALE * 96 + 48;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get wallType() {
        return this._wallType;
    }

    get floorType() {
        return this._floorType;
    }

    get spawn() {
        return this._spawn;
    }
}