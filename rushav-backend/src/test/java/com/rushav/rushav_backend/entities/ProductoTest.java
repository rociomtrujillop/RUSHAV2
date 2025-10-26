package com.rushav.rushav_backend.entities;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProductoTest {

    @Test
    void testProductoStockBajo() {
        Producto producto = new Producto();
        producto.setStock(3);

        assertTrue(producto.isStockBajo());
    }

    @Test
    void testProductoStockNormal() {
        Producto producto = new Producto();
        producto.setStock(10);

        assertFalse(producto.isStockBajo());
    }

    @Test
    void testGetImagenesArray() {
        Producto producto = new Producto();
        producto.setImagenes("img1.jpg,img2.jpg,img3.jpg");

        String[] imagenes = producto.getImagenesArray();

        assertEquals(3, imagenes.length);
        assertEquals("img1.jpg", imagenes[0]);
        assertEquals("img3.jpg", imagenes[2]);
    }

    @Test
    void testGetImagenesArrayVacio() {
        Producto producto = new Producto();
        producto.setImagenes("");

        String[] imagenes = producto.getImagenesArray();

        assertEquals(0, imagenes.length);
    }
}