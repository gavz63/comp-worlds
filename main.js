const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/map/grounds.png");
ASSET_MANAGER.queueDownload("./img/map/walls.png");
ASSET_MANAGER.queueDownload("./img/map/doors.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageSideToSideSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageUpDownSheet.png");
ASSET_MANAGER.queueDownload("./img/hud/Crosshair.png");
ASSET_MANAGER.queueDownload("./img/enemies/Bat.png");
ASSET_MANAGER.queueDownload("./img/enemies/PuddleJumper.png");
ASSET_MANAGER.queueDownload("./img/projectiles/Fireball.png");
ASSET_MANAGER.queueDownload("./img/projectiles/BallPulseBlue.png");
ASSET_MANAGER.queueDownload("./img/projectiles/BallPulseRed.png");
ASSET_MANAGER.queueDownload("./img/projectiles/BallPulseGreen.png");
ASSET_MANAGER.queueDownload("./img/projectiles/PureSlash.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageSideToSideSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageUpDownSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageDmgSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerSideToSideSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerUpDownSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerSpecialMoveAllDirections.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerDmgSheet.png");


ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    let camera = new Camera(ctx);
    let level = new Level("20x20y0w0fWWWWWWWWWWWWWWWWWWWWSFFFFFFFFWWWWFFFWWWWWWWWWWWWFWWWWFFWWWWWWWWWWWWWFWWWWWFWWWWWWWWWWWWWFWWWWWFWWWWWWWWWFFFFFFFFFWFWWFWWWWWWFWWWWWWWFWFWWFWWWWWWFWFWFWFWFWFFFFWWWWWWFWWFWFWWFWFWWFWWWWWWFWFWFWFWFWFWWFWWWFFFFWWWWWWWFWFWWFFWWFWWFFFFFFFFFWFWWWWWWFWWWWWWWWWWWWFWWWWWWFFFFFFWWWWWFFFWWWWWWWWFFFFWWWWWFWWWWWWWWWWFFFFWWFFFFFWWWWWWWWFFFFWWWFWWWFWWFHFWWWWFFFFWWVWWWVWWFWFWWWWWFFFFFFFFFFFFFFFEWWWWWWWWWWWWWWWWWWWW");
    let gameEngine = new GameEngine(camera, level);
    gameEngine.addEntity(camera, "hud");
	gameEngine.AM = ASSET_MANAGER;
    //new MainCharacter(gameEngine);
	
	new Crosshair(gameEngine);
	new Player(gameEngine, new BlackMage());
	
	new Bat(gameEngine, 0, 0);
	
    new Floor(gameEngine);
    new Wall(gameEngine);
	
	let spawnList = [Bat.prototype, PuddleJumper.prototype];
	new Spawner(gameEngine, 300, 100, 3, spawnList); // game, x, y, delay, spawnList
 
    gameEngine.init(ctx);
    gameEngine.start();
});
