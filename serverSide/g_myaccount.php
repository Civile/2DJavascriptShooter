
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



if(Tools::isSubmit('getAccount')) {

    $data     = array();
    $jsonData = array();
    $output   = 1;
    
    
    if($thisPlayer != null && $thisPlayerID != null)
        $data = Db::q('SELECT * FROM '._DB_PREFIX_.'users LEFT JOIN '._DB_PREFIX_.'points ON '._DB_PREFIX_.'points.id_player = '._DB_PREFIX_.'users.id LIMIT 1');
    else {
        print  0;
        exit();
    }
    
    $jsonData['email'] = $data[0]['playermail'];   
    $jsonData['nick'] = $thisPlayer;
    $jsonData['signindate'] = $data[0]['date'];
    $jsonData['id'] = $data[0]['id'];
    $jsonData['spoints'] = $data[0]['points'];
    
    //Load picture
    if ($_SESSION['ltype'] === 'facebook')
        $jsonData['imgsrc'] = 'http://graph.facebook.com/1542713425/picture';
    else {
        if(file_exists('images/phs/us_'.$thisPlayerID.'-big.png'))
            $jsonData['imgsrc'] = 'serverSide/images/phs/us_'.$thisPlayerID.'-big.png';
        else 
            $jsonData['imgsrc'] = 'serverSide/images/phs/nophoto.png';
    }
    
    
    if(sizeof($jsonData) != 0)
        print json_encode($jsonData);
    else print 0;
    exit();
}

?>