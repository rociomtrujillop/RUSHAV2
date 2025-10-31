package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.LoginRequest;
import com.rushav.rushav_backend.dtos.LoginResponse;
import com.rushav.rushav_backend.entities.Usuario; 
import com.rushav.rushav_backend.services.UsuarioService;
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
        usuarioEncontrado.setPassword("$2a$10$abcdefghijklmnopqrstuv"); 
        usuarioEncontrado.setRol("cliente");

        when(usuarioServiceMock.buscarPorEmail("test@test.com")).thenReturn(Optional.of(usuarioEncontrado));
        
        when(passwordEncoderMock.matches("password123", "$2a$10$abcdefghijklmnopqrstuv")).thenReturn(true);

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode()); // Status 200 OK
        assertNotNull(response.getBody());
        assertEquals("OK", response.getBody().getMensaje());
        assertNotNull(response.getBody().getUsuarios());
        assertEquals("test@test.com", response.getBody().getUsuarios().getEmail());
        assertNull(response.getBody().getUsuarios().getPassword()); // Verifica que la contraseña se ponga a null en la respuesta

        verify(usuarioServiceMock, times(1)).buscarPorEmail("test@test.com");
        verify(passwordEncoderMock, times(1)).matches("password123", "$2a$10$abcdefghijklmnopqrstuv");
    }
    
    @Test
    void testLoginPasswordIncorrecto() {
         // --- Preparación (Arrange) ---
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("incorrecta"); // Contraseña incorrecta

        Usuario usuarioEncontrado = new Usuario();
        usuarioEncontrado.setId(1L);
        usuarioEncontrado.setEmail("test@test.com");
        usuarioEncontrado.setPassword("$2a$10$abcdefghijklmnopqrstuv"); // Hash correcto en BD
        
        when(usuarioServiceMock.buscarPorEmail("test@test.com")).thenReturn(Optional.of(usuarioEncontrado));
        when(passwordEncoderMock.matches("incorrecta", "$2a$10$abcdefghijklmnopqrstuv")).thenReturn(false);

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode()); // Status 401 Unauthorized
        assertNotNull(response.getBody());
        assertEquals("Credenciales incorrectas", response.getBody().getMensaje());
        assertNull(response.getBody().getUsuarios()); // No debe devolver usuario

        verify(usuarioServiceMock, times(1)).buscarPorEmail("test@test.com");
        verify(passwordEncoderMock, times(1)).matches("incorrecta", "$2a$10$abcdefghijklmnopqrstuv");
    }

    @Test
    void testLoginUsuarioNoEncontrado() {
        
        LoginRequest request = new LoginRequest();
        request.setEmail("noexiste@test.com");
        request.setPassword("password123");

        when(usuarioServiceMock.buscarPorEmail("noexiste@test.com")).thenReturn(Optional.empty());

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody()); // Verifica que el body no sea null
        assertEquals("Usuario no encontrado", response.getBody().getMensaje());
        assertNull(response.getBody().getUsuarios()); // No debe devolver usuario

        verify(usuarioServiceMock, times(1)).buscarPorEmail("noexiste@test.com");
        verify(passwordEncoderMock, never()).matches(anyString(), anyString());
    }

    @Test
    void testLoginDatosIncompletos_EmailNull() {
        LoginRequest request = new LoginRequest();
        request.setEmail(null); 
        request.setPassword("password123");

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
         assertNotNull(response.getBody());
        assertEquals("Datos incompletos", response.getBody().getMensaje());
        assertNull(response.getBody().getUsuarios());

        verify(usuarioServiceMock, never()).buscarPorEmail(anyString());
        verify(passwordEncoderMock, never()).matches(anyString(), anyString());
    }

    @Test
    void testLoginDatosIncompletos_PasswordNull() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword(null);

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Datos incompletos", response.getBody().getMensaje());
        assertNull(response.getBody().getUsuarios());

        verify(usuarioServiceMock, never()).buscarPorEmail(anyString());
        verify(passwordEncoderMock, never()).matches(anyString(), anyString());
    }
}