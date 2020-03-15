class Level4 {
    constructor() {
        this.width = 15;
        this.height = 9;
        this.floorType = 2;
        this.wallType = 0;
        this.nextLevel = Level5.prototype;
        this.musicId = 'bossMusic';

        this.layout =
            "###############" +
            "#PP--------PPP#" +
            "#PP-PPPPPP--PP#" +
            "P---P----PP-PP#" +            
            "S-PPP---------E" +
            "P---P----PP-PP#" +
            "#PP-PPPPPP--PP#" +
            "#PP--------PPP#" +
            "###############";

        this.playerSpawner = null;
        this.wallSpawnerList = [];
        this.roomSpawnerList = [];
        this.spawnerList = [];
        this.turretList = [];
        this.spawnerProjectileList = [];
        this.pickupList = [];
        this.unlockableCharacter = [];
        
        this.unlockableCharacter.push(
        {
            x: 6.5,
            y: 4,
            characterClass: new King()
        });
        
        this.roomSpawnerList.push({
            x: 7,
            y: 4,
            room: {upperLeft: {x: 1, y: 0}, bottomRight: {x: 13, y: 8}},
            lockCam: true,
            dropKey: false, // drops a key at this. x, y
            dropPotion: false,
            zoom: DEFAULT_ZOOM * 5.5
        });
        
        this.pickupList.push({
          x: 4.99,
          y: 2.99,
          type: Post.prototype
        });        
        this.pickupList.push({
          x: 5.75,
          y: 3,
          type: Post.prototype
        });        
        this.pickupList.push({
          x: 6.5,
          y: 3,
          type: Post.prototype
        });        
        this.pickupList.push({
          x: 7.25,
          y: 3,
          type: Post.prototype
        });
        this.pickupList.push({
          x: 8.01,
          y: 2.99,
          type: Post.prototype
        }); 
        this.pickupList.push({
          x: 5,
          y: 3.66,
          type: Post.prototype
        }); 
        this.pickupList.push({
          x: 5,
          y: 4.33,
          type: Post.prototype
        });      
        this.pickupList.push({
          x: 8,
          y: 3.66,
          type: Post.prototype
        });            
        this.pickupList.push({
          x: 8,
          y: 4.33,
          type: Post.prototype
        });       
        this.pickupList.push({
          x: 5,
          y: 5,
          type: Post.prototype
        });       
        this.pickupList.push({
          x: 5.75,
          y: 5,
          type: Post.prototype
        });
        this.pickupList.push({
          x: 6.5,
          y: 5,
          type: Post.prototype
        });
        this.pickupList.push({
          x: 7.25,
          y: 5,
          type: Post.prototype
        });
        this.pickupList.push({
          x: 8,
          y: 5,
          type: Post.prototype
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
                delay: Math.Infinity
            });

    }
}