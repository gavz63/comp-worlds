class Level1
{
	constructor()
	{
		this.width = 20;
		this.height = 20;
		this.floorType = 3;
		this.wallType = 1;
		this.nextLevel = Level2.prototype;
		this.musicId = 'churchMusic';

		this.layout = 
		"####################" +
		"S---#-#------#-----#" +
		"###---H------H-----#" +
		"###-###------#-----#" +
		"###-###########--###" +
    
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
		this.turretList = [];
		this.spawnerProjectileList = [];
		this.pickupList = [];
    
    this.pickupList.push({
			x: 5,
			y: 1,
			type: Key.prototype
		});
    this.pickupList.push({
			x: 1,
			y: 6,
			type: Key.prototype
		});
		
		this.roomSpawnerList.push (
		{
			x: 9.75,
			y: 2,
			room: {upperLeft: {x: 7, y: 1}, bottomRight: {x: 12, y: 4}},
      lockCam: true,
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
    
    this.turretList.push (
    {
      x: 14.5,
      y: 3.5,
      fireRate: 3,
      spinning: false,
      cross: false,
      pDirection: 0.75,
      pSpeed: 96*2,
      pLifeTime: 4,
      pMove: EasingProjectile.prototype.line,
      pEasing: function (t) { return t; }
    });    
    
    this.turretList.push (
    {
      x: 14.5,
      y: 1.5,
      fireRate: 3,
      spinning: false,
      cross: false,
      pDirection: 0.0,
      pSpeed: 96 * 3,
      pLifeTime: 6,
      pMove: EasingProjectile.prototype.line,
      pEasing: function (t) { return t; }
    });   
    
    this.turretList.push (
    {
      x: 17.5,
      y: 1.5,
      fireRate: 3,
      spinning: false,
      cross: false,
      pDirection: 0.25,
      pSpeed: 96 * 1,
      pLifeTime: 2,
      pMove: EasingProjectile.prototype.line,
      pEasing: function (t) { return t; }
    });
    
    this.turretList.push (
    {
      x: 17.5,
      y: 2.5,
      fireRate: 3,
      spinning: false,
      cross: false,
      pDirection: 0.5,
      pSpeed: 96 * 2,
      pLifeTime: 4,
      pMove: EasingProjectile.prototype.line,
      pEasing: function (t) { return t; }
    });
		this.spawnerProjectileList.push (
    {
      x: 15.5,
      y: 3.5,
      dir: {x: 1, y: 0},
      speed: 0,
      lifeTime: 5,
      dieOnHit: false,
      owner: null,
      dmg: 0,
      radius: -100,
      knockback: 0,
      move: EasingProjectile.prototype.line,
      easing: function (t) {return t;},
      timeToSpawn: 1/60,
      attach: true,
      shots: 10,
      circleTime: 5,
      loop: true,
      spawnDirections: {up: true, down: true, left: true, right: true}
    });

		this.pickupList.push({
			x: 17,
			y: 2,
			type: StarPotion.prototype
		});
    
    this.roomSpawnerList.push (
		{
			x: 15.5,
			y: 6.5,
			room: {upperLeft: {x: 13, y: 5}, bottomRight: {x: 18, y: 9}},
      lockCam: true,
			dropKey: true
		});
		
		this.spawnerList.push (
		{
			x: 13,
			y: 5,
			max: 0,
			freq: 3,
			list: [Bat.prototype],
			rand: false,
			radius: 96,
			total: 2,
			roomNum: 2
		});
    
    this.pickupList.push(
    {
      x: 10,
      y: 5,
      type: HealthPotion.prototype
    });
    
    this.roomSpawnerList.push (
		{
			x: 15.5,
			y: 6.5,
			room: {upperLeft: {x: 3, y: 4}, bottomRight: {x: 9, y: 7}},
      lockCam: false,
			dropKey: false
		});
    this.spawnerList.push (
		{
			x: 1,
			y: 4.75,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
    this.spawnerList.push (
		{
			x: 1,
			y: 5.25,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
    this.spawnerList.push (
		{
			x: 1.25,
			y: 5,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
        this.spawnerList.push (
		{
			x: 1.5,
			y: 4.75,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
    this.spawnerList.push (
		{
			x: 1.5,
			y: 5.25,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
    this.spawnerList.push (
		{
			x: 1.75,
			y: 5,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
        this.spawnerList.push (
		{
			x: 2,
			y: 4.75,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
    this.spawnerList.push (
		{
			x: 2,
			y: 5.25,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
    this.spawnerList.push (
		{
			x: 2.25,
			y: 5,
			max: 0,
			freq: 3.45,
			list: [LineJumper.prototype],
			rand: false,
			radius: 96,
			total: 0,
			roomNum: 3
		});
	}		
}