package mx.edu.um.editortextosaas.controller;

import mx.edu.um.editortextosaas.model.Documento;
import mx.edu.um.editortextosaas.service.DocumentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoService service;

    @GetMapping
    public List<Documento> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Documento obtener(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Documento crear(@RequestBody Documento doc) {
        return service.crear(doc);
    }

    @PutMapping("/{id}")
    public Documento actualizar(@PathVariable Long id, @RequestBody Documento doc) {
        return service.actualizar(id, doc);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
