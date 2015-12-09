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
    $name       = $_POST['name'];
    $mapTitle   = $_POST['mapTitle'];
    
    if($points == null || $mapTitle == null) {
        die();
    }
    
    $thisMapTitle = Db::q('SELECT * FROM '._DB_PREFIX_.'maps WHERE mapIndex = "'.$mapTitle.'" LIMIT 1');    

    $thisMapTitle = $thisMapTitle[0]['name'];
        
    $date = date('Y-m-d H:i:s');
    Db::q('INSERT INTO '._DB_PREFIX_.'points (points, mapTitle, id_player, date) VALUES('.$points.', "'.$thisMapTitle.'", "'.mysql_real_escape_string($name).'", "'.$date.'")');
    
    print 1;
    die();
}

?>