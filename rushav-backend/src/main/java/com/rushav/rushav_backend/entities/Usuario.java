package com.rushav.rushav_backend.entities;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Schema(description = "Entidad que representa un usuario del sistema")
public class Usuario {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del usuario", example = "1")
    private Long id;

    @NotBlank 
    @Size(max = 100)
    @Schema(description = "Nombre completo del usuario", example = "Administrador", required = true)
    private String nombre;

    @NotBlank 
    @Email 
    @Size(max = 100) 
    @Column(unique = true)
    @Schema(description = "Email del usuario", example = "admin@rushav.cl", required = true)
    private String email;

    @NotBlank 
    @Size(min = 6, max = 100)
    @Schema(description = "Contraseña del usuario", example = "admin123", required = true)
    private String password;

    @NotBlank
    @Schema(description = "Rol del usuario en el sistema", example = "super-admin", allowableValues = {"super-admin", "cliente", "vendedor"})
    private String rol;

    @Schema(description = "Estado activo/inactivo del usuario", example = "true")
    private boolean activo = true;

    @NotBlank
    @Size(max = 100)
    @Schema(description = "Región del usuario", example = "Metropolitana", allowableValues = {"Metropolitana", "Valparaíso", "Biobío", "Araucanía", "Otras"})
    private String region;

    @NotBlank
    @Size(max = 100)
    @Schema(description = "Comuna del usuario", example = "Santiago", required = true)
    private String comuna;

    @CreationTimestamp
    @Schema(description = "Fecha de creación automática")
    private LocalDateTime fechaCreacion;

    public Usuario() {
    }

    public Usuario(Long id, @NotBlank @Size(max = 100) String nombre, @NotBlank @Email @Size(max = 100) String email,
            @NotBlank @Size(min = 4, max = 100) String password, @NotBlank String rol, boolean activo, String region, String comuna,
            LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.region = region;
        this.comuna = comuna;
        this.activo = activo;
        this.fechaCreacion = fechaCreacion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}