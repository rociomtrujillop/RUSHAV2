// src/App.jsx (CORREGIDO - Rutas de Checkout MOVIDAS DENTRO)

import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// --- VISTAS DEL CLIENTE ---
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Detalle from './pages/Detalle';
import Blogs from './pages/Blogs';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Categorias from './pages/Categorias'; // Asegúrate que esté importado
import Ofertas from './pages/Ofertas'; // Asegúrate que esté importado

// --- VISTAS DE PAGO ---
import Checkout from './pages/Checkout';         // Asegúrate que esté importado
import PagoExitoso from './pages/PagoExitoso';   // Asegúrate que esté importado
import PagoError from './pages/PagoError';       // Asegúrate que esté importado

// --- VISTAS DEL ADMIN ---
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsuariosListar from './pages/admin/AdminUsuariosListar';
import AdminUsuariosForm from './pages/admin/AdminUsuariosForm';
import AdminProductosListar from './pages/admin/AdminProductosListar';
import AdminProductosForm from './pages/admin/AdminProductosForm';
// Necesitarás importar estos también si los tienes:
import AdminCategoriasListar from './pages/admin/AdminCategoriasListar'; 
import AdminCategoriasForm from './pages/admin/AdminCategoriasForm';

// --- Layout para el Cliente ---
function ClientLayout() {
  return (
    <>
      <Header />
      {/* Mantenemos <main> si quieres un contenedor principal */}
      <main> 
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
}

// --- Componente Principal App ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- RUTAS DEL CLIENTE (Públicas) --- */}
        {/* Todas las rutas dentro de este Route usarán ClientLayout */}
        <Route path="/" element={<ClientLayout />}> 
          <Route index element={<Home />} /> 
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="productos" element={<Productos />} />
          <Route path="categorias" element={<Categorias />} /> 
          <Route path="carrito" element={<Carrito />} />
          <Route path="detalle" element={<Detalle />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="ofertas" element={<Ofertas />} /> 

          <Route path="checkout" element={<Checkout />} />
          <Route path="pago-exitoso" element={<PagoExitoso />} />
          <Route path="pago-error" element={<PagoError />} />

        </Route> 
        
        {/* --- RUTAS DEL ADMIN (Protegidas) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsuariosListar />} />
          <Route path="usuarios/crear" element={<AdminUsuariosForm />} />
           {/* Asegúrate de tener la ruta editar usuario aquí */}
          <Route path="usuarios/editar/:id" element={<AdminUsuariosForm />} />
          <Route path="productos" element={<AdminProductosListar />} />
          <Route path="productos/crear" element={<AdminProductosForm />} />
           {/* Corregido: usa ':id' para editar producto, no ':index' */}
          <Route path="productos/editar/:id" element={<AdminProductosForm />} />
          {/* Rutas de Categorías Admin */}
          <Route path="categorias" element={<AdminCategoriasListar />} /> 
          <Route path="categorias/crear" element={<AdminCategoriasForm />} />
          <Route path="categorias/editar/:id" element={<AdminCategoriasForm />} />
        </Route>
        
        {/* Opcional: Ruta 404 */}
        {/* <Route path="*" element={<div><h1>404</h1></div>} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;