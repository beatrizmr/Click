#!/usr/bin/php
<?php
/********************************************
/*         UPLOAD CRON TASK                 *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/


error_reporting(E_ALL ^ E_NOTICE);
$baseDir = "/var/www/clients/client1/web8/web/click/";

/* ONLY CLI MODE */
ini_set('register_argc_argv', 0);  


if (!isset($argc) || is_null($argc))
{ 
   die("Execution not allowed");
}

define("_CLICK","1");

require_once(dirname(__FILE__)."/../lib/DropboxClient.php");
require_once(dirname(__FILE__)."/../lib/click.functions.php");
require_once(dirname(__FILE__)."/../lib/SimpleImage.php");
require_once(dirname(__FILE__)."/../include.php");

runJobs();


function runJobs()
{
	print("############################################\n");
	print("############### CRON JOBS ##################\n");
	print("############################################\n");
	print("\n");
	$jobs = getJobs();
	foreach($jobs as $job)
		executeJob($job);
		
	print("COMPLETADO\n");

	
}

function executeJob($job)
{
	global $baseDir;
	print("Ejecutando jib=".$job['id']);
	$user = getUserByUid($job['uid']);
	
	
	$upload = uploadPhoto($user,$baseDir.$job['origin'],$job['destination']);
	if($upload)
	{
		setJobCompleted($job['id']);
		$thumbUrl = generateThumbNail($job['origin'],$job['destination']);
		insertImgDb($job['uid'],$job['gid'], $job['uploadedBy'], $thumbUrl, $job['position']);
		insertPhotoUpdate($job['uid'], $job['gid'], $user['name'], $thumbUrl);
		removeFile($job['origin']);
		print(" OK\n");
	}
	else{
		print(" FAIL\n");
		//TODO hacer que avise del fallo de no poder subir a Dropbox
	}
	
}

function insertPhotoUpdate($uid, $gid, $name, $photo)
{
	$title = "New photo";
	$description = "$name added a new photo to the group";
	$photo = "icons/camera.gif";
	insertUpdate($uid, $gid, $title, $description, $photo);

}

function insertImgDb($uid, $gid, $uploadedBy, $url, $position)
{
	global $db;
	$query = "INSERT INTO photos (uid, gid, uploadedBy, url, position) VALUES ('$uid', '$gid', '$uploadedBy', '$url', '$position' )";
	
	$result = $db->query($query);

}

function generateThumbNail($origin, $destination)
{
	global $baseDir;
	
	if(!file_exists($baseDir."thumbs/".$destination)){
		$explode = explode("/", $destination);
		$groupName = $explode[0];
		
		if (!file_exists($baseDir."thumbs/".$groupName)) {
			mkdir($baseDir."thumbs/".$groupName, 0777, true);
		}
		
		$image = new SimpleImage(); 
		$image->load($baseDir.$origin);
		
		$image->resizeToWidth(640); 
		$image->save($baseDir."thumbs/".$destination);
	}
	
	return "thumbs/".$destination;
}

function getJobs()
{
	global $db;
	$result = $db->query("SELECT * FROM jobs WHERE completed='0'");
	
	$jobs = array();
	while($fetch = $result->fetch_assoc())
		$jobs[] = $fetch;
		
	return $jobs;

}


function setJobCompleted($jid)
{
	global $db;
	$jid = intval($jid);
	$result = $db->query("UPDATE jobs SET completed='1' WHERE id='$jid'");
}

function uploadPhoto($user,$origin,$destination)
{
	$dropbox = newDropboxClient();
	
	$dropbox->SetAccessToken(unserialize($user['dbtoken']));		
	if(!$dropbox->IsAuthorized())
	{
		return false;
	}	

	$meta = $dropbox->UploadFile($origin, $destination);
	if($meta != "")
		return true;
	else
		return false;


}


function removeFile($file)
{
	global $db, $baseDir;
	$result = $db->query("SELECT id FROM jobs WHERE origin='$file' AND completed='0'");
	
	if($result->num_rows == 0)
		unlink($baseDir.$file);
	
}


function handle_dropbox_auth($dropbox, $access_token)
{
	if(!empty($access_token)) {
		$dropbox->SetAccessToken($access_token);
	}
	if(!$dropbox->IsAuthorized())
	{
		die("Dropbox auth token not valid");
	}
}

?>