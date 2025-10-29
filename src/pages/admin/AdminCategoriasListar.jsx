// src/pages/admin/AdminCategoriasListar.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:8080/api/categorias';

function AdminCategoriasListar() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todas`); 
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la categoría');
        fetchCategorias(); 
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>Gestión de Categorías</h2>
      <Button as={Link} to="/admin/categorias/crear" variant="primary" className="mb-3">
        Crear Nueva Categoría
      </Button>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Activa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nombre}</td>
              <td>{cat.tipo}</td>
              <td>{cat.activa ? 'Sí' : 'No'}</td>
              <td>
                <Button as={Link} to={`/admin/categorias/editar/${cat.id}`} variant="warning" size="sm" className="me-2">
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleEliminar(cat.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminCategoriasListar;