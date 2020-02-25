function raycast(pt1, pt2, numRays, collision)
{
	let dir = dirV(pt1, pt2);	
	let stepSize = lengthV(dir)/numRays;
	dir = normalizeV(dir);
	
	
	let currX = pt1.x;
	let currY = pt1.y;
	
	for(let i = 0; i < numRays; i++)
	{
		currX += stepSize * dir.x;
		currY += stepSize * dir.y;
		
		if(collision({x: currX, y: currY}))
		{
			return true;
		}
	}
	return false;
}