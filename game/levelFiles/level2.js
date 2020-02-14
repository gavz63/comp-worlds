class Level2
{
	constructor()
	{
		this.width = 20;
		this.height = 20;
		this.floorType = 3;
		this.wallType = 1;
		
		this.layout = 
		"####################" +
		"S---#-#------#-----#" +
		"###---H------H-----#" +
		"#######------#-----#" +
		"###############--###" +
		"#----------##------#" +
		"#-#####-----#----###" +
		"#-------###-#----#-#" +
		"####-####-#-#----H-E" +
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
		
		this.spawnerList = [];
		this.hazardList = [];
		this.pickupList = [];
	
	this.pickupList.push({
		x: 5,
		y: 1,
		type: Key.prototype
	});
	
	this.pickupList.push({
		x: 10,
		y: 2,
		type: Key.prototype
	});
	
	this.pickupList.push({
		x: 7,
		y: 9,
		type: Key.prototype
	});
	
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
	}		
}