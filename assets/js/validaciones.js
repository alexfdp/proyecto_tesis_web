let banderaVisibilidad = true;
function functionVisibilidadPassword() {
    var elemento = document.getElementById("icono-eye");
    var inputPassword = document.getElementById("contrasena");
    if (banderaVisibilidad) {
        elemento.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
        inputPassword.type = "text";
        banderaVisibilidad = false;
    }
    else {
        elemento.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
        inputPassword.type = "password";
        banderaVisibilidad = true;
    }
}
