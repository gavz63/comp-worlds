function Spawner(game, x, y, frequency, spawnList) {
    this.x = x;
    this.y = y;
    this.spawnList = spawnList;
    this.frequency = frequency;

    this.game = game;
    var that = this;
    game.addTimer(new TimerCallBack(game, frequency, true, function () {
        that.spawn();
    }));
}

Spawner.prototype.spawn = function () {
	this.game.entities[1].forEach(function(elem) {
		elem.removeFromWorld = true;
	});
    let choice = Math.ceil(Math.random() * this.spawnList.length) - 1;
    let spawn = Object.create(this.spawnList[choice]);
    spawn.init(this.game, this.x, this.y);

    this.game.addEntity(spawn, "enemy");
};