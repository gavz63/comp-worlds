class Level2
{
	constructor()
	{
		this.width = 20;
		this.height = 20;
		this.floorType = 0;
		this.wallType = 0;
		
		this.layout = 
		"####################" +
		"S--------####---####" +
		"##-------####--#####" +
		"##-------#####-#####" +
		"########-#####-#####" +
		"####---------#-##-##" +
		"####---------#-##-##" +
		"####---------#----##" +
		"####---------#-##-##" +
		"####---------#-##-##" +
		"#------------#-##--#" +
		"#-##---------#-#####" +
		"#-############-#####" +
		"#------#####---#####" +
		"###----#####-#######" +
		"###----##-----######" +
		"##----###-###-##-H-#" +
		"###----##V###V##-#-#" +
		"####---------------E" +
		"####################";
		
		this.spawnerList = [];
		this.hazardList = [];
		this.pickUpList = [];
		
		this.spawnerList.push(
		{
			 x: 8,
			 y: 7,
			 max: 0,
			 freq: 3,
			 list: [Bat.prototype],
			 rand: false,
			 radius: 2000,
			 total: 0
		});		
		this.spawnerList.push(
		{
			 x: 5,
			 y: 2,
			 max: 0,
			 freq: 3,
			 list: [Bat.prototype/*,
					PuddleJumper.prototype,
					Skeleton.prototype*/],
			 rand: false,
			 radius: 2000,
			 total: 0
		});
	}
	
	
}