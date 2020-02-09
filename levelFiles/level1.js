//S PlayerSpawner
//E End
//V Vertical
//H Horizontal
//

class Level1
{
	constructor()
	{
		this.width = 34;
		this.height = 16;
		this.floorType = 0;
		this.wallType = 0;

		this.layout =
			"##################################" +
			"########------######----##########" +
			"S-----------------------------####" + // Hedge monster in this corner
			"######V#------######----#####-####" +
			"######-########----######---#-####" +
			"######-########---------H-----####" +
			"#-####-------------######---###--#" + //Key far left
			"#-####-#######-##############----#" +
			"#-####-#######-#######--------####" +
			"#--------------####----###########" +
			"#-----------####----##############" +
			"#--------####----#################" +
			"#-----####----####################" +
			"#V#####----#######################" +
			"#-------##########################" +
			"#################################E";

		this.spawnerList = [];
		this.hazardList = [];
		this.pickupList = [];

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
			x: 20,
			y: 1,
			max: 1,
			freq: 10,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 0
		});

		this.spawnerList.push({
			x: 21,
			y: 1,
			max: 1,
			freq: 10,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 0
		});

		this.spawnerList.push({
			x: 22,
			y: 1,
			max: 1,
			freq: 10,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 0
		});

		this.spawnerList.push({
			x: 20,
			y: 3,
			max: 1,
			freq: 10,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 0
		});

		this.spawnerList.push({
			x: 21,
			y: 3,
			max: 1,
			freq: 10,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 0
		});

		this.spawnerList.push({
			x: 22,
			y: 3,
			max: 1,
			freq: 10,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 0
		});

		//Stone Golem Room
		this.spawnerList.push({
			 x: 25,
			 y: 4,
			 max: 1,
			 freq: 3,
			 list: [StoneGolem.prototype],
			 rand: false,
			 radius: 288,
			 total: 0
		});

		this.spawnerList.push({
			x: 27,
			y: 4,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 200,
			total: 0
		});

		this.spawnerList.push({
			x: 25,
			y: 6,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 288,
			total: 0
		});

		this.spawnerList.push({
			x: 27,
			y: 6,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 288,
			total: 0
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
			total: 0
		});

		this.spawnerList.push({
			x: 9,
			y: 9,
			max: 1,
			freq: 7,
			list: [Snek.prototype],
			rand: false,
			radius: 4 * 96,
			total: 0
		});

		this.spawnerList.push({
			x: 6,
			y: 11,
			max: 1,
			freq: 7,
			list: [Snek.prototype],
			rand: false,
			radius: 4 * 96,
			total: 0
		});

		/////////////////////////////////
		//////////// HAZARDS ////////////
		/////////////////////////////////

		// this.hazardList.push (
		// 	{
		// 		x: 8,
		// 		y: 2,
		// 		fireRate: 20,
		// 		spinning: true,
		// 		cross: false,
		// 		pSpeed: 100,
		// 		pLifeTime: 1,
		// 		pMove: EasingProjectile.prototype.circle,
		// 		pEasing: function (t) { return t; }
		// 	});
		//
		// this.hazardList.push (
		// 	{
		// 		x: 10,
		// 		y: 1,
		// 		fireRate: 20,
		// 		spinning: true,
		// 		cross: false,
		// 		pSpeed: 100,
		// 		pLifeTime: 1,
		// 		pMove: EasingProjectile.prototype.circle,
		// 		pEasing: function (t) { return t; }
		// 	});
		//
		// this.hazardList.push (
		// 	{
		// 		x: 10,
		// 		y: 3,
		// 		fireRate: 20,
		// 		spinning: true,
		// 		cross: false,
		// 		pSpeed: 100,
		// 		pLifeTime: 1,
		// 		pMove: EasingProjectile.prototype.circle,
		// 		pEasing: function (t) { return t; }
		// 	});
		//
		// this.hazardList.push (
		// 	{
		// 		x: 13,
		// 		y: 2,
		// 		fireRate: 6,
		// 		spinning: true,
		// 		cross: false,
		// 		pSpeed: 100,
		// 		pLifeTime: 2,
		// 		pMove: EasingProjectile.prototype.spiral,
		// 		pEasing: function (t) { return smoothStopN(t, 2); }
		// 	});
		//
		// this.hazardList.push (
		// 	{
		// 		x: 13,
		// 		y: 2,
		// 		fireRate: 6,
		// 		spinning: true,
		// 		cross: false,
		// 		pSpeed: 100,
		// 		pLifeTime: 4,
		// 		pMove: EasingProjectile.prototype.spiral,
		// 		pEasing: function (t) { return smoothStopN(t, 2); }
		// 	});
		//
		// this.hazardList.push (
		// 	{
		// 		x: 13,
		// 		y: 2,
		// 		fireRate: 6,
		// 		spinning: true,
		// 		cross: false,
		// 		pSpeed: 100,
		// 		pLifeTime: 5,
		// 		pMove: EasingProjectile.prototype.spiral,
		// 		pEasing: function (t) { return smoothStopN(t, 2); }
		// 	});
	}
}