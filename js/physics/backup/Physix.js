
function Physix()
{

    this.collision = new collision();

}







function collision()
{

    this.collided = new Array();
    this.collisionInfo = new Array();

    /*
    =====================
    Detect collisions
    =====================
    */
    this.detect = function (entity, velocity, solidsList, boolSave)
    {
        
        if (!entity)
            return false;

        //Save the recovery of object with which to control the collision (do not use when checkin against movers)
        if (boolSave == true) {
            var section = entity.zoneIndex;
            if (section != entity.lastZoneIndex) {

                entity.lastZoneIndex = section;
                if (!solidsList)
                    var sensibles = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), rigidBodies);
                else
                    var sensibles = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), solidsList);
                entity.objsToCheck = sensibles;
            }
            else {
                sensibles = entity.objsToCheck;
            }
        }
        else {  //else normal
            if (!solidsList)
                var sensibles = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), rigidBodies);
            else
                var sensibles = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), solidsList);
        }

        for (var i in sensibles)
        {
            if (this.boundIntersecate(entity, velocity, sensibles[i]))
            {
                return this.collisionInfo;
            }
        }
    }



    /*
    =====================
    Check intersecating bounds
    =====================
    */
    this.boundIntersecate = function (entity, velocity, boundingBox)
    {
        if (boundingBox instanceof HTMLElement)
            var solidObjPos = {
                left:   $(boundingBox).position().left,
                top:    $(boundingBox).position().top,
                width:  $(boundingBox).width(),
                height: $(boundingBox).height(),
                objT:   'canvas'
            }
        else if (boundingBox instanceof Object) {
            var solidObjPos = {
                left:   boundingBox.xpos,
                top:    boundingBox.ypos,
                width:  boundingBox.width,
                height: boundingBox.height,
                objT:   'object'
            }
        }
        else return;

        var collided = false;

        if (velocity > 0)
        {
            if ((solidObjPos.left + solidObjPos.width > entity.xpos)
                && (entity.xpos + entity.width + velocity) >= solidObjPos.left
                && (solidObjPos.top + solidObjPos.height) > entity.ypos + entity.yvel && solidObjPos.top < (entity.ypos + entity.yvel)
                && entity.xpos != solidObjPos.left)
            {
                this.collisionInfo = {
                    objT: solidObjPos.objT,
                    objRef: boundingBox,
                    momentX: solidObjPos.left - entity.width,
                };
                return this.collisionInfo; 
            }
        }
        else if (velocity < 0)
        {
            if (solidObjPos.left < entity.xpos
                && (entity.xpos + velocity) <= (solidObjPos.left + solidObjPos.width)
                && (solidObjPos.top + solidObjPos.height) > entity.ypos + entity.yvel && solidObjPos.top < (entity.ypos + entity.yvel)
                && entity.xpos != solidObjPos.left)
            {
                this.collisionInfo = {
                    objT: solidObjPos.objT,
                    objRef: boundingBox,
                    momentX: solidObjPos.left - entity.width,
                };

                return this.collisionInfo;
            }
        }
        
        return false;

    }




    /*
    =====================
    Return info about the collision
    =====================
    */
    this.getCollisionInfo = function()
    {
        if (!this.collided.length)
            return false;
        
        var info = new Array();
        /*
        for (var i in this.collided)
        {
            info.push(data = {
                cClass: $(this.collided[i]).attr('class'),
                cImpactX:null,
                cImpactY: null
            });
        }
        
        return info;
        */

        return this.collisionInfo;
    }



    
    /*
    =====================
    Check vertex
    =====================
    */
    this.vertexDetect = function (entity, sensibles)
    {
        if (!sensibles)
            var sensibles = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), rigidBodies);
        else
            var sensibles = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), sensibles);



        /*
        for (var i in sensibles) {




            if (box.marginLeft > objInfo.right || box.marginRight < objInfo.left || box.marginTop > objInfo.bottom || box.marginBottom < objInfo.top)
                continue;
            else
                return true;
        }
        */
        return false;
    }



    this.Ycollide = function (entity, sensibles)
    {
        if (!sensibles)
            var solidObjs = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), rigidBodies);
        else
            var solidObjs = __sections.retrieveObjs(__sections.getZoneByX(entity.xpos), sensibles);

        if (solidObjs == null)
            return false;

        var collided = false;


        for (var key in solidObjs) {
            var solidObjPos = $(solidObjs[key]).position();

            if ((solidObjPos.left) <= (entity.xpos + (entity.width / 2)) && (solidObjPos.left + $(solidObjs[key]).width()) > (entity.xpos + (entity.width / 2))) {

                if ((entity.ypos + entity.height + entity.yvel) >= solidObjPos.top && solidObjPos.top > entity.ypos) //down collision
                {
                        entity.ypos = (solidObjPos.top - entity.height - 5);
                        collided = true;
                }
                else if (entity.ypos <= (solidObjPos.top + $(solidObjs[key]).height()) && solidObjPos.top < entity.ypos && (ut_HTMLgetAttr(solidObjs[key], 'class') in isSolid)) //up collision
                {
                        entity.ypos = solidObjPos.top + $(solidObjs[key]).height() + 1;
                        collided = true;
                }
            }
        }

        return collided;
    }





    this.getRight = function (elementToCheck) {
        var coord = $(elementToCheck).position();
        return coord.left + $(elementToCheck).height();
    }

    this.getLeft = function (elementToCheck) {
        var coord = $(elementToCheck).position();
        return coord.left;
    }

    this.getBottom = function (elementToCheck) {
        var coord = $(elementToCheck).position();
        return coord.top + $(elementToCheck).height();
    }

    this.getTop = function (elementToCheck) {
        var coord = $(elementToCheck).position();
        return coord.top;
    }





}