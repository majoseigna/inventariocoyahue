/**
 * src/js/notificaciones.js
 * * Este script maneja la lógica para la sección de Notificaciones.
 */

// --- API SIMULADA ---
// (Datos de tu mockup Pág 23)
const db_notificaciones = [
    { id: 'N-001', titulo: 'Se acerca mantención programada | Equipo A-001', fecha: 'Fecha: 15/12/2025', tiempo: 'Hace 5 horas', leida: false },
    { id: 'N-002', titulo: 'Se acerca mantención programada | Equipo A-006', fecha: 'Fecha: 12/12/2025', tiempo: 'Hace 3 días', leida: false },
    { id: 'N-003', titulo: 'Se acerca mantención programada | Equipo A-003', fecha: 'Fecha: 05/12/2025', tiempo: 'Hace 10 días', leida: true },
    { id: 'N-004', titulo: 'Se acerca mantención programada | Equipo A-002', fecha: 'Fecha: 15/11/2025', tiempo: 'Hace 1 mes', leida: true },
];

const api = {
    delay: (ms) => new Promise(res => setTimeout(res, ms)),
    getNotificaciones: async () => {
        await api.delay(300); // Simula carga de red
        return db_notificaciones;
    }
};
// --- FIN API SIMULADA ---


/**
 * Lógica principal que se ejecuta al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Busca el contenedor 'lista-notificaciones'
    const contenedor = document.getElementById('lista-notificaciones');
    
    // 2. Si lo encuentra, ejecuta la lógica de 'listar.html'
    if (contenedor) {
        cargarListaNotificaciones(contenedor);
    }
    
});

/**
 * Carga la lista de notificaciones desde la API
 * y las "dibuja" en el contenedor.
 * @param {HTMLElement} contenedor - El div 'lista-notificaciones'
 */
async function cargarListaNotificaciones(contenedor) {
    // El spinner ya está en el HTML, así que no lo reemplazamos
    
    try {
        const notificaciones = await api.getNotificaciones();

        if (notificaciones.length === 0) {
            contenedor.innerHTML = '<div class="list-group-item text-center p-5"><p class="text-muted mb-0">No hay notificaciones.</p></div>';
            return;
        }

        let itemsHTML = '';
        notificaciones.forEach(notif => {
            // Si la notificación no está leída, le da un fondo más fuerte
            const claseLeida = notif.leida ? 'text-muted' : 'fw-bold';
            
            itemsHTML += `
                <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div>
                        <p class="mb-1 ${claseLeida}">${notif.titulo}</p>
                        <small class="text-muted">${notif.fecha}</small>
                    </div>
                    <small class="text-muted">${notif.tiempo}</small>
                </a>
            `;
        });

        // "Dibuja" todas las tarjetas en el HTML
        contenedor.innerHTML = itemsHTML;

    } catch (error) {
        console.error("Error al cargar notificaciones:", error);
        contenedor.innerHTML = '<div class="list-group-item text-center p-5"><p class="text-danger">Error al cargar las notificaciones.</p></div>';
    }
}