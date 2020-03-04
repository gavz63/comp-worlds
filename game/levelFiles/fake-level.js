//S PlayerSpawner
//E End
//V Vertical
//H Horizontal
//

class Level1000
{
    constructor() {
        this.width = 3;
        this.height = 1;
        this.floorType = 0;
        this.wallType = 0;
        this.musicId = 'hedgeMazeMusic';
        this.nextLevel = null;

        this.layout =
            "S-E";

        this.playerSpawner = null;
        this.roomSpawnerList = [];
        this.spawnerList = [];
        this.turretList = [];
        this.pickupList = [];
        this.spawnerProjectileList = [];
    }
}