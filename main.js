const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/map/grounds.png");
ASSET_MANAGER.queueDownload("./img/map/walls.png");
ASSET_MANAGER.queueDownload("./img/map/doors.png");

ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    canvas.autofocus = true;
    let ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    let camera = new Camera(ctx);
    let level = new Level("10x10y0w0fWWWWWWWWWWWWFFFFFFFEWWFFFFFFWWWWWWFFFFFWWWWWWFWWFWWWWWWFWWFWWWWWWFWFFWWWWWWFWFWWSFFFFFWFFWWWWWWWWWWW");
    let gameEngine = new GameEngine(camera, level);
    new MainCharacter(gameEngine, level, camera);
    new Floor(gameEngine, ASSET_MANAGER.getAsset("./img/map/grounds.png"));
    new Wall(gameEngine, ASSET_MANAGER.getAsset("./img/map/walls.png"));
 
    gameEngine.init(ctx);
    gameEngine.start();
});
