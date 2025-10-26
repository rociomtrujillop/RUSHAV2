package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.LoginRequest;
import com.rushav.rushav_backend.dtos.LoginResponse;
import com.rushav.rushav_backend.services.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Test
    void testLoginUsuarioNoEncontrado() {
        UsuarioService usuarioService = mock(UsuarioService.class);
        AuthController authController = new AuthController(usuarioService);
        
        LoginRequest request = new LoginRequest();
        request.setEmail("noexiste@test.com");
        request.setPassword("password123");

        when(usuarioService.buscarPorEmail("noexiste@test.com")).thenReturn(Optional.empty());

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Usuario no encontrado", response.getBody().getMensaje());
    }

    @Test
    void testLoginDatosIncompletos() {
        UsuarioService usuarioService = mock(UsuarioService.class);
        AuthController authController = new AuthController(usuarioService);
        
        LoginRequest request = new LoginRequest();
        request.setEmail(null); 
        request.setPassword("password123");

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Datos incompletos", response.getBody().getMensaje());
    }

    @Test
    void testLoginPasswordNull() {
        UsuarioService usuarioService = mock(UsuarioService.class);
        AuthController authController = new AuthController(usuarioService);
        
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword(null);

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Datos incompletos", response.getBody().getMensaje());
    }
}