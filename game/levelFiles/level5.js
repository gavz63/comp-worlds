class Level5 {
	constructor() {
		this.width = 55;
		this.height = 38;
		this.floorType = 1;
		this.wallType = 1;
		this.nextLevel = Level6.prototype;
		this.musicId = 'churchMusic';
		this.message = "You enter a hidden passageway under the church.";

        this.layout =
        "XXXXXXXX###############################################" +
        "XXXXXXXX###-------PP-----------PP----------PP--########" +
        "XXXXXXXX###---##--##--PP--##-P-##--PP--##--##---H-----E" +
        "XXXXXXXX###---PP----------PP-----------PP------###-####" +
        "XXXXXXXX###-########--############################V####" +
        "XXXXXXXX###-########--######################-------####" +
        "XXXXXXXX###-#####PPP--PPP################----#####-####" +
        "XXXXXXXX###-##PPPPPP--PPPPPP######################-####" +
        "XXXXXXXX###-----------------------------------####--###" +
        "XXXXXXXX######PPPPPP##PPPPPP#################-#####-###" +
        "XXXXXXXX#########PPP##PPP####################-###---###" +
        "XXXXXXXX##########################PPPP#######-###-#-#P#" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX###P--------H--###-#-#P#" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX###PPPP#-PP-######-#-#P#" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#######--#P-######-#-#P#" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#######-----######-#-#P#" +
        "XXXXXXXXXX###########################----#-######-#-#P#" +
        "XXXXXXXXXX##########################---##P-P#####-#-#P#" +
        "XXXXXXXXXX###########-##-##----##-#---###P-P#####-#-#P#" +
        "#############---------------PP-------####P-P#######-###" +
        "#############-PP-####-##-##----##-#######PPP#######-###" +
        "#############-PP-################P#################-###" +
        "####-------------################-##############----###" +
        "####-############################-####XXXXX####---####X" +
        "S----########------##############-####XXXX####---####XX" +
        "####-########-#--P-###------------###########---####XXX" +
        "####----------###P-###-##########-###########--####XXXX" +
        "#################P-###-#-#-#-#-##-##########PP-####XXXX" +
        "X###############-P-###-##-#-#-#-#-#########PP---####XXX" +
        "X###############-P-###-#-#-#-#-##-########PP-----####XX" +
        "X###############-P-###-##-#-#-#-#-######-#P------####XX" +
        "X####-----#--------###-##########-#####---P-----####XXX" +
        "X###---#-----#########------------####--#------#####XXX" +
        "X###--################-##############--###----######XXX" +
        "X###--################-#############--##############XXX" +
        "X###--------------------H------------###############XXX" +
        "X######---#---#---######################XXXXXXXXXXXXXXX" +
        "X#######################################XXXXXXXXXXXXXXX";
		
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
        

        /* Keys */
        this.pickupList.push({
			x: 33,
			y: 22,
			type: Key.prototype
        });       
        this.pickupList.push({
			x: 21,
			y: 6,
			type: Key.prototype
        });       
        if (Math.random() > .5) {
            this.pickupList.push({
                x: 35,
                y: 12,
                type: Key.prototype
            });
        } else {
            this.pickupList.push({
                x: 42,
                y: 19,
                type: Key.prototype
            });
        }
        if (Math.random() > .5) {
            this.pickupList.push({
                x: 41,
                y: 6,
                type: Key.prototype
            });
        } else {
            this.pickupList.push({
                x: 49,
                y: 18,
                type: Key.prototype
            });
        }


        /* Potions */
        this.pickupList.push({
            x: 43,
            y: 8,
            type: SpeedPotion.prototype
        });
        this.pickupList.push({
            x: 11,
            y: 6,
            type: StarPotion.prototype
        });


        /* Destructables */
        this.pickupList.push({
			x: 16,
			y: 28,
			type: Crate.prototype
        });
        this.pickupList.push({
			x: 33,
			y: 18,
			type: Crate.prototype
        });
        this.pickupList.push({
            x: 20,
            y: 7,
            type: Post.prototype
        });
        this.pickupList.push({
            x: 21,
            y: 7,
            type: Post.prototype
        }); 
        this.pickupList.push({
            x: 50,
            y: 10,
            type: Post.prototype
        }); 


        /* Room Spawners */
		this.roomSpawnerList.push ({
            x: 45,
            y: 30,
            room: {upperLeft: {x: 41, y: 27}, bottomRight: {x: 49, y: 34}},
            lockCam: true,
            dropKey: false,
            dropPotion: true,
            zoom: DEFAULT_ZOOM * 3
        });
        this.roomSpawnerList.push ({
            x: 14.5,
            y: 20.5,
            room: {upperLeft: {x: 12, y: 18}, bottomRight: {x: 16, y: 22}},
            lockCam: true,
            dropKey: false,
            dropPotion: false,
            zoom: DEFAULT_ZOOM * 2
        });


        /* Spawners */
        this.spawnerList.push({
            x: 44,
            y: 26,
            max: 3,
            freq: 1,
            list: [Bat.prototype],
            rand: false,
            radius: 9 * 96,
            total: 5,
            roomNum: 1,
            delay: 1
        });
        this.spawnerList.push({
            x: 49,
            y: 29,
            max: 1,
            freq: 1,
            list: [GoldBat.prototype],
            rand: false,
            radius: 6 * 96,
            total: 1,
            roomNum: 1,
            delay: 4
        });
        this.spawnerList.push({
            x: 45,
            y: 30,
            max: 2,
            freq: 1,
            list: [Skeleton.prototype],
            rand: false,
            radius: 10 * 96,
            total: 2,
            roomNum: 1,
            delay: 0
        });
        this.spawnerList.push({
            x: 46,
            y: 33,
            max: 1,
            freq: 2,
            list: [Snek.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 1,
            delay: 3
        });
        this.spawnerList.push({
            x: 47,
            y: 32,
            max: 1,
            freq: 2,
            list: [Snuk.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 1,
            delay: 1
        });
        this.spawnerList.push({
            x: 48,
            y: 31,
            max: 1,
            freq: 2,
            list: [Snek.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 1,
            delay: 2
        });
        this.spawnerList.push({
            x: 33,
            y: 20.25,
            max: 1,
            freq: 10,
            list: [Skeleton.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 15,
            y: 26,
            max: 1,
            freq: 10,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 3 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 16,
            y: 26,
            max: 1,
            freq: 10,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 3 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 12,
            y: 32,
            max: 1,
            freq: 10,
            list: [Bat.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 9,
            y: 31,
            max: 1,
            freq: 10,
            list: [Bat.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 6,
            y: 32,
            max: 3,
            freq: 1,
            list: [Bat.prototype],
            rand: false,
            radius: 5 * 96,
            total: 5,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 4,
            y: 32,
            max: 2,
            freq: 1,
            list: [GoldBat.prototype],
            rand: false,
            radius: 5 * 96,
            total: 2,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 7,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 8,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 9,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 11,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 12,
            y: 36,
            max: 1,
            freq: 1,
            list: [Turtle.prototype],
            rand: false,
            radius: 3 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 13,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 15,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 16,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 17,
            y: 36,
            max: 1,
            freq: 1,
            list: [BoneMan.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 36,
            y: 35,
            max: 1,
            freq: 1,
            list: [StoneGolem.prototype],
            rand: false,
            radius: 11 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 40,
            y: 30,
            max: 1,
            freq: 1,
            list: [PuddleHopper.prototype],
            rand: false,
            radius: 2 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 49,
            y: 17,
            max: 2,
            freq: 5,
            list: [CactusBoi.prototype, Turtle.prototype],
            rand: true,
            radius: 4 * 96,
            total: 2,
            roomNum: 0,
            delay: 1
        });
        this.spawnerList.push({
            x: 49,
            y: 18,
            max: 2,
            freq: 5,
            list: [CactusBoi.prototype, Turtle.prototype],
            rand: true,
            radius: 4 * 96,
            total: 2,
            roomNum: 0,
            delay: 1
        });
        this.spawnerList.push({
            x: 51,
            y: 18,
            max: 1,
            freq: 10,
            list: [PuddleHopper.prototype],
            rand: false,
            radius: 7 * 96,
            total: 1,
            roomNum: 0,
            delay: 10
        });
        this.spawnerList.push({
            x: 41,
            y: 6,
            max: 1,
            freq: 0,
            list: [CactusMadman.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 13,
            y: 19,
            max: 1,
            freq: 0,
            list: [Bat.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 2,
            delay: 0
        });
        this.spawnerList.push({
            x: 16,
            y: 22,
            max: 1,
            freq: 0,
            list: [Bat.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 2,
            delay: 0
        });
        this.spawnerList.push({
            x: 16,
            y: 19,
            max: 1,
            freq: 0,
            list: [GoldBat.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 2,
            delay: 0
        });
        this.spawnerList.push({
            x: 24,
            y: 18,
            max: 1,
            freq: 0,
            list: [BoneMan.prototype],
            rand: false,
            radius: 6 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 24,
            y: 20,
            max: 1,
            freq: 0,
            list: [BoneMan.prototype],
            rand: false,
            radius: 6 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 21,
            y: 17,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 3 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 21,
            y: 21,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 3 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 30,
            y: 19,
            max: 1,
            freq: 0,
            list: [Snak.prototype],
            rand: false,
            radius: 6 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 30,
            y: 18,
            max: 1,
            freq: 0,
            list: [PuddleHopper.prototype],
            rand: false,
            radius: 6 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 30,
            y: 20,
            max: 1,
            freq: 0,
            list: [PuddleHopper.prototype],
            rand: false,
            radius: 6 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 35,
            y: 12,
            max: 1,
            freq: 0,
            list: [StoneGolem.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 42,
            y: 19,
            max: 1,
            freq: 0,
            list: [StoneGolem.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 42,
            y: 12,
            max: 1,
            freq: 0,
            list: [Turtle.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 38,
            y: 14,
            max: 1,
            freq: 0,
            list: [Bat.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 40,
            y: 16,
            max: 1,
            freq: 0,
            list: [Bat.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 11,
            y: 8,
            max: 1,
            freq: 0,
            list: [StoneGolem.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 26,
            y: 8,
            max: 1,
            freq: 0,
            list: [CactusBoi.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 24,
            y: 8,
            max: 1,
            freq: 0,
            list: [CactusMadman.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 22,
            y: 8,
            max: 1,
            freq: 0,
            list: [CactusBoi.prototype],
            rand: false,
            radius: 5 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 16,
            y: 2,
            max: 1,
            freq: 0,
            list: [CactusMadman.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 20,
            y: 2,
            max: 1,
            freq: 0,
            list: [CactusMadman.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 33,
            y: 2,
            max: 1,
            freq: 0,
            list: [CactusMadman.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 41,
            y: 2,
            max: 1,
            freq: 0,
            list: [CactusMadman.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 45,
            y: 2,
            max: 1,
            freq: 0,
            list: [CactusMadman.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 33,
            y: 1,
            max: 1,
            freq: 0,
            list: [Skeleton.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 41,
            y: 3,
            max: 1,
            freq: 0,
            list: [Skeleton.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 17,
            y: 3,
            max: 1,
            freq: 0,
            list: [Snuk.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 28,
            y: 1,
            max: 1,
            freq: 0,
            list: [Snek.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 47,
            y: 2,
            max: 1,
            freq: 0,
            list: [Snek.prototype],
            rand: false,
            radius: 4 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 13,
            y: 3,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 16,
            y: 2,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 27,
            y: 1,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 29,
            y: 3,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 32,
            y: 3,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 36,
            y: 1,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 36,
            y: 3,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 40,
            y: 1,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 44,
            y: 3,
            max: 1,
            freq: 0,
            list: [PuddleJumper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        this.spawnerList.push({
            x: 45,
            y: 2,
            max: 1,
            freq: 0,
            list: [PuddleHopper.prototype],
            rand: false,
            radius: 8 * 96,
            total: 1,
            roomNum: 0,
            delay: 0
        });
        


        /* Turrets */
        this.turretList.push ({
            x: 22.3,
            y: 24,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .25,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
        this.turretList.push ({
            x: 22.1,
            y: 24,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .25,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
        this.turretList.push ({
            x: 21.9,
            y: 24,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .25,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
        this.turretList.push ({
            x: 21.7,
            y: 24,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .25,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
        this.turretList.push ({
            x: 33.3,
            y: 33,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .75,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
        this.turretList.push ({
            x: 33.1,
            y: 33,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .75,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
        this.turretList.push ({
            x: 32.9,
            y: 33,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .75,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
        this.turretList.push ({
            x: 32.7,
            y: 33,
            fireRate: 9,
            spinning: false,
            cross: false,
            pDirection: .75,
            pSpeed: 96 * 7,
            pLifeTime: 5,
            pMove: EasingProjectile.prototype.line,
            pEasing: function (t) { return t; },
            initialDelay: 0,
            burstDelay: 3,
            burstNum: 3
        });
	}
}