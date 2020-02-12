class Enemy extends Entity {
    constructor(game, x, y, spawner) {
        super(game, x, y);
        this.spawner = spawner;
        this.game.addEntity(this, LAYERS.ENEMIES);
    }

    destroy() {
        this.spawner.spawn_timer.unpause();
        this.spawner.numOut--;
        this.spawner.spawn_timer.unpause();
        new Remnant(this.game, this.x, this.y, this.deathAnimation);
        super.destroy();
    }

    pathfind(range, depth) {
        let myIndex = {x: coordinateToIndex(this.x), y: coordinateToIndex(this.y)};
        let playerIndex = {x: coordinateToIndex(this.game.player.x), y: coordinateToIndex(this.game.player.y)};

        let vecToPlayer = dirV({x: this.x, y: this.y}, {x: this.game.player.x, y: this.game.player.y});
        let normVecToPlayer = normalizeV(vecToPlayer);

        if (lengthV(vecToPlayer) < range) {
            console.log("in range");

            //If we're in the same tile as the player or 1 tile away
            if ((playerIndex.x === myIndex.x &&
                (playerIndex.y === myIndex.y || playerIndex.y === myIndex.y + 1 || playerIndex.y === myIndex.y - 1)) ||
                (playerIndex.y === myIndex.y && (playerIndex.x === myIndex.x + 1 || playerIndex.x === myIndex.x - 1))) {
                // Go straight toward the player
                this.go(normVecToPlayer);
                return;
            }

            //Not close enough for a straight line, enqueue all adjacent nodes
            let queue = [];
            let visited = [{x: myIndex.x, y: myIndex.y}];

            console.log("PLAYER: " + playerIndex.x + ", " + playerIndex.y);
            console.log("ME: " + myIndex.x + ", " + myIndex.y);

            let directions = this.getDirections(myIndex, visited);
            for (let i = 0; i < directions.length; i++) {
                let dir = directions[i];
                let newNode = {x: myIndex.x + dir.x, y: myIndex.y + dir.y};
                newNode.originalDirection = dir;
                queue.push(newNode);
            }

            for (let i = 0; i < depth; i++) {
                let node = queue.shift();
                if (node) {
                    console.log(node.x + ", " + node.y);
                    if (playerIndex.x === node.x && playerIndex.y === node.y) {
                        this.go(node.originalDirection);
                        console.log("found");
                        return;
                    } else {
                        directions = this.getDirections(node, visited);
                        for (let j = 0; j < directions.length; j++) {
                            let newNode = {x: node.x + directions[j].x, y: node.y + directions[j].y};
                            newNode.originalDirection = node.originalDirection;
                            queue.push(newNode);
                            visited.push(newNode);
                        }
                    }
                } else {
                    console.log("EMPTY QUEUE");
                    break;
                }
            }
        }
    }

    getDirections(node, visited) {
        let directions = [];
        let x = node.x;
        let y = node.y;

        let left = {x: x - 1, y: y};
        let right = {x: x + 1, y: y};
        let up = {x: x, y: y - 1};
        let down = {x: x, y: y + 1};

        if (this.game.sceneManager.level.mapElementAt(left) === "-" && !this.isVisited(left, visited)) {
            directions.push({x: -1, y: 0});
        }
        if (this.game.sceneManager.level.mapElementAt(right) === "-" && !this.isVisited(right, visited)) {
            directions.push({x: 1, y: 0});
        }
        if (this.game.sceneManager.level.mapElementAt(up) === "-" && !this.isVisited(up, visited)) {
            directions.push({x: 0, y: -1});
        }
        if (this.game.sceneManager.level.mapElementAt(down) === "-" && !this.isVisited(down, visited)) {
            directions.push({x: 0, y: 1});
        }

        return directions;
    }

    isVisited(node, visited) {
        for (let i = 0; i < visited.length; i++) {
            if (visited[i].x === node.x && visited[i].y === node.y) {
                return true;
            }
        }
        return false;
    }

    go(dir) {
        this.x += dir.x * this.game._clockTick * this.speed;
        this.y += dir.y * this.game._clockTick * this.speed;
        console.log("GOING: " + dir.x + ", " + dir.y);
    }
}