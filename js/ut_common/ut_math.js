
/*
===================================================
Math and phisix common utilities
===================================================
*/


//ADD: Ottimizza le funzioni



/*
=====================
Get distance from two points
=====================
*/
function mh_getDistance2P(cCoordA, cCoordB)
{
    if (!cCoordA || !cCoordB)
        return;
    
    var distance = Math.sqrt(Math.pow(cCoordA.xpos - cCoordB.xpos, 2) + Math.pow(cCoordA.ypos - cCoordB.ypos, 2));
    return distance;
}



function mh_constrain(val, min, max)
{
    if (val > max)
        return val = max;
    if (val < min)
        return val = min;

    return val;
}


/*
=====================
Get the center coord of a gentity
=====================
*/
function mh_getCenter(xpos, ypos, width)
{
    if (!width )
        return;

    centerCoord = {
        xpos: xpos + (width / 2),
        ypos: ypos - (width / 2)
    };

    return centerCoord;
}



function mh_getRectC_vertexA(xpos, ypos, width, height)
{
    centerCoord = {
        xpos: xpos + (width / 2),
        ypos: ypos + (height / 2)
    };

    return centerCoord;
}



/*
===============================================================
TIME
===============================================================
*/
/*
=====================
Millis to secs
=====================
*/
function mh_ms2sec(ms)
{
    if( ms != 0)
        return ms / 1000;
}