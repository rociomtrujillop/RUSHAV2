package com.rushav.rushav_backend.controllers;

import com.rushav.rushav_backend.dtos.LoginRequest;
import com.rushav.rushav_backend.dtos.LoginResponse;
import com.rushav.rushav_backend.entities.Usuario; // Asegúrate de importar Usuario
import com.rushav.rushav_backend.services.UsuarioService;
// 👇 IMPORTAR PasswordEncoder 👇
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.junit.jupiter.api.BeforeEach; // Para setup común
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks; // Para inyectar mocks automáticamente (opcional)
import org.mockito.Mock;        // Para declarar mocks (opcional)
import org.mockito.MockitoAnnotations; // Para inicializar mocks (opcional)
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    // --- Opción 1: Inyección con @Mock y @InjectMocks (más moderno) ---
    @Mock // Crea un mock de UsuarioService
    private UsuarioService usuarioServiceMock;

    @Mock // Crea un mock de PasswordEncoder
    private PasswordEncoder passwordEncoderMock;

    @InjectMocks // Crea una instancia de AuthController e inyecta los mocks de arriba
    private AuthController authController;

    @BeforeEach // Se ejecuta antes de CADA test
    void setUp() {
        // Inicializa los mocks declarados con @Mock y @InjectMocks
        MockitoAnnotations.openMocks(this); 
    }
    
    // --- Opción 2: Creación Manual (como lo tenías antes, también válida) ---
    // Si prefieres no usar @Mock/@InjectMocks, puedes hacer esto en cada test:
    // UsuarioService usuarioServiceMock = mock(UsuarioService.class);
    // PasswordEncoder passwordEncoderMock = mock(PasswordEncoder.class);
    // AuthController authController = new AuthController(usuarioServiceMock, passwordEncoderMock);

    @Test
    void testLoginExitoso() {
        // --- Preparación (Arrange) ---
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123"); // Contraseña ingresada por el usuario

        Usuario usuarioEncontrado = new Usuario();
        usuarioEncontrado.setId(1L);
        usuarioEncontrado.setEmail("test@test.com");
        usuarioEncontrado.setNombre("Test User");
        // Contraseña ENCRIPTADA como estaría en la BD
        usuarioEncontrado.setPassword("$2a$10$abcdefghijklmnopqrstuv"); 
        usuarioEncontrado.setRol("cliente");

        // Simula que el servicio encuentra al usuario por email
        when(usuarioServiceMock.buscarPorEmail("test@test.com")).thenReturn(Optional.of(usuarioEncontrado));
        
        // Simula que el PasswordEncoder dice que las contraseñas coinciden
        when(passwordEncoderMock.matches("password123", "$2a$10$abcdefghijklmnopqrstuv")).thenReturn(true);

        // --- Ejecución (Act) ---
        ResponseEntity<LoginResponse> response = authController.login(request);

        // --- Verificación (Assert) ---
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Status 200 OK
        assertNotNull(response.getBody());
        assertEquals("OK", response.getBody().getMensaje());
        assertNotNull(response.getBody().getUsuarios());
        assertEquals("test@test.com", response.getBody().getUsuarios().getEmail());
        assertNull(response.getBody().getUsuarios().getPassword()); // Verifica que la contraseña se ponga a null en la respuesta

        // Verifica que los mocks fueron llamados como se esperaba
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
        // Simula que el PasswordEncoder dice que NO coinciden
        when(passwordEncoderMock.matches("incorrecta", "$2a$10$abcdefghijklmnopqrstuv")).thenReturn(false);

        // --- Ejecución (Act) ---
        ResponseEntity<LoginResponse> response = authController.login(request);

        // --- Verificación (Assert) ---
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode()); // Status 401 Unauthorized
        assertNotNull(response.getBody());
        assertEquals("Credenciales incorrectas", response.getBody().getMensaje());
        assertNull(response.getBody().getUsuarios()); // No debe devolver usuario

        verify(usuarioServiceMock, times(1)).buscarPorEmail("test@test.com");
        verify(passwordEncoderMock, times(1)).matches("incorrecta", "$2a$10$abcdefghijklmnopqrstuv");
    }

    @Test
    void testLoginUsuarioNoEncontrado() {
        // Ya no necesitas crear mocks aquí si usas @Mock/@InjectMocks
        // UsuarioService usuarioService = mock(UsuarioService.class);
        // PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        // AuthController authController = new AuthController(usuarioService, passwordEncoder);
        
        LoginRequest request = new LoginRequest();
        request.setEmail("noexiste@test.com");
        request.setPassword("password123");

        // Usamos el mock inyectado (usuarioServiceMock)
        when(usuarioServiceMock.buscarPorEmail("noexiste@test.com")).thenReturn(Optional.empty());

        ResponseEntity<LoginResponse> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody()); // Verifica que el body no sea null
        assertEquals("Usuario no encontrado", response.getBody().getMensaje());
        assertNull(response.getBody().getUsuarios()); // No debe devolver usuario

        verify(usuarioServiceMock, times(1)).buscarPorEmail("noexiste@test.com");
         // Verifica que NUNCA se llame a matches si el usuario no se encuentra
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

        // Verifica que NUNCA se llame al servicio si los datos están incompletos
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