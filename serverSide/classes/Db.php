<?php

/* 2 classi: general db e MYSQL db
 *
 *
 */

if(file_exists("../config/settings.inc.php"))
	include_once("../config/settings.inc.php");
include_once("Tools.php");

/*GENERAL DB*/
abstract class Db {

	protected $db_server;
	protected $db_user;
	protected $db_password;
	protected $db_name;
	protected $_link;
	protected $result;
	private static $instance;
	
	
	public function __construct()
	{
		$this->db_server = _DB_HOST_;
		$this->db_user = _DB_USER_;
		$this->db_password = _DB_PASSWORD_;
		$this->db_name = _DB_NAME_;
		$this->connect();
	}
	
	
	public static function getInstance()
	{
		if(!isset(self::$instance))
			self::$instance = new MySQL();
		return self::$instance;
	}
	
	
	public function __destruct()
	{
		$this->disconnect();
	}

/*******************
 * METODI ASTRATTI *
 *******************/

/*Connette/disconnette dal database*/ 
abstract public function connect();
abstract public function disconnect();

/*Seleziona un database*/
abstract public function selectDb($db_name);

/*Esegue una query e ritorna un array*/
abstract public function executeA($query, $to_array = true);
 
/*Ricava l'id inserito dall'ultima query*/
//abstract public function getLastId(); 



/*Esegue una query 
 *se to_array restituisce in array 
 *altrimenti in risorsa
 */
static public function q($query, $to_array = true)
{
	return Db::getInstance()->executeA($query, $to_array);
}


static public function getARow($query)
{
	return Db::getInstance()->getRow($query);
}

static public function getLastID()
{
	return Db::getInstance()->lastInID();
}

}











/*MYSQL*/
class MySQL extends Db {
	
	
	public function connect()
	{
		if(!$this->_link = mysql_connect($this->db_server, $this->db_user, $this->db_password))
			die(/*language::tl(*/"Impossibile connettersi al database")/*)*/;
		else
		if(!$this->selectDb($this->db_name))
			Tools::displayError("Impossibile selezionare il database");
		else
		return $this->_link;
		
		/*SUPPORTO UTF8*/
	}
	
	
	public function selectDb($db_name)
	{
		return mysql_select_db($db_name, $this->_link);
	}
	
	
	public function disconnect()
	{
		if($this->_link)
			mysql_close($this->_link);
		$this->_link = false;
	}
	
	
	/* Esegue una query
	 * Param: query
	 * Return: array
	 */
	public function executeA($query, $to_array = true)
	{
			$this->result = false;
			if($this->_link AND $this->result = mysql_query($query, $this->_link))
			{
				if(_DB_DEBUG_)
					$this->displayMySQLError();
				if(!$to_array)
					return $this->result;

				$fetched_result = array(); /*MYSQL FETCH ASSOC NON FUNZIONA*/
				while($row = mysql_fetch_assoc($this->result))
					$fetched_result[] = $row;
				
				return $fetched_result;
			}
			else if(_DB_DEBUG_)
				$this->displayMySQLError($query);
			
			return false;
	}
	
	
	public function getRow($query)
	{
		$this->result = false;
		if($this->_link)
		if($this->result = mysql_query($query, $this->_link))
		{
			if(_DB_DEBUG_)
			 $this->displayMySQLError();
			return mysql_fetch_assoc($this->result);
		}
		if(_DB_DEBUG_)
			 $this->displayMySQLError();
		
		return false;
	}
	
	
	
	public function displayMySQLError($query = false)
	{
		if (_DB_DEBUG_ AND mysql_errno())
		{
			if ($query)
				die(Tools::displayError(mysql_error().'<br /><br /><pre>'.$query.'</pre>'));
			die(Tools::displayError((mysql_error())));
		}
	}

	public function	lastInID()
	{
		if ($this->_link)
			return mysql_insert_id($this->_link);
		return false;
	}
	
	/*
	function pSQL($string, $htmlOK = false)
{
	if (_PS_MAGIC_QUOTES_GPC_)
		$string = stripslashes($string);
	if (!is_numeric($string))
	{
		$string = _PS_MYSQL_REAL_ESCAPE_STRING_ ? mysql_real_escape_string($string) : addslashes($string);
		if (!$htmlOK)
			$string = strip_tags(nl2br2($string));
	}
		
	return $string;
}



	public function	NumRows()
	{
		if ($this->_link AND $this->_result)
			return mysql_num_rows($this->_result);
	}
	

	
	public function	Affected_Rows()
	{
		if ($this->_link)
			return mysql_affected_rows($this->_link);
		return false;
	}
	*/

} 






?>