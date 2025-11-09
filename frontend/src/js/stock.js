/**
 * src/js/stock.js
 * * Este script maneja la lógica para la sección de Stock.
 * - 'ajustes.html' (Manejar formulario de ajuste)
 * - 'entradas.html' (Manejar formulario de entrada)
 * - 'salidas.html' (Manejar formulario de salida)
 */

// --- API SIMULADA ---
// (En un futuro, esto vendrá de tu backend)
const api = {
    delay: (ms) => new Promise(res => setTimeout(res, ms)),
    
    /**
     * Simula el guardado de un ajuste manual de stock.
     */
    ajustarStock: async (datos) => {
        await api.delay(500); // Simula el guardado en red
        console.log("Stock ajustado (simulado):", datos);
        // En un proyecto real, esto buscaría el 'productoId'
        // y establecería su stock a 'nuevaCantidad'.
        return { success: true, datos: datos };
    },

    /**
     * Simula el registro de una entrada de stock.
     */
    registrarEntrada: async (datos) => {
        await api.delay(500);
        // En un proyecto real, esto buscaría el 'productoId'
        // y SUMARÍA la 'cantidad' a su stock actual.
        console.log("Entrada de stock registrada (simulado):", datos);
        return { success: true, datos: datos };
    },

    /**
     * Simula el registro de una salida de stock.
     */
    registrarSalida: async (datos) => {
        await api.delay(500);
        // En un proyecto real, esto buscaría el 'productoId'
        // y RESTARÍA la 'cantidad' de su stock actual.
        console.log("Salida de stock registrada (simulado):", datos);
        return { success: true, datos: datos };
    }
};
// --- FIN API SIMULADA ---


/**
 * Lógica principal que se ejecuta al cargar el DOM.
 * Detecta en qué página estamos (buscando el ID del formulario).
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Busca el formulario de 'ajustes.html'
    const formAjuste = document.getElementById('formAjusteStock');
    if (formAjuste) {
        manejarFormularioAjuste(formAjuste);
    }
    
    // 2. Busca el formulario de 'entradas.html'
    const formEntrada = document.getElementById('formEntradaStock');
    if (formEntrada) {
        manejarFormularioEntrada(formEntrada);
    }

    // 3. Busca el formulario de 'salidas.html'
    const formSalida = document.getElementById('formSalidaStock');
    if (formSalida) {
        manejarFormularioSalida(formSalida);
    }
    
});

/**
 * Maneja el envío del formulario en 'ajustes.html'
 */
function manejarFormularioAjuste(form) {
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

        const datos = {
            productoId: document.getElementById('productoId').value,
            tipoAjuste: document.getElementById('tipoAjuste').value,
            nuevaCantidad: document.getElementById('nuevaCantidad').value,
            comentarios: document.getElementById('comentarios').value
        };

        try {
            await api.ajustarStock(datos);
            alert('¡Stock ajustado con éxito!');
            form.reset(); // Limpia el formulario
        } catch (error) {
            console.error("Error al ajustar stock:", error);
            alert('Error al guardar el ajuste.');
        } finally {
            // Vuelve a habilitar el botón
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Guardar Ajuste';
        }
    });
}

/**
 * Maneja el envío del formulario en 'entradas.html'
 */
function manejarFormularioEntrada(form) {

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';

        const datos = {
            productoId: document.getElementById('productoId').value,
            cantidad: document.getElementById('cantidad').value,
            proveedor: document.getElementById('proveedor').value,
            referencia: document.getElementById('referencia').value,
            comentarios: document.getElementById('comentarios').value
        };

        try {
            await api.registrarEntrada(datos);
            alert('¡Entrada de stock registrada con éxito!');
            form.reset(); // Limpia el formulario para una nueva entrada
        } catch (error) {
            console.error("Error al registrar entrada:", error);
            alert('Error al registrar la entrada.');
        } finally {
            // Vuelve a habilitar el botón
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Registrar Entrada';
        }
    });
}


/**
 * Maneja el envío del formulario en 'salidas.html'
 */
function manejarFormularioSalida(form) {

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';

        const datos = {
            productoId: document.getElementById('productoId').value,
            cantidad: document.getElementById('cantidad').value,
            motivo: document.getElementById('motivo').value,
            referencia: document.getElementById('referencia').value,
            comentarios: document.getElementById('comentarios').value
        };

        try {
            await api.registrarSalida(datos);
            alert('¡Salida de stock registrada con éxito!');
            form.reset(); // Limpia el formulario para una nueva salida
        } catch (error) {
            console.error("Error al registrar salida:", error);
            alert('Error al registrar la salida.');
        } finally {
            // Vuelve a habilitar el botón
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Registrar Salida';
        }
    });
}