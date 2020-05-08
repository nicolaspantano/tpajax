<?php

abstract class Persona
{
    private $_apellido;
    private $_dni;
    private $_nombre;
    private $_sexo;

    public function __construct($nombre,$apellido,$sexo,$dni){
        $this->_apellido=$apellido;
        $this->_nombre=$nombre;
        $this->_dni=$dni;
        $this->_sexo=$sexo;
    }

    public function GetApellido(){
        return $this->_apellido;
    }

    public function GetDni(){
        return $this->_dni;
    }

    public function GetNombre(){
        return $this->_nombre;
    }

    public function GetSexo(){
        return $this->_sexo;
    }

    public abstract function Hablar($idioma=array());

    public function ToString(){
        return $this->_nombre." - ".$this->_apellido." - ".$this->_sexo." - ".$this->_dni;
      }

    

    



}


