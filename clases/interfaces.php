<?php

interface IArchivo{
    public function TraerDeArchivo($nombreArchivo);
    public function GuardarEnArchivo($nombreArchivo);
}