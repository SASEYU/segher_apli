
// =================== UTILIDADES GLOBALES ===================

function getText(id) {
    const el = document.getElementById(id);
    return el?.textContent?.trim() || '';
}

function getValue(selector) {
    const el = document.querySelector(selector);
    return el?.value?.trim() || '';
}

// =================== VALIDAR SESIÓN ===================

document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("usuario")) {
        return window.location.replace("index.html");
    }

    setupDateTimePickers();
    cargarDatosCliente();
    inicializarFormulario();
    configurarCalculoCosto();
});

// =================== CONFIGURAR DATETIME ===================

function setupDateTimePickers() {
    const fechaInicio = document.querySelector('input[name="fecha_inicio"]');
    const fechaFin = document.querySelector('input[name="fecha_fin"]');

    [fechaInicio, fechaFin].forEach(input => {
        if (input) {
            input.addEventListener('input', function () {
                if (this.value) this.blur();
            });
        }
    });
}

// =================== DATOS DE CLIENTE ===================

function cargarDatosCliente() {
    const datosCliente = JSON.parse(localStorage.getItem('datosCliente'));
    if (datosCliente) {
        document.getElementById('cliente-nombre').textContent = datosCliente.nombre || '';
        document.getElementById('cliente-dni').textContent = datosCliente.numeroDocumento || '';
        document.getElementById('cliente-telefono').textContent = datosCliente.telefono || '';
        document.getElementById('cliente-direccion').textContent = datosCliente.direccion || '';
    }
}

// =================== ARTÍCULOS ===================

const articulosDisponibles = {
    cocina: ["Cocina", "Horno microondas", "Horno eléctrico", "Refrigerador", "Alacena", "Platos", "Cubiertos", "Vasos", "Ollas"],
    sala: ["Sofá 1 cuerpo", "Sofá 2 cuerpos", "Sofá 3 cuerpos", "Mesa centro", "Mesa comedor", "Silla comedor", "Vitrina", "Puff"],
    dormitorio: ["Cama", "Colchón", "Ropero", "Frazadas", "Cubrecamas", "Cómoda", "Alfombra", "Espejo", "Mesa de noche"],
    lavanderia: ["Lavadora", "Secadora", "Tendal"],
    oficina: ["Escritorio", "Silla oficina", "Estante", "Librero"]
};

const articulosSeleccionados = {};

function inicializarFormulario() {
    const seccionSelect = document.getElementById("seccion");
    const contenedor = document.getElementById("subarticulos-container");
    const resumen = document.getElementById("resumen-articulos");
    const formulario = document.getElementById("cotizacion-form");
    const botonLimpiar = formulario.querySelector(".limpiar");

    seccionSelect.addEventListener("change", function () {
        const seleccion = this.value;
        contenedor.innerHTML = "";

        if (articulosDisponibles[seleccion]) {
            articulosDisponibles[seleccion].forEach(item => {
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
                    actualizarResumen(resumen);
                });

                div.appendChild(label);
                div.appendChild(input);
                contenedor.appendChild(div);
            });
        }

        actualizarResumen(resumen);
    });

    botonLimpiar.addEventListener("click", () => {
        for (const clave in articulosSeleccionados) delete articulosSeleccionados[clave];
        contenedor.innerHTML = "";
        resumen.innerHTML = "";
        seccionSelect.value = "";
        formulario.reset();
    });
}

function actualizarResumen(resumen) {
    resumen.innerHTML = "";
    for (const [clave, cantidad] of Object.entries(articulosSeleccionados)) {
        const nombre = clave.replace(/_/g, " ");
        const item = document.createElement("p");
        item.textContent = `${nombre}: ${cantidad}`;
        resumen.appendChild(item);
    }
}

// =================== COSTO DEL SERVICIO ===================

function configurarCalculoCosto() {
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

        let transporte = km <= 5 ? 85 : 85 + (km - 5) * 3.5;
        const transporteConGanancia = transporte * 1.35;

        const subtotal = transporteConGanancia + (ayudantes * 40) + (embalajes * 15) + (pisos * 20);
        const igv = subtotal * 0.18;
        const total = subtotal + igv;

        subtotalInput.value = subtotal.toFixed(2);
        igvInput.value = igv.toFixed(2);
        totalInput.value = total.toFixed(2);
    }

    [kilometrajeInput, ayudantesInput, embalajesInput, pisosInput].forEach(input => {
        input.addEventListener("input", calcularCosto);
    });
}

// =================== GOOGLE MAPS ===================

function abrirGoogleMaps() {
    const origen = getValue('input[name="direccion_origen"]');
    const destino = getValue('input[name="direccion_destino"]');

    if (!origen || !destino) return alert("Por favor, completa la dirección de origen y destino.");

    const url = `https://www.google.com/maps/dir/${encodeURIComponent(origen)}/${encodeURIComponent(destino)}`;
    window.open(url, '_blank');
}

// =================== CERRAR SESIÓN ===================

function cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("index.html");
}

// =================== GENERACIÓN DE PDF ===================

document.getElementById("cotizacion-form").addEventListener("submit", function (e) {
    e.preventDefault();

    if (!window.jspdf || !window.jspdf.jsPDF) return alert("Librería jsPDF no disponible");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const logoImg = document.getElementById("logo-img");
    let y = 20;

    try {
        if (logoImg?.complete) {
            doc.addImage(logoImg, "PNG", 15, 10, 30, 15);
        }

        doc.setProperties({
            title: `Cotización ${getValue('[name="codigo_atencion"]')}`,
            subject: 'Cotización de Servicio',
            creator: 'SEGHER EXPRESS'
        });

        // Título y datos de empresa
        doc.setFontSize(18).setFont('helvetica', 'bold').text('COTIZACIÓN DE SERVICIO', 105, y, { align: 'center' });
        y = 35;
        doc.setFontSize(10).setFont('helvetica', 'normal').text('SEGHER EXPRESS PERU S.A.C.', 15, y);
        doc.text('RUC: 20613399411', 15, y + 5);

        // Cliente
        y += 20;
        doc.setFontSize(12).setFont('helvetica', 'normal');
        doc.text(`Cliente: ${getText('cliente-nombre')}`, 15, y);
        doc.text(`DNI/RUC: ${getText('cliente-dni')}`, 15, y + 5);
        doc.text(`Teléfono: ${getText('cliente-telefono')}`, 15, y + 10);

        // Servicio
        y += 20;
        doc.setFont('helvetica', 'bold').text('DETALLES DEL SERVICIO', 15, y); y += 8;
        doc.setFont('helvetica', 'normal').setFontSize(10);
        doc.text(`Origen: ${getValue('[name="direccion_origen"]')}`, 15, y); y += 6;
        doc.text(`Destino: ${getValue('[name="direccion_destino"]')}`, 15, y); y += 6;
        doc.text(`Fecha: ${getValue('[name="fecha_inicio"]')}`, 15, y); y += 10;

        // Artículos
        const articulos = [];
        document.querySelectorAll('#subarticulos-container input[type="number"]').forEach(input => {
            const cantidad = parseInt(input.value);
            if (cantidad > 0) {
                const nombre = input.name.replace('cantidad_', '').replace(/_/g, ' ');
                articulos.push({ nombre, cantidad });
            }
        });

        if (articulos.length) {
            doc.setFontSize(12).setFont('helvetica', 'bold').text('ARTÍCULOS A TRANSPORTAR', 15, y); y += 8;
            doc.setFillColor(70, 130, 180).setTextColor(255).rect(15, y, 180, 6, 'F');
            doc.text('Artículo', 20, y + 4);
            doc.text('Cantidad', 190, y + 4, { align: 'right' }); y += 6;

            doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(0);
            articulos.forEach((item, i) => {
                doc.setFillColor(i % 2 ? 255 : 240);
                doc.rect(15, y, 180, 6, 'F');
                doc.text(item.nombre, 20, y + 4);
                doc.text(String(item.cantidad), 190, y + 4, { align: 'right' });
                y += 6;
                if (y > 270) { doc.addPage(); y = 20; }
            });
            y += 10;
        }

        // Costos
        doc.setFontSize(12).setFont('helvetica', 'bold').text('COSTOS ADICIONALES', 15, y); y += 8;
        doc.setFont('helvetica', 'normal').setFontSize(10);
        doc.text(`Ayudantes: S/. ${getValue('[name="ayudante"]')}`, 15, y); y += 6;
        doc.text(`Embalaje: S/. ${getValue('[name="embalaje"]')}`, 15, y); y += 6;
        doc.text(`Pisos: S/. ${getValue('[name="piso"]')}`, 15, y); y += 10;

        doc.setFont('helvetica', 'bold');
        doc.text(`Subtotal: S/. ${getValue('[name="subtotal"]')}`, 15, y); y += 6;
        doc.text(`IGV (18%): S/. ${getValue('[name="igv"]')}`, 15, y); y += 6;
        doc.setFontSize(14);
        doc.text(`TOTAL: S/. ${getValue('[name="total"]')}`, 15, y); y += 10;

        doc.save(`Cotización_${getText('cliente-nombre').replace(/\s+/g, '_')}.pdf`);
        alert("PDF generado exitosamente");
    } catch (error) {
        console.error("Error al generar PDF:", error);
        alert("Error al generar PDF: " + error.message);
    }
});

