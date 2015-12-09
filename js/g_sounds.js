/*
==========================================
Sounds
this class uses -> soundjs by createjs
==========================================
*/

var sSettings = {

    enabled: true,
    sound_volume: 0.4,
    music_volume: 0.2

};


var sMusic =
{

    currPlaying: null,
    playlist: null,

    repeat: false

};



/*Sounds's instances*/
var sInstance =
{

   instance: new Array()

};

/*Return sizeof an object*/
function sizeOfObject(object) {



    if (!object) return;

    var i = 0;
    for (var key in object)
        i++;
    return i;
}



function s_pauseAllSoundsEmitters() {
    createjs.Sound.stop();
}


function s_playAllSoundsEmitters() {

    createjs.Sound.play;

}

/*
=====================
Load menu background and sounds
=====================
*/
function s_loadMenuSounds() {



    createjs.Sound.registerSound('sounds/' + m_music['MENU1'] + '', 'MENU1');
    //createjs.Sound.addEventListener("fileload", null);
    return true;
}

/*
=====================
Play sound 
=====================
*/
function s_loadSoundHandler(sound, event, interrupt) {

    if (sSettings.enabled == false)
        return;

    var volume = event == null ? sSettings.sound_volume : event;
    interrupt == null ? interrupt = 'late' : null;

    var instance = createjs.Sound.play(sound, interrupt);  
    instance.setVolume(volume); 

    instance.addEventListener("playComplete", createjs.proxy(this.handleComplete, this));
        instance.addEventListener("playComplete", s_cancelInstance(this));

	
	sInstance.instance.push(instance);
}




/*
=====================
Remove an instance from sInstance
=====================
*/
function s_cancelInstance(instance)
{

    var i = sInstance.instance.indexOf(instance);

    if (i != -1)

        sInstance.instance.split(i, 1);



    /*

    if (sound in sInstance.instance)
        delete sInstance.instance[sound];
        */
}




/*
=====================
Is playing
=====================
*/
function s_isPlaying(sound)
{

    if (!sInstance.instance[sound])

        return;



    if (sInstance.instance[sound].getPosition() < sInstance.instance[sound].getDuration())
        return sInstance.instance[sound].getPosition();
    return false;
}




/*
=====================
Stop a sound
=====================
*/
function s_stopSound(sound, cancelInst, flag)
{

    if(sound in sInstance.instance)
        sInstance.instance[sound].stop();
    if( cancelInst )
        s_cancelInstance(sound);
}







function s_stPlay(track, volume, repeat)
{

    if (sMusic.currPlaying)

        sMusic.currPlaying.stop();



    sMusic.currPlaying = createjs.Sound.play(track, null, null, null, repeat);


    if (!volume)

        s_stSetVolume(sSettings.music_volume);
    else s_stSetVolume(volume);
}


function s_stCurrStop()
{

    if (!sMusic.currPlaying)

        return;

    sMusic.currPlaying.stop();
}


function s_stCurrPlay() {

    if (!sMusic.currPlaying)

        return;

    sMusic.currPlaying.play();

}

function s_stSetVolume(volume)
{

    if (sMusic.currPlaying)

        sMusic.currPlaying.setVolume(volume);
    else return;
}


function s_stGetVolume()
{

    if (sMusic.currPlaying)

        return sMusic.currPlaying.getVolume();
    else return false;
}


function s_playlist(cmd, src)
{

    if (cmd == 'add') {

        sMusic.playlist.push(src);

    }

}

/*
function playSound(target) {
            //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
            var instance = createjs.Sound.play(target.id, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
            if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) { return; }
            target.className = "gridBox active";
            instance.onComplete = function(instance) {
                target.className = "gridBox";
            }

			
			
			
		function playSound(event) {
        var list = $("#library").get(0);
        if (list.selectedIndex == -1) { return; }

        // Options
        var interrupt = $("#interrupt").get(0);
        var interruptValue = interrupt.options[interrupt.selectedIndex].value;
        var loop = $(".loopSlider").slider("option", "value");
        var delay = $(".delaySlider").slider("option", "value") *1000;
        var offset = $(".offsetSlider").slider("option", "value")*1000;

        for (var i=0, l=list.options.length; i<l; i++) {
            if (!list.options[i].selected) { continue; }
            var item = list.options[i];

            var instance = createjs.Sound.createInstance(item.value);
            instance.addEventListener("succeeded", createjs.proxy(handlePlaySuccess,instance));
            instance.addEventListener("interrupted", createjs.proxy(handlePlayFailed,instance));
            instance.addEventListener("failed", createjs.proxy(handlePlayFailed,instance));
            instance.addEventListener("complete", createjs.proxy(handleSoundComplete,instance));

            instance.play(interruptValue, delay, offset, loop);	
			
			*/