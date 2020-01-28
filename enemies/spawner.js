class Spawner
{
	constructor(game, x, y, frequency, spawnList)
	{
		this.x = x;
		this.y = y;
		this.spawnList = spawnList;
		this.frequency = frequency;

		this.game = game;
		var that = this;
		new TimerCallBack(game, frequency, true,
			function () {
				that.spawn();
			}
		);
	}

	spawn()
	{
		this.game.entities[1].forEach(function(elem) {
			elem.removeFromWorld = true;
		});
		let choice = Math.ceil(Math.random() * this.spawnList.length) - 1;
		let spawn = new this.spawnList[choice].constructor(this.game, this.x, this.y);
	}
}