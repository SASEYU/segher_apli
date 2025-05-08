
// Cierre automático de datetime pickers
function setupDateTimePickers() {
    const fechaInicio = document.querySelector('input[name="fecha_inicio"]');
    const fechaFin = document.querySelector('input[name="fecha_fin"]');
    
    if (fechaInicio && fechaFin) {
        fechaInicio.addEventListener('input', function() {
            if (this.value) this.blur();
        });
        
        fechaFin.addEventListener('input', function() {
            if (this.value) this.blur();
        });
    }
}


//Agregar articulos en el formulario Cotización
document.addEventListener("DOMContentLoaded", function () {
    // Validación de usuario (movido desde el segundo DOMContentLoaded)
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        window.location.replace("index.html");
    }

     // Configurar los datetime pickers
        setupDateTimePickers();

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
    const articulosSeleccionados = {};

    // Nuevo objeto para almacenar los artículos seleccionados globalmente

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


    

    document.getElementById('cotizacion-form').addEventListener('submit', function(e) {
        e.preventDefault();

         // Verificación mejorada de jsPDF
    if (!window.jspdf || !window.jspdf.jsPDF) {
        console.error('jsPDF no está disponible', window.jspdf);
        alert('Error: La librería PDF no está cargada. Recargue la página.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

            // Generar código de atención automático (nuevo código)
    const codigoAtencion = 'SH-' + Math.floor(10000 + Math.random() * 90000);
    document.querySelector('[name="codigo_atencion"]').value = codigoAtencion;
    console.log("Código generado:", codigoAtencion);

        console.log("Iniciando generación de PDF...");
    
    // Validar campos obligatorios
    const requiredFields = ['fecha_inicio', 'fecha_fin', 'direccion_origen', 'direccion_destino', 'kilometraje'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = document.querySelector(`[name="${field}"]`).value;
        if (!value) {
            alert(`Por favor complete el campo: ${field.replace('_', ' ')}`);
            isValid = false;
        }
    });
    
    if (!isValid) return;

    // Obtener el logo del HTML
    if (!window.jspdf) {
        alert('Error: La librería para generar PDF no está cargada');
        return;
    }

    const logoImg = document.getElementById('logo-img');
    if (!logoImg) {
        alert('Error al generar PDF: No se encontró el logo');
        return;
    }
    
    // Cambiar el ID para evitar el typo en futuras ejecuciones
    logoImg.id = 'logo-img';
    

    // Datos del cliente
    const nombre = document.getElementById('cliente-nombre').textContent;
    console.log("Datos cliente:", {nombre}); // Punto de verificación 5
    const dni = document.getElementById('cliente-dni').textContent;
    const telefono = document.getElementById('cliente-telefono').textContent;
    const direccion = document.getElementById('cliente-direccion').textContent;

    // Datos del formulario
    const fechaInicio = document.querySelector('[name="fecha_inicio"]').value;
    const fechaFin = document.querySelector('[name="fecha_fin"]').value;
    const origen = document.querySelector('[name="direccion_origen"]').value;
    const destino = document.querySelector('[name="direccion_destino"]').value;
    const kilometraje = document.querySelector('[name="kilometraje"]').value;
    const ayudantes = document.querySelector('[name="cantidad_ayudantes"]').value || '0';
    const embalajes = document.querySelector('[name="cantidad_embalajes"]').value || '0';
    const pisos = document.querySelector('[name="cantidad_pisos"]').value || '0';
    const subtotal = document.querySelector('[name="subtotal"]').value;
    const igv = document.querySelector('[name="igv"]').value;
    const total = document.querySelector('[name="total"]').value;
    const codigo = document.querySelector('[name="codigo_atencion"]').value;
    const observaciones = document.querySelector('[name="observaciones"]').value || 'Sin observaciones';

    // Obtener artículos seleccionados
    const articulosSeleccionados = [];
    document.querySelectorAll('#subarticulos-container input[type="number"]').forEach(input => {
        if (input.value > 0) {
            const nombre = input.name.replace('cantidad_', '').replace(/_/g, ' ');
            articulosSeleccionados.push({
                nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
                cantidad: input.value
            });
        }
    });

    // Crear PDF

    if (typeof jsPDF !== 'undefined') {
        const doc = new jsPDF();
    } else {
        console.error('jsPDF no está definido');
        alert('Error: La librería para generar PDF no está disponible');
        return;
    }
    
    // Al inicio del documento, después de crear el PDF:
    doc.setProperties({
    title: `Cotización ${codigoAtencion}`,
    subject: 'Cotización de Servicio',
    author: 'SEGHER EXPRESS PERU S.A.C.',
    keywords: 'cotización, mudanza, transporte',
    creator: 'Sistema de Cotizaciones SEGHER'
});
    
    // Configuración base de fuentes
doc.setFont('helvetica');
doc.setFontSize(8); // Tamaño base más pequeño

    // Configuración de estilos
    const primaryColor = '#2c3e50';
    const secondaryColor = '#3498db';
    doc.setFont('helvetica');
    
    // Estilo para títulos de sección
    const estiloTitulo = {
    fontSize: 10,
    textColor: '#2c3e50',
    fontStyle: 'bold'
};

// Estilo para contenido
const estiloNormal = {
    fontSize: 8,
    textColor: '#000000'
};

// Función para agregar secciones con bordes
function agregarSeccion(doc, titulo, y) {
    doc.setDrawColor(200, 200, 200); // Color gris claro
    doc.setLineWidth(0.5);
    doc.rect(15, y - 5, 180, 10); // Rectángulo del título
    
    // Estilo título de sección
    doc.setFontSize(10);
    doc.setTextColor(45, 45, 45);
    doc.setFont(undefined, 'bold');
    doc.text(titulo, 20, y);
    
    return y + 8; // Retorna nueva posición Y
}

// Ejemplo de uso en tu código:
y = agregarSeccion(doc, 'DATOS DEL CLIENTE', 55);

    // Logo y encabezado
    // Usa directamente el elemento img del DOM
    doc.addImage(logoImg, 'PNG', 15, 10, 30, 15);
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('COTIZACIÓN DE SERVICIO', 105, 20, { align: 'center' });
    
    // Información de la empresa
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont(undefined, 'normal');
    doc.text('Empresa: SEGHER EXPRESS PERU S.A.C.', 15, 30);
    doc.text('RUC: 20613399411', 15, 35);
    doc.text('Teléfono: 923223259', 15, 40);
    doc.text('Email: contacto@shexpres.com', 15, 45);
    
    // Datos del cliente
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL CLIENTE', 15, 55);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Nombre: ${nombre}`, 15, 60);
    doc.text(`DNI/RUC: ${dni}`, 15, 65);
    doc.text(`Teléfono: ${telefono}`, 15, 70);
    doc.text(`Dirección: ${direccion}`, 15, 75);
    
    // Detalles del servicio
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('DETALLES DEL SERVICIO', 15, 85);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Fecha de inicio: ${fechaInicio}`, 15, 90);
    doc.text(`Fecha de fin: ${fechaFin}`, 15, 95);
    doc.text(`Dirección origen: ${origen}`, 15, 100);
    doc.text(`Dirección destino: ${destino}`, 15, 105);
    doc.text(`Kilometraje estimado: ${kilometraje} km`, 15, 110);
    
    // Artículos (tabla)
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('ARTÍCULOS A TRANSPORTAR', 15, 120);
    
    // Crear tabla de artículos
    let y = 125;
    if (articulosSeleccionados.length > 0) {
        // Encabezado de tabla
        doc.setFillColor(70, 130, 180);
        doc.setTextColor(255);
        doc.rect(15, y, 180, 6, 'F');
        doc.text('Artículo', 17, y + 4);
        doc.text('Cantidad', 160, y + 4, { align: 'right' });
        y += 6;
        
        // Filas de artículos
        articulosSeleccionados.forEach((articulo, index) => {
            if(index % 2 === 0) {
                doc.setFillColor(240, 240, 240); // Fondo gris claro para filas pares
                doc.rect(15, y, 180, 5, 'F');
            }

            doc.setTextColor(0);
            doc.text(articulo.nombre, 17, y + 4);
            doc.text(articulo.cantidad.toString(), 160, y + 4, { align: 'right' });
            y += 5;
        });
    } else {
        doc.text('No se han seleccionado artículos', 15, y + 6);
        y += 8;
    }
    
    // Detalles adicionales del servicio
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('DETALLES ADICIONALES', 15, y);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 8;
    doc.text(`Ayudantes: ${ayudantes}`, 15, y);
    y += 6;
    doc.text(`Embalajes: ${embalajes}`, 15, y);
    y += 6;
    doc.text(`Pisos: ${pisos}`, 15, y);
    y += 10;
    
    // Observaciones
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('OBSERVACIONES', 15, y);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 8;
    const splitObservaciones = doc.splitTextToSize(observaciones, 170);
    const alturaObservaciones = splitObservaciones.length * 3.5;

    // Cuadro contenedor
doc.setDrawColor(200);
doc.rect(15, y, 180, alturaObservaciones + 4);
    doc.text(splitObservaciones, 20, y + 4);
    y += alturaObservaciones + 8;
    
    // Costos
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('DETALLE DE COSTOS', 15, y);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 10;
    doc.text('Subtotal:', 120, y, { align: 'right' });
    doc.text(`S/. ${parseFloat(subtotal).toFixed(2)}`, 180, y, { align: 'right' });
    y += 8;
    doc.text('IGV (18%):', 120, y, { align: 'right' });
    doc.text(`S/. ${parseFloat(igv).toFixed(2)}`, 180, y, { align: 'right' });
    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', 120, y, { align: 'right' });
    doc.text(`S/. ${parseFloat(total).toFixed(2)}`, 180, y, { align: 'right' });
    y += 15;
    
    // Código y firma
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Código de atención: ${codigoAtencion || 'N/A'}`, 15, y);
    y += 20;

    // Líneas de firma más elegantes
doc.setLineWidth(0.3);
doc.setDrawColor(150);
doc.line(15, y, 75, y); // Línea cliente
doc.line(120, y, 180, y); // Línea representante

doc.setFontSize(7);
doc.text('Firma del cliente', 15, y + 4);
doc.text('Firma del representante', 120, y + 4);

// Pie de página
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Gracias por preferir nuestros servicios', 105, 280, { align: 'center' });
    doc.text('Este documento es válido por 7 días a partir de la fecha de emisión', 105, 285, { align: 'center' });
    
    // Guardar PDF
    const fileName = `Cotización_${nombre.replace(/\s+/g, '_')}_${fechaInicio.split('T')[0]}.pdf`;
    console.log("Guardando PDF con nombre:", fileName); // Punto de verificación 9
    doc.save(fileName);
    alert('Cotización generada exitosamente');
});





