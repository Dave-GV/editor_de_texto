const API_URL = "http://localhost:8080/api/documentos";

async function manejarRespuesta(res) {
  if (res.status === 204) {
    return null;
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }
  return data;
}

export async function listarDocumentos() {
  const res = await fetch(API_URL);
  return manejarRespuesta(res);
}

export async function obtenerDocumento(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return manejarRespuesta(res);
}

export async function crearDocumento(documento) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documento),
  });
  return manejarRespuesta(res);
}

export async function actualizarDocumento(id, documento) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documento),
  });
  return manejarRespuesta(res);
}

export async function eliminarDocumento(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return manejarRespuesta(res);
}
