package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.pedido.*;
import com.rushav.rushav_backend.entities.*;
import com.rushav.rushav_backend.repositories.*;
import com.rushav.rushav_backend.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List; // Importante

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository pedidoRepo;
    private final DetallePedidoRepository detalleRepo;
    private final ProductoRepository productoRepo;
    private final UsuarioService usuarioService;

    public PedidoController(PedidoRepository pedidoRepo, DetallePedidoRepository detalleRepo, ProductoRepository productoRepo, UsuarioService usuarioService) {
        this.pedidoRepo = pedidoRepo;
        this.detalleRepo = detalleRepo;
        this.productoRepo = productoRepo;
        this.usuarioService = usuarioService;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequest req) {
        try {
            if (req.getItems() == null || req.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body("El pedido debe tener al menos un producto.");
            }

            Pedido pedido = new Pedido();
            
            // --- CÁLCULO DE IVA (Chile 19%) ---
            long total = req.getTotal();
            long neto = Math.round(total / 1.19); // Calculamos el neto
            long iva = total - neto;              // La diferencia es el IVA
            
            pedido.setTotal(total);
            pedido.setNeto(neto); // Guardamos neto
            pedido.setIva(iva);   // Guardamos IVA
            // ----------------------------------

            pedido.setNombreCliente(req.getCliente().getNombre() + " " + req.getCliente().getApellidos());
            pedido.setEmailCliente(req.getCliente().getEmail());
            pedido.setDireccionEnvio(req.getDireccion().getCalle() + ", " + req.getDireccion().getComuna() + ", " + req.getDireccion().getRegion());
            
            if (req.getUsuarioId() != null) {
                usuarioService.buscarPorId(req.getUsuarioId()).ifPresent(pedido::setUsuario);
            }

            pedido = pedidoRepo.save(pedido);

            List<DetallePedido> detalles = new ArrayList<>();
            for (ItemData item : req.getItems()) {
                Producto producto = productoRepo.findById(item.getId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getId()));

                if (producto.getStock() < item.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
                }

                producto.setStock(producto.getStock() - item.getCantidad());
                productoRepo.save(producto);

                DetallePedido detalle = new DetallePedido();
                detalle.setPedido(pedido);
                detalle.setProducto(producto);
                detalle.setCantidad(item.getCantidad());
                detalle.setPrecioUnitario(item.getPrecio());
                detalles.add(detalleRepo.save(detalle));
            }
            
            return ResponseEntity.ok(pedido);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar el pedido: " + e.getMessage());
        }
    }
    
    // --- NUEVO ENDPOINT: LISTAR TODOS (Para el Admin) ---
    @GetMapping("/todos")
    public ResponseEntity<List<Pedido>> listarTodos() {
        // Esto devuelve todas las ventas ordenadas por ID (o fecha si quisieras)
        return ResponseEntity.ok(pedidoRepo.findAll());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> historial(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoRepo.findByUsuarioId(usuarioId));
    }
}