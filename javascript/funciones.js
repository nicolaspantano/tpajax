var Ajax = /** @class */ (function () {
    function Ajax() {
        var _this = this;
        this.Get = function (ruta, success, params, error) {
            if (params === void 0) { params = ""; }
            var parametros = params.length > 0 ? params : "";
            ruta = params.length > 0 ? ruta + "?" + parametros : ruta;
            _this._xhr.open('GET', ruta);
            _this._xhr.send();
            _this._xhr.onreadystatechange = function () {
                if (_this._xhr.readyState === Ajax.DONE) {
                    if (_this._xhr.status === Ajax.OK) {
                        success(_this._xhr.responseText);
                    }
                    else {
                        if (error !== undefined) {
                            error(_this._xhr.status);
                        }
                    }
                }
            };
        };
        this.Post = function (ruta, success, params, error) {
            if (params === void 0) { params = ""; }
            var parametros = params.length > 0 ? params : "";
            _this._xhr.open('POST', ruta, true);
            _this._xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            _this._xhr.send(parametros);
            _this._xhr.onreadystatechange = function () {
                if (_this._xhr.readyState === Ajax.DONE) {
                    if (_this._xhr.status === Ajax.OK) {
                        success(_this._xhr.responseText);
                    }
                    else {
                        if (error !== undefined) {
                            error(_this._xhr.status);
                        }
                    }
                }
            };
        };
        this._xhr = new XMLHttpRequest();
        Ajax.DONE = 4;
        Ajax.OK = 200;
    }
    return Ajax;
}());
/// <reference path="ajax.ts" />
window.onload = function () {
    Main.MostrarGrilla();
};
var Main;
(function (Main) {
    var ajax = new Ajax();
    function MostrarGrilla() {
        var parametros = "queHago=mostrarGrilla";
        ajax.Post("./backend/administracion.php", MostrarGrillaSuccess, parametros, Fail);
    }
    Main.MostrarGrilla = MostrarGrilla;
    function AgregarEmpleado() {
        var xmlhttp = new XMLHttpRequest();
        var frm = document.getElementById("form");
        var datos = new FormData(frm);
        var foto = document.getElementById("Foto");
        datos.append('Foto', foto.files[0]);
        datos.append("queHago", "agregarEmpleado");
        xmlhttp.open('POST', './backend/administracion.php', true);
        xmlhttp.setRequestHeader("enctype", "multipart/form-data");
        xmlhttp.send(datos);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                document.getElementById("hdnModificar").value = "";
                MostrarGrilla();
            }
        };
    }
    Main.AgregarEmpleado = AgregarEmpleado;
    function EliminarEmpleado(legajo) {
        if (!confirm("Desea ELIMINAR el empleado " + legajo + "??")) {
            return;
        }
        var parametros = "legajo=" + legajo;
        ajax.Get("./backend/eliminar.php", DeleteSuccess, parametros, Fail);
    }
    Main.EliminarEmpleado = EliminarEmpleado;
    function ModificarEmpleado(nombre, apellido, dni, legajo, sexo, turno, sueldo) {
        document.getElementById("Nombre").value = nombre;
        document.getElementById("Apellido").value = apellido;
        document.getElementById("Legajo").value = legajo;
        document.getElementById("Legajo").readOnly = true;
        document.getElementById("Sueldo").value = sueldo;
        document.getElementById("Dni").value = dni;
        document.getElementById("Dni").readOnly = true;
        var turnos = document.getElementsByName("radios");
        for (var i = 0; i < turnos.length; i++) {
            if (turnos[i].value == turno) {
                turnos[i].checked = true;
            }
        }
        if (sexo == "M") {
            document.getElementById("Sexo").selectedIndex = 1;
        }
        else {
            document.getElementById("Sexo").selectedIndex = 2;
        }
        document.getElementById("boton").value = "Modificar";
        document.getElementById("hdnModificar").value = dni;
    }
    Main.ModificarEmpleado = ModificarEmpleado;
    function MostrarGrillaSuccess(grilla) {
        document.getElementById("divGrilla").innerHTML = grilla;
        document.getElementById("Limpiar").click();
        document.getElementById("boton").value = "Enviar";
        document.getElementById("Dni").readOnly = false;
        document.getElementById("Legajo").readOnly = false;
    }
    function DeleteSuccess(retorno) {
        if (retorno != "") {
            alert(retorno);
        }
        MostrarGrilla();
    }
    function Fail(retorno) {
        console.clear();
        console.log(retorno);
        alert("Ha ocurrido un ERROR!!!");
    }
})(Main || (Main = {}));
function AdministrarValidaciones() {
    AdministrarSpanError("DniError", ValidarCamposVacios("Dni"));
    AdministrarSpanError("NombreError", ValidarCamposVacios("Nombre"));
    AdministrarSpanError("ApellidoError", ValidarCamposVacios("Apellido"));
    AdministrarSpanError("LegajoError", ValidarCamposVacios("Legajo"));
    AdministrarSpanError("SueldoError", ValidarCamposVacios("Sueldo"));
    AdministrarSpanError("FotoError", ValidarCamposVacios("Foto"));
    AdministrarSpanError("DniError", ValidarRangoNumerico(1000000, 55000000, parseInt(document.getElementById("Dni").value)));
    AdministrarSpanError("LegajoError", ValidarRangoNumerico(100, 150, parseInt(document.getElementById("Legajo").value)));
    AdministrarSpanError("SexoError", ValidarCombo("Sexo", "--"));
    var radio = ObtenerTurnoSeleccionado();
    var sueldo = parseInt(document.getElementById("Sueldo").value);
    AdministrarSpanError("SueldoError", ValidarRangoNumerico(8000, ObtenerSueldoMaximo(radio), sueldo));
    if (!VerificarValidaciones()) {
        alert("Complete los campos correctamente");
    }
    else {
        Main.AgregarEmpleado();
    }
}
function AdministrarValidacionesLogin() {
    AdministrarSpanError("DniError", ValidarRangoNumerico(1000000, 55000000, parseInt(document.getElementById("Dni").value)));
    AdministrarSpanError("DniError", ValidarCamposVacios("Dni"));
    AdministrarSpanError("ApellidoError", ValidarCamposVacios("Apellido"));
    if (!VerificarValidacionesLogin()) {
        alert("Complete los campos correctamente");
    }
    else {
        var form = (document.getElementById("login"));
        form.submit();
    }
}
function ValidarCamposVacios(idCampo) {
    if (document.getElementById(idCampo).value.length != 0) {
        return true;
    }
    return false;
}
function ValidarRangoNumerico(min, max, valor) {
    if (valor >= min && valor <= max) {
        return true;
    }
    return false;
}
function ValidarCombo(id, valor) {
    if (document.getElementById(id).value != valor) {
        return true;
    }
    return false;
}
function ObtenerTurnoSeleccionado() {
    var checks = document.getElementsByName("radios");
    var seleccionados = "";
    for (var i = 0; i < checks.length; i++) {
        var input = checks[i];
        if (input.checked === true) {
            seleccionados += input.id;
        }
    }
    return seleccionados;
}
function ObtenerSueldoMaximo(turno) {
    switch (turno) {
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
function AdministrarSpanError(id, correcto) {
    var elemento = document.getElementById(id);
    if (elemento != null) {
        if (correcto == false) {
            elemento.style.setProperty("display", "block");
        }
        else {
            elemento.style.setProperty("display", "none");
        }
    }
}
function VerificarValidacionesLogin() {
    var dnispan = document.getElementById("DniError");
    var apellidospan = document.getElementById("ApellidoError");
    if (dnispan != null) {
        if (dnispan.style.display == "block") {
            return false;
        }
    }
    if (apellidospan != null) {
        if (apellidospan.style.display == "block") {
            return false;
        }
    }
    return true;
}
function VerificarValidaciones() {
    var dnispan = document.getElementById("DniError");
    var apellidospan = document.getElementById("ApellidoError");
    var sueldospan = document.getElementById("SueldoError");
    var legajospan = document.getElementById("LegajoError");
    var nombrespan = document.getElementById("NombreError");
    var sexoerror = document.getElementById("SexoError");
    var fotoerror = document.getElementById("FotoError");
    if (dnispan != null) {
        if (dnispan.style.display == "block") {
            return false;
        }
    }
    if (apellidospan != null) {
        if (apellidospan.style.display == "block") {
            return false;
        }
    }
    if (sueldospan != null) {
        if (sueldospan.style.display == "block") {
            return false;
        }
    }
    if (legajospan != null) {
        if (legajospan.style.display == "block") {
            return false;
        }
    }
    if (nombrespan != null) {
        if (nombrespan.style.display == "block") {
            return false;
        }
    }
    if (sexoerror != null) {
        if (sexoerror.style.display == "block") {
            return false;
        }
    }
    if (fotoerror != null) {
        if (fotoerror.style.display == "block") {
            return false;
        }
    }
    return true;
}
