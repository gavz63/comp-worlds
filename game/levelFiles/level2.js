//S PlayerSpawner
//E End
//V Vertical
//H Horizontal
//

class Level2
{
	constructor()
	{
		this.width = 34;
		this.height = 16;
		this.floorType = 0;
		this.wallType = 0;
		this.nextLevel = null;
		this.musicId = 'hedgeMazeMusic';

		this.layout =
			"##################################" +
			"########------######----##########" +
			"S-----------------------------####" +
			"######V#------######----#####-####" +
			"######-########----######---#-####" +
			"######-########---------H-----####" +
			"#-####-------------######---##---#" +
			"#-####-#######################---#" +
			"#-####-##############----------###" +
			"#---------------------#-------####" +
			"#-----------############-----#####" +
			"#--------#####------H-###---######" +
			"#-----####-------####-####-#######" +
			"#V#####----##########-####-#######" +
			"#-------#############------------E" +
			"##################################";

		this.roomSpawnerList = [];
		this.spawnerList = [];
		this.turretList = [];
		this.spawnerProjectileList = [];
		this.pickupList = [];
    this.unlockableCharacter = [];
    
    this.unlockableCharacter.push(
    {
      x: 20,
      y: 11,
      characterClass: new Ninja("")
    });
    
		// Key in Stone Golem room
		this.pickupList.push({
			x: 27,
			y: 4,
			type: Key.prototype
		});

		// Pickups in first shortcut
		this.pickupList.push({
			x: 7,
			y: 6,
			type: Key.prototype
		});

		this.pickupList.push({
			x: 8,
			y: 6,
			type: HealthPotion.prototype
		});

		// Key out of the snek room
		this.pickupList.push({
			x: 1,
			y: 6,
			type: Key.prototype
		});

		//////////////////////////////////
		//////////// SPAWNERS ////////////
		//////////////////////////////////

		this.spawnerList.push({
			x: 30,
			y: 6,
			max: 1,
			freq: 10,
			list: [HedgeMonster.prototype],
			rand: false,
			radius: 10000,
			total: 1,
			roomNum: 0,
      delay: 0
		});

		this.spawnerList.push({
			x: 20,
			y: 1,
			max: 0,
			freq: 3,
			list: [PuddleJumper.prototype],
			rand: false,
			radius: 96,
			total: 2,
			roomNum: 0,
      delay: 0
		});

		// this.spawnerList.push({
		// 	x: 21,
		// 	y: 1,
		// 	max: 1,
		// 	freq: 10,
		// 	list: [Bat.prototype],
		// 	rand: false,
		// 	radius: 96,
		// 	total: 0
		// });
		//
		// this.spawnerList.push({
		// 	x: 22,
		// 	y: 1,
		// 	max: 1,
		// 	freq: 10,
		// 	list: [Bat.prototype],
		// 	rand: false,
		// 	radius: 96,
		// 	total: 0
		// });
		//
		// this.spawnerList.push({
		// 	x: 20,
		// 	y: 3,
		// 	max: 1,
		// 	freq: 10,
		// 	list: [Bat.prototype],
		// 	rand: false,
		// 	radius: 96,
		// 	total: 0
		// });
		//
		// this.spawnerList.push({
		// 	x: 21,
		// 	y: 3,
		// 	max: 1,
		// 	freq: 10,
		// 	list: [Bat.prototype],
		// 	rand: false,
		// 	radius: 96,
		// 	total: 0
		// });
		//
		// this.spawnerList.push({
		// 	x: 22,
		// 	y: 3,
		// 	max: 1,
		// 	freq: 10,
		// 	list: [Bat.prototype],
		// 	rand: false,
		// 	radius: 96,
		// 	total: 0
		// });

		//Stone Golem Room
		this.spawnerList.push({
			 x: 25,
			 y: 4,
			 max: 1,
			 freq: 3,
			 list: [StoneGolem.prototype],
			 rand: false,
			 radius: 288,
			 total: 0,
			roomNum: 0,
      delay: 0
		});

		this.spawnerList.push({
			x: 25,
			y: 6,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 288,
			total: 0,
			roomNum: 0,
      delay: 0
		});

		this.spawnerList.push({
			x: 27,
			y: 6,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 288,
			total: 0,
			roomNum: 0,
      delay: 0
		});

		// Snek Room
		this.spawnerList.push({
			x: 3,
			y: 9,
			max: 1,
			freq: 7,
			list: [Snek.prototype],
			rand: false,
			radius: 4 * 96,
			total: 0,
			roomNum: 0,
      delay: 0
		});

		this.spawnerList.push({
			x: 9,
			y: 9,
			max: 1,
			freq: 7,
			list: [Snek.prototype],
			rand: false,
			radius: 4 * 96,
			total: 0,
			roomNum: 0,
      delay: 0
		});

		this.spawnerList.push({
			x: 6,
			y: 11,
			max: 1,
			freq: 7,
			list: [Snek.prototype],
			rand: false,
			radius: 4 * 96,
			total: 0,
			roomNum: 0,
      delay: 0
		});

		/////////////////////////////////
		//////////// HAZARDS ////////////
		/////////////////////////////////

		 this.turretList.push (
		 	{
		 		x: 8,
		 		y: 2,
		 		fireRate: 10,
		 		spinning: true,
		 		cross: false,
		 		pSpeed: 75,
		 		pLifeTime: 3,
		 		pMove: EasingProjectile.prototype.circle,
		 		pEasing: function (t) { return 0; },
        initialDelay: 0,
        burstDelay: 0,
        burstNum: 1
		 	});

		 this.turretList.push (
		 	{
		 		x: 10,
		 		y: 1,
		 		fireRate: 10,
		 		spinning: true,
		 		cross: false,
		 		pSpeed: 75,
		 		pLifeTime: 3,
		 		pMove: EasingProjectile.prototype.circle,
		 		pEasing: function (t) { return 0.5; },
        initialDelay: 0,
        burstDelay: 0,
        burstNum: 1
		 	});

		 this.turretList.push (
		 	{
		 		x: 10,
		 		y: 3,
		 		fireRate: 10,
		 		spinning: true,
		 		cross: false,
		 		pSpeed: 75,
		 		pLifeTime: 3,
		 		pMove: EasingProjectile.prototype.circle,
		 		pEasing: function (t) { return 0.42; },
        initialDelay: 0,
        burstDelay: 0,
        burstNum: 1
		 	});

		 this.turretList.push (
		 	{
		 		x: 13,
		 		y: 2,
		 		fireRate: 6,
		 		spinning: true,
		 		cross: false,
		 		pSpeed: 100,
		 		pLifeTime: 2,
		 		pMove: EasingProjectile.prototype.spiral,
		 		pEasing: function (t) { return smoothStopN(t, 2); },
        initialDelay: 0,
        burstDelay: 0,
        burstNum: 1
		 	});

		 this.turretList.push (
		 	{
		 		x: 13,
		 		y: 2,
		 		fireRate: 6,
		 		spinning: true,
		 		cross: false,
		 		pSpeed: 100,
		 		pLifeTime: 4,
		 		pMove: EasingProjectile.prototype.spiral,
		 		pEasing: function (t) { return smoothStopN(t, 2); },
        initialDelay: 0,
        burstDelay: 0,
        burstNum: 1
		 	});

		 this.turretList.push (
		 	{
		 		x: 13,
		 		y: 2,
		 		fireRate: 6,
		 		spinning: true,
		 		cross: false,
		 		pSpeed: 100,
		 		pLifeTime: 5,
		 		pMove: EasingProjectile.prototype.spiral,
		 		pEasing: function (t) { return smoothStopN(t, 2); },
        initialDelay: 0,
        burstDelay: 0,
        burstNum: 1
		 	});
	}
}
