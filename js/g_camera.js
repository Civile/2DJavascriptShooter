

/*

==========================================

Camera handler

==========================================

*/





var accumulator = 0;





function __camera()

{

    this.camXPos = null;

    this.camYPos = null;

    this.followed;

    this.active = true;

    this.lastFollowed;

    this.lastPosition;



    //Sliding

    this.slide = false;

    this.slideTime = 1000;





    //Private setting

    this.STDLimit = 560;

    this.marginLimit = this.STDLimit;

    

    this.maxLeftFOV = parseInt($(WINDOW_WND).width()) / 1.5;  //650

    this.maxRightFOV = parseInt($(WINDOW_WND).width()) / 3;





    //Update vars

    //...instead of dynamic operations

    this.update = function () {

        this.maxLeftFOV = parseInt($(WINDOW_WND).width()) / 1.5;  //650

        this.maxRightFOV = parseInt($(WINDOW_WND).width()) / 3;

    }



    







    this.centerOnX = function (x) {

        this.camXpos = x;

    }











    this.centerOnY = function (y) {

        this.camYpos = y;

    }











    this.setFollowed = function (object)

    {

        if (!object) {

            this.setFollowed(player);

            this.goto(player.xpos, 0);

            return;

        }



        if (object && object instanceof Object) {

            this.followed = object;

        }



        this.lastFollowed = this.followed;

        this.lastFollowedOrig = object;

    }













    /*

    =====================

    Follow element

    needs coord: xpos, ypos, xvel

    =====================

    */

    this.follow = function ()

    {

        if (!this.active)

            return false;



        if (!this.followed)

            this.setFollowed(player);



        if (this.followed.xvel != 0) {

            if (this.followed.xvel < 0 && this.followed.xvel < -2) {

                    this.marginLimit < this.maxLeftFOV ? this.marginLimit += 2 : null;

            }

            else if (this.followed.xvel > 0 && this.followed.xvel > 2)

                    this.marginLimit > this.maxRightFOV ? this.marginLimit -= 2 : null;

        }



        if ((-this.followed.xpos + this.marginLimit) > 0)

            return $(GAME_WND).css('margin-left', 0);

        else if( (-this.followed.xpos + this.marginLimit) <= -$(GAME_WND).width() + $(WINDOW_WND).width())

            return $(GAME_WND).css('margin-left', -$(GAME_WND).width() + $(WINDOW_WND).width());

        else $(GAME_WND).css('margin-left', -this.followed.xpos + this.marginLimit)



        //this.moveBackground();



    }



    



    /*

    =====================

    Follow element according to its speed

    needs coord: xpos, ypos, xvel

    =====================

    */

    this.smartFollow = function () {



        if (this.active == false)

            return;



        if (!this.followed)

            this.setFollowed(player);



        if (this.followed.xvel != 0) {

            if (this.followed.xvel < -2)

                this.marginLimit < this.maxLeftFOV ? this.marginLimit += 0.5 : null;

            else if (this.followed.xvel > 2)

                this.marginLimit > this.maxRightFOV ? this.marginLimit -= 0.5 : null;

        } else {



            if(this.followed == player)

                if (keyArrowLeft || keyArrowRight)

                    return;



            if (this.marginLimit > this.STDLimit) {

                this.marginLimit -= 2;

                if (this.marginLimit < this.STDLimit)

                    this.marginLimit = this.STDLimit;

            }

            else {

                this.marginLimit += 2;

                if (this.marginLimit > this.STDLimit)

                    this.marginLimit = this.STDLimit;

            }



        }

        //this.moveBackground();

        if ((-this.followed.xpos + this.marginLimit) > 0 || (-this.followed.xpos + this.marginLimit) <= -$(GAME_WND).width() + $(WINDOW_WND).width())

            return;

        else $(GAME_WND).css('margin-left', -this.followed.xpos + this.marginLimit)



    }







    /*

    =====================

    Return relative x on the map

    =====================

    */

    this.getLeftMargin = function () {

        return Math.abs(parseInt($(GAME_WND).css('margin-left')));

    }





    this.getLeftMarginNegative = function () {

        return parseInt($(GAME_WND).css('margin-left').replace('px', ''));

    }





    /*

    =====================

    Move background

    =====================

    */

    this.moveBackground = function ()

    {

        if (this.followed.xvel != 0) {

            if (this.followed.xvel < 0 && this.followed.xvel <= -3) {

                $(WINDOW_WND).css('background-position', '+=' + 0.5);

            }

            else if (this.followed.xvel > 0 && this.followed.xvel >= 3) {

                $(WINDOW_WND).css('background-position', '-=' + 0.5);

            }

        }

    }











    /*

    =====================

    Goto to a preferred area of the game

    =====================

    */

    this.goto = function (x, y, time, slide, callback)

    {

        instance = this;

        if (slide)

            $(GAME_WND).animate({

                marginLeft: -x,

                marginTop: -y

            }, time);

        else

            $(GAME_WND).css('margin-left', -x).css('margin-top', -y);

    }











    /*

    =====================

    Stop camera for 'time' ms

    =====================

    */

    this.setTimeout = function (time, callback)

    {

        if( this.active )

            this.active = false;

        

        instance = this;



        setTimeout(function () {

            if( callback != null)

                callback();

            instance.activate();

        }, time);



    }







    /*

    =====================

    Activate the cam

    =====================

    */

    this.activate = function ()

    {

        this.active = true;

    }











    /*

    ==============================================

    Camera effects

    ==============================================

    */



    /*

    =====================

    Shake the cam

    =====================

    */

    this.shake = function (times, distance)

    {

        if (!times || !distance)

            return;

        

        $(WINDOW_WND).effect('shake', {

            times: times,

            distance: distance

        }, 0.1);

    }







    /*

    =====================

    Narrow the fov

    =====================

    */

    this.narrowFOV = function (width, height)

    {

        //ADD: qui ancora tutto da fare



        //calculate relation

        marginLeft = this.camXPos;

        marginTop = this.camYPos;



        $(WINDOW_WND).css('margin-left', marginLeft + 'px').css('margin-top', marginTop + 'px')

        $(WINDOW_WND).width(width);

        $(WINDOW_WND).height(height);

    }





}