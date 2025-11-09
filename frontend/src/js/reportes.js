/**
 * src/js/reportes.js
 * * Este script maneja la lógica para:
 * 1. listar.html (Formulario de Generar y Tabla de Historial)
 * 2. detalle.html (Página de detalle)
 */

// --- API SIMULADA ---
let db_historial = [
    { id: 'RPT-0012', tipo: 'Inv. General', parametros: 'Ninguno', formato: 'PDF', fecha: '24/09/2025 10:30', usuario: 'Admin' },
    { id: 'RPT-0011', tipo: 'Ant. Equipos', parametros: 'Tipo: Notebook', formato: 'EXCEL', fecha: '23/09/2025 17:45', usuario: 'TI (Juan T.)' },
    { id: 'RPT-0010', tipo: 'Comp. Provee', parametros: 'Proveedor: TechCorp', formato: 'PDF', fecha: '23/09/2025 11:20', usuario: 'TI (Juan T.)' }
];
let rpt_id_counter = 13;

const api = {
    delay: (ms) => new Promise(res => setTimeout(res, ms)),
    
    getHistorial: async () => {
        await api.delay(300); 
        return db_historial.slice().reverse();
    },
    
    getReporteById: async (id) => {
        await api.delay(300);
        const reporte = db_historial.find(r => r.id === id);
        if (!reporte) throw new Error("Reporte no encontrado");
        return reporte;
    },

    generarReporte: async (datos) => {
        await api.delay(500);
        
        const nuevoId = `RPT-${String(rpt_id_counter++).padStart(4, '0')}`;
        const fechaActual = new Date();
        const fechaFormato = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}`;
        
        const nuevoReporte = {
            id: nuevoId,
            tipo: datos.tipoReporte.split(" ")[0], // "Inv. General"
            parametros: datos.parametro || 'Ninguno',
            formato: datos.formato,
            fecha: fechaFormato,
            usuario: 'Usuario (Tú)' 
        };
        db_historial.push(nuevoReporte);
        console.log("DB de Historial actualizada:", db_historial);
        return nuevoReporte;
    }
};
// --- FIN API SIMULADA ---


/**
 * Lógica principal que se ejecuta al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para 'listar.html' ---
    const tablaBody = document.getElementById('historial-reportes-body');
    if (tablaBody) {
        cargarHistorialReportes(tablaBody);
    }
    
    const formGenerar = document.getElementById('formGenerarReporte');
    if (formGenerar) {
        manejarFormularioGenerar(formGenerar, tablaBody);
    }
    
    // --- Lógica para 'detalle.html' ---
    const detalleInfo = document.getElementById('detalle-reporte-info');
    if (detalleInfo) {
        cargarDatosDetalle(detalleInfo);
    }
    
});

/**
 * Carga la tabla de historial de reportes
 */
async function cargarHistorialReportes(tablaBody) {
    tablaBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center p-4">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </td>
        </tr>`;

    try {
        const historial = await api.getHistorial();

        if (historial.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay reportes generados.</td></tr>';
            return;
        }

        let filasHTML = '';
        historial.forEach(rpt => {
            filasHTML += `
                <tr>
                    <!-- El ID ahora es un link -->
                    <td><a href="detalle.html?id=${rpt.id}">${rpt.id}</a></td>
                    <td>${rpt.tipo}</td>
                    <td>${rpt.parametros}</td>
                    <td><span class="badge bg-secondary">${rpt.formato}</span></td>
                    <td>${rpt.fecha}</td>
                    <td>${rpt.usuario}</td>
                </tr>
            `;
        });

        tablaBody.innerHTML = filasHTML;

    } catch (error) {
        console.error("Error al cargar historial:", error);
        tablaBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar el historial.</td></tr>';
    }
}

/**
 * Maneja el envío del formulario 'formGenerarReporte'
 */
function manejarFormularioGenerar(form, tablaBody) {
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generando...';

        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());

        console.log("Generando reporte con datos:", datos);

        try {
            await api.generarReporte(datos);
            alert('¡Reporte generado con éxito!');
            
            // Refresca la tabla del historial
            if (tablaBody) {
                cargarHistorialReportes(tablaBody);
            }

        } catch (error) {
            console.error("Error al generar reporte:", error);
            alert('Error al generar el reporte.');
        } finally {
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-file-earmark-check me-2"></i>Generar';
        }
    });
}

/**
 * Carga los datos del reporte en 'detalle.html'
 */
async function cargarDatosDetalle(infoDiv) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const tituloEl = document.getElementById('detalle-titulo');

    if (!id) {
        alert('ID de reporte no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        const reporte = await api.getReporteById(id);
        
        if (tituloEl) tituloEl.textContent = `Detalle del Reporte: ${reporte.id}`;
        
        infoDiv.innerHTML = `
            <dt class="col-sm-3">ID Reporte</dt>
            <dd class="col-sm-9">${reporte.id}</dd>
            
            <dt class="col-sm-3">Tipo</dt>
            <dd class="col-sm-9">${reporte.tipo}</dd>
            
            <dt class="col-sm-3">Parámetros</dt>
            <dd class="col-sm-9">${reporte.parametros}</dd>

            <dt class="col-sm-3">Formato</dt>
            <dd class="col-sm-9"><span class="badge bg-secondary">${reporte.formato}</span></dd>

            <dt class="col-sm-3">Fecha Generación</dt>
            <dd class="col-sm-9">${reporte.fecha}</dd>

            <dt class="col-sm-3">Generado por</dt>
            <dd class="col-sm-9">${reporte.usuario}</dd>
        `;

        const btnImprimir = document.getElementById('btn-imprimir-reporte');
        if (btnImprimir) {
            btnImprimir.addEventListener('click', () => {
                alert(`Simulando descarga/impresión del reporte ${id} en formato ${reporte.formato}...`);
            });
        }
        
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        infoDiv.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
    }
}