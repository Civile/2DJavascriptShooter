

/*

===================================================

this's handler

Animations, actions, indexes, status, interactions

===================================================

*/







var solidObjs = null;



function __player(x, y)

{



    /*

    =====================

    Properties

    =====================

    */

	this.inventary = new __p_inventary();
	this.lastKill = 0;


	var solidObjs;

	var lastZone;



    //Canvas id

	this.id = '#player';

	this.eType = MOVER;

	this.m_type = PLAYER;

	this.m_class = LIFEFORM;

	this.type = 'player';

	this.xpos = x;

	this.ypos = y;

	this.heigth = 45; //c'è stato un errore di battitura....

	this.height = 45;

	this.width = 25;

	this.direction = LEFT;												    //current direction

	this.mass = 4;

    //Weapons

	this.weapon = 1;												        //store current weapon

	this.wepIsRecharging = 0;												//says how much time must pass before the next shoot is available

	this.weapons = new Array();

	this.viewfinder = new viewfinder();



    //Hot points, relative to the Sprite x,y absolute pos

	this.relFirePosR = { x: +20, y: +19 };								    //if the sprite direction is Right

	this.relFirePosL = { x: +12, y: +18 };								    //if the sprite direction is Left

	this.firePos     = { x: 0, y: 0 };											//absolute coordinates, based on sprite origins plus relative ones

	

    //Jump

	this.jump_velocity = STD_PLAYER_JUMP_VELOCITY;

    this.falling_acceleration = 0.1;

    this.max_falling_acceleration = 15;



    //Actual state vars

    this.actual_state = {

        move: NORMAL,												        //actual move												

    },

    this.health = 100;



    this.xacc = 0.9;                            							// accelleration (pixel/tick)

    this.xdec = 0.7;                               							// decelleration

    this.xvel = 0;

    this.yvel = 0;

    this.maxspeed = 50;

    this.onground = false;



    //Sprint vars

    this.sprint_charge = 40;

    this.sprint_charge_max = 40;

    this.sprint_charge_counter = 0;

    this.sprint_charge_usable = true;



    //Pflags

    this.pFlags = new Array();											    //Store player flags, powerups | P_DOUBLEDAMAGE ...

	

    this.points = 0;

    this.plane = 10;



    this.target = null;

    this.zoneIndex;





    //bools

    this.isGround = false,

    this.hitsGround = false,

    this.hitsCeiling = false,

    this.isMovingOnX = false,

    this.isMovingOnY = false,

    this.hasWallLeft = false,

    this.hasWallRight = false,

    this.isJumping = false,

    this.isCrouched = false,

    this.externalForceApplied = false;

    this.hasBeenHit = false;

    this.doubleJump = false;

    this.freeze = false;



    /*

    =====================

    X contacts

    =====================

    */

	this.collide = function(direction)

	{

		var collided = false;

				

		if (__sections.getZoneByX(this.xpos + this.width) != __sections.getZoneByX(this.xpos))

		    var solidObjs = __sections.retrieveObjs_ext(__sections.getZoneByX(this.xpos), __sections.getZoneByX(this.xpos + this.width), PLAYER_COLLIDE_WITH);

		else

		    var solidObjs = __sections.retrieveObjs(__sections.getZoneByX(this.xpos), PLAYER_COLLIDE_WITH);



		if (solidObjs == null)

		    return false;

		

		if( this.xvel > 0 )

		{

			for( var x in solidObjs )

			    if (solidObjs[x].xpos > this.xpos)

			        if ((this.xpos + this.width + this.xvel) >= solidObjs[x].xpos && (solidObjs[x].ypos + solidObjs[x].height) > this.ypos && solidObjs[x].ypos < (this.ypos + 30))

					    if( (collided = this.switchCollision(solidObjs[x]))) //resolve collision

					    {

					        this.resetVel();

					        //this.xpos = solidObjs[x].xpos - this.width;

					    }

		}

		else if( this.xvel < 0 )

		{

			for( var x in solidObjs )

			    if (solidObjs[x].xpos < this.xpos)

			        if ((this.xpos + this.xvel) <= (solidObjs[x].xpos + solidObjs[x].width) && (solidObjs[x].ypos + solidObjs[x].height) > this.ypos && solidObjs[x].ypos < (this.ypos + 30))

					    if( (collided = this.switchCollision(solidObjs[x]))) //resolve collision

					    {

					        //this.xpos = solidObjs[x].xpos + solidObjs[x].width;

					        this.resetVel();

					    }



		}

		return collided;

        

	};

	

	



    /*

    =====================

    Y contacts

    =====================

    */

	this.Ycollide = function()

	{

	    

	    if (__sections.getZoneByX(this.xpos + this.width) != __sections.getZoneByX(this.xpos))

	        var solidObjs = __sections.retrieveObjs_ext(__sections.getZoneByX(this.xpos), __sections.getZoneByX(this.xpos + this.width), PLAYER_COLLIDE_WITH);

	    else

	        var solidObjs = __sections.retrieveObjs(__sections.getZoneByX(this.xpos), PLAYER_COLLIDE_WITH);



	    if (solidObjs == null)

	        return false;



		var collided = false;

		for( var key in solidObjs )	

		    if ((solidObjs[key].xpos) <= (this.xpos + (this.width / 2)) && (solidObjs[key].xpos + solidObjs[key].width) > (this.xpos + (this.width / 2)))

		        if ((this.ypos + this.heigth + this.yvel) >= solidObjs[key].ypos && solidObjs[key].ypos > this.ypos) { //down collision

		            if (collided = this.switchCollision(solidObjs[key])) 

		            {

		                this.ypos = (solidObjs[key].ypos - (this.heigth));

		                return 1;

		            }

		        }

		        else if (this.ypos + this.yvel <= (solidObjs[key].ypos + solidObjs[key].height) && solidObjs[key].ypos < this.ypos) //up collision

		            if (collided = this.switchCollision(solidObjs[key]))

		            {

		                this.ypos = solidObjs[key].ypos + solidObjs[key].height + 1;

		                this.yvel = +1;

		                return 2;

		            }



	}

	



    /*

    =====================

    Switch encountered object

    =====================

    */

	this.switchCollision = function(object)

	{

	    if (!object)

	        return false;



	    switch (object.type) {



	        case 'item':

	            switch (object.interaction) {

	                case 'healthBox':

	                    if (object.used)

	                        return false;

	                    if (c_returnHealth(this) == '100') {

	                        this.inventary.addItem(object.interaction, 1, 'Health box (+10)');

	                    }

	                    else {

	                        if (!(healthQty = object.val))

	                            c_setHealth(this, 10);

	                        else

	                            c_setHealth(this, healthQty);

	                    }

	                    s_loadSoundHandler('P_GETHEALTH');

	                    object.used = true;

	                    __sections.remove(object);

	                    return false;

	                case 'doubleDamage':

	                    this.pFlags[P_DOUBLEDAMAGE] = 30000;      //30''

	                    __sections.remove(object);

	                    s_loadSoundHandler('P_GETAMMO');

	                    s_loadSoundHandler('P_GETDOUBLEDAMAGE', null, 'any');

	                    return false;

	                case 'greyKey':

	                    this.inventary.addItem(object.interaction, 1, object.description);

	                    s_loadSoundHandler('P_GETKEY');

	                    __sections.remove(object);

	                    return false;

	                case 'weapon':

	                    var weaponId = w_getWeaponNId(object.id);

	                    if (!w_gotWeapon(this, weaponId)) {

	                        w_addWeapon(this, weaponId, true);

	                        w_setCurrentWeapon(this, weaponId);

	                        w_loadSpriteInHUD(this, weaponId);

	                        ut_HTMLprintstr('#ammo', w_getAmmo(this, this.weapon), null);

	                        if (weaponId == ROCKETLAUNCHER) {

	                            viewf = new viewfinder();

	                            viewf.append();

	                        }

	                        else {

	                            //If viewfinder

	                            viewf = new viewfinder();

	                            viewf.hide(0);

	                        }

	                        if (this.wepIsRecharging)

	                            this.wepIsRecharging = 0;

	                    }

	                    else {

	                        w_addAmmo(this, weaponId, 20);

	                    }

	                    s_loadSoundHandler('P_GETWEAPON');

	                    __sections.remove(object);

	                    return false;

	                case 'ammoBox':

	                    weaponId = parseInt(object.id.replace('ab_', ''));

	                    if (w_gotWeapon(this, weaponId)) {

	                        w_addAmmo(this, weaponId, 10);

	                        if (this.weapon == weaponId)

	                            ut_HTMLprintstr('#ammo', w_getAmmo(this, weaponId), null);

	                    }

	                    s_loadSoundHandler('P_GETAMMO');

	                    __sections.remove(object);

	                    return false;



	                default: return false; break;

	            }

	            

	        





	        case 'event':

	            switch (object.interaction) {



	                case 'soundLoc':

	                    if (object.removable == true && object.used)

	                        return false;

	                    else object.used = 1;

	                    s_loadSoundHandler(object.sound, null, 'none');

	                    return false;

                    

                    case 'comment':

	                case 'dialog':

	                    if (object.used)

	                        return false;

	                    $(WINDOW_WND).append('<div did="' + object.did + '" id="dialog"><div class="dialog image"><img src="src/characters/' + object.image + '"></div><div class="dialog text">' + object.text + '</div></div>');

	                    s_loadSoundHandler('P_MSGINCOMING');

	                    $('div[did="' + object.did + '"]').hide().slideToggle(100);

	                    object.used = 1;

	                    setTimeout(function () {

	                        $('div[did="' + object.did + '"]').slideUp(function () { $(this).remove(); });

	                    }, object.duration * 1000);

	                    return false;



	                case 'music':

	                    if (object.used)

	                        return false;

	                    s_stPlay(object.val, null, object.repeat);

	                    object.used = true;

	                    return false;

	                default: return false;

	            } //#event









	        case 'wall':

	            if (object.interaction == 'movable') {

	                object.zoneIndex = __sections.getZoneByX(object.xpos);

	                if (this.xvel < -10) {

	                    object.xpos -= 50;

	                    if (object.zoneIndex != __sections.getZoneByX(object.xpos))

	                        __sections.moveElement(object.zoneIndex, __sections.getZoneByX(object.xpos), object);

	                    s_loadSoundHandler('MOVABLEWALL', null, 'any');

	                }

	                else if (this.xvel > 10) {

	                    object.xpos += 50;

	                    if (object.zoneIndex != __sections.getZoneByX(object.xpos))

	                        __sections.moveElement(object.zoneIndex, __sections.getZoneByX(object.xpos), object);

	                    s_loadSoundHandler('MOVABLEWALL', null, 'any');

	                }

	            }

	            return true;





	        case 'door':

	            if (object.used)

	                return true;



	            var item;

	            if (object.key != null)

	                if (!(item = this.inventary.searchItemById(object.key))) {

	                    //s_loadSoundHandler('AUTREQUIRED');

	                    return true;

	                }

	                else {

	                    

	                        s_loadSoundHandler('DOOR_OPEN');

	                        object.used = true;

	                        render.animateDoor(object, 50);

	                        this.inventary.removeItem(item.id);

	                    

	                }

	            return true;



	        case 'teleporter':

	            if (object.used)

	                return false;

    

	            if (object.interaction == 'nextl') {

	                object.used = true;

	                this.inventary.save(object.level);

	                return g_loadGame(object.level, CAMPAIGN);

	            }

	            this.ypos = parseInt(object.yval) != 0 ? parseInt(object.yval) : this.ypos;

	            this.xpos = parseInt((object.xval) != 0 ? parseInt(object.xval) : this.xpos);

	            s_loadSoundHandler('TELEPORTER');

	            return false;	            

	    }

	    return true;

	}

	

	



    /*

    =====================

    P movements/actions

    =====================

    */

	this.move = function(direction)

	{

	    if (this.freeze)

	        return;



		switch ( direction )

		{

			case LEFT:

				this.xvel > 0 ? this.resetVel() : null;

				if( keyArrowRight || keyCtrl )

				    return false;



				if (this.actual_state.move == CROUCH)

				    this.height = 45;



				this.actual_state.move = NORMAL;



				this.direction = LEFT;

					if(Math.abs(this.xvel - STD_PLAYER_ACC) <  STD_PLAYER_MAXSPEED)

					    this.xvel -= this.xvel * -mh_ms2sec(delayTimeMS) + STD_PLAYER_ACC;

					else

						this.xvel = -STD_PLAYER_MAXSPEED;

			break;

			

			case RIGHT:

				

				this.xvel < 0 ? this.resetVel() : null;

				if( keyArrowLeft || keyCtrl )

					return false;

				

				if (this.actual_state.move == CROUCH)

				    this.height = 45;



				this.actual_state.move = NORMAL;



				this.direction = RIGHT;

				

				    if ((this.xvel + STD_PLAYER_ACC) < STD_PLAYER_MAXSPEED)

				        this.xvel += this.xvel * -mh_ms2sec(delayTimeMS) + STD_PLAYER_ACC;

				    else

				        this.xvel = STD_PLAYER_MAXSPEED;

			break;

			

			case UP:

				//If is in crouch mode, then get up!

				if( this.actual_state.move == CROUCH )

				{

				    this.actual_state.move = NORMAL;

				    this.height = 45;

					keyArrowUp = false;

					return;

				}

				else

				{

				    if (!this.isGround && this.doubleJump == 2)

				        return;

					this.actual_state.move = JUMP;

					this.jump();

					this.doubleJump++;

					keyArrowUp = false;

				}		

			break;

			

			case DOWN:

				if( this.yvel == 0 && this.actual_state.move != CROUCH )

				{

				    this.actual_state.move = CROUCH;

				    this.height = 25;

				}

			break;

			

			case SHOOT:

			    if (w_currentWeapon(this)) {

			        this.shoot();

			        ut_HTMLprintstr('#ammo', w_getAmmo(this, this.weapon), null);

			    }

			break;

			

		    case SPRINT:

                //Crazy shooting (machinegun)

		        if (keyArrowRight && keyArrowLeft)

		        {

		            this.xvel = 0;

		            this.direction = this.direction == LEFT ? RIGHT : LEFT;

		            this.shoot(); break;

		        }

		        if (!this.sprint_charge_usable || this.sprint_charge == 0) return;

                //Back to ground at high vel

		        if (!this.isGround && keyArrowDown) {
		            if (this.sprint_charge > 30) {
		                this.sprint_charge = 0;
		                return this.yvel += 15;
		            }
		            return;
		        }



			    if (this.xvel == 0)

			        break;



                //Boost

				this.xvel = this.direction == RIGHT ? 12 : -12;

                if( this.sprint_charge == 40)

				    s_loadSoundHandler('P_FUSEIN', null);

				(this.sprint_charge - 4 < 0) ? null : this.sprint_charge -= 4;

				STD_PLAYER_MAXSPEED < STD_MAX_SPEED_LIMIT ? STD_PLAYER_MAXSPEED += 1 : null;



			    //Vel reset timeout

				setTimeout(function() {

				    STD_PLAYER_MAXSPEED = 9;

				}, 3000);

			break;

			case CALL_INVENTARY:

					this.inventary.loadInventary();

					keyI = false;

			break;

		    case ROCKET_CAMERA:

		        ISACTIVE[ROCKETCAMERA] == true ? ISACTIVE[ROCKETCAMERA] = false : ISACTIVE[ROCKETCAMERA] = true;

		        if (!ISACTIVE[ROCKETCAMERA]) {

		            camera.setFollowed(this);

		        }

		        else {

		            $(WINDOW_WND).append('<div id="advice" style="font-size:25px; color:#DDD; opacity:0.7; font-family:"cgothic"; z-index:999; text-align:right; position:absolute; top:35%; left:35%;">ROCKET CAMERA ACTIVATED</div>');

		            setTimeout(function () {

		                $('#advice').remove()

		            }, 3000);

		        }

		        keyC = false;

		        break;

		    case USE:

                

                keyE = false;

		    break;

		    case SET_WEAPON_PLASMAGUN:

		        if (w_gotWeapon(this, PLASMAGUN)) {

		            w_setCurrentWeapon(this, PLASMAGUN);

		            w_loadSpriteInHUD(this, PLASMAGUN);

		            ut_HTMLprintstr('#ammo', w_getAmmo(this, this.weapon), null);

                    if( this.wepIsRecharging )

                        this.wepIsRecharging = 0;

                    s_loadSoundHandler('P_CHANGEWEAPON', null, 'any');

                    

                    //If viewfinder

                    viewf = new viewfinder();

                    viewf.hide(0);

                    c_cancelsTarget(this);

                    key1 = false;

		        }

		        break;

		    case SET_WEAPON_SHOTGUN:

			    if (w_gotWeapon(this, SHOTGUN)) {

			        w_setCurrentWeapon(this, SHOTGUN);

			        w_loadSpriteInHUD(this, SHOTGUN);

			        ut_HTMLprintstr('#ammo', w_getAmmo(this, this.weapon), null);

			        if (this.wepIsRecharging)

			            this.wepIsRecharging = 0;

			        s_loadSoundHandler('P_CHANGEWEAPON', null, 'any');

			        //If viewfinder

			       

			        this.viewfinder.hide(0);

			        c_cancelsTarget(this);

			        key2 = false;

			    }

			break;

			case SET_WEAPON_MACHINEGUN:

			    if (w_gotWeapon(this, MACHINEGUN)) {

			        w_setCurrentWeapon(this, MACHINEGUN);

			        w_loadSpriteInHUD(this, MACHINEGUN);

			        ut_HTMLprintstr('#ammo', w_getAmmo(this, this.weapon), null);

			        if (this.wepIsRecharging)

			            this.wepIsRecharging = 0;

			        s_loadSoundHandler('P_CHANGEWEAPON', null, 'any');

			        //If viewfinder

			        this.viewfinder.hide(0);

			        c_cancelsTarget(this);

			        key3 = false;

			    }

			    break;

		    case SET_WEAPON_ROCKETLAUNCHER:

		        if (w_gotWeapon(this, ROCKETLAUNCHER)) {

		            w_setCurrentWeapon(this, ROCKETLAUNCHER);

		            w_loadSpriteInHUD(this, ROCKETLAUNCHER);

		            ut_HTMLprintstr('#ammo', w_getAmmo(this, this.weapon), null);

		            if (this.wepIsRecharging)

		                this.wepIsRecharging = 0;

		            s_loadSoundHandler('P_CHANGEWEAPON', null, 'any');

		            this.viewfinder.append();

		            c_cancelsTarget(this);

		            key4 = false;

		        }

		        break;

		    case SET_WEAPON_HOLEGENERATOR:

		        if (w_gotWeapon(this, HOLEGENERATOR)) {

		            w_setCurrentWeapon(this, HOLEGENERATOR);

		            w_loadSpriteInHUD(this, HOLEGENERATOR);

		            ut_HTMLprintstr('#ammo', w_getAmmo(this, this.weapon), null);

		            if (this.wepIsRecharging)

		                this.wepIsRecharging = 0;

		            s_loadSoundHandler('P_CHANGEWEAPON', null, 'any');

		            //If viewfinder

		            this.viewfinder.hide(0);

		            c_cancelsTarget(this);

		            key5 = false;

		        }

		        break;

		}

	}

	

	



    /*

    =====================

    P was hit

    =====================

    */

	this.wasHit = function()

	{

		setTimeout(function(){ $(this.id).css('opacity', 1); }, 200);

	}







    /*

    =====================

    P decelerate

    =====================

    */

	this.decelerate = function()

	{

		if( this.collide() )

			this.resetVel();

		

		if((Math.abs(this.xvel) - this.xdec) > 0)

		{

			if (this.xvel > 0)

				this.xvel -= this.xdec;

			else

				this.xvel += this.xdec;

		}

		else

			this.xvel = 0;

	}

	

	

	

    /*

    =====================

    P reset vel

    =====================

    */

	this.resetVel = function()

	{

	    if (this.externalForceApplied)

	        return;

		this.xvel = 0;

		this.xacc = 0;

		STD_PLAYER_MAXSPEED = 8;

	}

	





    /*

    =====================

    P jump

    =====================

    */

	this.jump = function () {

	    //this.ypos += 1;

	    this.yvel = -this.jump_velocity;

	    this.isJumping = true;

	}







    /*

    =====================

    P apply gravity/falling/grounded

    =====================

    */

	this.applyGravity = function () {

	    if ((this.yvel += CONST_GRAVITY) > this.max_falling_acceleration)

	        this.yvel = this.max_falling_acceleration;

	}

    /** if player is falling... **/

	this.fall = function () {

	    this.actual_state.move = FALLING;

	}



	this.hitsGroundAnimate = function () {

	    s_loadSoundHandler('P_LAND', null);

	    this.actual_state.move = NORMAL;

	    //this decelerate when finish falling 

	    if (this.xvel == STD_PLAYER_MAXSPEED)

	        this.xvel = (STD_PLAYER_MAXSPEED / 2);

	}

	

	

	

    /*

    =====================

    P update status

    =====================

    */

	this.updateSpecificCharge = function()

	{

		//Sprint charge

		if( this.sprint_charge < this.sprint_charge_max )

		{

			this.sprint_charge_counter += g_getGameType() == SURVIVAL ? 0.1 : 0.05;

			if( this.sprint_charge_counter >= 1 )

			{

				this.sprint_charge_usable = false;

				this.sprint_charge_counter = 0;

				this.sprint_charge += 2;

			}

		} else

		    this.sprint_charge_usable = true;



	    //Double damage

		if (this.pFlags[P_DOUBLEDAMAGE]) {

		    if (this.pFlags[P_DOUBLEDAMAGE] - GLOOP_MS >= 10) {

		        this.pFlags[P_DOUBLEDAMAGE] -= GLOOP_MS;

		    }

		    else  this.pFlags[P_DOUBLEDAMAGE] = 0;

		}



	    //Weapon rechargeTime

		if (this.wepIsRecharging > 0) {

		    this.wepIsRecharging -= (1000 / GLOOP_MS) / 100;

		    if (this.pFlags[P_DOUBLEDAMAGE] != 0 && typeof this.pFlags[P_DOUBLEDAMAGE] != 'undefined')

		        this.wepIsRecharging -= 5;

		}

		else

		    this.wepIsRecharging = 0;

	}

	



    /*

    =====================

    P main update

    =====================

    */

	this.update = function()

	{

	    

	    if (this.freeze) {

	        this.freeze -= GLOOP_MS;

	        if(this.freeze < 0)

                this.freeze = 0;

	        return;

	    }



	    //updates bools

	    if (this.xvel != 0) {

            if(!(d = this.collide()))

	        {

	            this.isMovingOnX = true;

	            this.isCrouch = false;

	        }

	    }

	    else {

	        this.isMovingOnX = false;

	    }



	    var d = this.Ycollide();

	    if (this.yvel != 0 && !d) {

	        this.isMovingOnY = true;

	        this.isCrouch = false;

	    }

	    else {

	        this.isMovingOnY = false;

	        if (this.yvel >= 12 && keyShift) {

	            camera.shake(12, 2);

	            s_loadSoundHandler('P_HIGHVELCOLLISION', null);

	            c_radiusDamage(this, this, this, 45, 300, new Array('monster'));

	        }

	        this.yvel = 0;

	        

	    }



	    if (this.actual_state.move == CROUCH)

	        this.isCrouched = true;

	    else

	        this.isCrouched = false;



	    // physic behavior

	    if (d) { //check if the player is on the ground

	        if (!this.isGround && d == 1 && !this.hitsGround) {		//check if the player has hit the ground in this moment

	            this.hitsGround = true;

	        }

	        else {

	            this.hitsGround = false;

	        }



	        if (d == 2 && !this.isGround && !this.hitsCeiling) {//check if the player has hit the ceiling in this moment

	            this.hitsCeiling = true;

	            this.doubleJump = 2;

	        }

	        else this.hitsCeiling = false;

            if(!this.hitsCeiling)

	            this.doubleJump = 0;

	        this.isGround = true;

	        this.isJumping = false;

	    }

	    else {

	        this.isGround = false;

	        this.hitsGround = false;

	        this.hitsCeiling = false;

	    }

	    if (this.hitsCeiling) {

	        this.isGround = false;

	        this.yvel = 0;

	    }

	    if (this.hitsGround) {

	        this.hitsGroundAnimate();

	        this.yvel = 0;

	    }

	    //this entity physics sheet

	    if (!this.isGround) {								

	        this.applyGravity();

	        this.fall();

	    }

	    //on left or right key release, decelerate

	    if (!keyArrowRight && !keyArrowLeft && (this.isJumping || this.isGround))

	        this.decelerate();





	    if (this.yvel > 0 && this.isGround)

	        this.yvel = 0;



	    if (this.ypos >= 430)

	        this.health = 0;



	    //update player position

	    this.xpos += this.xvel;

	    this.ypos += this.yvel;



	    if (this.hasBeenHit) {

	        this.hasBeenHit = false;

	        s_loadSoundHandler('P_HIT1', null, 'any');

	    }



	    if (this.externalForceApplied && this.isGround)

	        this.externalForceApplied = false;



	    if (this.zoneIndex != __sections.getZoneByX(this.xpos)) {

	        __sections.moveElement(this.zoneIndex, __sections.getZoneByX(this.xpos), this);

	        this.zoneIndex = __sections.getZoneByX(this.xpos);

	    }



	    this.updateSpecificCharge();

	    this.updateHUD();

	    if (this.actual_state.move == CROUCH)

	        this.ypos += 15;



	    if (this.health <= 0) {

	        game.ended = true;

	        this.viewfinder.hide();

	        s_loadSoundHandler('DEMONICLAUGH');

	        return;

	    }

	}

	







    /*

    =====================

    Spawn

    =====================

    */

	this.spawn = function(coordX, coordY)

	{

	    if (coordX)

	        this.xpos = coordX;

	    if (coordY)

	        this.ypos = coordY;



	    w_addWeapon(this, 1, true);

	    this.zoneIndex = -1;

	    game.gentities.push(this);

	}







    /*

    =====================

    Shoot

    =====================

    */

	this.shoot = function ()

	{

	    if (this.wepIsRecharging)

	        return;



	    if (!this.weapons[this.weapon].ammo && this.weapons[this.weapon].ammo != -1) {

	        s_loadSoundHandler('P_NOAMMO', null);

	        w_setCurrentWeapon(this, PLASMAGUN);

	        return;

	    }

	    else

	    {

	        c_setFireHotPoint(this);



	        //Shoot with relative functions

	        if (this.weapons[this.weapon].pvel in wFns && this.weapon in wFns[this.weapons[this.weapon].pvel])

	            if (wFns[this.weapons[this.weapon].pvel][this.weapon](this))

	            {

                    //...then

                    w_decrementAmmo(this, w_currentWeapon(this));

                    this.wepIsRecharging = this.weapons[this.weapon].rechargeTime;

	            }



	        //Sound and other gameplay effects

            if(this.weapon != MACHINEGUN)

                s_loadSoundHandler('P_' + this.weapons[this.weapon].name + '_SHOOT', null);

	        else s_loadSoundHandler('P_' + this.weapons[this.weapon].name + '_SHOOT' + Math.floor((Math.random() * 2) + 1), null);



            //Doubledamage?

            if (this.pFlags[P_DOUBLEDAMAGE] != 0 && typeof this.pFlags[P_DOUBLEDAMAGE] != 'undefined')

                s_loadSoundHandler('P_DOUBLEDAMAGE_SHOOT', null, 'any');

            if (this.pFlags[P_DOUBLEDAMAGE] != 0 && typeof this.pFlags[P_DOUBLEDAMAGE] != 'undefined')

	            render.projStripe(this.direction == LEFT ? this.firePos.x - 40 : this.firePos.x, this.firePos.y + 3, 10, 2, 'red', 1, 1);

	        else 

	            render.projStripe(this.direction == LEFT ? this.firePos.x - 40 : this.firePos.x, this.firePos.y, 10, 1, 'yellow', 1, 0);



	        //Weapon recoil?

            if (this.weapons[this.weapon].recoil > 0)

                c_recoil(this.weapons[this.weapon].recoil, this);

                                                                    //qty xdir ydir angle

            render.fragmentsParticles(this.firePos.x, this.firePos.y, 5, this.direction == LEFT ? -1 : 1, 0.1, 0, 'yellow', 'red');

	    }

	}









    /*

    =====================

    Update HUD

    =====================

    */

	this.updateHUD = function () {

        

        //Current weapon

	    w_loadSpriteInHUD(this, this.weapon);



        //Health

	    $('#healthValue').text(Math.floor(this.health));



        //Ammo

	    if (w_getAmmo(this, this.weapon) == 'loop')

	        $('#ammoValue').html('<div style="font-size:20px; margin-top:-10px;">&#8734;</div>');

	    else

	        $('#ammoValue').text(w_getAmmo(this, this.weapon));



        //Charge

	    $('#chargeValue').text(this.sprint_charge);



        //Double damage

	    if (this.pFlags[P_DOUBLEDAMAGE]) {

	        if (!$('.doubleDamage').is('visible')) $('.doubleDamage').css('visibility', 'visible');

	        $('#doubleDamageValue').text(Math.floor(this.pFlags[P_DOUBLEDAMAGE] / 1000));

	    }

	    else { if (!$('.doubleDamage').is('hidden')) $('.doubleDamage').css('visibility', 'hidden'); }

	       

	}



}//class end









/*

=====================

Activate viewfinder

=====================

*/

function viewfinder() {

        

    this.coordX;

    this.coordY;

 

        this.append = function ()

        {

            var self = this;

            

            //Viewfinder sprite

            $(WINDOW_WND).mousemove(function (e) {

                $('body').css('cursor', 'none');

                self.coordX = e.clientX;

                self.coordY = e.clientY;

                if( game.playing )

                    render.viewfinder(((window.event.clientY - (30 / 2)) - $(this).offset().top),

                                  ((window.event.clientX - (30 / 2)) - $(this).offset().left), true);

            });



            //Hookin target

            $('#viewfinder').live('click', function () {

                event = window.event;

                target = {

                    xpos: event.pageX - $(GAME_WND).offset().left,

                    ypos: event.pageY - $(GAME_WND).offset().top

                };



                tgClasses = new Array();

                if (c_hooksTarget(player, 1000, target, tgClasses))

                {
                    s_loadSoundHandler('P_ROCKETLAUNCHER_THOOK', true);
                }

            });

        }



        //Hide and remove viewfinder instance

        this.hide = function (time) {

            $(WINDOW_WND).unbind('mousemove');

            $('body').css('cursor', 'auto');

            $('#viewfinder').remove();

        }



}

