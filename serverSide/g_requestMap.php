<?php

include_once('main.php');


if(isset($_SESSION['playernick']))
    $thisPlayer = $_SESSION['playernick'];
else $thisPlayer = null;

if(isset($_SESSION['playerid']))
    $thisPlayerID = $_SESSION['playerid'];
else $thisPlayerID = null;



$gmq = get_magic_quotes_gpc();

$test = false;
if($test) { $_POST['mapIndex'] = 1; }


if(Tools::isSubmit('requestMap') || $test) {

    $mapIndex = ($_POST['mapIndex'] == null ? 1 :$_POST['mapIndex']);
    $jsonData = array();    
    $output = array();

    //Get map data    
    $data = Db::q('SELECT data FROM '._DB_PREFIX_.'maps WHERE mapIndex = "'.$mapIndex.'" LIMIT 1');
    if(sizeof($data[0]['data'])) 
    {
        
        $val = $data[0]['data'];
        
        //removePar
        $val = str_replace('(', '', $val);
        $val = str_replace(')', '', $val);
        $val = str_replace('printBlock', '', $val);
        $val = str_replace(' ', '', $val);
        
        //Get single data string 
        $mDataArray = preg_split ( '/\s*?\;\s*?/', $val, -1, PREG_SPLIT_NO_EMPTY ); 
        
        foreach($mDataArray as $k => $val) {
            
            if(empty($val))
                continue;

            $mValArray  = preg_split("/[,]+/", str_replace('\'', '', $val));
                
            $output[$k] = array();          //The loader expects data in this order
            $output[$k]['x']                = (int) trim($mValArray[0]);
            $output[$k]['y']                = (int) trim($mValArray[1]);
            $output[$k]['width']            = (int) trim($mValArray[2]);
            $output[$k]['height']           = (int) trim($mValArray[3]);
            $output[$k]['type']             = trim($mValArray[4]);
            $output[$k]['id']               = trim($mValArray[5]);
            $output[$k]['zindex']           = (int) trim($mValArray[6]);
            
            //Load interactions | additional info
            $mValArray[7]                   = trim($mValArray[7]);

            if($mValArray[7] != 'null') 
            {
                $interactions = array();
                
                //Get properties
                if(preg_match_all('/\*(.*?)\*/', $mValArray[7], $properties)) {
                    $prps = $properties[1];
                    
                    //Then get values
                    if(preg_match_all('/\<(.*?)\>/', $mValArray[7], $values))
                        $vals = $values[1];
                     
                    foreach($prps as $x => $pval)
                        if($vals[$x] != null)
                            $interactions[trim($pval)] = trim($vals[$x]);

                    $output[$k]['interactions'] = $interactions;
                }
            }
            else $output[$k]['interactions'] = null;
        }
    }
    print stripslashes(json_encode($output));
    exit();
}



?>