<?php


/********************************************
/*         Authentication endpoint          *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

require_once(dirname(__FILE__)."/lib/ip.php");
require_once(dirname(__FILE__)."/include.php");


/**
/* Comprueba si un nombre de usuario y contrasena son validos, 
/* si lo son, crea una cookie para mantenerlo identificado durante 1 hora
/*
*/
function user_login($username, $password)
{	
	global $db;
	
	$query = $db->query('SELECT password FROM users WHERE login ="'.$username.'"');
    $fetch = $query->fetch_assoc();

	$password_sql = $fetch['password'];	

	if ($password_sql != md5($password))
	{
		return false;
	}
		
	else
	{
		$hash = encryptHash(new_hash($username,$password_sql));		
		return serialize($hash);
	}
}

/**
/* Comprueba si el usuario ha iniciado sesion previamente
**/
function is_auth($token="")
{

	if(trim($token) == "")
	{
		if(!isset($_POST['data']))
			return false;
		$json = json_decode($_POST['data'], true);
		if(!array_key_exists('token',$json))
			return false;
		if(trim($json['token'] == ""))
			return false;
			
		$token = $json['token'];		
	}
	

	$hash = decryptHash(unserialize($token));

	if(trim($hash) == "")
	{
		return false;
	}
		
	return is_hash_valid($hash);
}


/**
/* Genera hash para la cookie
**/
function new_hash($user,$password)
{
	$data = $user.":#:".$password.":#:".ip();
	return $data;
}

/**
/* Comprueba que el valor de la cookie sea valido.
/* La cookie almacena el nombre de usuario, el hash de la password y la direccion IP desde la que el usuario se 
/* valido. 
/* Si no coincide la IP, devuelve false.
/* Si no existe un usuario con ese hash de contrasena devuelve false.
*/
function is_hash_valid($hash)
{
	global $db;
	
	
	$client_ip = ip();
	$data = $hash;
	$data = explode(":#:",$data);
	$user = $data[0];
	$password = $data[1];
	$ip = $data[2];
	
	if($ip != $client_ip)
	{
		
		//return false;
	}

	$check = $db->query("SELECT id,name,surname,login,email,photo,dbtoken,position FROM users WHERE login='$user' AND password='$password'");
	//$check = $db->query("SELECT u.id,u.name,u.surname,u.login,u.email,u.photo,u.dbtoken,(SELECT position FROM photos WHERE uid=u.id ORDER BY id DESC LIMIT 0,1) as position FROM users u INNER JOIN photos on u.id=photos.uid WHERE login='$user' AND password='$password' LIMIT 0,1");
	if($check->num_rows == 0)
	{	
		return false;
	}
		
	return  $check->fetch_assoc();
}


/**
/* Devuelve la clave del cifrado del hash para guardar en cookie
*/
function get_key()
{
	return "B0mbiLl@FeO";
}


/**
/* Funcion para cifrar la cookie
*/
function encryptHash($value)
{
   if(!$value)
   {
	return false;
   }
   $key = get_key();
   $text = $value;
   $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
   $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
   $crypttext = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $text, MCRYPT_MODE_ECB, $iv);
   
   return trim(base64_encode($crypttext)); //encode for cookie
}

/**
/* Funcion para descifrar la cookie
*/
function decryptHash($value)
{
   if(!$value){
	return false;
   }
   
   $key = get_key();
   $crypttext = base64_decode($value); //decode cookie
   $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
   $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
   $decrypttext = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $crypttext, MCRYPT_MODE_ECB, $iv);
   
   return trim($decrypttext);
}

function forbidden(){
	header('HTTP/1.0 403 Forbidden');
	die("Forbidden");
}


?>