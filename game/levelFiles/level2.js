class Level2
{
	constructor()
	{
		this.width = 20;
		this.height = 20;
		this.floorType = 3;
		this.wallType = 1;
		this.nextLevel = Level3.prototype;

		this.layout = 
		"####################" +
		"S---#-#------#-----#" +
		"###---H------H-----#" +
		"#######------#-----E" +
		"###############--###" +
		"#----------##------#" +
		"#-#####-----#------#" +
		"#-------###-#------#" +
		"####-####-#-H------#" +
		"#----##-#V##########" +
		"#----##-#---########" +
		"#----##-#-------####" +
		"#-------#---#---####" +
		"#------##-------####" +
		"#----######---######" +
		"##--########---#####" +
		"##------######--####" +
		"##------#######V####" +
		"####---------------E" +
		"####################";
		
		this.roomSpawnerList = [];
		this.spawnerList = [];
		this.hazardList = [];
		this.pickupList = [];
		
		this.hazardList.push (
		{
		   x: 4,
		   y: 10,
		   fireRate: 5,
		   spinning: true,
		   cross: true,
		   pSpeed: 100,
		   pLifeTime: 2,
		   pMove: EasingProjectile.prototype.spiral,
		   pEasing: function (t) { return t; }
		});
		
		this.roomSpawnerList.push (
		{
			x: 10,
			y: 2,
			room: {upperLeft: {x: 7, y: 1}, bottomRight: {x: 12, y: 4}},
			dropKey: true
		});
		
		this.spawnerList.push (
		{
			x: 7,
			y: 1,
			max: 0,
			freq: 3,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 2,
			roomNum: 1
		});
				
		this.spawnerList.push (
		{
			x: 8,
			y: 1,
			max: 0,
			freq: 3,
			list: [Bat.prototype],
			rand: false,
			total: 2,
			roomNum: 1
		});
				
		this.spawnerList.push (
		{
			x: 9,
			y: 1,
			max: 0,
			freq: 3,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 2,
			roomNum: 1
		});
				
		this.spawnerList.push (
		{
			x: 10,
			y: 1,
			max: 0,
			freq: 3,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 2,
			roomNum: 1
		});	
		
		this.spawnerList.push (
		{
			x: 11,
			y: 1,
			max: 0,
			freq: 3,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 2,
			roomNum: 1
		});		
		
		this.spawnerList.push (
		{
			x: 12,
			y: 1,
			max: 0,
			freq: 3,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 2,
			roomNum: 1
		});
		
		this.pickupList.push({
			x: 5,
			y: 1,
			type: Key.prototype
		});
		
		this.pickupList.push({
			x: 7,
			y: 9,
			type: Key.prototype
		});
	}		
}