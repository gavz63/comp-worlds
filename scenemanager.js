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
	
	Reset()
	{
		this.LoadLevel(new Level1());
	}
	
}