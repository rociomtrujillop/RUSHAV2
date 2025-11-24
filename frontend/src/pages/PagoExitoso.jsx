import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap'; // Importamos componentes Bootstrap para que se vea mejor

function PagoExitoso() {
  const location = useLocation();
  // 1. RECIBIMOS EL 'idBoleta' REAL QUE VIENE DEL CHECKOUT
  const { pedido, idBoleta } = location.state || {};

  if (!pedido) {
    return (
      <Container className="text-center py-5">
        <h1>Pago realizado</h1>
        <p>Tu compra ha sido procesada.</p>
        <Button as={Link} to="/" variant="primary">Volver al inicio</Button>
      </Container>
    );
  }

  const formatearPrecio = (valor) => valor.toLocaleString("es-CL");

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-4">
        <h1 className="text-success">✓ Pago Exitoso</h1>
        <p className="lead">¡Gracias por tu compra, {pedido.cliente.nombre}!</p>
        {/* 2. MOSTRAMOS EL ID REAL DE LA BASE DE DATOS */}
        <p><strong>Nro. de Pedido: #{idBoleta}</strong></p>
      </div>
      
      <Card className="shadow-sm">
        <Card.Header as="h4">Resumen de la Compra</Card.Header>
        <Card.Body>
            <ListGroup variant="flush">
                {pedido.items.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <span>{item.nombre || `Producto ID ${item.id}`} <span className="text-muted">x {item.cantidad}</span></span>
                    <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
                </ListGroup.Item>
                ))}
            </ListGroup>
            
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Total Pagado:</h4>
                <h4 className="text-primary">${formatearPrecio(pedido.total)}</h4>
            </div>
            
            <h5>Dirección de Envío:</h5>
            <p className="text-muted">
            {pedido.direccion.calle}, {pedido.direccion.departamento && `Dpto. ${pedido.direccion.departamento}, `}
            {pedido.direccion.comuna}, {pedido.direccion.region}
            </p>
        </Card.Body>
        <Card.Footer className="text-center">
            <Button as={Link} to="/productos" variant="primary" size="lg">
                Seguir comprando
            </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default PagoExitoso;