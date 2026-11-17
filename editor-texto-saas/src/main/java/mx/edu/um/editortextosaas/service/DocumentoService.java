package mx.edu.um.editortextosaas.service;

import mx.edu.um.editortextosaas.model.Documento;
import mx.edu.um.editortextosaas.repository.DocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentoService {

    private static final int TITULO_MAX_LENGTH = 200;

    @Autowired
    private DocumentoRepository repository;

    public List<Documento> listarTodos() {
        return repository.findAll();
    }

    public Documento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new DocumentoNoEncontradoException(id));
    }

    public Documento crear(Documento doc) {
        validarTitulo(doc.getTitulo());
        doc.setId(null);
        doc.setFechaCreacion(LocalDateTime.now());
        doc.setFechaModificacion(LocalDateTime.now());
        return repository.save(doc);
    }

    public Documento actualizar(Long id, Documento datos) {
        validarTitulo(datos.getTitulo());
        Documento doc = repository.findById(id)
                .orElseThrow(() -> new DocumentoNoEncontradoException(id));
        doc.setTitulo(datos.getTitulo());
        doc.setContenido(datos.getContenido());
        doc.setAutor(datos.getAutor());
        doc.setFechaModificacion(LocalDateTime.now());
        return repository.save(doc);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new DocumentoNoEncontradoException(id);
        }
        repository.deleteById(id);
    }

    private void validarTitulo(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("El título no puede estar vacío");
        }
        if (titulo.length() > TITULO_MAX_LENGTH) {
            throw new IllegalArgumentException("El título no puede superar " + TITULO_MAX_LENGTH + " caracteres");
        }
    }
}
