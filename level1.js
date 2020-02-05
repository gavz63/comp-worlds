//S PlayerSpawner
//E End
//V Vertical
//H Horizontal
//

class Level1
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
			 x: 5,
			 y: 2,
			 max: 0,
			 freq: 3,
			 list: [/*Bat.prototype,
					PuddleJumper.prototype,*/
				 	StoneGolem.prototype,
					Skeleton.prototype],
			 rand: false,
			 radius: 2000,
			 total: 0
		});
	}
	
	
}