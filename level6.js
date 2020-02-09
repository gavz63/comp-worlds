class Level6
{
	constructor()
	{
		this.width = 20;
		this.height = 20;
		this.floorType = 0;
		this.wallType = 0;
		
		this.layout = 
		"###-----------------" +
		"S-------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"--------------------" +
		"-----------------H--" +
		"---------V---V------" +
		"-------------------E" +
		"--------------------";
		
		this.spawnerList = [];
		this.hazardList = [];
		this.pickupList = [];
		
    this.hazardList.push (
    {
       x: 1,
       y: 1,
       fireRate: 5,
       spinning: false,
       cross: false,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.line,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 4,
       y: 1,
       fireRate: 5,
       spinning: true,
       cross: false,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.line,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 1,
       y: 4,
       fireRate: 5,
       spinning: false,
       cross: true,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.line,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 4,
       y: 4,
       fireRate: 5,
       spinning: true,
       cross: true,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.line,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });	
    //2
    this.hazardList.push (
    {
       x: 7,
       y: 1,
       fireRate: 5,
       spinning: false,
       cross: false,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.circle,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 10,
       y: 1,
       fireRate: 5,
       spinning: true,
       cross: false,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.circle,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 7,
       y: 4,
       fireRate: 5,
       spinning: false,
       cross: true,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.circle,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 10,
       y: 4,
       fireRate: 5,
       spinning: true,
       cross: true,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.circle,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    //3
    this.hazardList.push (
    {
       x: 1,
       y: 7,
       fireRate: 5,
       spinning: false,
       cross: false,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.spiral,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 4,
       y: 7,
       fireRate: 5,
       spinning: true,
       cross: false,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.spiral,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });		
    this.hazardList.push (
    {
       x: 1,
       y: 10,
       fireRate: 5,
       spinning: false,
       cross: true,
       pSpeed: 100,
       pLifeTime: 2,
       pMove: EasingProjectile.prototype.spiral,
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
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
       pEasing: function (t) { return bounceClampTop(scale(t,2)); }
    });
	}		
}