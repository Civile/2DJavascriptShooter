/*
==========================================
Maps
It contains: maps, loadLevel's functions
==========================================
*/


function m_initGameScreen(gType) {

    //Survival mode needs PointsView ecc.
    if (gType == SURVIVAL) {
        $(WINDOW_WND).append('<div id="survivalLogo" style="position:absolute; right:10px; top:10px; width:150px; height:21px; opacity:0.5;"><img src="src/text/t_smode_small.png" /></div>');
        $('#hud').css('top', '5px');
        $(WINDOW_WND).append('<div id="pointsView" style="position:absolute; right:13px; color:white; font-family:cgothic; font-size:12px; top:30px; min-width:50px; height:21px;"></div>');
        $('#objective').remove();
    }
    else if (gType == CAMPAIGN) {

        $('#survivalLogo').remove();
        $('#hud').css('top', '40px');
        $('#pointsView').remove();
    }
}


/*
=====================
Load map
=====================
*/
function m_loadLevel(level, gType)
{
    if (gType == CAMPAIGN) {
        if (level == 1)
            levelOne();
        if (level == 2)
            levelTwo();
        m_initGameScreen(CAMPAIGN);
    }
    else if (gType == SURVIVAL)
    {
        if (level == 'S1')
            s_levelOne();
        if (level == 'S2')
            s_levelTwo();
        m_initGameScreen(SURVIVAL);
    }
}



function m_setBackground(src) {
    $(WINDOW_WND).css('background', 'url("'+src+'")');
}


function m_setMapDimensions(width, height) {

    if (width > 8000 || height > 430)
        return;
    return $(GAME_WND).width(parseInt(width)).height(height);
}


function m_getMapWidth() {
    return $(GAME_WND).width();
}

function m_getMapHeight() {
    return $(GAME_WND).height();
}



function m_setSpawnPoint(x, y) {
    spawnPointX = x;
    spawnPointY = y;
}

function m_getSpawnX() {
    return spawnPointX;
}

function m_getSpawnY() {
    return spawnPointY;
}



/*
=====================
Preload an'object
=====================
*/
function printBlock(x, y, width, height, type, id, z_index, interactions, isSolid)
{
    if (type == 'cloud')
        return game.gentities.push(new Cloud(x, y, null));
    if (type == 'movable_floor') 
        return game.gentities.push(new __movableFloor(x, y, width, height));
    //Load the map
    if (type != 'monster')
        __sections.addBox(x, y, width, height, type, id, interactions, z_index, true);
    else switch(id){

        case 'soldier':
            game.gentities.push(new __soldier(x, y, width, height, id, 10, null));
            break;
        case 'soldierC':
            game.gentities.push(new __soldierC(x, y, width, height, id, 10, null));
            break;
}
	return true;
}



/*
=====================
Print map objective
=====================
*/
function m_setObjective(str)
{
    s_loadSoundHandler('MSG_INCOMING', null);
    $('#objective').remove();
	$('#window').append('<div id="objective"><b>OBJECTIVE:&nbsp;</b><span id="actual-objective"></span></div>');
	$('#objective').hide().slideDown(500);
	var i = 0;
	var type = setInterval(function(){
		if( i == str.length)
		{
			$('#actual-objective').animate({ opacity: 0.1}, 50);
			$('#actual-objective').animate({ opacity: 1}, 100);
			clearInterval(type);
		}
		$('#actual-objective').append(str[i]);
		i++;
	}, 20);
}



var mpercentage = 0;

function m_requestMap(mapIndex, callback, output) {

    if (output != null)
        output();

    $.ajax({
        type: 'POST',
        url: 'serverSide/g_requestMap.php',
        data: 'requestMap=1&mapIndex=' + mapIndex,
        async: false,
        success: function (data) {

            var pData = JSON.parse(data);
            var stat = 1;

            //Insert the game objects
            for (var i in pData) {

                var interactions = new Object(); //interactions object

                if(pData[i]['interactions'])
                    for (var prop in pData[i]['interactions']) 
                        interactions[prop] = pData[i]['interactions'][prop];

                printBlock(
                    parseInt(pData[i]['x']),
                    parseInt(pData[i]['y']),
                    parseInt(pData[i]['width']),
                    parseInt(pData[i]['height']),
                    String(pData[i]['type']),
                    String(pData[i]['id']),
                    parseInt(pData[i]['zindex']),
                    interactions);

                m_updatePercentage(pData.length, stat);
                stat++;
                
                if (output != null)
                    output();
            }
        }
    });

    if (callback != null)
        callback();
}

function m_updatePercentage(size, n) {
    mpercentage = parseInt((n * 100) / size);

}

function m_getPercentage() {
    return mpercentage;
}

function m_nullPercentage() {
    return mpercentage = 0;
}


/*
=====================
Level one
=====================
*/
function levelOne()
{
    //var interactions = new Array();
    //s_stPlay('Q1', null);
    m_setMapDimensions(8000, 430);
    m_setSpawnPoint(7500, 100);
    m_setBackground('src/bgs/88.jpg');
    s_stPlay('M1', null, -1);


	interactions = { interaction: 'comment', duration: 10, did: 'h1', image: 'ch_help.jpg', text: 'Some obstacles can be moved. Go back and press SHIFT + LEFT for a sprint run on the obstacle' }
	printBlock(6320, 0, 100, 400, 'event', null, 10, interactions, false);

	//interactions = { interaction: 'comment', duration: 10, did: 'h2', image: 'ch_help.jpg', text:'This door needs his pass. Look it up.' }
	//printBlock(4010, 0, 50, 400, 'event', null, 10, interactions, false);

    //Screenplay
	interactions = { interaction: 'dialog', text: 'Well, I see that you have reached the perimeter. The A.N.G.E.L.S have chosen you for a very specific reason that we know both. But... do not take it, I feared the worst. After all you are used to fighting underground, not in the sky. Make sure you get safely to the other side of the perimeter. There\'s only one guard.', duration: '18', did: 'c1', image: 'ch_death.jpg', callback: m_setObjective('Enter base') };
	printBlock(3000, 0, 100, 400, 'event', null, 10, interactions, true);


	interactions = { interaction: 'door', key: 'greyKey' };
	printBlock(4000, 150, 50, 150, 'door', 'cannon plaza\'s door', 9, interactions, false);  // cannon_plaza_door and computer to open it
	
	interactions = { interaction: 'greyKey', val: 30, description: '(key)cannon plaza\'s door' }
	printBlock(5890, 100, 22, 30, 'item', 'greyKey', 50, interactions, true); //computer
	interactions = { yval: 90, xval: 0 };
	printBlock(4283, 255, 70, 28, 'teleporter', null, 8, interactions, false); //floor | stairs
	interactions = { health: 10 };
	printBlock(4650, 40, 45, 55, 'monster', 'soldier', 10, interactions, null, true);

	printBlock(4705, 250, 32, 32, 'decor', 'metalbox1', 20, null, false);
	printBlock(4738, 250, 32, 32, 'decor', 'metalbox1', 20, null, false);
	printBlock(4718, 218, 32, 32, 'decor', 'metalbox1', 20, null, false);

	printBlock(4505, 250, 32, 32, 'decor', 'metalbox1', 20, null, false);
	printBlock(4538, 250, 32, 32, 'decor', 'metalbox1', 20, null, false);




	//printBlock(7355, 290, 28, 25, 'item', 'w_' + ROCKETLAUNCHER, 12, {interaction:'weapon'}, false);
	//printBlock(7600, 290, 28, 25, 'item', 'w_' + SHOTGUN, 12, interactions, false);
	//printBlock(7400, 290, 28, 23, 'item', 'w_' + MACHINEGUN, 12, interactions, false);
	//printBlock(7265, 290, 28, 23, 'item', 'w_' + HOLEGENERATOR, 12, interactions, false);

	//interactions = { interaction: 'ammoBox', val: 10, weaponId: SHOTGUN, quantity: 10 }
    //printBlock(7500, 280, 28, 25, 'item', 'ab_' + SHOTGUN, 12, interactions, false);

    //BUILDING
    interactions = {interaction:'soundLoc', sound:'SURPRISE', removable: 1}
    printBlock(2820, 0, 100, 430, 'event', null, 10, interactions, false);

    printBlock(2095, 20, 250, 300, 'decor', 'babyhead', 11, null, false);
    //printBlock(2190, 380, 50, 150, 'decor', 'bwsmoke', 0, null, false);
    printBlock(0, 0, 2100, 430, 'wallGrey_nosolid', null, 9, null, true); 
    printBlock(2145, 355, 90, 73, 'decor', 'entrance1', 12, null, true); 
    printBlock(2100, 0, 50, 430, 'wall', null, 8, null, true);

    interactions = {xval:150, yval:50};
    printBlock(2200, 395, 70, 28, 'teleporter', null, 8, interactions, false); //floor | stairs

    printBlock(2100, 330, 50, 90, 'wall_nosolid', null, 11, null, true);
    printBlock(0, 310, 2120, 120, 'floor', null, 10, null, true);
    printBlock(10, 370, 120, 90, 'wall', null, 8, null, true);
    printBlock(0, 140, 200, 90, 'wall', null, 8, null, true);

    printBlock(1700, 210, 400, 20, 'floor', null, 10, null, true);

    printBlock(1700, 100, 400, 220, 'wall', null, 8, null, true);
    printBlock(1700, 0, 500, 220, 'wall', null, 10, null, true); 
    
    printBlock(1960, 90, 200, 20, 'wall', null, 10, null, true);

    interactions = { health: 10 };
    printBlock(1130, 260, 45, 55, 'monster', 'soldier', 10, interactions, null, true);

    //printBlock(4500, 200, 336, 191, 'decor', 'floor', 50, null, true);

	interactions = { interaction:'nextl', level:2 };
	printBlock(150, 285, 70, 28, 'teleporter', null, 10, interactions, false); //teleporter
	printBlock(200, 160, 50, 50, 'wall', null, 8, null, true); //box inside building 1first floor
	printBlock(0, 120, 1400, 100, 'floor', null, 10, null, true); //teleporter floor


	printBlock(1570, 160, 200, 30, 'floor', null, 10, null, true); //teleporter floor
	printBlock(1600, 120, 100, 30, 'floor', null, 10, null, true); //teleporter floor
	printBlock(1500, 80, 200, 30, 'floor', null, 10, null, true); //teleporter floor
	printBlock(1460, 40, 300, 30, 'floor', null, 10, null, true); //teleporter floor

	printBlock(1650, 240, 28, 25, 'item', 'healthBox', 12, {interaction:'healthBox'}, false);

	printBlock(0, 0, 2100, 20, 'floor', null, 10, null, true); //SOFFITTo

	printBlock(6000, 00, 80, 430, 'cloud', null, 8, null, true);
	printBlock(0, 0, 80, 430, 'wall', null, 8, null, true); //margin left wall
	printBlock(100, 00, 80, 430, 'cloud', null, 8, null, true);
	printBlock(500, 00, 80, 430, 'cloud', null, 8, null, true);
	printBlock(1500, 00, 80, 430, 'cloud', null, 8, null, true);

	for (var i = 0; i < 100; i++)
	    printBlock(i*20, 20, 10, 300, 'wall_nosolid', null, 0, null, false);
	return true;
}






function levelTwo()
{
    var interactions = new Array();
    s_stPlay('Q1', null);
    m_setMapDimensions(8000, 430);
    m_setSpawnPoint(590, 100);
    m_setBackground('src/bgs/88.jpg');

    printBlock(0, 0, 100, 430, 'wall', null, 0, null, true);
    printBlock(10, 310, 1720, 130, 'floor', null, 0, null, true); 

    //printBlock(1200, 140, 278, 265, 'decor', 'mushroom', 20, null, null, true);

    printBlock(80, 5, 330, 510, 'decor', 'air_turret', 30, null, false);
    printBlock(805, 280, 32, 32, 'decor', 'metalbox1', 30, null, false);
    printBlock(838, 280, 32, 32, 'decor', 'metalbox1', 30, null, false);
    printBlock(818, 248, 32, 32, 'decor', 'metalbox1', 30, null, false);
    printBlock(718, 280, 32, 32, 'decor', 'metalbox1', 30, null, false);
    printBlock(628, 280, 32, 32, 'decor', 'metalbox1', 30, null, false);

    printBlock(0, 0, 500, 60, 'wall_nosolid', null, -5, null, true);
    printBlock(0, 200, 500, 50, 'wall_nosolid', null, -5, null, true);
    printBlock(500, 0, 50, 430, 'wall_nosolid', null, -5, null, true);
    //printBlock(4200, 200, 79, 100, 'monster', 'heavySoldier', 0, null, null, true);

    printBlock(500, 0, 1000, 30, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 20, 1000, 10, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 40, 1000, 10, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 60, 1000, 10, 'wall_nosolid', null, 0, null, true);
    printBlock(500, 80, 1000, 10, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 100, 1000, 10, 'wall_nosolid', null, 0, null, true); 
    printBlock(1000, 0, 200, 430, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 120, 1000, 10, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 140, 1000, 10, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 160, 1000, 10, 'wall_nosolid', null, 0, null, true);
    printBlock(1490, 0, 200, 430, 'wall_nosolid', null, 0, null, true);
    printBlock(1000, 0, 500, 100, 'wall_nosolid', null, 0, null, true);
    printBlock(500, 180, 1000, 10, 'wall_nosolid', null, 0, null, true); 
    printBlock(500, 200, 1000, 40, 'wall_nosolid', null, 0, null, true); 

    printBlock(900, 290, 300, 20, 'floor', null, 0, null, true); 
    printBlock(950, 270, 1000, 40, 'floor', null, 0, null, true); 

    interactions = { interaction: 'weapon' };
    printBlock(1770, 66, 28, 25, 'item', 'w_' + SHOTGUN, 109, interactions, false);
    printBlock(1550, 100, 500, 50, 'floor', '#070B17', 10, null, true);

    printBlock(2099, 240, 200, 20, 'movable_floor', null, 10, null, true);


}


function s_levelOne() {

    m_setMapDimensions(5000, 430);
    m_setSpawnPoint(3800, 100);
    m_setBackground('src/bgs/89.jpg');
    s_stPlay('Q1', null, -1);
    
    printBlock(4400, 240, 50, 130, 'wall', null, 8, null, false);
}


function s_levelTwo() {

    var interactions = new Array();
    s_stPlay('Q1', null);
    m_setMapDimensions(5000, 430);
    m_setSpawnPoint(590, 100);
    m_setBackground('src/bgs/5.jpg');

    
    printBlock(0, 420, 5000, 28, 'floor', null, 8, interactions, false); //floor | stairs
    printBlock(0, 0, 80, 430, 'wall', null, 8, interactions, false); //floor | stairs
    printBlock(497, 0, 30, 430, 'wall', null, 8, interactions, false); //floor | stairs

    interactions = { yval: 90, xval: 0 };
    printBlock(4283, 255, 70, 28, 'teleporter', null, 8, interactions, false); //floor | stairs


    //1
    interactions = { yval: 70, xval: 500 };
    printBlock(1015, 350, 70, 28, 'teleporter', null, 8, interactions, false); //floor | stairs
    printBlock(1000, 370, 100, 50, 'wall', null, 8, interactions, false); //floor | stairs
    printBlock(0, 120, 1000, 30, 'floor', null, 8, interactions, false); //floor | stairs


    //2
    interactions = { yval: 70, xval: 1600 };
    printBlock(1415, 350, 70, 28, 'teleporter', null, 8, interactions, false); //floor | stairs
    printBlock(1400, 370, 100, 50, 'wall', null, 8, interactions, false); //floor | stairs
    printBlock(1500, 120, 500, 30, 'floor', null, 8, null, false); //floor | stairs


    //3
    interactions = { yval: 70, xval: 2600 };
    printBlock(2015, 350, 70, 28, 'teleporter', null, 8, interactions, false); //floor | stairs
    printBlock(2000, 370, 100, 50, 'wall', null, 8, interactions, false); //floor | stairs
    printBlock(2500, 120, 500, 30, 'floor', null, 8, null, false); //floor | stairs

    //4
    interactions = { yval: 70, xval: 2900 };
    printBlock(2415, 350, 70, 28, 'teleporter', null, 8, interactions, false); //floor | stairs
    printBlock(2400, 370, 100, 50, 'wall', null, 8, interactions, false); //floor | stairs
    printBlock(2500, 120, 1500, 30, 'floor', null, 8, null, false); //floor | stairs

}