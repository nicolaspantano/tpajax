<?php
require_once("../clases/fabrica.php");
 $Dni = $_POST["Dni"];
 $Apellido=$_POST["Apellido"];

 $Flag = false;

 $ar = fopen("../archivos/empleados.txt","r");

 if($ar!=null){
     while(!feof($ar)){
        while(!feof($ar))
        {
            $listado = fgets($ar);
            $archivo = explode(' - ',$listado,7);            
            @$archivo[1] = trim(@$archivo[1]);
            @$archivo[3] = trim(@$archivo[3]);
            if(@$archivo[3] == $Dni && @$archivo[1] == $Apellido)
            {
                $Flag = true;
                break;
            } 
        }
    }
}

 fclose($ar);



 if($Flag){
    session_start();
    $_SESSION["DNIEmpleado"]=$Dni;
    header('Location: ../index.php');
 }
 else{
     echo '<h2>ERROR. Empleado no encontrado</h2><h2><a href="../login.html">Volver al login</a></h2>';

 }



