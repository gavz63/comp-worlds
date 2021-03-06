// functions from the fast and funky 1d transformations gdc talk.

function smoothStartN(t, n)
{
	return Math.pow(t, n);
}

function flip(t)
{
	return 1 - t;
}

function smoothStopN(t, n)
{
	return flip(smoothStartN(flip(t), n));
}

// A and B can be anything.
// percentage is a ratio between 0.00 and 1.00
// mix (A, B, 0.1) would return a value that is 1 part A and 9 parts B
function mix(A, B, percentage)
{
	return A * (1-percentage) + B * percentage;
}

function scale(x, t)
{
	return x * t;
}

function reverseScale(x, t)
{
	return x * (1-t);
}

// note Arch returns values from 0 - 0.25 - 0. As t goes from 0 - 0.5 - 1
function arch(t)
{
	return t * flip(t);
}

function arch4(t)
{
	return t * flip(t) * 4;
}

function clampBottom(t)
{
	if(t < 0)
	{
		return 0;
	}
	return t;
}

function clampTop(t)
{
	if(t > 1)
	{
		return 1;
	}
	return t;
}

function bezier3(B, C, t)
{
	let s = 1 - t;
	let t2 = t * t;
	let s2 = s*s;
	let t3 = t2 * t;
	return (3 * B * s2 * t) + (3 * C * s * t2) + t3;
}

function bezier7(B, C, D, E, F, G, t)
{
	let s = 1 - t;
	let t2 = t * t;
	let s2 = s*s;
	let t3 = t2 * t;
	let s3 = s2 * s;
	let t4 = t3 * t;
	let s4 = s3 * s;
	let t5 = t3 * t2;
	let s5 = s3 * s2;
	let t6 = t3 * t3;
	let s6 = s3 * s3;
	let t7 = t6 * t;
	return (7 * B * s6 * t) + (21 * C * s5 * t2) + (35 * D * s4 * t3) + (35 * E * s3 * t4) + (21 * F * s2 * t5) + (7 * G * s * t6) + t7;
}

function clamp(t)
{
	return clampBottom(clampTop(t));
}

function bounceClampBottom(t)
{
	return Math.abs(t);
}

function bounceClampTop(t)
{
	return flip(Math.abs(flip(t)));
}

function bounceClamp(t)
{
	return bounceClampTop(bounceClampBottom(t));
}