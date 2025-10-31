package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.FileUploadResponse;
import com.rushav.rushav_backend.services.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/archivos")
@CrossOrigin(origins = "*")
@Tag(name = "6. Archivos", description = "Gestión de subida y descarga de archivos")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @Operation(summary = "Subir archivo", description = "Sube un archivo al servidor (solo imágenes permitidas)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Archivo subido exitosamente"),
        @ApiResponse(responseCode = "400", description = "Tipo de archivo no permitido o tamaño excedido")
    })
    @PostMapping("/subir")
    public ResponseEntity<FileUploadResponse> subirArchivo(
            @Parameter(description = "Archivo de imagen a subir") @RequestParam("archivo") MultipartFile archivo) {
        try {
            String contentType = archivo.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(new FileUploadResponse(null, null, "Solo se permiten archivos de imagen"));
            }

            if (archivo.getSize() > 5 * 1024 * 1024) { // 5MB
                return ResponseEntity.badRequest()
                    .body(new FileUploadResponse(null, null, "El archivo no puede ser mayor a 5MB"));
            }

            String nombreArchivo = fileStorageService.almacenarArchivo(archivo);
            String urlArchivo = "/api/archivos/descargar/" + nombreArchivo;

            FileUploadResponse response = new FileUploadResponse(
                nombreArchivo, 
                urlArchivo, 
                "Archivo subido exitosamente"
            );

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new FileUploadResponse(null, null, "Error al subir el archivo: " + e.getMessage()));
        }
    }

    @Operation(summary = "Subir múltiples archivos", description = "Sube varios archivos al servidor en una sola operación")
    @PostMapping("/subir-multiple")
    public ResponseEntity<List<FileUploadResponse>> subirMultiplesArchivos(
            @Parameter(description = "Archivos de imagen a subir") @RequestParam("archivos") MultipartFile[] archivos) {
        List<FileUploadResponse> respuestas = Arrays.stream(archivos)
            .map(archivo -> {
                try {
                    String nombreArchivo = fileStorageService.almacenarArchivo(archivo);
                    String urlArchivo = "/api/archivos/descargar/" + nombreArchivo;
                    return new FileUploadResponse(nombreArchivo, urlArchivo, "Archivo subido exitosamente");
                } catch (IOException e) {
                    return new FileUploadResponse(null, null, "Error al subir archivo: " + e.getMessage());
                }
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(respuestas);
    }

    @Operation(summary = "Descargar archivo", description = "Descarga un archivo del servidor por su nombre")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Archivo descargado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Archivo no encontrado")
    })
    @GetMapping("/descargar/{nombreArchivo:.+}")
    public ResponseEntity<byte[]> descargarArchivo(
            @Parameter(description = "Nombre del archivo a descargar") @PathVariable String nombreArchivo) {
        try {
            byte[] archivoData = fileStorageService.cargarArchivo(nombreArchivo);
            
            if (archivoData == null) {
                return ResponseEntity.notFound().build();
            }

            String contentType = determinarContentType(nombreArchivo);

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + nombreArchivo + "\"")
                .body(archivoData);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Eliminar archivo", description = "Elimina un archivo del servidor")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Archivo eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Archivo no encontrado")
    })
    @DeleteMapping("/{nombreArchivo:.+}")
    public ResponseEntity<String> eliminarArchivo(
            @Parameter(description = "Nombre del archivo a eliminar") @PathVariable String nombreArchivo) {
        try {
            boolean eliminado = fileStorageService.eliminarArchivo(nombreArchivo);
            if (eliminado) {
                return ResponseEntity.ok("Archivo eliminado exitosamente");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al eliminar el archivo: " + e.getMessage());
        }
    }

    private String determinarContentType(String nombreArchivo) {
        if (nombreArchivo.toLowerCase().endsWith(".jpg") || nombreArchivo.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (nombreArchivo.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (nombreArchivo.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (nombreArchivo.toLowerCase().endsWith(".webp")) {
            return "image/webp";
        } else {
            return "application/octet-stream";
        }
    }
}