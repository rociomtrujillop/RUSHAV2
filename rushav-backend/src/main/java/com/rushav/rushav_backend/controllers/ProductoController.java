package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.entities.Producto;
import com.rushav.rushav_backend.services.FileStorageService;
import com.rushav.rushav_backend.services.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@Tag(name = "2. Productos", description = "Gestión completa de productos del catálogo")
public class ProductoController {
    private final ProductoService service;
    private final FileStorageService fileStorageService;

    public ProductoController(ProductoService service, FileStorageService fileStorageService) { 
        this.service = service; 
        this.fileStorageService = fileStorageService;
    }

    @Operation(summary = "Listar todos los productos", description = "Obtiene todos los productos activos del sistema")
    @GetMapping
    public ResponseEntity<List<Producto>> listar() { 
        return ResponseEntity.ok(service.listar()); 
    }

    @Operation(summary = "Obtener producto por ID", description = "Busca un producto específico por su identificador")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto encontrado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(
            @Parameter(description = "ID del producto") @PathVariable Long id) {
        return service.buscarPorId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Buscar productos por nombre", description = "Filtra productos que contengan el texto en su nombre")
    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscar(
            @Parameter(description = "Texto a buscar en nombres de productos") @RequestParam String nombre) {
        return ResponseEntity.ok(service.porNombre(nombre));
    }

    @Operation(summary = "Productos con stock bajo", description = "Obtiene productos con stock menor a 5 unidades")
    @GetMapping("/stock-bajo")
    public ResponseEntity<List<Producto>> productosStockBajo() {
        return ResponseEntity.ok(service.productosConStockBajo());
    }

    @Operation(summary = "Productos por categoría", description = "Filtra productos pertenecientes a una categoría específica")
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> porCategoria(
            @Parameter(description = "ID de la categoría") @PathVariable Long categoriaId) {
        return ResponseEntity.ok(service.buscarPorCategoriaId(categoriaId));
    }

    @Operation(summary = "Productos por género", description = "Filtra productos por género (hombre, mujer, unisex)")
    @GetMapping("/genero/{genero}")
    public ResponseEntity<List<Producto>> porGenero(
            @Parameter(description = "Género del producto") @PathVariable String genero) {
        return ResponseEntity.ok(service.filtrarPorGenero(genero));
    }

    @Operation(summary = "Productos por género y categoría", description = "Filtra productos por combinación de género y categoría")
    @GetMapping("/genero/{genero}/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> porGeneroYCategoria(
            @Parameter(description = "Género del producto") @PathVariable String genero, 
            @Parameter(description = "ID de la categoría") @PathVariable Long categoriaId) {
        return ResponseEntity.ok(service.filtrarPorGeneroYCategoria(genero, categoriaId));
    }

    @Operation(summary = "Buscar productos por género y nombre", description = "Combina búsqueda por texto y filtro por género")
    @GetMapping("/genero/{genero}/buscar")
    public ResponseEntity<List<Producto>> buscarPorGenero(
            @Parameter(description = "Género del producto") @PathVariable String genero, 
            @Parameter(description = "Texto a buscar en nombres") @RequestParam String nombre) {
        return ResponseEntity.ok(service.buscarPorGeneroYNombre(genero, nombre));
    }

    @Operation(summary = "Crear nuevo producto", description = "Agrega un nuevo producto al catálogo")
    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto p) {
        Producto creado = service.crear(p);
        return ResponseEntity.ok(creado);
    }

    @Operation(summary = "Actualizar producto", description = "Modifica los datos de un producto existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @Parameter(description = "ID del producto") @PathVariable Long id, 
            @Valid @RequestBody Producto p) {
        try {
            Producto actualizado = service.actualizar(id, p);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar producto", description = "Elimina permanentemente un producto del sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID del producto") @PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ========== MÉTODOS PARA IMÁGENES ==========

    @Operation(summary = "Agregar imágenes a producto", description = "Sube y asocia imágenes a un producto existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imágenes agregadas exitosamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Error en archivos o formato inválido")
    })
    @PostMapping("/{id}/imagenes")
    public ResponseEntity<?> agregarImagenesProducto(
            @Parameter(description = "ID del producto") @PathVariable Long id,
            @Parameter(description = "Archivos de imagen a subir") @RequestParam("imagenes") MultipartFile[] archivos) {
        
        try {
            Optional<Producto> productoOpt = service.buscarPorId(id);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Producto producto = productoOpt.get();
            String imagenesActuales = producto.getImagenes();
            
            // Subir nuevas imágenes
            List<String> nuevasImagenes = new ArrayList<>();
            for (MultipartFile archivo : archivos) {
                try {
                    if (archivo.getContentType() == null || !archivo.getContentType().startsWith("image/")) {
                        continue; // Saltar archivos que no son imágenes
                    }
                    
                    String nombreArchivo = fileStorageService.almacenarArchivo(archivo);
                    String urlImagen = "/api/archivos/descargar/" + nombreArchivo;
                    nuevasImagenes.add(urlImagen);
                } catch (IOException e) {
                    System.err.println("Error al subir archivo: " + e.getMessage());
                }
            }

            List<String> todasLasImagenes = new ArrayList<>();
            
            if (imagenesActuales != null && !imagenesActuales.trim().isEmpty()) {
                String[] existentes = imagenesActuales.split(",");
                todasLasImagenes.addAll(Arrays.asList(existentes));
            }
            
            todasLasImagenes.addAll(nuevasImagenes);
            
            producto.setImagenes(String.join(",", todasLasImagenes));
            Producto actualizado = service.actualizar(id, producto);
            
            return ResponseEntity.ok(actualizado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al agregar imágenes: " + e.getMessage());
        }
    }

    @Operation(summary = "Eliminar imagen de producto", description = "Remueve una imagen específica de un producto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imagen eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Índice de imagen no válido")
    })
    @DeleteMapping("/{productoId}/imagenes/{indice}")
    public ResponseEntity<?> eliminarImagenProducto(
            @Parameter(description = "ID del producto") @PathVariable Long productoId,
            @Parameter(description = "Índice de la imagen a eliminar (0-based)") @PathVariable int indice) {
        
        try {
            Optional<Producto> productoOpt = service.buscarPorId(productoId);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Producto producto = productoOpt.get();
            String imagenes = producto.getImagenes();
            
            if (imagenes == null || imagenes.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El producto no tiene imágenes");
            }

            String[] arrayImagenes = imagenes.split(",");
            if (indice < 0 || indice >= arrayImagenes.length) {
                return ResponseEntity.badRequest().body("Índice de imagen no válido");
            }

            String urlImagen = arrayImagenes[indice];
            String nombreArchivo = urlImagen.substring(urlImagen.lastIndexOf("/") + 1);
            
            try {
                fileStorageService.eliminarArchivo(nombreArchivo);
            } catch (IOException e) {
                System.err.println("No se pudo eliminar el archivo físico: " + e.getMessage());
            }
            
            List<String> listaImagenes = new ArrayList<>(Arrays.asList(arrayImagenes));
            listaImagenes.remove(indice);
            
            producto.setImagenes(!listaImagenes.isEmpty() ? String.join(",", listaImagenes) : null);
            Producto actualizado = service.actualizar(productoId, producto);
            
            return ResponseEntity.ok(actualizado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al eliminar imagen: " + e.getMessage());
        }
    }
}