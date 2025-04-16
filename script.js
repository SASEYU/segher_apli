
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("username").value;
  const clave = document.getElementById("password").value;

  if (usuario === "admin" && clave === "1234") {
      alert("Login exitoso 🎉");
      sessionStorage.setItem("usuario", usuario); // Guarda la sesión
      window.location.href = "registro.html"; // Redirige al programa
  } else {
      alert("Usuario o contraseña incorrectos ❌");
  }
});




  document.addEventListener("DOMContentLoaded", function () {
    const articulos = {
      cocina: ["Cocina", "Horno microondas", "Horno eléctrico", "Refrigerador", "Alacena", "Platos", "Cubiertos", "Vasos", "Ollas"],
      sala: ["Sofá 1 cuerpo", "Sofá 2 cuerpos", "Sofá 3 cuerpos", "Mesa centro", "Mesa comedor", "Silla comedor", "Vitrina", "Puff"],
      dormitorio: ["Cama", "Colchón", "Ropero", "Frazadas", "Cubrecamas", "Cómoda", "Alfombra", "Espejo", "Mesa de noche"],
      lavanderia: ["Lavadora", "Secadora", "Tendal"],
      oficina: ["Escritorio", "Silla oficina", "Estante", "Librero"]
    };

    const seccionSelect = document.getElementById("seccion");
    const contenedor = document.getElementById("subarticulos-container");

    seccionSelect.addEventListener("change", function () {
      const seleccion = this.value;
      contenedor.innerHTML = "";

      if (articulos[seleccion]) {
        articulos[seleccion].forEach(item => {
          const div = document.createElement("div");
          div.className = "subarticulo-item";

          const label = document.createElement("label");
          label.textContent = item;

          const input = document.createElement("input");
          input.type = "number";
          input.name = `cantidad_${item.toLowerCase().replace(/ /g, "_")}`;
          input.min = "0";
          input.placeholder = "Cantidad";

          div.appendChild(label);
          div.appendChild(input);
          contenedor.appendChild(div);
        });
      }
    });
  });


//Salir del programa
function cerrarSesion() {
  // Limpiar cualquier almacenamiento (si estás usando)
  localStorage.clear();
  sessionStorage.clear();

  // Redirigir a la página de inicio o login
  window.location.href = "index.html"; // o "login.html"
}

