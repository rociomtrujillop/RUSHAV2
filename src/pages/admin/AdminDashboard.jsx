// src/pages/admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:8080/api/dashboard/estadisticas';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('No se pudieron cargar las estadísticas');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return <Alert variant="warning">No hay estadísticas disponibles.</Alert>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Resumen de las actividades de la tienda.</p>
      <Row>
        <Col md={4}>
          <Card bg="primary" text="white" className="mb-3">
            <Card.Body>
              <Card.Title>Total Usuarios</Card.Title>
              <Card.Text className="display-4">{stats.totalUsuarios}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="success" text="white" className="mb-3">
            <Card.Body>
              <Card.Title>Total Productos</Card.Title>
              <Card.Text className="display-4">{stats.totalProductos}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="danger" text="white" className="mb-3">
            <Card.Body>
              <Card.Title>Productos con Stock Bajo</Card.Title>
              <Card.Text className="display-4">{stats.productosStockBajo ? stats.productosStockBajo.length : 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Aquí puedes listar los productos con stock bajo si quieres */}
      
    </div>
  );
}

export default AdminDashboard;