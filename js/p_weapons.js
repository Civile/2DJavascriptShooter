

/*

==========================================

WEAPONS

==========================================

*/



//Weapons 

function w_pistol() {
    this.name = 'PISTOL';
    this.sprite = 'items/weapon_pistol.png';
    this.ammo = -1;        //infinite
    this.rechargeTime = 14;
    this.nProjectiles = 1;
    this.pSpread = 5;
    this.range = 700;
    this.pvel = -1;
    this.damage = 5;
    this.damageRadius = 0;
    this.recoil = 0;
};



function w_shotgun() {

    this.name = 'SHOTGUN';

    this.sprite =  'items/weapon_shotgun.png';

	this.ammo =  0;

	this.rechargeTime =  45;

	this.nProjectiles =  4 ;

	this.pSpread =   20;

	this.range =  300;

	this.pvel =  -1;		//instant

	this.damage =  9;

	this.damageRadius =  0;

	this.recoil =  10;

};





function w_machinegun() {

    this.name =  'MACHINEGUN';

    this.sprite =  'items/weapon_machinegun.png';

	this.ammo =  0;

	this.rechargeTime =  5;

    this.nProjectiles =  1 ;

	this.pSpread =   5;

	this.range =  400;

	this.pvel =  -1;		//instant

	this.damage =  11;

	this.damageRadius =  0;

	this.recoil =  2;

};





function w_rocketLauncher() {

    this.name = 'ROCKETLAUNCHER';

    this.sprite = 'items/weapon_rocketLauncher.png';

	this.ammo = 0;

	this.rechargeTime = 100;

	this.nProjectiles = 1;

	this.pSpread = 15;

	this.range = 400;

	this.pvel = 1;		//"missile" type

	this.damage = 40;

	this.damageRadius = 100;

	this.recoil = 17;

};

	





function w_holeGenerator() {

    this.name = 'HOLEGENERATOR';

    this.sprite = 'items/weapon_holegenerator.png';

    this.ammo = 0;

    this.rechargeTime = 1000;

    this.nProjectiles = 1;

    this.pSpread = 2;

    this.range = 500;

    this.pvel = 1;

    this.damage = 1000;

    this.damageRadius = 500;

    this.recoil = 0;

};







/*

=====================

Weapons: relative shooting functions

=====================

*/

wFns = new Array();

wFns[-1] = new Array();

wFns[1] = new Array();



//Holegenerator

wFns[1][HOLEGENERATOR] = function (param) {



    if (!param)

        return;

    return c_shootBlackHole(param);

};

//Rocketlauncher

wFns[1][ROCKETLAUNCHER] = function (param) {



    if (!param)

        return;

    return c_shootRocket(param);

    /*render.renderSparks(param.firePos.x, param.firePos.y);*/

};



//Pistol | plasmagun

wFns[-1][PLASMAGUN] = function (param) {



    if (!param)

        return;

    return c_shootInstantBullet(param);

    /*render.renderSparks(param.firePos.x, param.firePos.y);*/

};

//Machineguns

wFns[-1][MACHINEGUN] = function (param) {



    if (!param)

        return;

    return c_shootInstantBullet(param);

    /*render.renderSparks(param.firePos.x, param.firePos.y);*/

};

//Shotgun 

wFns[-1][SHOTGUN] = function (param) {



    if (!param)

        return;

    return c_shootInstantBullet(param);

    /*render.renderSparks(param.firePos.x, param.firePos.y);*/

};













/*

=====================

Add weapon

=====================

*/

function w_addWeapon(entity, weaponId, setSTDAmmo) {



    if (!weaponId || !entity)

        return null;



    switch (weaponId) {

        case PLASMAGUN:

            entity.weapons[PLASMAGUN] = new w_pistol();

            if (setSTDAmmo)

                w_addAmmo(entity, PLASMAGUN, -1);

            break;

        case SHOTGUN:

            entity.weapons[SHOTGUN] = new w_shotgun();

            if( setSTDAmmo )

                w_addAmmo(entity, SHOTGUN, 50);

            break;

        case MACHINEGUN:

            entity.weapons[MACHINEGUN] = new w_machinegun();

            if (setSTDAmmo)

                w_addAmmo(entity, MACHINEGUN, 200);

            break;

        case ROCKETLAUNCHER:

            entity.weapons[ROCKETLAUNCHER] = new w_rocketLauncher();

            if (setSTDAmmo)

                w_addAmmo(entity, ROCKETLAUNCHER, 5);

            break;

        case HOLEGENERATOR:

            entity.weapons[HOLEGENERATOR] = new w_holeGenerator();

            if (setSTDAmmo)

                w_addAmmo(entity, HOLEGENERATOR, 3);

            break;

    }

    

}







/*

=====================

Got weapon?

=====================

*/

function w_gotWeapon(entity, weaponId)

{

    if( !weaponId )

        return false;



    return weaponId in entity.weapons;

}







/*

=====================

Set current weapon

=====================

*/

function w_setCurrentWeapon(entity, weaponId) {



    if (!weaponId)

        return false;



    return entity.weapon = weaponId;

}









/*

=====================

Return current weapon

=====================

*/

function w_currentWeapon(entity)

{

    return entity.weapon;

}







/*

=====================

Load w_sprite in HUD

=====================

*/

function w_loadSpriteInHUD(entity, weaponId) {



    if (!weaponId)

        return false;



    $('#weaponIMG').attr('src', 'src/' + entity.weapons[weaponId].sprite);

}



/*

=====================

Get weapon id

=====================

*/

function w_getWeaponNId(weaponHTML_ID) {



    if (!weaponHTML_ID)

        return false;



    return parseInt(weaponHTML_ID.replace('w_', '').toUpperCase());

}









/*

=====================

Add ammo

=====================

*/

function w_addAmmo(entity, weaponId, qty)

{

    if (!weaponId || w_gotWeapon(entity, weaponId) == WEAPON_NONE )

        return false;



    //Hole ganerator is limited 

    if (weaponId == HOLEGENERATOR)

        qty = 3 - entity.weapons[weaponId].ammo;



    amT = w_getAmmo(entity, weaponId);



    if (qty == -1)

        return entity.weapons[weaponId].ammo = -1;



    if ( amT < AMMO_MAX)

    {

        if (amT + qty > AMMO_MAX)

            entity.weapons[weaponId].ammo = AMMO_MAX;

        else

            entity.weapons[weaponId].ammo += qty;

    }

    return entity.weapons[weaponId].ammo;

}







/*

=====================

Decrement ammo

=====================

*/

function w_decrementAmmo(entity, weaponId)

{

    if (entity.weapons[weaponId].ammo != -1)

        entity.weapons[weaponId].ammo--;

}





/*

=====================

Get ammo n

=====================

*/

function w_getAmmo(entity, weaponId)

{

    if (!weaponId || !entity)

        return false;

    if (entity.weapons[weaponId].ammo == -1)

        return 'loop';

    else

        return entity.weapons[weaponId].ammo;

}






function w_areAmmoUseful(entity, ammoname) {

    switch (ammoname) {
        
        case 'ab_' +SHOTGUN: return w_gotWeapon(SHOTGUN); break;
        case 'ab_' +MACHINEGUN: return w_gotWeapon(MACHINEGUN); break;
        case 'ab_' +ROCKETLAUNCHER: return w_gotWeapon(ROCKETLAUNCHER); break;
        case 'w_' +HOLEGENERATOR: return w_gotWeapon(HOLEGENERATOR); break;
    }

    return false;

};





/*

=====================

Switch with next/prev weapon

=====================

*/

function w_autoSwitchWeapon(entity)

{

    for (var i = 0; i < 5; i++ )

        if (!entity.weapons[i])

            continue;

        else {

            if( w_getAmmo(entity, i) != AMMO_NO )

                w_setCurrentWeapon(entity, i)

                w_loadSpriteInHUD(entity, i);

        }

   

     return null;

}