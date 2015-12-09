









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

    this.height = 40;

    this.radius = 20;

    this.health = health != null ? health : 50;

    this.race = 'soldier';



    this.xvel = 0;

    this.yvel = 0;

    this.maxXVel = 6;

    this.accel = { x: 0.1, y: 0 }

    this.mass = 4;

    this.direction = LEFT;

    this.FOV = 400;



    //Combat

    this.target = null;



    this.alert = false;



    this.pFlags = new Array();



    //Booleans

    this.active = false;

    this.hasBeenHit = false;

    this.preparing = 0;



    this.zoneIndex = __sections.addElement(__sections.getZoneByX(this.xpos), this);



    this.onground = false;



    this.px = new Physix();





    /*

    =====================

    Main update

    =====================

    */

    this.update = function () {



        if (player)

            this.target = player;



        //Calculate target distance

        var targetDistance = Math.abs(this.xpos - this.target.xpos);



        //Can see the player?

        if (targetDistance < $(WINDOW_WND).width() + 100)

            this.activate();

        else {

            this.resetFOV();

            if (!this.alert)

                this.deactivate();

        }





        //Can see the target?

        if (targetDistance <= this.FOV)

            if(Math.abs(this.target.ypos - this.ypos) < 50)

            if (this.direction == RIGHT && this.target.xpos > this.xpos

                    || this.direction == LEFT

                    && this.target.xpos < this.xpos)

                if (this.isActive()) {

                    if (!this.alert) {

                        this.soundEmitter('aggressive');

                        this.alert = true;

                        if(this.preparing == 0)

                            this.preparing = 90;

                    }

                }



        //Target is too much distant

        if (this.distanceFromLoc(this.target.xpos) > 1000)

            this.alert = false;



        //Pick Random value

        if ((ttime = ((Math.random() * 3000) + 0)))

            if (ttime < 3)

                this.thinking = ttime = 0; //not used



        //Apply power

        this.applyForce({ x: this.direction == LEFT ? -1 : 1, y: 0 });



        //Apply gravity

        this.applyForce({ x: 0, y: CONST_GRAVITY * this.mass});



        //Apply friction

        var velVec = new Vec2(this.xvel, this.yvel);

        var friction = velVec.getCopy(); 

        friction.mul(-1);

        friction.normalize();

        friction.mul(0.5 * 1);

        this.applyForce(friction);



        //Has been hit

        if (this.hasBeenHit) {

            this.soundEmitter('hit');

            //Prepare to fight if not recovering senses

            this.alert = true;

            render.bloodParticles(this.xpos - 10, this.ypos + this.height / 2, 40, this.hasBeenHit.direction == LEFT ? -1 : 1, this.hasBeenHit.direction);

            if (this.hasBeenHit.weapon && this.hasBeenHit.weapons)
            this.applyForce({

                x: this.hasBeenHit.direction == LEFT ? -30 + this.hasBeenHit.weapons[this.hasBeenHit.weapon].damage : 30 + this.hasBeenHit.weapons[this.hasBeenHit.weapon].damage,

                y: -20 

            });

            this.hasBeenHit = false;

            this.activate();

            if (this.preparing == 0)

                this.preparing = 90;

        }



        if (!this.isActive())

            return;



        //Attack

        if (this.alert && this.preparing == 0) 

            this.attack();



        //Apply vel

        this.xvel += this.accel.x;

        this.yvel += this.accel.y;



        //Constrain vel

        if(this.alert && this.preparing == 0)

            this.xvel = mh_constrain(this.xvel, -this.maxXvel, this.maxXVel);

        else

            this.xvel = mh_constrain(this.xvel, -2, 2 );

        this.yvel = mh_constrain(this.yvel, -8, 8);



        //Update position

        this.xpos += this.xvel;

        if (this.yvel > 0 && this.onground)

            this.yvel = 0;

        this.ypos += this.yvel;



        this.jump();



        if (this.yvel)

            this.onground = false;



        //Null acceleration

        this.accel.x = 0;

        this.accel.y = 0;



        //Emitt sound

        if (ttime > 10 && ttime < 20)

            this.soundEmitter('spark');



        //check if is too much distant from his native position, then change velocity

        if (parseInt(this.distanceFromLoc(this.hisLocation)) > 500 && !this.alert) {

            this.invertDirection();

            this.invertVelocity();

        }



        if (this.updateLogicPosition()) {

            this.checkBounds();



            if (this.preparing > 0)

                this.preparing -= 1;

            if (this.preparing <= 0)

                this.preparing = 0;

        }

    }





    /*

    =====================

    Check obstacles

    =====================

    */

    this.checkBounds = function () {

        

        //Get obstacles

        if (__sections.getZoneByX(this.xpos + this.width) != this.zoneIndex)

            obstacles = __sections.retrieveObjs_ext(this.zoneIndex, __sections.getZoneByX(this.xpos + this.width), new Array('floor', 'wall', 'door', 'player', 'barrell'));

        else obstacles = __sections.retrieveObjs(this.zoneIndex, new Array('floor', 'wall', 'door', 'player', 'barrell'));



        if ((response = this.px.collision.satDetect(this, obstacles))) {



            if (response.obstacle === this.target && this.alert) {

                c_damage(this, this.target, this, this.direction, 15);

                //c_knockback(1, Math.atan2(this.ypos - this.target.ypos, this.xpos - this.target.xpos), this.target, 1);

                this.health = 0;

                this.target.hasBeenHit = this;

                return;

            }

                

            if (response.overlapN.y) {

                if(response.obstacle.ypos > this.ypos)

                    this.onground = true;



                //FIX: quanto l'ostacolo è in alto e lui è a terra tende a sprofondare | anche se viene sparato

                //continua a risolvere la collisione dall'alto e non viene influenzato da quella dal basso



                this.ypos -= response.overlapN.y;

                this.yvel *= -1;

            }



            if (response.overlapN.x) {

                this.xpos -= response.overlapN.x;

                this.invertDirection();

                this.invertVelocity();

                this.alert = false;

                if (this.xvel >= this.maxXVel - 1 || this.xvel <= -(this.maxXVel + 1) && this.alert)

                    this.health = 0;

            }



            

        }



        //Out of the map

        if (this.ypos > $(GAME_WND).height() || this.ypos < $(GAME_WND).position().top

            || this.xpos < $(GAME_WND).position().left || this.xpos > $(GAME_WND).width()) {

            this.health = 0;

        }

    }





    /*

    =====================

    Invert direction

    =====================

    */

    this.invertDirection = function () {

        this.direction == LEFT ? this.direction = RIGHT : this.direction = LEFT;

    }



    /*

    =====================

    Invert xvel

    =====================

    */

    this.invertVelocity = function () {

        this.xvel *= -1;

    }



    /*

    =====================

    Jump

    =====================

    */

    this.jump = function () {

        if(this.onground)

            this.yvel = -8;

    }



    /*

    =====================

    Apply force

    =====================

    */

    this.applyForce = function (force) {

        var relForce = { x: force.x / this.mass, y: force.y / this.mass };

        this.accel.x += relForce.x;

        this.accel.y += relForce.y;

    }



    /*

    =====================

    Is dead?

    =====================

    */

    this.isDead = function () {

        return this.health <= 0;

    }



    /*

    =====================

    Get distance from x

    =====================

    */

    this.distanceFromLoc = function (x) {

        return Math.abs(this.xpos - x);

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

    FOV

    =====================

    */

    this.resetFOV = function () {

        return this.FOV = 400;

    }



    this.getFOV = function () {

        return this.FOV;

    }



    this.setFOV = function (value) {

        return this.FOV = value;

    }





    /*

    =====================

    Attack

    =====================

    */

    this.attack = function () {

        if (this.distanceFromLoc(this.target.xpos) >= 400)

            return;

        var atDir = null;



        this.getDirectionTo(this.target);



        var atDir = new Vec2.prototype.sub({ x: this.target.xpos, y: this.target.ypos }, { x: this.xpos, y: this.ypos });

        atDir.normalize();

        this.applyForce(atDir);

    }





    /*

    =====================

    Get direction to

    =====================

    */

    this.getDirectionTo = function (object) {

        if (this.target.xpos > this.xpos && this.direction == LEFT

                || this.target.xpos < this.xpos && this.direction == RIGHT) {

            this.invertDirection();

            this.invertVelocity();

        }

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

    Update logic position

    =====================

    */

    this.updateLogicPosition = function () {



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



            return false;

        }

        else {

            //Handle tree about this object

            if (this.zoneIndex != __sections.getZoneByX(this.xpos)) {

                __sections.moveElement(this.zoneIndex, __sections.getZoneByX(this.xpos), this);

                this.zoneIndex = __sections.getZoneByX(this.xpos);

            }

            return true;

        }

    }









}