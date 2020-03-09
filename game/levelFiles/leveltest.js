//S PlayerSpawner
//E End
//V Vertical
//H Horizontal
//

class LevelTest {
    constructor() {
        this.width = 34;
        this.height = 16;
        this.floorType = 0;
        this.wallType = 0;
        this.nextLevel = null;
        this.musicId = 'hedgeMazeMusic';

        this.layout =
            "##################################" +
            "########------######----##########" +
            "S-------------#---------------####" +
            "######V#------######----#####-####" +
            "######-########----######---#-####" +
            "######-########---------H-----####" +
            "#---##-------------######---##---#" +
            "###-##-#######################---#" +
            "###-##-##############----------###" +
            "#-------##------------#-------####" +
            "#-----------############-----#####" +
            "#-------######-------#####-#######" +
            "#-#########---------######-#######" +
            "#V#####-----##------######-#######" +
            "#-----------##############-------E" +
            "##################################";

        this.wallSpawnerList = [];
        this.roomSpawnerList = [];
        this.spawnerList = [];
        this.turretList = [];
        this.spawnerProjectileList = [];
        this.pickupList = [];
        this.unlockableCharacter = [];

        this.spawnerList.push({
            x: 10,
            y: 2,
            max: 1,
            freq: 3,
            list: [StoneGolem.prototype],
            rand: false,
            radius: 96 * 4,
            total: 1,
            roomNum: 0,
            delay: 0
        });
    }
}
