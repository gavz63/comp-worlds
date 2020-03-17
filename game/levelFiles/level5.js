class Level5 {
    constructor() {
        this.width = 16;
        this.height = 9;
        this.floorType = 0;
        this.wallType = 0;
        this.nextLevel = null;
        this.musicId = 'bossMusic';
        this.message = "The end is near.";

        this.layout =
            "#--------------#" +
            "#--------------#" +
            "#--------------#" +
            "#-PPPPPPPPPPPP-#" +
            "#-P----------P-#" +
            "#-P----------P-#" +
            "##P----------P##" +
            "S-------------##" +
            "################";

        this.playerSpawner = null;
        this.wallSpawnerList = [];
        this.roomSpawnerList = [];
        this.spawnerList = [];
        this.turretList = [];
        this.spawnerProjectileList = [];
        this.pickupList = [];
        this.unlockableCharacter = [];
        
        this.wallSpawnerList.push({
           x: 1,
           y: 7,
           room: {upperLeft: {x: 2, y: 0}, bottomRight: {x: 15, y: 8}}
        });
        
        this.roomSpawnerList.push({
            x: 7.5,
            y: 4.7,
            room: {upperLeft: {x: 1, y: 0}, bottomRight: {x: 15, y: 8}},
            lockCam: true,
            dropKey: true, // drops a key at this. x, y
            dropPotion: false,
            zoom: DEFAULT_ZOOM * 5.5
        });

        this.spawnerList.push (
            {
                x: 8,
                y: 1.3,
                max: 1,
                freq: 3,
                list: [WoodDragon.prototype],
                rand: false,
                radius: 10000,
                total: 1,
                roomNum: 1,
                delay: 0
            });

    }
}