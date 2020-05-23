<?php

require_once "persona.php";

class Empleado extends Persona
{
    protected $_legajo;
    protected $_sueldo;
    protected $_turno;
    protected $_pathFoto;

    public function __construct($nombre,$apellido,$sexo,$dni,$legajo,$sueldo,$turno,$pathFoto=null){
       parent::__construct($nombre,$apellido,$sexo,$dni);
        $this->_legajo=$legajo;
        $this->_sueldo=$sueldo;
        $this->_turno=$turno;
        $this->_pathFoto=$pathFoto;
    }

    public function GetLegajo(){
        return $this->_legajo;
    }

    public function GetSueldo(){
        return $this->_sueldo;
    }

    public function GetTurno(){
        return $this->_turno;
    }

    public function GetPathFoto(){
        return $this->_pathFoto;
    }

    public function SetPathFoto($foto){
        $_pathFoto=$foto;
    }

    public function Hablar($idioma=array()){
        $cadena="El empleado habla ";
        
        foreach ($idioma as $valor) {
            $cadena = $cadena . $valor . ", ";
        }
        $cadena = substr($cadena,0,-2);
        return $cadena;
        
    }

    public function ToString(){
        //return parent::ToString(). " - " . $this->_legajo . " - " . $this->_turno . " - " . $this->_sueldo;
        return parent::ToString(). " - " . $this->_legajo . " - " . $this->_sueldo . " - " . $this->_turno . " - " . $this->_pathFoto;
    }

    





}
