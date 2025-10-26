package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.LoginRequest;
import com.rushav.rushav_backend.dtos.LoginResponse;
import com.rushav.rushav_backend.entities.Usuario;
import com.rushav.rushav_backend.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        if (req == null || req.getEmail() == null || req.getPassword() == null) {
            LoginResponse r = new LoginResponse();
            r.setMensaje("Datos incompletos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(r);
        }

        Optional<Usuario> opt = usuarioService.buscarPorEmail(req.getEmail().trim().toLowerCase());
        if (opt.isEmpty()) {
            LoginResponse r = new LoginResponse();
            r.setMensaje("Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(r);
        }

        Usuario u = opt.get();
        
        // COMPARACIÓN DIRECTA - SIN BCRYPT
        if (u.getPassword().equals(req.getPassword())) {
            u.setPassword(null);
            LoginResponse r = new LoginResponse();
            r.setMensaje("OK");
            r.setUsuarios(u);
            return ResponseEntity.ok(r);
        } else {
            LoginResponse r = new LoginResponse();
            r.setMensaje("Credenciales incorrectas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(r);
        }
    }
}