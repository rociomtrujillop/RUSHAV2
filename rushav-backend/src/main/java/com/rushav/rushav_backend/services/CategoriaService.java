package com.rushav.rushav_backend.services;

import com.rushav.rushav_backend.entities.Categoria;
import java.util.List;
import java.util.Optional;

public interface CategoriaService {
    List<Categoria> listar();
    List<Categoria> listarActivas();
    List<Categoria> listarPorTipo(String tipo);
    Optional<Categoria> buscarPorId(Long id);
    Optional<Categoria> buscarPorNombre(String nombre);
    Categoria crear(Categoria categoria);
    Categoria actualizar(Long id, Categoria categoria);
    void eliminar(Long id);
    boolean existePorNombre(String nombre);
}