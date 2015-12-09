<?php

define("__BASE_URI__", "");
define ("DB_PREFIX", "db");

if(file_exists("../config/defines.inc.php"))
include_once("../config/defines.inc.php");

class Tools {

	/*Variabili*/
	
	
	
	/*
	* Rimuove una directory e subdirectory
	* Param: nome directory $dirname
	*/
	static public function deleteDirectory($dirname = NULL)
	{
		if($dirname == NULL)
			return 0;
		$files = scandir($dirname);
		foreach ($files as $file)
			if ($file != '.' AND $file != '..')
			{
				if (is_dir($file))
					self::deleteDirectory($file);
				elseif (file_exists($dirname.$file))
					unlink('/'.$dirname.$file);
				else
				{
					self::displayError("<p>Impossibile eliminare /".$dirname.'/'.$file.'</p>');
				}
			}
		rmdir($dirname);
		return 1;
	}

	
	

   /**
	* Controlla se un submit e stato premuto
	* Param: submit 
	*/
	static public function isSubmit($submit)
	{
		return (
			isset($_POST[$submit]) OR isset($_POST[$submit.'_x']) OR isset($_POST[$submit.'_y'])
			OR isset($_GET[$submit]) OR isset($_GET[$submit.'_x']) OR isset($_GET[$submit.'_y'])
		);
	}

	
	
	/**
	* Annulla un submit
	* Param: submit = nome submit
	*/
	static public function unsetGet($page = NULL, $get)
	{
		if(isset($_GET[$get]))
			$_GET[$get] = '';
		
			return 0;
	}
	
	
	
	
	/**
	* Redirect su altra pagina
	* Param: $url = indirizzo, $baseUri = radice
	*/
	static public function redirect($url, $baseUri = "")
	{
					//cosa è??
		if (isset($_SERVER['HTTP_REFERER']) AND ($url == $_SERVER['HTTP_REFERER']))
			header('Location: '.$_SERVER['HTTP_REFERER']);
		else
			header('Location: '.$baseUri.$url);
		exit;
	}
	
	
	
	/**
	* Cerca un file e ne restituisce la path
	* Param: $fileName = nome file, $uri = path
	* Return: array => path e nome del file trovato
	*/
	static public function findFile($fileToFind = null, $uri = null)
	{	
		static $curr_path;
		$curr_path = $uri;
		if(is_dir($uri)) 
		{
			//sanitize($str, "path" oppure "sql" "mail")
			$files = scandir($uri = self::finalizeWithBackslash($uri));
			foreach($files as $file)
			{
				if($file != '.' AND $file != '..')
				{	
					if($file == $fileToFind)
					return 1;
					
					if(is_dir($uri.$file))
					{		
						if(self::findFile($fileToFind, $uri.$file))
						{
							//Se lo trova
							return $results = array("path" => $curr_path."\\",
													"filename" => $fileToFind);
						}
					}
				}
			}
		}
		else return 0;
	}
	
	
	
	
	//Ricava il contenuto di un file
	function get_file_content($file = null)
	{	
			$text = NULL;
			
			if(!$file = fopen($file, "r"))
			return 0;

			    while(!feof($file))
				{
		     	  $text .= fgets($file);
				}

			fclose($file);
			return $text;
	}
	
	
	
	static public function isEmpty($field)
	{
		return $field === '' OR $field === NULL;
	}
	
	
	
	/**
	* Finalizza la path con la backslash /
	* Param: $path = stringa percorso
	*/
	static private function finalizeWithBackslash($path)
	{
		if($path != null AND $path != "")
		{
			$path = str_replace('\\', '/', $path);
			if($path[strlen($path) - 1] != "/")
			{
				$finalized = $path."/";
				return $finalized;
			}
			else return $path;
		}
		else
		return $path;
	}
	
	
	
	/**
	* Ricava l'estensione di un file
	* Param: $file = file
	*/
	static public function getFExt($file)
	{
		if(is_file($file))
		$file_info = pathinfo($file);
		else return 0;
		return $file_info['extension'] ? $file_info['extension'] : 0;
	}
	
	
	
	
	
	static public function displayError($error = NULL, $color = "red")
	{
		if(isset($error) OR $error != null)
		echo '<font color="'.$color.'">'.$error.'</font></ br>';
		else echo '<font color="red">Errore!</font></ br>';
	}
	
	
	
	
	
	static public function displayMessage($message = NULL, $color = "green")
	{
		if(isset($message) OR $message != null)
		echo '<font color="'.$color.'">'.$message.'</font></ br>';
	}
	
	
	
	
	/* Ricava la directory principale 
	 * 
	 */
	static public function root() //admin/example/images/
	{
		/*SERVER HTTP_HOST*/
	}
	
	
	/*Inserisce i risultati di una query array in una tabella standard*/
	static public function inTable($resource, $style = 1, $buttons = false, $h_color = '#DDD', $c_color = 'white')
	{
		//Fornisce direttamente le funzione per eliminare modificare o aggiungere contenuti
		$jquery .= '<script type="text/javascript>
					
					</script>"';
		if(isset($resource))
		{
			if(is_array($resource))
			{
				$table = false;
				foreach($resource as $key => $val);
				//crea tabella
				return $table;
			}
			else
			{
				if(is_resource($resource))
				displayError("</br>Errore! La funzione si aspetta una array.</br>");
				return false;
			}
		}
		else
		{
			displayError("</br>Errore! Nessun contenuto.</br>");
			return false;
		}
	}

	
	
	
	
	/**
	* Sanitize a string
	*
	* @param string $string String to sanitize
	* @param boolean $full String contains HTML or not (optional)
	* @return string Sanitized string
	*/
	static public function safeOutput($string, $html = false)
	{
	 	if (!$html)
			$string = @htmlentities(strip_tags($string), ENT_QUOTES, 'utf-8');
		return $string;
	}
	
	
	
	static public function getExactTime()
	{
		return time()+microtime();
	}
	
	
	
	static public function dateITFormat($data)
	{ 
		$aa=substr($data, 0, 4); 
		$mm=substr($data, 4, 2); 
		$gg=substr($data, 6, 8); 
		$datareformat="$gg"."/"."$mm"."/"."$aa"; 
		return $datareformat; 
	}
	
	
	static function substr($str, $start, $length = false, $encoding = 'utf-8')
	{
		if (is_array($str))
			return false;
		if (function_exists('mb_substr'))
			return mb_substr($str, intval($start), ($length === false ? self::strlen($str) : intval($length)), $encoding);
		return substr($str, $start, ($length === false ? strlen($str) : intval($length)));
	}
	
	
	
	static public function createKey($lenght = NULL)
	{
		$lenght == NULL ? $lenght = 10: $lenght = $lenght;
		$str = 'abcdefghijkmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		while($lenght--)
			$key .= self::substr($str, mt_rand(0, self::strlen($str) - 1), 1);
		return $key;
	}
	
	
	
	static function strlen($str)
	{
		if (is_array($str))
			return false;
		$str = html_entity_decode($str, ENT_COMPAT, 'UTF-8');
		if (function_exists('mb_strlen'))
			return mb_strlen($str, 'utf-8');
		return strlen($str);
	}
	
	
	
	static public function isAllowedExt($file, $allowedExts) 
{
	if(!Validate::isFileName($file) OR !is_array($allowedExts))
		return false;
	$extension = pathinfo($file, PATHINFO_EXTENSION);
	return $extension;
	if(in_array($extension, $allowedExts))
		return true;
	return false;
}	
	
}


/*
	static public function safeOutput($string, $html = false)
	{
	 	if (!$html)
			$string = @htmlentities(strip_tags($string), ENT_QUOTES, 'utf-8');
		return $string;
	}

	static public function htmlentitiesUTF8($string, $type = ENT_QUOTES)
	{
		if (is_array($string))
			return array_map(array('Tools', 'htmlentitiesUTF8'), $string);
		return htmlentities($string, $type, 'utf-8');
	}

	static public function htmlentitiesDecodeUTF8($string)
	{
		if (is_array($string))
			return array_map(array('Tools', 'htmlentitiesDecodeUTF8'), $string);
		return html_entity_decode($string, ENT_QUOTES, 'utf-8');
	}

	static public function safePostVars()
	{
		$_POST = array_map(array('Tools', 'htmlentitiesUTF8'), $_POST);
	}

	
	static public function deleteDirectory($dirname)
	{
		$files = scandir($dirname);
		foreach ($files as $file)
			if ($file != '.' AND $file != '..')
			{
				if (is_dir($file))
					self::deleteDirectory($file);
				elseif (file_exists($file))
					unlink($file);
				else
					echo 'Unable to delete '.$file;
			}
		rmdir($dirname);
	}


	static public function displayError($string = 'Fatal error', $htmlentities = true)
	{
		global $_ERRORS;

		//if ($string == 'Fatal error') d(debug_backtrace());
		if (!is_array($_ERRORS))
			return str_replace('"', '&quot;', $string);
		$key = md5(str_replace('\'', '\\\'', $string));
		$str = (isset($_ERRORS) AND is_array($_ERRORS) AND key_exists($key, $_ERRORS)) ? ($htmlentities ? htmlentities($_ERRORS[$key], ENT_COMPAT, 'UTF-8') : $_ERRORS[$key]) : $string;
		return str_replace('"', '&quot;', stripslashes($str));
	}


	static public function dieObject($object, $kill = true)
	{
		echo '<pre style="text-align: left;">';
		print_r($object);
		echo '</pre><br />';
		if ($kill)
			die('END');
		return ($object);
	}

	
	static public function d($object, $kill = true)
	{
		return (self::dieObject($object, $kill));
	}


	static public function p($object)
	{
		return (self::dieObject($object, false));
	}


	*/
	
?>