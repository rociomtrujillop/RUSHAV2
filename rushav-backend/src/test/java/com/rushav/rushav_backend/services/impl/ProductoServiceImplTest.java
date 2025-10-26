package com.rushav.rushav_backend.services.impl;

import com.rushav.rushav_backend.entities.Producto;
import com.rushav.rushav_backend.repositories.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    @Test
    public void testProductosConStockBajo() {
        // Configuración simple
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Test Product");
        producto.setStock(3); // Stock bajo

        when(productoRepository.findByStockLessThan(5)).thenReturn(Arrays.asList(producto));

        // Ejecutar
        List<Producto> resultado = productoService.productosConStockBajo();

        // Verificar
        assertEquals(1, resultado.size());
        assertEquals("Test Product", resultado.get(0).getNombre());
    }

    @Test
    public void testContarTotalProductos() {
        when(productoRepository.count()).thenReturn(10L);

        long resultado = productoService.contarTotalProductos();

        assertEquals(10L, resultado);
    }
}