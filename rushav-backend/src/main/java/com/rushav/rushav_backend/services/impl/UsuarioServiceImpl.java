package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Usuario;
import com.rushav.rushav_backend.repositories.UsuarioRepository;
import com.rushav.rushav_backend.services.UsuarioService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository repo;

    public UsuarioServiceImpl(UsuarioRepository repo) { 
        this.repo = repo; 
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
    
    @Override
    public Usuario crear(Usuario u) {
        // SIN ENCRIPTACIÓN - guarda password directo
        if (u.getRol() == null) u.setRol("cliente");
        return repo.save(u);
    }

    @Override
    public Usuario actualizar(Long id, Usuario u) {
        return repo.findById(id).map(ex -> {
            ex.setNombre(u.getNombre());
            ex.setEmail(u.getEmail());
            if (u.getPassword() != null && !u.getPassword().isBlank()) {
                ex.setPassword(u.getPassword()); // Guarda directo
            }
            ex.setRol(u.getRol());
            ex.setActivo(u.isActivo());
            return repo.save(ex);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override 
    public void eliminar(Long id) { 
        repo.deleteById(id); 
    }

    @Override 
    public long contarTotalUsuarios() { 
        return repo.count(); 
    }
}