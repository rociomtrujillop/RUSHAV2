// src/pages/admin/AdminCategoriasForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:8080/api/categorias';

function AdminCategoriasForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categoria, setCategoria] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'principal',
    activa: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchCategoria = async () => {
        try {
          const response = await fetch(`${API_URL}/${id}`);
          if (!response.ok) throw new Error('Categoría no encontrada');
          const data = await response.json();
          setCategoria(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCategoria();
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoria(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    // ... (la lógica de submit no cambia) ...
    e.preventDefault();
    setLoading(true);
    setError(null);
    const url = isEditing ? `${API_URL}/${id}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria)
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || (isEditing ? 'Error al actualizar' : 'Error al crear'));
      }
      alert(`Categoría ${isEditing ? 'actualizada' : 'creada'} con éxito`);
      navigate('/admin/categorias');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <Spinner animation="border" variant="primary" />;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <Card.Title as="h2">{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombre" value={categoria.nombre} onChange={handleChange} required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} name="descripcion" value={categoria.descripcion} onChange={handleChange} />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="tipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Select name="tipo" value={categoria.tipo} onChange={handleChange}>
                  <option value="principal">Principal</option>
                  <option value="temporal">Temporal</option>
                  <option value="marca">Marca</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="activa">
                <Form.Check type="checkbox" name="activa" label="Activa" checked={categoria.activa} onChange={handleChange} />
              </Form.Group>
              
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner as="span" size="sm" /> : (isEditing ? 'Actualizar' : 'Crear')}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminCategoriasForm;