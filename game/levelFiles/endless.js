class Endless {
	constructor() {
		this.width = Math.floor(Math.random() * 40) + 20;
		this.height = Math.floor(Math.random() * 25) + 20;
		this.floorType = 0;
		this.wallType = 0;
		this.nextLevel = Endless.prototype;
		this.musicId = 'hedgeMazeMusic';

		this.layout = this.buildLevel();

		this.roomSpawnerList = [];
		this.spawnerList = [];
		this.turretList = [];
		this.spawnerProjectileList = [];
		this.pickupList = [];
        this.unlockableCharacter = [];
    }
    
    buildLevel() {
        let map = [];
    
        // Build Map
        for (let i = 0; i < this.width; i++) {
            map[i] = [];
        }
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                map[x][y] = {tile: "#", visited: false};
                if (x < 2 || x >= this.width - 2 || y < 2 || y >= this.height - 2) {
                    map[x][y].visited = true;
                }
            }
        }
    
        // Spawn and Exit
        let spawn = {x: 0, y: 2 + Math.floor(Math.random() * (this.height - 4))};
        let exit = {x: this.width - 1, y: 2 + Math.floor(Math.random() * (this.height - 4))};
        map[spawn.x][spawn.y].tile = "S";
        map[spawn.x + 1][spawn.y].tile = "-";
        map[spawn.x + 2][spawn.y].tile = "-";
        map[exit.x][exit.y].tile = "E";
        map[exit.x - 1][exit.y].tile = "-";
        map[exit.x - 2][exit.y].tile = "-";
        spawn.x += 2;
        exit.x -= 2;
    
        // Build Path
        let find = (cur, path) => {
            if (cur.x === exit.x && cur.y === exit.y) {
                return path;
            }
            let choices = [];
            if (cur.x + 1 < this.width - 2 && !map[cur.x + 1][cur.y].visited) {
                choices.push({x: cur.x + 1, y: cur.y});
                choices.push({x: cur.x + 1, y: cur.y});
            }
            if (cur.x - 1 >= 2 && !map[cur.x - 1][cur.y].visited) {
                choices.push({x: cur.x - 1, y: cur.y});
                choices.push({x: cur.x - 1, y: cur.y});
                choices.push({x: cur.x - 1, y: cur.y});
            }
            if (cur.y + 1 < this.height - 2 && !map[cur.x][cur.y + 1].visited) {
                choices.push({x: cur.x, y: cur.y + 1});
                choices.push({x: cur.x, y: cur.y + 1});
                choices.push({x: cur.x, y: cur.y + 1});
                choices.push({x: cur.x, y: cur.y + 1});
            }
            if (cur.y - 1 >= 2 && !map[cur.x][cur.y - 1].visited) {
                choices.push({x: cur.x, y: cur.y - 1});
                choices.push({x: cur.x, y: cur.y - 1});
                choices.push({x: cur.x, y: cur.y - 1});
                choices.push({x: cur.x, y: cur.y - 1});
            }
            if (choices.length === 0) {
                path.forEach((pos) => {
                    map[pos.x][pos.y].visited = false;
                });
                return null;
            }
    
            let choice = Math.floor(Math.random() * choices.length);
            path.push(choices[choice]);
            map[choices[choice].x][choices[choice].y].visited = true;
            return find(choices[choice], path);
            
        };
    
        let path;
        do {
            path = find(spawn, []);
        } while (path === null);
    
    
        let rad = (pos, radius) => {
            map[pos.x][pos.y].tile = "-";
            if (radius >= 2) {
                if (pos.x + 1 < this.width - 2) map[pos.x + 1][pos.y].tile = "-";
                if (pos.x - 1 >= 2) map[pos.x - 1][pos.y].tile = "-";
                if (pos.y + 1 < this.height - 2) map[pos.x][pos.y + 1].tile = "-";
                if (pos.y - 1 >= 2) map[pos.x][pos.y - 1].tile = "-";
            }
        };
        path.forEach((pos) => {
            rad(pos, Math.ceil(Math.random() * 2));
        });
    
    
        // Convert to String
        let result = "";
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                result += map[x][y].tile;
            }
        }
    
        return result;
    }
}