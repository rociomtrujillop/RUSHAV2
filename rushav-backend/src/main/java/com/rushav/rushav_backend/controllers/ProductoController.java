package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.entities.Producto;
import com.rushav.rushav_backend.services.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    private final ProductoService service;
    public ProductoController(ProductoService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<Producto>> listar() { 
        return ResponseEntity.ok(service.listar()); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(@PathVariable Long id) {
        return service.buscarPorId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto p) {
        Producto creado = service.crear(p);
        return ResponseEntity.ok(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @Valid @RequestBody Producto p) {
        try {
            Producto actualizado = service.actualizar(id, p);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscar(@RequestParam String nombre) {
        return ResponseEntity.ok(service.porNombre(nombre));
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<Producto>> productosStockBajo() {
        return ResponseEntity.ok(service.productosConStockBajo());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> porCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(service.buscarPorCategoriaId(categoriaId));
    }

    @GetMapping("/genero/{genero}")
    public ResponseEntity<List<Producto>> porGenero(@PathVariable String genero) {
        return ResponseEntity.ok(service.filtrarPorGenero(genero));
    }

    @GetMapping("/genero/{genero}/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> porGeneroYCategoria(
            @PathVariable String genero, 
            @PathVariable Long categoriaId) {
        return ResponseEntity.ok(service.filtrarPorGeneroYCategoria(genero, categoriaId));
    }

    @GetMapping("/genero/{genero}/buscar")
    public ResponseEntity<List<Producto>> buscarPorGenero(
            @PathVariable String genero, 
            @RequestParam String nombre) {
        return ResponseEntity.ok(service.buscarPorGeneroYNombre(genero, nombre));
    }
}