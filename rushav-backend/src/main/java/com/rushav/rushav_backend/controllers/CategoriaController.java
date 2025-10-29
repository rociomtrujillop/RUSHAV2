package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.entities.Categoria;
import com.rushav.rushav_backend.services.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
@Tag(name = "3. Categorías", description = "Gestión de categorías de productos")
public class CategoriaController {
    private final CategoriaService service;

    public CategoriaController(CategoriaService service) { 
        this.service = service; 
    }

    @Operation(summary = "Listar categorías activas", description = "Obtiene todas las categorías con estado activo")
    @GetMapping
    public ResponseEntity<List<Categoria>> listar() { 
        return ResponseEntity.ok(service.listarActivas()); 
    }

    @Operation(summary = "Listar todas las categorías", description = "Obtiene todas las categorías incluyendo inactivas")
    @GetMapping("/todas")
    public ResponseEntity<List<Categoria>> listarTodas() { 
        return ResponseEntity.ok(service.listar()); 
    }

    @Operation(summary = "Listar categorías por tipo", description = "Filtra categorías por tipo (principal, temporal)")
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Categoria>> porTipo(
            @Parameter(description = "Tipo de categoría: principal o temporal") @PathVariable String tipo) {
        return ResponseEntity.ok(service.listarPorTipo(tipo));
    }

    @Operation(summary = "Obtener categoría por ID", description = "Busca una categoría específica por su identificador")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoría encontrada"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtener(
            @Parameter(description = "ID de la categoría") @PathVariable Long id) {
        return service.buscarPorId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear nueva categoría", description = "Agrega una nueva categoría al sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoría creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Error de validación o nombre duplicado")
    })
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Categoria c) {
        if (service.existePorNombre(c.getNombre())) {
            return ResponseEntity.badRequest().body("Ya existe una categoría con ese nombre");
        }
        Categoria creada = service.crear(c);
        return ResponseEntity.ok(creada);
    }

    @Operation(summary = "Actualizar categoría", description = "Modifica los datos de una categoría existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoría actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @Parameter(description = "ID de la categoría") @PathVariable Long id, 
            @Valid @RequestBody Categoria c) {
        try {
            Categoria actualizada = service.actualizar(id, c);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar categoría", description = "Elimina permanentemente una categoría del sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID de la categoría") @PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}