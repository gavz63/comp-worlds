function Spawner(game, x, y, frequency, spawnList)
{
	this.x = x;
	this.y = y;
	this.spawnList = spawnList;
	this.frequency = frequency;
	
	this.game = game;
	var that = this;
	console.log(x);
	game.addTimer(new TimerCallBack(game, frequency, true, function() {that.spawn();}));
}

Spawner.prototype.spawn = function ()
{
	let choice = Math.ceil(Math.random() + 0.5) - 1;
	
	console.log(choice);
	
	let spawn = Object.create(this.spawnList[choice]);
	spawn.init(this.game, this.x, this.y)
	
	this.game.addEntity(spawn, "enemy");
}