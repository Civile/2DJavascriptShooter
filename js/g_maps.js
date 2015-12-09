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

    /*

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
    */




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

function s_levelTwo()

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

	    printBlock(i * 20, 20, 10, 300, 'wall_nosolid', null, 0, null, false);


	printBlock(8690, 360, 1000, 1, 'floor', null, 11, null, true);

    //Stairs
	printBlock(7670, 342, 9500, 100, 'floor', null, 11, null, true); //first floor
	printBlock(4700, 329, 4240, 13, 'floor', null, 11, null, true); //floor
	printBlock(7610, 316, 1290, 13, 'floor', null, 11, null, true); //floor
	printBlock(7650, 303, 1220, 19, 'floor', null, 11, null, true); //floor
	printBlock(7690, 290, 1160, 19, 'floor', null, 11, null, true); //floor
	printBlock(7730, 277, 1100, 19, 'floor', null, 11, null, true); //floor

	printBlock(9410, 0, 25, 365, 'wall_nosolid', null, 11, null, true);  // wall

    //Stairs's columns
    //printBlock(8900, 25, 50, 155, 'wall_nosolid', 2, null, false);  // wall
    //printBlock(8900, 175, 50, 25, Objs.walls.wall_m_broken2.class, 2, null, false);  // wall
	printBlock(8780, 0, 50, 355, 'wall_nosolid', null, 11, null, false);  // wall
	printBlock(8660, 0, 50, 355, 'wall_nosolid', null, 11, null, false);  // wall


    //Right floors/walls
	printBlock(9315, 0, 50, 360, 'wall', null, 10, null, null, true);  // wall
	printBlock(9365, 300, 600, 13, 'floor', null, 3, null, false); //floor
	printBlock(9365, 250, 600, 13, 'floor', null, 3, null, false); //floor
	printBlock(9365, 200, 600, 13, 'floor', null, 3, null, false); //floor
	printBlock(9365, 150, 600, 13, 'floor', null, 3, null, false); //floor
	printBlock(9365, 100, 600, 13, 'floor', null, 3, null, false); //floor

    //Terrain underfloor
	printBlock(6590, 340, 1210, 100, 'terrain_rock1', null, 1, null, false);
	printBlock(8712, 0, 100, 200, 'strogg_flag1', null, 12, null, false);
	printBlock(8415, 245, 32, 32, 'metalBox1', null, 12, null, false);
	printBlock(8600, 245, 32, 32, 'metalBox1', null, 9, null, false);
	printBlock(8705, 245, 32, 32, 'metalBox1', null, 12, null, false);
	printBlock(8680, 245, 32, 32, 'metalBox1', null, 9, null, false);
	printBlock(8720, 245, 32, 32, 'metalBox1', null, 9, null, false);
	printBlock(8700, 213, 32, 32, 'metalBox1', null, 9, null, false);


    /*****************************************************************************/


    //SECOND ZONE
	printBlock(7800, 277, 1020, 25, 'floor', null, 2, null, true);

	interactions = { interaction: 'giveAmmo', val: 10, weaponId: SHOTGUN, quantity: 10 }
	printBlock(7375, 300, 28, 25, 'ammoBox', SHOTGUN, 10, interactions, false);


	printBlock(7335, 300, 28, 25, 'ammoBox', 'ab_' + ROCKETLAUNCHER, 10, null, false);

	printBlock(7405, 300, 28, 25, 'weapon', 'w_' + ROCKETLAUNCHER, 10, null, false);
	printBlock(7495, 300, 28, 25, 'weapon', 'w_' + SHOTGUN, 10, null, false);
	printBlock(7455, 300, 28, 23, 'weapon', 'w_' + MACHINEGUN, 10, null, false);

	interactions = { interaction: 'comment', val: 'Salta premendo il tasto SU + SINISTRA' }
	printBlock(7020, 300, 28, 25, 'comment', 'comment', 10, interactions, false);

	interactions = { sound: 'VOICE1', removable: 1 };
	printBlock(8400, 0, 100, 500, 'soundLoc', null, 10, interactions, false);


	printBlock(9205, 299, 55, 50, 'machinegunPos', null, 10, null, false);



    //Columns
	printBlock(8550, 0, 50, 290, 'wall_nosolid', null, 11, null, false);  // wall
	printBlock(8440, 0, 50, 290, 'wall_nosolid', null, 11, null, false);  // wall
	printBlock(8487, 0, 100, 250, 'strogg_flag1', null, 12, null, false);   // flag
	printBlock(8330, 0, 50, 290, 'wall_nosolid', null, 11, null, false);  // wall
	printBlock(8220, 0, 50, 290, 'wall_nosolid', null, 11, null, false);  // wall
	printBlock(8267, 0, 100, 250, 'strogg_flag1', null, 12, null, false);   // flag
	printBlock(8110, 0, 50, 290, 'wall_nosolid', null, 11, null, false);  // wall
	printBlock(8000, 0, 50, 290, 'wall_nosolid', null, 11, null, false);  // wall
	printBlock(8047, 0, 100, 250, 'strogg_flag1', null, 12, null, false);   // flag


	printBlock(7250, 0, 100, 330, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(7050, 0, 100, 330, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(6980, 290, 50, 100, 'wall', null, 10, null, false);  // wall
	printBlock(6250, 25, 2550, 50, 'wall_nosolid', null, 9, null, false);  // wall

    //Terrain underfloor
	printBlock(7800, 277, 800, 300, 'terrain_rock1', null, 1, null, null, false);


    //5860
	printBlock(6300, 35, 100, 28, 'wires1', null, 10, null, false); //floor | stairs
	printBlock(6250, 0, 50, 275, 'wall', null, 10, null, false);  // wall
	interactions = { interaction: 'movable' };
	printBlock(6220, 280, 50, 60, 'wall', null, 10, interactions, false);  // wall
	printBlock(6250, 100, 160, 20, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(6250, 150, 120, 20, 'wall_nosolid', null, 12, null, false);  // wall
	interactions = { interaction: 'comment', val: 'Alcuni ostacoli possono essere spostati. Torna indietro e premi SINISTRA + SHIFT per eseguire uno sprint sull\'ostacolo. Salute: -10' }
	printBlock(6310, 300, 28, 25, 'comment', 'comment', 10, interactions, false);
	printBlock(5900, 310, 700, 5, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(6600, 310, 5, 50, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5900, 310, 5, 20, 'wall_nosolid', null, 12, null, false);  // wall
    //Terrain underfloor
	printBlock(2900, 280, 3000, 300, 'terrain_rock1', null, 1, null, null, false);
	printBlock(5900, 310, 65, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(5900, 295, 45, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(2900, 280, 3025, 20, 'floor', null, 11, null, true); //floor | stairs
	interactions = { interaction: 'giveHealth', val: 30 }
	printBlock(4885, 50, 28, 25, 'healthBox', null, 10, interactions, false);


    //TEST
	printBlock(4885, 230, 28, 25, 'healthBox', null, 10, null, false);
	printBlock(4892, 240, 28, 25, 'healthBox', null, 10, null, false);
	printBlock(4825, 230, 50, 60, 'wall', null, 10, null, false);  // box near the cannon


	printBlock(4395, 230, 28, 25, 'healthBox', null, 10, null, false);
	printBlock(4405, 240, 28, 25, 'healthBox', null, 10, null, false);
	printBlock(4445, 230, 50, 60, 'wall', null, 10, null, false);  // box near the cannon


	printBlock(4785, 50, 30, 29, 'doubleDamage', null, 10, null, false);


    //Fabric
	printBlock(4950, 0, 900, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(4950, 30, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(4950, 60, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(4950, 90, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5125, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(5075, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(4950, 120, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall #end window 1
	printBlock(5150, 30, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5150, 60, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5150, 90, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5275, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(5325, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(5150, 120, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall #end window 2
	printBlock(5350, 30, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5350, 60, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5350, 90, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5475, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(5525, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(5350, 120, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall #end window 3
	printBlock(5550, 30, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5550, 60, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5550, 90, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5675, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(5550, 120, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall #end window 4
	printBlock(5750, 30, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5750, 60, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5750, 90, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall
	printBlock(5725, 30, 30, 110, 'window', null, 10, null, false);  // window's glass
	printBlock(5750, 120, 100, 30, 'wall_nosolid', null, 2, null, false);  // wall #end window 4
	printBlock(4950, 150, 900, 170, 'wall_nosolid', null, 2, null, false);  // wall
    //bars
	printBlock(4950, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5000, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5050, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5100, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5150, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5200, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5250, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5300, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5350, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5400, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5450, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5500, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5550, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5600, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5650, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5700, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5750, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall
	printBlock(5800, 0, 25, 320, 'wall_nosolid', null, 12, null, false);  // wall


    //Teleporter zone
	printBlock(4200, 140, 850, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(4260, 160, 110, 20, 'wall_nosolid', null, 12, null, false);  // wall | decor
	printBlock(4270, 180, 90, 15, 'wall_nosolid', null, 9, null, false);  // wall | decor
	printBlock(4200, 140, 30, 150, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(4400, 140, 30, 150, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(4429, 140, 1, 150, 'light', null, 9, null, false);  // wall
	printBlock(4600, 140, 30, 150, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(4800, 140, 30, 150, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(4750, 120, 200, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(4780, 100, 170, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(4820, 80, 140, 20, 'floor', null, 11, null, true); //floor | stairs

	printBlock(4000, 0, 50, 150, 'wall', null, 10, null, false);  // cannon_plaza_door and computer to open it

	printBlock(3700, 50, 300, 150, 'wall', null, 10, null, false);
	printBlock(3820, 50, 75, 100, 'skull', null, 10, null, false);

	interactions = { interaction: 'door', key: 'greyKey' };
	printBlock(4000, 150, 25, 150, 'door', 'cannon plaza\'s door', 10, interactions, false);  // cannon_plaza_door and computer to open it
	interactions = { sound: 'VOICE2', removable: 1 };
	printBlock(3800, 0, 100, 500, 'soundLoc', null, 10, interactions, false);

	printBlock(5890, 100, 22, 30, 'greyKey', '(key)cannon plaza\'s door', 10, null, true); //computer

	interactions = { val: 'Il teletrasportatore pu&ograve; portarti in zone che altrimenti non potresti raggiungere...' };
	printBlock(4500, 200, 50, 200, 'comment', 'comment', 10, interactions, false);

	interactions = { yval: 90, xval: 0 };
	printBlock(4283, 260, 70, 28, 'teleporter', null, 10, interactions, false); //floor | stairs

    //Player pass behind the fabric windows
	interactions = { interaction: 'playerMod', aspect: 'z-index', val: '10' }
	printBlock(4820, 1, 70, 155, 'playerMod', null, 1, interactions, true); //at this point player is z-index:1
	interactions = { interaction: 'playerMod', aspect: 'z-index', val: '1' }
	printBlock(4900, 1, 950, 155, 'playerMod', null, 10, interactions, true); //floor | stairs
	printBlock(4950, 140, 1000, 20, 'floor', null, 11, null, true); //floor behind fabric's windows
	interactions = { interaction: 'playerMod', aspect: 'z-index', val: '10' }
	printBlock(5860, 1, 100, 155, 'playerMod', null, 1, interactions, true); //at this point player is z-index:1

    //Cannon's plaza
	printBlock(2950, -40, 528, 375, 'cannon', null, 8, null, true); //at this point player is z-index:1
    //printBlock(3500, 80, 452, 240, 'barrack1', null, 9, null, true); //at this point player is z-index:1
	interactions = { sound: 'DRIP', removable: 1 };
	printBlock(3400, 0, 100, 500, 'soundLoc', null, 10, interactions, false);

	printBlock(2800, 280, 200, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(2750, 300, 150, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(2700, 320, 300, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(2650, 340, 300, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(2600, 360, 300, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(2550, 380, 350, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(2500, 400, 400, 20, 'floor', null, 11, null, true); //floor | stairs
	printBlock(0, 420, 3500, 20, 'floor', null, 11, null, true); //floor | stairs | floor

	printBlock(3110, 230, 50, 60, 'wall', null, 10, null, false);  // box near the cannon


	interactions = { interaction: 'giveHealth', val: 30 }
	printBlock(3100, 195, 28, 25, 'healthBox', null, 10, interactions, false);

	printBlock(3700, 0, 50, 290, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(3650, 0, 30, 290, 'wall_nosolid', null, 9, null, false);  // wall
	printBlock(0, 25, 4000, 30, 'wall_nosolid', null, 9, null, false);  // wall
    //BACK ZONE : 10000 TO 20000
	printBlock(9895, 0, 25, 365, 'wall_nosolid', null, 11, null, true);  // wall
	printBlock(9900, 0, 50, 360, 'wall', null, 10, null, null, true);  // wall





    //attributes = { race: 'jack', xvel:4, jumpvelocity: 10 };
    //printBlock(1700, 310, 50, 90, 'jack', null, 1, null, attributes, false);  // wall
    //printBlock(1784, 340, 200, 20, 'floor', null, 11, null, true); //floor | stairs | floor
    //printBlock(1954, 300, 200, 20, 'floor', null, 11, null, true); //floor | stairs | floor


    /* Building * */
	printBlock(0, 0, 1350, 430, 'wallGrey_nosolid', null, 1, null, false);  // wall
	printBlock(1270, 0, 85, 310, 'wall2', null, 1, null, null, true);  // wall
	printBlock(0, 0, 20, 430, 'floor', null, 10, null, true); //floor | stairs | floor
	printBlock(0, 410, 1270, 20, 'floor', null, 11, null, true); //floor | stairs | floor
	printBlock(70, 310, 1310, 20, 'floor', null, 11, null, true); //floor | stairs | floor
	printBlock(70, 210, 1220, 20, 'floor', null, 11, null, true); //floor | stairs | floor


    //DA ORA IN POI UTILIZZA ID PER eType dell'entità
    //printBlock(2000, 320, 50, 200, 'jack', ET_MONSTER, 11, null, true); //floor | stairs | floor


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

    m_setBackground('src/bgs/ms_1.jpg');

    s_stPlay('S1', null, -1);

    

    printBlock(0, 350, 5000, 120, 'floor', null, 10, null, true);
    printBlock(280, 260, 500, 20, 'floor', null, 10, null, true);
    printBlock(0, 0, 50, 430, 'wall', null, 8, null, true);

    printBlock(1000, 100, 50, 50, 'wall', null, 8, null, false);
    printBlock(1000, 150, 50, 50, 'wall', null, 8, null, false);
    printBlock(950, 150, 50, 50, 'wall', null, 8, null, false);
    printBlock(1050, 150, 50, 50, 'wall', null, 8, null, false);

    printBlock(0, 320, 400, 30, 'floor', null, 10, null, true); 
    printBlock(0, 290, 350, 30, 'floor', null, 10, null, true); 
    printBlock(0, 260, 300, 30, 'floor', null, 10, null, true); 
    printBlock(0, 230, 250, 30, 'floor', null, 10, null, true); 
    printBlock(0, 200, 200, 30, 'floor', null, 10, null, true); 
    printBlock(550, 320, 1000, 30, 'floor', null, 10, null, true);
    printBlock(600, 290, 900, 30, 'floor', null, 10, null, true); 
    printBlock(650, 260, 800, 30, 'floor', null, 10, null, true); 
    printBlock(700, 230, 700, 30, 'floor', null, 10, null, true); 
    printBlock(750, 200, 600, 30, 'floor', null, 10, null, true); 
    printBlock(1799, 140, 200, 20, 'movable_floor', null, 10, null, true); 
    printBlock(2050, 320, 1000, 30, 'floor', null, 10, null, true); 
    printBlock(2100, 290, 900, 30, 'floor', null, 10, null, true); 
    printBlock(2150, 260, 800, 30, 'floor', null, 10, null, true); 
    printBlock(2200, 230, 700, 30, 'floor', null, 10, null, true); 
    printBlock(2250, 200, 600, 30, 'floor', null, 10, null, true); 
    printBlock(3050, 320, 1000, 30, 'floor', null, 10, null, true);
    printBlock(3100, 290, 900, 30, 'floor', null, 10, null, true); 
    printBlock(3150, 260, 800, 30, 'floor', null, 10, null, true); 
    printBlock(3200, 230, 700, 30, 'floor', null, 10, null, true); 
    printBlock(3250, 200, 600, 30, 'floor', null, 10, null, true); 
    printBlock(4950, 0, 50, 430, 'wall', null, 8, null, true); 
    printBlock(4600, 300, 50, 50, 'wall', null, 8, null, false); 
    printBlock(4770, 270, 200, 20, 'floor', null, 10, null, true);

    printBlock(3251, 0, 110, 230, 'wall_nosolid', null, 1, null, true);
    printBlock(3431, 0, 110, 230, 'wall_nosolid', null, 1, null, true);
    printBlock(3621, 0, 110, 230, 'wall_nosolid', null, 1, null, true);
    printBlock(3811, 0, 110, 270, 'wall_nosolid', null, 1, null, true);
    printBlock(3644, 20, 65, 150, 'decor', 'flag1', 12, null, true);

    //printBlock(4803, 250, 70, 28, 'teleporter', null, 8, [*xval*<450>*yval*<20>], false); 
    printBlock(4790, 290, 10, 60, 'wall_nosolid', { color: 'red' }, 12, null, true);
    printBlock(4820, 290, 10, 60, 'wall_nosolid', { color: 'red' }, 12, null, true);
    printBlock(4840, 290, 10, 60, 'wall_nosolid', { color: 'red' }, 12, null, true);
    printBlock(4860, 290, 10, 60, 'wall_nosolid', { color: 'red' }, 12, null, true);

    printBlock(100, 50, 50, 50, 'wall_nosolid', {color:'red'}, 0, null, true);

    printBlock(4000, 00, 80, 430, 'cloud', null, 8, null, true);

    //interactions = { interaction: 'comment', duration: 10, did: 'h1', image: 'ch_help.jpg', text: 'Some obstacles can be moved. Go back and press SHIFT + LEFT for a sprint run on the obstacle' }
    //printBlock(3800, 0, 100, 400, 'event', null, 10, interactions, false);

    printBlock(3520, 305, 90, 73, 'decor', 'coloredLines', 12, null, true);
    printBlock(20, -50, 250, 300, 'decor', 'babyhead', 12, null, true);
    printBlock(4590, 157, 58, 153, 'decor', 'monch', 12, null, true);
    printBlock(1240, 107, 278, 265, 'decor', 'mushroom', 12, null, true);

    printBlock(1590, 327, 263, 33, 'decor', 'ruins', 12, null, true);
    printBlock(1790, 327, 263, 33, 'decor', 'ruins', 12, null, true);

    printBlock(4350, 0, 50, 50, 'wall', null, 8, null, true);
    printBlock(4350, 320, 50, 50, 'wall', null, 8, null, true);
}




