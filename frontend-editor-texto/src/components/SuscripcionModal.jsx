import { useState } from "react";
import { actualizarAPro, cancelarSuscripcion, limiteDocumentosFree } from "../services/sesionService";

function SuscripcionModal({ sesion, onCerrar, onCambioSesion }) {
  const [vista, setVista] = useState(sesion.plan === "PRO" ? "pro" : "comparativa");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvc, setCvc] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  async function pagar(e) {
    e.preventDefault();
    setError("");
    if (!numeroTarjeta.trim() || !vencimiento.trim() || !cvc.trim()) {
      setError("Completa los datos de la tarjeta (simulados, no se validan).");
      return;
    }
    setProcesando(true);
    try {
      const nuevaSesion = await actualizarAPro();
      onCambioSesion(nuevaSesion);
      setVista("exito");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  }

  async function cancelar() {
    setProcesando(true);
    setError("");
    try {
      const nuevaSesion = await cancelarSuscripcion();
      onCambioSesion(nuevaSesion);
      setVista("comparativa");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div className="ads-modal-overlay" onClick={onCerrar}>
      <div className="ads-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ads-modal-header">
          <h2>Mi plan</h2>
          <button className="ads-modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {vista === "comparativa" && (
          <>
            <p className="ads-modal-texto">
              Estás en el plan <strong>FREE</strong> (máximo {limiteDocumentosFree()} documentos).
              Actualiza a PRO para documentos ilimitados.
            </p>

            <div className="ads-planes">
              <div className="ads-plan-card">
                <h3>FREE</h3>
                <p className="ads-plan-precio">$0/mes</p>
                <ul>
                  <li>Hasta {limiteDocumentosFree()} documentos</li>
                  <li>Edición básica</li>
                </ul>
              </div>
              <div className="ads-plan-card ads-plan-card--destacado">
                <h3>PRO</h3>
                <p className="ads-plan-precio">$9.99/mes</p>
                <ul>
                  <li>Documentos ilimitados</li>
                  <li>Soporte prioritario (simulado)</li>
                </ul>
              </div>
            </div>

            <form onSubmit={pagar} className="ads-payment-form">
              <div className="ads-field">
                <label className="ads-field-label" htmlFor="tarjeta">
                  Número de tarjeta
                </label>
                <input
                  id="tarjeta"
                  className="ads-textfield"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={numeroTarjeta}
                  onChange={(e) => setNumeroTarjeta(e.target.value)}
                />
              </div>
              <div className="ads-payment-form-fila">
                <div className="ads-field">
                  <label className="ads-field-label" htmlFor="vencimiento">
                    Vencimiento
                  </label>
                  <input
                    id="vencimiento"
                    className="ads-textfield"
                    type="text"
                    placeholder="MM/AA"
                    value={vencimiento}
                    onChange={(e) => setVencimiento(e.target.value)}
                  />
                </div>
                <div className="ads-field">
                  <label className="ads-field-label" htmlFor="cvc">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    className="ads-textfield"
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="ads-inline-message ads-inline-message--error">{error}</p>}

              <button
                type="submit"
                className="ads-button ads-button--primary ads-button--full"
                disabled={procesando}
              >
                {procesando ? "Procesando pago..." : "Pagar y actualizar a PRO"}
              </button>
              <p className="ads-login-nota">Pago simulado: no se cobra nada ni se valida la tarjeta.</p>
            </form>
          </>
        )}

        {vista === "exito" && (
          <div className="ads-suscripcion-exito">
            <p className="ads-suscripcion-exito-icono">✓</p>
            <p className="ads-modal-texto">
              <strong>¡Listo!</strong> Tu cuenta ahora es PRO, con documentos ilimitados.
            </p>
            <button className="ads-button ads-button--primary" onClick={onCerrar}>
              Continuar
            </button>
          </div>
        )}

        {vista === "pro" && (
          <>
            <p className="ads-modal-texto">
              Ya tienes el plan <strong>PRO</strong>: documentos ilimitados y soporte prioritario
              (simulado).
            </p>
            {error && <p className="ads-inline-message ads-inline-message--error">{error}</p>}
            <div className="ads-acciones">
              <button className="ads-button ads-button--subtle" onClick={onCerrar}>
                Cerrar
              </button>
              <button className="ads-button ads-button--danger" onClick={cancelar} disabled={procesando}>
                {procesando ? "Cancelando..." : "Cancelar suscripción"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SuscripcionModal;
