<?php

function obtenerServicios() : array {
    try{
        //Importar una conexion
        require 'database.php';

        

        //Escribir el codigo SQL
        $sql = "SELECT * FROM servicios;";
        $consulta = mysqli_query($db, $sql) or die(mysqli_error($db)); // Mostrar error

        $servicios = [];
        $i = 0;
        // //Obtener los resultados
        while( $row = mysqli_fetch_assoc($consulta)){ //traer todos los datos mientras existan datos
            //Arreglo vacio
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];

            $i++;
        }
        // echo "<pre>";
        // var_dump($servicios);
        // echo "</pre>";

        return $servicios;

    } catch (\Throwable $th) {
        var_dump($th);
    }
}

obtenerServicios();
