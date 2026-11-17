import { useState } from "react";
import { iniciarSesion, registrarse } from "../services/sesionService";

function Login({ onAutenticado }) {
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    setError("");
  }

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const sesion =
        modo === "login"
          ? await iniciarSesion(email, password)
          : await registrarse(nombre, email, password);
      onAutenticado(sesion);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="ads-login-screen">
      <div className="ads-login-card">
        <div className="ads-sidebar-brand ads-login-brand">
          <span className="ads-sidebar-brand-icon">E</span>
          <span className="ads-sidebar-brand-text">Editor de Texto SaaS</span>
        </div>

        <div className="ads-login-toggle">
          <button
            type="button"
            className={`ads-login-tab ${modo === "login" ? "is-active" : ""}`}
            onClick={() => cambiarModo("login")}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`ads-login-tab ${modo === "registro" ? "is-active" : ""}`}
            onClick={() => cambiarModo("registro")}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={enviar}>
          {modo === "registro" && (
            <div className="ads-field">
              <label className="ads-field-label" htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                className="ads-textfield"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          )}

          <div className="ads-field">
            <label className="ads-field-label" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              className="ads-textfield"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="ads-field">
            <label className="ads-field-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className="ads-textfield"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="ads-inline-message ads-inline-message--error">{error}</p>}

          <button
            type="submit"
            className="ads-button ads-button--primary ads-button--full"
            disabled={cargando}
          >
            {cargando
              ? modo === "login"
                ? "Entrando..."
                : "Creando cuenta..."
              : modo === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </button>
        </form>

        <p className="ads-login-nota">
          Simulación de acceso: no se valida contra un servidor, los datos se guardan solo en
          este navegador.
        </p>
      </div>
    </div>
  );
}

export default Login;
