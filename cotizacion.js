
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

// =================== GENERACIÓN DE PDF MEJORADA ===================

async function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cargar logo
    const logoImg = await cargarImagenBase64('imagenes/segher-logo-pdf.png');

    // Configuración general
    doc.setFont('helvetica');
    let y = 15;

    // Logo y título
    if (logoImg) {
        doc.addImage(logoImg, 'PNG', 10, y - 5, 30, 20);
    }
    doc.setFontSize(18);
    doc.text('Cotización del Servicio', 105, y, { align: 'center' });

    // Subtítulo: Datos del Cliente
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setDrawColor(0);
    doc.line(10, y, 200, y);
    y += 6;
    doc.text('Datos del Cliente', 10, y);
    y += 6;

    const datosCliente = [
        `Nombre: ${getText('cliente-nombre')}`,
        `DNI: ${getText('cliente-dni')}`,
        `Teléfono: ${getText('cliente-telefono')}`,
        `Dirección: ${getText('cliente-direccion')}`,
        `Fecha/Hora Inicio: ${getValue('input[name="fecha_inicio"]')}`,
        `Fecha/Hora Fin: ${getValue('input[name="fecha_fin"]')}`,
        `Dirección Origen: ${getValue('input[name="direccion_origen"]')}`,
        `Dirección Destino: ${getValue('input[name="direccion_destino"]')}`,
        `Kilometraje: ${getValue('input[name="kilometraje"]')} km`
    ];

    datosCliente.forEach(linea => {
        doc.text(linea, 12, y);
        y += 6;
    });

    // Sección: Resumen de Artículos
    y = agregarSubtitulo(doc, y, 'Resumen de Artículos');
    const resumen = document.getElementById('resumen-articulos');
    const items = resumen.querySelectorAll('p');
    if (items.length === 0) {
        doc.text('Sin artículos seleccionados.', 12, y);
        y += 6;
    } else {
        items.forEach(item => {
            doc.text(item.textContent, 12, y);
            y += 6;
        });
    }

    // Observaciones
    y = agregarSubtitulo(doc, y, 'Observaciones');
    const obs = getValue('textarea[name="observaciones"]');
    doc.text(obs || 'Sin observaciones.', 12, y);
    y += 12;

    // Ayudante, Embalaje, Pisos
    const ayudante = getValue('input[name="cantidad_ayudantes"]') || '0';
    const embalaje = getValue('input[name="cantidad_embalajes"]') || '0';
    const pisos = getValue('input[name="cantidad_pisos"]') || '0';

    y = agregarSubtitulo(doc, y, 'Ayudante');
    doc.text(`Cantidad de ayudantes: ${ayudante}`, 12, y); y += 6;
    y = agregarSubtitulo(doc, y, 'Embalaje');
    doc.text(`Cantidad de embalajes: ${embalaje}`, 12, y); y += 6;
    y = agregarSubtitulo(doc, y, 'Pisos');
    doc.text(`Cantidad de pisos: ${pisos}`, 12, y); y += 12;

    // Costo del Servicio
    y = agregarSubtitulo(doc, y, 'Costo del Servicio');
    const subtotal = getValue('input[name="subtotal"]');
    const igv = getValue('input[name="igv"]');
    const total = getValue('input[name="total"]');
    const codigo = `SH-${Math.floor(10000 + Math.random() * 89999)}`;

    doc.text(`Subtotal: S/ ${subtotal}`, 12, y); y += 6;
    doc.text(`IGV (18%): S/ ${igv}`, 12, y); y += 6;
    doc.text(`Total: S/ ${total}`, 12, y); y += 6;
    doc.text(`Código de Atención: ${codigo}`, 12, y); y += 12;

    // Firmas
    doc.line(30, y + 10, 80, y + 10);
    doc.text('Firma del Transportista', 30, y + 15);
    doc.line(120, y + 10, 170, y + 10);
    doc.text('Firma del Cliente', 120, y + 15);

    // Pie de página (opcional)
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('© Segher Transportes | contacto@segher.com | RUC: 12345678901', 105, 285, { align: 'center' });

    // Guardar PDF
    doc.save(`Cotizacion_${codigo}.pdf`);
}

// ========== FUNCIONES AUXILIARES ==========

function agregarSubtitulo(doc, y, texto) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 128);
    doc.text(texto, 10, y);
    y += 6;
    doc.setTextColor(0);
    return y;
}

function cargarImagenBase64(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function () {
            resolve(null);
        };
        img.src = url;
    });
}


