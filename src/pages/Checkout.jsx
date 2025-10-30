// src/pages/Checkout.jsx (CORREGIDO - Sintaxis del objeto 'pedido')

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Asegúrate que Link esté importado
import { regiones } from '../data/regiones.js'; 
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap'; 

function Checkout() {
  // Estados (sin cambios)
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [calle, setCalle] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [region, setRegion] = useState(''); 
  const [comuna, setComuna] = useState(''); 
  const [comunas, setComunas] = useState([]); 

  // --- useEffect 1: Cargar carrito y **intentar** rellenar datos de usuario ---
  useEffect(() => {
    console.log("[Checkout] useEffect 1 (Mount): Iniciando...");
    // Carga carrito
    try {
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
        setItems(carritoGuardado);
        const totalCalculado = carritoGuardado.reduce((acc, p) => acc + (p.precio * (p.cantidad || 1)), 0);
        setTotal(totalCalculado);
    } catch (e) { console.error("Error cargando carrito:", e); }

    // Rellena datos del usuario
    try {
        const usuarioData = JSON.parse(localStorage.getItem("usuario"));
        console.log("[Checkout] useEffect 1: Datos usuario localStorage:", usuarioData);
        
        if (usuarioData && usuarioData.usuarios) { 
            const loggedUser = usuarioData.usuarios; 
            console.log("[Checkout] useEffect 1: loggedUser encontrado:", loggedUser);
            
            if (loggedUser.nombre) { setNombre(loggedUser.nombre.split(' ')[0] || ''); setApellidos(loggedUser.nombre.split(' ').slice(1).join(' ') || ''); }
            setEmail(loggedUser.email || '');
            
            // --- SIMPLIFICADO: Solo seteamos los valores directamente ---
            if (loggedUser.region) {
                console.log(`%c[Checkout] useEffect 1: Llamando setRegion('${loggedUser.region}')`, 'color: blue; font-weight: bold;'); // LOG AZUL
                setRegion(loggedUser.region); 
            } else {
                console.log("[Checkout] useEffect 1: No hay región en localStorage.");
            }
            if (loggedUser.comuna) {
                console.log(`%c[Checkout] useEffect 1: Llamando setComuna('${loggedUser.comuna}')`, 'color: blue; font-weight: bold;'); // LOG AZUL
                setComuna(loggedUser.comuna); 
            } else {
                console.log("[Checkout] useEffect 1: No hay comuna en localStorage.");
            }
        } else {
            console.log("[Checkout] useEffect 1: No hay datos de usuario válidos en localStorage.");
        }
    } catch (e) { console.error("Error cargando datos de usuario:", e); }
    console.log("[Checkout] useEffect 1: Finalizado.");
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez al cargar

  // --- useEffect 2: Actualizar comunas y VALIDA la comuna seleccionada ---
  useEffect(() => {
    // Loguea los valores de estado ACTUALES al inicio de este efecto
    console.log(`[Checkout] useEffect 2 START: region='${region}', comuna='${comuna}'`); 

    const regionEncontrada = region ? regiones.find(r => r.nombre === region) : null;
    const comunasDeRegion = regionEncontrada ? regionEncontrada.comunas : [];
    console.log("[Checkout] useEffect 2: Comunas calculadas para esta región:", comunasDeRegion);
    
    // Actualiza la lista para el dropdown (esto no debería causar problemas)
    setComunas(comunasDeRegion); 

    // --- Lógica de Validación ---
    if (region && comunasDeRegion.length > 0) {
        // Verifica si la comuna actual (del estado) está en la lista calculada
        const comunaIsValid = comunasDeRegion.includes(comuna);
        console.log(`[Checkout] useEffect 2: Verificando si '${comuna}' está en [${comunasDeRegion.join(', ')}]: ${comunaIsValid}`); // LOG DE VERIFICACIÓN

        if (!comunaIsValid && comuna !== '') { // Solo resetea si NO es válida Y NO está ya vacía
            console.warn(`%c[Checkout] useEffect 2: ¡INVALIDA! La comuna '${comuna}' no está en la lista para '${region}'. Llamando setComuna('').`, 'color: red; font-weight: bold;'); // LOG ROJO
            setComuna(''); // Resetea si no es válida
        } else if (comunaIsValid) {
             console.log(`[Checkout] useEffect 2: Comuna '${comuna}' es VÁLIDA para '${region}'. No se resetea.`); // LOG VERDE (implícito)
        }
    } else if (!region && comuna !== '') { // Si no hay región pero la comuna no está vacía
        console.log("[Checkout] useEffect 2: No hay región, reseteando comuna.");
        setComuna(''); 
    }
    console.log("[Checkout] useEffect 2 END.");
    
  // Quitamos 'comuna' de las dependencias temporalmente para ver el flujo exacto
  // }, [region, comuna]); 
    }, [region, comuna]); // <-- Ahora depende de AMBOS
  // --- handleSubmit (CORREGIDO) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellidos || !email || !calle || !region || !comuna) {
      alert("Por favor, completa todos los campos requeridos (*).");
      return;
    }

    // --- 👇 CORRECCIÓN: Definir el objeto 'pedido' correctamente 👇 ---
    const pedido = { 
      cliente: { nombre, apellidos, email },
      direccion: { calle, departamento, region, comuna },
      items: items, // Puedes usar 'items' directamente si la variable tiene el mismo nombre
      total: total, // Puedes usar 'total' directamente
      fecha: new Date().toISOString()
    };
    // --- 👆 FIN CORRECCIÓN 👆 ---
    
    localStorage.removeItem("carrito");
    navigate('/pago-exitoso', { state: { pedido } });
  };

  // --- formatearPrecio (sin cambios) ---
  const formatearPrecio = (valor) => valor.toLocaleString("es-CL");

  // --- Renderizado (sin cambios) ---
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}> 
          <Card className="shadow-sm">
            <Card.Body className="p-4 p-md-5"> 
              <h1 className="text-center mb-4">Finalizar Compra</h1>
              {items.length === 0 && (
                <Alert variant="warning">
                    Tu carrito está vacío. 
                    <Alert.Link as={Link} to="/productos">Agrega productos</Alert.Link> 
                    para continuar.
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Columna Izquierda */}
                  <Col md={6} className="mb-4 mb-md-0">
                    <Card border="light" className="mb-4">
                       <Card.Header as="h5">Resumen del Carrito</Card.Header>
                       <ListGroup variant="flush">
                        {items.map(item => (
                          <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                            <span>{item.nombre} <span className="text-muted">x {item.cantidad}</span></span>
                            <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
                          </ListGroup.Item>
                        ))}
                        <ListGroup.Item className="d-flex justify-content-between align-items-center fw-bold h5">
                          <span>Total</span>
                          <span>${formatearPrecio(total)}</span>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                    <h5>Información del cliente (*)</h5>
                    <Form.Group className="mb-3" controlId="nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="apellidos">
                         <Form.Label>Apellidos</Form.Label>
                         <Form.Control type="text" value={apellidos} onChange={e => setApellidos(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                         <Form.Label>Correo</Form.Label>
                         <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  {/* Columna Derecha */}
                  <Col md={6}>
                    <h5>Dirección de entrega (*)</h5>
                     <Form.Group className="mb-3" controlId="calle">
                          <Form.Label>Calle y Número</Form.Label>
                          <Form.Control type="text" value={calle} onChange={e => setCalle(e.target.value)} required />
                      </Form.Group>
                     <Form.Group className="mb-3" controlId="departamento">
                          <Form.Label>Departamento (opcional)</Form.Label>
                          <Form.Control type="text" value={departamento} onChange={e => setDepartamento(e.target.value)} />
                      </Form.Group>
                     <Form.Group className="mb-3" controlId="regionCheckout">
                          <Form.Label>Región</Form.Label>
                          <Form.Select value={region} onChange={e => setRegion(e.target.value)} required>
                            <option value="">-- Seleccione región --</option>
                            {regiones.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                          </Form.Select>
                      </Form.Group>
                     <Form.Group className="mb-3" controlId="comunaCheckout">
                          <Form.Label>Comuna</Form.Label>
                          <Form.Select value={comuna} onChange={e => setComuna(e.target.value)} required disabled={!region || comunas.length === 0}>
                            <option value="">-- Seleccione comuna --</option>
                            {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                          </Form.Select>
                      </Form.Group>
                  </Col>
                </Row>
                {/* Botón Pagar */}
                {items.length > 0 && ( <Button type="submit" variant="primary" size="lg" className="w-100 mt-4"> Pagar ahora ${formatearPrecio(total)} </Button> )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;