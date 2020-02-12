function BlackMage() {
    //Load in the sprite sheets
    var sideToSide = ASSET_MANAGER.getAsset("./img/player_characters/BlackMageSideToSideSheet.png");
    var upAndDown = ASSET_MANAGER.getAsset("./img/player_characters/BlackMageUpDownSheet.png");
    var dmgSheet = ASSET_MANAGER.getAsset("./img/player_characters/BlackMageDmgSheet.png");
    var fireball = ASSET_MANAGER.getAsset("./img/projectiles/Fireball.png");
	var flame = ASSET_MANAGER.getAsset("./img/projectiles/Flame.png");

    //Use to access all animations this character has
    this.animation = {
        //Left facing animations
        idleLeft: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE),
        walkingLeft: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, true, STANDARD_DRAW_SCALE),
        regAttackLeft: function () { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackLeft: function () { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE); },
        dmgFromLeft: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, false, STANDARD_DRAW_SCALE),

        //Right facing animations
        idleRight: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 4}, {x: 5, y: 4},
            6, false, STANDARD_DRAW_SCALE),
        walkingRight: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 5}, {x: 5, y: 5},
            6, true, STANDARD_DRAW_SCALE),
        regAttackRight: function () { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 6}, {x: 3, y: 6},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackRight: function () { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 7}, {x: 5, y: 7},
            6, false, STANDARD_DRAW_SCALE); },
        dmgFromRight: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE),

        //Up facing animations
        idleUp: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE),
        walkingUp: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, true, STANDARD_DRAW_SCALE),
        regAttackUp: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackUp: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE); },
        dmgFromUp: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE),

        //Down facing animations
        idleDown: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 4}, {x: 5, y: 4},
            6, false, STANDARD_DRAW_SCALE),
        walkingDown: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 5}, {x: 5, y: 5},
            6, true, STANDARD_DRAW_SCALE),
        regAttackDown: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 6}, {x: 3, y: 6},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackDown: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 7},
            6, false, STANDARD_DRAW_SCALE); },
        dmgFromDown: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            6, false, STANDARD_DRAW_SCALE),

        //Projectile animations
        regProjectile: function () { return new Animation(fireball,
			16, 16,
			{x: 0, y: 0}, {x: 3, y: 0},
			6, true, STANDARD_DRAW_SCALE); },
			
	
        //Special animations
        specialProjectile: function () { return new Animation(flame,
			32, 32,
			{x: 0, y: 0}, {x: 2, y: 0},
			6, true, STANDARD_DRAW_SCALE * 3); }
    };
	
	let that = this;
	
	this.attack = function (player, attackVector)
	{
		let projectileAnimation = that.animation.regProjectile();
		let projectile = new Projectile(player.game,
			player.x, player.y,
			attackVector,
			player.characterClass.stats.projectileSpeed, player.characterClass.stats.projectileLifetime,
			player, projectileAnimation,
			1, 20); // slowed down projectile for debugging
		projectile.setAttachedToOwner(player.characterClass.stats.melee);
	};
	
	this.specialAttack = function (player, attackVector)
	{
		let projectile = new SpawnerProjectile(player.game, player.x, player.y, attackVector, player.characterClass.stats.specialSpeed, player.characterClass.stats.specialLifetime, player, that.animation.specialProjectile(), 1, 5, function() {}, function() {}, 1);
		projectile.setAttachedToOwner(player.characterClass.stats.specialMelee);
	};

    this.collider = new Collider(0, 0, 14, 15, 10, 10, null, 150);

    this.stats = {
        maxHP: 2,
        speed: 150,
        melee: false,
        projectileSpeed: 300,
        projectileLifetime: 0.5,
        specialMelee: false,
        specialSpeed: 50,
        specialLifetime: 1.1,
        maxProjectiles: 3
    };
    this.npc = {
        x: -32,
        y: 0
    }
}