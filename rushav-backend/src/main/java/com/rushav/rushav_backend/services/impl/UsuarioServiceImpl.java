package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Usuario;
import com.rushav.rushav_backend.repositories.UsuarioRepository;
import com.rushav.rushav_backend.services.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService, UserDetailsService {
    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Usuario> listar() {
        return repo.findAll();
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repo.findByEmail(email);
    }

    // --- MÉTODO CREAR (MODIFICADO) ---
    @Override
    public Usuario crear(Usuario u) {
        if (u.getRol() == null) u.setRol("cliente");
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        
        try {
            // Intenta guardar el usuario
            return repo.save(u);
        } catch (DataIntegrityViolationException e) {
            // Si falla, es probable que sea por el email duplicado
            // (Asumiendo que tienes una restricción UNIQUE en el email en tu BD)
            throw new RuntimeException("El email '" + u.getEmail() + "' ya está registrado.");
        }
    }

    // --- MÉTODO ACTUALIZAR (MODIFICADO) ---
    @Override
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        return repo.findById(id).map(usuarioExistente -> {
            
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
            usuarioExistente.setEmail(usuarioActualizado.getEmail());
            usuarioExistente.setRol(usuarioActualizado.getRol());
            usuarioExistente.setRegion(usuarioActualizado.getRegion());
            usuarioExistente.setComuna(usuarioActualizado.getComuna());
            usuarioExistente.setActivo(usuarioActualizado.isActivo());

            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isBlank()) {
                usuarioExistente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
            }
            
            try {
                // Intenta guardar
                return repo.save(usuarioExistente);
            } catch (DataIntegrityViolationException e) {
                // Atrapa el error si el *nuevo* email ya existe
                throw new RuntimeException("El email '" + usuarioActualizado.getEmail() + "' ya está registrado.");
            }

        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id)); 
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    @Override
    public long contarTotalUsuarios() {
        return repo.count();
    }

    // --- (loadUserByUsername se queda igual que antes) ---
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = repo.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
        GrantedAuthority authority = new SimpleGrantedAuthority(usuario.getRol());
        return new User(usuario.getEmail(), usuario.getPassword(), Collections.singletonList(authority));
    }
}