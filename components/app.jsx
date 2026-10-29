import { useState } from "react";
import ListaSolicitudes from "./ListaSolicitudes.jsx";
import { solicitudesIniciales, ESTADOS } from "../data.js";

const FILTROS = ["Todas", ...ESTADOS];

function App() {
    // Estado: la lista de solicitudes y el filtro activo
    const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
    const [filtro, setFiltro] = useState("Todas");

    // Evento: pasa la solicitud al siguiente estado.
    // Se crea una copia nueva del arreglo; no se modifica el estado directamente.
    const avanzarEstado = (id) => {
        setSolicitudes(
            solicitudes.map((solicitud) => {
                if (solicitud.id !== id) return solicitud;
                const siguiente = ESTADOS.indexOf(solicitud.estado) + 1;
                if (siguiente >= ESTADOS.length) return solicitud;
                return { ...solicitud, estado: ESTADOS[siguiente] };
            })
        );
    };

    const visibles =
        filtro === "Todas"
            ? solicitudes
            : solicitudes.filter((solicitud) => solicitud.estado === filtro);

    const contar = (estado) =>
        estado === "Todas"
            ? solicitudes.length
            : solicitudes.filter((s) => s.estado === estado).length;

    return (
        <main className="app">
            <header className="encabezado">
                <h1>ServiceDesk</h1>
                <p>Solicitudes de soporte del equipo</p>
            </header>

            <nav className="filtros" aria-label="Filtrar por estado">
                {FILTROS.map((nombre) => (
                    <button
                        key={nombre}
                        className={`filtro ${filtro === nombre ? "filtro--activo" : ""}`}
                        onClick={() => setFiltro(nombre)}
                        aria-pressed={filtro === nombre}
                    >
                        {nombre} ({contar(nombre)})
                    </button>
                ))}
            </nav>

            <ListaSolicitudes solicitudes={visibles} onAvanzar={avanzarEstado} />
        </main>
    );
}

export default App;
