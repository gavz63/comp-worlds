

/*
Timer

The timer class is used to track the duration of certain functions.
Used for animations and timing
*/
function Timer(game, time, looping)
{
	this.game = game;
	this.end = time;
	this.elapsed = 0.0;
	this.looping = looping;
	this.removeFromWorld = false;
	this.paused = false;
	this.callback =  null;
}

Timer.prototype.update = function (dt)
{
	if(this.paused === false)
	{
		//console.log("Timer" + this.id + " Working: " + this.elapsed + " != " + this.end);
		this.elapsed += dt;
		if(this.elapsed >= this.end)
		{
			if(this.looping === true)
			{
				this.elapsed -= this.end;
			}
			else
			{
				this.destroy();
			}
		}
	}
}

Timer.prototype.getTime = function ()
{
	return this.elapsed;
}

Timer.prototype.getPercent = function ()
{
	return this.elapsed / this.end;
}

Timer.prototype.destroy = function ()
{
	this.removeFromWorld = true;
}

Timer.prototype.pause = function ()
{
	this.paused = true;
}

Timer.prototype.unpause = function ()
{
	this.paused = false;
}

Timer.prototype.reset = function ()
{
	this.elapsed = 0;
}

function TimerCallBack(game, time, looping, fn)
{
	Timer.call(this, game, time, looping);
	
	this.callback = fn;
}

TimerCallBack.prototype = new Timer();
TimerCallBack.prototype.constructor = TimerCallBack;

TimerCallBack.prototype.update = function ()
{
	if(this.paused === false)
	{
		this.elapsed += this.game._clockTick;
		if(this.elapsed >= this.end)
		{
			this.callback();
			if(this.looping === true)
			{
				this.elapsed -= this.end;
			}
			else
			{
				this.destroy();
			}
		}
	}
}