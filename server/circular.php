<?php


$img = $_GET['img'];

$hash = md5($img);


$base = new Imagick($img);
$mask = new Imagick('img/mask.png');

$base->resizeImage(125,125,Imagick::FILTER_LANCZOS,1);
$base->compositeImage($mask, Imagick::COMPOSITE_COPYOPACITY, 0, 0);
$base->writeImage("img/$hash.png");

header('Content-Type: image/png');

echo file_get_contents("img/$hash.png");

?>