<?php

	/*
	 NAME
		PostToDb.class.php
		Copyright (C) 2012 Sebastiano Edoardo Casella
		License http://opensource.org/licenses/gpl-2.0.php GNU General Public License (GPL)
		Last update: 21/08/2012 - 00:20 from: Sebastiano Edoardo Casella
		Author email: <evanmarlowe@hotmail.it>
	 
	 INFO
		Simplify HTML "form to database" process, including optional validating methods
		[!]Support mySQL db connection
		[!]Can execute queries: $object->q('query');
		[!!]Field names must be the same as the columns
		[!!]For now it supports only POST
	
	BUGS
		preg_match error (sometimes with some methods): Compilation failed: invalid UTF-8 string (when "\ui added" ) ??
		* For other bugs or suggestions please report to: evanmarlowe@hotmail.it
	
	ABILITIES
		Support update & insert mysql commands
		Ability to skip unwanted fields with $toIgnore property
		Ability to validate the fields dynamically through a list of integrated methods (see the class)
	 *******************************************************************************/

define('_DBINS_DB_DEBUG_', false);	

class FormToDb {

	//Fields to insert: $key/row => $value
	private $fields = array();
	public $invalidFields = array();
	
	public $charSet = 'UTF-8';
	
	//Table of the DB
	private $table;
	
	private $post = array();
	
	//Errors's array
	private $error = array();
	
    private $MD5Encode = array();
    
	//Rows and values of the table
	private $rows = '';
	private $values = '';
	
	//Post fields to ignore (like buttons etc.)
	public $toIgnore = array();
	
	//Validating methods
	public $VMethods = array();
	
	//Std method - see ::getFromPostV
	public $stdMethod = 'isMessage';
	
	
	//DB connection
	protected $db_server;
	protected $db_user;
	protected $db_password;
	protected $db_name;
	protected $_link;
	protected $result;
	private static $instance;
	
	
	
	public function __construct($dbHost, $dbUser, $dbPasswd, $dbName, $table = '')
	{
		if(!self::isMessage($table) OR empty($table))
		{
			$this->memError('Invalid or null table name');
			return false;
		}
		$this->db_server = $dbHost;
		$this->db_user = $dbUser;
		$this->db_password = $dbPasswd;
		$this->db_name = $dbName;
		$this->table = $table;
		return true;
	}
	
	
	public function chainField($key, $value)
	{
		if(!self::isName($key) AND !self::isMessage($value)) {
			$this->memError('Invalid key or value');
			return false;
		}
		$this->fields[$key] = $value;
		return true;
	}
	
    
    public function toMD5($postKey) 
    {
        if($postKey == null)
            return;
            
        $this->MD5Encode[$postKey] = true;
    }
    
	
	//Get keys and values directly from $_POST array
	public function getFromPost($postArray = NULL)
	{
		if(empty($postArray))
			return $this->memError('Null postArray in getFromPost function');
		foreach($postArray as $k => $val)
			if(!in_array($k, $this->toIgnore))
				$this->chainField(mysql_real_escape_string($k), mysql_real_escape_string(htmlentities($val, ENT_QUOTES, $this->charSet)));
	}
	
	
	//Get from post and validate
	//$methods must be in the ORDER of $postArray values (see Validate.php for methods)
	public function getFromPostV($postArray = NULL, $showFirstError = FALSE)
	{
		if(!is_array($postArray) OR !is_array($this->VMethods) OR !is_array($this->toIgnore)) {
			$this->memError('Invalid arguments in getFromPostV');
			return false;
		}
		
		$validate = new FormToDb($this->db_server, $this->db_user, $this->db_password, $this->db_name);
		$index = 0;
		foreach($postArray as $k => $val)
		{
			if(empty($this->VMethods[$index])) //if there are no more methods...
				$this->VMethods[$index] = $this->stdMethod;
			if(in_array($k, $this->toIgnore))
				continue;
				if(method_exists($validate, $this->VMethods[$index]) AND call_user_func(array('FormToDb', $this->VMethods[$index]), trim(htmlentities($val, ENT_QUOTES, $this->charSet))))
					$this->chainField(mysql_real_escape_string(trim($k)), mysql_real_escape_string(trim($val)));
				else 
				{
				
					!isset($this->invalidFields['null']) ? $this->invalidFields['null'] = 1 : NULL; //this array contanins elements
					$this->invalidFields[$k] = $val;
					if($showFirstError == TRUE)
						die('<div>[ERROR]:&nbsp;<b>'.$k.'</b>&nbsp;|&nbsp;'.$this->VMethods[$index].'&nbsp;=>&nbsp;'.$val.' || in '.$index.' validating method</div>');
				}
			$index++;
		}
		if( isset($this->invalidFields['null']) )
			if($this->invalidFields['null'] == 1) 
			{
				$this->memError('Invalid fields detected!');
				return false;
			}
		return true;
	}
	
	
	
	public function showFields($die = FALSE)
	{
		foreach($this->fields as $k => $val)
			print $k.'->'.$val.'<br>';
		if($die)
			die();
	}
	
	
	
	public function getFields()
	{
		return $this->fields;
	}
	


	public function getInvalidFields()
	{
		return $this->invalidFields;
		
	}
	
	
	public function showInvalidFields()
	{
		foreach($this->invalidFields as $k => $val)
			print $k.' => '.$val;
	}
	
	
	
	public function save()
	{
		if(empty($this->fields)) {
			$this->memError('Null fields array in ->save function');
			return false;
		}

		$fSize = sizeof($this->fields);
		foreach($this->fields as $k => $val) //Get rows and values from fields array
		{
			$fSize--;
			$this->rows .= ' '.mysql_real_escape_string($k);
			$fSize > 0 ? $this->rows .= ',' : NULL;
			//...values
            if(isset($this->MD5Encode[$k]))
                $this->values .= ' "'.md5($val).'"';
            else
			    $this->values .= ' "'.mysql_real_escape_string($val).'"';
			$fSize > 0 ? $this->values .= ',' : NULL;
		}
	
		$this->q('INSERT INTO '.$this->table.'('.mysql_real_escape_string($this->rows).')
		VALUES('.$this->values.')');
	}
	
	
	
	public function update($colName = 'id', $colVal = NULL)
	{
		$setCl = null;
		
		if(empty($this->fields) OR !self::isDbColName($colName) OR empty($colName) OR empty($colVal) OR !self::isMessage_HTML($colVal)) {
			$this->memError('Null fields array in ->update function');
			return false;
		}
		$fSize = sizeof($this->fields);
		foreach($this->fields as $k => $val)
		{
			$fSize--;
			$setCl .= mysql_real_escape_string($k).' = ';
			empty($val) ? $setCl .= '""' : $setCl .= '"'.mysql_real_escape_string($val).'"';
			$fSize > 0 ? $setCl .= ', ' : NULL;
		}
		$this->q('UPDATE '.$this->table.' SET '.$setCl.' WHERE '.mysql_real_escape_string($colName).' = "'.mysql_real_escape_string($colVal).'" LIMIT 1');
	}
	
	
	
	//Get $row value WHERE => (string) $whereCl 
	public function getRowWhere($row = 'id', $whereCl = '', $limit = 1)
	{
		if(empty($whereCl) OR !is_string($whereCl) OR !self::isUnsignedInt($limit) OR !self::isDbColName($row))
			return false;
		$limit >= 1 ? $res = $this->q('SELECT '.$row.' FROM '.$this->table.' '.$whereCl.' LIMIT '.$limit.'') : $res = Db::q('SELECT '.$row.' FROM '.$this->table.' '.$whereCl.'');
		//$res[0...][$key]
		return $res;
	}
	
	
	
	private function memError($errStr = '')
	{
		!isset($this->error['null']) ? $this->error['null'] = 1: NULL;	
		$this->error[] = $errStr;
	}

	
	public function getErrors()
	{
	if( !isset($this->error['null']) )
		return false;
		
		if($this->error['null'] === 1)
			return $this->error;
		else return false;
	}
	
	
	
	
	
	
	/* mySQL methods */
	public function connect()
	{
		if(!$this->_link = mysql_connect($this->db_server, $this->db_user, $this->db_password))
			die("Impossibile connettersi al database");
		else
		if(!$this->selectDb($this->db_name))
			return false;
		else
		return $this->_link;
	}
	
	
	public function selectDb($db_name)
	{
		return mysql_select_db($db_name, $this->_link);
	}
	
	
	
	public function q($query)
	{
		$this->connect();
		return $this->exeQ($query);
	}
	
	
	public function exeQ($query, $to_array = true)
	{
			$this->result = false;
			if($this->_link AND $this->result = mysql_query($query, $this->_link))
			{
				if(_DBINS_DB_DEBUG_)
					$this->displayMySQLError();
				if(!$to_array)
					return $this->result;

				$fetched_result = array(); 
				while($row = mysql_fetch_assoc($this->result))
					$fetched_result[] = $row;
				
				return $fetched_result;
			}
			else if(_DBINS_DB_DEBUG_)
				$this->displayMySQLError($query);
			
			return false;
	}
	
	
	
	public function displayMySQLError($query = false)
	{
		if (_DBINS_DB_DEBUG_ AND mysql_errno())
		{
			if ($query)
				die(mysql_error().'<br /><br /><pre>'.$query.'</pre>');
			die(mysql_error());
		}
	}
	
	
	public function disconnect()
	{
		if($this->_link)
			mysql_close($this->_link);
		$this->_link = false;
	}
	
	
	
	
	
	
	
	
	
	/* Validating methods */
	static public function isEmail($email)
    {
    	return preg_match('/^[a-z0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z0-9]+[._a-z0-9-]*\.[a-z0-9]+$/ui', $email);
    }
	
	
	static public function isPasswd($passwd, $size = 5)
	{
		return preg_match('/^[.a-z_0-9-!@#$%\^&*()]{'.$size.',32}$/ui', $passwd);
	}
	
	static public function isTitle($name)
	{
		return preg_match('/^[^!<>;?=+@#"°{}_$%:]*$/ui', stripslashes($name));
	}
	
	static public function isTitle_HTML($name)
	{
		return preg_match('/^[^;+@#°{}_:]*$/ui', stripslashes($name));
	}
	
	
	static public function isName($name)
	{
		return preg_match('/^[^0-9!<>,;?=+()@#"°{}_$%:]*$/', stripslashes($name));
	}
	
	
	static public function isDbColName($db_column)
	{
		return preg_match('/^[^0-9!<>,;?=+()@#"°{}_$%:]*$/', stripslashes($db_column));
	}
	
	static public function isRandKey($key)
	{
		return preg_match('/^[^<>;{}!%&$£().-\/]*$/ui', $key);
	}
	
	static public function isMessage($message)
	{
		return preg_match('/^([^<>{}]|<br \/>)*$/ui', $message);
	}
	
	static public function isMessage_HTML($message)
	{
		return preg_match('/^([^{}]|<br \/>)*$/ui', $message);
	}
	
	
	static public function isUnsignedID($id)
	{
		return self::isUnsignedInt($id); 
	}
	
	
	static public function isUnsignedInt($value)
	{
		return (self::isInt($value) AND $value < 4294967296 AND $value >= 0);
	}
	
		
	static public function isInt($value)
	{
		return ((string)(int)$value === (string)$value OR $value === false);
	}
	
	
	static public function isFloat($float)
    {
		return strval(floatval($float)) == strval($float);
	}
	
    static public function isUnsignedFloat($float)
    {
			return strval(floatval($float)) == strval($float) AND $float >= 0;
	}
	
	
	static public function isPhoneNumber($phoneNumber)
	{
		return preg_match('/^[+0-9. ()-]*$/ui', $phoneNumber);
	}

	
	static public function isDate($date)
	{
		if (!preg_match('/^([0-9]{4})-((0?[1-9])|(1[0-2]))-((0?[1-9])|([1-2][0-9])|(3[01]))( [0-9]{2}:[0-9]{2}:[0-9]{2})?$/ui', $date, $matches))
			return false;
		return checkdate(intval($matches[2]), intval($matches[5]), intval($matches[0]));
	}
	
	
	static public function isAbsoluteUrl($url)
	{
		if (!empty($url))
			return preg_match('/^https?:\/\/([[:alnum:]]|[:#%&_=\(\)\.\? \+\-@\/\$])+$/ui', $url);
		return true;
	}
	
	
	static public function isUrl($url)
	{
		return preg_match('/^([[:alnum:]]|[:#%&_=\(\)\.\? \+\-@\/])+$/ui', $url);
	}


	static public function isMd5($md5)
	{
		return preg_match('/^[a-z0-9]{32}$/ui', $md5);
	}

	
	static public function isCleanHtml($html)
	{
		$jsEvent = 'onmousedown|onmousemove|onmmouseup|onmouseover|onmouseout|onload|onunload|onfocus|onblur|onchange|onsubmit|ondblclick|onclick|onkeydown|onkeyup|onkeypress|onmouseenter|onmouseleave';
		return (!preg_match('/<[ \t\n]*script/ui', $html) && !preg_match('/<.*('.$jsEvent.')[ \t\n]*=/ui', $html)  && !preg_match('/.*script\:/ui', $html));
	}
	

	static public function isPostCode($postcode)
	{
		return preg_match('/^[a-z 0-9-]+$/ui', $postcode);
	}
	
	
	
	
} // # class


?>