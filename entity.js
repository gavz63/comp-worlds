function Entity(game, x, y) {
    this.game = game;
	this.animation = null;
    this.x = x;
    this.y = y;
	this.id = 0;
	this.circle = false;
    this.removeFromWorld = false;
}

Entity.prototype.setAnimation = function(spritesheet)
{
	this.animation = new Animation(spritesheet, 32, 32, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, 10);
}

Entity.prototype.destroy = function() {
	this.removeFromWorld = true;
}

Entity.prototype.update = function () {
	//console.log("hello");
}

Entity.prototype.draw = function () {
    this.animation.drawFrame(this.game._clockTick, this.ctx, this.x, this.y, false);
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}