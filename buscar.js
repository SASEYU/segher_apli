//BOTON PDF

function generarPDFBusqueda() {
    const elemento = document.getElementById('seccion-cotizacion');

    // Aseguramos que el contenido se haya renderizado (por ejemplo, si es dinámico)
    setTimeout(() => {
        const opciones = {
            margin:       0.5,
            filename:     'cotizacion_servicio.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opciones).from(elemento).save();
    }, 500); // espera 500 ms
}

//Salir del programa
function cerrarSesion() {
    // Limpiar cualquier almacenamiento (si estás usando)
    localStorage.clear();
    sessionStorage.clear();

    // Redirigir a la página de inicio o login
    window.location.href = "index.html"; // o "login.html"
}