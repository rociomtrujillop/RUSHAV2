package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Usuario;
import com.rushav.rushav_backend.repositories.UsuarioRepository;
import com.rushav.rushav_backend.services.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {
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

    @Override
    public Usuario crear(Usuario u) {
        if (u.getRol() == null) u.setRol("cliente");
        // Los campos region y comuna se guardan si vienen en 'u'
        u.setPassword(passwordEncoder.encode(u.getPassword())); // Encriptar contraseña
        return repo.save(u);
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuarioActualizado) { // Renombrado 'u' para claridad
        // Busca el usuario existente por ID. Si no existe, lanza excepción.
        return repo.findById(id).map(usuarioExistente -> { // 'ex' renombrado a 'usuarioExistente'
            
            System.out.println("Actualizando usuario ID: " + id); // Log inicio
            System.out.println("Datos recibidos: " + usuarioActualizado); // Log datos entrantes (puede ser verboso)

            // Actualiza los campos del usuario existente ('ex') con los datos recibidos ('u')
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
            usuarioExistente.setEmail(usuarioActualizado.getEmail()); // <-- Actualiza el email
            usuarioExistente.setRol(usuarioActualizado.getRol());
            usuarioExistente.setRegion(usuarioActualizado.getRegion());
            usuarioExistente.setComuna(usuarioActualizado.getComuna());
            usuarioExistente.setActivo(usuarioActualizado.isActivo());

            // --- Lógica Clave para Contraseña ---
            // Verifica si en los datos recibidos ('u') viene una contraseña nueva y si no está vacía
            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isBlank()) {
                System.out.println("-> Se recibió nueva contraseña. Actualizando..."); // Log
                // Si SÍ viene una nueva, actualiza la contraseña en el usuario existente ('ex')
                usuarioExistente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword())); // Encriptar y guardar
            } else {
                System.out.println("-> No se recibió nueva contraseña o estaba vacía. Contraseña existente NO se modifica."); // Log
                // Si NO viene una nueva (es null o vacía), simplemente NO se hace nada,
                // por lo que 'usuarioExistente' MANTIENE su contraseña original de la base de datos.
            }
            // --- Fin Lógica Contraseña ---

            // Guarda la entidad 'usuarioExistente' (con todos los campos actualizados,
            // incluyendo la contraseña si correspondía) en la base de datos
            System.out.println("Guardando usuario actualizado...");
            return repo.save(usuarioExistente);

        // Mensaje de error si findById no encontró al usuario
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
}