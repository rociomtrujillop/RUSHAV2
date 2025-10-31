import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Form, Spinner, Alert, Card } from 'react-bootstrap'; 

const API_URL = 'http://localhost:8080/api/productos';

// --- Funciones auxiliares (Asegúrate que estén completas y correctas) ---
function formatearPrecio(valor) {
  const num = Number(valor);
  if (isNaN(num) || valor === null || valor === undefined) { 
    console.warn("formatearPrecio recibió valor inválido:", valor);
    return '$?';
  }
  return num.toLocaleString("es-CL");
}

function agregarAlCarrito(producto, cantidad, imagenPrincipal) { 
   if (!producto || typeof producto.id === 'undefined') { 
        console.error("agregarAlCarrito: producto inválido", producto);
        alert("Error al añadir al carrito: producto no válido.");
        return;
    }
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (cantidad <= 0) { alert("Cantidad inválida."); return; } // Simplificado
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        const productoParaCarrito = {
            id: producto.id,
            nombre: producto.nombre || 'Producto sin nombre',
            precio: producto.precio, 
            imagen: imagenPrincipal, 
            cantidad: cantidad
        };
        carrito.push(productoParaCarrito);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${cantidad} producto(s) añadido(s) al carrito`);
}

function Detalle() {
  const [searchParams] = useSearchParams();
  const productoId = searchParams.get('id');
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true); 
    setError(null); 
    setProducto(null); 
    setRelacionados([]); 
    setImagenPrincipal(''); 
    setCantidad(1); 

    if (!productoId) {
      if (isMounted) {
          setError("No se especificó un ID de producto.");
          setLoading(false);
      }
      return; // Salir si no hay ID
    }

    const fetchProducto = async () => {
      try {
        const response = await fetch(`${API_URL}/${productoId}`);
        if (!isMounted) return;
        if (!response.ok) throw new Error(`Producto no encontrado (ID: ${productoId})`);
        const data = await response.json();
        if (!isMounted) return; 
        // Validar datos mínimos antes de setear
        if (data && typeof data.id !== 'undefined') { 
            setProducto(data);
            setImagenPrincipal(`/${data.imagenes ? data.imagenes.split(',')[0].trim() : 'img/default.jpg'}`);
        } else {
             throw new Error("Datos del producto recibidos inválidos.");
        }
      } catch (err) {
        console.error("[Detalle] Error en fetchProducto:", err); 
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducto();
    // Cleanup
    return () => { isMounted = false; }; 
  }, [productoId]); 

  useEffect(() => {
    if (!producto || !producto.genero) {
        setRelacionados([]); 
        return;
    }
    let isMounted = true;
    const fetchRelacionados = async () => {
      try {
        const response = await fetch(`${API_URL}/genero/${producto.genero}`);
        if (!isMounted || !response.ok) return;
        let data = await response.json();
        if (!isMounted || !Array.isArray(data)) return; 
        data = data.filter(p => p && typeof p.id !== 'undefined' && p.id !== producto.id).slice(0, 4); 
        setRelacionados(data);
      } catch (err) {
        console.error("[Detalle] Error en fetchRelacionados:", err);
        if (isMounted) setRelacionados([]); 
      }
    };
    fetchRelacionados();
    // Cleanup
    return () => { isMounted = false; }; 
  }, [producto]); // Depende solo de 'producto'

  const handleAgregarClick = () => {
      agregarAlCarrito(producto, cantidad, imagenPrincipal);
  };

  if (loading) { 
    return (
        <Container className="text-center p-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    ); // Punto y coma opcional aquí
  }

 
  if (error || !producto) { 
    // Asegúrate que el return aquí sea sintácticamente correcto
    return ( 
      <Container className="p-5">
        <Alert variant="danger">{error || 'Producto no encontrado o datos inválidos.'}</Alert>
        <Button as={Link} to="/productos" variant="primary">Volver a productos</Button>
      </Container>
    ); 
  }
 
  const imagenesArray = producto.imagenes ? producto.imagenes.split(',') : [];

  return (
    <Container id="detalle" className="py-4">
      <Row>
        <Col md={6} className="mb-3 mb-md-0">
          {imagenPrincipal && 
            <Image 
              id="imagen-principal" 
              src={imagenPrincipal} 
              alt={producto.nombre} 
              fluid 
              rounded 
              className="mb-2"
            /> 
          }
          <div className="miniaturas d-flex flex-wrap gap-2">
            {imagenesArray.map((img, index) => {
              const imgSrc = `/${img.trim()}`; 
              return (
                <Image 
                  key={index}
                  src={imgSrc} 
                  alt={`Miniatura ${index + 1}`}
                  thumbnail 
                  onClick={() => setImagenPrincipal(imgSrc)}
                  className={imagenPrincipal === imgSrc ? 'activa shadow' : ''} 
                  style={{ cursor: 'pointer', width: '60px', height: '60px', objectFit: 'cover' }} 
                />
              );
            })}
          </div>
        </Col>
        
        <Col md={6}>
          <h1>{producto.nombre}</h1>
          <p className="display-6 text-primary">
            ${formatearPrecio(producto.precio)} 
          </p>
          <p>{producto.descripcion}</p>
          
          <Form.Group as={Row} className="align-items-center my-3">
            <Form.Label column sm="3" xs="4">Cantidad:</Form.Label>
            <Col sm="9" xs="8">
              <Form.Control 
                type="number" 
                id="cantidad" 
                value={cantidad} 
                min="1"
                onChange={(e) => setCantidad(Number(e.target.value))}
                style={{ maxWidth: '100px' }} 
              />
            </Col>
          </Form.Group>
          
          <Button variant="primary" size="lg" className="w-100" onClick={handleAgregarClick}>
            Añadir al carrito
          </Button>
        </Col>
      </Row>

      <div className="productos-relacionados-container mt-5">
        <h2>Productos relacionados</h2>
        <Row className="mt-3">
          {Array.isArray(relacionados) && relacionados.length > 0 ? ( 
            relacionados.map(p => (
              <Col key={p.id} sm={6} md={3} className="mb-4">
                <Card className="h-100 producto-card"> 
                  <Card.Img 
                    variant="top" 
                    src={`/${p.imagenes ? p.imagenes.split(',')[0].trim() : 'img/default.jpg'}`} 
                    alt={p.nombre || 'Producto'} 
                  />
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/detalle?id=${p.id}`} className="text-decoration-none text-dark stretched-link">
                        {p.nombre || 'Producto'}
                      </Link>
                    </Card.Title>
                    <Card.Text className="h5 text-primary">
                      ${formatearPrecio(p.precio)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )) 
          ) : (
            !loading && <Col><p>No hay productos relacionados para mostrar.</p></Col> 
          )}
        </Row>
      </div>
    </Container>
  ); 
} 

export default Detalle;