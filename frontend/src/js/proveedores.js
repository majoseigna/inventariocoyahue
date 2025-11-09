// --- API SIMULADA ---
// (En un futuro, esto se conectará a tu backend)
let db_proveedores = [
    { id: 'P-001', nombre: 'HP Inc.', rut: '76.123.456-7', nombre_legal: 'HP INC CHILE', ubicacion: 'Av. Kennedy 123', telefono: '+56911112222', email: 'contacto@hp.cl' },
    { id: 'P-002', nombre: 'Dell Chile', rut: '77.321.654-K', nombre_legal: 'DELL COMPUTER S.A.', ubicacion: 'Apoquindo 3000', telefono: '+56933334444', email: 'ventas@dell.cl' },
    { id: 'P-003', nombre: 'Lenovo', rut: '76.555.444-1', nombre_legal: 'Lenovo Chile Ltda.', ubicacion: 'Av. Vitacura 2939', telefono: '+56955556666', email: 'info@lenovo.cl' },
];
let id_counter = 4; // Siguiente ID a generar

const api = {
    // Simula una demora de red
    delay: (ms) => new Promise(res => setTimeout(res, ms)),

    getProveedores: async () => {
        await api.delay(300);
        return db_proveedores;
    },
    getProveedorById: async (id) => {
        await api.delay(300);
        const proveedor = db_proveedores.find(p => p.id === id);
        if (!proveedor) throw new Error("Proveedor no encontrado");
        return proveedor;
    },
    createProveedor: async (datos) => {
        await api.delay(300);
        const nuevoId = `P-${String(id_counter++).padStart(3, '0')}`;
        // Aseguramos que todos los campos del formulario estén
        const nuevoProveedor = { 
            id: nuevoId, 
            nombre: datos.nombre,
            rut: datos.rut,
            nombre_legal: datos.nombre_legal,
            ubicacion: datos.ubicacion,
            telefono: datos.telefono || 'N/A', // Añadimos campos opcionales
            email: datos.email || 'N/A'
        };
        db_proveedores.push(nuevoProveedor);
        return nuevoProveedor;
    },
    updateProveedor: async (id, datos) => {
        await api.delay(300);
        const index = db_proveedores.findIndex(p => p.id === id);
        if (index === -1) throw new Error("Proveedor no encontrado");
        
        // Actualiza el proveedor
        db_proveedores[index] = { 
            ...db_proveedores[index], // Mantiene datos antiguos (como email, tel)
            ...datos, // Sobrescribe con los datos del form
            id: id  // Asegura que el ID no cambie
        };
        return db_proveedores[index];
    },
    deleteProveedor: async (id) => {
        await api.delay(300);
        const index = db_proveedores.findIndex(p => p.id === id);
        if (index === -1) throw new Error("Proveedor no encontrado");
        
        db_proveedores = db_proveedores.filter(p => p.id !== id);
        return { success: true };
    }
    // (En un futuro, aquí iría: getProductosByProveedor(id))
};
// --- FIN API SIMULADA ---


// --- LÓGICA DEL SCRIPT ---

/**
 * Función principal que se ejecuta al cargar el DOM.
 * Detecta en qué página estamos y llama a la función correspondiente.
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA PARA 'listar.html'
    if (document.getElementById('tablaProveedores')) {
        cargarTablaProveedores();
    }

    // 2. LÓGICA PARA 'agregar.html'
    if (document.getElementById('formAgregarProveedor')) {
        manejarFormularioAgregar();
    }

    // 3. LÓGICA PARA 'editar.html'
    if (document.getElementById('formEditarProveedor')) {
        cargarDatosParaEditar();
        manejarFormularioEditar();
    }

    // 4. LÓGICA PARA 'eliminar.html'
    if (document.getElementById('formEliminarProveedor')) {
        cargarDatosParaEliminar();
        manejarFormularioEliminar();
    }

    // 5. LÓGICA PARA 'detalle.html'
    if (document.getElementById('proveedor-detalle-info')) {
        cargarDatosDetalle();
    }
});

/**
 * Lógica para la página 'listar.html'
 */
async function cargarTablaProveedores() {
    const tablaBody = document.getElementById('tablaProveedores');
    tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>';
    
    try {
        const proveedores = await api.getProveedores();
        
        if (proveedores.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay proveedores registrados.</td></tr>';
            return;
        }

        let filas = '';
        proveedores.forEach(p => {
            filas += `
                <tr>
                  <td>${p.id}</td>
                  <td>${p.nombre}</td>
                  <td>${p.telefono || 'N/A'}</td>
                  <td>${p.email || 'N/A'}</td>
                  <td class="text-center">
                    <a href="detalle.html?id=${p.id}" class="btn btn-sm btn-outline-info" title="Ver Detalles"><i class="bi bi-eye"></i></a>
                    <a href="editar.html?id=${p.id}" class="btn btn-sm btn-outline-primary" title="Editar"><i class="bi bi-pencil"></i></a>
                    <a href="eliminar.html?id=${p.id}" class="btn btn-sm btn-outline-danger" title="Eliminar"><i class="bi bi-trash"></i></a>
                  </td>
                </tr>
            `;
        });
        tablaBody.innerHTML = filas;
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
        tablaBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar datos.</td></tr>';
    }
}

/**
 * Lógica para la página 'agregar.html'
 */
function manejarFormularioAgregar() {
    const form = document.getElementById('formAgregarProveedor');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtenemos los datos del formulario
        const datos = {
            nombre: document.getElementById('nombre').value,
            rut: document.getElementById('rut').value,
            nombre_legal: document.getElementById('nombre_legal').value,
            ubicacion: document.getElementById('ubicacion').value
            // Nota: Teléfono y Email no están en el form de agregar.html
        };

        try {
            await api.createProveedor(datos);
            alert('¡Proveedor agregado con éxito!');
            window.location.href = 'listar.html'; // Vuelve a la lista
        } catch (error) {
            console.error("Error al agregar proveedor:", error);
            alert('Error al agregar proveedor.');
        }
    });
}

/**
 * Lógica para la página 'editar.html' (CARGAR DATOS)
 */
async function cargarDatosParaEditar() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert('ID de proveedor no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        const proveedor = await api.getProveedorById(id);
        
        // Rellenamos el formulario con los datos
        document.getElementById('idProveedor').value = proveedor.id;
        document.getElementById('nombre').value = proveedor.nombre;
        document.getElementById('rut').value = proveedor.rut;
        document.getElementById('nombre_legal').value = proveedor.nombre_legal;
        document.getElementById('ubicacion').value = proveedor.ubicacion;

    } catch (error) {
        console.error("Error al cargar proveedor:", error);
        alert('Error al cargar los datos del proveedor.');
        window.location.href = 'listar.html';
    }
}

/**
 * Lógica para la página 'editar.html' (GUARDAR DATOS)
 */
function manejarFormularioEditar() {
    const form = document.getElementById('formEditarProveedor');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('idProveedor').value;
        const datos = {
            nombre: document.getElementById('nombre').value,
            rut: document.getElementById('rut').value,
            nombre_legal: document.getElementById('nombre_legal').value,
            ubicacion: document.getElementById('ubicacion').value
        };

        try {
            await api.updateProveedor(id, datos);
            alert('¡Proveedor actualizado con éxito!');
            window.location.href = 'listar.html'; // Vuelve a la lista
        } catch (error) {
            console.error("Error al actualizar proveedor:", error);
            alert('Error al actualizar proveedor.');
        }
    });
}

/**
 * Lógica para la página 'eliminar.html' (CARGAR DATOS)
 */
async function cargarDatosParaEliminar() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const infoDiv = document.getElementById('proveedor-info');
    const idInput = document.getElementById('idProveedor');

    if (!id) {
        alert('ID de proveedor no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        const proveedor = await api.getProveedorById(id);
        
        // Muestra al usuario qué está borrando
        infoDiv.innerHTML = `
            <strong>ID:</strong> ${proveedor.id}<br>
            <strong>Nombre:</strong> ${proveedor.nombre}<br>
            <strong>RUT:</strong> ${proveedor.rut}
        `;
        // Guarda el ID en el formulario
        idInput.value = proveedor.id;

    } catch (error) {
        console.error("Error al cargar proveedor:", error);
        infoDiv.innerHTML = 'Error al cargar datos del proveedor.';
        // Deshabilita el botón de eliminar si no se pueden cargar los datos
        document.querySelector('button[type="submit"]').disabled = true;
    }
}

/**
 * Lógica para la página 'eliminar.html' (MANEJAR BORRADO)
 */
function manejarFormularioEliminar() {
    const form = document.getElementById('formEliminarProveedor');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('idProveedor').value;

        try {
            await api.deleteProveedor(id);
            alert('¡Proveedor eliminado con éxito!');
            window.location.href = 'listar.html'; // Vuelve a la lista
        } catch (error) {
            console.error("Error al eliminar proveedor:", error);
            alert('Error al eliminar proveedor.');
        }
    });
}

/**
 * Lógica para la página 'detalle.html' (CARGAR DATOS)
 */
async function cargarDatosDetalle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const infoDiv = document.getElementById('proveedor-detalle-info');
    const botonEditar = document.getElementById('btn-editar-proveedor');

    if (!id) {
        alert('ID de proveedor no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        const proveedor = await api.getProveedorById(id);
        
        // Rellena la lista de detalles
        infoDiv.innerHTML = `
            <dt class="col-sm-4">ID Proveedor</dt>
            <dd class="col-sm-8">${proveedor.id}</dd>
            
            <dt class="col-sm-4">Nombre</dt>
            <dd class="col-sm-8">${proveedor.nombre}</dd>
            
            <dt class="col-sm-4">RUT Empresa</dt>
            <dd class="col-sm-8">${proveedor.rut}</dd>

            <dt class="col-sm-4">Nombre Legal</dt>
            <dd class="col-sm-8">${proveedor.nombre_legal || 'N/A'}</dd>

            <dt class="col-sm-4">Ubicación</dt>
            <dd class="col-sm-8">${proveedor.ubicacion || 'N/A'}</dd>

            <dt class="col-sm-4">Teléfono</dt>
            <dd class="col-sm-8">${proveedor.telefono || 'N/A'}</dd>

            <dt class="col-sm-4">Email</dt>
            <dd class="col-sm-8">${proveedor.email || 'N/A'}</dd>
        `;

        // Asigna el link correcto al botón de editar
        botonEditar.href = `editar.html?id=${proveedor.id}`;
        
        // (Aquí iría la lógica futura para cargar la tabla de equipos)
        // const equipos = await api.getProductosByProveedor(proveedor.nombre);
        // ...
        
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        infoDiv.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
    }
}