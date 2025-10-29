// src/components/Header.jsx (CORREGIDO - Eliminado useEffect y checkLoginStatus locales)

import React from 'react'; // No necesita useState/useEffect
import { Link, useNavigate } from 'react-router-dom'; 
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
// Importa el hook useAuth para obtener el estado del contexto
import { useAuth } from '../context/AuthContext'; 

function Header() {
  const navigate = useNavigate();
  // Obtiene el estado y funciones DIRECTAMENTE del contexto
  const { isLoggedIn, currentUser, logout, loadingAuth } = useAuth(); 

  // handleLogout ahora solo usa 'logout' del contexto
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  // Opcional: Mostrar estado de carga mientras el contexto verifica localStorage
  // if (loadingAuth) {
  //   return (
  //     <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
  //       <Container>
  //         <Navbar.Brand as={Link} to="/" className="logo">RUSHAV</Navbar.Brand>
  //         <Navbar.Text>Cargando...</Navbar.Text>
  //       </Container>
  //     </Navbar>
  //   );
  // }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">RUSHAV</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center"> 
            <Nav.Link as={Link} to="/ofertas">Ofertas</Nav.Link> 
            <Nav.Link as={Link} to="/categorias">Categorias</Nav.Link>
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link> 
            <Nav.Link as={Link} to="/carrito" className="carrito ms-2">Carrito</Nav.Link>
            {/* El bloque condicional usa directamente 'isLoggedIn' y 'currentUser' del contexto */}
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;