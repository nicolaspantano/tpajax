/// <reference path="ajax.ts" />

window.onload = ():void => {
    Main.MostrarGrilla();
}; 

namespace Main{

    let ajax : Ajax = new Ajax();

    export function MostrarGrilla():void {

        let parametros:string = `queHago=mostrarGrilla`;

        ajax.Post("./backend/administracion.php", 
                    MostrarGrillaSuccess, 
                    parametros, 
                    Fail);            
    }

    export function AgregarEmpleado():void{
        var xmlhttp = new XMLHttpRequest();
        var frm = <HTMLFormElement>document.getElementById("form");
        var datos = new FormData(frm);
        let foto : any = (<HTMLInputElement> document.getElementById("Foto"));
        datos.append('Foto', foto.files[0]);
        datos.append("queHago","agregarEmpleado");    
        xmlhttp.open('POST', './backend/administracion.php', true);
        xmlhttp.setRequestHeader("enctype", "multipart/form-data");
        xmlhttp.send(datos);
        
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                (<HTMLInputElement>document.getElementById("hdnModificar")).value="";
                MostrarGrilla();
            }
        }
    }
                    
    

    export function EliminarEmpleado(legajo:number):void {

       if(!confirm("Desea ELIMINAR el empleado "+legajo+"??")){
            return;
        }

        let parametros:string = `legajo=`+legajo;
        
        ajax.Get("./backend/eliminar.php", 
        DeleteSuccess, 
        parametros, 
        Fail);
        
    }

    export function ModificarEmpleado(nombre:string,apellido:string,dni:string,legajo:string,sexo:string,turno:string,sueldo:string):void {
        
        (<HTMLInputElement>document.getElementById("Nombre")).value=nombre;
        (<HTMLInputElement>document.getElementById("Apellido")).value=apellido;
        (<HTMLInputElement>document.getElementById("Legajo")).value=legajo;
        (<HTMLInputElement>document.getElementById("Legajo")).readOnly=true;
        (<HTMLInputElement>document.getElementById("Sueldo")).value=sueldo;        
        (<HTMLInputElement>document.getElementById("Dni")).value=dni;
        (<HTMLInputElement>document.getElementById("Dni")).readOnly=true;

        let turnos : HTMLCollectionOf<HTMLInputElement> = <HTMLCollectionOf<HTMLInputElement>><unknown> document.getElementsByName("radios");
        for(let i=0;i<turnos.length;i++){            
            if(turnos[i].value==turno){
                turnos[i].checked = true;
            }
        }

        if(sexo=="M"){
            (<HTMLSelectElement>document.getElementById("Sexo")).selectedIndex=1;
        }
        else
        {
            (<HTMLSelectElement>document.getElementById("Sexo")).selectedIndex=2;
        }

        (<HTMLInputElement>document.getElementById("boton")).value="Modificar";

        (<HTMLInputElement>document.getElementById("hdnModificar")).value=dni;

        

    }


    function MostrarGrillaSuccess(grilla:string):void {       
        (<HTMLDivElement>document.getElementById("divGrilla")).innerHTML = grilla;
        (<HTMLInputElement>document.getElementById("Limpiar")).click();
        (<HTMLInputElement>document.getElementById("boton")).value="Enviar";
        (<HTMLInputElement>document.getElementById("Dni")).readOnly=false;
        (<HTMLInputElement>document.getElementById("Legajo")).readOnly=false;

    }

    function DeleteSuccess(retorno:string):void {       
        if(retorno!=""){
            alert(retorno);
        }
        MostrarGrilla();
    }

    function Fail(retorno:string):void {
        console.clear();
        console.log(retorno);
        alert("Ha ocurrido un ERROR!!!");
    }

    

}

function AdministrarValidaciones():void 
    {
    
    AdministrarSpanError("DniError",ValidarCamposVacios("Dni"));
    AdministrarSpanError("NombreError",ValidarCamposVacios("Nombre"));
    AdministrarSpanError("ApellidoError",ValidarCamposVacios("Apellido"));
    AdministrarSpanError("LegajoError",ValidarCamposVacios("Legajo"));
    AdministrarSpanError("SueldoError",ValidarCamposVacios("Sueldo"));
    AdministrarSpanError("FotoError",ValidarCamposVacios("Foto"));

    AdministrarSpanError("DniError",ValidarRangoNumerico(1000000,55000000,parseInt((<HTMLInputElement>document.getElementById("Dni")).value)));
    AdministrarSpanError("LegajoError",ValidarRangoNumerico(100,150,parseInt((<HTMLInputElement>document.getElementById("Legajo")).value)));       
    AdministrarSpanError("SexoError",ValidarCombo("Sexo","--"));


    let radio=ObtenerTurnoSeleccionado();
    let sueldo : number =parseInt((<HTMLInputElement>document.getElementById("Sueldo")).value);
    
    AdministrarSpanError("SueldoError",ValidarRangoNumerico(8000,ObtenerSueldoMaximo(radio),sueldo));   

    if(!VerificarValidaciones()){
        alert("Complete los campos correctamente");
    }
    else
    {                  
        Main.AgregarEmpleado();
    } 
       
    }               
    

    function AdministrarValidacionesLogin():void{

       
    AdministrarSpanError("DniError",ValidarRangoNumerico(1000000,55000000,parseInt((<HTMLInputElement>document.getElementById("Dni")).value)));
    AdministrarSpanError("DniError",ValidarCamposVacios("Dni"));   
    AdministrarSpanError("ApellidoError",ValidarCamposVacios("Apellido"));

    if(!VerificarValidacionesLogin()){
        alert("Complete los campos correctamente");                	    	
    }
    else{
        var form = <HTMLFormElement>(document.getElementById("login"));
        form.submit();
    }
    
   

}





function ValidarCamposVacios(idCampo:string):boolean {

    if((<HTMLInputElement> document.getElementById(idCampo)).value.length!=0){
       
        return true;
    }
    return false;
}


function ValidarRangoNumerico(min:number,max:number,valor:number):boolean{

    if(valor>=min&&valor<=max)
    {
        return true;
    }    
    return false;
}




function ValidarCombo(id : string, valor : string):boolean
    {
        if((<HTMLInputElement> document.getElementById(id)).value!= valor)
        {
            return true;
        }
        return false;
    }


function ObtenerTurnoSeleccionado():string{
    
       
        
        let checks : HTMLCollectionOf<HTMLInputElement> = <HTMLCollectionOf<HTMLInputElement>><unknown> document.getElementsByName("radios");
        let seleccionados : string = "";
         
        for(let i=0;i<checks.length;i++){
            let input = checks[i];

            if(input.checked===true){
                seleccionados+=input.id;
            }
        }

        return seleccionados;

   
}



      
    



function ObtenerSueldoMaximo(turno:string):number{
    switch(turno){
        case "Mañana":
            return 20000;
            break;

        case "Tarde":
            return 18500;
            break;

        case "Noche":
            return 25000;
            break;
            
    }

    return -1;
}

function AdministrarSpanError(id:string,correcto:boolean):void{
    
    let elemento=document.getElementById(id);

    if(elemento!=null){

        if(correcto==false){            
            
            elemento.style.setProperty("display","block");
        }
        else{
            
            elemento.style.setProperty("display","none");
        }
    }
    

}

function VerificarValidacionesLogin():boolean{

    let dnispan =document.getElementById("DniError");
    let apellidospan = document.getElementById("ApellidoError");
    
    if(dnispan!=null){
        if(dnispan.style.display=="block"){
            return false;
        }
    }

    if(apellidospan!=null){
        if(apellidospan.style.display=="block"){
            return false;
        }
    }

    return true;
}

function VerificarValidaciones():boolean{

    let dnispan =document.getElementById("DniError");
    let apellidospan = document.getElementById("ApellidoError");
    let sueldospan = document.getElementById("SueldoError");
    let legajospan = document.getElementById("LegajoError");
    let nombrespan = document.getElementById("NombreError");
    let sexoerror = document.getElementById("SexoError");
    let fotoerror = document.getElementById("FotoError");


    
    if(dnispan!=null){
        if(dnispan.style.display=="block"){
            return false;
        }
    }

    if(apellidospan!=null){
        if(apellidospan.style.display=="block"){
            return false;
        }
    }

    if(sueldospan!=null){
        if(sueldospan.style.display=="block"){
            return false;
        }
    }

    if(legajospan!=null){
        if(legajospan.style.display=="block"){
            return false;
        }
    }

    if(nombrespan!=null){
        if(nombrespan.style.display=="block"){
            return false;
        }
    }

    if(sexoerror!=null){
        if(sexoerror.style.display=="block"){
            return false;
        }
    }

    if(fotoerror!=null){
        if(fotoerror.style.display=="block"){
            return false;
        }
    }

    return true;
}
