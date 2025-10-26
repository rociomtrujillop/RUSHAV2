package com.rushav.rushav_backend.dtos;

import com.rushav.rushav_backend.entities.Usuario;

public class LoginResponse {
    private String mensaje;
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