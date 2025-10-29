// src/pages/Login.jsx (CORREGIDO - Uso correcto de loggedUser del contexto)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; 

const API_URL_LOGIN = 'http://localhost:8080/api/auth/login';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtiene 'login' del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!correo || !password) {
      setError('Por favor, ingresa correo y contraseña.');
      return;
    }

    try {
      const response = await fetch(API_URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: correo, password: password }),
      });
      if (!response.ok) {
         let errorMessage = 'Correo o contraseña incorrectos.';
         try {
           const errorData = await response.json(); 
           if (errorData && errorData.mensaje) {
             errorMessage = errorData.mensaje; 
           }
         } catch (jsonError) {
           console.error("Error al parsear respuesta de error:", jsonError);
         }
        throw new Error(errorMessage);
      }
      
      const usuarioLogueadoResponse = await response.json(); // Toda la respuesta {mensaje, usuarios}

      // Llama al login del contexto. Devuelve el objeto usuario o null.
      const loggedUser = login(usuarioLogueadoResponse); 

      // --- 👇 **CORRECCIÓN LÓGICA** 👇 ---
      // Verifica si 'loggedUser' (el objeto usuario directo) existe y tiene nombre/rol
      if (!loggedUser || !loggedUser.nombre || !loggedUser.rol) { 
          // Si login() devolvió null o el objeto usuario está incompleto
          throw new Error('Respuesta inválida del servidor o error al procesar login.'); 
      }
      
      // Usa 'loggedUser' directamente
      alert(`¡Bienvenido, ${loggedUser.nombre}!`); 

      // Usa 'loggedUser.rol' directamente
      if (loggedUser.rol === 'admin' || loggedUser.rol === 'super-admin') { 
        navigate('/admin'); 
      } else {
        navigate('/');
      }
      // --- 👆 **FIN CORRECCIÓN LÓGICA** 👆 ---
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-md-center">
        <Col md={8} lg={5}>
          <Card className="p-4 shadow-sm">
            <h1 className="text-center mb-4">Iniciar Sesión</h1>
            <Form id="form-login" noValidate onSubmit={handleSubmit}>
              
              <Form.Group className="mb-3" controlId="correo">
                <Form.Label>Correo electrónico *</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email" 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" 
                />
              </Form.Group>
              
              <Button variant="primary" type="submit" className="w-100">
                Ingresar
              </Button>
              
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
              
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;