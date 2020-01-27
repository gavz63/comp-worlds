function Input() {
// MOUSE
	let that = this;
	
    this.ctx.canvas.addEventListener("mousedown", function (e) {
        that.clicking = true;
        console.log(that.mouseX + ", " +that.mouseY);
		that.click = true;
		//We ought to change to the attack animation if mouse was clicked
		that.change = true;
		that.reticle.animation.setFrame(1);
    }, false);
	
	this.ctx.canvas.addEventListener("mouseup", function (e) {
		that.clicking = false;
		that.reticle.animation.setFrame(0);
    }, false);

	//Right Click TODO make this do the special attack
    this.ctx.canvas.addEventListener("contextmenu", function (e) {

    }, false);

	//Update  mouse Position
    this.ctx.canvas.addEventListener("mousemove", function (e) {
		

		var element = that.ctx.canvas, offsetX = 0, offsetY = 0, mx, my;

		// Compute the total offset
		if (element.offsetParent !== undefined) {

				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
		}

		mx = e.pageX - offsetX;
		my = e.pageY - offsetY;
		
        that.mouseX = mx;
		that.mouseY = my;
		that.mousePos = {x: mx, y: my};

    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {

    }, false);

// KEYBOARD

    this.ctx.canvas.addEventListener("keypress", function (e) {
		//Key press counts each key once until it is released.
		if(that.chars[e.code] !== true)
		{
			//opposite directions are set to false, but will be set to true on release if they are still held down.
			if (e.code === "KeyW")
			{
				that.w = true;
				that.s = false;
			}
			if (e.code === "KeyA")
			{
				that.a = true;
				that.d = false;
			}
			if (e.code === "KeyS")
			{
				that.s = true;
				that.w = false;
			}
			if (e.code === "KeyD")
			{
				that.d = true;
				that.a = false;
			}
			
			that.chars[e.code] = true;
			that.keyStack.push(e.code); // keystack track the order keys are pressed
			that.lastKey = e.code;		// This is the last input
			that.change = true;			// Notify player animator to change animation.
			console.log("lastKey: " + that.lastKey);
			console.log(that.keyStack.length);
		}
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
		//Set opposites back to true if they are still held down on release.
		if (e.code === "KeyW")
		{
			that.w = false;
			if(that.chars["KeyS"] === true)
			{
				that.s = true;
			}
		}
		if (e.code === "KeyA")
		{
			that.a = false;
			if(that.chars["KeyD"] === true)
			{
				that.d = true;
			}
		}
		if (e.code === "KeyS")
		{
			that.s = false;
			if(that.chars["KeyW"] === true)
			{
				that.w = true;
			}
		}
		if (e.code === "KeyD")
		{
			that.d = false;
			if(that.chars["KeyA"] === true)
			{
				that.a = true;
			}
		}
		
		that.chars[e.code] = false;
		// Step backwards through the stack to find the last key pressed that is still held down.
		if(that.lastKey === e.code)
		{
			that.change = true;
			that.keyStack.pop();
			while(that.keyStack.length > 0)
			{
				if(that.chars[that.keyStack[that.keyStack.length - 1]] === true)
				{
					that.lastKey = that.keyStack[that.keyStack.length - 1];
					break;
				}
				that.keyStack.pop();
			}
		}
		
		console.log("lastKey: " + that.lastKey);
		console.log(that.keyStack.length);

    }, false);
}