package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.LoginRequest;
import com.rushav.rushav_backend.dtos.LoginResponse;
import com.rushav.rushav_backend.entities.Usuario;
import com.rushav.rushav_backend.services.UsuarioService;
import com.rushav.rushav_backend.services.JwtService; // IMPORTAR
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private UsuarioService usuarioServiceMock;

    @Mock
    private PasswordEncoder passwordEncoderMock;
    
    @Mock // 1. AÑADIR MOCK DE JWT
    private JwtService jwtServiceMock;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); 
    }

    @Test
    void testLoginExitoso() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");

        Usuario usuarioEncontrado = new Usuario();
        usuarioEncontrado.setId(1L);
        usuarioEncontrado.setEmail("test@test.com");
        usuarioEncontrado.setNombre("Test User");
        usuarioEncontrado.setPassword("$2a$10$hash..."); 
        usuarioEncontrado.setRol("cliente");

        when(usuarioServiceMock.buscarPorEmail("test@test.com")).thenReturn(Optional.of(usuarioEncontrado));
        when(passwordEncoderMock.matches("password123", "$2a$10$hash...")).thenReturn(true);
        // 2. SIMULAR EL TOKEN
        when(jwtServiceMock.generateToken(any(Usuario.class))).thenReturn("token_falso_123");

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("OK", response.getBody().getMensaje());
        // 3. USAR getUsuario() EN SINGULAR
        assertNotNull(response.getBody().getUsuario());
        assertEquals("test@test.com", response.getBody().getUsuario().getEmail());
        // Verificar que recibimos el token
        assertEquals("token_falso_123", response.getBody().getToken());
    }
    
    // ... (El resto de tus tests son iguales, solo cambia getUsuarios por getUsuario) ...
    
    @Test
    void testLoginPasswordIncorrecto() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("incorrecta");

        Usuario usuarioEncontrado = new Usuario();
        usuarioEncontrado.setId(1L);
        usuarioEncontrado.setEmail("test@test.com");
        usuarioEncontrado.setPassword("$2a$10$hash...");
        
        when(usuarioServiceMock.buscarPorEmail("test@test.com")).thenReturn(Optional.of(usuarioEncontrado));
        when(passwordEncoderMock.matches("incorrecta", "$2a$10$hash...")).thenReturn(false);

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Credenciales incorrectas", response.getBody().getMensaje());
        assertNull(response.getBody().getUsuario()); // Singular
    }
    
    // Repite el cambio de .getUsuarios() a .getUsuario() en los demás tests
}