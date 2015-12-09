<?php

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
Save points
==========================================
*/
if(Tools::isSubmit('savePoints')) {
    
    $points     = (int) $_POST['points'];
    $mapTitle   = $_POST['mapTitle'];
    
    if($points == null || $mapTitle == null) {
        die();
    }
    
    $thisMapTitle = Db::q('SELECT * FROM '._DB_PREFIX_.'maps WHERE mapIndex = "'.$mapTitle.'" LIMIT 1');    

    $thisMapTitle = $thisMapTitle[0]['name'];
        
    $lastPoints = Db::getARow('SELECT points FROM '._DB_PREFIX_.'points WHERE id_player = '.(int)$thisPlayerID.' LIMIT 1');    
    if($lastPoints['points'] < $points)
        Db::q('UPDATE '._DB_PREFIX_.'points 
            SET points = '.(int)$points.', 
            mapTitle = "'.$thisMapTitle.'" 
            WHERE id_player = '.(int)$thisPlayerID.' 
            LIMIT 1');
            
    print 1;
    die();
}

?>