
/*
==========================================
Canvas rendering 
==========================================
*/

var RENDER_SMOKE = 0x0001;

var rSettings = {
    renderSmoke: false
}



function Render() {

    /*
    =====================
    Properties
    =====================
    */
    this.canvas     = null;
    this.ctx        = null;
    this.cwidth     = null;
    this.cheight    = null;
    this.buffer     = new Array();
    
    var self = this;


    /*
    =====================
    Properties
    =====================
    */
    this.init = function () {
        this.canvas = document.getElementById('game');
        if (!this.canvas)
            return console.log('No canvas');
        
        this.cwidth  = $(GAME_WND).width();
        this.cheight = $(GAME_WND).height();

        if (!this.cwidth || !this.cheight) // || !isInt
            return alert('ERROR: no dimension specified');

        this.cwidth     = this.canvas.setAttribute('width', this.cwidth);
        this.cheight    = this.canvas.height = this.cheight;

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx)
            return console.log('No context');

        return true;
    }


    /*
    =====================
    Clear
    =====================
    */
    this.clear = function () {
        
        this.animations = [];
        this.particles = [];
        this.items = [];
        this.playerTrace = [];
    }


    /*
    =====================
    Set background
    =====================
    */
    this.setBackground = function (background) {
        var self = this;
        var bg = new Image();
        bg.src = 'src/bgs/3.jpg';  //background -> usa parametro
        bg.onload = function () {
            self.ctx.drawImage(bg, 0,0);
        }
    }



    /*
    =====================
    Add visual element
    //Loading
    =====================
    */
    this.add = function (x, y, width, height, type, id) {

        var obj     = new Object();

        obj.xpos    = x;
        obj.ypos    = y;
        obj.width   = width;
        obj.height  = height;
        obj.type    = type;
        obj.id      = id;

        this.buffer.push(obj);
    }




    /*
    =====================
    Render rectangle
    =====================
    */
    this.renderRect = function (x, y, width, height, type, id) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#333';
        this.ctx.restore();
        //this.ctx.stroke();
    }

    

    /*
    =====================
    Draw line
    =====================
    */
    this.drawLine = function (sx, sy, ex, ey, color, alpha, width) {
        this.ctx.save();
        this.ctx.beginPath();

        if (width)
            this.ctx.lineWidth = width;

        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(ex, ey);
        this.ctx.fill();
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = alpha;
        this.ctx.stroke();
        this.ctx.restore();
    }


    /*
    =====================
    Render rectangle_extended
    =====================
    */
    this.solidPattern = new Image();
    this.solidPattern.src = 'src/patterns/solid.png';

    this.renderRect_ext = function (x, y, width, height, pattern) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.fillStyle = pattern; //(color == null ? 'black' : color);
        this.ctx.lineWidth = 0;
        this.ctx.fill();
        //this.ctx.strokeStyle = '';
        //this.ctx.stroke();
        this.ctx.restore();
    }


    this.renderCircle_ext = function (x, y, radius, pattern) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = pattern; //(color == null ? 'black' : color);
        this.ctx.lineWidth = 0;
        this.ctx.fill();
        //this.ctx.strokeStyle = '';
        //this.ctx.stroke();
        this.ctx.restore();
    }


    /*
    =====================
    Barrell
    =====================
    */
    this.barrellPattern = new Image();
    this.barrellPattern.src = 'src/patterns/barrell.png';

    this.renderBarrell = function (x, y, width, height) {
        this.renderRect_ext(x, y, 40, 40, this.ctx.createPattern(this.barrellPattern, 'repeat'));
    }

    /*
    =====================
    Clear screen
    =====================
    */
    this.clearScreen = function () {
        return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }



    /*
    =====================
    Rendering loop
    =====================
    */

    this.lastRendering = new Array();

    this.render = function () {

        this.ctx.save();
        this.clearScreen();
        
        this.buffer = __sections.retrieveObjs_ext(
            __sections.getZoneByX(camera.getLeftMargin() -100),
            __sections.getZoneByX(camera.getLeftMargin() + $(WINDOW_WND).width()),
            gameElements, /*sort by*/ 'plane');

        if (!this.buffer)
            return;

        //Render map elements
        for (var i in this.buffer) {
            if (!this.buffer[i])
                continue;
            switch (this.buffer[i].type) {
                case 'floor':
                case 'wall':
                case 'wall_nosolid':
                case 'terrain_rock1':
                case 'movable_floor':
                    this.renderRect_ext(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height, this.buffer[i].color || "black"/*this.ctx.createPattern(this.solidPattern, 'repeat')*/);
                    break;
                case 'teleporter':
                    this.renderTeleporter(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height);
                    break;
                case 'decor':
                    this.renderDecor(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height, this.buffer[i].id);
                    break;
                case 'window':
                    this.renderWindow(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height);
                    break;
                case 'door':
                    this.renderDoor(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height);
                    break;
                case 'item':
                    this.renderItem(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height, this.buffer[i].id);
                    break;
                case 'monster':
                    this.renderMonster(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height, this.buffer[i].race, this.buffer[i]);
                    break;
                case 'barrell':
                    this.renderBarrell(this.buffer[i].xpos, this.buffer[i].ypos, this.buffer[i].width, this.buffer[i].height);
                    break;
                case 'player':
                    this.renderPlayer();
                    break;
                default:
                    this.lastRendering.push(this.buffer[i]);
                    break;
            }
            
        }

        if (this.playerTrace.length)
            this.renderPlayerTrace();
        this.moveParticles();
        this.animate();

        for (var i in this.lastRendering) {
            switch (this.lastRendering[i].type) {
                case 'cloud':
                    this.drawCloud(this.lastRendering[i].xpos, this.lastRendering[i].ypos);
                    break;
            }
        }
        this.lastRendering = new Array();
        
        this.ctx.restore();
    }




    /*
    =====================
    Cloud
    =====================
    */
    this.cloud1 = new Image();
    this.cloud1.src = 'src/cloud1.png';

    this.drawCloud = function (x, y) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.2;
            this.ctx.drawImage(this.cloud1, x, y);
            this.ctx.restore();
    }



    /*
    =====================
    Rendering monsters
    =====================
    */
    this.mHeadRightImg = new Image();
    this.mHeadRightImg.src = 'src/monster/heavysoldier/sheavy-right.png';
    this.mHeadLeftImg = new Image();
    this.mHeadLeftImg.src = 'src/monster/heavysoldier/sheavy-left.png';

    this.renderMonster = function (x, y, width, height, type, e) {

        switch (type) {
            case 'soldier':

                if (!e.alert) 
                    this.bwsmoke(x, y, 'black', '#fff', 400, Math.PI, 10);
                else {
                    if (e.recoverSenses)
                        this.bwsmoke(x, y, 'black', 'purple', 400, Math.PI, 10);
                    else
                        this.bwsmoke(x, y, 'black', 'red', 400, Math.PI, 10);
                }
                break;


            case 'soldierF':

                if (!e.alert)
                    this.bwsmoke(x, y, '#187EC1', '#fff', 200, Math.PI, null, e.radius);
                else {
                    this.bwsmoke(x, y, '#F3D300', '#F3D300', 200, Math.PI, null, e.radius);
                }

                break;

            case 'soldierC':
                this.renderRect_ext(x, y, e.width, e.height, 'black');
                
                if(e.isPreparing || e.alert || e.isClosing)
                    this.drawLine((e.startLoc.x + e.width / 2), e.startLoc.y + e.height, (x + e.width / 2), y + e.height, 'black', 1, 20);
                this.ctx.save();

                if (e.alert) {  //draw cannon
                    this.ctx.translate(x + e.width / 2, y + e.height / 2);
                    this.ctx.rotate(Math.atan2(e.target.ypos - e.ypos, e.target.xpos - e.xpos));
                    this.ctx.translate(-(x + e.width / 2), -(y + e.height / 2));
                    this.drawLine(x + e.width / 2, y + e.height, x + e.width / 2, y + e.height / 2, 'black', 1, 5);
                    this.ctx.fillStyle = 'black';
                    this.ctx.rect(x + e.width / 2, y + e.height / 2, e.width - 10, 20);
                    this.ctx.fill();
                }
                this.ctx.restore();
                

            case 'heavySoldier':
                /*
                this.ctx.save();
                this.ctx.beginPath();
                if (e.health <= 25)
                    this.ctx.fillStyle = '#63070C';
                else this.ctx.fillStyle = 'purple';
                this.ctx.arc(x + width / 2, y + e.height / 3 + 20, 30, Math.PI, false);
                this.ctx.fill();
                this.ctx.restore();

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = 'black';
                this.ctx.translate(x + e.width / 2, y + e.height / 2);
                this.ctx.rotate(0 + Math.PI);
                this.ctx.translate(-x, -y);
                this.ctx.arc(x, y, 30, Math.PI, false);
                this.ctx.fill();
                this.ctx.restore();

                //Skeleton head
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.globalAlpha = 0.3;
                if(e.direction == RIGHT)
                    this.ctx.drawImage(this.mHeadRightImg, x - 6, y - 9, 65, 55);
                else this.ctx.drawImage(this.mHeadLeftImg, x - 13, y - 9, 65, 55);
                this.ctx.restore();
                */
                //Draw eye
                if (e.alert) {
                    var degrees = Math.atan2((e.ypos + e.height / 2) - (e.target.ypos + e.target.height / 2),
                                             (e.xpos + e.width / 2) - (e.target.xpos + e.target.width / 2));
                    
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.randColor();
                    this.ctx.translate(x + e.width / 2, y + e.height / 2);
                    this.ctx.rotate(degrees + Math.PI);
                    this.ctx.translate(-x, -y);
                    this.ctx.arc(x + 25, y + 5, 5, Math.PI * 2, false);
                    this.ctx.fill();
                    this.ctx.restore();
                }
                else {
                    /*
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.fillStyle = "red";
                    if (e.direction == RIGHT)
                        this.ctx.arc(x + 50, y + height/2, 5, Math.PI * 2, false);
                    else if (e.direction == LEFT)
                        this.ctx.arc(x - 5, y + height / 2, 5, Math.PI * 2, false);
                    this.ctx.fill();
                    this.ctx.restore();
                    */
                }

                /*
                //Bounding box
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.globalAlpha = 0.5;
                this.renderRect(x, y, e.width, e.height, type, e.id);
                this.ctx.fill();
                this.ctx.restore();
                */
                break;

            case 'giantSoldier':
                this.ctx.save();
                this.ctx.beginPath();
                if (e.health <= 25)
                    this.ctx.fillStyle = '#63070C';
                else this.ctx.fillStyle = '#373738';
                this.ctx.arc(x + width / 2, y + e.height / 3 + 35, 100, Math.PI, false);
                this.ctx.fill();
                this.ctx.restore();

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = 'black';
                this.ctx.translate(x + e.width / 2, y + e.height / 2);
                this.ctx.rotate(0 + Math.PI);
                this.ctx.translate(-x, -y);
                this.ctx.arc(x, y, 100, Math.PI, false);
                this.ctx.fill();
                this.ctx.restore();

                //Draw eye
                if (e.alert) {
                    var degrees = Math.atan2((e.ypos + e.height / 2) - (e.target.ypos + e.target.height / 2),
                                             (e.xpos + e.width / 2) - (e.target.xpos + e.target.width / 2));

                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.fillStyle = 'black';
                    this.ctx.translate(x + e.width / 2, y + e.height / 2);
                    this.ctx.rotate(degrees + Math.PI);
                    this.ctx.translate(-x, -y);
                    this.ctx.arc(x + 50, y + 5, 50, Math.PI * 2, false);
                    this.ctx.fill();
                    this.ctx.restore();
                }
                else {
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.randColor();
                    if (e.direction == RIGHT)
                        this.ctx.arc(x + 35, y + height / 2, 50, Math.PI * 2, false);
                    else if (e.direction == LEFT)
                        this.ctx.arc(x - 5, y + height / 2, 50, Math.PI * 2, false);
                    this.ctx.fill();
                    this.ctx.restore();
                }

                

                /*
                //Bounding box
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.globalAlpha = 0.5;
                this.renderRect(x, y, e.width, e.height, type, e.id);
                this.ctx.fill();
                this.ctx.restore();
                */

                break;
        }

    }



    /*
    =====================
    Render player
    =====================
    */
    //Right
    this.pRight = new Image();
    this.pRight.src = 'src/player/player-right.png';
    this.pRightFalling = new Image();
    this.pRightFalling.src = 'src/player/player-right-falling.png';

    this.pRightJumping = new Image();
    this.pRightJumping.src = 'src/player/player-right-jumping.png';

    this.pRightCrouch = new Image();
    this.pRightCrouch.src = 'src/player/player-right-crouch.png';

    this.pRightRunning1 = new Image();
    this.pRightRunning1.src = 'src/player/player-right-running1.png';
    this.pRightRunning2 = new Image();
    this.pRightRunning2.src = 'src/player/player-right-running2.png';
    this.pRightRunning3 = new Image();
    this.pRightRunning3.src = 'src/player/player-right-running3.png';
    this.pRightRunning4 = new Image();
    this.pRightRunning4.src = 'src/player/player-right-running4.png';
    this.pRightRunning5 = new Image();
    this.pRightRunning5.src = 'src/player/player-right-running5.png';
    this.pRightRunning6 = new Image();
    this.pRightRunning6.src = 'src/player/player-right-running6.png';
    this.pRightRunning7 = new Image();
    this.pRightRunning7.src = 'src/player/player-right-running7.png';
    this.pRightRunning8 = new Image();
    this.pRightRunning8.src = 'src/player/player-right-running8.png';
    this.pRightRunning9 = new Image();
    this.pRightRunning9.src = 'src/player/player-right-running9.png';


    //Left
    this.pLeft = new Image();
    this.pLeft.src = 'src/player/player-left.png';
    this.pLeftFalling = new Image();
    this.pLeftFalling.src = 'src/player/player-left-falling.png';
    this.pLeftJumping = new Image();
    this.pLeftJumping.src = 'src/player/player-left-jumping.png';
    this.pLeftCrouch = new Image();
    this.pLeftCrouch.src = 'src/player/player-left-crouch.png';

    //SPRITE ANIMATION
    this.pLeftRunning1 = new Image();
    this.pLeftRunning1.src = 'src/player/player-left-running1.png';
    this.pLeftRunning2 = new Image();
    this.pLeftRunning2.src = 'src/player/player-left-running2.png';
    this.pLeftRunning3 = new Image();
    this.pLeftRunning3.src = 'src/player/player-left-running3.png';
    this.pLeftRunning4 = new Image();
    this.pLeftRunning4.src = 'src/player/player-left-running4.png';
    this.pLeftRunning5 = new Image();
    this.pLeftRunning5.src = 'src/player/player-left-running5.png';
    this.pLeftRunning6 = new Image();
    this.pLeftRunning6.src = 'src/player/player-left-running6.png';
    this.pLeftRunning7 = new Image();
    this.pLeftRunning7.src = 'src/player/player-left-running7.png';
    this.pLeftRunning8 = new Image();
    this.pLeftRunning8.src = 'src/player/player-left-running8.png';
    this.pLeftRunning9 = new Image();
    this.pLeftRunning9.src = 'src/player/player-left-running9.png';


    this.runningStat = 1;
    this.runningStatTime = 0;
    this.pRunningFrames = new Array();
    this.pRunningFrames[1] = this.pRightRunning1;
    this.pRunningFrames[2] = this.pRightRunning2;
    this.pRunningFrames[3] = this.pRightRunning3;
    this.pRunningFrames[4] = this.pRightRunning4;
    this.pRunningFrames[5] = this.pRightRunning5;
    this.pRunningFrames[6] = this.pRightRunning6;
    this.pRunningFrames[7] = this.pRightRunning7;
    this.pRunningFrames[8] = this.pRightRunning8;
    this.pRunningFrames[9] = this.pRightRunning9;
    //Left
    this.pRunningFrames[10] = this.pLeftRunning1;
    this.pRunningFrames[11] = this.pLeftRunning2;
    this.pRunningFrames[12] = this.pLeftRunning3;
    this.pRunningFrames[13] = this.pLeftRunning4;
    this.pRunningFrames[14] = this.pLeftRunning5;
    this.pRunningFrames[15] = this.pLeftRunning6;
    this.pRunningFrames[16] = this.pLeftRunning7;
    this.pRunningFrames[17] = this.pLeftRunning8;
    this.pRunningFrames[18] = this.pLeftRunning9;

    this.playerTrace = new Array();

    this.renderPlayer = function () {

        //Bounding box
        //this.renderRect_ext(player.xpos, player.ypos, player.width, player.height, 'white');

        //Player speed trace
        if (player.xvel < -11 || player.xvel > 11 || player.yvel >= 13) {
            pt = new Object();
            pt.ref = this.pRunningFrames[this.runningStat + (player.xvel > 10 ? 0 : 9)];
            pt.xpos = player.xpos;
            pt.ypos = player.ypos;
            pt.width = 35;
            pt.height = 47;
            pt.time = 100;
            if (this.playerTrace.length < 5)
                this.playerTrace.push(pt);
        }

        //RIGHT
        if (player.direction == RIGHT) {

            if (player.actual_state.move == CROUCH) {
                this.ctx.drawImage(this.pRightCrouch, player.xpos, player.ypos -5, 30, 40);
                return;
            }

            //Jumping and falling
            if (player.yvel != 0) {
                if (player.yvel > 0)
                    this.ctx.drawImage(this.pRightFalling, player.xpos, player.ypos, 35, 47);
                else if (player.yvel < 0)
                    this.ctx.drawImage(this.pRightJumping, player.xpos, player.ypos, 35, 47);
                return;
            }
            
            //Running
            if (player.xvel != 0) {
                if (player.xvel > 0) {

                    if (this.runningStatTime >= 0.9) {
                        this.runningStat++;
                        this.runningStatTime = 0;
                    }

                    if (this.runningStat >= 10)
                        this.runningStat = 1;

                    this.ctx.drawImage(this.pRunningFrames[this.runningStat], player.xpos, player.ypos, 35, 47);
                    this.runningStatTime += player.xvel > 7 ? 0.4 : 0.2;

                }
            }
            else {
                this.ctx.drawImage(this.pRight, player.xpos, player.ypos, 25, 44);
                //this.renderRect_ext(player.xpos + 13, player.ypos + 5, 2, 2, this.randColor());
                this.runningStatTime = 0;
            }
        }


        //LEFT
        if (player.direction == LEFT) {

            if (player.actual_state.move == CROUCH) {
                this.ctx.drawImage(this.pLeftCrouch, player.xpos, player.ypos -5, 30, 40);
                return;
            }

            if (player.yvel != 0) {
                if (player.yvel > 0)
                    this.ctx.drawImage(this.pLeftFalling, player.xpos, player.ypos, 35, 47);
                else 
                    this.ctx.drawImage(this.pLeftJumping, player.xpos, player.ypos, 35, 47);
                return;
            }
            
            if (player.xvel != 0) {
                if (player.xvel < 0) {

                    if (this.runningStatTime >= 0.9) {
                        this.runningStat++;
                        this.runningStatTime = 0;
                    }

                    if (this.runningStat >= 9)
                        this.runningStat = 1;

                    this.ctx.drawImage(this.pRunningFrames[this.runningStat + 9], player.xpos, player.ypos, 35, 47);
                    this.runningStatTime += player.xvel < -7 ? 0.4 : 0.2;
                }
            }
            else {
                this.ctx.drawImage(this.pLeft, player.xpos, player.ypos, 30, 50);
                //this.renderRect_ext(player.xpos + 10, player.ypos + 7, 2, 2, this.randColor());
                this.runningStatTime = 0;
            }
            
        }
        return true;
    }

    //Player speed trace
    this.renderPlayerTrace = function () {
        for (var i in this.playerTrace) {
            if (this.playerTrace[i].time <= 0) {
                this.playerTrace.splice(i, 1);
                return;
            }
            this.ctx.globalAlpha = 0.2;
            this.ctx.drawImage(this.playerTrace[i].ref, this.playerTrace[i].xpos, this.playerTrace[i].ypos, 35, 47);
            this.playerTrace[i].time -= 15;
        }
    }


    //Append a viewfinder
    this.viewfinder = function (y, x, view) {

        if (!y || !x)
            return;

        if (!view) {
            $('#viewfinder').remove();
            return;
        }

        if (!$('#viewfinder')[0])
            $(WINDOW_WND).append('<div id="viewfinder" style="background-image:url(\'src/viewfinder.gif\'); width:30px; height:30px; position:absolute; z-index:900;\
                    top:' + y + 'px;\
                    left:' + x + 'px;"></div>');
        else
            $('#viewfinder').css('top', y).css('left', x);
    }


    /*
    =====================
    Return random color
    =====================
    */
    this.randColor = function () {
        var colors = new Array('yellow', 'red', 'purple', 'blue', 'green');
        return colors[Math.floor((Math.random() * colors.length) + 0)];
    }


    
    /*
    =====================
    Render teleporter
    =====================
    */
    var tel = new Image();
    tel.src = 'src/teleporter.png';

    this.renderTeleporter = function (x, y, width, height) {
        this.ctx.drawImage(tel, x, y, width, height);
        return true;
    }

    this.teleporterParticles = function (x, y) {
        for (var i = 0; i <= 5; i++)
        {
            telP = new Object();
            telP.xpos = x;
            telP.ypos = y;
            telP.lifetime = 1000;
            telP.radius = ((Math.random() * 10) + 3);
            telP.xvel = ((Math.random() * 2) + 1);
            telP.yvel = ((Math.random() * 2) + 1) * -1;
            telP.type = 'teleporterParticles';
            telP.angle = Math.sin(-x);
            telP.alpha = 0.1;
            telP.startColor = "red";
            telP.endColor = "blue";
            this.particles.push(telP);
        }
    }


    this.smokeEntity = function (x, y, startColor, endColor, time) {
        for (var i = 0; i <= 1; i++) {
            telP = new Object();
            telP.xpos = x;
            telP.ypos = y;
            telP.lifetime = time;
            telP.radius = ((Math.random() * 10) + 3);
            telP.xvel = ((Math.random() * 2) -1);
            telP.yvel = ((Math.random() * 2) -1) * 4;
            telP.type = 'smokehole';
            telP.angle = Math.sin(-x);
            telP.alpha = 0.9;
            telP.startColor = startColor;
            telP.endColor = endColor;
            this.particles.push(telP);
        }
    }

    this.smokeEntity_ext = function (x, y, startColor, endColor, time, radius, alpha, xvel, yvel, angle) {
        for (var i = 0; i <= 1; i++) {
            telP = new Object();
            telP.xpos = x;
            telP.ypos = y;
            telP.lifetime = time;
            telP.radius = ((Math.random() * 10) + 3);
            telP.xvel = ((Math.random() * 2) -1) * xvel;
            telP.yvel = ((Math.random() * 2) - 1) * yvel != 0 ? yvel : 1;
            telP.type = 'smokehole';
            telP.angle = angle;
            telP.alpha = alpha;
            telP.radius = radius;
            telP.startColor = startColor;
            telP.endColor = endColor;
            this.particles.push(telP);
        }
    }

    /*
    =====================
    Render decor
    =====================
    */
    this.decor = new Array();

    this.renderDecor = function (x, y, width, height, id) {

        if (id == 'tsmoke')
            return this.esmoke(x, y, 'green', 'black', 600);
        else if (id == 'bwsmoke')
            return this.bwsmoke(x + Math.random() * 50 - 1, y, '#333', 'black', 1000, 1);            
        else if (id == 'coloredLines')
            return this.coloredLines(x, y);
        
        if(!this.decor[id])
        {
            this.decor[id]       = new Image();
            this.decor[id].src   = 'src/decors/' + id + '.png';
        }

        //Render image
        this.ctx.drawImage(this.decor[id], x, y, width, height);
    }

    /*
    =====================
    Decor: colored lines
    =====================
    */
    this.colored = 0;
    this.coloredLines = function (x, y) {

        if (this.colored > 3)
            this.colored = 0;
        this.ctx.save();
        if (this.colored < 1) {
            color = '#000061';
            sy = y;
        }
        if (this.colored >= 1) {
            color = '#177FC2';
            sy = y + 10;
        }
        if (this.colored >= 2) {
            color = '#89B1D9';
            sy = y + 20;
        }
        this.drawLine(x, sy, x + 100, sy, color, 1);
        this.colored += 0.1;
        this.ctx.restore();
    }

    /*
    =====================
    Render items
    =====================
    */
    this.items = new Array();

    this.renderItem = function (x, y, width, height, id) {

        if(!id)
            return;

        if (!this.items[id]) {
            this.items[id] = new Image();
            this.items[id].src = 'src/items/' + id + '.png';
        }

        this.ctx.drawImage(this.items[id], x, y, width, height);

    }


    /*
    =====================
    Render window
    =====================
    */
    this.renderWindow = function (x, y, width, height) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        this.ctx.fill();
        this.ctx.restore();
    }



    /*
    =====================
    Render door
    =====================
    */
    this.renderDoor = function (x, y, width, height) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.fillStyle = "#08080A";
        this.ctx.fill();
        this.ctx.lineWidth = 0;
        //this.ctx.strokeStyle = 'grey';
        //this.ctx.stroke();
        this.ctx.restore();
    }


    /*
    =====================
    Render rocket
    =====================
    */
    this.renderRocket = function (x, y) {
        //ADD: fireparticles
        this.smokeEntity_ext(x, y, '#ddd', 'black', 700, 1, 0.8, 1, -1, Math.PI);
        this.smokeEntity_ext(x, y, 'yellow', 'red', 300, 1, 0.8, 1, -1, Math.PI);
    }


    /*
    =====================
    Render projectile trail
    =====================
    */
    this.projTrail = function (sx, sy, ex, ey, color) {

        var pt = new Object();
        pt.sxpos = sx;
        pt.sypos = sy;
        pt.expos = ex;
        pt.eypos = ey;
        pt.time = 50;
        pt.color = color;
        pt.type = 'projTrail';
        this.animations.push(pt);
    }



    /*
    ===============================================================
    Animations
    ===============================================================
    */
    /*
    =====================
    Door animation
    =====================
    */
    this.animations = new Array();

    this.animateDoor = function (door, height) {
        
        if (!door)
            return;

        door.finalHeight = height;
        this.animations.push(door);
    }



    /*
    ==========================================
    Weapons 
    ==========================================
    */
    /*
    =====================
    Initialize laser beam
    =====================
    */
    this.projStripe = function (x, y, width, height, color, time, qty) {

        for (var i = 0; i <= qty; i++) {
            projStripe = new Object();
            projStripe.type = 'projStripe';     //Projectile path
            projStripe.xpos = x;
            projStripe.ypos = y;
            projStripe.width = width;
            projStripe.height = height;
            projStripe.color = color;
            projStripe.time = time;
            projStripe.angle = 0;
            projStripe.direction = 1;
            y -= 5;
            this.animations.push(projStripe);
        }
    }


    /*
    =====================
    Explosion A
    =====================
    */
    this.explA = new Array();
    this.explA[0] = new Image();
    this.explA[0].src = 'src/explosions/explosionA1.png';
    this.explA[1] = new Image();
    this.explA[1].src = 'src/explosions/explosionA2.png';
    this.explA[2] = new Image();
    this.explA[2].src = 'src/explosions/explosionA3.png';
    this.explA[3] = new Image();
    this.explA[3].src = 'src/explosions/explosionA4.png';
    this.explA[4] = new Image();
    this.explA[4].src = 'src/explosions/explosionA5.png';
    this.explA[5] = new Image();
    this.explA[5].src = 'src/explosions/explosionA6.png';
    this.explA[6] = new Image();
    this.explA[6].src = 'src/explosions/explosionA7.png';
    this.explA[7] = new Image();
    this.explA[7].src = 'src/explosions/explosionA8.png';

    this.explosionA = function (x, y) {
        
        var expl     = new Object();
        expl.time    = 50;
        expl.stdTime = expl.time;
        expl.data    = this.explA;
        expl.index   = 0;
        expl.type    = 'explosionA';
        expl.alpha   = 0.8;
        expl.x       = x;
        expl.y       = y;

        this.animations.push(expl);
    }

    /*
    =====================
    Explosion A
    =====================
    */
    this.explB = new Array();
    this.explB[0] = new Image();
    this.explB[0].src = 'src/explosions/explosionB1.png';
    this.explB[1] = new Image();
    this.explB[1].src = 'src/explosions/explosionB2.png';
    this.explB[2] = new Image();
    this.explB[2].src = 'src/explosions/explosionB3.png';
    this.explB[3] = new Image();
    this.explB[3].src = 'src/explosions/explosionB4.png';
    this.explB[4] = new Image();
    this.explB[4].src = 'src/explosions/explosionB5.png';
    this.explB[5] = new Image();
    this.explB[5].src = 'src/explosions/explosionB6.png';
    this.explB[6] = new Image();
    this.explB[6].src = 'src/explosions/explosionB7.png';
    this.explB[7] = new Image();
    this.explB[7].src = 'src/explosions/explosionB8.png';

    this.explosionB = function (x, y) {

        var expl = new Object();
        expl.time = 50;
        expl.stdTime = expl.time;
        expl.data = this.explB;
        expl.index = 0;
        expl.type = 'explosionB';
        expl.alpha = 0.8;
        expl.x = x;
        expl.y = y;

        this.animations.push(expl);
    }




    /*
    =====================
    Initialize laser beam
    =====================
    */
    this.laserBeam = function (x, y, width, height, color, time, qty) {
        
        for (var i = 0; i <= qty; i++) {
            projStripe = new Object();
            projStripe.type      = 'laserBeam';     //Projectile path
            projStripe.xpos      = x;
            projStripe.ypos      = y;
            projStripe.width     = width;
            projStripe.height    = height;
            projStripe.color     = color;
            projStripe.time      = time;
            projStripe.angle     = 0;
            projStripe.direction = 1;
            y -= 5;
            this.animations.push(projStripe);
    } 
    }

    /*
    =====================
    Render laser beam
    =====================
    */
    this.renderLaserBeam = function (x, y, width, height, color) {

        for (var i = 0; i < width; i++) {
            this.drawParticle_ext(x+i, y, 1, 'white', this.randColor(), 0.5);
        }
    }



    /*
    =====================
    Render soldier sinusoidal projectile
    =====================
    */
    this.soldierProjectile = function (x, y) {
        this.smokeEntity_ext(x, y, 'blue', 'purple', 100, 4, 1, 2, null, Math.sin(-x));
    }


    /*
    =====================
    Render smoke-like particles
    =====================
    */
    this.esmoke = function (x, y, startColor, endColor, time) {

        var ds = new Object();
        ds.type = 'esmoke';
        ds.xpos = x;
        ds.ypos = y + (Math.random() * 7) -3 * Math.floor((Math.random() * 2) -1);
        ds.startColor = startColor;
        ds.endColor = endColor;
        ds.alpha = 0.15;
        ds.time = time;
        ds.radius = (Math.random() * 6) + 0.1;
        this.animations.push(ds);

    }



    /*
    =====================
    Render smoke-like particles
    =====================
    */
    this.bwsmoke = function (x, y, startColor, endColor, time, angle, maxRadius, fixedRadius) {

        var ds = new Object();
        ds.type = 'bwsmoke';
        ds.xpos = x;
        ds.angle = angle != null ? angle : 0;
        ds.xvel = 0.4;
        ds.ypos = y + (Math.random() * 7) - 3 * Math.floor((Math.random() * 2) - 1);
        ds.startColor = startColor;
        ds.endColor = endColor;
        ds.alpha = 0.5;
        ds.time = time;
        if (fixedRadius)
            ds.radius = fixedRadius;
        else
        ds.radius = (Math.random() * (maxRadius != null ? maxRadius : 10)) + 0.1;

        ds.func = function () {
            render.drawParticle_ext(this.xpos += 0.4 * Math.cos(angle),
                this.ypos -= 2 * Math.sin(angle),
                this.radius > 0.1 ? this.radius -= 0.1 : 0.1,
                startColor,
                endColor,
                this.alpha > 0.1 ? this.alpha -= 0.01 : 0);
        }
        this.animations.push(ds);

    }

    /*
    =====================
    Process animations
    =====================
    */
    this.animate = function () {

        if (!this.animations)
            return;

        for (var i in this.animations) {
            switch (this.animations[i].type) {
                case 'door':
                    if (this.animations[i].height != this.animations[i].finalHeight)
                        this.animations[i].height -= 1;
                    else this.animations.splice(i, 1);
                    break;
                case 'laserBeam':
                    if (this.animations[i].time <= 0) {
                        this.animations.splice(i, 1);
                        break;
                    }
                    this.animations[i].time -= GLOOP_MS;
                    this.renderLaserBeam(this.animations[i].xpos, this.animations[i].ypos + 1, 200, 1, this.animations[i].color);
                    this.renderRect_ext(this.animations[i].xpos, this.animations[i].ypos + 2, 200, 4, 'red');
                    this.renderLaserBeam(this.animations[i].xpos, this.animations[i].ypos + 6, 200, 1, this.animations[i].color);
                    break;
                case 'vortex':
                    if (this.animations[i].time <= 0) {
                        this.animations.splice(i, 1);
                        break;
                    }
                    this.animations[i].time -= GLOOP_MS;
                    particleSystem.draw();  //Draw vortex
                    break;
                case 'survtext':
                    this.ctx.save();
                    this.ctx.globalAlpha = (this.animations[i].alpha -= 0.01);
                    this.ctx.drawImage(this.animations[i].img, this.animations[i].xpos, this.animations[i].ypos -= 1, this.animations[i].width, this.animations[i].height);
                    if (this.animations[i].alpha <= 0.1) {
                        this.animations.splice(i, 1);
                        this.ctx.restore();
                        return;
                    }
                    this.ctx.restore();
                    break;
                case 'projTrail':
                    if (this.animations[i].time <= 0) {
                        this.animations.splice(i, 1);
                        break;
                    }
                    this.animations[i].time -= GLOOP_MS;
                    this.drawLine(this.animations[i].sxpos, this.animations[i].sypos, this.animations[i].expos, this.animations[i].eypos, this.animations[i].color, 0.1);
                    break;
                case 'esmoke':
                    if (this.animations[i].time <= 0) {
                        this.animations.splice(i, 1);
                        break;
                    }
                    this.animations[i].time -= GLOOP_MS;
                    this.drawParticle_ext(this.animations[i].xpos += Math.floor((Math.random() * 8) - 4), this.animations[i].ypos -= 1, this.animations[i].radius > 0.1 ? this.animations[i].radius -= 0.1 : 0.1, this.animations[i].startColor, this.animations[i].endColor, this.animations[i].alpha > 0.1 ? this.animations[i].alpha -= 0.0001 : 0);
                    break;
                case 'fireProjectile':
                    if (this.animations[i].time <= 0) {
                        this.animations.splice(i, 1);
                        break;
                    }
                    this.animations[i].time -= GLOOP_MS;

                    this.drawParticle_ext(this.animations[i].xpos, this.animations[i].ypos, 3, 'blue', 'green');
                    this.fireParticles(this.animations[i].xpos + 10, this.animations[i].ypos, 2, 1, 10, 0.2);
                    break;
                case 'explosionB':
                case 'explosionA':
                    if (this.animations[i].time <= 0 && this.animations[i].index == (this.animations[i].data.length - 1)) {
                        this.animations.splice(i, 1);
                        break;
                    }
                    else if (this.animations[i].time <= 0)
                    {
                        this.animations[i].index++;
                        this.animations[i].time = this.animations[i].stdTime;
                    }
                    this.animations[i].time -= GLOOP_MS;

                    this.ctx.save();
                    this.ctx.globalAlpha = this.animations[i].alpha;
                    //Automatically center the explosion frame
                    this.ctx.drawImage(this.animations[i].data[this.animations[i].index],
                        this.animations[i].x - this.animations[i].data[this.animations[i].index].width/2,
                        this.animations[i].y - this.animations[i].data[this.animations[i].index].height / 2);
                    //Render smoke particles
                    this.esmoke(this.animations[i].x, this.animations[i].y, 'black', '#333', 800);
                    this.ctx.restore();
                    break;
                default:
                    if (this.animations[i].time <= 0) {
                        this.animations.splice(i, 1);
                        break;
                    }
                    this.animations[i].time -= GLOOP_MS;
                    if(this.animations[i].func != null)
                        this.animations[i].func();
                    break;
            }
        }
    }




    /*
    ===============================================================
    Particles
    ===============================================================
    */

    /*
    =====================
    Create vortex
    =====================
    */
    // globals
    var vortexnumParticles = 60,
        vortexangleSpeed = 0.2,
        vortexparticleSize = 3,
        vortexverticalSpeed = 4,
        vortexwidthFactor = 5,
        vortexsinglecolor = true;
        vortexheight = 300;
    
    var Particle = function (x) {
        this.h = 300;   //Math.floor(myheight * Math.random());
        this.angle = Math.random() * Math.PI * 2;
        this.color = 'yellow';
        this.xpos = x;
    };

    Particle.prototype.draw = function (id) {
        this.angle += vortexangleSpeed;
        this.h -= vortexverticalSpeed;

        if (this.h < 0 || this.h > vortexheight) {
            this.h = Math.floor(vortexheight * Math.random());
        }

        self.ctx.beginPath();
        self.ctx.globalAlpha = 10;
        self.ctx.fillStyle = 'yellow';
        var sizeFactor = 0.5 + (Math.sin(this.angle) + 1) / 2;

                    //xpos
        self.ctx.arc(this.xpos + Math.cos(this.angle) * (vortexheight + this.h) / vortexwidthFactor, this.h, vortexparticleSize * sizeFactor, 0, Math.PI * 2);
        self.ctx.fill();
        self.ctx.stroke();
    };

    var ParticleSystem = function (xpos) {
        this.particles = [];
        for (var i = 0; i < vortexnumParticles; i++) {
            this.particles.push(new Particle(xpos));
        }
    };
    ParticleSystem.prototype.draw = function () {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    };

    var particleSystem = null;

    this.vortex = function (x, y, height, time) {

        var vx = new Object();
        vx.type = 'vortex';
        vx.time = time;

        particleSystem = new ParticleSystem(x);

        this.animations.push(vx);
    }



    
    /*
    =====================
    Move particles
    =====================
    */
    this.particles = new Array();

    this.moveParticles = function () {
        for (var i in this.particles)
        {
            
            if (this.particles[i].lifetime > 0) {
                if (this.particles[i].type == 'blood')
                    this.drawParticle_ext(this.particles[i].xpos += this.particles[i].xvel, this.particles[i].ypos -= this.particles[i].yvel, Math.random() * 1 + 0.3, 'red', 'red', 1);
                else if (this.particles[i].type == 'fragments')
                    this.drawParticle(this.particles[i].xpos += this.particles[i].xvel, this.particles[i].ypos -= this.particles[i].yvel, 0.4, this.particles[i].color1, this.particles[i].color2);
                else {

                    this.particles[i].alpha -= 0.05;
                    if (this.particles[i].alpha < 0)
                        this.particles[i].alpha = 0;

                    this.particles[i].radius -= 0.2;
                    if (this.particles[i].radius < 0)
                        this.particles[i].radius = 0;


                    this.drawParticle_ext(this.particles[i].xpos += this.particles[i].xvel * this.particles[i].angle, this.particles[i].ypos -= this.particles[i].yvel * this.particles[i].angle, this.particles[i].radius, this.particles[i].startColor, this.particles[i].endColor, this.particles[i].alpha);
                }
                this.particles[i].lifetime -= GLOOP_MS;
                continue;
            }
            else { this.particles.splice(i, 1); continue;}
        }
    }



    /*
    =====================
    Draw a particle
    =====================
    */
    this.drawParticle = function (x, y, radius, startColor, endColor) {
        this.ctx.beginPath();
        //circle

        if (radius === undefined || radius < 0)
            radius = 1;

        var radgrad3 = this.ctx.createRadialGradient(x, y, 0, x, y, radius <= 0 ? 0 : radius);

        radgrad3.addColorStop(0, startColor);
        radgrad3.addColorStop(1, endColor);

        this.ctx.fillStyle = radgrad3;

        this.ctx.arc(x, y, radius <= 0 ? 0 : radius, Math.PI * 2, false);
        this.ctx.fill();
    }


    /*
    =====================
    Draw a particle_extended
    =====================
    */
    this.drawParticle_ext = function (x, y, radius, startColor, endColor, alpha) {
        this.ctx.beginPath();
        //circle
        var radgrad3 = this.ctx.createRadialGradient(x, y, 0, x, y, radius <= 0 ? 0 : radius);

        //if (alpha < 0)
            this.ctx.globalAlpha = alpha;
        //else this.ctx.globalAlpha = 1;

        radgrad3.addColorStop(0, startColor);
        radgrad3.addColorStop(1, endColor);

        this.ctx.fillStyle = radgrad3;

        this.ctx.arc(x, y, radius <= 0 ? 0 : radius, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.stroke();
    }

    
    /*
    =====================
    Create blood particles
    =====================
    */
    this.bloodParticles = function (x, y, qty, xdir, ydir) {

        for (var i = 0; i <= qty; i++)
        {
            blP             = new Object();
            blP.xpos        = x;
            blP.ypos        = y;
            blP.lifetime    = 300;
            blP.xvel        = ((Math.random() * 30) + 10) * xdir;
            blP.yvel        = ((Math.random() * 5) + 1) * ydir;
            blP.type        = 'blood';
            blP.angle       = 2;
            this.particles.push(blP);
        }
    }

    this.bloodExplParticles = function (x, y) {
        this.bloodParticles(x, y, 30, 1, 1);
        this.bloodParticles(x, y, 30, -1, -1);
    }


    /*
    =====================
    Create fragments
    =====================
    */
    this.fragmentsParticles = function (x, y, qty, xdir, ydir, angle, color1, color2) {

        for (var i = 0; i <= qty; i++) {
            frg = new Object();
            frg.xpos = x;
            frg.ypos = y;
            frg.lifetime = 60;
            frg.xvel = ((Math.random() * 2) + 1) * xdir;
            frg.yvel = ((Math.random() * 5) + 1) * ydir;
            frg.type = 'fragments';
            frg.angle = angle != 0 ? angle : null;
            frg.color1 = color1 ? color1 : '#DDD';
            frg.color2 = color2 ? color2 : '#EEE';
            this.particles.push(frg);
        }
    }





    /*
    ==========================================
    TEXT
    ==========================================
    */
    /*
    =====================
    Head shoot advice
    =====================
    */
    var headShotAdviceImg = new Image();
    headShotAdviceImg.src = 'src/text/t_headshot.png';

    this.headShotAdvice = function (x, y) {

        var headShot    = new Object();

        headShot.type   = 'survtext';
        headShot.time   = 2500;
        headShot.xpos   = x;
        headShot.ypos   = y;
        headShot.width  = 70;
        headShot.height = 52;
        headShot.alpha  = 1;
        headShot.img    = headShotAdviceImg;

        this.animations.push(headShot);
    }


    /*
    =====================
    Vel shoot advice
    =====================
    */
    var velShootImg = new Image();
    velShootImg.src = 'src/text/t_velocityshoot.png';

    this.velocityShootAdvice = function (x, y) {

        var velShoot = new Object();

        velShoot.type   = 'survtext';
        velShoot.time   = 2500;
        velShoot.xpos   = x;
        velShoot.ypos   = y;
        velShoot.alpha  = 1;
        velShoot.width  = 90;
        velShoot.height = 12;
        velShoot.img    = velShootImg;
        velShoot.func   = function () {

        }
        this.animations.push(velShoot);
    }


    this.commentBox = function (x, y, time, text) {

        var cBox    = new Object();

        cBox.text   = text;
        cBox.time   = time;
        cBox.type   = 'commentBox';
        cBox.func   = function () {
            render.renderRect_ext(x, y, 200, 60, '#ddd');
            render.ctx.save();
            render.ctx.globalAlpha = 0.6;
            render.ctx.fillStyle = 'red';

            render.ctx.font = 'bold 16px Arial';
            render.ctx.fillText(text, x, y);
            render.ctx.restore();
        }
        this.animations.push(cBox);
    }

}
