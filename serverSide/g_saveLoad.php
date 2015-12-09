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
Load inventary
==========================================
*/
if(Tools::isSubmit('loadInventary')) {
    
    $data                = null;
    $inv                 = null;
    $weap                = null;
    $output              = array();
    $output['inventary'] = array();
    $output['weapons']   = array();
    $level               = (int) $_POST['level'];
    
    if(!$level || !$thisPlayerID)
        die();
        
    $data = Db::q('SELECT * FROM '._DB_PREFIX_.'saves WHERE id_player = '.(int) $thisPlayerID.' AND level = '.$level.' LIMIT 1');
    if(!sizeof($data))
        die();
     
    //Parse health
    $output['health'] = $data[0]['health'];    
        
    //Parse inventary
    $inv = explode(";", $data[0]['inventary']);
    $i = 0;
    foreach($inv as $key => $val)
    {
        if(empty($val))
            continue;
    
        $element = explode(":", $val);
        $output['inventary'][$i]['item']        = trim($element[0]);
        $output['inventary'][$i]['value']       = (int) trim($element[1]);
        $output['inventary'][$i]['description'] = trim($element[2]) != "0" ? trim($element[2]) : trim($element[0]);
        $i++;
    }
    
    //Parse weapons
    $weap = explode(";", $data[0]['weapons']);
    $x = 0;
    foreach($weap as $z => $sval)
    {
        if(empty($sval))
            continue;
        
        $element = explode(":", $sval);
        $output['weapons'][$x]['weaponId']    = (int) trim($element[0]);
        $output['weapons'][$x]['ammo']        = (int) trim($element[1]);
        $x++;
    }
    
    print json_encode($output);
    die();
}



/*
==========================================
Save inventary
==========================================
*/
if(Tools::isSubmit('saveInventary')) {

    $inventary   = $_POST['inventary'];
    $weapons     = $_POST['weapons'];
    $level       = $_POST['level'];
    $health      = $_POST['health'];

    if(!$level || !$health )
        die();
        
    $already = Db::q('SELECT * FROM '._DB_PREFIX_.'saves WHERE id_player = '.(int) $thisPlayerID.' AND level = '.(int) $level.' LIMIT 1');
    if(!sizeof($already))
    {
        //Insert new save
        Db::q('INSERT INTO '._DB_PREFIX_.'saves 
        (id_player, level, health, inventary, weapons) 
        VALUES('.(int) $thisPlayerID.', '.(int) $level.', '.(int) $health.', "'.mysql_real_escape_string($inventary).'", "'.mysql_real_escape_string($weapons).'")');
        print 1;
        die();
    }
    else
    {
        //Update save
        Db::q('UPDATE '._DB_PREFIX_.'saves 
            SET inventary = "'.mysql_real_escape_string($inventary).'", 
            weapons = "'.mysql_real_escape_string($weapons).'",
            health  = '.(int) $health.'
            WHERE id_player = '.(int) $thisPlayerID.' 
                AND level = '.(int) $level.' 
            LIMIT 1');
        print 2;
        die();
    }
}


?>