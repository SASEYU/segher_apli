
//Agregar articulos en el formulario Cotización
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
    window.location.replace("index.html")
}


document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        window.location.replace("index.html"); // también reemplaza el historial
    }
});

//google.maps
function abrirGoogleMaps() {
    const origen = document.querySelector('input[name="direccion_origen"]').value;
    const destino = document.querySelector('input[name="direccion_destino"]').value;

    if (!origen || !destino) {
        alert("Por favor, completa la dirección de origen y destino.");
        return;
    }

    const url = `https://www.google.com/maps/dir/${encodeURIComponent(origen)}/${encodeURIComponent(destino)}`;
    window.open(url, '_blank');
}

//calculo de costo
document.addEventListener('DOMContentLoaded', function () {
    const kilometrajeInput = document.querySelector('input[name="kilometraje"]');
    const ayudantesInput = document.querySelector('input[name="cantidad_ayudantes"]');
    const embalajesInput = document.querySelector('input[name="cantidad_embalajes"]');
    const pisosInput = document.querySelector('input[name="cantidad_pisos"]');

    const subtotalInput = document.querySelector('input[name="subtotal"]');
    const igvInput = document.querySelector('input[name="igv"]');
    const totalInput = document.querySelector('input[name="total"]');

    function calcularCosto() {
        const km = parseFloat(kilometrajeInput.value) || 0;
        const ayudantes = parseInt(ayudantesInput.value) || 0;
        const embalajes = parseInt(embalajesInput.value) || 0;
        const pisos = parseInt(pisosInput.value) || 0;

        // Cálculo transporte
        let transporte = 0;
        if (km <= 5) {
            transporte = 85;
        } else {
            transporte = 85 + (km - 5) * 3.5;
        }

        // Aplicar 35% de ganancia
        const transporteConGanancia = transporte * 1.35;

        // Suma de extras
        const ayudanteCosto = ayudantes * 40;
        const embalajeCosto = embalajes * 15;
        const pisoCosto = pisos * 20;

        const subtotal = transporteConGanancia + ayudanteCosto + embalajeCosto + pisoCosto;

        const igv = subtotal * 0.18;
        const total = subtotal + igv;

        // Mostrar resultados
        subtotalInput.value = subtotal.toFixed(2);
        igvInput.value = igv.toFixed(2);
        totalInput.value = total.toFixed(2);
    }

    // Ejecutar al cambiar los campos relevantes
    [kilometrajeInput, ayudantesInput, embalajesInput, pisosInput].forEach(input => {
        input.addEventListener('input', calcularCosto);
    });
});

//Recepción de datos del formulario Registro para PDF
window.addEventListener('DOMContentLoaded', () => {
    const datosCliente = JSON.parse(localStorage.getItem('datosCliente'));

    if (datosCliente) {
        document.getElementById('cliente-nombre').textContent = datosCliente.nombre || '';
        document.getElementById('cliente-dni').textContent = datosCliente.numeroDocumento || '';
        document.getElementById('cliente-telefono').textContent = datosCliente.telefono || '';
        document.getElementById('cliente-direccion').textContent = datosCliente.direccion || '';
    }
});


//Cotización PDF
document.getElementById('cotizacion-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Datos del cliente
    const nombre = document.getElementById('cliente-nombre').textContent;
    const dni = document.getElementById('cliente-dni').textContent;
    const telefono = document.getElementById('cliente-telefono').textContent;
    const direccion = document.getElementById('cliente-direccion').textContent;

    // Datos del formulario
    const fechaInicio = document.querySelector('[name="fecha_inicio"]').value;
    const fechaFin = document.querySelector('[name="fecha_fin"]').value;
    const origen = document.querySelector('[name="direccion_origen"]').value;
    const destino = document.querySelector('[name="direccion_destino"]').value;
    const kilometraje = document.getElementById('kilometraje').value;
    const ayudantes = document.querySelector('[name="cantidad_ayudantes"]').value;
    const embalajes = document.querySelector('[name="cantidad_embalajes"]').value;
    const pisos = document.querySelector('[name="cantidad_pisos"]').value;
    const subtotal = document.querySelector('[name="subtotal"]').value;
    const igv = document.querySelector('[name="igv"]').value;
    const total = document.querySelector('[name="total"]').value;
    const codigo = document.querySelector('[name="codigo_atencion"]').value;
    const resumenArticulos = document.getElementById('resumen-articulos').innerText || 'Sin artículos registrados.';

    // Crear PDF
    /*const { jsPDF } = window.jspdf;
    const doc = new jsPDF();*/
    const generatePDF = () => {
        const doc = new jsPDF();

        


 // Aquí va tu base64 completo
doc.addImage(logoBase64, 'PNG', 10, 10, 40, 20);
generarContenidoPDF(doc);

    logo.onerror = function () {
        console.warn('No se pudo cargar el logo. Se generará el PDF sin logo.');
        generarContenidoPDF(doc); // Igual genera el contenido sin logo
    };

    function generarContenidoPDF(doc) {
        let y = 40;
        doc.setFontSize(12);
        doc.text('DATOS DEL CLIENTE', 10, y); y += 8;
        doc.text(`Nombre: ${nombre}`, 10, y); y += 6;
        doc.text(`DNI: ${dni}`, 10, y); y += 6;
        doc.text(`Teléfono: ${telefono}`, 10, y); y += 6;
        doc.text(`Dirección: ${direccion}`, 10, y); y += 10;

        doc.text('COTIZACIÓN', 10, y); y += 8;
        doc.text(`Inicio: ${fechaInicio}`, 10, y); y += 6;
        doc.text(`Fin: ${fechaFin}`, 10, y); y += 6;
        doc.text(`Origen: ${origen}`, 10, y); y += 6;
        doc.text(`Destino: ${destino}`, 10, y); y += 6;
        doc.text(`Kilometraje: ${kilometraje} km`, 10, y); y += 10;

        doc.text('RESUMEN DE ARTÍCULOS', 10, y); y += 8;
        doc.text(resumenArticulos, 10, y); y += 10;

        doc.text('DETALLES DEL SERVICIO', 10, y); y += 8;
        doc.text(`Ayudantes: ${ayudantes}`, 10, y); y += 6;
        doc.text(`Embalajes: ${embalajes}`, 10, y); y += 6;
        doc.text(`Pisos: ${pisos}`, 10, y); y += 10;

        doc.text('COSTOS', 10, y); y += 8;
        doc.text(`Subtotal: S/. ${subtotal}`, 10, y); y += 6;
        doc.text(`IGV: S/. ${igv}`, 10, y); y += 6;
        doc.text(`Total: S/. ${total}`, 10, y); y += 6;
        doc.text(`Código: ${codigo}`, 10, y); y += 6;

        doc.save('cotizacion.pdf');
    }

    alert('Datos guardados correctamente. Se generó el PDF.');
});
