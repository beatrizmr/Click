<?php
/********************************************
/*         GET DB TOKEN                     *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/
set_time_limit(0);


require_once(dirname(__FILE__)."/DropboxClient.php");
require_once(dirname(__FILE__)."/../auth.php");

global $db;

$clickToken = base64_decode($_GET['clickToken']);
if(! ($user = is_auth($clickToken)) )
	forbidden();


// you have to create an app at https://www.dropbox.com/developers/apps and enter details below:
$dropbox = new DropboxClient(array(
	'app_key' => "x6ipo0jmmaxu80s", 
	'app_secret' => "ilw666k3f8bre8p",
	'app_full_access' => false,
),'en');


//

// first try to load existing access token
$access_token = unserialize($user['dbtoken']);

if(!empty($access_token)) {
	$dropbox->SetAccessToken($access_token);
}
elseif(!empty($_GET['auth_callback'])) // are we coming from dropbox's auth page?
{
	// then load our previosly created request token
	$request_token = load_token($_GET['oauth_token']);
	if(empty($request_token)) die('Request token not found!');
	
	// get & store access token, the request token is not needed anymore
	$access_token = $dropbox->GetAccessToken($request_token);	
	store_token($access_token, "access");
	delete_token($_GET['oauth_token']);
}

// checks if access token is required
if(!$dropbox->IsAuthorized())
{
	// redirect user to dropbox auth page
	$return_url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME']."?auth_callback=1&clickToken=".$_GET['clickToken']."&return=".$_GET['return'];
	$auth_url = $dropbox->BuildAuthorizeUrl($return_url);
	$request_token = $dropbox->GetRequestToken();
	store_token($request_token, $request_token['t']);
	
	//echo $auth_url;
	
	header("Location: $auth_url");
	die();
	
	//die("Authentication required. <a href='$auth_url'>Click here.</a>");
}

header("Location: ".$_GET['return']);
die();

echo "Token v�lido!!";

echo "<pre>";
echo "<b>Account:</b>\r\n";
print_r($dropbox->GetAccountInfo());

$files = $dropbox->GetFiles("",false);

echo "\r\n\r\n<b>Files:</b>\r\n";
print_r(array_keys($files));

if(!empty($files)) {

	foreach($files as $file){
	//$file = reset($files);
	$test_file = "test_download_".basename($file->path);
	
	echo "\r\n\r\n<b>Meta data of <a href='".$dropbox->GetLink($file)."'>$file->path</a>:</b>\r\n";
	print_r($dropbox->GetMetadata($file->path));
	
	/*
	echo "\r\n\r\n<b>Downloading $file->path:</b>\r\n";
	print_r($dropbox->DownloadFile($file, $test_file));
		
	echo "\r\n\r\n<b>Uploading $test_file:</b>\r\n";
	print_r($dropbox->UploadFile($test_file));
	echo "\r\n done!";	
	
	echo "\r\n\r\n<b>Revisions of $test_file:</b>\r\n";	
	print_r($dropbox->GetRevisions($test_file));
	*/
	}
}
	
echo "\r\n\r\n<b>Searching for JPG files:</b>\r\n";	
$jpg_files = $dropbox->Search("/", ".jpg", 5);
if(empty($jpg_files))
	echo "Nothing found.";
else {
	print_r($jpg_files);
	//$jpg_file = reset($jpg_files);
	
	foreach($jpg_files as $jpg_file){
		echo "\r\n\r\n<b>Thumbnail of $jpg_file->path:</b>\r\n";	
		$img_data = base64_encode($dropbox->GetThumbnail($jpg_file->path, 'm'));
		echo "<img src=\"data:image/jpeg;base64,$img_data\" alt=\"Generating PDF thumbnail failed!\" style=\"border: 1px solid black;\" />";
	
	}
}

function store_token($token, $name)
{
	if(!file_put_contents("tokens/$name.token", serialize($token)))
		die('<br />Could not store token! <b>Make sure that the directory `tokens` exists and is writable!</b>');
	
	if($name == "access"){
		global $db, $user;	
		$uid = $user['id'];
		$token = serialize($token);
		$query = "UPDATE users SET dbtoken='$token' WHERE id='$uid'";
		$db->query($query);
	}
}

function load_token($name)
{
	if(!file_exists("tokens/$name.token")) return null;
	return @unserialize(@file_get_contents("tokens/$name.token"));
}

function delete_token($name)
{
	@unlink("tokens/$name.token");
}





function enable_implicit_flush()
{
	@apache_setenv('no-gzip', 1);
	@ini_set('zlib.output_compression', 0);
	@ini_set('implicit_flush', 1);
	for ($i = 0; $i < ob_get_level(); $i++) { ob_end_flush(); }
	ob_implicit_flush(1);
	echo "<!-- ".str_repeat(' ', 2000)." -->";
}