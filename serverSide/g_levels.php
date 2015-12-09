<?php

//Main sheets
include_once('main.php');


/*
==========================================
Get player info
==========================================
*/
if(isset($_SESSION['playernick']))
    $thisPlayer = $_SESSION['playernick'];
else $thisPlayer = null;

if(isset($_SESSION['playerid']))
    $thisPlayerID = $_SESSION['playerid'];
else $thisPlayerID = null;


/*
==========================================
AJAX - Load game|level
==========================================
*/
if( Tools::isSubmit('getLevels')) {
    
    //Init variables
    $data       = null;
    $html       = null;
    $img        = null;
    $position   = null;
    
    //L'utente non ha effettuato l'accesso
    //Visualizza il messaggio
    if($thisPlayerID == null)
    {
        print 1;
        exit();
    }
    
    $data = Db::q('SELECT * FROM '._DB_PREFIX_.'saves LEFT JOIN '._DB_PREFIX_.'maps ON g_saves.level = g_maps.mapIndex WHERE id_player = '.$thisPlayerID.'');
    
    if(!$data[0]) {
        print 1;
        exit();
    }
    

    print stripslashes(json_encode($data));
    exit();
}

?>