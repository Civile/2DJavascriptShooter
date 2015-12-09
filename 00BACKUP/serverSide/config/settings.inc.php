<?php

/* File di configurazione
 * Setting delle sessioni, apertura e sicurezza
 * Database mySQL
 * Cookies sicurezza
 * Autore: Edoardo Sebastiano Casella
 **/

/*Database**/
define("_DB_PREFIX_",		"g_");
define("_DB_HOST_",			"localhost");
define("_DB_USER_",			"edoardoc");
define("_DB_PASSWORD_",		"IOINFINITO88");
define("_DB_NAME_",			"edoardoc_db");
define("_DB_DEBUG_",		1);


/*Sessions**/ //session_save_path();
define("_SESSION_TIMEOUT_",		300); //5'
define("_SESSION_TIMEOUT_REDIRECT_URL_",		'lost-session.php');

//session_cache_expire( 20 );
session_start();

/*
session_regenerate_id(); //abilita la rigenerazione continua dell'id di sessione
if ( isset($_SESSION["timeout"]) ) {
    $sessionTTL = time() - $_SESSION["timeout"]; // calcolare il "tempo di vita" della sessione
    if ($sessionTTL > _SESSION_TIMEOUT_) {
        session_destroy();
		session_unset();
		header('location:'._SESSION_TIMEOUT_REDIRECT_URL_);
    }
}
$_SESSION['timeout'] = time();
*/

?>