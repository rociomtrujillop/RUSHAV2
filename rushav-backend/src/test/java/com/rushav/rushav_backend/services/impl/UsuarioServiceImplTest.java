package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Usuario;
import com.rushav.rushav_backend.repositories.UsuarioRepository;
// 1. IMPORTA EL PASSWORD ENCODER
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    // --- 2. AÑADE EL MOCK QUE FALTABA ---
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    @Test
    public void testCrearUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Test User");
        usuario.setEmail("test@test.com");
        usuario.setPassword("password123"); 

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Test User");
        usuarioGuardado.setPassword("hash_encriptado_simulado"); 

        when(passwordEncoder.encode("password123")).thenReturn("hash_encriptado_simulado");
        
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        Usuario resultado = usuarioService.crear(usuario);

        assertNotNull(resultado.getId());
        assertEquals("Test User", resultado.getNombre());
        
        assertEquals("hash_encriptado_simulado", resultado.getPassword());
        
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    public void testContarTotalUsuarios() {
        when(usuarioRepository.count()).thenReturn(5L);

        long resultado = usuarioService.contarTotalUsuarios();

        assertEquals(5L, resultado);
    }
}