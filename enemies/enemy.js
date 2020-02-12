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
        let that = this;
        let myIndex = {x: coordinateToIndex(this.x), y: coordinateToIndex(this.y)};
        let playerIndex = {x: coordinateToIndex(this.game.player.x), y: coordinateToIndex(this.game.player.y)};

        let vecToPlayer = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
        let normVecToPlayer = normalizeV(vecToPlayer);
        console.log("PLAYER" + playerIndex.x + ", " + playerIndex.y);

        if (lengthV(vecToPlayer) < range) {
            let queue = [];
            console.log("init: " + myIndex.x + ", " + myIndex.y);

            //If we're in the same tile as the player
            if (playerIndex.x === myIndex.x && playerIndex.y === myIndex.y) {
                // Go straight toward the player
                this.go(normVecToPlayer);
                return;
            }
            let visited = [{x: myIndex.x, y: myIndex.y}];

            let directions = this.getDirections(myIndex.x, myIndex.y, visited);
            directions.forEach(function (dir) {

                let newNode = {x: myIndex.x + dir.x, y: myIndex.y + dir.y};
                console.log("====" + newNode.x + ", " + newNode.y);

                //If we are 1 tile away from the player
                if (newNode.x === playerIndex.x && newNode.y === playerIndex.y) {
                    // Go straight toward the player
                    that.go(normVecToPlayer);
                    return;
                }
                newNode.dir = dir;
                queue.push(newNode);
                visited.push(newNode);
            });

            for (let i = 0; i < depth; i++) {
                let node = queue.shift();
                if (node) {
                    console.log("----" + node.x + ", " + node.y);
                    if (playerIndex.x === node.x && playerIndex.y === node.y) {
                        this.go(node.dir);
                        return;
                    } else {
                        directions = this.getDirections(node.x, node.y, visited);
                        directions.forEach(function (dir) {
                            let newNode = {x: node.x + dir.x, y: node.y + dir.y};
                            newNode.dir = node.dir;
                            queue.push(newNode);
                            visited.push(newNode);
                        });
                    }
                }
            }
        }
    }

    getDirections(x, y, visited) {
        let directions = [];

        let left = {x: x - 1, y: y};
        let right = {x: x + 1, y: y};
        let up = {x: x, y: y - 1};
        let down = {x: x, y: y + 1};

        if (this.game.sceneManager.level.mapElementAt(left) === "-" && !visited.includes(left)) {
            directions.push({x: -1, y: 0});
        }
        if (this.game.sceneManager.level.mapElementAt(right) === "-" && !visited.includes(right)) {
            directions.push({x: 1, y: 0});
        }
        if (this.game.sceneManager.level.mapElementAt(up) === "-" && !visited.includes(up)) {
            directions.push({x: 0, y: -1});
        }
        if (this.game.sceneManager.level.mapElementAt(down) === "-" && !visited.includes(down)) {
            directions.push({x: 0, y: 1});
        }

        return directions;
    }

    go(dir) {
        this.x += dir.x * this.game._clockTick * this.speed;
        this.y += dir.y * this.game._clockTick * this.speed;
    }
}