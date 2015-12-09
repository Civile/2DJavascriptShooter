
function __collDetect()
{
	
	this.solidsInThisArea; 
	
	//errors list
	this.NO_COORDINATES = -1;
	this.NO_DIRECTION = -2;
	
	
	this.detect = function(solids, element, direction)
	{
		if( !solids || !element )
			return -1;
		
		this.solidsInThisArea = __sections.retrieveObjs(__sections.getZoneByX(element.xpos), solids);
		if( !this.solidsInThisArea )
			return false;
		
		var dir = direction != null ? direction : element.direction;
		if( !dir )
			return this.NO_DIRECTION;
		
		if( dir == RIGHT || dir > 1)//goin' right		
		{
			
			for( var i in this.solidsInThisArea )
			{	
				var solidObjPos = $(this.solidsInThisArea[i]).position();
				
				if( ( solidObjPos.left + $(this.solidsInThisArea[i]).width() > element.xpos ) && ( element.xpos + element.width + element.xvel ) >= solidObjPos.left && (solidObjPos.top + $(this.solidsInThisArea[i]).height()) > element.ypos + element.yvel && solidObjPos.top < (element.ypos + element.yvel))
					return this.solidsInThisArea[i];
			}
		}
		else if( dir == LEFT || dir < -1) //goin' left
		{
			
			for( var i in this.solidsInThisArea )
			{
				var solidObjPos = $(this.solidsInThisArea[i]).position();	
				
				if( solidObjPos.left < element.xpos && (element.xpos + element.xvel) <= (solidObjPos.left +  $(this.solidsInThisArea[i]).width()) && (solidObjPos.top +  $(this.solidsInThisArea[i]).height()) > element.ypos + element.yvel && solidObjPos.top < (element.ypos + element.yvel) )
					return this.solidsInThisArea[i];
			}
		}
		return false;
	}
	
	
	
	
	
	this.resolveCollision = function(collided)
	{
		
		return true;
	}
	
	//position
	this.getRight = function(elementToCheck)
	{
		var coord = $(elementToCheck).position();
		return coord.left + $(elementToCheck).height();
	}
	
	this.getLeft = function(elementToCheck)
	{
		var coord = $(elementToCheck).position();
		return coord.left;
	}
	
	this.getBottom = function(elementToCheck)
	{
		var coord = $(elementToCheck).position();
		return coord.top + $(elementToCheck).height();
	}
	
	this.getTop = function(elementToCheck)
	{
		var coord = $(elementToCheck).position();
		return coord.top;
	}
	
	
	//dimensions
	this.getWidth = function(object) 
	{
		if( !object )
			return null;
		return $(object).width();
	}
	
	
}