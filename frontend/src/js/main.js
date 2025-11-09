/**
 * src/js/main.js
 * Carga el sidebar y topbar en CADA página
 * (excepto en login.html)
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const sidebarPlaceholder = document.getElementById('app-sidebar');
    const topbarPlaceholder = document.getElementById('app-topbar');

    // --- HTML del Sidebar ---
    // (Asegúrate de que las rutas sean correctas desde la raíz de /frontend/)
    const sidebarHTML = `
      <div class="logo-container">
        <img src="src/img/logo.png" alt="Logo Grupo Coyahue">
      </div>
      <ul class="nav flex-column w-100 px-2">
        <li><a href="index.html" class="nav-link"><i class="bi bi-grid-fill"></i> Dashboard</a></li>
        <li><a href="paginas/productos/listar.html" class="nav-link"><i class="bi bi-box-seam"></i> Productos</a></li>
        <li><a href="paginas/categorias/listar.html" class="nav-link"><i class="bi bi-tags"></i> Categorías</a></li>
        <li><a href="paginas/proveedores/listar.html" class="nav-link"><i class="bi bi-truck"></i> Proveedores</a></li>
        <li><a href="paginas/reportes/listar.html" class="nav-link"><i class="bi bi-graph-up"></i> Reportes</a></li>
        <li><a href="paginas/stock/listar.html" class="nav-link"><i class="bi bi-boxes"></i> Stock</a></li>
        <li><a href="paginas/ajustes/perfil.html" class="nav-link"><i class="bi bi-person-circle"></i> Perfil</a></li>
        <li><a href="paginas/login/login.html" class="nav-link text-danger"><i class="bi bi-box-arrow-right"></i> Cerrar Sesión</a></li>
      </ul>
    `;
    
    // --- HTML del Topbar ---
    // (Este es el topbar de tus mockups Pág 5, 10, etc., que es diferente al Pág 4)
    // Usamos el consistente.
    const topbarHTML = `
      <div class="user-menu dropdown ms-auto">
        <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-2"></i>Usuario
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="paginas/ajustes/perfil.html"><i class="bi bi-gear me-2"></i>Configuración</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="paginas/login/login.html"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</a></li>
        </ul>
      </div>
    `;

    // --- Cargar y Activar Link ---
    if (sidebarPlaceholder) {
        sidebarPlaceholder.innerHTML = sidebarHTML;
        
        // Marca el link activo
        const currentPath = window.location.pathname.split('/').pop(); // "index.html" o "listar.html"
        
        // Maneja el caso especial del Dashboard (index.html)
        if (currentPath === 'index.html' || currentPath === '') {
             sidebarPlaceholder.querySelector('a[href="index.html"]').classList.add('active');
        } else {
             // Busca un link que contenga el path actual
             // ej: href="paginas/productos/listar.html" contiene "productos"
             const links = sidebarPlaceholder.querySelectorAll('.nav-link');
             links.forEach(link => {
                if (window.location.pathname.includes(link.getAttribute('href'))) {
                    link.classList.add('active');
                }
             });
        }
    }

    if (topbarPlaceholder) {
        topbarPlaceholder.innerHTML = topbarHTML;
    }
});