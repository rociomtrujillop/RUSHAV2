package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.entities.Categoria;
import com.rushav.rushav_backend.services.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {
    private final CategoriaService service;

    public CategoriaController(CategoriaService service) { 
        this.service = service; 
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> listar() { 
        return ResponseEntity.ok(service.listarActivas()); 
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Categoria>> listarTodas() { 
        return ResponseEntity.ok(service.listar()); 
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Categoria>> porTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(service.listarPorTipo(tipo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtener(@PathVariable Long id) {
        return service.buscarPorId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Categoria c) {
        if (service.existePorNombre(c.getNombre())) {
            return ResponseEntity.badRequest().body("Ya existe una categoría con ese nombre");
        }
        Categoria creada = service.crear(c);
        return ResponseEntity.ok(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Categoria c) {
        try {
            Categoria actualizada = service.actualizar(id, c);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}