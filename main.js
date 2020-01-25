const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/map/grounds.png");
ASSET_MANAGER.queueDownload("./img/map/walls.png");
ASSET_MANAGER.queueDownload("./img/map/doors.png");

ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    let camera = new Camera(ctx);
    let level = new Level("20x20y0w0fWWWWWWWWWWWWWWWWWWWWSFFFFFFFFWWWWFFFWWWWWWWWWWWWFWWWWFFWWWWWWWWWWWWWFWWWWWFWWWWWWWWWWWWWFWWWWWFWWWWWWWWWFFFFFFFFFWFWWFWWWWWWFWWWWWWWFWFWWFWWWWWWFWFWFWFWFWFFFFWWWWWWFWWFWFWWFWFWWFWWWWWWFWFWFWFWFWFWWFWWWFFFFWWWWWWWFWFWWFFWWFWWFFFFFFFFFWFWWWWWWFWWWWWWWWWWWWFWWWWWWFFFFFFWWWWWFFFWWWWWWWWFFFFWWWWWFWWWWWWWWWWFFFFWWFFFFFWWWWWWWWFFFFWWWFWWWFWWFHFWWWWFFFFWWVWWWVWWFWFWWWWWFFFFFFFFFFFFFFFEWWWWWWWWWWWWWWWWWWWW");
    let gameEngine = new GameEngine(camera, level);
    gameEngine.addEntity(camera, "hud")
    new MainCharacter(gameEngine);
    new Floor(gameEngine);
    new Wall(gameEngine);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
