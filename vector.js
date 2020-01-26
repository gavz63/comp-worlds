function lengthV(vector)
{
	let length = vector.x*vector.x + vector.y*vector.y;
	if(length === 0)
	{
		return 0;
	}
	return Math.sqrt(length);
}

function normalizeV(vector)
{
	//console.log("Normalize: " + vector.x + ", " + vector.y);
	let length = lengthV(vector);
	if(length === 0)
	{
		return {x: 0, y: 0};
	}
	return {x: vector.x/length, y: vector.y/length};
}

function scaleV(vector, s)
{
	return {x: vector.x*s, y: vector.y*s};
}

function dirV(A, B)
{
	return {x: B.x - A.x, y: B.y - A.y};
}

function perpendicularV(vector)
{
	return normalizeV({x: vector.y, y: -vector.x});
}