function Lancer() {
    //Load all the spritesheets
    var sideToSide = ASSET_MANAGER.getAsset("./img/player_characters/LancerSideToSideSheet.png");
    var upAndDown = ASSET_MANAGER.getAsset("./img/player_characters/LancerUpDownSheet.png");
    var specialSheet = ASSET_MANAGER.getAsset("./img/player_characters/LancerSpecialMoveAllDirections.png");
    var dmgSheet = ASSET_MANAGER.getAsset("./img/player_characters/LancerDmgSheet.png");
    var specialSlash = ASSET_MANAGER.getAsset("./img/projectiles/PureSlash.png");
    var regPoke = ASSET_MANAGER.getAsset("./img/projectiles/PokeSheet.png");


    //Use to access all animations this character uses
    this.animation = {
        //Left facing animations
        idleLeft: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE),
        walkingLeft: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            12, true, STANDARD_DRAW_SCALE),
        regAttackLeft: function () { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackLeft: function () { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            24, false, STANDARD_DRAW_SCALE); },
        dmgFromLeft: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, false, STANDARD_DRAW_SCALE),

        //Right facing animations
        idleRight: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE),
        walkingRight: new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 4}, {x: 5, y: 4},
            12, true, STANDARD_DRAW_SCALE),
        regAttackRight: function() { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 5}, {x: 5, y: 5},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackRight: function () { return new Animation(sideToSide,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 5}, {x: 5, y: 5},
            24, false, STANDARD_DRAW_SCALE); },
        dmgFromRight: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE),

        //Up facing animations
        idleUp: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE),
        walkingUp: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 4}, {x: 5, y: 4},
            12, true, STANDARD_DRAW_SCALE),
        regAttackUp: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 5}, {x: 5, y: 5},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackUp: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 5}, {x: 5, y: 5},
            24, false, STANDARD_DRAW_SCALE); },
        dmgFromUp: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE),

        //Down facing animations
        idleDown: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE),
        walkingDown: new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            12, true, STANDARD_DRAW_SCALE),
        regAttackDown: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            24, false, STANDARD_DRAW_SCALE); },
        specialAttackDown: function () { return new Animation(upAndDown,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            24, false, STANDARD_DRAW_SCALE); },
        dmgFromDown: new Animation(dmgSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            6, false, STANDARD_DRAW_SCALE),

        //Projectile animations
        regProjectileUp: function() { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0},
            10, false, STANDARD_DRAW_SCALE*3); },
        regProjectileDown: function () { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 3, y: 1},
            20, false, STANDARD_DRAW_SCALE*3); },
        regProjectileLeft: function () { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2},
            20, false, STANDARD_DRAW_SCALE*3); },
        regProjectileRight: function () { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 3, y: 3},
            20, false, STANDARD_DRAW_SCALE*3); },
			
		//Special animations
        specialProjectileUp: function() { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0},
            10, false, STANDARD_DRAW_SCALE*3); },
        specialProjectileDown: function () { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 3, y: 1},
            20, false, STANDARD_DRAW_SCALE*3); },
        specialProjectileLeft: function () { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2},
            20, false, STANDARD_DRAW_SCALE*3); },
        specialProjectileRight: function () { return new Animation(regPoke,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 3, y: 3},
            20, false, STANDARD_DRAW_SCALE*3); }
    };

	this.attack = function (player, attackVector)
	{	
		let projectileAnimation = null;
		switch (player.direction) {
			case DIRECTION_DOWN:
				projectileAnimation = player.characterClass.animation.regProjectileDown();
				break;
			case DIRECTION_UP:
				projectileAnimation = player.characterClass.animation.regProjectileUp();
				break;
			case DIRECTION_LEFT:
				projectileAnimation = player.characterClass.animation.regProjectileLeft();
				break;
			default:
				projectileAnimation = player.characterClass.animation.regProjectileRight();
				break;
		}
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
		player.game.rightClick = false;
		let projectile = new SpawnerProjectile(player.game, player.x, player.y, attackVector, player.characterClass.stats.specialSpeed, player.characterClass.stats.specialLifetime, player, projectileAnimation, 1, 5, function() {}, function() {}, 1);
		projectile.setAttachedToOwner(player.characterClass.stats.specialMelee);
	};

    this.collider = new Collider(0, 0, 14, 14, 9, 9, null, 120);

    this.stats = {
        maxHP: 3,
        speed: 1000,
        melee: true,
        projectileSpeed: 50,
        projectileLifetime: 0.25,
		specialMelee: true,
		specialSpeed: 50,
        specialLifetime: 0.25,
        maxProjectiles: 1
    };

    this.npc = {
        x: -32,
        y: 50
    }
}