package com.rushav.rushav_backend.dtos;

import com.rushav.rushav_backend.entities.Usuario;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para respuesta de login")
public class LoginResponse {
    
    @Schema(description = "Mensaje de resultado", example = "OK")
    private String mensaje;
    
    @Schema(description = "Datos del usuario autenticado")
    private Usuario usuario;
    
    public String getMensaje() {
        return mensaje;
    }
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
    public Usuario getUsuarios() {
        return usuario;
    }
    public void setUsuarios(Usuario usuario) {
        this.usuario = usuario;
    }
}