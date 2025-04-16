
// Este código va en "registro.js"
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html"; // O la página de login
    }
});
