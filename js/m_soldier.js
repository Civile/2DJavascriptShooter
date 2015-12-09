//MACROS

var _SOLDIER_FOV_ = 500;        //Standard FOV







/*

=====================

  //====

 // Soldier

=====================

*/

function __soldier(xpos, ypos, width, height, race, health, elid)

{

    this.eType = MOVER;

    this.m_class = LIFEFORM;

    this.m_type = MONSTER;

    this.zindex = 10;

    this.elid = elid;

    this.hisLocation = xpos;    

    this.type = 'monster';



    this.xpos = xpos;

    this.ypos = ypos;

    this.width = 45;

    this.height = 42;

    this.radius = 20;

    this.health = health != null ? health : 30;

    this.race = 'soldier';

    this.domRef = null;

    this.xvel = 0;

    this.yvel = 0;

    this.acceleration = {x: 2, y:0}

    this.direction = LEFT;

    this.FOV = _SOLDIER_FOV_;

    this.desiredLocation = null;

    this.maxDistFromTarg = Math.floor((Math.random() * 200) + 160);





    this.jump_max_arcX = null;

    this.jump_velocity = 5;

    this.max_falling_acceleration = 7;



    //Combat

    this.target = null;

    this.weapons = new Array();

    this.weapon = 'ls';

    this.wepIsRecharging = 0;

    this.shootAngle;

    this.alert = false;



    this.relFirePosR = { x: +5, y: +5 };								    

    this.relFirePosL = { x: -10, y: +5 };								    

    this.firePos = { x: 0, y: 0 };											



    this.pFlags = new Array();



    //Booleans

    this.active = false;

    this.hasBeenHit = false;

    this.recoverSenses = 0;



    this.zoneIndex = __sections.addElement(__sections.getZoneByX(this.xpos), this);



    //bools

    this.isGround = false;

    this.hitsGround = false;

    this.hitsCeiling = false;

    this.isJumping = false;



    this.thinking = false;

    this.routine = true;

    this.obstacle = new Object();

    this.hidden = false;



    this.px = new Physix();



    /*

	=====================

	Loop

	=====================

	*/

    this.update = function () {



        if (!this.target && player != null)

            this.target = player;



        this.updateStatus();



        //Calculate target distance

        var targetDistance = Math.abs(this.xpos - this.target.xpos);



        //Can see the player?

        if (targetDistance < $(WINDOW_WND).width() + 100) 

            this.activate();

        else {

            this.resetFOV();

            if (!this.alert && !this.desiredLocation)

                this.deactivate();

        }



        //Monster has been hit

        if (this.hasBeenHit)

            this.processHitEvent();



        //Update direction value

        if (this.xvel > 0)

            this.direction = RIGHT;

        else if (this.xvel < 0) this.direction = LEFT;



        //Exit

        if (!this.isActive())

            return;



        //Update

        this.airMovement();

        if (!this.recoverSenses)

            this.chooseRoutine(targetDistance);

        this.updateSequences();







        this.move();



        //Move

        if (this.xvel > 2)

            this.xvel = 2;

        if (this.xvel < -2)

            this.xvel = -2;



        this.ypos += this.yvel;

        this.xpos += this.xvel;

        

    }







    /*

    =====================

    FOV

    =====================

    */

    this.resetFOV = function () {

        return this.FOV = _SOLDIER_FOV_;

    }



    this.getFOV = function () {

        return this.FOV;

    }



    this.setFOV = function (value) {

        return this.FOV = value;

    }







    /*

    =====================

    Activate/deactivate

    =====================

    */

    this.isActive = function () {

        return this.active;

    }



    this.activate = function () {

        return this.active = true;

    }

    this.deactivate = function () {

        return this.active = false;

    }







    /*

    =====================

    Get/set direction

    =====================

    */

    this.getDirection = function () {

        if (this.xvel > 0)

            return this.direction = RIGHT;

        else if (this.xvel < 0)

            return this.direction = LEFT;

    }







    /*

    =====================

    Emit a sound

    =====================

    */

    this.soundEmitter = function (action) {

        if (!action)

            return;



        switch (action) {

            case 'sawyou':

                return s_loadSoundHandler('M_SOLDIER_SAWYOU', null, true);

            case 'spark':

                return s_loadSoundHandler('M_SOLDIER_SPARK' + Math.floor((Math.random() * 2) + 1), null, "any");

                break;

            case 'hit':

                return s_loadSoundHandler('M_SOLDIER_HIT' + Math.floor((Math.random() * 2) + 1), null, "any");

            case 'shoot':

                return s_loadSoundHandler('M_SOLDIER_SHOOT', null, "none");

            case 'aggressive':

                return s_loadSoundHandler('M_SOLDIER_AGGRESSIVE', null, "none");

            default: return;

        }

    }







    /*

    =====================

    Evaluate a routine

    =====================

    */

    this.chooseRoutine = function (targetDistance) {



        //Can see the target?

        if (targetDistance <= this.FOV)

            if ((Math.abs(this.target.ypos - this.ypos) < 50) && this.direction == RIGHT && this.target.xpos > this.xpos

                    || this.direction == LEFT

                    && this.target.xpos < this.xpos)

                if (this.isActive()) {

                    if (!this.alert)

                    {

                        //this.soundEmitter('aggressive');

                        //this.alert = true;

                        this.prepareToFight();

                    }

                }



        //Target is too much distant

        if (this.distanceFromLoc(this.target.xpos) > 1000)

            this.alert = false;



        if (!this.alert)

            this.quietRoutine();

        else this.attackRoutine();

        

    }







    /*

    =====================

    Quiet routine

    =====================

    */

    this.quietRoutine = function () {



        /*

        //Stop time

        if (this.thinking > 0) {

            this.xvel != 0 ? this.xvel = 0 : null;

            //this.yvel = this.isGround ? 0 : this.yvel;

            return;

        }

        else this.xvel == 0 ? this.xvel = 2 : null;

        */



        //Pick Random value

        if ((ttime = ((Math.random() * 3000) + 0)))

            if(ttime < 3)

                this.thinking = ttime = 0; //not used



        //Get obstacles

        if (__sections.getZoneByX(this.xpos + this.width) != this.zoneIndex)

            obstacles = __sections.retrieveObjs_ext(this.zoneIndex, __sections.getZoneByX(this.xpos + this.width), new Array('floor', 'wall', 'door'));

        else obstacles = __sections.retrieveObjs(this.zoneIndex, new Array('floor', 'wall', 'door'));



        //Check if can move on X

        if ((response = this.px.collision.satDetect(this, obstacles))) {

            this.acceleration.x *= -1;

            if (response.overlapN.x < 0 && this.xvel > 0 || response.overlapN.x > 0 && this.xvel < 0)

                this.xpos = this.xpos;

            else if (response.overlapN.x) {

                //Resolve

                this.xpos -= response.overlapN.x;

                if (response.overlapN.y)

                    this.ypos -= response.overlapN.y;

                //Then check if can jump over the obstacle

                if ((this.calculateMaxJump(this) + this.ypos) + this.height < response.obstacle.ypos)

                    this.jump(6/*(Math.sqrt(response.obstacle.height * 2 * CONST_GRAVITY) + 2)average jump power*/);

                else {

                    //Else invert direction

                    

                }

            }

        }

        else {

            this.yvel = this.acceleration.y;

            this.xvel = this.acceleration.x;

        }



        /*

        //check if is too much distant from his native position, then change velocity

        if (parseInt(this.distanceFromLoc(this.hisLocation)) > 500)

                if (this.hisLocation > this.xpos)

                    this.xvel = 2;

                else if (this.hisLocation < this.xpos)

                    this.xvel = -2;

                    */

        //Emitt sound

        if (ttime > 10 && ttime < 20)

            this.soundEmitter('spark');





        

    }









    /*

    =====================

    Control air movement

    =====================

    */

    this.airMovement = function () {



        var acheck = null;

        var response = null;



        response = this.px.collision.satDetect(this,

                   __sections.getZoneByX(this.xpos + this.width) != __sections.getZoneByX(this.xpos)

                   ? __sections.retrieveObjs_ext(__sections.getZoneByX(this.xpos), __sections.getZoneByX(this.xpos + this.width), new Array('floor', 'wall', 'door'))

                   : __sections.retrieveObjs(__sections.getZoneByX(this.xpos), new Array('floor', 'wall', 'door')));



        if (response) {

            this.ypos -= response.overlapN.y;

            if (this.yvel > 0 && response.obstacle.ypos > this.ypos)

                acheck = 1;

            else if (this.yvel < 0 && response.obstacle.ypos < this.ypos) acheck = 2;

        }



        if (acheck) {

            if (acheck == 2) {

                this.yvel = -this.yvel;

                this.xvel = -this.xvel;

            }

            if (this.yvel > 0 && acheck == 1) {

                this.isGround = true;

                this.yvel = -this.yvel;

            }

        }

        else this.isGround = false;



        if(!this.isGround)

            this.applyGravity();

        

    }









    /*

    =====================

    Attack routine

    =====================

    */

    this.attackRoutine = function () {



       



    }







    /*

    =====================

    Get target direction

    =====================

    */

    this.getTargDirection = function () {

        return this.target.xpos > this.xpos ? RIGHT : LEFT;

    }







    /*

    =====================

    Invert direction

    =====================

    */

    this.invertDirection = function () {



        if (this.direction == RIGHT)

            this.direction = LEFT;

        else if (this.direction == LEFT)

            this.direction = RIGHT;

    }







    /*

    =====================

    Shoot

    =====================

    */

    this.shoot = function () {



        if (this.wepIsRecharging)

            return false;



        c_setFireHotPoint(this);

        c_shootLaser(this, Math.atan2((this.ypos) - (this.target.ypos), (this.xpos) - (this.target.xpos)) + Math.PI);



        this.wepIsRecharging = 1200;

        return true;

    }







    /*

    =====================

    Update sequences (recharge, thinking time...)

    =====================

    */

    this.updateSequences = function () {



        //Thinking time

        if (this.thinking > 0)

            this.thinking -= GLOOP_MS;

        else if (this.thinking < 0) this.thinking = false;



        //Recharging weapon

        if (this.wepIsRecharging < 0)

            this.wepIsRecharging = 0;

        else

            this.wepIsRecharging -= GLOOP_MS;



        //Recover senses

        if (this.recoverSenses > 0)

            this.recoverSenses -= 15;

        else {

            this.hasBeenHit = false;

            this.recoverSenses = 0;

        }

    }





    /*

    =====================

    Return distance from an x

    =====================

    */

    this.distanceFromLoc = function (xLocation) {

        return Math.abs(this.xpos - xLocation);

    }







    /*

    =====================

    Is dead?

    =====================

    */

    this.isDead = function () {

        return this.health <= 0 ? true : false;

    }







    /*

    =====================

    Prepare to fight

    =====================

    */

    this.prepareToFight = function () {

        this.weapons[this.weapon] = new Object();

        this.weapons[this.weapon].damage = 5;

        this.weapons[this.weapon].range = 1000;

        c_setFireHotPoint(this);

    }







    /*

    =====================

    Monster has been hit

    =====================

    */

    this.processHitEvent = function () {



        if (this.recoverSenses != 0)    //Monster is recovering senses

            return;



        //Hurt knockback

        this.yvel -= 3;

        this.xvel += this.hasBeenHit.weapons[this.hasBeenHit.weapon].damage / mh_getDistance2P(this, this.hasBeenHit) * (this.hasBeenHit.direction == LEFT ? -1 : 1);



        //Take to time to recover senses

        this.recoverSenses = 400;



        //Prepare to fight

        this.prepareToFight();

        if (!this.isActive())

            this.FOV = Math.abs(this.xpos - this.target.xpos);



        this.soundEmitter('hit');

        this.alert = true;

       

        //Add blood particles to rendering list

        render.bloodParticles(this.xpos - 10, this.ypos + this.height / 2, 40, this.hasBeenHit.direction == LEFT ? -1 : 1, this.hasBeenHit.direction);

        this.hasBeenHit = null;

    }





    /*

    =====================

    Jump

    =====================

    */

    this.jump = function (pwr) {

 

        if (!this.isGround)

            return;



        this.yvel = (pwr == null ? -this.jump_velocity : -pwr);

        this.isJumping = true;

    }





    /*

    =====================

    Apply gravity

    =====================

    */

    this.applyGravity = function () {

        if ((this.yvel += CONST_GRAVITY) > this.max_falling_acceleration)

            this.yvel = this.max_falling_acceleration;

    }







    /*

    =====================

    Update internal processes

    =====================

    */

    this.updateStatus = function () {



        if (this.isDead()) {



            //Remove from game

            game.gentities.splice(game.gentities.indexOf(this), 1);



            //Remove from tree

            __sections.remove(this);



            //Load sounds and visual effects

            s_loadSoundHandler('BLOOD_SPLAT', null, 'none');

            s_loadSoundHandler('M_BALLEXPLOSION', null, 'none');

            render.bloodExplParticles(this.xpos - 10, this.ypos + 10);



            //Decrement entities in survival mode

            if (g_getGameType() == SURVIVAL)

                gs_decrementEntities(1);

        }

        else

        {

            //Handle tree about this object

            if (this.zoneIndex != __sections.getZoneByX(this.xpos)) {

                __sections.moveElement(this.zoneIndex, __sections.getZoneByX(this.xpos), this);

                this.zoneIndex = __sections.getZoneByX(this.xpos);

            }

        }

    }









}