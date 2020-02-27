class Level3 {
    constructor() {
        this.width = 11;
        this.height = 10;
        this.floorType = 0;
        this.wallType = 0;
        this.nextLevel = null;
        this.musicId = 'churchMusic';

        this.layout =
            "##########J" +
            "S--------#J" +
            "#--------#J" +
            "#--------#J" +
            "#--------#J" +
            "#--------#J" +
            "#--------#J" +
            "#--------#J" +
            "#--------HE" +
            "##########J";

        this.playerSpawner = null;
		/*this.playerSpawner = {
            maxAtOnce: 1,
            spawnList:
            [Bat.prototype, CactusBoi.prototype,
            PuddleJumper.prototype, Skeleton.prototype, Snek.prototype,
            StoneGolem.prototype],
            probs: [50, 10, 40, 35, 25, 15]
        };*/


        this.roomSpawnerList = [];
        this.spawnerList = [];
        this.turretList = [];
        this.spawnerProjectileList = [];
        this.pickupList = [];
        this.unlockableCharacter = [];
		
        this.roomSpawnerList.push({
                x: 4.5,
                y: 4.5,
                room: {upperLeft: {x: 1, y: 1}, bottomRight: {x: 8, y: 8}},
                lockCam: true,
                dropKey: true, // drops a key at this. x, y
				dropPotion: false,
				zoom: DEFAULT_ZOOM * 6
		});
			
		this.spawnerList.push (
		{
			x: 4.5,
			y: 4.5,
			max: 1,
			freq: 3,
			list: [MagmaGolem.prototype],
			rand: false,
			radius: 96,
			total: 1,
			roomNum: 1,
			delay: 2
		});	

	}
}