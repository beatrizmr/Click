<?php


/********************************************
/*         Authentication endpoint          *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST'); 

require_once(dirname(__FILE__)."/auth.php");

if( isset($_POST['data']) ){

	$json = json_decode($_POST['data'], true);
	
	$login = addslashes($json['login']);
	$password = addslashes($json['password']);
	
	if($token = user_login($login,$password))
	{
		$response['token'] = $token;
		$response['status'] = "200";
	}
	else
	{
		$response['status'] = "403";
	}
	

}else{
	$response['status'] = "400";
}


header('Content-Type: application/json');	
echo json_encode($response);