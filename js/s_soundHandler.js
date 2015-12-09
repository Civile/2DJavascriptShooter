
/*
=====================
Sound handler
=====================
*/

createjs.Sound.addEventListener("loadComplete", s_updatePercentage);

var loadSounds = false;
function toggleSoundsLoader() {
    return loadSounds = loadSounds == false;
}


/*
=====================
Register sounds
sO: array
callback: callback after loading
output: call a function between loading
=====================
*/
var _size = 0;

function s_preloadSounds(sO, callback, output) {

    var c = 0;
    var size = null;
    var tSize = 0;

    if (!sO)
        if(callback) {
            callback();
        }
        else
            return false;

    if (sO instanceof Array) 
        for (var x in sO)
            tSize += sizeOfObject(sO[x]);
    
    _size = tSize;

    for (var i in sO) {
        for (var key in sO[i]) {

            if (sO[i][key] != null && key) {

                createjs.Sound.registerSound('sounds/' + sO[i][key] + '', key);
                
                createjs.Sound.onLoadComplete = function () {
                    c += 1;
                    s_updatePercentage(tSize, c);
                    //console.log(tSize + " ---- " + c);
                    g_loadInterfaceSend();
                    if(output != null)
                        output();
                    if (s_getPercentage() >= 100) {
                        s_nullPercentage();
                        if (callback != null) {
                            callback();
                        }
                    }
                }
            }
        }
    }
    return true;
}



/*
=====================
Loading percentage
=====================
*/
var spercentage = 0;

function s_updatePercentage(size, n) {
    spercentage = (parseInt((n * 100) / _size));
}

function s_getPercentage() {
    return spercentage;
}

function s_nullPercentage() {
    return spercentage = 0;
}


/*
=====================
Unregister sounds
=====================
*/
function s_resetSoundsManifest() {
    createjs.Sound.activePlugin = null;
    createjs.Sound.pluginsRegistered = false;
    createjs.Sound.idHash = {};
    createjs.Sound.preloadHash = {};
    // now you must register the plugins again, for example with
    createjs.Sound.initializeDefaultPlugins();
}