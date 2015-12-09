<?php

/*
==========================================
MACROS
==========================================
*/
 
$current_dir = dirname(__FILE__);
$root =  str_replace("www", "test", $_SERVER['DOCUMENT_ROOT']);

/*General settings*/
define('_SITE_TITLE_',		'platform');
define('_LOGO_',			_SITE_TITLE_);
define('_DOMAIN_LINK_',		'');

/*Server info*/
define('_HOST_', 'http://'.$_SERVER['HTTP_HOST'].'/');

/*Directories*/
define('_ROOT_DIR_',			'');
define('_CLASSES_DIR_',			_ROOT_DIR_.'/classes/');
define('_IMAGES_DIR_',		    _ROOT_DIR_.'images/');
define('_IMAGES_HEADERS_DIR_',  _IMAGES_DIR_.'headers/');


//Windows hosting -> public folder !!!
define('_FT_IMAGES_DIR_',	'public/images/ft/'); 
define('_CV_FILES_DIR_',	'public/files/cv/');  
define('_FILES_TEMP_DIR_',	'public/files/temp/');



define('_CONFIG_DIR_', 		_ROOT_DIR_.'config/');
define('_CSS_DIR_', 		_ROOT_DIR_.'css/');
define ('_MAILS_DIR_',		_ROOT_DIR_.'mails/');
define('_ADMIN_DIR_', 		_ROOT_DIR_.'/admin/');
define('_JS_DIR_', 			_ROOT_DIR_.'js/');
define('_LIBS_DIR_',		_ROOT_DIR_.'libs/');
define('_UPLOADS_DIR_',		_ROOT_DIR_.'f_uploads/');
define('_JPHP_FUNCTIONS_',	_ROOT_DIR_.'j_php_functions/');
define('_THEMES_DIR_', 		_ROOT_DIR_.'theme/');

//EXT. LIBS
define('_PHPTHUMB_DIR_',	_LIBS_DIR_.'PHPThumb/');
define('_PHPUPLOADER_DIR_',	_LIBS_DIR_.'PHPUploader/');


//Uploads allowed extensions and sizes
define("_PHOTO_MAX_WEIGHT_",		5120000); //5mb
define("_FILE_MAX_WEIGHT_",			3242880); //3mb

$phAllowedExts = array("jpg", "jpeg", "png", "gif", ".jpg", ".jpeg", ".png", ".gif"); //For images
$fileAllowedExts = array("doc", "docx", "pdf", "odt", ".doc", ".docx", ".pdf", ".odt"); //For reading files
?>
