<?php
require_once('../vendor/autoload.php');
require_once("../clases/fabrica.php");

session_start();
$dni = $_SESSION["DNIEmpleado"];

$Fabrica = new Fabrica("miFabrica",50);
$Fabrica->TraerDeArchivo("empleados.txt");

$mpdf = new \Mpdf\Mpdf();
$mpdf->SetProtection(array(), 'UserPassword',$dni );
$mpdf->SetHeader('Pantano Nicolas - Numero de pagina: {PAGENO}');
$mpdf->setFooter('https://tpajax.herokuapp.com/');
$mpdf->WriteHTML('<h1>Lista de empleados</h1><br>');

$grilla="<table>";
    foreach ($Fabrica->GetEmpleados() as $actual){      
		
    $grilla .= "<tr>
                    <td>".$actual->ToString()."</td>							
                    <td><img src='../".$actual->GetPathFoto()."' width='70px' height='70px'/></td>
               </tr>";                                                   
    }		

$grilla .= '</table>';
$mpdf->WriteHTML($grilla);
$mpdf->Output();



