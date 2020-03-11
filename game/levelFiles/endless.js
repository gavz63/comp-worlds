class Endless {
	constructor() {
		this.width = Math.floor(Math.random() * 25) + 20;
        this.height = Math.floor(Math.random() * 25) + 20;
        let randomness = Math.floor(Math.random() * 100);
        if (randomness < 50) this.floorType = 0;
        if (randomness >= 50 && randomness < 75) this.floorType = 3;
        if (randomness >= 75 && randomness < 87) this.floorType = 1;
        if (randomness >= 87 && randomness < 100) this.floorType = 2;
		if (this.floorType <= 0) {
            this.wallType = 0;
        } else {
            this.wallType = 1;
        }
		this.nextLevel = Endless.prototype;
		this.musicId = 'hedgeMazeMusic';

		this.layout = this.buildLevel();

		this.roomSpawnerList = [];
		this.spawnerList = [];
		this.turretList = [];
		this.spawnerProjectileList = [];
		this.pickupList = [];
        this.unlockableCharacter = [];
        this.playerSpawner = {
            maxAtOnce: 15,
            spawnList:
            [Bat.prototype, CactusBoi.prototype, HedgeMonster.prototype,
            PuddleJumper.prototype, Skeleton.prototype, Snek.prototype,
            StoneGolem.prototype, Turtle.prototype, Snak.prototype],
            probs: [50, // Bat
                10, // Cactus
                (this.floorType === 0) ? 1 : 0, // Hedge Monster
                40, // Puddle Jumper
                35, // Skeleton
                20, // Snek
                15, // Stone Golem
                5, // Turtle
                5 // Snak
            ]
        };

        let key;
        do {
            key = {x: 2 + Math.floor(Math.random() * (this.width - 4)), y: 2 + Math.floor(Math.random() * (this.height - 4))};
        } while (this.layout.charAt(key.y * this.width + key.x) !== '-');
        this.pickupList.push({
              x: key.x,
              y: key.y,
              type: Key.prototype
            });
    }
    

    buildLevel() {
        let map = [];
    
        // Build Map
        for (let i = 0; i < this.width; i++) {
            map[i] = [];
        }
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                map[x][y] = {tile: "#", massID: null, massSize: 0};
                if (x < 2 || x >= this.width - 2 || y < 2 || y >= this.height - 2) {
                    // Outer walls.
                    map[x][y].massID = undefined;
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
        map[exit.x - 1][exit.y].tile = "H";
        map[exit.x - 2][exit.y].tile = "-";

        // Draws a path.
        let drawPath = (pos1, pos2) => {
            let p1 = pos1;
            let p2 = pos2;
            if (p1.x > p2.x) {p1 = pos2; p2 = pos1;}
            let slope = 1;
            if (p2.x - p1.x !== 0) slope = (p2.y - p1.y) / (p2.x - p1.x);

            for (let x = p1.x; x <= p2.x; x++) {
                if (x !== p1.x || x === p2.x) {
                    if (p1.y <= p2.y) {
                        for (let y = Math.floor(p1.y + (x - 1 - p1.x) * slope); y <= Math.ceil(p2.y - (p2.x - x) * slope); y++) {
                            if (x > 1 && y > 1 && x < this.width - 2 && y < this.height - 2) map[x][y].tile = "-";
                        }
                    } else {
                        for (let y = Math.ceil(p1.y + (x - 1 - p1.x) * slope); y >= Math.floor(p2.y - (p2.x - x) * slope); y--) {
                            if (x > 1 && y > 1 && x < this.width - 2 && y < this.height - 2) map[x][y].tile = "-";
                        }
                    }
                }
            }
        }


        // Create a room.
        let createRoom = (pos, size) => {
            if (pos.x > 1 && pos.y > 1 && pos.x < this.width - 2 && pos.y < this.height - 2) {
                let p = pos;
                let s = size;
                while (pos.x + s.x >= this.width - 2) {
                    s.x = s.x - 1;
                }
                while (pos.y + s.y >= this.height - 2) {
                    s.y = s.y - 1;
                }

                for (let y = p.y; y <= p.y + s.y; y++) {
                    for (let x = p.x; x <= p.x + s.x; x++) {
                        map[x][y].tile = "-";
                    }
                }

                if (s.x > 5 && s.y > 5) {
                    if (map[p.x - 1][p.y].tile === "#"
                    && map[p.x][p.y - 1].tile === "#"
                    && map[p.x - 1][p.y + 1].tile === "#"
                    && map[p.x + 1][p.y - 1].tile === "#") 
                        map[p.x][p.y].tile = "#";
                    if (map[p.x][p.y].tile === "#") map[p.x + 1][p.y].tile = "#";
                    if (map[p.x][p.y].tile === "#") map[p.x][p.y + 1].tile = "#";

                    if (map[p.x + s.x + 1][p.y].tile === "#"
                    && map[p.x + s.x][p.y - 1].tile === "#"
                    && map[p.x + s.x + 1][p.y + 1].tile === "#"
                    && map[p.x + s.x - 1][p.y - 1].tile === "#") 
                        map[p.x + s.x][p.y].tile = "#";
                    if (map[p.x + s.x][p.y].tile === "#") map[p.x + s.x - 1][p.y].tile = "#";
                    if (map[p.x + s.x][p.y].tile === "#") map[p.x + s.x][p.y + 1].tile = "#";

                    if (map[p.x - 1][p.y + s.y].tile === "#"
                    && map[p.x][p.y + s.y + 1].tile === "#"
                    && map[p.x - 1][p.y + s.y - 1].tile === "#"
                    && map[p.x + 1][p.y + s.y + 1].tile === "#") 
                        map[p.x][p.y + s.y].tile = "#";
                    if (map[p.x][p.y + s.y].tile === "#") map[p.x][p.y + s.y - 1].tile = "#";
                    if (map[p.x][p.y + s.y].tile === "#") map[p.x + 1][p.y + s.y].tile = "#";

                    if (map[p.x + s.x + 1][p.y + s.y].tile === "#"
                    && map[p.x + s.x][p.y + s.y + 1].tile === "#"
                    && map[p.x + s.x + 1][p.y + s.y - 1].tile === "#"
                    && map[p.x + s.x - 1][p.y + s.y + 1].tile === "#") 
                        map[p.x + s.x][p.y + s.y].tile = "#";
                    if (map[p.x + s.x][p.y + s.y].tile === "#") map[p.x + s.x - 1][p.y + s.y].tile = "#";
                    if (map[p.x + s.x][p.y + s.y].tile === "#") map[p.x + s.x][p.y + s.y - 1].tile = "#";

                    let r = Math.random();
                    for (let y = p.y + 2; y <= p.y + s.y - 2; y++) {
                        for (let x = p.x + 2; x <=  p.x + s.x - 2; x++) {
                            if (r > .5) {
                                map[x][y].tile = "P";
                            } else {
                                map[x][y].tile = "#";
                            }
                        }
                    }

                    map[p.x + 2][p.y + 2].tile = "-";
                    map[p.x + s.x - 2][p.y + 2].tile = "-";
                    map[p.x + 2][p.y + s.y - 2].tile = "-";
                    map[p.x + s.x - 2][p.y + s.y - 2].tile = "-";
                }
            }
        };

        // Returns the center of a room.
        let roomCenter = (room) => {
            return {x: room.pos.x + Math.floor(room.size.x / 2), y: room.pos.y + Math.floor(room.size.y / 2)};
        }


        // Generate rooms.
        let rooms = [];
        let hRooms = Math.floor((this.width - 4) / 10);
        let vRooms = Math.floor((this.height - 4) / 10);
        for (let y = 0; y < vRooms; y++) {
            for (let x = 0; x < hRooms; x++) {
                let roomWidth = 2 + Math.floor(Math.random() * 8);
                let roomHeight = 2 + Math.floor(Math.random() * 8);
                rooms.push({
                    pos: {
                        //x: Math.floor((this.width - 4 - 10 * hRooms) / 2) + 2 + 12 * x + Math.floor((10 - roomWidth) / 2),
                        x: (x * 10) + Math.floor((this.width - (hRooms * 10)) / 2) + Math.floor((10 - roomWidth) / 2),
                        //y: Math.floor((this.height - 4 - 10 * vRooms) / 2) + 2 + 12 * y + Math.floor((10 - roomHeight) / 2)},
                        y: (y * 10) + Math.floor((this.height - (vRooms * 10)) / 2 + Math.floor((10 - roomHeight) / 2))},
                    size: {x: roomWidth, y: roomHeight}, neighbors: [], v: false});
            }
        }
        let checkComplete = () => {
            rooms.forEach((r) => {
                r.v = false;
            });
            let tally = 1;
            let cR;

            let queue = [];
            queue.push(rooms[0]);
            rooms[0].v = true;

            do {
                cR = queue.shift();
                cR.neighbors.forEach((n) => {
                    if (n.v === false) {
                        n.v = true;
                        queue.push(n);
                        tally++
                    }
                });
            } while (queue.length > 0);
            return tally >= rooms.length;
        };

        // Connect spawn and exit to closest rooms.
        let closest = {room: null, dist: Infinity};
        rooms.forEach((r) => {
            let dist = Math.sqrt(Math.pow(spawn.x + 2 - roomCenter(r).x, 2) + Math.pow(spawn.y - roomCenter(r).y, 2));
            if (dist < closest.dist) {
                closest.room = r;
                closest.dist = dist;
            }
        });
        drawPath({x: spawn.x + 2, y: spawn.y}, {x: roomCenter(closest.room).x, y: roomCenter(closest.room).y});
        let first = closest.room;
        closest = {room: null, dist: Infinity};
        rooms.forEach((r) => {
            let dist = Math.sqrt(Math.pow(exit.x - 2 - roomCenter(r).x, 2) + Math.pow(exit.y - roomCenter(r).y, 2));
            if (dist < closest.dist) {
                closest.room = r;
                closest.dist = dist;
            }
        });
        drawPath({x: exit.x - 2, y: exit.y}, {x: roomCenter(closest.room).x, y: roomCenter(closest.room).y});
        let last = closest.room;


        // Connect all rooms.
        rooms.forEach((r) => {
            let choices = [];
            rooms.forEach((c) => {
                let alr = false;
                c.neighbors.forEach((ne) => {
                    if (ne === r) alr = true;
                });
                if (Math.abs(roomCenter(c).x - roomCenter(r).x) < 15 && Math.abs(roomCenter(c).y - roomCenter(r).y) < 15 && c !== r && !alr) choices.push(c);
            });
            if (choices.length > 0) {
                choices = choices[Math.floor(Math.random() * choices.length)];
                drawPath({x: roomCenter(r).x, y: roomCenter(r).y}, {x: roomCenter(choices).x, y: roomCenter(choices).y});
                r.neighbors.push(choices);
                choices.neighbors.push(r);
            }
        });
        while (!checkComplete()) {
            let a = rooms[Math.floor(Math.random() * rooms.length)];
            let choices = [];
            rooms.forEach((c) => {
                let alr = false;
                c.neighbors.forEach((ne) => {
                    if (ne === a) alr = true;
                });
                if (Math.abs(roomCenter(c).x - roomCenter(a).x) < 15 && Math.abs(roomCenter(c).y - roomCenter(a).y) < 15 && c !== a && !alr) choices.push(c);
            });
            if (choices.length > 0) {
                choices = choices[Math.floor(Math.random() * choices.length)];
                drawPath({x: roomCenter(a).x, y: roomCenter(a).y}, {x: roomCenter(choices).x, y: roomCenter(choices).y});
                a.neighbors.push(choices);
                choices.neighbors.push(a);
            }
        }

        // Draw all rooms.
        rooms.forEach((r) => {
            createRoom(r.pos, r.size);
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
    
    /*
     //First Attempt
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
    }*/
    
}