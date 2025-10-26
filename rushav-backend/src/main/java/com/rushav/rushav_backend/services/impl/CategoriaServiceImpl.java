package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Categoria;
import com.rushav.rushav_backend.repositories.CategoriaRepository;
import com.rushav.rushav_backend.services.CategoriaService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImpl implements CategoriaService {
    private final CategoriaRepository repo;

    public CategoriaServiceImpl(CategoriaRepository repo) { 
        this.repo = repo; 
    }

    @Override public List<Categoria> listar() { return repo.findAll(); }
    @Override public List<Categoria> listarActivas() { return repo.findByActivaTrue(); }
    @Override public List<Categoria> listarPorTipo(String tipo) { return repo.findByTipo(tipo); }
    @Override public Optional<Categoria> buscarPorId(Long id) { return repo.findById(id); }
    @Override public Optional<Categoria> buscarPorNombre(String nombre) { return repo.findByNombre(nombre); }
    
    @Override 
    public Categoria crear(Categoria categoria) { 
        return repo.save(categoria); 
    }

    @Override 
    public Categoria actualizar(Long id, Categoria categoria) {
        return repo.findById(id).map(ex -> {
            ex.setNombre(categoria.getNombre());
            ex.setDescripcion(categoria.getDescripcion());
            ex.setTipo(categoria.getTipo());
            ex.setActiva(categoria.isActiva());
            return repo.save(ex);
        }).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    @Override public void eliminar(Long id) { repo.deleteById(id); }
    @Override public boolean existePorNombre(String nombre) { return repo.existsByNombre(nombre); }
}