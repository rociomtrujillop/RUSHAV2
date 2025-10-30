package com.rushav.rushav_backend.entities;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "categorias")
@Schema(description = "Entidad que representa una categoría de producto")
public class Categoria {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único de la categoría", example = "1")
    private Long id;

    @NotBlank 
    @Size(max = 100)
    @Schema(description = "Nombre de la categoría", example = "Poleras", required = true)
    private String nombre;

    @Size(max = 500)
    @Schema(description = "Descripción de la categoría", example = "Poleras y remeras")
    private String descripcion;

    @Schema(description = "Tipo de categoría", example = "principal", allowableValues = {"principal", "temporal"})
    private String tipo = "principal";

    @Schema(description = "Estado activo/inactivo de la categoría", example = "true")
    private boolean activa = true;

    @CreationTimestamp
    @Schema(description = "Fecha de creación automática")
    private LocalDateTime fechaCreacion;

    public Categoria() {}

    public Categoria(Long id, String nombre, String descripcion, String tipo, boolean activa, LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.activa = activa;
        this.fechaCreacion = fechaCreacion;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public boolean isActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}