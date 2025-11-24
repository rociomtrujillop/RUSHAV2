package com.rushav.rushav_backend.dtos.pedido;
import java.util.List;
public class PedidoRequest {
    private ClienteData cliente;
    private DireccionData direccion;
    private List<ItemData> items;
    private Long total;
    private Long usuarioId;

    public ClienteData getCliente() { return cliente; }
    public void setCliente(ClienteData cliente) { this.cliente = cliente; }
    public DireccionData getDireccion() { return direccion; }
    public void setDireccion(DireccionData direccion) { this.direccion = direccion; }
    public List<ItemData> getItems() { return items; }
    public void setItems(List<ItemData> items) { this.items = items; }
    public Long getTotal() { return total; }
    public void setTotal(Long total) { this.total = total; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}