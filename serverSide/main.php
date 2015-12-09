<?php

header('Content-Type: text/html; charset=utf-8');

/*
==========================================
INI SET
==========================================
*/
@ini_set('display_errors', 'off');
//error_reporting(true);
@ini_set('default_charset', 'utf-8');


/*
==========================================
CONFIG
==========================================
*/
include_once('config/defines.inc.php');
include_once('config/settings.inc.php');


/*
==========================================
CLASSES
==========================================
*/
include_once('classes/Db.php');
include_once('classes/Validate.php');
include_once('classes/Tools.php');
include_once('classes/FormToDb.class.php');


/*
==========================================
LIBS
==========================================
*/
include_once('libs/PHPMailer_5.2.1/class.phpmailer.php');


?>