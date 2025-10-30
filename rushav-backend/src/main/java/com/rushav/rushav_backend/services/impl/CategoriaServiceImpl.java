package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Categoria;
import com.rushav.rushav_backend.repositories.CategoriaRepository;
import com.rushav.rushav_backend.services.CategoriaService;
import org.springframework.dao.DataIntegrityViolationException; // <-- IMPORTANTE
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository repo;

    public CategoriaServiceImpl(CategoriaRepository repo) {
        this.repo = repo;
    }

    // --- Tus otros métodos (crear, listar, etc.) irían aquí ---
    @Override
    public List<Categoria> listar() {
        return repo.findAll();
    }
    
    @Override
    public List<Categoria> listarActivas() {
        // (Asumiendo que tienes este método en tu repo)
        return repo.findByActivaTrue();
    }

    @Override
    public Optional<Categoria> buscarPorId(Long id) {
        return repo.findById(id);
    }
    
    @Override
    public Categoria crear(Categoria c) {
         try {
            return repo.save(c);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Ya existe una categoría con ese nombre.");
        }
    }
    
    @Override
    public Categoria actualizar(Long id, Categoria c) {
        return repo.findById(id).map(existente -> {
            existente.setNombre(c.getNombre());
            existente.setDescripcion(c.getDescripcion());
            existente.setTipo(c.getTipo());
            existente.setActiva(c.isActiva());
            try {
                return repo.save(existente);
            } catch (DataIntegrityViolationException e) {
                throw new RuntimeException("Ya existe una categoría con ese nombre.");
            }
        }).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }
    
    @Override
    public boolean existePorNombre(String nombre) {
        // (Asumiendo que tienes esto en tu repo)
        return repo.existsByNombre(nombre); 
    }
    
    @Override
    public List<Categoria> listarPorTipo(String tipo) {
         // (Asumiendo que tienes esto en tu repo)
        return repo.findByTipo(tipo);
    }


    // --- MÉTODO ELIMINAR (MODIFICADO) ---
    @Override
    public void eliminar(Long id) {
        try {
            // Intenta eliminar
            repo.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            // Si falla, es porque está en uso (Foreign Key)
            throw new RuntimeException("No se puede eliminar la categoría porque está siendo usada por uno o más productos.");
        } catch (Exception e) {
            // Otros errores
            throw new RuntimeException("Error al eliminar la categoría.");
        }
    }

    @Override
    public Optional<Categoria> buscarPorNombre(String nombre) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'buscarPorNombre'");
    }
}