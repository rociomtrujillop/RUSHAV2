// src/pages/PagoExitoso.jsx (NUEVO ARCHIVO)

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function PagoExitoso() {
  const location = useLocation();
  const { pedido } = location.state || {}; // Leemos el pedido de la navegación

  if (!pedido) {
    return (
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Pago realizado</h1>
        <p>Tu compra ha sido procesada.</p>
        <Link to="/" className="btn-seguir">Volver al inicio</Link>
      </main>
    );
  }

  const formatearPrecio = (valor) => valor.toLocaleString("es-CL");

  return (
    <main className="form-container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1 style={{ color: 'green' }}>✓ Pago Exitoso</h1>
      <p>¡Gracias por tu compra, {pedido.cliente.nombre}!</p>
      <p>Se ha realizado la compra con nro. #{(Math.random() * 100000).toFixed(0)}</p>
      
      <h2>Resumen de la Compra</h2>
      <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
        <h3>Items:</h3>
        {pedido.items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.nombre} x {item.cantidad}</span>
            <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
          </div>
        ))}
        <hr />
        <h3 style={{ textAlign: 'right' }}>Total Pagado: ${formatearPrecio(pedido.total)}</h3>
        
        <h3 style={{ marginTop: '2rem' }}>Dirección de Envío:</h3>
        <p>
          {pedido.direccion.calle}, {pedido.direccion.departamento && `Dpto. ${pedido.direccion.departamento}, `}
          {pedido.direccion.comuna}, {pedido.direccion.region}
        </p>
      </div>
      
      <Link to="/productos" className="btn-seguir" style={{ marginTop: '2rem' }}>
        Seguir comprando
      </Link>
    </main>
  );
}

export default PagoExitoso;