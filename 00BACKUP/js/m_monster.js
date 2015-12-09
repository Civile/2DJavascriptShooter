var STD_JUMP_BASE = 10;
var JUMP = 2;
var FALLING = 3;
var NORMAL = 1;
var STD_MONSTER_MAXSPEED = 10;
var STD_MAX_MONSTER_FALLING_ACCELERATION = 20;
var STD_MONSTER_JUMP_VELOCITY = 12;


//Bossess hot points
racesFHPoint = new Array();
racesFHPoint['jack'] = new Array();
    racesFHPoint['jack'][RIGHT] = { x: +150, y: +43 };
    racesFHPoint['jack'][LEFT] = { x: -15, y: +43 };
racesFHPoint['boss'] = new Array();
    racesFHPoint['boss'][RIGHT] = { x: +150, y: +43 };
    racesFHPoint['boss'][LEFT] = { x: -15, y: +43 };
racesFHPoint['drone'] = new Array();
    racesFHPoint['drone'][RIGHT] = { x: +60, y: +10 };
    racesFHPoint['drone'][LEFT] = { x: -10, y: +43 };




function __monster(canvas, xpos, ypos, width, height, race, health, elid)
{
    this.eType = MOVER;
    this.m_class = LIFEFORM;
    this.m_type = MONSTER;
    this.canvas = canvas;
    this.zindex = 10;
    this.elid = elid;
    
	this.xpos = xpos;
	this.ypos = ypos;
	this.width = width;
	this.height = height;
	this.health = race == 'boss' ? 2000 : 50;
	this.race = race;
	this.domRef = null;
	this.xvel = race == 'drone' ? 8 : 5;
	this.yvel = 4;
	this.direction = RIGHT;
	this.FOV = 600;

	this.jump_max_arcX = null;
    this.jump_velocity = 10;
    this.falling_acceleration = 0.5;
	

    //Combat
    this.target = player;
    this.weapons = new Array();
    this.weapon = SHOTGUN;
    this.wepIsRecharging = null;
    this.shootAngle;
    this.alert = false;


    this.relFirePosR = racesFHPoint[race][RIGHT];								    //if the sprite direction is Right
    this.relFirePosL = racesFHPoint[race][LEFT];								    //if the sprite direction is Left
    this.firePos = { x: 0, y: 0 };											        //absolute coordinates, based on sprite origins plus relative ones

    this.pFlags = new Array();

    //Booleans
    this.active = false;
    this.hasBeenHit = false;
    this.hitInfo = new Array();
        
    

    //Movements
    this.xacc = null;


    this.zoneIndex = __sections.addElement(__sections.getZoneByX(this.xpos), this);



	/*
	=====================
	Loop
	=====================
	*/
	this.update = function()
	{
	    if (!this.target)
	        this.target = player;

	    var targetDistance = Math.abs(this.xpos - this.target.xpos);

        /*
	    if (this.race == 'boss') {
	        s_loadSoundHandler('M_BOSS_CRY', null, 'none');
	        if ( targetDistance < 400)
	            s_loadSoundHandler('M_BOSS_FLESH', 0.2, 'none');
	        else {
                if( targetDistance < 1000)
	                s_loadSoundHandler('M_BOSS_FLESH', 0.1, 'none');
	        }
	    }
        */

	}
	


  

















}