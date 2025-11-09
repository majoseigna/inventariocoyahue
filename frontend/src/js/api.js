/**
 * assets/js/api.js
 * * Simula la comunicación con el backend (Django).
 */

// --- SIMULACIÓN DE BASE DE DATOS ---

// DB DE PRODUCTOS
let db_productos = [
    { id: 'A-001', tipo: 'PC', marca: 'HP', modelo: 'ProDesk', serial: 'SN-001', estado: 'Activo', rut: '13880049-0', fecha_compra: '2021-08-02', proveedor: 'HP Inc.', usuario: 'Ana Gonzalez' },
    { id: 'A-002', tipo: 'Notebook', marca: 'Dell', modelo: 'Latitude 5420', serial: 'SN-002', estado: 'Activo', rut: '12865080-6', fecha_compra: '2022-03-02', proveedor: 'Dell Chile', usuario: 'Mario Perez' },
    { id: 'A-003', tipo: 'Impresora', marca: 'HP', modelo: 'LaserJet', serial: 'SN-003', estado: 'Activo', rut: '19023063-5', fecha_compra: '2020-11-10', proveedor: 'HP Inc.', usuario: 'Carla Diaz' },
    { id: 'A-004', tipo: 'PC', marca: 'HP', modelo: 'EliteDesk', serial: 'SN-004', estado: 'Activo', rut: '11021747-1', fecha_compra: '2023-05-22', proveedor: 'HP Inc.', usuario: 'Juan T.' },
    { id: 'A-005', tipo: 'Monitor', marca: 'LG', modelo: 'UltraWide', serial: 'SN-005', estado: 'Activo', rut: '10101772-9', fecha_compra: '2024-07-14', proveedor: 'TecnoImport Ltda.', usuario: 'Ana Gonzalez' },
    { id: 'A-006', tipo: 'Tablet', marca: 'Apple', modelo: 'iPad Air', serial: 'SN-006', estado: 'Activo', rut: '16622513-2', fecha_compra: '2023-10-06', proveedor: 'Apple Chile', usuario: 'Mario Perez' }
];
let id_counter = 7;

// DB DE CATEGORÍAS
let db_categorias = [
    { id: 'C-01', nombre: 'Notebook', imagen: 'https://via.placeholder.com/150/888/FFF?text=Notebook' },
    { id: 'C-02', nombre: 'Tablet', imagen: 'https://via.placeholder.com/150/888/FFF?text=Tablet' },
    { id: 'C-03', nombre: 'Impresoras', imagen: 'https://via.placeholder.com/150/888/FFF?text=Impresora' },
    { id: 'C-04', nombre: 'Monitores', imagen: 'https://via.placeholder.com/150/888/FFF?text=Monitor' },
    { id: 'C-05', nombre: 'Celulares', imagen: 'https://via.placeholder.com/150/888/FFF?text=Celular' },
    { id: 'C-06', nombre: 'PC Escritorio', imagen: 'https://via.placeholder.com/150/888/FFF?text=PC+Torre' }
];
let cat_id_counter = 7;
// ------------------------------------

const DEMORA_RED = 300; // ms

// Objeto global 'api' para organizar las funciones
const api = {

    // --- FUNCIONES DE PRODUCTOS ---

    /** Obtiene todos los productos */
    getProductos: async () => {
        console.log("API: Obteniendo productos...");
        await new Promise(resolve => setTimeout(resolve, DEMORA_RED));
        return [...db_productos]; // Devuelve una copia
    },

    /** Obtiene un producto por su ID */
    getProducto: async (id) => {
        console.log(`API: Obteniendo producto ${id}...`);
        await new Promise(resolve => setTimeout(resolve, DEMORA_RED));
        const producto = db_productos.find(p => p.id === id);
        if (!producto) throw new Error("Producto no encontrado");
        return {...producto}; // Devuelve una copia
    },

    /** Crea un nuevo producto */
    crearProducto: async (datos) => {
        console.log("API: Creando producto...", datos);
        await new Promise(resolve => setTimeout(resolve, DEMORA_RED));
        
        const nuevoId = `A-${String(id_counter++).padStart(3, '0')}`;
        const nuevoProducto = { id: nuevoId, ...datos };
        db_productos.push(nuevoProducto);
        
        return nuevoProducto;
    },

    /** Actualiza un producto existente */
    actualizarProducto: async (id, datos) => {
        console.log(`API: Actualizando producto ${id}...`, datos);
        await new Promise(resolve => setTimeout(resolve, DEMORA_RED));

        const index = db_productos.findIndex(p => p.id === id);
        if (index === -1) throw new Error("Producto no encontrado");
        
        db_productos[index] = { ...db_productos[index], ...datos };
        return {...db_productos[index]};
    },

    /** Elimina un producto por su ID */
    eliminarProducto: async (id) => {
        console.log(`API: Eliminando producto ${id}...`);
        await new Promise(resolve => setTimeout(resolve, DEMORA_RED));
        
        db_productos = db_productos.filter(p => p.id !== id);
        return { success: true, message: `Producto ${id} eliminado` };
    },

    // --- FUNCIONES DE CATEGORÍAS ---

    /** Obtiene todas las categorías */
    getCategorias: async () => {
        console.log("API: Obteniendo categorías...");
        await new Promise(resolve => setTimeout(resolve, DEMORA_RED));
        return [...db_categorias];
    },

    /** Crea una nueva categoría */
    crearCategoria: async (datos) => {
        console.log("API: Creando categoría...", datos);
        await new Promise(resolve => setTimeout(resolve, DEMORA_RED));
        
        const nuevoId = `C-${String(cat_id_counter++).padStart(2, '0')}`;
        const nuevaCategoria = { 
            id: nuevoId, 
            nombre: datos.nombre, 
            imagen: datos.imagen || `https://via.placeholder.com/150/888/FFF?text=${datos.nombre}`
        };
        db_categorias.push(nuevaCategoria);
        
        return nuevaCategoria;
    },
};
