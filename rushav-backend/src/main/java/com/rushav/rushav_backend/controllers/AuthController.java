package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.LoginRequest;
import com.rushav.rushav_backend.dtos.LoginResponse;
import com.rushav.rushav_backend.entities.Usuario;
import com.rushav.rushav_backend.services.UsuarioService;
import com.rushav.rushav_backend.services.JwtService; // Importa el servicio

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "1. Autenticación", description = "Endpoints para manejo de login y autenticación")
public class AuthController {
    
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // 1. DECLARAR LA VARIABLE

    // 2. AÑADIR AL CONSTRUCTOR (Inyección de Dependencias)
    public AuthController(UsuarioService usuarioService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Iniciar sesión", description = "Valida credenciales de usuario y retorna información del perfil")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login exitoso"),
        @ApiResponse(responseCode = "401", description = "Credenciales incorrectas"),
        @ApiResponse(responseCode = "400", description = "Datos incompletos o inválidos")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        if (req == null || req.getEmail() == null || req.getPassword() == null) {
             LoginResponse r = new LoginResponse();
             r.setMensaje("Datos incompletos");
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(r);
        }

        Optional<Usuario> opt = usuarioService.buscarPorEmail(req.getEmail());
        if (opt.isEmpty()) { 
             LoginResponse r = new LoginResponse();
             r.setMensaje("Usuario no encontrado");
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(r);
        }

        Usuario u = opt.get();
        
        if (passwordEncoder.matches(req.getPassword(), u.getPassword())) {
            String jwtToken = this.jwtService.generateToken(u); 
            
            LoginResponse r = new LoginResponse();
            r.setMensaje("OK");
            r.setUsuario(u);
            r.setToken(jwtToken); // Guardamos el token
            return ResponseEntity.ok(r);
        } else {
            LoginResponse r = new LoginResponse();
            r.setMensaje("Credenciales incorrectas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(r);
        }
    }
}