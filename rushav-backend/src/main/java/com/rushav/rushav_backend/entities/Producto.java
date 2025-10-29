package com.rushav.rushav_backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "productos")
@Schema(description = "Entidad que representa un producto en el catálogo")public class Producto {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank 
    @Size(max = 200)
    @Schema(description = "Nombre del producto", example = "Polera Heartstruck", required = true)
    private String nombre;

    @Size(max = 1000)
    @Schema(description = "Descripción detallada del producto", example = "Polera oversize con estampado exclusivo")
    private String descripcion;

    @PositiveOrZero
    @Schema(description = "Precio del producto en pesos chilenos", example = "9990")
    private int precio;

    @PositiveOrZero
    @Schema(description = "Cantidad disponible en inventario", example = "20")
    private int stock;

    @Schema(description = "Estado activo/inactivo del producto", example = "true")
    private boolean activo = true;

    @Column(length = 1000)
    @Schema(description = "URLs de imágenes del producto separadas por coma", example = "img/producto1.jpg,img/producto2.jpg")
    private String imagenes;

    @Schema(description = "Género target del producto", example = "hombre", allowableValues = {"hombre", "mujer", "unisex"})
    private String genero; 

    @CreationTimestamp
    @Schema(description = "Fecha de creación automática")
    private LocalDateTime fechaCreacion;

    @ManyToMany
    @JoinTable(
        name = "producto_categorias",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    @Schema(description = "Categorías asociadas al producto")
    private Set<Categoria> categorias = new HashSet<>();

    public Producto() {}

    public Producto(Long id, String nombre, String descripcion, int precio, int stock, 
                   boolean activo, String imagenes, String genero, LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.activo = activo;
        this.imagenes = imagenes;
        this.genero = genero;
        this.fechaCreacion = fechaCreacion;
    }

    public boolean isStockBajo() {
        return this.stock < 5;
    }

    public String[] getImagenesArray() {
        if (this.imagenes == null || this.imagenes.trim().isEmpty()) {
            return new String[0];
        }
        return this.imagenes.split(",");
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public int getPrecio() { return precio; }
    public void setPrecio(int precio) { this.precio = precio; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
    public String getImagenes() { return imagenes; }
    public void setImagenes(String imagenes) { this.imagenes = imagenes; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public Set<Categoria> getCategorias() { return categorias; }
    public void setCategorias(Set<Categoria> categorias) { this.categorias = categorias; }
}