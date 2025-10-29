import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Spinner, Alert, Form, Row, Col, Container } from 'react-bootstrap'; 

// URLs (sin cambios)
const API_URL_PRODUCTOS = 'http://localhost:8080/api/productos';
const API_URL_CATEGORIAS = 'http://localhost:8080/api/categorias/todas'; 

function AdminProductosListar() {
  // Estados (sin cambios)
  const [productos, setProductos] = useState([]); 
  const [categorias, setCategorias] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 

  // --- Función fetchData (Carga productos y categorías) ---
  const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [prodResponse, catResponse] = await Promise.all([
          fetch(API_URL_PRODUCTOS),
          fetch(API_URL_CATEGORIAS)
        ]);
        if (!prodResponse.ok) throw new Error('Error al cargar productos');
        if (!catResponse.ok) throw new Error('Error al cargar categorías');
        const prodsData = await prodResponse.json();
        const catsData = await catResponse.json();
        
        // Verifica si son arrays antes de setear
        if (Array.isArray(prodsData)) setProductos(prodsData); else setProductos([]);
        if (Array.isArray(catsData)) setCategorias(catsData); else setCategorias([]);

      } catch (err) {
        setError(err.message);
        setProductos([]); // Limpia en caso de error
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };
  
  // --- useEffect para Carga Inicial ---
  useEffect(() => {
    fetchData(); 
  }, []); 

  // --- handleEliminar ---
  const handleEliminar = async (id) => {
      if (!id) return;
      if (window.confirm(`¿Seguro de eliminar producto ID ${id}?`)) {
          try {
              const response = await fetch(`${API_URL_PRODUCTOS}/${id}`, { method: 'DELETE' });
              if (!response.ok) {
                   let errorMsg = `Error ${response.status}`;
                   try { const errBody = await response.text(); errorMsg += `: ${errBody || response.statusText}`; } catch(e){}
                  throw new Error(errorMsg);
              }
              alert('Producto eliminado');
              // Refresca la lista filtrando el eliminado del estado actual (más rápido que refetch)
              setProductos(prev => prev.filter(p => p.id !== id)); 
          } catch (err) {
              console.error("Error al eliminar:", err);
              alert(`Error: ${err.message}`);
          }
      } 
  };

  // --- Lógica de Filtrado ---
  const productosFiltrados = productos.filter(prod => {
      if (!prod) return false; // Seguridad extra
      const matchesSearch = searchTerm 
          ? (prod.nombre && prod.nombre.toLowerCase().includes(searchTerm.toLowerCase())) 
          : true; 
      const matchesCategory = selectedCategoryId
          // Asegura que prod.categorias exista y sea array
          ? (Array.isArray(prod.categorias) && prod.categorias.some(cat => cat && cat.id?.toString() === selectedCategoryId)) 
          : true; 
      return matchesSearch && matchesCategory;
  });

  if (loading) { return ( <Container className="text-center p-5"><Spinner animation="border" variant="primary" /></Container> ); }
  if (error) { return ( <Container className="p-5"><Alert variant="danger">{error}</Alert></Container> ); }

  return (
    <> 
      <h2>Gestión de Productos</h2>
      {/* Filtros y Botón Crear */}
      <Row className="mb-3 gy-2 align-items-center"> {/* align-items-center */}
          <Col md={4}>
              <Button as={Link} to="/admin/productos/crear" variant="primary" className="w-100">
                Crear Nuevo Producto
              </Button>
          </Col>
          <Col md={4}>
               <Form.Control 
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </Col>
          <Col md={4}>
              <Form.Select
                  aria-label="Filtrar por categoría" // Accessibility
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                  <option value="">-- Todas las Categorías --</option>
                  {/* Asegura que categorías sea array antes de mapear */}
                  {Array.isArray(categorias) && categorias.map(cat => ( 
                      <option key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                      </option>
                  ))}
              </Form.Select>
          </Col>
      </Row>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Género</th>
            {/* <th>Categorías</th> */} {/* Opcional */}
            <th>Activo</th>
            <th>Acciones</th> 
          </tr>
        </thead>
        <tbody>
          {/* Mapea sobre productosFiltrados */}
          {productosFiltrados.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre || '-'}</td>
              <td>${p.precio?.toLocaleString('es-CL') || '0'}</td> {/* Añade fallback */}
              <td>{p.stock ?? '-'}</td> {/* Nullish coalescing */}
              <td>{p.genero || '-'}</td>
              {/* <td>{p.categorias?.map(c => c.nombre).join(', ') || '-'}</td> */}
              <td>{p.activo ? 'Sí' : 'No'}</td>
              <td>
                 <Button as={Link} to={`/admin/productos/editar/${p.id}`} variant="warning" size="sm" className="me-2">Editar</Button>
                 <Button variant="danger" size="sm" onClick={() => handleEliminar(p.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}

          {!loading && productosFiltrados.length === 0 && ( 
              <tr>
                  {/* El número de columnas debe coincidir con <th> (7 en este caso) */}
                  <td colSpan="7" className="text-center"> 
                      No se encontraron productos con los filtros aplicados.
                  </td>
              </tr>
          )}

        </tbody>
      </Table>
    </>
  );
}

export default AdminProductosListar;