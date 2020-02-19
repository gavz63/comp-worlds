//S PlayerSpawner
//E End
//V Vertical
//H Horizontal
//

class LevelFake
{
    constructor() {
        this.width = 34;
        this.height = 16;
        this.floorType = 0;
        this.wallType = 0;
        this.musicId = 'hedgeMazeMusic';

        this.layout =
            "S-E";

        this.roomSpawnerList = [];
        this.spawnerList = [];
        this.hazardList = [];
        this.pickupList = [];
    }
}