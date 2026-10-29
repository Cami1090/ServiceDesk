import { ESTADOS } from "../../data.js";

// Muestra una solicitud. Recibe los datos por props.
function SolicitudCard({ solicitud, onAvanzar }) {
    const { titulo, solicitante, prioridad, estado } = solicitud;
    const cerrada = estado === ESTADOS[ESTADOS.length - 1];

    return (
        <article className="solicitud">
            <div className="solicitud__info">
                <h3 className="solicitud__titulo">{titulo}</h3>
                <p className="solicitud__meta">Solicitante: {solicitante}</p>
            </div>

            <div className="solicitud__acciones">
                <span className={`etiqueta etiqueta--${prioridad.toLowerCase()}`}>
                    Prioridad {prioridad.toLowerCase()}
                </span>
                <span className="estado">{estado}</span>
                <button
                    className="boton"
                    onClick={() => onAvanzar(solicitud.id)}
                    disabled={cerrada}
                >
                    {cerrada ? "Cerrada" : "Avanzar estado"}
                </button>
            </div>
        </article>
    );
}

export default SolicitudCard;
