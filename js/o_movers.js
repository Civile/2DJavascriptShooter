

/*
==========================================
Movable floor
==========================================
*/

function __movableFloor(x, y, width, height) {

    

    this.xpos = x;

    this.ypos = y;

    this.width = width;

    this.height = height;

    this.type = 'movable_floor';

    this.eType = MOVER;



    this.minXPos = x;

    this.maxXpos = x + 200;

    this.sxpos = null;

    this.expos = null;

    this.action = 1;

    this.xvel = 1;





    this.zoneIndex = __sections.addElement(__sections.getZoneByX(this.xpos), this);

    this.px = new Physix();





    this.update = function () {



        //Handle tree about this object

        if (this.zoneIndex != __sections.getZoneByX(this.xpos)) {

            __sections.moveElement(this.zoneIndex, __sections.getZoneByX(this.xpos), this);

            this.zoneIndex = __sections.getZoneByX(this.xpos);

        }





        if (!this.sxpos) {

            this.sxpos = parseInt(this.xpos);

            this.expos = parseInt(this.xpos - 250);

        }



        if (parseInt(this.xpos) == this.expos)

            this.action = 1;

        else if (parseInt(this.xpos) == this.sxpos) this.action = -1;





        var response = null;



        response = this.px.collision.satDetect(this,

                   __sections.getZoneByX(this.xpos + this.width) != __sections.getZoneByX(this.xpos)

                   ? __sections.retrieveObjs_ext(__sections.getZoneByX(this.xpos), __sections.getZoneByX(this.xpos + this.width), new Array('player', 'items', 'monster'))

                   : __sections.retrieveObjs(__sections.getZoneByX(this.xpos), new Array('player', 'items', 'monster')));



        if (this.action == -1)

            this.xvel = -1;

        else

            this.xvel = 1;



        this.xpos += this.xvel;



        if (response) {

            if (this.xvel < 0 && response.obstacle.xpos > this.xpos)

                response.obstacle.xpos -= Math.abs(this.xvel);

            if(this.xvel > 0 && response.obstacle.xpos > this.xpos)

                response.obstacle.xpos += Math.abs(this.xvel);

        }



    }

}







/*
==========================================
Handle map's items (health boxes, ammos...)
==========================================
*/

var itemsClasses = Array('item', 'weapon');

function i_moveItems() {

    var items = __sections.retrieveObjs_ext(__sections.getZoneByX(player.xpos) > 0 ? __sections.getZoneByX(player.xpos) - 1 : 0,

                __sections.getZoneByX(player.xpos) >= __sections.getTotSections() ? __sections.getTotSections() : __sections.getZoneByX(player.xpos) + 1, itemsClasses);



    if (!items)

        return;



    for (var i in items) {



        if (!items[i].isGround) {

            items[i].ypos += 1;

            if (items[i].px.collision.detect(items[i], 1, __sections.retrieveObjs(__sections.getZoneByX(items[i].xpos), new Array('floor', 'wall', 'movable_floor')))) {

                items[i].isGround = true;

                items[i].ypos -= 4;

            }

            continue;

        }



        if (!items[i].sypos) {

            items[i].sypos = parseInt(items[i].ypos);

            items[i].eypos = parseInt(items[i].ypos - 10);

        }



        if (parseInt(items[i].ypos) == items[i].eypos)

            items[i].action = 1;

        else if (parseInt(items[i].ypos) == items[i].sypos) items[i].action = -1;





        if (items[i].action == -1)

            items[i].ypos -= 0.3;

        else

            items[i].ypos += 0.3;

    }

}









//Cloud object

function Cloud(sx, sy, cloud) {



    this.xpos = sx;

    this.ypos = sy;



    this.type = 'cloud';

    this.eType = MOVER;



    this.update = function () {

        render.lastRendering.push(this);

        //this.xpos += 0.3;

        //this.ypos -= 0.005;

    }



    this.isOut = function () {

        return this.xpos > $(GAME_WND).width();

    }



    this.isOnRightBound = function () {

        return this.xpos + this.cloudImg.width > $(GAME_WND).width();

    }



}



