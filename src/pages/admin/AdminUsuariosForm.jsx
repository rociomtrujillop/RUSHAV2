// src/pages/admin/AdminUsuariosForm.jsx (Corregido con Región/Comuna)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
// Importamos las regiones
import { regiones } from '../../data/regiones.js'; 

const API_URL = 'http://localhost:8080/api/usuarios';

function AdminUsuariosForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Estado del usuario (incluye region y comuna)
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'cliente',
    activo: true,
    region: '', // Añadido
    comuna: ''  // Añadido
  });

  // Estado para la lista de comunas (depende de la región seleccionada)
  const [comunas, setComunas] = useState([]); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Efecto 1: Cargar datos del usuario para editar ---
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchUsuario = async () => {
        try {
          const response = await fetch(`${API_URL}/${id}`);
          if (!response.ok) throw new Error('Usuario no encontrado');
          const data = await response.json();
          // Establecemos TODOS los campos (excepto password)
          setUsuario({ 
              ...data, 
              password: '', // Password en blanco por defecto al editar
              region: data.region || '', // Asegura que sea string vacío si es null
              comuna: data.comuna || ''   // Asegura que sea string vacío si es null
          }); 
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUsuario();
    }
  }, [isEditing, id]); // Depende de isEditing y id

  // --- Efecto 2: Actualizar lista de comunas cuando cambia la región del estado 'usuario' ---
  useEffect(() => {
    // Usamos usuario.region (del estado) para encontrar las comunas
    const regionSeleccionada = usuario.region; 
    const regionEncontrada = regiones.find(r => r.nombre === regionSeleccionada);
    const comunasDeRegion = regionEncontrada ? regionEncontrada.comunas : [];
    setComunas(comunasDeRegion);

    // Si la comuna actual en el estado no pertenece a la nueva lista de comunas,
    // la reseteamos (¡Importante al cambiar de región en el formulario!)
    if (regionSeleccionada && !comunasDeRegion.includes(usuario.comuna)) {
      setUsuario(prev => ({ ...prev, comuna: '' })); // Resetea la comuna en el estado
    }
    
  }, [usuario.region]); // Depende SOLO de usuario.region

  // --- Manejador de cambios (unificado) ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setUsuario(prev => {
        const newState = {
           ...prev,
           [name]: type === 'checkbox' ? checked : value
        };
        // Si cambió la región, reseteamos la comuna inmediatamente en el mismo update
        // (Esto evita un re-render extra del useEffect de comunas)
        if (name === 'region') {
            newState.comuna = ''; 
        }
        return newState;
    });
  };

  // --- Manejador de Submit (sin cambios en la lógica de envío) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validamos que si hay región, también haya comuna (excepto si se deja en blanco intencionalmente)
    if (usuario.region && !usuario.comuna) {
        setError('Si seleccionas una región, debes seleccionar una comuna.');
        setLoading(false);
        return;
    }

    const usuarioParaEnviar = { ...usuario };
    
    // Si estamos editando y el password está vacío, no lo enviamos para no sobreescribirlo
    if (isEditing && !usuario.password) {
      delete usuarioParaEnviar.password;
    }

    // Asegurarse de que region y comuna sean null si están vacíos, si tu backend lo prefiere
    // Si tu backend acepta strings vacíos, puedes quitar estas líneas:
    // if (!usuarioParaEnviar.region) usuarioParaEnviar.region = null;
    // if (!usuarioParaEnviar.comuna) usuarioParaEnviar.comuna = null;


    const url = isEditing ? `${API_URL}/${id}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioParaEnviar) // Enviamos el objeto completo
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || (isEditing ? 'Error al actualizar' : 'Error al crear'));
      }
      alert(`Usuario ${isEditing ? 'actualizado' : 'creado'} con éxito`);
      navigate('/admin/usuarios');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <Spinner animation="border" variant="primary" />;

  // --- JSX del Formulario (Añadimos selects de Región/Comuna) ---
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <Card.Title as="h2">{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombre" value={usuario.nombre} onChange={handleChange} required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={usuario.email} onChange={handleChange} required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  value={usuario.password} 
                  onChange={handleChange} 
                  placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''}
                  // Password solo es requerido al CREAR (!isEditing)
                  required={!isEditing} 
                />
              </Form.Group>

              {/* --- 👇 SELECTS REGIÓN Y COMUNA AÑADIDOS 👇 --- */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="regionAdmin">
                    <Form.Label>Región</Form.Label>
                    <Form.Select 
                      name="region" // Coincide con el estado
                      value={usuario.region} // Vinculado al estado
                      onChange={handleChange} // Usa el manejador unificado
                    >
                      <option value="">-- Sin Región --</option> {/* Opción para dejar en blanco */}
                      {regiones.map(r => (
                        <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="comunaAdmin">
                    <Form.Label>Comuna</Form.Label>
                    <Form.Select 
                      name="comuna" // Coincide con el estado
                      value={usuario.comuna} // Vinculado al estado
                      onChange={handleChange} // Usa el manejador unificado
                      // Se deshabilita si no hay región o si la lista de comunas está vacía
                      disabled={!usuario.region || comunas.length === 0} 
                    >
                      <option value="">-- Sin Comuna --</option> {/* Opción para dejar en blanco */}
                      {comunas.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              {/* --- 👆 FIN SELECTS 👆 --- */}
              
              <Form.Group className="mb-3" controlId="rol">
                <Form.Label>Rol</Form.Label>
                <Form.Select name="rol" value={usuario.rol} onChange={handleChange}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="activo">
                <Form.Check type="checkbox" name="activo" label="Activo" checked={usuario.activo} onChange={handleChange} />
              </Form.Group>
              
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner as="span" size="sm" /> : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario')}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminUsuariosForm;