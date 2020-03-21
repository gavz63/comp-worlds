class WallObject extends Entity {
    constructor(game, x, y) {
        super(game, x, y);

        this.game.sceneManager.level._walls.push({x: this.x, y: this.y});
        //console.log(this.game.sceneManager.level._map[this.x][this.y]);
        this.game.sceneManager.level._map[this.x][this.y] = "#";
    }
    
    draw() {}

    update() {}

    destroy() {
      this.game.sceneManager.level._walls.pop();
      this.game.sceneManager.level._map[this.x][this.y] = "-";
    }
    
    takeDamage(dmg, dir, knockBack)
    {
    }
}