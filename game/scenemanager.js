class SceneManager
{
	constructor(game)
	{
		this.game = game;
		this.revived = [];
	}
	
	LoadLevel(levelFile)
	{
		this.levelFile = levelFile;
		this.level = new Level(this.game, this.levelFile);
	}

	levelComplete() {
		
		this.game.game_state = GAME_STATES.CHANGING_LEVEL;
		
		// Player's final position
		let playPos = {x: this.game.player.x, y: this.game.player.y};
		// Remaining party members as NPC's.
		let remaining = [];

		remaining.push(new NPC(this.game, this.game.player.characterClass));
		this.game.player.destroy();
		//this.game.player.removeFromWorld = true;
		this.game._entities[LAYERS.MAIN].forEach((ent) => {
			if (ent instanceof NPC) {
				remaining.push(new NPC(this.game, ent.characterClass));
			}
		});
		let that = this;
		this.revived.forEach(function(elem) {
			remaining.push(new NPC(that.game, elem.characterClass));
		});

		new Transition(this.game, remaining, playPos, new this.levelFile.nextLevel.constructor());
		this.revived = [];
	}
	
	Reset()
	{
		this.LoadLevel(new Level1());
	}
	
}