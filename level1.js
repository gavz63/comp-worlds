//S PlayerSpawner
//E End
//V Vertical
//H Horizontal
//

class Level1
{
	constructor()
	{
		this.width = 25;
		this.height = 11;
		this.floorType = 0;
		this.wallType = 0;
		
		this.layout =
			"#########################" +
			"S-----------------------#" + // Hedge monster in this corner
			"#-#V#---######----#####-#" +
			"#-#-#####----######---#-#" +
			"#-#-#####---------H-----#" +
			"#-#----------######---###" +
			"#-H-#####-###############" +
			"###-#####-###############" +
			"#-----------------#######" +
			"#########-##############E" +
			"#########################";

		this.spawnerList = [];
		this.hazardList = [];
		this.pickupList = [];

		this.pickupList.push({
			x: 21,
			y: 3,
			type: Key.prototype
		});

		this.pickupList.push({
			x: 4,
			y: 5,
			type: Key.prototype
		});

		this.pickupList.push({
			x: 5,
			y: 5,
			type: HealthPotion.prototype
		});

		this.spawnerList.push({
			 x: 19,
			 y: 3,
			 max: 1,
			 freq: 3,
			 list: [StoneGolem.prototype],
			 rand: false,
			 radius: 288,
			 total: 0
		});

		this.spawnerList.push({
			x: 21,
			y: 3,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 200,
			total: 0
		});

		this.spawnerList.push({
			x: 19,
			y: 5,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 288,
			total: 0
		});

		this.spawnerList.push({
			x: 21,
			y: 5,
			max: 1,
			freq: 3,
			list: [StoneGolem.prototype],
			rand: false,
			radius: 288,
			total: 0
		});
	}
	
	
}