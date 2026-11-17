function Sidebar({
  documentos,
  documentoActualId,
  onSeleccionar,
  onNuevo,
  cargando,
  usuario,
  limiteAlcanzado,
  onAbrirSuscripcion,
  onCerrarSesion,
}) {
  return (
    <aside className="ads-sidebar">
      <div className="ads-sidebar-brand">
        <span className="ads-sidebar-brand-icon">E</span>
        <span className="ads-sidebar-brand-text">Editor de Texto SaaS</span>
      </div>

      <div className="ads-cuenta">
        <div className="ads-cuenta-info">
          <span className="ads-cuenta-nombre">{usuario.nombre}</span>
          <span className={`ads-plan-badge ads-plan-badge--${usuario.plan.toLowerCase()}`}>
            {usuario.plan}
          </span>
        </div>
        <button className="ads-link-button" onClick={onAbrirSuscripcion}>
          Mi plan
        </button>
      </div>

      <button
        className="ads-button ads-button--primary ads-button--full ads-btn-nuevo"
        onClick={onNuevo}
        disabled={limiteAlcanzado}
      >
        + Nuevo documento
      </button>

      {limiteAlcanzado && (
        <p className="ads-limite-aviso">
          Límite del plan gratuito alcanzado.{" "}
          <button className="ads-link-button" onClick={onAbrirSuscripcion}>
            Actualiza a PRO
          </button>
        </p>
      )}

      <h2>Documentos</h2>

      {cargando && <p className="ads-mensaje">Cargando...</p>}

      {!cargando && documentos.length === 0 && (
        <p className="ads-mensaje">Todavía no hay documentos guardados.</p>
      )}

      <ul className="ads-nav-list">
        {documentos.map((doc) => (
          <li
            key={doc.id}
            className={`ads-nav-item ${doc.id === documentoActualId ? "is-selected" : ""}`}
            onClick={() => onSeleccionar(doc)}
          >
            <span className="ads-nav-item-titulo">{doc.titulo}</span>
            <span className="ads-nav-item-autor">{doc.autor}</span>
          </li>
        ))}
      </ul>

      <div className="ads-sidebar-footer">
        <button className="ads-link-button" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
