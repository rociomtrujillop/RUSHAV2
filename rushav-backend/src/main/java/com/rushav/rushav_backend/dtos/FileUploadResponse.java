package com.rushav.rushav_backend.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para respuesta de subida de archivos")
public class FileUploadResponse {
    
    @Schema(description = "Nombre del archivo guardado", example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg")
    private String nombreArchivo;
    
    @Schema(description = "URL para acceder al archivo", example = "/api/archivos/descargar/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg")
    private String urlArchivo;
    
    @Schema(description = "Mensaje de resultado", example = "Archivo subido exitosamente")
    private String mensaje;

    public FileUploadResponse(String nombreArchivo, String urlArchivo, String mensaje) {
        this.nombreArchivo = nombreArchivo;
        this.urlArchivo = urlArchivo;
        this.mensaje = mensaje;
    }

    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }
    
    public String getUrlArchivo() { return urlArchivo; }
    public void setUrlArchivo(String urlArchivo) { this.urlArchivo = urlArchivo; }
    
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}