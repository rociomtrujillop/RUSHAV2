package com.rushav.rushav_backend.repositories;

import com.rushav.rushav_backend.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByActivaTrue();
    List<Categoria> findByTipo(String tipo);
    Optional<Categoria> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}