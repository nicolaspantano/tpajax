<?php   

    require_once("../clases/fabrica.php");

    $queHago = isset($_POST['queHago']) ? $_POST['queHago'] : NULL;
    switch($queHago){

        case"mostrarGrilla":

            $Fabrica = new Fabrica("miFabrica",50);
            $Fabrica->TraerDeArchivo("empleados.txt");

            $grilla = '<table>';  
					 	

		    foreach ($Fabrica->GetEmpleados() as $actual){
		
			$grilla .= "<tr>
							<td>".$actual->ToString()."</td>							
							<td><img src='./".$actual->GetPathFoto()."' width='70px' height='70px'/></td>
                           <td><input type='button' onclick='Main.EliminarEmpleado(".$actual->GetLegajo().")' value='Eliminar'></td>";

            $dni='"'.$actual->GetDni().'"';
            $nombre='"'.$actual->GetNombre().'"';
            $apellido='"'.$actual->GetApellido().'"';
            $legajo='"'.$actual->GetLegajo().'"';
            $sueldo='"'.$actual->GetSueldo().'"';
            $sexo='"'.$actual->GetSexo().'"';
            $turno='"'.$actual->GetTurno().'"';


            $grilla .="
                           <td><input type='button' onclick='Main.ModificarEmpleado(".$nombre.",".$apellido.",".$dni.",".$legajo.",".$sexo.",".$turno.",".$sueldo.")' value='Modificar'></td>
						</tr>";
					
		    }		
		    $grilla .= '</table>';		
		
		    echo $grilla;
		
            break;
        
         case "agregarEmpleado":


            $Fabrica = new Fabrica("miFabrica",50);
            $Fabrica->TraerDeArchivo("empleados.txt"); 

            if(isset($_POST['hdnModificar'])&&$_POST['hdnModificar']!=""){
                                       
                 foreach ($Fabrica->GetEmpleados() as $emp) {
                            if($emp->GetDni()==$_POST['hdnModificar'])
                            {                        
                                if($Fabrica->EliminarEmpleado($emp)){                           
                                 $Fabrica->GuardarEnArchivo("empleados.txt");                                                                        
        
                                }
                                break;
                            }
                }

            }
            $name=explode(".", $_FILES['Foto']['name']);
            $extension = end($name);
            $destino = "../fotos/" .$_POST["Dni"]."-".$_POST["Apellido"]. ".".$extension;
            $path = "fotos/".$_POST["Dni"]."-".$_POST["Apellido"]. ".".$extension;
            $uploadOk = TRUE;
            $tipoArchivo = pathinfo($destino, PATHINFO_EXTENSION);

            if (file_exists($destino)) {
                $uploadOk = FALSE;
            }
            
            if ($_FILES["Foto"]["size"] > 1048576 ) {
                $uploadOk = FALSE;
            }

            $esImagen = getimagesize($_FILES["Foto"]["tmp_name"]);

            if($esImagen===FALSE){
                $uploadOk = FALSE;
            }
            else
            {
                if($tipoArchivo != "jpg" && $tipoArchivo != "jpeg" && $tipoArchivo != "gif"
                    && $tipoArchivo != "png"&& $tipoArchivo != "bmp") {		
                    $uploadOk = FALSE;
                }
            }

            if ($uploadOk === TRUE) {

                if (move_uploaded_file($_FILES["Foto"]["tmp_name"], $destino)) {
                    echo "<br/>El archivo ". basename( $_FILES["Foto"]["name"]). " ha sido subido exitosamente.";
                    $Empleado = new Empleado($_POST["Nombre"],$_POST["Apellido"],$_POST["Sexo"],$_POST["Dni"],$_POST["Legajo"],$_POST["Sueldo"],$_POST["radios"],$path);                            
                    if($Fabrica->AgregarEmpleado($Empleado)){
                    $Fabrica->GuardarEnArchivo("empleados.txt");                
                    }
                }
            }
            else{
                echo "No se pudo subir el archivo<br>";
            }

           
                


    }
    




