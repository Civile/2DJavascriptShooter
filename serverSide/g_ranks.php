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







/*
==========================================
AJAX - GET RANKS
==========================================
*/

if( Tools::isSubmit('getRank') ) {

    

    //Init variables

    $data       = null;

    $html       = null;

    $img        = null;

    $position   = null;

    

    //Get users points | info

    $data = Db::q('SELECT * FROM '._DB_PREFIX_.'points ORDER BY points DESC');

            

    if( $data == NULL ) {

        print '<div style="margin:15px; font-size:11px; color:white;">No data</div>';

        exit();

    }

    

    

    //Format data

    $html .= '<table><tr style="background:white; color:black;"><td>Nickname</td><td>Points</td><td>Map</td><td>when</td></tr>';

    

    foreach($data as $key => $value) {

        

        if($thisPlayer != null)

            if($value['playernick'] === $thisPlayer) {

                $position = $key + 1;

                $points = $value['points'];

            }

        //Check photo

        if(file_exists('images/phs/us_'.$value['id'].'-mini.png'))

            $img = 'images/phs/us_'.$value['id'].'-mini.png';

        else $img = 'images/phs/nophoto-mini.png';

        

        //Format date

        $date = $value['date'];

//       $formattedDate = date( 'Y-m-d', $date );

        

        //Add row

        $html .= '<tr><td>'.$value['id_player'].'</td><td>'.$value['points'].'</td><td>'.$value['mapTitle'].'</td><td>'.$date.'</td></tr>';

    }

    $html .= '</table>';

    

    

    //Prepend thisPlayer position

    if($position != null)

        $html = '<div style="text-align:right; margin-bottom:5px; font-size:11px; font-family:cgothic;">Your position: '.$position.' with '.$points.' points </div>'.$html;

    

    //Return data

    print $html;

    exit();

}













?>