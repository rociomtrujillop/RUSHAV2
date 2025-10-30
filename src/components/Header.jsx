// src/components/Header.jsx (Revertido a Izquierda + Control por CSS)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; 

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout } = useAuth(); 
  
  const [cartCount, setCartCount] = useState(0);

  // Función para leer el carrito de localStorage
  const updateCartCount = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carritoGuardado.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    setCartCount(totalItems);
  };

  // Efecto para cargar y escuchar cambios en el carrito
  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount); 
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []); 

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" collapseOnSelect>
      <Container>
        {/* Vuelve a usar la clase "logo" del styles.css */}
        <Navbar.Brand as={Link} to="/" className="logo">RUSHAV</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* --- 1. GRUPO IZQUIERDA (me-auto) --- */}
          {/* "me-auto" (margin-end: auto) alinea esto a la izquierda */}
          <Nav className="me-auto"> 
            <Nav.Link as={Link} to="/ofertas">Ofertas</Nav.Link> 
            <Nav.Link as={Link} to="/categorias">Categorias</Nav.Link>
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link> 
          </Nav>

          {/* --- 2. GRUPO DERECHA --- */}
          <Nav className="align-items-center">
            
            {/* Bloque de Login/Logout */}
            {isLoggedIn ? (
              <>
                {currentUser && (
                    <Navbar.Text className="text-white me-2 d-none d-lg-inline">
                        Hola, {currentUser.nombre.split(' ')[0]}
                    </Navbar.Text>
                )}
                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="ms-lg-2">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/registro">Registro</Nav.Link>
              </>
            )}

            {/* Link de Carrito (al final) */}
            <Nav.Link as={Link} to="/carrito" className="carrito ms-3">
              Carrito
              <Badge 
                pill 
                bg={cartCount > 0 ? "danger" : "secondary"} 
                className="ms-1"
              >
                {cartCount}
              </Badge>
            </Nav.Link>

          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;