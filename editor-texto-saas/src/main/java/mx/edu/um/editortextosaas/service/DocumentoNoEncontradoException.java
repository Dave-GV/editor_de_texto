package mx.edu.um.editortextosaas.service;

public class DocumentoNoEncontradoException extends RuntimeException {

    public DocumentoNoEncontradoException(Long id) {
        super("Documento no encontrado con id " + id);
    }
}
