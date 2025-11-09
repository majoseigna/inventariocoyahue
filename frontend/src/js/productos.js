/**
 * src/js/productos.js
 * * Este script maneja la lógica para:
 * 1. listar.html (Cargar tabla Y FILTRAR por categoría)
 * 2. agregar.html (Manejar formulario de agregar)
 * 3. editar.html (Cargar datos y manejar formulario de editar)
 * 4. eliminar.html (Cargar datos y manejar formulario de eliminar)
 * 5. detalle.html (Cargar datos de detalle)
 */

// --- API SIMULADA ---
// (Datos de tus mockups Pág 5, 7, 8, 9)
let db_productos = [
    { id: 'A-001', tipo: 'PC', marca: 'HP', modelo: 'ProDesk 400', serial: 'SN-HP001', estado: 'Activo', rut: '13880049-0', fecha_compra: '2021-08-02', proveedor: 'HP Inc.', usuario: 'Ana Gonzalez' },
    { id: 'A-002', tipo: 'Notebook', marca: 'Dell', modelo: 'Latitude 5420', serial: 'CN-1313232-9A', estado: 'Activo', rut: '12865080-6', fecha_compra: '2022-03-02', proveedor: 'TecnoImport Ltda.', usuario: 'Mario Perez' },
    { id: 'A-003', tipo: 'Impresora', marca: 'HP', modelo: 'LaserJet Pro', serial: 'SN-HP003', estado: 'Activo', rut: '19023063-5', fecha_compra: '2020-11-10', proveedor: 'HP Inc.', usuario: 'Carla Diaz' },
    { id: 'A-004', tipo: 'PC', marca: 'HP', modelo: 'EliteDesk 800', serial: 'SN-HP004', estado: 'Activo', rut: '11021747-1', fecha_compra: '2023-05-22', proveedor: 'HP Inc.', usuario: 'Juan T.' },
    { id: 'A-005', tipo: 'Monitor', marca: 'LG', modelo: 'UltraWide 29"', serial: 'SN-LG005', estado: 'Activo', rut: '10101772-9', fecha_compra: '2024-07-14', proveedor: 'TecnoImport Ltda.', usuario: 'Ana Gonzalez' },
    { id: 'A-006', tipo: 'Tablet', marca: 'Apple', modelo: 'iPad Air', serial: 'SN-AP006', estado: 'Activo', rut: '16622513-2', fecha_compra: '2023-10-06', proveedor: 'Apple Chile', usuario: 'Mario Perez' },
    { id: 'A-007', tipo: 'Notebook', marca: 'HP', modelo: 'Pavilion 15', serial: 'SN-HP007', estado: 'Activo', rut: '13880049-0', fecha_compra: '2023-01-15', proveedor: 'HP Inc.', usuario: 'Ana Gonzalez' }
];
let prod_id_counter = 8; // Siguiente ID a generar

// Historial simulado para la página de detalle
const db_historial = {
    'A-001': [
        { fecha: '2021-08-02', evento: 'Compra', usuario: 'Admin', comentarios: 'Ingreso inicial' },
        { fecha: '2024-11-12', evento: 'Mantención', usuario: 'Técnico', comentarios: 'Limpieza de ventiladores' }
    ],
    'A-002': [
        { fecha: '2022-03-02', evento: 'Compra', usuario: 'Admin', comentarios: 'Ingreso inicial, asignado a M. Perez' }
    ]
};

const api = {
    delay: (ms) => new Promise(res => setTimeout(res, ms)),

    // ¡getProductos AHORA ACEPTA UN FILTRO!
    getProductos: async (categoriaFiltro = null) => {
        await api.delay(300);
        if (categoriaFiltro) {
            // Devuelve solo productos que coincidan con el tipo/categoría
            return db_productos.filter(p => p.tipo.toLowerCase() === categoriaFiltro.toLowerCase());
        }
        return db_productos; // Devuelve todos si no hay filtro
    },
    getProductoById: async (id) => {
        await api.delay(300);
        const producto = db_productos.find(p => p.id === id);
        if (!producto) throw new Error("Producto no encontrado");
        return producto;
    },
    createProducto: async (datos) => {
        await api.delay(300);
        const nuevoId = `A-${String(prod_id_counter++).padStart(3, '0')}`;
        const nuevoProducto = { id: nuevoId, ...datos };
        db_productos.push(nuevoProducto);
        return nuevoProducto;
    },
    updateProducto: async (id, datos) => {
        await api.delay(300);
        const index = db_productos.findIndex(p => p.id === id);
        if (index === -1) throw new Error("Producto no encontrado");
        db_productos[index] = { ...db_productos[index], ...datos, id: id };
        return db_productos[index];
    },
    deleteProducto: async (id) => {
        await api.delay(300);
        db_productos = db_productos.filter(p => p.id !== id);
        return { success: true };
    },
    getHistorial: async (id) => {
        await api.delay(200);
        return db_historial[id] || [];
    }
};
// --- FIN API SIMULADA ---


/**
 * Lógica principal que se ejecuta al cargar el DOM.
 * Detecta en qué página estamos y llama a la función correspondiente.
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica para 'listar.html'
    const tablaBody = document.getElementById('productos-tabla-body');
    if (tablaBody) {
        // ¡NUEVA LÓGICA DE FILTRO!
        // Revisa si la URL tiene un parámetro de categoría
        // ej: ...listar.html?categoria=Notebook
        const params = new URLSearchParams(window.location.search);
        const categoria = params.get('categoria');
        
        // Pasa el filtro (si existe) a la función de carga
        cargarTablaProductos(tablaBody, categoria);
    }

    // 2. Lógica para 'agregar.html'
    const formAgregar = document.getElementById('formAgregarProducto');
    if (formAgregar) {
        manejarFormularioAgregar(formAgregar);
    }

    // 3. Lógica para 'editar.html'
    const formEditar = document.getElementById('formEditarProducto');
    if (formEditar) {
        cargarDatosParaEditar(formEditar);
        manejarFormularioEditar(formEditar);
    }

    // 4. Lógica para 'eliminar.html'
    const formEliminar = document.getElementById('formEliminarProducto');
    if (formEliminar) {
        cargarDatosParaEliminar(formEliminar);
        manejarFormularioEliminar(formEliminar);
    }

    // 5. Lógica para 'detalle.html'
    const detalleInfo = document.getElementById('producto-detalle-info');
    if (detalleInfo) {
        cargarDatosDetalle(detalleInfo);
    }
});

// ===============================================
// LÓGICA DE 'listar.html'
// ===============================================

/**
 * Carga la tabla de productos en 'listar.html'.
 * Acepta un filtro de categoría opcional.
 */
async function cargarTablaProductos(tablaBody, categoriaFiltro = null) {
    tablaBody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando...</td></tr>';

    // ¡NUEVO! Cambia el título si hay un filtro
    const tituloEl = document.getElementById('titulo-pagina-productos');
    if (categoriaFiltro && tituloEl) {
        tituloEl.innerHTML = `Productos (Categoría: ${categoriaFiltro})`;
    }

    try {
        const productos = await api.getProductos(categoriaFiltro);
        
        if (productos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron productos.</td></tr>';
            return;
        }

        let filas = '';
        productos.forEach(p => {
            filas += `
                <tr>
                  <td><strong>${p.id}</strong></td>
                  <td>${p.tipo}</td>
                  <td>${p.marca}</td>
                  <td><span class="badge bg-success">${p.estado}</span></td>
                  <td>${p.rut}</td>
                  <td>${p.fecha_compra}</td>
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
        console.error("Error al cargar productos:", error);
        tablaBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar datos.</td></tr>';
    }
}

// ===============================================
// LÓGICA DE 'agregar.html'
// ===============================================

function manejarFormularioAgregar(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

        // Recolecta todos los datos del formulario
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());

        try {
            await api.createProducto(datos);
            alert('¡Producto agregado con éxito!');
            window.location.href = 'listar.html'; 
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert('Error al agregar producto.');
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Guardar Producto';
        }
    });
}

// ===============================================
// LÓGICA DE 'editar.html'
// ===============================================

async function cargarDatosParaEditar(form) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert('ID de producto no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        const producto = await api.getProductoById(id);
        
        // Rellenamos el formulario con los datos
        document.getElementById('idProducto').value = producto.id;
        document.getElementById('tipo').value = producto.tipo;
        document.getElementById('marca').value = producto.marca;
        document.getElementById('modelo').value = producto.modelo;
        document.getElementById('serial').value = producto.serial;
        document.getElementById('fecha_compra').value = producto.fecha_compra;
        document.getElementById('proveedor').value = producto.proveedor;
        document.getElementById('estado').value = producto.estado;
        document.getElementById('rut').value = producto.rut;
        document.getElementById('usuario').value = producto.usuario;

    } catch (error) {
        console.error("Error al cargar producto:", error);
        alert('Error al cargar los datos del producto.');
        window.location.href = 'listar.html';
    }
}

function manejarFormularioEditar(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';

        // Recolecta todos los datos del formulario
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = datos.id; // El ID está en el campo oculto

        try {
            await api.updateProducto(id, datos);
            alert('¡Producto actualizado con éxito!');
            window.location.href = 'listar.html'; 
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            alert('Error al actualizar producto.');
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-save me-2"></i>Actualizar Cambios';
        }
    });
}

// ===============================================
// LÓGICA DE 'eliminar.html'
// ===============================================

async function cargarDatosParaEliminar(form) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const infoDiv = document.getElementById('producto-info');
    const idInput = document.getElementById('idProducto');

    if (!id) {
        alert('ID de producto no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        const producto = await api.getProductoById(id);
        
        infoDiv.innerHTML = `
            <strong>ID Equipo:</strong> ${producto.id}<br>
            <strong>Tipo:</strong> ${producto.tipo}<br>
            <strong>Marca:</strong> ${producto.marca}<br>
            <strong>Modelo:</strong> ${producto.modelo}
        `;
        idInput.value = producto.id;

    } catch (error) {
        console.error("Error al cargar producto:", error);
        infoDiv.innerHTML = 'Error al cargar datos del producto.';
        document.querySelector('button[type="submit"]').disabled = true;
    }
}

function manejarFormularioEliminar(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Eliminando...';

        const id = document.getElementById('idProducto').value;

        try {
            await api.deleteProducto(id);
            alert('¡Producto eliminado con éxito!');
            window.location.href = 'listar.html'; 
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert('Error al eliminar producto.');
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-trash me-2"></i>Sí, Eliminar';
        }
    });
}

// ===============================================
// LÓGICA DE 'detalle.html'
// ===============================================

async function cargarDatosDetalle(infoDiv) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const tituloEl = document.getElementById('detalle-titulo');
    const botonEditar = document.getElementById('btn-editar-producto');
    const qrCodigoEl = document.getElementById('qr-codigo-id');
    const historialBody = document.getElementById('historial-tabla-body');

    if (!id) {
        alert('ID de producto no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        // Carga la info del producto y su historial al mismo tiempo
        const [producto, historial] = await Promise.all([
            api.getProductoById(id),
            api.getHistorial(id)
        ]);
        
        // Rellena el título
        if (tituloEl) tituloEl.textContent = `Detalle del Producto: ${producto.id}`;
        
        // Rellena la lista de info general
        infoDiv.innerHTML = `
            <dt class="col-sm-4">ID Equipo</dt>
            <dd class="col-sm-8">${producto.id}</dd>
            
            <dt class="col-sm-4">Tipo</dt>
            <dd class="col-sm-8">${producto.tipo}</dd>
            
            <dt class="col-sm-4">Marca</dt>
            <dd class="col-sm-8">${producto.marca}</dd>

            <dt class="col-sm-4">Modelo</dt>
            <dd class="col-sm-8">${producto.modelo}</dd>
            
            <dt class="col-sm-4">N° de Serie</dt>
            <dd class="col-sm-8">${producto.serial}</dd>

            <dt class="col-sm-4">Estado</dt>
            <dd class="col-sm-8"><span class="badge bg-success">${producto.estado}</span></dd>

            <dt class="col-sm-4">Fecha de Compra</dt>
            <dd class="col-sm-8">${producto.fecha_compra}</dd>
            
            <dt class="col-sm-4">Proveedor</dt>
            <dd class="col-sm-8">${producto.proveedor}</dd>
            
            <dt class="col-sm-4">RUT Asociado</dt>
            <dd class="col-sm-8">${producto.rut}</dd>

            <dt class="col-sm-4">Usuario Responsable</dt>
            <dd class="col-sm-8">${producto.usuario}</dd>
        `;

        // Asigna el link correcto al botón de editar
        if (botonEditar) botonEditar.href = `editar.html?id=${producto.id}`;
        
        // Rellena el QR
        if (qrCodigoEl) qrCodigoEl.textContent = producto.id;

        // Rellena la tabla de historial
        if (historial.length > 0) {
            historialBody.innerHTML = historial.map(h => `
                <tr>
                    <td>${h.fecha}</td>
                    <td>${h.evento}</td>
                    <td>${h.usuario}</td>
                    <td>${h.comentarios}</td>
                </tr>
            `).join('');
        } else {
            historialBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay historial para este equipo.</td></tr>';
        }
        
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        infoDiv.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
    }
}