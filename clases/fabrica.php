<?php

require_once "empleado.php";
require_once "interfaces.php";

class Fabrica implements IArchivo
{
    private $_cantidadMaxima;
    private $_empleados;
    private $_razonSocial;

    public function __construct($razonSocial,$cantMax=5){
        $this->_cantidadMaxima=$cantMax;
        $this->_empleados=array();
        $this->_razonSocial=$razonSocial;
    }

    function GetEmpleados()
    {
        return $this->_empleados;
    }

    public function AgregarEmpleado($emp){
        if(count($this->_empleados)<$this->_cantidadMaxima){
            //$this->_empleados[] = $emp;
            array_push($this->_empleados,$emp);
            $this->EliminarEmpleadosRepetidos();
            return true;
        }
        return false;
    }

    public function CalcularSueldos(){
        $sueldos=0;
        foreach ($this->_empleados as $_sueldo => $valor) {
            $sueldos+=$valor;
        }
        return $sueldos;
    }

    public function EliminarEmpleado($emp){
        
        if($emp != null)
        {   
            $index=array_search($emp,$this->_empleados,true);            
            $path=$this->_empleados[$index]->GetPathFoto();
            $path=trim($path);
            unlink("../".$path);
            unset($this->_empleados[$index]); 
            return true;            
        }
                                            
        return false;
    }

    private function EliminarEmpleadosRepetidos(){
        array_unique($this->_empleados,SORT_REGULAR);
    }

    public function ToString(){
        $retorno = $this->_razonSocial . " - " . $this->_cantidadMaxima . " <br> ";
        
        for($i=0;$i<count($this->_empleados);$i++){
            $retorno = $retorno . $this->_empleados[$i]->ToString()." <br> ";
        }

        return $retorno;
    }

    public function TraerDeArchivo($nombreArchivo){

        
        $archivo=array();
        $ar = fopen("../archivos/".$nombreArchivo,"r");

        while(!feof($ar))
        {
            $listado = fgets($ar);
            $archivo = explode(" - ",$listado);
            $archivo[0] = trim($archivo[0]);
            if($archivo[0] != "")
            {
                $archivo[7] = trim($archivo[7],"\r\n");
                $this->AgregarEmpleado(new Empleado($archivo[0],$archivo[1],$archivo[2],$archivo[3],$archivo[4],$archivo[5],$archivo[6],$archivo[7]));
            }

        }
        fclose($ar);
    }

    public function GuardarEnArchivo($nombreArchivo){

        $ar = fopen("../archivos/".$nombreArchivo, "w");
        
        /*for($i=0;$i<count($this->_empleados);$i++)
        {
            if($i==count($this->_empleados)-1){                
            }
            fwrite($ar,$this->_empleados[$i]->ToString()."\r\n");
            
        }*/
        foreach ($this->_empleados as $empleado) {
            fwrite($ar,$empleado->ToString()."\r\n");
        }
        
        fclose($ar);

    }
}



