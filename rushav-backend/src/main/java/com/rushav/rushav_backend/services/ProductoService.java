package com.rushav.rushav_backend.services;

import com.rushav.rushav_backend.entities.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> listar();
    Optional<Producto> buscarPorId(Long id);
    Producto crear(Producto p);
    Producto actualizar(Long id, Producto p);
    void eliminar(Long id);
    List<Producto> porNombre(String nombre);
    
    List<Producto> productosConStockBajo();
    long contarTotalProductos();
    List<Producto> buscarPorCategoriaId(Long categoriaId);
    
    List<Producto> filtrarPorGenero(String genero);
    List<Producto> filtrarPorGeneroYCategoria(String genero, Long categoriaId);
    List<Producto> buscarPorGeneroYNombre(String genero, String nombre);
}