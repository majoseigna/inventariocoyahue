/**
 * src/js/dashboard.js
 * Lógica específica para index.html (Dashboard)
 * Se encarga de dibujar el gráfico de pastel.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Busca el <canvas> en el HTML
    const ctx = document.getElementById('pieChart');
    if (!ctx) {
        console.error("No se encontró el elemento <canvas> con id 'pieChart'");
        return;
    }

    // Datos del Mockup (Pág. 4)
    const data = {
        labels: [
            'Notebooks',
            'Servidores',
            'Escritorio (PC)'
        ],
        datasets: [{
            label: 'Distribución de Activos',
            // Datos del mockup: 60%, 25%, 15%
            data: [60, 25, 15], 
            backgroundColor: [
                '#002a4d', // Azul oscuro
                '#0d6efd', // Azul Bootstrap
                '#6c757d'  // Gris
            ],
            hoverOffset: 4
        }]
    };

    // Crea el gráfico
    try {
        new Chart(ctx, {
            type: 'pie', // Tipo de gráfico
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    } catch (e) {
        console.error("Error al crear el gráfico:", e);
    }
});