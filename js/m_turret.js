var STD_JUMP_BASE = 10;
var JUMP = 2;
var FALLING = 3;
var NORMAL = 1;
var STD_MONSTER_MAXSPEED = 10;
var STD_MAX_MONSTER_FALLING_ACCELERATION = 20;
var STD_MONSTER_JUMP_VELOCITY = 12;




function __turret(xpos, ypos, width, height, race, health, elid) {
    this.eType = MOVER;
    this.m_class = LIFEFORM;
    this.m_type = MONSTER;
    this.zindex = 10;
    this.elid = elid;
    this.hisLocation = xpos;    //permanent var


    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.health = health != null ? health : 50;
    this.race = 'turret';
    this.domRef = null;
    this.direction = LEFT;
    this.FOV = 600;
    this.desiredLocation = null;


    //Combat
    this.target = player;
    this.wepIsRecharging = null;
    this.shootAngle;
    this.alert = false;


    this.relFirePosR = { x: +15, y: +43 };							    //if the sprite direction is Right
    this.relFirePosL = { x: -10, y: +43 };							    //if the sprite direction is Left
    this.firePos = { x: 0, y: 0 };											//absolute coordinates, based on sprite origins plus relative ones

    this.pFlags = new Array();

    //Booleans
    this.active = false;
    this.hasBeenHit = false;
    this.hitInfo = new Array();
    this.isHacked = false;

    this.update = function () {

        if (!this.target)
            this.target = player;

        //Get distance from target
        var targetDistance = Math.abs(this.xpos - this.target.xpos);

        if (targetDistance <= this.FOV) {

            //Set direction
            if (this.direction == RIGHT && this.target.xpos < this.xpos)
                this.changeDirection(LEFT);
            else if (this.direction == LEFT && this.target.xpos > this.xpos)
                this.changeDirection(RIGHT);

            //Can see the player?
            if (this.direction == RIGHT && this.target.xpos > this.xpos || this.direction == LEFT && this.target.xpos < this.xpos)
                //...yes, then activate
                if (!this.isActive()) {
                    this.soundEmitter('turnon');
                    this.soundEmitter('targetHooked');
                    this.activate();
                    this.prepareToFight();
                }
        }
        else {
            if (!this.isActive())
                return;
            else { this.soundEmitter('turnoff'); this.deactivate(); }
        }

        if (!this.isActive())
            return;

        if (targetDistance <= 600)
           this.shoot();
    
        this.updateStatus();
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
    Prepare to fight
    =====================
    */
    this.prepareToFight = function () {
        c_setFireHotPoint(this);
        this.wepIsRecharging = 1500;
    }



    /*
    =====================
    Sound emitter
    =====================
    */
    this.soundEmitter = function (action) {
        if (!action)
            return;

        switch (action) {
            case 'turnon':
                return s_loadSoundHandler('M_TURRET_ON', null, 'any');
            case 'turnoff':
                return s_loadSoundHandler('M_TURRET_OFF', null, 'any');
            case 'targetHooked':
                return s_loadSoundHandler('M_TURRET_TARGETHOOKED', null, 'any');
            case 'changeDir':
                return s_loadSoundHandler('M_TURRET_CHANGEDIR', null, 'any');
        }
    }


    /*
    =====================
    Update status
    =====================
    */
    this.updateStatus = function () {
        //Rechargin time
        if (this.wepIsRecharging)
            this.wepIsRecharging -= GLOOP_MS;
        if (this.wepIsRecharging < 0)
            this.wepIsRecharging = 0;

        if (this.isDead())
            this.destroy();
    }



    /*
    =====================
    Change direction
    =====================
    */
    this.changeDirection = function (direction) {
        this.soundEmitter('changeDir');
        this.wepIsRecharging = 1500;
        this.direction = direction;
    }


    /*
    =====================
    Destroy this turret
    =====================
    */
    this.destroy = function () {
        render.explosion_B(this.xpos + this.width / 2, this.ypos + this.height / 2, this.zindex, tick + Math.floor((Math.random() * 1000) + 1));
        render.explosion_B(this.xpos + this.width - 15, this.ypos + this.height - 10, this.zindex, tick + Math.floor((Math.random() * 1000) + 1));
        s_loadSoundHandler('M_TURRET_EXPLODE', null, 'none');
        game.gentities.splice(game.gentities.indexOf(this), 1);
        __sections.removeElement(__sections.getZoneByX(this.xpos), this);
    }



    /*
    =====================
    Shoot
    =====================
    */
    this.shoot = function () {
        
        if (this.wepIsRecharging)
            return;
        else this.wepIsRecharging = 2000;
       // if (!this.isHacked)
         //   this.target = 'pointer';
        console.log(this.health);
        c_shootFireball(this);
        s_loadSoundHandler('M_TURRETT_SHOOT', null, 'any');
        return;
    }



    /*
    =====================
    Hack turret (PRESS E)
    =====================
    */
    this.hack = function () {
        this.enemy == player ? this.enemy = MONSTER : null;
    }



    /*
    =====================
    Is dead?
    =====================
    */
    this.isDead = function () {
        return this.health <= 0 ? true : false;
    }






   


}