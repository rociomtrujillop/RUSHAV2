package com.rushav.rushav_backend.dtos.pedido;
public class DireccionData {
    private String calle; private String departamento; private String region; private String comuna;
    public String getCalle() { return calle; } void setCalle(String c) { calle = c; }
    public String getDepartamento() { return departamento; } void setDepartamento(String d) { departamento = d; }
    public String getRegion() { return region; } void setRegion(String r) { region = r; }
    public String getComuna() { return comuna; } void setComuna(String c) { comuna = c; }
}