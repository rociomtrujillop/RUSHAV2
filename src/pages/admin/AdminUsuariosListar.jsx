// src/pages/admin/AdminUsuariosListar.jsx (Funciones movidas ANTES de useEffect)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Spinner, Alert, Form, Container } from 'react-bootstrap';

const API_URL = 'http://localhost:8080/api/usuarios';

function AdminUsuariosListar() {
  console.log("%c[AdminUsuariosListar] Renderizando...", "color: orange");

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 👇 FUNCIÓN fetchUsuarios DEFINIDA PRIMERO 👇 ---
  const fetchUsuarios = async () => {
    console.log("[AdminUsuariosListar] fetchUsuarios: Iniciando...");
    setLoading(true);
    setError(null);
    try {
      console.log(`[AdminUsuariosListar] fetchUsuarios: Haciendo fetch a ${API_URL}`);
      const response = await fetch(API_URL);
      console.log(`[AdminUsuariosListar] fetchUsuarios: Respuesta recibida, status: ${response.status}`);

      if (!response.ok) {
        let errorMsg = `Error ${response.status}`;
        try {
            const errorBody = await response.text();
            errorMsg += `: ${errorBody || response.statusText}`;
        } catch (e) { errorMsg += `: ${response.statusText}`; }
        console.error("[AdminUsuariosListar] fetchUsuarios: Error en respuesta fetch:", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("[AdminUsuariosListar] fetchUsuarios: Intentando parsear JSON...");
      const data = await response.json();
      console.log("[AdminUsuariosListar] fetchUsuarios: JSON parseado:", data);

      if (!Array.isArray(data)) {
          console.error("[AdminUsuariosListar] fetchUsuarios: La respuesta no es un array:", data);
          throw new Error("Formato de respuesta inesperado del servidor.");
      }

      console.log("[AdminUsuariosListar] fetchUsuarios: Llamando setUsuarios...");
      setUsuarios(data);
      console.log("[AdminUsuariosListar] fetchUsuarios: setUsuarios llamado.");

    } catch (err) {
      console.error("[AdminUsuariosListar] fetchUsuarios: Error en bloque try:", err);
      setError(err.message);
    } finally {
      console.log("[AdminUsuariosListar] fetchUsuarios: Bloque finally - Llamando setLoading(false)...");
      setLoading(false);
      console.log("[AdminUsuariosListar] fetchUsuarios: setLoading(false) llamado.");
    }
  };
  // --- 👆 FIN fetchUsuarios 👆 ---

  // --- 👇 FUNCIÓN handleEliminar DEFINIDA ANTES (necesita fetchUsuarios) 👇 ---
  const handleEliminar = async (id) => {
      if (id === 1) { alert('No puedes eliminar al admin.'); return; }
      if (window.confirm('¿Seguro?')) {
          try {
              const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
              if (!response.ok) throw new Error('Error al eliminar');
              alert('Usuario eliminado');
              fetchUsuarios(); // Llama a la función que ya está definida arriba
          } catch (err) {
              alert(err.message);
          }
      }
  };
  // --- 👆 FIN handleEliminar 👆 ---


  // --- useEffect para Carga Inicial (AHORA PUEDE LLAMAR A fetchUsuarios) ---
  useEffect(() => {
    console.log("%c[AdminUsuariosListar] useEffect: DISPARADO", "background: #222; color: #bada55");
    // Llama a la función que ya está definida arriba
    fetchUsuarios();
    return () => {
        console.log("[AdminUsuariosListar] useEffect: Limpieza ejecutada.");
    };
  }, []); // Dependencia vacía

  // Lógica de filtrado (sin cambios)
  const usuariosFiltrados = usuarios.filter(user => {
       if (!searchTerm) return true;
       const term = searchTerm.toLowerCase();
       return (
          (user.nombre && user.nombre.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term))
       );
  });

  // --- Renderizado Condicional ---
  console.log(`%c[AdminUsuariosListar] Renderizando - Estado: loading=${loading}, error=${error}`, "color: purple");

  if (loading) {
      console.log("[AdminUsuariosListar] Render: Mostrando Spinner.");
      return ( <Container className="text-center p-5"><Spinner animation="border" variant="primary" /></Container> );
  }
  if (error) {
      console.log("[AdminUsuariosListar] Render: Mostrando Alert de error.");
      return ( <Container className="p-5"><Alert variant="danger">Error al cargar usuarios: {error}</Alert><Button onClick={fetchUsuarios} variant="warning">Reintentar Carga</Button></Container> );
  }

  // --- Renderizado Tabla ---
  console.log("[AdminUsuariosListar] Render: Mostrando Tabla.");
  return (
    <>
      <h2>Gestión de Usuarios</h2>
      {/* Controles */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
           <Button as={Link} to="/admin/usuarios/crear" variant="primary">Crear Nuevo Usuario</Button>
           <Form.Control type="text" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ maxWidth: '300px' }}/>
      </div>
      {/* Tabla */}
      <Table striped bordered hover responsive>
         <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Región</th><th>Comuna</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr></thead>
         <tbody>
          {usuariosFiltrados.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.nombre || '-'}</td><td>{u.email || '-'}</td><td>{u.region || '-'}</td><td>{u.comuna || '-'}</td><td>{u.rol || '-'}</td><td>{u.activo ? 'Sí' : 'No'}</td><td>
                <Button as={Link} to={`/admin/usuarios/editar/${u.id}`} variant="warning" size="sm" className="me-2">Editar</Button>
                {u.id !== 1 && ( <Button variant="danger" size="sm" onClick={() => handleEliminar(u.id)}>Eliminar</Button> )}
              </td>
            </tr>
          ))}
          {usuariosFiltrados.length === 0 && ( <tr><td colSpan="8" className="text-center">No se encontraron usuarios.</td></tr> )}
        </tbody>
      </Table>
    </>
  );
}

export default AdminUsuariosListar;