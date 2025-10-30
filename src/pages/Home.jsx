// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const API_URL_CATEGORIAS = 'http://localhost:8080/api/categorias';

function Home() {
  const [categorias, setCategorias] = useState([]);
  
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(API_URL_CATEGORIAS);
        if (!response.ok) return;
        const data = await response.json();
        setCategorias(data.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <> 
      {/* Hero Section */}
      <Container fluid className="hero p-5 text-center">
        <h2 className="display-4">Descubre lo nuevo</h2>
        <p className="lead">Moda urbana con estilo único</p>
        <Button as={Link} to="/productos" variant="primary" size="lg">Ver Productos</Button>
      </Container>

      <Container className="categorias p-4 text-center">
        <h2>Explora por Género</h2> {/* Título cambiado */}
        <Row className="mt-4 justify-content-center"> {/* justify-content-center para centrar si son menos de 4 */}
          
          {/* Enlace Hombre */}
          <Col md={3} sm={6} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Hombre</Card.Title>
                {/* --- 👇 CAMBIO AQUÍ: Usa ?genero=hombre 👇 --- */}
                <Button as={Link} to={`/productos?genero=hombre`} variant="primary"> 
                  Ver Ropa Hombre
                </Button>
                {/* --- 👆 FIN CAMBIO 👆 --- */}
              </Card.Body>
            </Card>
          </Col>

          {/* Enlace Mujer */}
          <Col md={3} sm={6} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Mujer</Card.Title>
                 {/* --- 👇 CAMBIO AQUÍ: Usa ?genero=mujer 👇 --- */}
                <Button as={Link} to={`/productos?genero=mujer`} variant="primary">
                  Ver Ropa Mujer
                </Button>
                 {/* --- 👆 FIN CAMBIO 👆 --- */}
              </Card.Body>
            </Card>
          </Col>

          {/* Enlace Unisex */}
          <Col md={3} sm={6} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Unisex</Card.Title>
                 {/* --- 👇 CAMBIO AQUÍ: Usa ?genero=unisex 👇 --- */}
                <Button as={Link} to={`/productos?genero=unisex`} variant="primary">
                  Ver Ropa Unisex
                </Button>
                 {/* --- 👆 FIN CAMBIO 👆 --- */}
              </Card.Body>
            </Card>
          </Col>
          
           {/* Puedes añadir un cuarto enlace si quieres, por ejemplo Accesorios */}
           {/* <Col md={3} sm={6} className="mb-3">
             <Card>
               <Card.Body>
                 <Card.Title>Accesorios</Card.Title>
                 <Button as={Link} to={`/productos?categoria=accesorios`} variant="primary">
                   Ver Accesorios
                 </Button>
               </Card.Body>
             </Card>
           </Col> 
           */}

        </Row>
      </Container>

      {/* Hero Blogs Section */}
      <Container fluid className="hero-blogs p-5 text-center my-4">
        <h2 className="display-4">Últimas tendencias de moda</h2>
        <p className="lead">Descubre lo que se viene este 2026</p>
        <Button as={Link} to="/blogs" variant="primary" size="lg">Leer Blog</Button>
      </Container>
    </>
  );
}

export default Home;