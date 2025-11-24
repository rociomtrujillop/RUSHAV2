package com.rushav.rushav_backend.dtos.pedido;
public class ClienteData {
    private String nombre; private String apellidos; private String email;
    public String getNombre() { return nombre; } void setNombre(String n) { nombre = n; }
    public String getApellidos() { return apellidos; } void setApellidos(String a) { apellidos = a; }
    public String getEmail() { return email; } void setEmail(String e) { email = e; }
}