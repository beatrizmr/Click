<?php

/********************************************
/*         Click functions library          *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

if(!defined("_CLICK"))
	die("No direct access");
	
require_once(dirname(__FILE__)."/../include.php");

global $db;


/**
/* Returns current user info ARRAY
/* Array contains: id,name,surname,login,email,photo,dbtoken
/*
**/	
function getUserInfo()
{
	global $user;
	return $user;
}



/**
/* This function returns a key of the user
/* @param $key to get, for example the name, login or email
/* @return value of the key
/*
**/
function getKey($key)
{
	global $user;
	return $user[$key];
}


/**
/* Function used to return a key using JSON
/* @param $key
/* @param $value
/* @return the key and the value encoded in JSON
**/
function returnKey($key, $value)
{
	$var['status'] = 200;
	$var[$key] = $value;
	$var['key'] = $value;
	return json_encode($var);

}

/**
/* Function to echo data in json format. 
/* It writes the corresponding HTTP headers
/* @param $data to echo (raw), it is encoded to json in this function
**/
function echo_json($data)
{
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST'); 
	echo json_encode($data);

}

/**
/* Get a user array by id
/* @param $uid user id of the user to get
/* @return it returns an array with the data of the user (id,name,surname,login,email,photo,dbtoken)
**/
function getUserByUid($uid)
{
	global $db;
	$uid = intval($uid);
	$result = $db->query("SELECT id,name,surname,login,email,photo,dbtoken FROM users WHERE id='$uid'");
	return $result->fetch_assoc();
}

/**
/* Get a group array by id
/* @param $gid group id of the group to get
/* @return it returns an array with the data of the group (id, name, timestamp)
**/
function getGroupByGid($gid)
{
	global $db;
	$gid = intval($gid);
	$result = $db->query("SELECT * FROM groups WHERE id='$gid'");
	return $result->fetch_assoc();
}

/**
/* Returns groups of a user given user id uid
/* @param $uid the user id of the user to get his groups
/* @return array of the groups the user belongs to
*/
function getGroupsUser($uid){
	global $db;
	
	$groups = array();
	$uid = intval($uid);
	
	$query = "SELECT g.id, g.name, g.cid, g.timestamp FROM groups g INNER JOIN groups_users gu ON g.id = gu.gid WHERE gu.uid = '$uid'";
	
	$result = $db->query($query);
	while($fetch = $result->fetch_assoc())
		$groups[] = $fetch;
	
	return $groups;
}

/**
/* Returns users in group given a group ID
/* @param $gid the id of the group to get its users
/* @return array of users in the given group
*/
function getGroupUsers($gid)
{
	global $db, $user;
	
	$users = array();
	
	/* Siempre validamos los datos, que sea un entero */
	$gid = intval($gid);
	if($gid == 0)
	{
		$users[] = $user;
		return $users;
	}
	
	if(!isUserInGroup($user['id'], $gid))
		die("User not allowed to upload to selected group");
		
	
	$query = "SELECT u.id, u.login, u.name, u.surname, u.email, u.photo, u.position 
	FROM users u INNER JOIN groups_users g ON u.id = g.uid WHERE g.gid = $gid";
	
	$result = $db->query($query);
		
	while($fetch = $result->fetch_assoc()){
		$uid = $fetch['id'];
		$getPhotos = "SELECT count(id) as photos FROM photos WHERE gid='$gid' AND uploadedBy='$uid'";
		$getMessages = "SELECT count(id) as messages FROM messages WHERE gid='$gid' AND uid='$uid'";
		$photos = $db->query($getPhotos)->fetch_assoc();
		$messages = $db->query($getMessages)->fetch_assoc();
		$users[] = array_merge($fetch, $photos, $messages);
	}

	return $users;

}

/**
/* Get contacts of the selected Group ID
/* @param $gid group id of the group we are getting the contacts
/* @return array of users (users of the given group)
/**/
function getUsersFromGroup($gid){
	global $db;
	$gid = intval($gid);
	
	$query = "SELECT u.id, u.login, u.name, u.surname, u.email, u.photo FROM users u INNER JOIN groups_users gu ON u.id=gu.uid WHERE gu.gid='$gid'";
	
	$users = array();
	
	while($fetch = $result->fetch_assoc())
		$users[] = $fetch;
	
	return $users;

}
/**
/* Get contacts of the selected User ID
/* @param $uid user id of the user we are getting the contacts
/* @return array of users (contacts of the given user)
/**/
function getContacts($uid){
	global $db;
	$uid = intval($uid);
	$query = "SELECT DISTINCT u.id, u.login, u.name, u.surname, u.email, u.photo FROM users u INNER JOIN contacts c ON u.id = c.cid WHERE c.uid = '$uid' ORDER BY u.name";
	$result = $db->query($query);

	$users = array();
	
	while($fetch = $result->fetch_assoc())
		$users[] = $fetch;
	
	return $users;
}

/**
/* Get users
/* @return all users registered in the application
/**/
function getUsers(){
	global $db;

	$query = "SELECT u.id, u.login, u.name, u.surname, u.email, u.photo FROM users u ORDER BY u.name";
	$result = $db->query($query);
	
	$users = array();
	
	while($fetch = $result->fetch_assoc())
		$users[] = $fetch;
	
	return $users;
}
/**
/* Gets thumbnails URL of the group
/* @param $gid group id to get the photos
/* @return thumbnails array with URL
/**/
function getThumbnails($gid)
{
	global $db, $user;
	
	$uid = $user['id'];
	$gid = intval($gid);
	
	$query = "SELECT * FROM photos WHERE gid='$gid' AND uid='$uid' ORDER BY id DESC";
	
	$result = $db->query($query);
	
	$photos = array();
	
	while($fetch = $result->fetch_assoc())
		$photos[] = $fetch;
	
	return $photos;

}

/**
/* Gets updates of the group
/* @param $gid group id to get the updates
/* @return array of updates
/**/
function getUpdates($gid)
{
	global $db, $user;
	
	$uid = $user['id'];
	$gid = intval($gid);
	
	if($gid == 0){
		$groupsQuery = getGroupsQuery();
		$query = "SELECT * FROM updates WHERE $groupsQuery ORDER BY id DESC LIMIT 0,10";
	}
	else
		$query = "SELECT * FROM updates WHERE gid='$gid' ORDER BY id DESC ";
		
	$result = $db->query($query);
	
	$updates = array();
	
	while($fetch = $result->fetch_assoc())
		$updates[] = $fetch;
	
	return $updates;

}

/**
/* Gets updates from all groups the user belongs to
/* @return array of updates
/**/
function getGroupsQuery()
{
	global $db, $user;
	
	$groups = getGroupsUser($user['id']);

	$query = "";
	$first = true;
	foreach($groups as $group){
		$gid = $group['id'];
		if(!$first)
			$query .= "OR ";
		$query .= "gid='$gid' ";
		$first = false;
	}
	return $query;
}

/**
/* Change user's profile photo
/* @param User id of the contact
/* @param New URL of the photo
/**/
function changeProfilePhoto($uid, $newUrl)
{
	global $db, $user;
	
	$query = "UPDATE  `users` SET  `photo` =  '$newUrl' WHERE  `id` = '$uid';";
	$result = $db->query($query);

}


/**
/* Add contact to the user's contact list
/* @param User id of the contact
/**/
function addContact($cid){
	global $db, $user;
	
	$cid = intval($cid);
	$uid = intval($user['id']);
	
	$query = "INSERT INTO contacts (`id`, `uid`, `cid`) VALUES (NULL, '$uid', '$cid')";
	$result = $db->query($query);
	
	return "200";
}

/**
/*	Check if a user belongs to a group
/* @param $uid user id of the user to check
/* @param $gid group id of the group to check
/* @return boolean, true if given user belongs to given group
**/
function isUserInGroup($uid, $gid)
{
	global $db;	
	$uid = intval($uid); $gid = intval($gid);
	
	$query = "SELECT id FROM groups_users WHERE uid='$uid' AND gid='$gid'";
	$result = $db->query($query);
	
	if($result->num_rows > 0)
		return true;
	else
		return false;
}

/**
/*	Check if a user is the creator of a group
/* @param $uid user id of the user to check
/* @param $gid group id of the group to check
/* @return boolean, true if given user is the creator of the given group
**/
function isCreatorOfGroup($uid, $gid)
{
	global $db;
	$uid = intval($uid); $gid = intval($gid);
	$query = "SELECT id FROM groups WHERE id='$gid' AND cid='$uid'";
	
	$result = $db->query($query);
	
	if($result->num_rows > 0)
		return true;
	else
		return false;
	
}

/**
/* Inserts users into group.
/* It deletes all users and insert them again.
/* Only creator of the group is allowed to do the operation
/* @param $gid group id of the group
/* @param $users array of user ids of the users to add
/* @return string non empty if ok
**/
function addUsersToGroup($gid, $users)
{
	global $db, $user;
	
	if(!isCreatorOfGroup($user['id'], $gid))
		forbidden();
		
	$creatorId = $user['id'];
	
	/* First delete all */
	$query = "DELETE FROM groups_users WHERE gid='$gid'";
	$db->query($query);
	
	foreach($users as $u)
	{
		$uid = $u;
		/* Then insert new */
		$query = "INSERT INTO groups_users (`id`, `gid`, `uid`) VALUES (NULL, '$gid', '$uid')";
		$db->query($query);

	}
	echo "Added ".count($users)." users to the group";	
}

/**
/* This function creates new group
/* @param $name Name of the group
/* @param $cid ID of the user considered as creator
/* @return GID of the created group
*/
function createGroup($name, $cid)
{
	global $db;	
	$query = "INSERT INTO groups (name, cid) VALUES ('$name', '$cid')";
	$db->query($query);
	
	return $db->lastId();
}

/**
/* This function adds an user to a group
/* @param $gid Group ID
/* @param $uid User ID
*/
function addUserToGroup($gid, $uid)
{
	global $db;
	$gid = intval($gid);
	$uid = intval($uid);
	$query = "INSERT INTO group_users (gid,uid) VALUES ('$gid', '$uid')";
	
	return $db->query($query);
}

/**
/* Crea y devuelve un cliente de Dropbox
/* @return drobox client object
**/
function newDropboxClient()
{
	require_once(dirname(__FILE__)."/DropboxClient.php");

	$dropbox =  new DropboxClient(array(
		'app_key' => "x6ipo0jmmaxu80s", 
		'app_secret' => "ilw666k3f8bre8p",
		'app_full_access' => false,
	),'en');
	
	return $dropbox;
}

/**
/* Inserta nueva 'update'
/* @param $uid user id de la persona que inserta la actualizacion
/* @param $gid gid del grupo al que corresponde
/* @param $title titulo
/* @param $description descripcion
/* @param $photo foto o icono que va asociada a la actualizacion
**/
function insertUpdate($uid, $gid, $title, $description, $photo)
{
	global $db, $user;
	
	$date = date("d/m/Y");
	$time = date("H:i");
	
	$query = "INSERT INTO updates (uid, gid, title, description, photo, date, time) VALUES 
	('$uid','$gid','$title','$description','$photo','$date','$time')";
	
	$db->query($query);

}

/**	
/* Inserta un nuevo mensaje
/* @params uid, gid, message, position
**/
function insertMessage($uid, $gid, $message, $position)
{
	global $db, $user;
	$result = $db->query("INSERT INTO messages (uid,gid,message,position) VALUES ('$uid','$gid','$message','$position')");
	if($result){
		$city = getCity($position);
		$name = $user['name'];
		$title = "Message from $name";
		$description = "$name has sent a message from $city";
		insertUpdate($uid, $gid, $title, $description, "icons/message.png");
		
		return "200";
	}
	else
		return "500";
}

function getCity($position)
{
	$data = file_get_contents("http://maps.googleapis.com/maps/api/geocode/json?latlng=$position&sensor=true");
	$json = json_decode($data, TRUE);
	
	$results = $json['results'];
	
	$components = $results[0]['address_components'];
	
	foreach($components as $component)
	{
		if(in_array("political", $component[types]))
			return $component['long_name'];
	}
	return "Unkown";	
	
}

/**
/* Gets messages of the group
/* @param $gid group id to get the messages
/* @return array of messages
/**/
function getMessages($gid)
{
	global $db, $user;
	
	$uid = $user['id'];
	$gid = intval($gid);
	
	$query = "SELECT m.*, u.login FROM messages m INNER JOIN users u ON m.uid=u.id WHERE gid='$gid'";
	
	
	$result = $db->query($query);
	
	$messages = array();
	
	while($fetch = $result->fetch_assoc())
		$messages[] = $fetch;
	
	return $messages;

}


/**
/* Get Thumnails and Messages and ordered by timestamp
/* 
*/
function getThumbnailsAndMessages($gid){
	global $db, $user;
	
	$photos = getThumbnails($gid);
	$messages = getMessages($gid);
	
	$all = array_merge($photos, $messages);
	
	return array_sort($all, 'timestamp');
}


/**	
/* Registra un nuevo usuario
/* pasando los datos en JSON en variable POST 'data' 
**/
function new_user($user)
{
	global $db;
	$login = $user['login'];
	$name = $user['name'];
	$surname = $user['surname'];
	$password = md5($user['password']);
	$email = $user['email'];
	$valid = is_valid_user($login, $password, $email);
	
	
	
	if($valid != "yes")
	{
		$return['status'] = 400;
		$return['msg'] = $valid;
		die(json_encode($return));
	}
	else
	{
		$query = "INSERT INTO `c1_click`.`users` (`id`, `login`, `name`, `surname`, `email`, `password`, `photo`, `dbtoken`) VALUES (NULL, '$login', '$name', '$surname', '$email', '$password', '', '')";
		$result = $db->query($query);
		$return['status'] = 200;
		die(json_encode($return));
	
	}
}

function is_valid_user($login, $password, $email)
{
	global $db;
	$query = "SELECT id FROM users WHERE login='$login'";
	$result = $db->query($query);
	
	if($result->num_rows > 0)
		return "Username already exists";
	else
		return "yes";

}

function array_sort($array, $on, $order=SORT_ASC){

    $new_array = array();
    $sortable_array = array();

    if (count($array) > 0) {
        foreach ($array as $k => $v) {
            if (is_array($v)) {
                foreach ($v as $k2 => $v2) {
                    if ($k2 == $on) {
                        $sortable_array[$k] = $v2;
                    }
                }
            } else {
                $sortable_array[$k] = $v;
            }
        }

        switch ($order) {
            case SORT_ASC:
                asort($sortable_array);
                break;
            case SORT_DESC:
                arsort($sortable_array);
                break;
        }

        foreach ($sortable_array as $k => $v) {
            $new_array[$k] = $array[$k];
        }
    }

    return $new_array;
}





?>