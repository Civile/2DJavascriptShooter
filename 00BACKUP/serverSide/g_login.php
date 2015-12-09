<?php


include_once('main.php');


//Developing vars
$showErrorList = true;
if(session_id() == '')
    session_start();

    
/*
==========================================
AJAX -> Login
==========================================
*/
if(Tools::isSubmit('login')) { 
    
    $loginType      = isset($_POST['loginType']) ? $_POST['loginType'] : null;
  
    //Switch login type
    if($loginType === 'normal')
        normalLogin($_POST);
    else if($loginType === 'fblogin')
        fbLogin($_POST);
    
    exit();
}


/*
==========================================
AJAX -> Signin
==========================================
*/
if(Tools::isSubmit('signin')) {
    signIn($_POST);
}


/*
==========================================
AJAX -> FB LOGIN
==========================================
*/
function fbLogin($POSTdata) {

    $uname          = null;
    $upass          = null;
    $uid            = null;
    $error          = array();
    
    /*
    ==========================
    1° step : get/validate data
    ===========================
    */
    //Get username
    if(isset($POSTdata['username']))
        $uname = $POSTdata['username'];
    else $error[] = 'No username';

    if($uname)
        if(!Validate::isName($uname))
            $error[] = 'Invalid username';
    
    //Get fb-id
    if(isset($POSTdata['userfbid']))
         $uid = $POSTdata['userfbid'];
    else $error[] = 'No userfbid';
    
    if($uid)
        if(!Validate::isInt($uid))
            $error[] = 'Invalid fb-id';  


    //Check for errors
    if(sizeof($error))
    {
        print json_encode($error);  // <- return data to ajax call
        exit();
    }
    
    
    
    /*
    ======================
    2° step : handle data
    ======================
    */
    //Evaluate data
    $c = Db::q('SELECT * FROM '._DB_PREFIX_.'users WHERE playernick = "'.mysql_real_escape_string($uname).'" AND playerid = '.$uid.' LIMIT 1');            
    //New user
    if( !sizeof($c[0]) )
    {
    
        $id = null;
        
       //MD5
       Db::q('INSERT INTO '._DB_PREFIX_.'users 
            (playernick, playerid, playermail, playerpassword) 
			VALUES("'.$uname.'", "'.$uid.'")');
       $id = Db::getARow('SELECT id FROM '._DB_PREFIX_.'users WHERE playernick = '.$uname.' AND playerid = '.$uid.' LIMIT 1');
    }
    
    
    /*
    ======================
    3° step : open session
    ======================
    */
    session_start();
    $_SESSION['username'] = $uname;
    $_SESSION['userid'] = $id;
}







/*
==========================================
AJAX -> Normal login
==========================================
*/
function normalLogin($POSTdata) {
    
    //Init variables
    $uname          = null;
    $upass          = null;
    $umail          = null;
    $uid            = null;
    $error          = array();
    $data           = array();
    $output         = array();
    
    /*
    ==========================
    1° step : get/validate data
    ===========================
    */
    //Get usermail
    if(isset($POSTdata['usermail']))
        $umail = $POSTdata['usermail'];
    else $error[] = 'No usermail';

    if($umail)
        if(!Validate::isEmail($umail))
            $error[] = 'Invalid usermail';
    
    //Get password
    if(isset($POSTdata['userpassword']))
         $upass = $POSTdata['userpassword'];
    else $error[] = 'No userpassword';
   
    if($upass)
        if(!Validate::isPasswd($upass))
            $error[] = 'Invalid password';
    
    if(sizeof($error)) {
        $output['success'] = 'invalid fields';
        print json_encode($output);
        exit();
    }
    
    
    /*
    ======================
    2° step : handle data
    ======================
    */
    $data = Db::q('SELECT * FROM '._DB_PREFIX_.'users WHERE playermail = "'.mysql_escape_string($umail).'" AND playerpassword = "'.md5($upass).'" LIMIT 1');
    if(!sizeof($data)) {
        $output['success'] = 'invalid user 1';
        print json_encode($output);
        die();
    }
    
    if($data[0]['playernick'])    
         $output['success'] = 'success';
    else
    {
        $output['success'] = 'invalid user 2';
        print json_encode($output);
        die();
    }
    
    //Start session
    $_SESSION['playernick'] = $data[0]['playernick'];
    $_SESSION['playerid']   = $data[0]['id'];
    $_SESSION['playermail'] = $umail;
    $_SESSION['ltype'] = 'normal';
            
    //Return data
    print json_encode($output);
    die();
}



/*
==========================================
AJAX -> Signin
==========================================
*/
function signIn($POSTdata) {
    
    //Init variables
    $unick          = trim($POSTdata['playernick']);
    $upass          = trim($POSTdata['playerpassword']);
    $umail          = trim($POSTdata['playermail']);
    $data           = array();
    $output         = array();
    
    //Check password copy
    if($upass != $POSTdata['playerpasswordcpy']) {
        print 1;
        exit();
    }
    
    
    $check = Db::q('SELECT * FROM '._DB_PREFIX_.'users WHERE playermail = "'.mysql_escape_string($umail).'" LIMIT 1');
    if(sizeof($check) >= 1)
    {
        print 2;
        die();
    }

    
    
    
    $error = array();
    
    if(!Validate::isName($unick))
        $error[] = 'Invalid nickname';
    if(!Validate::isPasswd($upass))
        $error[] = 'Invalid password';
    if(!Validate::isEmail($umail))
        $error[] = 'Invalid email';
        
        
    //Validate
    if(sizeof($error))
    {
        print 0; 
        die();
    }
    
    
    /*
    ==========================
    2° step : save data
    ===========================
    */
    Db::q('INSERT INTO '._DB_PREFIX_.'users (playernick, playermail, playerpassword) VALUES("'.mysql_real_escape_string($unick).'", "'.mysql_real_escape_string($umail).'", "'.md5($upass).'")');
    
    $check = Db::q('SELECT * FROM '._DB_PREFIX_.'users WHERE playermail = "'.mysql_real_escape_string($umail).'"');
    if(!sizeof($check))
    {
        print 0;
        die();
    }
    
    Db::q('INSERT INTO '._DB_PREFIX_.'points 
          (id_player, points)
          VALUES("'.$check[0]['id'].'", "0")');
            
    //Initialize saves data
    Db::q('INSERT INTO '._DB_PREFIX_.'saves 
          (id_player, points, level, health, inventary)
          VALUES("'.$check[0]['id'].'", "0", "1", "100", 0)');
        
    print 3;
    die();
}






function sendEmail($text) 
{
    
    $mail             = new PHPMailer(); 
    
    $body             = file_get_contents('mails/r_confirm.html');
    $body             = eregi_replace("[\]",'',$body);

    $mail->AddReplyTo("evanmarlowe@hotmail.it","Civile");
    $mail->SetFrom('evanmarlowe@hotmail.it', 'Civile');
        
    $address = $POSTdata['playermail'];
    $mail->AddAddress($address, $POSTdata['playernick']);

    $mail->Subject    = "Confirm";

    $mail->AltBody    = $text;

    $mail->MsgHTML($body);

    $mail->Send();
}



?>