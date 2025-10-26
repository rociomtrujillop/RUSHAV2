package com.rushav.rushav_backend.services;

import com.rushav.rushav_backend.entities.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> listar();
    Optional<Usuario> buscarPorId(Long id);
    Optional<Usuario> buscarPorEmail(String email);
    Usuario crear(Usuario u);
    Usuario actualizar(Long id, Usuario u);
    void eliminar(Long id);
    long contarTotalUsuarios();
}