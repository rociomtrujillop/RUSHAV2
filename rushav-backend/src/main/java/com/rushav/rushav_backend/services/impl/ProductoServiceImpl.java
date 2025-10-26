package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Producto;
import com.rushav.rushav_backend.repositories.ProductoRepository;
import com.rushav.rushav_backend.services.ProductoService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {
    private final ProductoRepository repo;

    public ProductoServiceImpl(ProductoRepository repo) { 
        this.repo = repo; 
    }

    @Override public List<Producto> listar() { return repo.findAll(); }
    @Override public Optional<Producto> buscarPorId(Long id) { return repo.findById(id); }
    @Override public Producto crear(Producto p) { return repo.save(p); }
    
    @Override 
    public Producto actualizar(Long id, Producto p) {
        return repo.findById(id).map(ex -> {
            ex.setNombre(p.getNombre());
            ex.setDescripcion(p.getDescripcion());
            ex.setPrecio(p.getPrecio());
            ex.setStock(p.getStock());
            ex.setActivo(p.isActivo());
            ex.setImagenes(p.getImagenes());
            ex.setGenero(p.getGenero()); // NUEVO: actualizar género
            if (p.getCategorias() != null) {
                ex.setCategorias(p.getCategorias());
            }
            return repo.save(ex);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Override public void eliminar(Long id) { repo.deleteById(id); }
    @Override public List<Producto> porNombre(String nombre) { return repo.findByNombreContainingIgnoreCase(nombre); }
    
    @Override public List<Producto> productosConStockBajo() { return repo.findByStockLessThan(5); }
    @Override public long contarTotalProductos() { return repo.count(); }
    @Override public List<Producto> buscarPorCategoriaId(Long categoriaId) { return repo.findByCategoriasId(categoriaId); }
    
    @Override public List<Producto> filtrarPorGenero(String genero) { return repo.findByGenero(genero); }
    @Override public List<Producto> filtrarPorGeneroYCategoria(String genero, Long categoriaId) { 
        return repo.findByGeneroAndCategoriasId(genero, categoriaId); 
    }
    @Override public List<Producto> buscarPorGeneroYNombre(String genero, String nombre) { 
        return repo.findByGeneroAndNombreContainingIgnoreCase(genero, nombre); 
    }
}