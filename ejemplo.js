
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

// Configuración de estilos y márgenes
const PDF_CONFIG = {
    margins: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 20
    },
    styles: {
        title: { size: 16, color: [0, 51, 102] },
        subtitle: { size: 12, color: [0, 51, 102], bold: true },
        body: { size: 10, color: [0, 0, 0] },
        highlight: { size: 11, color: [0, 0, 0], bold: true },
        footer: { size: 8, color: [100, 100, 100] },
        small: { size: 8, color: [100, 100, 100] },
        firma: { size: 9, color: [0, 0, 0] }
    },
    line: {
        color: [0, 0, 0],
        width: 0.5
    },
    firmas: {
        yOffset: 10,
        anchoLinea: 70,
        espacioEntre: 30,
        espacioTexto: 12
    },
    qr: {
        size: 40,
        margin: 10
    }
};

// Función principal para generar PDF
async function generarPDFProfesional() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configuración inicial
        let y = PDF_CONFIG.margins.top;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right;
        
        // Establecer fuente base
        doc.setFont('helvetica');
        doc.setTextColor(...PDF_CONFIG.styles.body.color);
        doc.setFontSize(PDF_CONFIG.styles.body.size);
        
        // 1. Encabezado con logo y título
        y = await agregarEncabezado(doc, y, pageWidth);
        
        // 2. Sección de Datos del Cliente
        y = agregarSeccion(doc, y, 'Datos del Cliente', obtenerDatosCliente(), contentWidth);
        
        // 3. Sección de Artículos/Servicios (optimizada para espacio)
        y = agregarArticulosOptimizados(doc, y, contentWidth);
        
        // 4. Sección de Información Adicional
        const infoAdicional = obtenerInformacionAdicional();
        if (infoAdicional.length > 0) {
            y = agregarSeccion(doc, y, 'Información Adicional', infoAdicional, contentWidth);
        }
        
        // 5. Sección de Totales
        y = agregarTotalesCompactos(doc, y, contentWidth);
        
        // 6. Espacio para código QR
        y = await agregarCodigoQR(doc, y, pageWidth);
        
        // 7. Firmas completas con datos
        y = agregarFirmasCompletas(doc, y, pageWidth);
        
        // 8. Pie de página
        agregarPiePagina(doc, pageWidth);
        
        // Generar código único y guardar
        const codigo = `SH-${Math.floor(10000 + Math.random() * 90000)}`;
        doc.setFontSize(PDF_CONFIG.styles.small.size);
        doc.text(`Código de cotización: ${codigo}`, PDF_CONFIG.margins.left, y + 5);
        
        // Optimización final para una sola página
        optimizarParaUnaPagina(doc);
        
        doc.save(`Cotizacion_${codigo}.pdf`);
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        mostrarError('Ocurrió un error al generar el PDF. Por favor, intente nuevamente.');
    }
}

// ========== FUNCIONES AUXILIARES ==========

async function agregarEncabezado(doc, y, pageWidth) {
    try {
        // Intentar cargar el logo
        const logoImg = await cargarImagenBase64('imagenes/segher-logo-pdf.png');
        if (logoImg) {
            doc.addImage(logoImg, 'PNG', PDF_CONFIG.margins.left, y, 35, 12);
        }
    } catch (e) {
        console.warn('No se pudo cargar el logo:', e);
    }
    
    // Título principal
    doc.setFontSize(PDF_CONFIG.styles.title.size);
    doc.setTextColor(...PDF_CONFIG.styles.title.color);
    doc.text('COTIZACIÓN DE SERVICIO', pageWidth / 2, y + 8, { align: 'center' });
    
    // Fecha de generación
    doc.setFontSize(PDF_CONFIG.styles.small.size);
    doc.setTextColor(...PDF_CONFIG.styles.body.color);
    const fecha = new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    doc.text(`Fecha: ${fecha}`, pageWidth - PDF_CONFIG.margins.right, y + 8, { align: 'right' });
    
    return y + 15;
}

function agregarSeccion(doc, y, titulo, items, contentWidth) {
    // Verificar espacio disponible
    if (y > 250) {
        doc.addPage();
        y = PDF_CONFIG.margins.top;
    }
    
    // Título de sección
    doc.setFontSize(PDF_CONFIG.styles.subtitle.size);
    doc.setTextColor(...PDF_CONFIG.styles.subtitle.color);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo.toUpperCase(), PDF_CONFIG.margins.left, y);
    
    // Línea divisoria
    doc.setDrawColor(...PDF_CONFIG.line.color);
    doc.setLineWidth(PDF_CONFIG.line.width);
    doc.line(PDF_CONFIG.margins.left, y + 2, PDF_CONFIG.margins.left + contentWidth / 2, y + 2);
    
    // Restaurar estilo normal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(PDF_CONFIG.styles.body.size);
    doc.setTextColor(...PDF_CONFIG.styles.body.color);
    
    y += 6;
    
    // Contenido de la sección (optimizado para espacio)
    items.forEach(item => {
        if (y > 270) {
            doc.addPage();
            y = PDF_CONFIG.margins.top;
        }
        
        if (item.etiqueta && item.valor) {
            // Formato compacto para items con etiqueta-valor
            const texto = `${item.etiqueta}: ${item.valor}`;
            const lineas = doc.splitTextToSize(texto, contentWidth);
            lineas.forEach(linea => {
                doc.text(linea, PDF_CONFIG.margins.left, y);
                y += 5;
            });
        } else {
            // Formato para texto simple
            doc.text(`• ${item}`, PDF_CONFIG.margins.left, y);
            y += 5;
        }
    });
    
    return y + 5;
}

function agregarArticulosOptimizados(doc, y, contentWidth) {
    const articulos = obtenerArticulos();
    if (articulos.length === 0) {
        return agregarSeccion(doc, y, 'Servicios Contratados', ['No hay servicios seleccionados'], contentWidth);
    }
    
    // Verificar espacio disponible
    if (y > 200) {
        doc.addPage();
        y = PDF_CONFIG.margins.top;
    }
    
    // Título de sección
    doc.setFontSize(PDF_CONFIG.styles.subtitle.size);
    doc.setTextColor(...PDF_CONFIG.styles.subtitle.color);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICIOS CONTRATADOS', PDF_CONFIG.margins.left, y);
    
    // Línea divisoria
    doc.setDrawColor(...PDF_CONFIG.line.color);
    doc.setLineWidth(PDF_CONFIG.line.width);
    doc.line(PDF_CONFIG.margins.left, y + 2, PDF_CONFIG.margins.left + contentWidth / 2, y + 2);
    
    // Restaurar estilo normal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(PDF_CONFIG.styles.body.size);
    doc.setTextColor(...PDF_CONFIG.styles.body.color);
    
    y += 6;
    
    // Agregar artículos en una sola columna para ahorrar espacio
    articulos.forEach(articulo => {
        if (y > 270) {
            doc.addPage();
            y = PDF_CONFIG.margins.top;
        }
        doc.text(`• ${articulo}`, PDF_CONFIG.margins.left, y);
        y += 5;
    });
    
    return y + 5;
}

function agregarTotalesCompactos(doc, y, contentWidth) {
    const totales = obtenerTotales();
    if (totales.length === 0) return y;
    
    // Verificar espacio disponible
    if (y > 230) {
        doc.addPage();
        y = PDF_CONFIG.margins.top;
    }
    
    // Fondo resaltado más delgado
    doc.setFillColor(240, 240, 240);
    doc.rect(PDF_CONFIG.margins.left, y, contentWidth, 15, 'F');
    
    // Texto de totales compacto
    doc.setFontSize(PDF_CONFIG.styles.highlight.size);
    doc.setTextColor(...PDF_CONFIG.styles.highlight.color);
    doc.setFont('helvetica', 'bold');
    
    let x = PDF_CONFIG.margins.left + contentWidth - 45;
    
    totales.forEach(total => {
        doc.text(`${total.etiqueta}: S/ ${total.valor}`, x, y + 7, { align: 'right' });
        y += 5;
    });
    
    return y + 10;
}

async function agregarCodigoQR(doc, y, pageWidth) {
    // Verificar si hay espacio suficiente
    if (y > 180) {
        doc.addPage();
        y = PDF_CONFIG.margins.top;
    }
    
    // Espacio para el código QR
    doc.setFontSize(PDF_CONFIG.styles.small.size);
    doc.setTextColor(...PDF_CONFIG.styles.small.color);
    doc.text('Métodos de pago:', PDF_CONFIG.margins.left, y + 5);
    
    // Rectángulo placeholder para el QR
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(
        pageWidth/2 - PDF_CONFIG.qr.size/2, 
        y + 10, 
        PDF_CONFIG.qr.size, 
        PDF_CONFIG.qr.size
    );
    
    doc.setFontSize(PDF_CONFIG.styles.small.size);
    doc.text('(Código QR para pago)', pageWidth/2, y + 15 + PDF_CONFIG.qr.size, { align: 'center' });
    
    return y + 20 + PDF_CONFIG.qr.size;
}

function agregarFirmasCompletas(doc, y, pageWidth) {
    // Verificar si hay espacio suficiente
    if (y > 160) { // Dejar suficiente espacio para las firmas
        doc.addPage();
        y = PDF_CONFIG.margins.top;
    }

    const centroPagina = pageWidth / 2;
    const anchoTotalFirmas = (PDF_CONFIG.firmas.anchoLinea * 2) + PDF_CONFIG.firmas.espacioEntre;
    const inicioFirmas = centroPagina - (anchoTotalFirmas / 2);

    // Estilo para firmas
    doc.setFontSize(PDF_CONFIG.styles.firma.size);
    doc.setTextColor(...PDF_CONFIG.styles.firma.color);
    doc.setFont('helvetica', 'normal');
    
    // Firma Transportista (izquierda)
    const xTransportista = inicioFirmas + (PDF_CONFIG.firmas.anchoLinea / 2);
    
    // Línea de firma
    doc.setDrawColor(...PDF_CONFIG.line.color);
    doc.setLineWidth(PDF_CONFIG.line.width);
    doc.line(
        inicioFirmas, 
        y + PDF_CONFIG.firmas.yOffset,
        inicioFirmas + PDF_CONFIG.firmas.anchoLinea, 
        y + PDF_CONFIG.firmas.yOffset
    );
    
    // Texto bajo la línea
    doc.text('Firma Transportista', xTransportista, y + PDF_CONFIG.firmas.yOffset + 5, { align: 'center' });
    
    // Datos del transportista
    doc.setFontSize(PDF_CONFIG.styles.small.size);
    doc.text('Nombre: ______________________', xTransportista, y + PDF_CONFIG.firmas.yOffset + 10, { align: 'center' });
    doc.text('DNI: ______________________', xTransportista, y + PDF_CONFIG.firmas.yOffset + 16, { align: 'center' });

    // Firma Cliente (derecha)
    const xCliente = inicioFirmas + PDF_CONFIG.firmas.anchoLinea + PDF_CONFIG.firmas.espacioEntre + (PDF_CONFIG.firmas.anchoLinea / 2);
    
    // Línea de firma
    doc.line(
        inicioFirmas + PDF_CONFIG.firmas.anchoLinea + PDF_CONFIG.firmas.espacioEntre, 
        y + PDF_CONFIG.firmas.yOffset,
        inicioFirmas + (PDF_CONFIG.firmas.anchoLinea * 2) + PDF_CONFIG.firmas.espacioEntre, 
        y + PDF_CONFIG.firmas.yOffset
    );
    
    // Texto bajo la línea
    doc.setFontSize(PDF_CONFIG.styles.firma.size);
    doc.text('Firma Cliente', xCliente, y + PDF_CONFIG.firmas.yOffset + 5, { align: 'center' });
    
    // Datos del cliente
    doc.setFontSize(PDF_CONFIG.styles.small.size);
    doc.text('Nombre: ______________________', xCliente, y + PDF_CONFIG.firmas.yOffset + 10, { align: 'center' });
    doc.text('DNI: ______________________', xCliente, y + PDF_CONFIG.firmas.yOffset + 16, { align: 'center' });

    return y + PDF_CONFIG.firmas.yOffset + 25;
}

function optimizarParaUnaPagina(doc) {
    const paginas = doc.internal.getNumberOfPages();
    if (paginas > 1) {
        console.log('Documento de', paginas, 'páginas. Para una sola página, considera reducir la cantidad de artículos o información.');
    }
}

function agregarPiePagina(doc, pageWidth) {
    doc.setFontSize(PDF_CONFIG.styles.footer.size);
    doc.setTextColor(...PDF_CONFIG.styles.footer.color);
    doc.setFont('helvetica', 'normal');
    doc.text('© Segher Transportes | contacto@segher.com | RUC: 12345678901', 
             pageWidth / 2, 287, { align: 'center' });
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message') || document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    errorDiv.style.margin = '10px 0';
    errorDiv.style.border = '1px solid red';
    errorDiv.style.borderRadius = '5px';
    errorDiv.textContent = mensaje;
    
    if (!document.getElementById('error-message')) {
        errorDiv.id = 'error-message';
        document.body.prepend(errorDiv);
    }
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Funciones para obtener datos
function obtenerDatosCliente() {
    return [
        { etiqueta: 'Nombre', valor: getValue('cliente-nombre') },
        { etiqueta: 'DNI', valor: getValue('cliente-dni') },
        { etiqueta: 'Teléfono', valor: getValue('cliente-telefono') },
        { etiqueta: 'Dirección', valor: getValue('cliente-direccion') },
        { etiqueta: 'Fecha Inicio', valor: getValue('input[name="fecha_inicio"]') },
        { etiqueta: 'Fecha Fin', valor: getValue('input[name="fecha_fin"]') },
        { etiqueta: 'Origen', valor: getValue('input[name="direccion_origen"]') },
        { etiqueta: 'Destino', valor: getValue('input[name="direccion_destino"]') },
        { etiqueta: 'Kilometraje', valor: getValue('input[name="kilometraje"]') }
    ].filter(item => item.valor);
}

function obtenerArticulos() {
    const resumen = document.getElementById('resumen-articulos');
    if (!resumen) return ['No se encontraron servicios'];
    
    const items = resumen.querySelectorAll('p');
    return items.length > 0 
        ? Array.from(items).map(item => item.textContent.trim())
        : ['No hay servicios seleccionados'];
}

function obtenerInformacionAdicional() {
    return [
        { etiqueta: 'Ayudantes', valor: getValue('input[name="cantidad_ayudantes"]') || '0' },
        { etiqueta: 'Embalajes', valor: getValue('input[name="cantidad_embalajes"]') || '0' },
        { etiqueta: 'Pisos', valor: getValue('input[name="cantidad_pisos"]') || '0' },
        { etiqueta: 'Observaciones', valor: getValue('textarea[name="observaciones"]') }
    ].filter(item => item.valor && item.valor !== '0');
}

function obtenerTotales() {
    return [
        { etiqueta: 'Subtotal', valor: getValue('input[name="subtotal"]') },
        { etiqueta: 'IGV (18%)', valor: getValue('input[name="igv"]') },
        { etiqueta: 'TOTAL', valor: getValue('input[name="total"]') }
    ].filter(item => item.valor);
}

function getValue(selector) {
    const element = document.querySelector(selector) || document.getElementById(selector);
    if (!element) return null;
    return element.value ? element.value.trim() : element.textContent.trim();
}

async function cargarImagenBase64(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function() {
            resolve(null);
        };
        img.src = url;
    });
}

// Integración con el formulario
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('cotizacion-form');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btnGuardar = document.getElementById('btnGuardar');
            if (!btnGuardar) return;
            
            btnGuardar.disabled = true;
            const textoOriginal = btnGuardar.textContent;
            btnGuardar.textContent = 'Generando PDF...';
            
            generarPDFProfesional().finally(() => {
                btnGuardar.textContent = textoOriginal;
                btnGuardar.disabled = false;
            });
        });
    }
});