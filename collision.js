// if two points are equal they are collding
function pointToPoint(A, B)
{
	if(A.x === B.x && A.y === B.y)
	{
		return true;
	}
	return false;
}

//if the distance between a point and a circle is less than the radius of the circle they are colliding
function pointToCircle(A, B, range)
{
	let dist = (B.y - A.y) * (B.y - A.y) + (B.x - A.x) * (B.x - A.x);
	dist = Math.sqrt(dist);
	
	if(dist <= range)
	{
		return true;
	}
	return false;
}

// if two circles are closer than their combined radius they are colliding
function circleToCircle(A, B)
{
	let dist = (B.y - A.y) * (B.y - A.y) + (B.x - A.x) * (B.x - A.x);
	dist = Math.sqrt(dist);
	
	if(dist <= A.radius + B.radius)
	{
		return true;
	}
	return false;
}

//Make a big square the size of both squares combined with the center point of A.
//If B's center point lies within that square, these two squares collide.
function squareToSquare(A, B)
{
	let halfW = (A.width + B.width) / 2;
	let halfH = (A.height + B.height) / 2;
	
	if(B.x <= A.x + halfW && B.x >= A.x - halfW)
	{
		if(B.y <= A.y + halfH && B.y >= A.y - halfH)
		{
			return true;
		}
	}
	return false;
}