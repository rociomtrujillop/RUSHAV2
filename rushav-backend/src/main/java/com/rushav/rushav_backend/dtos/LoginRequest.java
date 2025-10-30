package com.rushav.rushav_backend.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para solicitud de login")
public class LoginRequest {
    
    @Schema(description = "Email del usuario", example = "admin@rushav.cl", required = true)
    private String email;

    @Schema(description = "Contraseña del usuario", example = "admin123", required = true)
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}