import React, { useState, useEffect } from 'react';
import { Table, Container, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const API_URL = '/api/pedidos/todos';

function AdminPedidosListar() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchProtegido } = useAuth();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await fetchProtegido(API_URL);
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [fetchProtegido]);

  const formatearPrecio = (val) => val ? val.toLocaleString('es-CL') : '0';
  const formatearFecha = (fechaString) => {
      if(!fechaString) return "-";
      return new Date(fechaString).toLocaleString();
  };

  if (loading) return <Container className="p-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
  if (error) return <Container className="p-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container>
      <h2>Historial de Ventas</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Email</th>
            <th>Neto</th>
            <th>IVA (19%)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id}>
              <td>#{p.id}</td>
              <td>{formatearFecha(p.fecha)}</td>
              <td>{p.nombreCliente}</td>
              <td>{p.emailCliente}</td>
              <td>${formatearPrecio(p.neto)}</td>
              <td>${formatearPrecio(p.iva)}</td>
              <td><Badge bg="success" className="fs-6">${formatearPrecio(p.total)}</Badge></td>
            </tr>
          ))}
          {pedidos.length === 0 && <tr><td colSpan="7" className="text-center">No hay ventas registradas.</td></tr>}
        </tbody>
      </Table>
    </Container>
  );
}
export default AdminPedidosListar;