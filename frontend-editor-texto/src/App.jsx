import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Login from "./components/Login";
import SuscripcionModal from "./components/SuscripcionModal";
import {
  listarDocumentos,
  crearDocumento,
  actualizarDocumento,
  eliminarDocumento,
} from "./services/documentoService";
import { obtenerSesionActual, cerrarSesion, limiteDocumentosFree } from "./services/sesionService";
import "./App.css";

const DOCUMENTO_VACIO = { id: null, titulo: "", contenido: "", autor: "" };

function App() {
  const [sesion, setSesion] = useState(() => obtenerSesionActual());
  const [mostrarSuscripcion, setMostrarSuscripcion] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [documentoActual, setDocumentoActual] = useState(DOCUMENTO_VACIO);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [conexionOk, setConexionOk] = useState(true);

  useEffect(() => {
    if (sesion) {
      cargarDocumentos();
    }
  }, [sesion]);

  async function cargarDocumentos() {
    setCargandoLista(true);
    try {
      const datos = await listarDocumentos();
      setDocumentos(datos);
      setConexionOk(true);
    } catch (e) {
      setConexionOk(false);
    } finally {
      setCargandoLista(false);
    }
  }

  function seleccionarDocumento(doc) {
    setDocumentoActual(doc);
    setError("");
  }

  function nuevoDocumento() {
    if (limiteAlcanzado) return;
    setDocumentoActual(DOCUMENTO_VACIO);
    setError("");
  }

  async function guardarDocumento() {
    setError("");
    setGuardando(true);
    const payload = {
      titulo: documentoActual.titulo,
      contenido: documentoActual.contenido,
      autor: documentoActual.autor,
    };
    try {
      let guardado;
      if (documentoActual.id) {
        guardado = await actualizarDocumento(documentoActual.id, payload);
      } else {
        guardado = await crearDocumento(payload);
      }
      setDocumentoActual(guardado);
      await cargarDocumentos();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarActual() {
    if (!documentoActual.id) return;
    try {
      await eliminarDocumento(documentoActual.id);
      setDocumentoActual(DOCUMENTO_VACIO);
      await cargarDocumentos();
    } catch (e) {
      setError(e.message);
    }
  }

  function salir() {
    cerrarSesion();
    setSesion(null);
    setDocumentos([]);
    setDocumentoActual(DOCUMENTO_VACIO);
  }

  if (!sesion) {
    return <Login onAutenticado={setSesion} />;
  }

  const limiteAlcanzado = sesion.plan === "FREE" && documentos.length >= limiteDocumentosFree();

  return (
    <div className="ads-app">
      <Sidebar
        documentos={documentos}
        documentoActualId={documentoActual.id}
        onSeleccionar={seleccionarDocumento}
        onNuevo={nuevoDocumento}
        cargando={cargandoLista}
        usuario={sesion}
        limiteAlcanzado={limiteAlcanzado}
        onAbrirSuscripcion={() => setMostrarSuscripcion(true)}
        onCerrarSesion={salir}
      />

      <main className="ads-main">
        {!conexionOk && (
          <p className="ads-inline-message ads-inline-message--error">
            No se pudo conectar con el backend en http://localhost:8080. Verifica que esté
            corriendo.
          </p>
        )}

        <Editor
          titulo={documentoActual.titulo}
          contenido={documentoActual.contenido}
          autor={documentoActual.autor}
          esExistente={!!documentoActual.id}
          guardando={guardando}
          error={error}
          onTituloChange={(v) => setDocumentoActual({ ...documentoActual, titulo: v })}
          onContenidoChange={(v) => setDocumentoActual({ ...documentoActual, contenido: v })}
          onAutorChange={(v) => setDocumentoActual({ ...documentoActual, autor: v })}
          onGuardar={guardarDocumento}
          onEliminar={eliminarActual}
        />
      </main>

      {mostrarSuscripcion && (
        <SuscripcionModal
          sesion={sesion}
          onCerrar={() => setMostrarSuscripcion(false)}
          onCambioSesion={setSesion}
        />
      )}
    </div>
  );
}

export default App;
