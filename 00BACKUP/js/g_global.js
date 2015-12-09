/*

==========================================

Global game's variables and structs

==========================================

*/





//Game windows's IDS

var WINDOW_WND = '#window';
var GAME_WND = '#game';







//e_types

var MOVER = 0x1001;



//m_classes

var MISSILE     = 0x0100;

var ITEM        = 0x0110;

var LIFEFORM    = 0x0111;

var PLAYER      = 0x1111;



//m_types

var ROCKET      = 0x0001;

var BLACK_HOLE  = 0x1010;

var MONSTER     = 0x1100;

var FIREBALL    = 0x1110;

var LASER       = 0x1111;



//store all allocated game's entities

var MAX_GENTITIES = 30;

var game =

{

    playing: false,

    ended: false,

    gentities: new Array(),

    deltaT: 0,

    startTime: null,

    lastTime: null,

    elapsed: null


};





//Weapons

var AMMO_MAX = 200;

var AMMO_NO = 0003;

var AMMO_FULL = 0004;

var NO_WEAPON = 0001;

var WEAPON_NONE = 0010;

var EMPTY = 0;



//Weapon id

var PLASMAGUN = 1;

var SHOTGUN = 2;

var MACHINEGUN = 3;

var ROCKETLAUNCHER = 4;

var HOLEGENERATOR = 5;

var A_COMPRESSOR = 6;



//Special stuff end effects

var ROCKETCAMERA = 0x0001;



var ISACTIVE = new Array();

ISACTIVE[ROCKETCAMERA] = false;









//Directions/actions

var LEFT = 3;

var RIGHT = 1;

var UP = 2;

var DOWN = 5;

var SHOOT = 6;

var SPRINT = 7;

var CALL_INVENTARY = 8;

var SET_WEAPON_SHOTGUN = 9;

var SET_WEAPON_MACHINEGUN = 10;

var SET_WEAPON_ROCKETLAUNCHER = 11;

var SET_WEAPON_PLASMAGUN = 12;

var SET_WEAPON_HOLEGENERATOR = 13;

var USE = 14;

var ROCKET_CAMERA = 15;



//Animations

var NORMAL = 100;

var CROUCH = 101;

var JUMP = 103;

var DOUBLE_JUMP = 107;

var FALLING = 104;

var RUN = 106;



//Constants

var STD_MAX_PLAYER_FALLING_ACCELERATION = 16;

var STD_PLAYER_JUMP_VELOCITY = 8;

var STD_PLAYER_MAXSPEED = 10;

var STD_PLAYER_ACC = 0.45;

var STD_MAX_SPEED_LIMIT = 24;





//GAME TYPES

var CAMPAIGN = 'GC';

var SURVIVAL = 'GS';

var GAMETYPE = CAMPAIGN;



//Player spawn points

var spawnPointX;

var spawnPointY;









var S_SRC = 'src/';

var lastLoop = null;



//Powerups

var P_DOUBLEDAMAGE = 901;





var CONST_GRAVITY = 0.46; 		 //0.46			

var GLOOP_MS = 11;											//Game loop ms



//Game state

var playing = true;

var currLevel;



//Game contexts

var GAME = 01;

var inst_context = GAME;



var rigidBodies = new Array(

    'wall',

    'door',

    'floor',

    'teleporter',

    'barrell',

    'monster', 'player', 'movable_floor');





//Game's elements

var gameElements = new Array(

	/*floors, walls ecc..*/	'floor', 'door', 'wall', 'barrell', 'cloud',

	/*special collisions*/	'item', 'event', 'teleporter',

	/*monsters*/			'wall_nosolid', 'window', 'decor', 'monster', 'player', 'movable_floor'

	);







var WEAPONS_COLLIDE_WITH = new Array(

    'barrell',

    'floor',

    'door',

    'wall',

    'monster',

    'movable_floor',

    MOVER

);





var PLAYER_COLLIDE_WITH = new Array(

    'wall',

    'floor', 'door', 'item',

    'event', 'barrell', 'teleporter', 'movable_floor'

);