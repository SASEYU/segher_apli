
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
  
//Registro del Cliente
  document.querySelector('.clienteform').addEventListener('submit', function (e) {
    e.preventDefault();

    const Cliente = {
        nombre: document.getElementById('nombre').value,
        tipoDocumento: document.getElementById('tipoDocumento').value,
        representante: document.getElementById('representante').value,
        numeroDocumento: document.getElementById('numeroDocumento').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
    };

    localStorage.setItem('datosCliente', JSON.stringify(Cliente));
    window.location.href = 'cotizacion.html';
    alert('Datos del cliente guardados correctamente.');
});
