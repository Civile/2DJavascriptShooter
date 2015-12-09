




function __soldierC(xpos, ypos, width, height, race, health, elid)
{
    this.eType = MOVER;
    this.m_class = LIFEFORM;
    this.m_type = MONSTER;
    this.zindex = 10;
    this.elid = elid;
    this.startLoc = {x: xpos, y: ypos};
    this.type = 'monster';

    this.xpos = xpos;
    this.ypos = ypos;
    this.width = 50;
    this.height = 50;
    this.health = 300;
    this.race = 'soldierC';

    this.xvel = 0;
    this.yvel = 0;
    this.mass = 2;
    this.direction = LEFT;
    this.FOV = 400;

    //Combat
    this.target = null;

    this.alert = false;

    this.pFlags = new Array();

    //Booleans
    this.hasBeenHit = false;

    this.zoneIndex = __sections.addElement(__sections.getZoneByX(this.xpos), this);

    this.px = new Physix();

    //NEW
    this.isPreparing = false;
    this.isClosing = false;
    this.preparingVel = 3;
    this.maxYAlt = ypos - 100;
    this.targetAngle = null;

    this.relFirePosR = { x: +50, y: +43 };							    //if the sprite direction is Right
    this.relFirePosL = { x: -10, y: +43 };							    //if the sprite direction is Left
    this.firePos = { x: 0, y: 0 };

    this.isOnGround = false;

    /*
    =====================
    Main update
    =====================
    */
    this.update = function () {

        if(player)
            this.target = player;

        if (!this.isOnGround) {
            this.searchTerrain();
            return;
        }

        //Check target/choose action
        if (this.distanceFromLoc(this.target.xpos) <= this.FOV) {
            if(!this.alert && !this.isPreparing)
                this.isPreparing = true;
            if (this.isClosing)
                this.isClosing = false;
        }
        else {
            if (this.isPreparing || this.alert) {
                this.isClosing = true;
                this.isPreparing = false;
            }
            if (this.alert)
                this.alert = false;
        }

        if (this.target.xpos > this.xpos)
            this.direction = RIGHT;
        else this.direction = LEFT;


        //Preparing
        if (this.isPreparing) {
            if(this.ypos > this.maxYAlt)
                this.ypos -= this.preparingVel;
            if (this.ypos <= this.maxYAlt) {
                this.ypos = this.maxYAlt;
                this.isPreparing = false;
                s_loadSoundHandler('M_TURRET_TARGETHOOKED');
                this.alert = true;
            }
        }

        //Closing
        if (this.isClosing)
        {
            if (this.ypos < this.startLoc.y)
                this.ypos += this.preparingVel;
            if (this.ypos >= this.startLoc.y) {
                this.ypos = this.startLoc.y;
                this.isClosing = false;
            }
        }

        if (this.hasBeenHit) {
            s_loadSoundHandler('M_TURRET_HIT' + Math.floor((Math.random() * 2) + 1));
            this.hasBeenHit = false;
        }


        if (this.alert)
            this.shoot();


        if (this.wepIsRecharging)
            this.wepIsRecharging -= GLOOP_MS;
        if (this.wepIsRecharging < 0)
            this.wepIsRecharging = 0;

        this.updateLogicPosition();

    }



    this.shoot = function () {

        if (this.wepIsRecharging)
            return;
        else this.wepIsRecharging = 2000;

        this.targetAngle = Math.atan2((this.target.ypos + this.target.height/2) - this.ypos, this.target.xpos - this.xpos);
        c_setFireHotPoint(this);
        c_shootFireball(this);
        s_loadSoundHandler('M_TURRETT_SHOOT', null, 'any');
    }


    /*
    =====================
    Search terrain, to lean
    =====================
    */
    this.searchTerrain = function () {

        if (!this.isOnGround) {
            this.ypos += 3;
            if (this.px.collision.detect(this, 1, __sections.retrieveObjs(__sections.getZoneByX(this.xpos), new Array('floor', 'wall', 'movable_floor')))) {
                this.isOnGround = true;
                this.startLoc.y = this.ypos;
                this.maxYAlt = this.startLoc.y - 100;
            }
        }

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


    this.applyForce = function (force) {
        return true;
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
            s_loadSoundHandler('M_TURRET_EXPLODE', null, 'none');
            render.bloodExplParticles(this.xpos - 10, this.ypos + 10);
            render.explosionA(this.xpos + this.width/2, this.ypos + this.height/2);
            render.explosionA(this.xpos + this.width, this.ypos + this.height);

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