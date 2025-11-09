/**
 * src/js/categorias.js
 * * Este script maneja la lógica para la sección de Categorías.
 * - 'listar.html' (Cargar tarjetas)
 * - 'agregar.html' (Manejar formulario de agregar)
 * - 'editar.html' (Cargar datos y manejar formulario de editar)
 * - 'eliminar.html' (Cargar datos y manejar formulario de eliminar)
 */

// --- API SIMULADA ---
let db_categorias = [
    { id: 'C-01', nombre: 'Notebook', imagen: 'https://placehold.co/600x400/002a4d/FFF?text=Notebook' },
    { id: 'C-02', nombre: 'Tablet', imagen: 'https://placehold.co/600x400/002a4d/FFF?text=Tablet' },
    { id: 'C-03', nombre: 'Impresoras', imagen: 'https://placehold.co/600x400/002a4d/FFF?text=Impresora' },
    { id: 'C-04', nombre: 'Monitores', imagen: 'https://placehold.co/600x400/002a4d/FFF?text=Monitor' },
    { id: 'C-05', nombre: 'Celulares', imagen: 'https://placehold.co/600x400/002a4d/FFF?text=Celular' },
    { id: 'C-06', nombre: 'PC Escritorio', imagen: 'https://placehold.co/600x400/002a4d/FFF?text=PC+Escritorio' }
];
let cat_id_counter = 7; // Siguiente ID a generar

const api = {
    delay: (ms) => new Promise(res => setTimeout(res, ms)),
    
    getCategorias: async () => {
        await api.delay(300); // Simula carga de red
        return db_categorias;
    },

    createCategoria: async (datos) => {
        await api.delay(300);
        const nuevoId = `C-${String(cat_id_counter++).padStart(2, '0')}`;
        
        const nuevaCategoria = {
            id: nuevoId,
            nombre: datos.nombre,
            // Si el campo imagen está vacío, usa un placeholder
            imagen: datos.imagen || `https://placehold.co/600x400/002a4d/FFF?text=${datos.nombre}`
        };
        db_categorias.push(nuevaCategoria);
        console.log("DB de Categorías actualizada:", db_categorias);
        return nuevaCategoria;
    },

    getCategoriaById: async (id) => {
        await api.delay(300);
        const categoria = db_categorias.find(c => c.id === id);
        if (!categoria) throw new Error("Categoría no encontrada");
        return categoria;
    },

    updateCategoria: async (id, datos) => {
        await api.delay(300);
        const index = db_categorias.findIndex(c => c.id === id);
        if (index === -1) throw new Error("Categoría no encontrada");

        db_categorias[index] = {
            ...db_categorias[index],
            nombre: datos.nombre,
            imagen: datos.imagen || `https://placehold.co/600x400/002a4d/FFF?text=${datos.nombre}`
        };
        console.log("DB de Categorías actualizada:", db_categorias);
        return db_categorias[index];
    },

    deleteCategoria: async (id) => {
        await api.delay(300);
        const index = db_categorias.findIndex(c => c.id === id);
        if (index === -1) throw new Error("Categoría no encontrada");

        db_categorias = db_categorias.filter(c => c.id !== id);
        console.log("DB de Categorías actualizada:", db_categorias);
        return { success: true };
    }
};
// --- FIN API SIMULADA ---


/**
 * Lógica principal que se ejecuta al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica para 'listar.html'
    const contenedor = document.getElementById('lista-categorias');
    if (contenedor) {
        cargarTarjetasCategorias(contenedor);
    }
    
    // 2. Lógica para 'agregar.html'
    const formAgregar = document.getElementById('formAgregarCategoria');
    if (formAgregar) {
        manejarFormularioAgregar(formAgregar);
    }
    
    // 3. Lógica para 'editar.html'
    const formEditar = document.getElementById('formEditarCategoria');
    if (formEditar) {
        cargarDatosParaEditarCat(formEditar);
        manejarFormularioEditarCat(formEditar);
    }

    // 4. Lógica para 'eliminar.html'
    const formEliminar = document.getElementById('formEliminarCategoria');
    if (formEliminar) {
        cargarDatosParaEliminarCat(formEliminar);
        manejarFormularioEliminarCat(formEliminar);
    }
    
});

/**
 * Carga las tarjetas de categorías en 'listar.html'
 */
async function cargarTarjetasCategorias(contenedor) {
    contenedor.innerHTML = '<p class="text-center text-muted">Cargando categorías...</p>';

    try {
        const categorias = await api.getCategorias();

        if (categorias.length === 0) {
            contenedor.innerHTML = '<p class="text-center text-muted">No hay categorías registradas.</p>';
            return;
        }

        let tarjetasHTML = '';
        categorias.forEach(cat => {
            tarjetasHTML += `
                <div class="col-md-4 col-sm-6 mb-4">
                    <div class="card stat-card shadow-sm h-100 text-center category-card">
                        <img src="${cat.imagen}" class="card-img-top" alt="${cat.nombre}" onerror="this.src='https://placehold.co/600x400/ccc/FFF?text=Error';">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${cat.nombre}</h5>
                        </div>
                        <div class="card-footer bg-white border-0 pb-3">
                             <button class="btn btn-sm btn-outline-primary" data-categoria="${cat.nombre}">
                                <i class="bi bi-eye me-1"></i>Ver Productos
                             </button>
                             <a href="editar.html?id=${cat.id}" class="btn btn-sm btn-outline-secondary" title="Editar">
                                <i class="bi bi-pencil"></i>
                             </a>
                             <a href="eliminar.html?id=${cat.id}" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                <i class="bi bi-trash"></i>
                             </a>
                        </div>
                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = tarjetasHTML;

    } catch (error) {
        console.error("Error al cargar categorías:", error);
        contenedor.innerHTML = '<p class="text-center text-danger">Error al cargar las categorías.</p>';
    }
}


/**
 * Maneja el envío del formulario en 'agregar.html'
 */
function manejarFormularioAgregar(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

        const datos = {
            nombre: document.getElementById('nombre').value,
            imagen: document.getElementById('imagen').value
        };

        try {
            await api.createCategoria(datos);
            alert('¡Categoría agregada con éxito!');
            window.location.href = 'listar.html'; 
        } catch (error) {
            console.error("Error al agregar categoría:", error);
            alert('Error al agregar categoría.');
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Guardar Categoría';
        }
    });
}


/**
 * Carga los datos de la categoría en el formulario de 'editar.html'
 */
async function cargarDatosParaEditarCat(form) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert('ID de categoría no encontrado.');
        window.location.href = 'listar.html'; 
        return;
    }

    try {
        const categoria = await api.getCategoriaById(id);

        document.getElementById('idCategoria').value = categoria.id;
        document.getElementById('nombre').value = categoria.nombre;
        document.getElementById('imagen').value = categoria.imagen;

    } catch (error) {
        console.error("Error al cargar categoría:", error);
        alert('Error al cargar los datos de la categoría.');
        window.location.href = 'listar.html';
    }
}

/**
 * Maneja el envío (submit) del formulario de 'editar.html'
 */
function manejarFormularioEditarCat(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';

        const id = document.getElementById('idCategoria').value;
        const datos = {
            nombre: document.getElementById('nombre').value,
            imagen: document.getElementById('imagen').value
        };

        try {
            await api.updateCategoria(id, datos);
            alert('¡Categoría actualizada con éxito!');
            window.location.href = 'listar.html'; 
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            alert('Error al actualizar categoría.');
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-save me-2"></i>Actualizar Cambios';
        }
    });
}

/**
 * Carga los datos de la categoría en 'eliminar.html'
 */
async function cargarDatosParaEliminarCat(form) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const infoDiv = document.getElementById('categoria-info');
    const idInput = document.getElementById('idCategoria');

    if (!id) {
        alert('ID de categoría no encontrado.');
        window.location.href = 'listar.html';
        return;
    }

    try {
        const categoria = await api.getCategoriaById(id);
        
        // Muestra al usuario qué está borrando
        infoDiv.innerHTML = `
            <strong>ID:</strong> ${categoria.id}<br>
            <strong>Nombre:</strong> ${categoria.nombre}
        `;
        // Guarda el ID en el formulario
        idInput.value = categoria.id;

    } catch (error) {
        console.error("Error al cargar categoría:", error);
        infoDiv.innerHTML = 'Error al cargar datos de la categoría.';
        document.querySelector('button[type="submit"]').disabled = true;
    }
}

/**
 * Maneja el envío (submit) del formulario de 'eliminar.html'
 */
function manejarFormularioEliminarCat(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const boton = form.querySelector('button[type="submit"]');
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Eliminando...';

        const id = document.getElementById('idCategoria').value;

        try {
            await api.deleteCategoria(id);
            alert('¡Categoría eliminada con éxito!');
            window.location.href = 'listar.html'; // Vuelve a la lista
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            alert('Error al eliminar categoría.');
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-trash me-2"></i>Sí, Eliminar';
        }
    });
}