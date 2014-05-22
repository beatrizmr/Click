<?php

/********************************************
/*         JSON API endpoint                *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

define("_CLICK",true);

require_once("auth.php");
require_once("lib/click.functions.php");

$json = json_decode($_POST['data'], true);


/* If not auth, error 403 */
if( !($user = is_auth()) AND $json['cod'] != "new_user" ){
	forbidden();
}

switch($json['cod'])
{
	case 'userinfo':
		echo json_encode($user);
	break;
	
	case 'getKey':
		echo returnKey($json['key'], getKey($json['key']));
	break;
	
	case 'getSimpleKey':
		echo json_encode(getKey($json['key']));
	break;
	
	case 'getGroups':
		echo json_encode(getGroupsUser($user['id']));
	break;
	
	case 'getContacts':
		echo json_encode(getContacts($user['id']));
	break;
	
	case 'getUsersFromGroup':
		echo json_encode(getGroupUsers($json['gid']));
	break;
	
	case 'getUsers':
		echo json_encode(getUsers());
	break;
	
	case 'addUsersToGroup':
		addUsersToGroup($json['gid'], $json['users']);
	break;
	
	case 'createGroup':
		echo createGroup($json['name'], $user['id']);
	break;
	
	case 'addContact':
		echo json_encode(addContact($json['cid']));
	break;
	
	case 'getThumbnails':
		echo json_encode(getThumbnails($json['gid']));
	break;
	
	case 'getThumbnailsAndMessages':
		echo json_encode(getThumbnailsAndMessages($json['gid']));
	break;
	
	case 'getUpdates':
		echo json_encode(getUpdates($json['gid']));
	break;
	
	case 'dropboxauth':
		dropboxauth();
	break;
	
	case 'new_user':
		new_user($json['new_user']);
	break;
	
	case 'getMessages':
		echo json_encode(getMessages($json['gid']));
	break;
	
	case 'insertMessage':
		echo json_encode(insertMessage($user['id'], $json['gid'], $json['message'], $json['position']));
	break;
	
	default:
		header('HTTP/1.0 400 Bad Request', true, 400);
	
	
}




?>