

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
    const resumen = document.getElementById("resumen-articulos");

    // Nuevo objeto para almacenar los artículos seleccionados globalmente
    const articulosSeleccionados = {};

    seccionSelect.addEventListener("change", function () {
        const seleccion = this.value;
        contenedor.innerHTML = "";

        if (articulos[seleccion]) {
            articulos[seleccion].forEach(item => {
                const itemKey = item.toLowerCase().replace(/ /g, "_");

                const div = document.createElement("div");
                div.className = "subarticulo-item";

                const label = document.createElement("label");
                label.textContent = item;

                const input = document.createElement("input");
                input.type = "number";
                input.name = `cantidad_${itemKey}`;
                input.min = "0";
                input.placeholder = "Cantidad";
                input.value = articulosSeleccionados[itemKey] || "";

                input.addEventListener("input", function () {
                    const cantidad = parseInt(this.value);
                    if (cantidad > 0) {
                        articulosSeleccionados[itemKey] = cantidad;
                    } else {
                        delete articulosSeleccionados[itemKey];
                    }
                    actualizarResumen();
                });

                div.appendChild(label);
                div.appendChild(input);
                contenedor.appendChild(div);
            });
        }

        actualizarResumen(); // muestra el resumen actualizado
    });

    function actualizarResumen() {
        resumen.innerHTML = "";

        for (const [clave, cantidad] of Object.entries(articulosSeleccionados)) {
            const nombre = clave.replace(/_/g, " ");
            const item = document.createElement("p");
            item.textContent = `${nombre}: ${cantidad}`;
            resumen.appendChild(item);
        }
    }

    const formulario = document.getElementById("cotizacion-form");
    const botonLimpiar = formulario.querySelector(".limpiar");

    botonLimpiar.addEventListener("click", function () {
        // Limpiar el objeto de artículos seleccionados
        for (const clave in articulosSeleccionados) {
            delete articulosSeleccionados[clave];
        }

        // Limpiar el submenú de artículos
        contenedor.innerHTML = "";

        // Limpiar el resumen
        resumen.innerHTML = "";

        // Reiniciar select de sección
        seccionSelect.value = "";

        // Limpiar campos del formulario
        formulario.reset();
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
