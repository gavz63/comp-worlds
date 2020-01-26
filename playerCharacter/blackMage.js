function BlackMage() {
    //Load in the sprite sheets
    var sideToSide = ASSET_MANAGER.getAsset("./img/player_characters/BlackMageSideToSideSheet.png");
    var upAndDown = ASSET_MANAGER.getAsset("./img/player_characters/BlackMageUpDownSheet.png");
    var dmgSheet = ASSET_MANAGER.getAsset("./img/player_characters/BlackMageDmgSheet.png");
    var fireball = ASSET_MANAGER.getAsset("./img/projectiles/Fireball.png");

    //Use to access all animations this character has
    this.animation = {
        //Left facing animations
        idleLeft: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, true, STANDARD_DRAW_SCALE[0]),
        walkingLeft: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, true, STANDARD_DRAW_SCALE[0]),
        regAttackLeft: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 2}, {x: 3, y: 2},
            6, false, STANDARD_DRAW_SCALE[0]),
        specialAttackLeft: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE[0]),
        dmgFromLeft: new Animation(dmgSheet,
            32, 32,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, false, STANDARD_DRAW_SCALE[0]),

        //Right facing animations
        idleRight: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 4}, {x: 5, y: 4},
            6, true, STANDARD_DRAW_SCALE[0]),
        walkingRight: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 5}, {x: 5, y: 5},
            6, true, STANDARD_DRAW_SCALE[0]),
        regAttackRight: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 6}, {x: 3, y: 6},
            6, false, STANDARD_DRAW_SCALE[0]),
        specialAttackRight: new Animation(sideToSide,
            32, 32,
            {x: 0, y: 7}, {x: 5, y: 7},
            6, false, STANDARD_DRAW_SCALE[0]),
        dmgFromRight: new Animation(dmgSheet,
            32, 32,
            {x: 0, y: 0}, {x: 5, y: 0},
            6, false, STANDARD_DRAW_SCALE[0]),

        //Up facing animations
        idleUp: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 0}, {x: 1, y: 0},
            6, true, STANDARD_DRAW_SCALE[0]),
        walkingUp: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 1}, {x: 5, y: 1},
            6, true, STANDARD_DRAW_SCALE[0]),
        regAttackUp: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 2}, {x: 3, y: 2},
            6, false, STANDARD_DRAW_SCALE[0]),
        specialAttackUp: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE[0]),
        dmgFromUp: new Animation(dmgSheet,
            32, 32,
            {x: 0, y: 3}, {x: 5, y: 3},
            6, false, STANDARD_DRAW_SCALE[0]),

        //Down facing animations
        idleDown: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 4}, {x: 5, y: 4},
            6, true, STANDARD_DRAW_SCALE[0]),
        walkingDown: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 5}, {x: 5, y: 5},
            6, true, STANDARD_DRAW_SCALE[0]),
        regAttackDown: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 6}, {x: 5, y: 6},
            6, false, STANDARD_DRAW_SCALE[0]),
        specialAttackDown: new Animation(upAndDown,
            32, 32,
            {x: 0, y: 3}, {x: 5, y: 7},
            6, false, STANDARD_DRAW_SCALE[0]),
        dmgFromDown: new Animation(dmgSheet,
            32, 32,
            {x: 0, y: 2}, {x: 5, y: 2},
            6, false, STANDARD_DRAW_SCALE[0]),

        //Projectile animations
        regProjectileUp: new Animation(fireball,
        16, 16,
        {x: 0, y: 0}, {x: 3, y: 0},
        6, true, STANDARD_DRAW_SCALE[0]),
        regProjectileDown: new Animation(fireball,
            16, 16,
            {x: 0, y: 0}, {x: 3, y: 0},
            6, true, STANDARD_DRAW_SCALE[0]),
        regProjectileLeft: new Animation(fireball,
            16, 16,
            {x: 0, y: 0}, {x: 3, y: 0},
            6, true, STANDARD_DRAW_SCALE[0]),
        regProjectileRight: new Animation(fireball,
            16, 16,
            {x: 0, y: 0}, {x: 3, y: 0},
            6, true, STANDARD_DRAW_SCALE[0]),
    };

    this.stats = {
        maxHP: 3,
        speed: 100
    }
}