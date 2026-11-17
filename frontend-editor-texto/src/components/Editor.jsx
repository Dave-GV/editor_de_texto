function contarPalabras(texto) {
  const limpio = texto.trim();
  return limpio === "" ? 0 : limpio.split(/\s+/).length;
}

function Editor({
  titulo,
  contenido,
  autor,
  esExistente,
  guardando,
  error,
  onTituloChange,
  onContenidoChange,
  onAutorChange,
  onGuardar,
  onEliminar,
}) {
  return (
    <>
      <div className="ads-toolbar">
        <div className="ads-toolbar-main">
          <label className="sr-only" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            className="ads-title-input"
            type="text"
            placeholder="Documento sin título"
            value={titulo}
            onChange={(e) => onTituloChange(e.target.value)}
          />

          <label className="sr-only" htmlFor="autor">
            Autor
          </label>
          <input
            id="autor"
            className="ads-autor-input"
            type="text"
            placeholder="Autor"
            value={autor}
            onChange={(e) => onAutorChange(e.target.value)}
          />
        </div>

        <div className="ads-acciones">
          <button className="ads-button ads-button--primary" onClick={onGuardar} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          {esExistente && (
            <button className="ads-button ads-button--danger" onClick={onEliminar}>
              Eliminar
            </button>
          )}
        </div>
      </div>

      {error && <p className="ads-inline-message ads-inline-message--error">{error}</p>}

      <label className="sr-only" htmlFor="contenido">
        Contenido
      </label>
      <textarea
        id="contenido"
        className="ads-writing-area"
        placeholder="Escribe aquí..."
        value={contenido}
        onChange={(e) => onContenidoChange(e.target.value)}
      />

      <div className="ads-statusbar">
        <span>Caracteres: {contenido.length}</span>
        <span>Palabras: {contarPalabras(contenido)}</span>
      </div>
    </>
  );
}

export default Editor;
