<?php

$db = mysqli_connect('localhost','root','root','appsalon');
mysqli_set_charset($db,"utf8");

if(!$db){
    echo 'error';
    exit;
}

//echo "conectado";

