<?php

/**
  * Validation class, Validate.php
  * Check fields and data validity
  * @category classes
  *
  * @author PrestaShop <support@prestashop.com>
  * @copyright PrestaShop
  * @license http://www.opensource.org/licenses/osl-3.0.php Open-source licence 3.0
  * @version 1.3
  *
  */

class Validate
{
 	/**
	* Check di tutte le variabili utili
	* tramite preg_match
	* 
	*/
	
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
		return preg_match('/^[^0-9!<>,;?=+()@#"°{}_$%:]*$/ui', stripslashes($name));
	}
	
	
	static public function isDbColName($db_column)
	{
		return preg_match('/^[^0-9!<>,;?=+()@#"°{}_$%:]*$/ui', stripslashes($db_column));
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
	
	static public function isMailSubject($mailSubject)
	{
		return preg_match('/^[^<>;{}]*$/ui', $mailSubject);
	}
	
	static public function isConfigKey($key)
	{
		return preg_match('/^[a-z_0-9-]+$/ui', $key);
	}
	
	static public function isPrice($price)
	{
		return preg_match('/^[0-9]{1,10}(\.[0-9]{1,9})?$/ui', $price);
	}
	
	static public function isUnsignedID($id)
	{
		return self::isUnsignedInt($id); 
	}
	
	static public function isNull($int)
	{
		if($int === NULL)
			return true;
		else
			return false;
	}
	
	static public function isUnsignedInt($value)
	{
		return (self::isInt($value) AND $value < 4294967296 AND $value >= 0);
	}
	
	static public function isPhotoID($value)
	{
		return preg_match('/^[0-9-]+$/ui', $value);
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
	
	static public function isCityName($city)
	{
		return preg_match('/^[^!<>;?=+@#"°{}_$%]*$/ui', $city);
	}
	
	
	
	static public function isPhoneNumber($phoneNumber)
	{
		return preg_match('/^[+0-9. ()-]*$/ui', $phoneNumber);
	}
	
	
	
	static public function isCatalogName($name)
	{
		return preg_match('/^[^<>;=#{}]*$/ui', $name);
	}
	
	static public function isDate($date)
	{
		if (!preg_match('/^([0-9]{4})-((0?[1-9])|(1[0-2]))-((0?[1-9])|([1-2][0-9])|(3[01]))( [0-9]{2}:[0-9]{2}:[0-9]{2})?$/ui', $date, $matches))
			return false;
		return checkdate(intval($matches[2]), intval($matches[5]), intval($matches[0]));
	}
	
	
	static public function isFileName($name)
	{
		return preg_match('/^[a-zA-Z0-9_. ()-]*$/ui', $name);
	}
	
	static public function isOrderCmd($order)
	{
		return preg_match('/^[a-zA-Z_-]*$/ui', $order);
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
	
	//Prende l'array e la funzione da usare per controllarlo
	//Validate::checkArray($cat, 'isCityName');

	
	/*
	
	static public function isModuleUrl($url, &$errors)
	{
		if (!$url OR $url == 'http://')
			$errors[] = Tools::displayError('please specify module URL');
		elseif (substr($url, -4) != '.tar' AND substr($url, -4) != '.zip' AND substr($url, -4) != '.tgz' AND substr($url, -7) != '.tar.gz')
			$errors[] = Tools::displayError('unknown archive type');
		else
		{
			if ((strpos($url, 'http')) === false)
				$url = 'http://'.$url;
			if (!is_array(@get_headers($url)))
				$errors[] = Tools::displayError('invalid URL');
		}
		if (!sizeof($errors))
			return true;
		return false;

	}


	static public function isMd5($md5)
	{
		return preg_match('/^[a-z0-9]{32}$/ui', $md5);
	}


	static public function isSha1($sha1)
	{
		return preg_match('/^[a-z0-9]{40}$/ui', $sha1);
	}





    static public function isOptFloat($float)
    {
		return empty($float) OR self::isFloat($float);
	}


	static public function isCarrierName($name)
	{
		return empty($name) OR preg_match('/^[^<>;=#{}]*$/ui', $name);
	}


	static public function isImageSize($size)
	{
		return preg_match('/^[0-9]{1,4}$/ui', $size);
	}

	static public function isOptId($id)
	{
		return empty($id) OR self::isUnsignedId($id);
	}



	static public function isMailName($mailName)
	{
		return preg_match('/^[^<>;=#{}]*$/ui', $mailName);
	}

	


	
	static public function isModuleName($moduleName)
	{
		return preg_match('/^[a-z0-9_-]+$/ui', $moduleName);
	}


	static public function isTplName($tplName)
	{
		return preg_match('/^[a-z0-9_-]+$/ui', $tplName);
	}

	static public function isTplFileName($tplFileName)
	{
		return preg_match('/^[a-zA-Z0-9\/_.-]+/ui', $tplFileName);
	}


	static public function isIconFile($icon)
	{
		return preg_match('/^[a-z0-9_-]+\.[gif|jpg|jpeg|png]$/ui', $icon);
	}

	
	static public function isIcoFile($icon)
	{
		return preg_match('/^[a-z0-9_-]+\.ico$/ui', $icon);
	}

	
	static public function isImageTypeName($type)
	{
		return preg_match('/^[a-z0-9_ -]+$/ui', $type);
	}

	


	
	static public function isLanguageIsoCode($isoCode)
	{
		return preg_match('/^[a-z]{2,3}$/ui', $isoCode);
	}
	
	static public function isStateIsoCode($isoCode)
	{
		return preg_match('/^[a-z0-9-]{1,5}$/ui', $isoCode);
	}

	
	static public function isGenderName($genderName)
	{
		return preg_match('/^[a-z.]+$/ui', $genderName);
	}

	
	static public function isDiscountName($discountName)
	{
		return preg_match('/^[^!<>,;?=+()@"°{}_$%:]{3,32}$/ui', $discountName);
	}

	


	

	
	static public function isCountryName($name)
	{
		return preg_match('/^[a-z -]+$/ui', $name);
	}

	
	static public function isLinkRewrite($link)
	{
		return empty($link) OR preg_match('/^[_a-z0-9-]+$/ui', $link);
	}

	
	static public function isZoneName($name)
	{
		return preg_match('/^[a-z -()]+$/ui', $name);
	}

	
	static public function isAddress($address)
	{
		return empty($address) OR preg_match('/^[^!<>?=+@{}_$%]*$/ui', $address);
	}

	
	static public function isValidSearch($search)
	{
		return preg_match('/^[^<>;=#{}]{0,64}$/ui', $search);
	}

	
	static public function isGenericName($name)
	{
		return empty($name) OR preg_match('/^[^<>;=#{}]*$/ui', $name);
	}

	
	static public function isCleanHtml($html)
	{
		$jsEvent = 'onmousedown|onmousemove|onmmouseup|onmouseover|onmouseout|onload|onunload|onfocus|onblur|onchange|onsubmit|ondblclick|onclick|onkeydown|onkeyup|onkeypress|onmouseenter|onmouseleave';
		return (!preg_match('/<[ \t\n]*script/ui', $html) && !preg_match('/<.*('.$jsEvent.')[ \t\n]*=/ui', $html)  && !preg_match('/.*script\:/ui', $html));
	}


	static public function isReference($reference)
	{
		return preg_match('/^[^<>;={}]*$/ui', $reference);
	}

	static public function isPasswdAdmin($passwd)
	{
		return self::isPasswd($passwd, 8);
	}


	static public function isConfigName($configName)
	{
		return preg_match('/^[a-z_0-9-]+$/ui', $configName);
	}





	static public function isBirthDate($date)
	{
	 	if (empty($date) || $date == '0000-00-00')
	 		return true;
	 	if (preg_match('/^([0-9]{4})-((0?[1-9])|(1[0-2]))-((0?[1-9])|([1-2][0-9])|(3[01]))( [0-9]{2}:[0-9]{2}:[0-9]{2})?$/ui', $date, $birthDate)) {
			 if ($birthDate[1] >= date('Y') - 9)
	 			return false;
	 		return true;
	 	}
		return false;
	}


	static public function isBool($bool)
	{
		return is_null($bool) OR is_bool($bool) OR preg_match('/^[0|1]{1}$/ui', $bool);
	}




	static public function isEan13($ean13)
	{
		return !$ean13 OR preg_match('/^[0-9]{0,13}$/ui', $ean13);
	}

	static public function isPostCode($postcode)
	{
		return preg_match('/^[a-z 0-9-]+$/ui', $postcode);
	}

	
	static public function isOrderWay($orderWay)
	{
		return ($orderWay === 'ASC' | $orderWay === 'DESC' | $orderWay === 'asc' | $orderWay === 'desc');
	}

	
	static public function isOrderBy($orderBy)
	{
		return preg_match('/^[a-z0-9_-]+$/ui', $orderBy);
	}

	
	static public function isTableOrIdentifier($table)
	{
		return preg_match('/^[a-z0-9_-]+$/ui', $table);
	}



	
	static public function isTagsList($list)
	{
		return preg_match('/^[^!<>;?=+#"°{}_$%]*$/ui', $list);
	}



	


	

	static public function isNullOrUnsignedId($id)
	{
		return is_null($id) OR self::isUnsignedId($id);
	}


	static public function isLoadedObject($object)
	{
		return is_object($object) AND $object->id;
	}


	static public function isColor($color)
	{
		return preg_match('/^(#[0-9A-Fa-f]{6}|[[:alnum:]]*)$/ui', $color);
	}










	static public function isTabName($name)
	{
		return preg_match('/^[a-z0-9_-]*$/ui', $name);
	}


	static public function isProtocol($protocol)
	{
		return preg_match('/^http(s?):\/\/$/ui', $protocol);
	}


	static public function isDni($dni)
	{

		
		if (!$dni)
			return 1;
		
		$dni = strtoupper($dni);
		if (!preg_match('/((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)/', $dni)) 
			return 0;
		
		$result = Db::getInstance()->getValue('
		SELECT COUNT(`id_customer`) AS total 
		FROM `'._DB_PREFIX_.'customer` 
		WHERE `dni` = \''.pSQL($dni).'\'
		');
		if($result)
			return -1;
		
		for ($i=0;$i<9;$i++)
			$char[$i] = substr($dni, $i, 1);
		// 12345678T
		if (preg_match('/(^[0-9]{8}[A-Z]{1}$)/', $dni))
			if ($char[8] == substr('TRWAGMYFPDXBNJZSQVHLCKE', substr($dni, 0, 8) % 23, 1))
				return 1;
			else
				return -2;
		
		$sum = $char[2] + $char[4] + $char[6];
		for ($i = 1; $i < 8; $i += 2)
			$sum += substr((2 * $char[$i]),0,1) + substr((2 * $char[$i]),1,1);
		
		$n = 10 - substr($sum, strlen($sum) - 1, 1);
		
		if (preg_match('/^[KLM]{1}/', $dni))
			if ($char[8] == chr(64 + $n))
				return 1;
			else
	 			return -2;
		
		if (preg_match('/^[ABCDEFGHJNPQRSUVW]{1}/', $dni))
			if ($char[8] == chr(64 + $n) || $char[8] == substr($n, strlen($n) - 1, 1))
				return 1;
			else
				return -3;
		
		if (preg_match('/^[T]{1}/', $dni))
			if ($char[8] == preg_match('/^[T]{1}[A-Z0-9]{8}$/', $dni))
				return 1;
			else
				return -4;
		
		if (preg_match('/^[XYZ]{1}/', $dni))
			if ($char[8] == substr('TRWAGMYFPDXBNJZSQVHLCKE', substr(str_replace(array('X','Y','Z'), array('0','1','2'), $dni), 0, 8) % 23, 1))
				return 1;
			else
				return -4;
		
		return 0;
	}


	static public function isCookie($data)
	{
		return (is_object($data) AND get_class($data) == 'Cookie');
	}


	static public function isString($data)
	{
		return is_string($data);
	}

*/
}
?>
