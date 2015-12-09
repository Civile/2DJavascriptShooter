/*
==========================================
GAME.JS 
==========================================
*/

/*
=====================
Request animation frame
=====================
*/
(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

g_requestAnimFrame();

function g_requestAnimFrame() {
    //Request animation frame
    window.cancelRequestAnimFrame = (function () {
        return window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
    })();

}



/*
=====================
Animate background
=====================
*/
function animateBackground(time, stop) {

    $(WINDOW_WND).animate({ backgroundPosition: '-700px' }, time == null ? 20000 : time, function () {
        $(this).animate({ backgroundPosition: '-100px' }, 25000, function () {
            animateBackground(25000);
        });
    });
}



/*
=====================
Start page/main menu
=====================
*/

//Preloading
function g_start() {
    //g_firstStart(); return g_loadGame(1, CAMPAIGN);
    s_preloadSounds(new Array(a_sounds, m_music, p_sounds), g_firstStart, function () {
        $('#loadOutput').html('<div style="background:black; height:30px; color:white; padding:5px; font-size:10px; text-align:right; width:'+s_getPercentage()+'%;">'+s_getPercentage()+'%&nbsp;</div>');
    });
}


function g_firstStart(){

    //Set menu background
    var bg = new Image();
    bg.src = 'src/bgs/4.jpg';
    bg.onload = function () {
        $(WINDOW_WND).css('background', 'url("' + bg.src + '") repeat');
        animateBackground(1);
        initInput();

        if ($('.login')[0])
            $('.login').hide(10, function () {
                    $(this).remove();
                    s_loadSoundHandler('INTROSOUND');
                    mainMenu.load('left');
                    s_stPlay('MENU1', null, -1);
            });

        if ($('.anteprima')[0])
            $('.anteprima').remove();
    }
}



/*
=====================
Loop handlers
=====================
*/
var gloop = false;           //Break loop
var reqId = null;            //Animation interval id

function g_stopLoop() {
    window.cancelRequestAnimFrame(reqId);
    reqId = null;
}


/*
=====================
Load game
=====================
*/
function g_loadGame(map, gType) {
    game.startTime = null;
    game.playing = false;

    //Clear screen
    $(WINDOW_WND).stop();                   //stop background animation
    if(player && player.inventary)          //close inventary
        player.inventary.closeInventary();
    g_gameScreens('hide');                  //Hide game screens | hud...

    var lbg = new Image();
    lbg.src = 'src/maps/loadingBg/lbg_' + map + '.png';
    lbg.onload = function () {

        if (render.ctx) {                        //clear rendered
            render.clearScreen();
        }

        //Show loading progress
        if (map != 1) {
            $(WINDOW_WND).css('background', 'url("' + lbg.src + '") center no-repeat');
            $(WINDOW_WND).append('<div id="loading" \
            style="z-index:9999;\
            position:absolute;\
            top:40%; left:0;\
            height:30px;\
            font-family:\'cgothic\';\
            width:100%;\
            text-align:center;\
            color:white;"></div>');
        }

        //Break loop
        g_stopLoop();
        g_setGameType(gType);
        s_stCurrStop();

        //Reset sounds manifest
        //s_resetSoundsManifest();

        if (gType == SURVIVAL)
            gs_freeSurvival();

        currLevel = map;

        //Free game
        g_freeGame();
        g_resetActiveOptions();
        __sections.construct();
        game.ended = false;

        loadSlideThenGame((map == 1 ? true : false), function () {
            s_preloadSounds(null, function () {         //load world sounds

                //Load map
                m_requestMap(map, null, function () {
                    $('#loading').html('<p>Loading evil entities...' + m_getPercentage() + '% </p>');
                });

                m_loadLevel(map, gType);

                //Init renderer
                render.init();
                g_makeNewInstance();
                camera = new __camera();
                g_gameScreens('show');
                m_pauseGame(false, 'play');
                $('#loading').remove();
                game.playing = true;
                //$(WINDOW_WND).css('background', 'transparent');

                game.startTime = Date.now();

                gameLoop();

            }, function () {
                $('#loading').html('<p>loading bad sounds and music...' + s_getPercentage() + '% </p>');
            });
        });
        

    }
}


/*
=====================
Load initial slide then game
=====================
*/
function loadSlideThenGame(loadSlide, callback) {

    if (!loadSlide)
        return callback();

    var slide, slideSrc = 'src/slides/subject.jpg';

    slide = new Image();
    slide.src = slideSrc;

    slide.onload = function () {
        $(WINDOW_WND).append('<div id="subjectDiv" style="background:url(\''+ this.src +'\') center no-repeat; opacity:0; width:100%; height:100%; position:absolute; left:0px; top:0px;"></div>');
        $('#subjectDiv').animate({opacity: 0.5}, 2000);
        var intro = setTimeout(function () {
           
            $('#subjectDiv').remove(); callback();
        }, 20000);
    }

    
}


/*
=====================
Free game
=====================
*/
function g_freeGame()
{
    game.gentities = [];
    __sections.destruct();
    g_cleanInterface();
    render.clear();
    time = 0;
    tick = 0;
    delayTimeMS = 0;
    gameTime_elapsed = 0;
    inst_context = GAME;
    player = null;
}



function g_cleanInterface() {
    $('#dialog').remove();
    $('#resultBox').remove();
}

/*
=====================
Make new player instance
=====================
*/
function g_makeNewInstance() {
    player = new __player(m_getSpawnX(), m_getSpawnY());
    player.inventary.restore(currLevel);
    player.spawn();
}


/*
=====================
Reset active 
=====================
*/
function g_resetActiveOptions() {
    for (var i in ISACTIVE)
        ISACTIVE[i] = false;
}



/*
=====================
Run mover
=====================
*/
function g_runMover(gentity, gentityId)
{
    if (gentity.m_class == MISSILE) {
        c_runMissile(gentity);
        return;
    }

    if (gentity.m_class == LIFEFORM) {
        return gentity.update();
    }
    
    return gentity.update();

}



/*
=====================
Game loop
=====================
*/
var current;
function gameLoop() {

    if (game.playing && !game.ended) {
        if (g_getGameType() == SURVIVAL && !gs_playing)
            return;

        current = Date.now();
        game.elapsedTime = current - game.startTime;
        game.deltaT = current - game.lastTime;

        fps();
        tick++;
        timing();
        processEvents();
        render.render();

        game.lastTime = current;

        console.log(game.deltaT);
    }
    reqId = requestAnimationFrame(gameLoop);
}




/*
=====================
Update game events/run frames
=====================
*/
function processEvents() {

    i_moveItems();
    
    if(g_getGameType() == SURVIVAL)
        g_processGameTypeEvents();

    for (var i = 0; i < game.gentities.length; i++) {
        if (game.gentities[i] == null)
            break;

        if (game.gentities[i].eType == MOVER) {
            g_runMover(game.gentities[i], i);
            continue;
        }
    }
    
    camera.follow();
    g_checkGameProgress();

}



function g_checkGameProgress() {

    if (!player)
        return;
}


/*
=====================
Time counter
=====================
*/
function timing() {
    time += 15;
    gameTime_elapsed = Math.floor(time / 100) / 10;

    if (Math.round(gameTime_elapsed) == gameTime_elapsed) {
        gameTime_elapsed += '.0';
    }
    document.title = gameTime_elapsed;
    return gameTime_elapsed;
}



/*
=====================
Show fps
=====================
*/
function fps() {
    thisLoop = new Date().getTime();

    delayTimeMS = (thisLoop - lastLoop);    //delta
    var fps = 1000 / delayTimeMS;

    lastLoop = thisLoop;
    //$('#fps').html('FPS:&nbsp;' + parseInt(fps));
}



/*
=====================
Set game type
=====================
*/
function g_setGameType(gType) {
    if (gType != SURVIVAL && gType != gType || !gType)
        return GAMETYPE = CAMPAIGN;
    else return GAMETYPE = gType;
}

function g_getGameType() {
    return GAMETYPE;
}

/*
=====================
Pause game
=====================
*/
function m_pauseGame(stripe, pause) {

    if (pause === 'pause') {
        $('#game').css('opacity', '0.7');
        
        return game.playing = false;
    }
    else if (pause === 'play') {
        $('#game').css('opacity', '1');
        s_playAllSoundsEmitters();
        return game.playing = true;
    }

    game.playing == true ? game.playing = false : game.playing = true;
    if (!game.playing) {
        if (stripe)
            $('#window').append('<div id="pause">PAUSE</div>');
        $('#game').css('opacity', '0.7');
    }
    else {
        $('#game').css('opacity', '1');
        $('#pause').remove();
    }
    keyP = false;
}



/*
=====================
Show player screens
=====================
*/
function g_gameScreens(cmd) {

    if (cmd === 'hide') {
        $('#hud').css('visibility', 'hidden');
        $('#objective').remove();
        return true;
    }
    else if(cmd === 'show')
        return $('#hud').css('visibility', 'visible');
}




function g_loadInterfaceSend(msg) {

    if (msg != null) {
        if (!$('#loadingInfo').is('visible'))
            $('#loadingInfo').show();
    }
    else return;

    $('#loadingInfo').text(msg);
}

















/*
==============================================================================================================================
Handle SURVIVAL MODE events
==============================================================================================================================
*/
var S_MAXENTITIES = 5;   //ADD: ricava width mappa e calcola max (es. width 7000 -> 7 + 3)
var S_NUMENTITIES = 0;
var gs_playing = true;
var s_spawnTime = 1000;
var monsters = new Array('soldier', 'soldierF');

function g_processGameTypeEvents() {

    if (GAMETYPE == CAMPAIGN || !gs_playing)
        return;

    if (player.health < 1) {
        gs_savePoints(player.points);
        gs_showResultBox(player.points);
        game.playing = false;      
        gs_playing = false;
    }

    //camera.moveBackground();

    s_spawnTime -= GLOOP_MS;

    gs_spawnItems();

    if (S_NUMENTITIES >= S_MAXENTITIES)
        return;

    gs_updatePointsView();  //Update points on screen

    if (s_spawnTime > 0)
        return;

    expos = Math.floor((Math.random() * $(GAME_WND).width()) + 50);

    var randomMonster = Math.floor((Math.random() * monsters.length) + 0);
    switch (monsters[randomMonster]) {
        case 'soldier':
            monster = new __soldier(expos, 15, null, null, 'soldier', null, 1);
            break;
        case 'soldierF':
            monster = new __soldierF(expos, 15, null, null, 'soldierF', null, 1);
            break;
        case 'heavySoldier':
            monster = new __heavySoldier(expos, 15, null, null, 'heavySoldier', null, 1);
            break;
        case 'giantSoldier':
            monster = new __giantSoldier(expos, 15, null, null, null, null, 1);
            break;
    }
    
    if (monster) {
        if (game.gentities.push(monster))
            S_NUMENTITIES++;
    }

    s_spawnTime = 3000;
}



/*
=====================
SURVIVAL: decrement num entities
=====================
*/
function gs_decrementEntities(value) {
    if(value && S_NUMENTITIES > 0)
        return S_NUMENTITIES -= parseInt(value);
}


function gs_freeSurvival() {
    S_MAXENTITIES = 5;   
    S_NUMENTITIES = 0;
    s_spawnTime = 1000;
    gs_playing = true;
    $('#resultBox').remove();
}


/*
=====================
SURVIVAL: spawn items | based on player status or randomically
=====================
*/
var spawnItemsTiming = 0;
var gsItems = new Array(11);
gsItems[0] = 'w_' + SHOTGUN;
gsItems[1] = 'w_' + MACHINEGUN;
gsItems[2] = 'w_' + ROCKETLAUNCHER;
gsItems[3] = 'healthBox';
gsItems[4] = 'ab_' + SHOTGUN;
gsItems[5] = 'ab_' + MACHINEGUN;
gsItems[6] = 'ab_' + ROCKETLAUNCHER;


function gs_spawnItems() {    

    //Check time
    spawnItemsTiming += 15;
    if (spawnItemsTiming < 5000)
        return;
    else spawnItemsTiming = 0;

    //Get a random index
    var randomItem = Math.floor((Math.random() * gsItems.length) + 0);
    if (!gsItems[randomItem])
       return;

    //Get item type
    var itemType = gsItems[randomItem].substring(0, 2);

    if (itemType == 'w_') {
        interactions = { interaction: 'weapon' };
    }
    else if (itemType == 'ab') {
        interactions = { interaction: 'ammoBox' }
    }
    else {
        interactions = { interaction: gsItems[randomItem] };
    }

    //Get random X
    expos = Math.random() * $(GAME_WND).width() + 50;

    //Add to logic process
    printBlock(expos, 10, 28, (gsItems[randomItem] == 'doubleDamage' ? 30 : 25), 'item', gsItems[randomItem], 10, interactions, false);
}


/*
=====================
SURVIVAL: updatePointsView
=====================
*/
function gs_updatePointsView() {
    $('#pointsView').html('<text>Points:&nbsp;' + player.points + '</text>');
}

//Save points
function gs_savePoints(points) {

    if (points <= 0)
        return;

    $.ajax({
        type: 'POST',
        data: 'savePoints=1&points=' + points + '&mapTitle=S1',
        url: 'serverSide/g_survival.php',
        async: true,
        success: function (data) {
            null;
        }
    });
}



function gs_showResultBox(points) {
    
    var i = parseInt(points/2);
    var st = 0;

    $(WINDOW_WND).append('<div id="resultBox" style=""><div class="resultBox points"></div><div class="resultBox restart"><input type="button" value="RESTART" onclick="javascript:restart()" style="border:0; background:#ffffff"></div></div>');

    $('#resultBox').css('left', ($(WINDOW_WND).width() / 2 - 125) + 'px').css('top', '-50px').animate({ top: '100px'}, 100);

    sT = setInterval(function () {
        if (i <= points)
            $('#resultBox .points').html(i < points ? '<div style="color:white; font-weight:normal;">Score:' + i + '</div>' : '<div style="color:red; font-weight:bold;">Your score:' + i + '</div>');
        else clearInterval(sT);
        i+=2;
    }, 1);
}





function restart() {
    
    g_loadGame(currLevel, g_getGameType());

}