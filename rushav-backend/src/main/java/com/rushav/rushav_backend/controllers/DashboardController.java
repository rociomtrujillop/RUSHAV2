package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.services.ProductoService;
import com.rushav.rushav_backend.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    private final ProductoService productoService;
    private final UsuarioService usuarioService;

    public DashboardController(ProductoService productoService, UsuarioService usuarioService) {
        this.productoService = productoService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> getEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProductos", productoService.contarTotalProductos());
        stats.put("totalUsuarios", usuarioService.contarTotalUsuarios());
        stats.put("productosStockBajo", productoService.productosConStockBajo());
        return ResponseEntity.ok(stats);
    }
}