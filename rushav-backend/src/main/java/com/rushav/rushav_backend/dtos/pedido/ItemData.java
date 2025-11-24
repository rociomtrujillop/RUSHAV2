package com.rushav.rushav_backend.dtos.pedido;
public class ItemData {
    private Long id; private Integer cantidad; private Long precio;
    public Long getId() { return id; } void setId(Long i) { id = i; }
    public Integer getCantidad() { return cantidad; } void setCantidad(Integer c) { cantidad = c; }
    public Long getPrecio() { return precio; } void setPrecio(Long p) { precio = p; }
}