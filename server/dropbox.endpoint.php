<?php

/********************************************
/*         DBOX API endpoint                *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

require_once(dirname(__FILE__)."/lib/DropboxClient.php");
require_once(dirname(__FILE__)."/auth.php");

define("_CLICK",true);

$clickToken = base64_decode($_GET['clickToken']);
if(! ($user = is_auth($clickToken)) )
	forbidden();
	
if( !isset($_GET['cod']) )
	badrequest();
	

/* Select right action */
switch($_GET['cod'])
{
	case 'upload':
		if( !isset($_GET['gid']) )
			badrequest();
		updatePosition($user['id'],$_GET['position']);
		$uploadedBy = $user['id'];
		uploadPhotoToGroup($_GET['gid'], $_GET['position']);
	break;
	
	case 'updateProfilePhoto':
		updatePosition($user['id'],$_GET['position']);
		updateProfilePhoto();
	break;
	
	default:
		header('HTTP/1.0 400 Bad Request', true, 400);		
	
}

/**
/* Upload the posted photo to all users in a given group
/* If gid=0 the photo will be private for the user
*/
function uploadPhotoToGroup($gid, $position)
{
	global $uploadedBy;
	$gid = intval($gid);
	require_once(dirname(__FILE__)."/lib/click.functions.php");
	
	$tmp = $_FILES["file"]["tmp_name"];
	$group = getGroupByGid($gid);
	$destination = $group['name']."/".$_FILES["file"]["name"];
	
	$new = "uploads/".md5_file($tmp);
	$saveImage = move_uploaded_file($tmp, $new);
	if($saveImage)
	{
		$users = getGroupUsers($gid);
		
		foreach($users as $user)
		{
			queueUpload($user,$gid,$uploadedBy,$new,$destination,$position);
		}
	}else
	{
		die("Error moving file");
	}

}

function updateProfilePhoto()
{
	global $user, $gc;
	
	require_once(dirname(__FILE__)."/lib/click.functions.php");	
	
	$tmp = $_FILES["file"]["tmp_name"];
	$new = "img/profile/".$user['id'].".jpg";
	
	$saveImage = move_uploaded_file($tmp, $new);
	
	if($saveImage)
	{
		$url = $gc->path.$new;
		changeProfilePhoto($user['id'], $url);
		echo $url;
	}
	else
	{
		echo "Something went wrong :-(";
	}

}

/**
/* Queues the upload to dropbox
*/
function queueUpload($user,$gid,$uploadedBy,$origin,$destination,$position)
{
	global $db;
	
	$query = "INSERT INTO jobs (uid,gid,uploadedBy,origin,destination,position) VALUES ('".$user['id']."',$gid,'$uploadedBy','$origin','$destination','$position')";
	
	$result = $db->query($query);
	
}

function updatePosition($uid,$position){
	global $db;
	
	$uid = intval($uid);
	$query = "UPDATE  users SET  position =  '$position' WHERE  id = '$uid'";
	
	$result = $db->query($query);
}








?>