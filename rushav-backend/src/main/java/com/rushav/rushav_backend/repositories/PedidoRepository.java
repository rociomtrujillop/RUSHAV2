package com.rushav.rushav_backend.repositories;
import com.rushav.rushav_backend.entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId); // Para el historial
}