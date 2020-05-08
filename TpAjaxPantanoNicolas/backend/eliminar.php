<?php 
require_once("../clases/fabrica.php");
include_once("./validarSesion.php");

$Fabrica = new Fabrica("MiFabrica",50);
$Fabrica->TraerDeArchivo("empleados.txt");

$retorno="No se encontro al empleado";

foreach($Fabrica->GetEmpleados() as $emp){
    if($emp->GetLegajo()==$_GET['legajo']){
        $Fabrica->EliminarEmpleado($emp);      
        $Fabrica->GuardarEnArchivo("empleados.txt");
        $retorno = "";
        break;
    }
    
}

echo $retorno;




