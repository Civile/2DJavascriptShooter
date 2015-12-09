

/*

==========================================

COMBAT.JS | COMBAT FUNCTIONS, SHOOTS ecc.

==========================================

*/



var _C_COMBAT_TEST = 0;



/*

=====================

Return entity's health

=====================

*/

function c_returnHealth(entity)

{

    if( entity )

        return parseInt(entity.health);

    return null;

}





/*

=====================

Handle entity health

=====================

*/

function c_setHealth(entity, val)

{

    if (!entity || !val)

        return;



    entity.health += val;



    if (entity.health <= 0)

        return null;

    else if (entity.health > 100)

        entity.health = 100;



    return entity.health;

}







/*

=====================

Damage

entity = entity that caused the inflictor to damage targ

targ = target that is being damaged

inflictor = weapon

direction = direction of the attack (for knockback)

=====================

*/

function c_damage(entity, targ, inflictor, direction, initDamage)

{

    var damage = initDamage;



    //Double damage

    if (P_DOUBLEDAMAGE in entity.pFlags) {

        if (entity.pFlags[P_DOUBLEDAMAGE] != 0)

            damage *= 2;

    }





    if (inflictor)  //Velocity shoot

        if(inflictor.pvel == -1)

            if (entity.xvel > 10 || entity.xvel < -10)

                damage *= 4;


    targ.health -= damage;

    //Get points
    if (entity.type == 'player' && targ.type != 'player' && g_getGameType() == SURVIVAL) {
        c_handleScorePoints(entity, damage / 2);
    }

	return targ.health;

}











/*

=====================

Radius damage like explosions

=====================

*/

function c_radiusDamage(origin, inflictor, entity, damage, radius, damageableSolids)

{

    //origin can be 0

    if ( !entity || !damageableSolids)

        return;



    var entitiesInArea = null;





    //Get nearer entities

    entitiesInArea = __sections.retrieveObjs_ext(__sections.getZoneByX(inflictor.xpos) > 0 ? __sections.getZoneByX(inflictor.xpos) - 1 : 0, 

                     __sections.getZoneByX(inflictor.xpos) >= __sections.getTotSections() ? __sections.getTotSections() : __sections.getZoneByX(inflictor.xpos) + 1,

                     damageableSolids);

    if (!entitiesInArea)

        return;



	for (var i in entitiesInArea)

	{

	    

	    if (entitiesInArea[i].eType == MOVER)

	    {

	        entityCenter = mh_getRectC_vertexA(

            entitiesInArea[i].xpos,

            entitiesInArea[i].ypos,

            entitiesInArea[i].width,

            entitiesInArea[i].height);

	    



	        distance = mh_getDistance2P(origin, entityCenter);

	        if (distance <= radius)

	            if (entitiesInArea[i]) {

	                if (entitiesInArea[i].m_class == LIFEFORM) {

	                    //Damage

	                    entitiesInArea[i].hasBeenHit = entity;

	                    c_damage(entity, entitiesInArea[i], inflictor, LEFT, damage * (radius / distance));



	                    /*then knockback*/

	                    if (entitiesInArea[i].xpos < inflictor.xpos)

	                        knAngle = Math.atan2((entitiesInArea[i].ypos) - (inflictor.ypos + inflictor.height), (entitiesInArea[i].xpos) - (inflictor.xpos));

                        else

	                        knAngle = Math.atan2((inflictor.ypos + inflictor.height) - (entitiesInArea[i].ypos), (inflictor.xpos) - (entitiesInArea[i].xpos));



	                        c_knockback(inflictor.force / mh_getDistance2P(mh_getCenter(inflictor.xpos, inflictor.ypos, inflictor.width),

                                mh_getCenter(entitiesInArea[i].xpos, entitiesInArea[i].ypos, entitiesInArea[i].width)),

                                knAngle, entitiesInArea[i], inflictor.xvel);

	                }

	                else if(entitiesInArea[i].m_class == MISSILE)

	                {

	                    if (entitiesInArea[i].m_type == ROCKET && entitiesInArea[i].id != origin.id)

	                        entitiesInArea[i].lifeTime = 0;

                    }

	            }

	    }

	    if (entitiesInArea[i].type == 'barrell')

	    {

	        entityCenter = mh_getRectC_vertexA(

            entitiesInArea[i].xpos,

            entitiesInArea[i].ypos,

            entitiesInArea[i].width,

            entitiesInArea[i].height);



	        distance = mh_getDistance2P(origin, entityCenter);

            if( distance <= radius )

                c_switchCollision(entitiesInArea[i], entity);

	    }





	}

	return;

}











/*

=====================

Knockback

=====================

*/

function c_knockback(force, angle, entity, velocity)

{

    if (!force)
        return;

    entity.xvel += force * Math.sin(angle);
    entity.yvel += force * Math.cos(angle);
    entity.externalForceApplied = true;

	return true;

}









/*

=====================

Recoil

=====================

*/

function c_recoil(force, entity)

{

    if( !entity || entity.m_type == MONSTER || entity.yvel == 0)

        return;



    if (entity.yvel != 0 && force < 5) {

        if (entity.direction == RIGHT)

            entity.xvel -= force;

        else if (entity.direction == LEFT)

            entity.xvel += force;

    }

    else if (force > 5) {

        if (entity.direction == RIGHT)

            entity.xvel -= force / 2;

        else if (entity.direction == LEFT)

            entity.xvel += force / 2;



        if(entity.weapon == ROCKETLAUNCHER)

            entity.yvel -= 4;

    }

	return;

}











/*

=====================

Set fire hot point

=====================

*/

function c_setFireHotPoint(entity)

{

    if (entity.direction == RIGHT) {

        entity.firePos.x = entity.relFirePosR.x + entity.xpos + 10;

    }

    else if (entity.direction == LEFT) {

        entity.firePos.x = entity.relFirePosL.x + entity.xpos - 10;

    }

    entity.firePos.y = entity.relFirePosR.y + entity.ypos;  //Firing hot point

}









/*

==========================================

Shoots instant bullets (shotguns, machinegun, pistol...)

==========================================

*/

function c_shootInstantBullet(entity)

{

    var destAngle;

    var aDir;



    aDir = entity.direction == LEFT ? Math.PI : 0; // angle phase due to entity direction, 0 when player is right, 3.14 (PI) when it is left



    if (entity.target) 

        aDir = destAngle = Math.atan2((entity.ypos - entity.height/2) - entity.target.ypos, (entity.xpos + entity.width/2) - entity.target.xpos) + Math.PI * (entity.direction == RIGHT ? 1 : -1);



    var physix = new Physix();

    for (var i = 0; i < entity.weapons[entity.weapon].nProjectiles ; i++)

    {

        randomAngle = aDir + ((Math.random() * entity.weapons[entity.weapon].pSpread + Math.random() * (-entity.weapons[entity.weapon].pSpread)) * Math.PI / 180);  // random usage:( random() * max ) * min, in case of negative values: ( random() * pos + random() * neg )

       

        for (var z = 0; z < entity.weapons[entity.weapon].range; z += 10)

        {

            proj = {

                width: 5,

                height: 1,

                ypos: entity.firePos.y + z * Math.sin(randomAngle),

                xpos: entity.firePos.x + 5 + z * Math.cos(randomAngle),

                xvel: 10

            };



            trailColor = '#97C1E2';

            if (P_DOUBLEDAMAGE in entity.pFlags) {

                if (entity.pFlags[P_DOUBLEDAMAGE] != 0)

                    trailColor = 'red';

            }



            //If a collision has occurred

            if (collidedObj = physix.collision.detect(proj, proj.xvel, __sections.retrieveObjs(__sections.getZoneByX(proj.xpos), rigidBodies))) { // may cause slow downs



                if (entity.weapon == SHOTGUN) {

                    render.projTrail(entity.firePos.x, entity.firePos.y, proj.xpos, proj.ypos, entity, trailColor);

                }



                if (entity == collidedObj.objRef)

                    continue;

                else {

                    c_switchCollision(collidedObj.objRef, entity, proj.xpos, proj.ypos);

                    break;

                }

            }

            else

                if (entity.weapon == SHOTGUN)
                    render.projTrail(entity.firePos.x, entity.firePos.y, proj.xpos, proj.ypos, trailColor);

        }

    }

    return true;

}











/*

====================================================================================

MISSILES, GUIDED SHOOTS, HOOKING 

====================================================================================

*/



//Hooking 'macros'

var TARGET_AUTO = 0x0001;

var TARGET_ACTOR = 0x0011;

var TARGET_HOOKABLE = 0x0111;



//Missile's states

var RUNNING = 0x1010;

var EXPLODING = 0x1100;

var ATTRACTING = 0x1110;    //used for blackHole



/*

=====================

Hooks a target

Entity: who's hooking?

Radius: max hookin radius

Target: TARGET_AUTO = hooks automatically | TARGET_ACTOR = hooks the actor | TARGET_HOOKABLE = all 

=====================

*/

function c_hooksTarget(entity, radius, targetT, targetClasses) 

{

    if (!entity)

        return;



    var hookables;

    var target;



    //If entity is requesting exacts coordinates

    if (targetT.xpos != null && targetT.ypos != null) {

        return entity.target = targetT;

    }



    //Auto hooking

    if (targetT == TARGET_AUTO) {

        hookables = __sections.retrieveObjs_ext(__sections.getZoneByX(entity.xpos) - 1, __sections.getZoneByX(entity.xpos) + 1, targetClasses);

        if (hookables.length != 0) {

            //Get the random target

            var i = Math.floor((Math.random() * hookables.length + 0));



            if(hookables[i])

            if (hookables[i].eType == MOVER && hookables[i] != entity && hookables[i].m_class == LIFEFORM) {

                if (entity.direction == LEFT && hookables[i].xpos < entity.xpos

                    || entity.direction == RIGHT && hookables[i].xpos > entity.xpos)

                    return hookables[i];    

            }

        }

    }



    if (targetT == TARGET_ACTOR)

        return player;



    if (target == null) {

        target = { xpos: entity.direction == LEFT ? 1 : 10000, ypos: 200 };

        return target;

    }

}









/*

=====================

Cancel a previous target

=====================

*/

function c_cancelsTarget(entity)

{

    if (!entity)

        return;



    return entity.target = null;

}









/*

=====================

Shoot fireball

=====================

*/

function c_shootFireball(entity) {



    if (!entity)

        return false;



    var wr_fireball = new Object();



    //Initialize fireball

    wr_fireball.eType       =  MOVER;

    wr_fireball.xpos        =  entity.firePos.x;

    wr_fireball.ypos        =  entity.firePos.y;

    wr_fireball.collWith    =  new Array().concat('barrell', 'floor', 'door', 'wall', 'player');

    wr_fireball.id          =  'fr_' + tick;

    wr_fireball.xvel        =  7;

    wr_fireball.yvel        =  5;

    wr_fireball.acc         =  0.6;                  //acceleration power (pixel/tick^2), costant

    wr_fireball.max_speed   =  10;            	     //max speed reachable (pixel/tick),  costant

    wr_fireball.angleVel    =  0.9;    		         //the speed at which the missile change its angle value(radiants/tick), costant

    wr_fireball.angle       =  0;      		         //angle at which the missile will advance (radiants)

    wr_fireball.lifeTime    =  1000;

    wr_fireball.forceRadius =  500;

    wr_fireball.explRadius  =  50;

    wr_fireball.force       =  500;

    wr_fireball.width       =  35;

    wr_fireball.height      =  18;

    wr_fireball.directionX  =  entity.direction == LEFT ? -1 : 1,

    wr_fireball.directionY  =  -1;            // UP -1, DOWN +1

    wr_fireball.m_class     =  MISSILE,

    wr_fireball.m_type      =  FIREBALL;

    wr_fireball.view_plane  =  entity.zindex;

    wr_fireball.entity      =  entity;

    

    wr_fireball.targetAngle = entity.targetAngle;



    if (entity.direction == LEFT)

        wr_fireball.angle = Math.PI;



    wr_fireball.zoneIndex = null;

    return game.gentities.push(wr_fireball);

}









/*

=====================

Move a fireball

=====================

*/

var fbtargetAngle = null;



function c_moveFireball(fireball)

{

    if (!fireball)

        return;



        fireball.xpos += Math.cos(fireball.targetAngle) * fireball.xvel;

        fireball.ypos += Math.sin(fireball.targetAngle) * fireball.yvel;



    return;

}









/*

=====================

Shoot laser proj

=====================

*/

function c_shootLaser(entity, targetAngle) {

    

    if (!entity)

        return false;



    wr_laser = new Object();



    //Initialize laser projectile

    wr_laser.eType      = MOVER;

    wr_laser.xpos       = entity.firePos.x;

    wr_laser.ypos       = entity.firePos.y;

    wr_laser.collWith   = new Array().concat('wall', 'door', 'barrell', 'player', 'floor');

    wr_laser.id         = 'lr_' + tick + Math.floor((Math.random() * 1000) + 1);

    wr_laser.xvel       = 7;

    wr_laser.yvel       = 5;

    wr_laser.acc        = 0.6;  //acceleration power (pixel/tick^2), costant

    wr_laser.angle      = targetAngle;

    wr_laser.lifeTime   = 700;

    wr_laser.width      = 7;

    wr_laser.height     = 1;

    wr_laser.directionX = entity.direction == LEFT ? -1 : 1,

    wr_laser.directionY = -1;            // UP -1, DOWN +1

    wr_laser.m_class    = MISSILE,

    wr_laser.m_type     = LASER;

    wr_laser.view_plane = entity.zindex;

    wr_laser.entity     = entity;

    wr_laser.zindex     = entity.zindex;

    wr_laser.target     = player;



    wr_laser.zoneIndex = null;



    return game.gentities.push(wr_laser);

}









/*

=====================

Move laser proj

=====================

*/

function c_moveLaser(laser) {



    if (!laser)

        return;



    laser.xpos += Math.cos(laser.angle) * laser.xvel;

    laser.ypos += Math.sin(laser.angle) * laser.yvel;

}







/*

=====================

Init a missile-style bullet

=====================

*/

function c_shootRocket(entity)

{

    if (!entity)

        return false;



    var wr_missile = new Object();



    //Initialize rocket

    wr_missile.eType          = MOVER;

    wr_missile.xpos           = entity.firePos.x;

    wr_missile.ypos           = entity.firePos.y;

    wr_missile.collWith       = new Array().concat('barrell', 'floor', 'door', 'wall', 'monster', 'movable_floor' /*, 'player'*/);

    wr_missile.id             = 'rk_' + tick;

    wr_missile.xvel           = 0;

    wr_missile.yvel           = 0;

    wr_missile.max_speed      = 10;            	//max speed reachable (pixel/tick),  costant

    wr_missile.lifeTime       = 1200;  

    wr_missile.hookRadius     = 1000;

    wr_missile.canHook = new Array();

        wr_missile.canHook.push('monster')

    wr_missile.forceRadius    = 1000;

    wr_missile.explRadius     = 140;

    wr_missile.force          = 550;

    wr_missile.width          = 11;

    wr_missile.height         = 10;

    wr_missile.directionX     = entity.direction == LEFT ? -1 : 1,

    wr_missile.directionY     = -1;            // UP -1, DOWN +1

    wr_missile.m_class        = MISSILE,

    wr_missile.m_type         = ROCKET;

    wr_missile.view_plane     = entity.zindex;

    wr_missile.entity         = entity;

    wr_missile.targetAngle    = null;



    //Set target

    if (!entity.target)

        wr_missile.target = c_hooksTarget(entity, wr_missile.hookRadius, entity.m_type == PLAYER ? TARGET_AUTO : TARGET_ACTOR, wr_missile.canHook);

    else

    {

        wr_missile.target = entity.target;

        //remove target after using

        if(entity.m_type != MONSTER)

            c_cancelsTarget(entity);       

    }



	if(entity.direction == LEFT)

		wr_missile.angle = Math.PI;



	wr_missile.zoneIndex = null;

	return game.gentities.push(wr_missile);

}









/*

=====================

Cycles missiles

=====================

*/

function c_runMissile(missile)

{

    if (missile.length <= 0)

        return;



    //Switch missile type

    if (missile.m_type == ROCKET)

        c_moveRocket(missile);

    if (missile.m_type == BLACK_HOLE && missile.state == RUNNING)

        c_moveBlackHole(missile);

    if (missile.m_type == FIREBALL)

        c_moveFireball(missile);

    if (missile.m_type == LASER)

        c_moveLaser(missile);



    //Decrement missile lifetime

    missile.lifeTime -= GLOOP_MS;



    //Check for terminators events

    physix = new Physix();

    var collInfo = null;

    collInfo = physix.collision.detect(missile,

                                       missile.xvel,

                                       __sections.retrieveObjs(__sections.getZoneByX(missile.xpos), missile.collWith), false);



    if (missile.lifeTime <= 0 || missile.xpos <= 0 || missile.xpos >= $(GAME_WND).width() || collInfo != null)

    {

        //Missile explosion:



        if (missile.m_type == ROCKET) {

            c_rocketExplode(missile);

            //Handle rocket camera final event

            if (camera.lastFollowed == missile && missile.entity == player) {

                camera.setTimeout(2000, camera.setFollowed(player));

            }

            game.gentities.splice(game.gentities.indexOf(missile), 1);

        }

        else if (missile.m_type == BLACK_HOLE) {

            if (!c_blackHoleExplode(missile))

                game.gentities.splice(game.gentities.indexOf(missile), 1);

        }

        else if (missile.m_type == FIREBALL) {

            c_rocketExplode(missile);

            game.gentities.splice(game.gentities.indexOf(missile), 1);

        }

        else if (missile.m_type == LASER) {

            if(collInfo != null)

                c_switchCollision(collInfo.obstacle, missile.entity);

            game.gentities.splice(game.gentities.indexOf(missile), 1);

        }

    }





    //Update rendering state

    if (missile.m_type == LASER)

        render.soldierProjectile(missile.xpos, missile.ypos);

    if (missile.m_type == ROCKET) {

        render.esmoke(missile.xpos, missile.ypos, '#333', 'black', 1000);

        render.smokeEntity_ext(missile.xpos, missile.ypos, 'yellow', 'red', 300, 2, 0.9, 2, 1, Math.PI / 5);

    }

    if (missile.m_type == FIREBALL) {

        render.esmoke(missile.xpos, missile.ypos, 'yellow', 'green', 1000);

        render.smokeEntity_ext(missile.xpos, missile.ypos, 'red', 'purple', 300, 2, 0.9, 2, 1, Math.PI / 5);

    }

    return;

}











/*

=====================

Move a rocket

=====================

*/

function c_moveRocket(rocket)

{

    if (!rocket)

        return;



    var rPos    =   new Vec2(rocket.xpos, rocket.ypos);

    var tPos    =   new Vec2(rocket.target.xpos, rocket.target.ypos);

    var acceleration;

    var vel     =   new Vec2(rocket.xvel, rocket.yvel);



    //Calculate direction

    var dir = new Vec2.prototype.sub(tPos, rPos);

    dir.normalize();

    dir.mul(8);

    acceleration = dir;

    vel.add(acceleration);



    // update missile coordinates	

    rocket.ypos += vel.y;

    rocket.xpos += vel.x;



    if (ISACTIVE[ROCKETCAMERA] && rocket.entity == player) {

        if (camera.lastFollowed != rocket)

            camera.setFollowed(rocket);

    }

    return;

}











/*

=====================

Rocket explodes

=====================

*/

function c_rocketExplode(rocket)

{

    if ( !rocket )

        return;



    var pDist;

    //Can damage MOVERS

    var damageTo = new Array();

        damageTo[0] = 'monster';

        damageTo[1] = 'barrell';

        damageTo[2] = 'player';



    c_radiusDamage(rocket,

    /************/ rocket,

    /*          */ rocket.entity,

    /*  BOOM!!  */ 50,

    /*          */ rocket.explRadius,

    /************/ damageTo);



    //Stunning effect

    pDist = mh_getDistance2P(mh_getCenter(rocket.xpos, rocket.ypos, rocket.width),

                             mh_getCenter(player.xpos, player.ypos, player.width));

   

    if (s_isPlaying('P_ROCKETLAUNCHER_SHOOT'))

        s_stopSound('P_ROCKETLAUNCHER_SHOOT', true);    

    s_loadSoundHandler('P_ROCKETLAUNCHER_EXPLODE'+ Math.floor((Math.random() * 3) + 1), pDist >= $(WINDOW_WND).width() ? 0.5 : null);



    if (pDist <= rocket.explRadius) {

        //WARNING: Do not modify volume value. 

        s_loadSoundHandler('P_EXPLSTUNNING', 0.04);

    }



    //Call explosion rendering

    if (rocket.m_type == FIREBALL)

        render.explosionB(rocket.xpos, rocket.ypos);

    if (rocket.m_type == ROCKET)

        render.explosionA(rocket.xpos, rocket.ypos);

    camera.shake(8, 2);

    return;

}









/*

==========================================

Special weapons, blackHole ecc.

==========================================

*/



var _blackHoleCounter = null;



function c_shootBlackHole(entity)

{

    if (!entity || _blackHoleCounter != null)

        return;



    w_blackHoleProj = new Object();

    

    w_blackHoleProj.eType           = MOVER;

    w_blackHoleProj.m_type          = BLACK_HOLE;

    w_blackHoleProj.m_class         = MISSILE;

    w_blackHoleProj.direction       = entity.direction == LEFT ? -1 : 1;

    w_blackHoleProj.entity          = entity;

    w_blackHoleProj.id              = 'bh_' + tick;



    //Size

    w_blackHoleProj.width           = 10;

    w_blackHoleProj.height          = 10;



    //Attack properties

    w_blackHoleProj.force           = 2;   //attraction force

    w_blackHoleProj.attractionRadius = 500;

    w_blackHoleProj.damage          = 0.1;

    w_blackHoleProj.canAttract      = new Array();

    w_blackHoleProj.canAttract[0]   = 'monster';

    w_blackHoleProj.canAttract[1]   = 'player';

    //Other

    w_blackHoleProj.collWith        = new Array().concat('barrell', 'floor', 'door', 'wall', 'monster');

    w_blackHoleProj.hookedEntities  = new Array();

    w_blackHoleProj.lifeTime        = 600;    

    w_blackHoleProj.xpos            = entity.firePos.x;

    w_blackHoleProj.ypos            = entity.firePos.y;

    w_blackHoleProj.xvel            = entity.direction == LEFT ? -1 * 8 : 8;

    w_blackHoleProj.yvel            = 1;

    w_blackHoleProj.state           = RUNNING;



    //Charge

    w_blackHoleProj.chargeLimit     = 5;

    w_blackHoleProj.charge          = 0;

    w_blackHoleProj.center = null;



    //Attracting state properties

    w_blackHoleProj.attractingLifeTime = 5400; //5000



    w_blackHoleProj.zoneIndex = null;

    s_loadSoundHandler('P_BLACKHOLE_CHARGING');



    _blackHoleCounter += 1;



    //Add to game

    return game.gentities.push(w_blackHoleProj);

}











/*

=====================

Move a blackHole

=====================

*/

function c_moveBlackHole(blackHole)

{

    if (!blackHole)

        return;

    

    blackHole.xpos += blackHole.xvel;

    blackHole.ypos += 3 * Math.sin(blackHole.xpos / 1); //sinusoid



    return;

}









/*

=====================

Explode a blackHole

Start attracting state

=====================

*/

function c_blackHoleExplode(blackHole)

{

    var attractedObjs = new Array();

    var destAngle;

    var attractedCenter;

    var distance;

    var forceResultX, forceResultY;

    var attractedObjs = new Array();



    if(blackHole.state != ATTRACTING)

        render.vortex(blackHole.xpos, 1, 200, blackHole.attractingLifeTime);



    blackHole.state = ATTRACTING;

    

    if (blackHole.state == ATTRACTING) {

        if (blackHole.attractingLifeTime <= 0) {

            _blackHoleCounter = null;

            return false;

        }

        else {

            blackHole.attractingLifeTime -= GLOOP_MS;

            s_loadSoundHandler('P_BLACKHOLE_EXPLODE', null, 'none');

            //Get entities

            attractedObjs = __sections.retrieveObjs_ext(__sections.getZoneByX(blackHole.xpos) > 0 ? __sections.getZoneByX(blackHole.xpos) - 1 : 0,

                            __sections.getZoneByX(blackHole.xpos) >= __sections.getTotSections() ? __sections.getTotSections() : __sections.getZoneByX(blackHole.xpos) + 1,

                            blackHole.canAttract);

            if (!attractedObjs) {

                return true;

            }



            //Charging

            blackHole.charge += 0.1 + mh_ms2sec(delayTimeMS);

            if (blackHole.charge < 5)

                return true;



            //Compute attracting process

            for (var i in attractedObjs) {

                //Get attractedObj center

                if (attractedObjs[i].eType == MOVER)

                    attractedCenter = mh_getRectC_vertexA(

                    attractedObjs[i].xpos,

                    attractedObjs[i].ypos,

                    attractedObjs[i].width,

                    attractedObjs[i].height);

                else continue;



                //Calculate blackHole center

                blackHole.center = mh_getRectC_vertexA(blackHole.xpos, blackHole.ypos, blackHole.width, blackHole.height);



                /*******************

                 ATTRACT

                *******************/

                                        //on very top

                destAngle = Math.atan2(10 - attractedCenter.ypos, blackHole.center.xpos - attractedCenter.xpos);

                //Get distance beetween blackHoleCenter and attracted

                distance = mh_getDistance2P(blackHole.center, attractedCenter);



                if (attractedObjs[i] == blackHole.entity)   //The shooter must be less influenced

                   distance = distance * 1.5;

                

                //Life form being attracted

                if (attractedObjs[i].eType == MOVER && distance <= blackHole.attractionRadius) {

                        forceResultX = blackHole.force * (Math.cos(destAngle) * (blackHole.attractionRadius / distance));

                        forceResultY = blackHole.force * (Math.sin(destAngle) * (blackHole.attractionRadius / distance));

                        //if (forceResultX < -1 || forceResultX > 1) {//...there's enough force

                            attractedObjs[i].xpos += attractedObjs[i].xvel = (forceResultX / attractedObjs[i].mass);

                            attractedObjs[i].ypos += attractedObjs[i].yvel = (forceResultY / attractedObjs[i].mass);

                            if (attractedObjs[i].m_class == LIFEFORM) {

                                c_damage(blackHole.entity, attractedObjs[i], blackHole.mType, 0, blackHole.damage * (blackHole.attractionRadius / distance));

                                //Handle points

                                if (blackHole.entity.type == 'player' && attractedObjs[i].type != 'player')

                                    c_handleScorePoints(player, 1);

                            }

                        //}



                }

            }

        }

    }

    return true;

}









/*

=====================

Barrell explosion

=====================

*/

function barrellExplode(barrell)

{

    var pDist;



    //Can damage MOVERS

    var damageTo = new Array();

    damageTo[0] = 'monster';

    damageTo[1] = 'barrell';

    damageTo[2] = 'player';



    c_radiusDamage(barrell,

    /************/ barrell,

    /*          */ barrell.entity,

    /*  BOOM!!  */ 20,

    /*          */ barrell.explRadius,

    /************/ damageTo);



    pDist = mh_getDistance2P(mh_getCenter(barrell.xpos, barrell.ypos, barrell.width),

                            mh_getCenter(player.xpos, player.ypos, player.width));



    s_loadSoundHandler('P_ROCKETLAUNCHER_EXPLODE' + Math.floor((Math.random() * 3) + 1), pDist >= $(WINDOW_WND).width() ? 0.5 : null);



     if (pDist <= barrell.explRadius) {

        //WARNING: Do not modify volume value. 

        s_loadSoundHandler('P_EXPLSTUNNING', 0.04);

    }





    camera.shake(8, 2);

    return;

}









/*

=====================

Switch collided

=====================

*/

function c_switchCollision(collision, entity, impactX, impactY)

{

    if (!collision || !entity)

        return;



    if (collision.hasOwnProperty('m_class'))

        if(collision.m_class == LIFEFORM) {

            lifeform = collision;

            //Damage

            c_damage(entity, lifeform,

                entity.weapons[entity.weapon],

                entity.direction,

                c_checkHeadShot(collision, entity, impactX, impactY, true, true) == true ? entity.weapons[entity.weapon].damage * 3 : entity.weapons[entity.weapon].damage);

            lifeform.hasBeenHit = entity;



            //Check SURVIVAL events

            if (g_getGameType() == SURVIVAL)

                if (entity.xvel > 10 || entity.xvel < -10) {

                    render.velocityShootAdvice(collision.xpos, collision.ypos);

                    c_handleScorePoints(entity, 40);

                }

            return;

    }



    //Barrell explosion

    if (collision.type == 'barrell') {

        var br = new Object();

            br = collision;

            br.explRadius = 180;

            br.entity = entity;

            br.force = 600;

        __sections.remove(br);

        barrellExplode(br);

        return;

    }



    //Impact with immovable

    if (entity.weapons[entity.weapon].pvel == -1) {

        render.fragmentsParticles(impactX, impactY, 10, 1, 1);

        s_loadSoundHandler('P_SHOOT_HITWALL' + Math.floor((Math.random() * 3) + 1));

        return;

    }

    

    

}







/*

=====================

Check if headshot

=====================

*/

function c_checkHeadShot(damaged, entity, ix, iy, renderAdvice, loadSound) {

    

    if (iy > damaged.ypos && iy < damaged.ypos + 4) {

        c_handleScorePoints(entity, 30);

        if (loadSound) s_loadSoundHandler('HEADSHOTADVICE', null, 'none');

        if (renderAdvice) {

            render.headShotAdvice(ix, iy);

            return true;

        }

    }

    else

        return true;



    return false;

}









/*

=====================

Handle points

=====================

*/

function c_handleScorePoints(entity, points)

{

	if( !entity || GAMETYPE != SURVIVAL)

		return null;



	if( parseInt(points) > 0 )

		entity.points += parseInt(points);

	return true;

}

