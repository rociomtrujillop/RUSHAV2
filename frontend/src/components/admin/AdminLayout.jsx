import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom'; 
import { Nav, Button } from 'react-bootstrap'; 
import { useAuth } from '../../context/AuthContext'; // Asegúrate que la ruta sea correcta

function AdminLayout() {
  const navigate = useNavigate(); 
  const { logout } = useAuth(); // Obtiene logout del contexto

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); 
  };

  return (
    <div className="admin-layout"> 
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <Nav className="flex-column">
          <NavLink to="/admin" end className="nav-link">Inicio</NavLink>
          <h3 className="h6 mt-3">Usuarios</h3>
          <NavLink to="/admin/usuarios" className="nav-link">Ver Usuarios</NavLink>
          <NavLink to="/admin/usuarios/crear" className="nav-link">Crear Usuario</NavLink>
          <h3 className="h6 mt-3">Productos</h3>
          <NavLink to="/admin/productos" className="nav-link">Ver Productos</NavLink>
          <NavLink to="/admin/productos/crear" className="nav-link">Crear Producto</NavLink>
          <h3 className="h6 mt-3">Categorías</h3>
          <NavLink to="/admin/categorias" className="nav-link">Ver Categorías</NavLink>
          <NavLink to="/admin/categorias/crear" className="nav-link">Crear Categoría</NavLink>

          <Button 
            variant="danger" 
            size="sm"        
            className="mt-auto" 
            onClick={handleLogout} 
          >
            Cerrar Sesión
          </Button>
        </Nav>
      </div>
      <div className="main-content">
        {/* Aquí se renderiza AdminDashboard u otros componentes de admin */}
        <Outlet /> 
      </div>
    </div>
  );
}

export default AdminLayout;