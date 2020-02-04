const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/map/grounds.png");
ASSET_MANAGER.queueDownload("./img/map/walls.png");
ASSET_MANAGER.queueDownload("./img/map/doors.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageSideToSideSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageUpDownSheet.png");
ASSET_MANAGER.queueDownload("./img/hud/Crosshair.png");
ASSET_MANAGER.queueDownload("./img/enemies/Bat.png");
ASSET_MANAGER.queueDownload("./img/enemies/PuddleJumper.png");
ASSET_MANAGER.queueDownload("./img/enemies/PuddleDeath.png");
ASSET_MANAGER.queueDownload("./img/enemies/SkeletonWalk.png");
ASSET_MANAGER.queueDownload("./img/enemies/SkeletonAttack.png");
ASSET_MANAGER.queueDownload("./img/enemies/SkeletonDeath.png");
ASSET_MANAGER.queueDownload("./img/projectiles/Fireball.png");
ASSET_MANAGER.queueDownload("./img/projectiles/BallPulseBlue.png");
ASSET_MANAGER.queueDownload("./img/projectiles/BallPulseRed.png");
ASSET_MANAGER.queueDownload("./img/projectiles/BallPulseGreen.png");
ASSET_MANAGER.queueDownload("./img/projectiles/PureSlash.png");
ASSET_MANAGER.queueDownload("./img/projectiles/BoneProjectile.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageSideToSideSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageUpDownSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/BlackMageDmgSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerSideToSideSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerUpDownSheet.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerSpecialMoveAllDirections.png");
ASSET_MANAGER.queueDownload("./img/player_characters/LancerDmgSheet.png");
ASSET_MANAGER.queueDownload("./img/hud/ControllerTutorial.png");
ASSET_MANAGER.queueDownload("./img/hud/HoverArrow.png");
ASSET_MANAGER.queueDownload("./img/hud/menucursor.png");
ASSET_MANAGER.queueDownload("./img/hud/Heart.png");
ASSET_MANAGER.queueDownload("./img/hud/ChangeDoorsWallsButtons.png");
ASSET_MANAGER.queueDownload("./img/hud/ChooseYourFighter.png");
ASSET_MANAGER.queueDownload("./img/pickups/key.png");
ASSET_MANAGER.queueDownload("./img/pickups/potions.png");

ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    let camera = new Camera(ctx);

    let gameEngine = new GameEngine(camera);
    let spawners = [];
    spawners.push(new Spawner(gameEngine,
        300, 100,
        0, 10000,
        [Bat.prototype, PuddleJumper.prototype, Skeleton.prototype],
        false, 2000, 0));
    let level = new Level("20x20y0w0fWWWWWWWWWWWWWWWWWWWWSFFFFFFFFWWWWFFFWWWWWWFFFWWWFWWWWFFWWWWWWWWWWWWWFWWWWWFWWWWWWWWWWWWWFWWWWWFWWWWWWWWWFFFFFFFFFWFWWFWWWWWWFWWWWWWWFWFWWFWWWWWWFWFWFWFWFWFFFFWWWWWWFWWFWFWWFWFWWFWWWWWWFWFWFWFWFWFWWFWWWFFFFWWWWWWWFWFWWFFWWFWWFFFFFFFFFWFWWWWWWFWWWWWWWWWWWWFWWWWWWFFFFFFWWWWWFFFWWWWWWWWFFFFWWWWWFWWWWWWWWWWFFFFWWFFFFFWWWWWWWWFFFFWWWFWWWFWWFHFWWWWFFFFWWVWWWVWWFWFWWWWWFFFFFFFFFFFFFFFEWWWWWWWWWWWWWWWWWWWW",
        spawners);
    gameEngine.setLevel(level);
    gameEngine.addEntity(camera, "hud");
    gameEngine.AM = ASSET_MANAGER;
	
	let turret = new Turret(gameEngine, 300, 200);
    //new MainCharacter(gameEngine);
    
    new WallHUD(gameEngine);
	
    new Floor(gameEngine);
    new Wall(gameEngine);
    new Key(gameEngine, 240, 1586);
    new SpeedPotion(gameEngine, 432, 240);
    new HealthPotion(gameEngine, 1200, 816);
    new StarPotion(gameEngine, 1776, 1584);

    let charClasses = [new Lancer(), new BlackMage()];

    let hover = true;
    gameEngine.addEntity(new ChooseYourFighter(gameEngine), "hud");
    for (var i = 0; i < charClasses.length; i++) {
        gameEngine.addEntity(new NPC(gameEngine, charClasses[i], hover), "main");
        if (i === 0) {
            hover = false;
        }
    }
    new Crosshair(gameEngine);
    gameEngine.init(ctx);
    gameEngine.start();
});
