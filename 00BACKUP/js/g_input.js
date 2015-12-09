
/*
==========================================
g_input.js
Initialize inputs, instatiate input listener
==========================================
*/


/*
=====================
Presets input
=====================
*/
var tickRate = 1;
var keyArrowUp    = false;
var keyArrowDown  = false;
var keyArrowLeft  = false;
var keyArrowRight = false;
var keyCtrl 	  = false;
var keyShift      = false;
var keyE          = false;
var keyC          = false;
var keyV          = false;
var keyP	 	  = false;
var keyI	 	  = false;
var key1		  =	false;
var key2          = false;
var key3          = false;
var key4          = false;
var key5          = false;
var keyEsc        = false;
var noKey 		  = true;


//Game contexts
var gContexts = new Array();
    gContexts[GAME] = function (e) { p_cmd(e); };
var actContext = GAME;


/*
=====================
Init input
=====================
*/
var initInput = function()
{
	$('body').keydown(function(e)
	{

		if(e)
			noKey = false;

		switch (e.which) 
		{
			case 38: keyArrowUp = true; break;
			case 40: keyArrowDown = true; break;
			case 37: keyArrowLeft = true; break;
			case 39: keyArrowRight = true; break;
			case 17: keyCtrl = true; break;
		    case 16: keyShift = true; break;
		    case 69: keyE = true; break;
		    case 67: keyC = true; break;
		    case 86: keyV = true; break;
			case 80: keyP = true; break;
			case 73: keyI = true; break;
			case 49: key1 = true; break;
		    case 50: key2 = true; break;
		    case 51: key3 = true; break;
		    case 52: key4 = true; break;
		    case 53: key5 = true; break;
		    case 27: keyEsc = true; break;
		}
	});	
	
	$('body').keyup(function(e)
	{
		noKey = true;
		switch (e.which) 
		{
			case 38: keyArrowUp = false; break;
			case 40: keyArrowDown = false; break;
			case 17: keyCtrl = false; break;
			case 37: keyArrowLeft = false; break;
			case 39: keyArrowRight = false; break;
			case 16: keyShift = false; break;
		    case 73: keyI = false; break;
		    case 67: keyC = false; break;
		    case 86: keyV = false; break;
		    case 69: keyE = false; break;
			case 80: keyP = false; break;
			case 49: key1 = false; break;
		    case 50: key2 = false; break;
		    case 51: key3 = false; break;
		    case 52: key4 = false; break;
		    case 53: key5 = false; break;
		    case 27: keyEsc = false; break;
		}
	});
	
	inputListener();
	return true;
}



/*
=====================
Input listener
=====================
*/
var inputListener = function(key) 
{
	if (keyArrowUp) 	     __sendCmd('up');
	if (keyArrowDown) 	 __sendCmd('down');
	if (keyArrowLeft) 	 __sendCmd('left');
	if (keyArrowRight)  __sendCmd('right');
	if (keyCtrl) 	     __sendCmd('ctrl');
	if (keyShift) 	     __sendCmd('shift');
	if (keyP)           __sendCmd('p');
	if (keyE)           __sendCmd('e');
	if (keyC)           __sendCmd('c');
	if (keyV)           __sendCmd('v');
	if (keyI) 		     __sendCmd('i');
	if (key1) 		     __sendCmd('1');
	if (key2)           __sendCmd('2');
	if (key3)           __sendCmd('3');
	if (key4)           __sendCmd('4');
	if (key5)           __sendCmd('5');

	if (keyEsc)         __sendCmd('esc');
	 
	setTimeout(initInput, 25);
}



/*
=====================
Cmd dispatcher
=====================
*/
function __sendCmd(_cmd)
{	
	if( !_cmd )
		return null;
	if( _cmd == 'p' )
	{
		m_pauseGame(true);
	}
	else if (_cmd == 'esc')
	{
	    mainMenu.load();
	}
	if( game.playing )
	{
	    gContexts[actContext](_cmd);
	}
}





function p_cmd(cmd)
{
	if( !cmd || !player )
		return null;
	switch( cmd )
	{
		case 'right':
				player.move(RIGHT);
		break;
		case 'left':
			player.move(LEFT);
		break;
		case 'down':
			player.move(DOWN);
		break;
		case 'up':
			player.move(UP);
		break;
		case 'ctrl':
			player.move(SHOOT);
		break;
		case 'shift':
			player.move(SPRINT);
		break;
		case 'i':
			player.move(CALL_INVENTARY);
	    break;
	    case 'e':
	        player.move(USE);
	    break;
	    case 'c':
	        player.move(ROCKET_CAMERA);
	        break;
		case '1':
			player.move(SET_WEAPON_PLASMAGUN);
		break;
		case '2':
			player.move(SET_WEAPON_SHOTGUN);
			break;
	    case '3':
	        player.move(SET_WEAPON_MACHINEGUN);
	        break;
	    case '4':
	        player.move(SET_WEAPON_ROCKETLAUNCHER);
	        break;
	    case '5':
	        player.move(SET_WEAPON_HOLEGENERATOR);
	        break;
	    case 'v':
	        if (camera.lastFollowedOrig != $('#soldier')[0])
	            camera.setFollowed($('#soldier')[0]);
	        else camera.setFollowed($('#player')[0]);
	        break;
	}
}


function p_movingPad(cmd) {
    if (!cmd)
        return null;
    switch (cmd) {
        case 'down':
            __movingPad.move(DOWN);
            break;
        case 'up':
            __movingPad.move(UP);
            break;
        case 'e':
            __movingPad.move(USE);
            break;
    }
}










