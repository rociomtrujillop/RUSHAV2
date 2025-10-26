package com.rushav.rushav_backend.repositories;

import com.rushav.rushav_backend.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByStockLessThan(int stock);
    
    @Query("SELECT p FROM Producto p JOIN p.categorias c WHERE c.id = :categoriaId")
    List<Producto> findByCategoriasId(Long categoriaId);
    
    List<Producto> findByGenero(String genero);
    
    @Query("SELECT p FROM Producto p JOIN p.categorias c WHERE p.genero = :genero AND c.id = :categoriaId")
    List<Producto> findByGeneroAndCategoriasId(String genero, Long categoriaId);
    
    List<Producto> findByGeneroAndNombreContainingIgnoreCase(String genero, String nombre);
}