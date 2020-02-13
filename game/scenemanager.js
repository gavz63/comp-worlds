class SceneManager
{
	constructor(game)
	{
		this.game = game;
	}
	
	LoadLevel(levelFile)
	{
		this.levelFile = levelFile;
		this.level = new Level(this.game, this.levelFile);
	}

	levelComplete() {
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

		new Transition(this.game, remaining, playPos, new Level1());
	}
	
	Reset()
	{
		this.LoadLevel(new Level1());
	}
	
}