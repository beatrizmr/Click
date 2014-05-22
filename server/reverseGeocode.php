<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$position = $_GET['p'];

if(trim($position) == "")
	die(json_encode("Unknown"));

$geocode=file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?latlng='.$position.'&sensor=false');


$output= json_decode($geocode, TRUE);

$components = $output[results][0][address_components];


foreach((array)$components as $component){
	if(in_array("locality", $component[types]))
		die (json_encode($component[long_name]));

}

die(json_encode($position));

//echo $output->results[0]->formatted_address;

?>