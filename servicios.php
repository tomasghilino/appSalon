<?php
header('Access-Control-Allow-Origin: *');
require 'includes/funciones.php';

$servicios = obtenerServicios();


// echo "<pre>";
//var_dump($servicios);
// echo "</pre>";

// var_dump($servicios);
echo json_encode($servicios);