
// Este código va en "registro.js"
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html"; // O la página de login
    }
});


//Salir del programa
function cerrarSesion() {
    // Limpiar cualquier almacenamiento (si estás usando)
    localStorage.clear();
    sessionStorage.clear();
  
    // Redirigir a la página de inicio o login
    window.location.href = "index.html"; // o "login.html"
  }
  