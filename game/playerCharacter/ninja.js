function Ninja() {
    //Load in the sprite sheets
    var spriteSheet = ASSET_MANAGER.getAsset("./img/player_characters/Ninja.png");
    var dmgSheet = ASSET_MANAGER.getAsset("./img/player_characters/BlackMageDmgSheet.png");
    var shuriken = ASSET_MANAGER.getAsset("./img/projectiles/Shuriken.png");
    var slash = ASSET_MANAGER.getAsset("./img/projectiles/PureSlash.png");

    //Use to access all animations this character has
    this.animation = {
        //Left facing animations
        idleLeft: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 4, y: 2}, {x: 4, y: 3},
            6, false, STANDARD_DRAW_SCALE),
        walkingLeft: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 8}, {x: 4, y: 9},
            10, true, STANDARD_DRAW_SCALE),
        regAttackLeft: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 9}, {x: 4, y: 10},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackLeft: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 10}, {x: 4, y: 11},
            10, false, STANDARD_DRAW_SCALE); },
        dmgFromLeft: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, false, STANDARD_DRAW_SCALE),

        //Right facing animations
        idleRight: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 4, y: 2}, {x: 4, y: 3},
            6, false, STANDARD_DRAW_SCALE),
        walkingRight: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 3}, {x: 4, y: 4},
            10, true, STANDARD_DRAW_SCALE),
        regAttackRight: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 4}, {x: 4, y: 5},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackRight: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 5}, {x: 4, y: 6},
            10, false, STANDARD_DRAW_SCALE); },
        dmgFromRight: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE),

        //Up facing animations
        idleUp: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 4, y: 2}, {x: 4, y: 3},
            6, false, STANDARD_DRAW_SCALE),
        walkingUp: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 6}, {x: 2, y: 7},
            10, true, STANDARD_DRAW_SCALE),
        regAttackUp: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 3, y: 7}, {x: 0, y: 8},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackUp: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 1, y: 8}, {x: 4, y: 8},
            10, false, STANDARD_DRAW_SCALE); },
        dmgFromUp: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE),

        //Down facing animations
        idleDown: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 4, y: 2}, {x: 4, y: 3},
            6, false, STANDARD_DRAW_SCALE),
        walkingDown: new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0},
            10, true, STANDARD_DRAW_SCALE),
        regAttackDown: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 5, y: 0}, {x: 1, y: 1},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackDown: function () { return new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 2, y: 1}, {x: 5, y: 1},
            10, false, STANDARD_DRAW_SCALE); },
        dmgFromDown: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            6, false, STANDARD_DRAW_SCALE),

        //Projectile animations
        regProjectile: function () { return new Animation(shuriken,
        STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
        {x: 0, y: 0}, {x: 7, y: 0},
        24, true, STANDARD_DRAW_SCALE); },
			
		//Special Projectile animations
        specialProjectileUp: function() { return new Animation(slash,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2},
            30, false, STANDARD_DRAW_SCALE*3); },
        specialProjectileDown: function () { return new Animation(slash,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 3, y: 3},
            30, false, STANDARD_DRAW_SCALE*3); },
        specialProjectileLeft: function () { return new Animation(slash,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0},
            30, false, STANDARD_DRAW_SCALE*3); },
        specialProjectileRight: function () { return new Animation(slash,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 3, y: 1},
            30, false, STANDARD_DRAW_SCALE*3); }
    };

	let that = this;
	
	this.attack = function (player, attackVector)
	{
			let projectileAnimation = that.animation.regProjectile();
			let projectile = new Shuriken(player.game,
				player.x, player.y,
				attackVector,
				player.characterClass.stats.projectileSpeed, player.characterClass.stats.projectileLifetime,
				false, player, projectileAnimation,
				1, 5, 7, EasingProjectile.prototype.line, function(t) { return smoothStopN(t, 4); });
        projectile.GiveBackAmmo();
	};
	
	this.specialAttack = function (player, attackVector)
	{
		let specialAnimation = null;

		switch (player.direction) {
			case DIRECTION_DOWN:
				specialAnimation = player.characterClass.animation.specialProjectileDown();
				break;
			case DIRECTION_UP:
				specialAnimation = player.characterClass.animation.specialProjectileUp();
				break;
			case DIRECTION_LEFT:
				specialAnimation = player.characterClass.animation.specialProjectileLeft();
				break;
			default:
				specialAnimation = player.characterClass.animation.specialProjectileRight();
				break;
		}		
		let projectile = new Slash(player.game, player.x, player.y, attackVector, player.characterClass.stats.specialSpeed, player.characterClass.stats.specialLifetime, false, player, specialAnimation, 2, 40, 10);
		projectile.attachTo(player);
		projectile.hitOnce();
	};

    this.collider = new Collider(0, 0, 14, 15, 10, 10, null, 150);

    this.stats = {
        maxHP: 1,
        speed: 225,
        melee: false,
        projectileSpeed: 150,
        projectileLifetime: 1,
        specialMelee: true,
        specialSpeed: 10,
        specialLifetime: 0.25,
        specialChargeTime: 1,
        specialChargeFromKill: 0,
        maxProjectiles: 10,
    };
    this.npc = {
        x: -64,
        y: 0
    }
}