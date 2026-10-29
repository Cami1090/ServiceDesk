import SolicitudCard from "./SolicitudCard.jsx";

// Recorre la colección con map y asigna una key única a cada elemento.
function ListaSolicitudes({ solicitudes, onAvanzar }) {
    if (solicitudes.length === 0) {
        return (
            <p className="vacio">
                No hay solicitudes con este estado. Cambia el filtro para ver las demás.
            </p>
        );
    }

    return (
        <section className="lista">
            {solicitudes.map((solicitud) => (
                <SolicitudCard
                    key={solicitud.id}
                    solicitud={solicitud}
                    onAvanzar={onAvanzar}
                />
            ))}
        </section>
    );
}

export default ListaSolicitudes;
