package com.rushav.rushav_backend.dtos;

import com.rushav.rushav_backend.entities.Usuario;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para respuesta de login")
public class LoginResponse {
    
    @Schema(description = "Mensaje de resultado", example = "OK")
    private String mensaje;
    
    @Schema(description = "Datos del usuario autenticado")
    private Usuario usuario;

    @Schema(description = "Token de autenticación JWT", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;
    
    public String getMensaje() {
        return mensaje;
    }
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    // --- Getters y Setters del Token ---
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}