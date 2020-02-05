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
    
    gameEngine.AM = ASSET_MANAGER;
	
	gameEngine.LoadLevel(new Level1());

    gameEngine.init(ctx);
    gameEngine.start();
});
