// src/pages/admin/AdminProductosForm.jsx (Con Validaciones Añadidas)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert, Image, InputGroup } from 'react-bootstrap'; 

// ... (URLs de API sin cambios) ...
const API_URL_PRODUCTOS = 'http://localhost:8080/api/productos';
const API_URL_CATEGORIAS = 'http://localhost:8080/api/categorias/todas';
const API_URL_ARCHIVOS_SUBIR = 'http://localhost:8080/api/archivos/subir'; 

function AdminProductosForm() {
    // ... (Estados: producto, allCategorias, selectedCategorias, loading, error, etc. sin cambios) ...
     const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const [producto, setProducto] = useState({ /* ... */ });
    const [allCategorias, setAllCategorias] = useState([]);
    const [selectedCategorias, setSelectedCategorias] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    const [loadingCats, setLoadingCats] = useState(true); 
    const [errorCats, setErrorCats] = useState(null);   
    const [uploading, setUploading] = useState(false); 
    const [uploadError, setUploadError] = useState(null); 

    // --- Efectos (Sin cambios) ---
    useEffect(() => { /* Cargar Categorías */ }, []);
    useEffect(() => { /* Cargar Producto si es Edición */ }, [isEditing, id, loadingCats]);

    // --- Handlers (Sin cambios) ---
    const handleChange = (e) => { /* ... */ };
    const handleCategoriaChange = (categoriaId) => { /* ... */ };
    const handleFileChange = async (event) => { /* ... */ };
    const handleRemoveImage = (urlToRemove) => { /* ... */ };

    // --- 👇 handleSubmit MODIFICADO CON VALIDACIONES 👇 ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpia errores previos

        // --- VALIDACIONES ---
        if (!producto.nombre.trim()) { setError("El nombre es obligatorio."); return; }
        if (!producto.descripcion.trim()) { setError("La descripción es obligatoria."); return; }
        
        const precioNum = parseInt(producto.precio, 10);
        if (isNaN(precioNum) || precioNum <= 0) { setError("El precio debe ser un número mayor a 0."); return; }

        const stockNum = parseInt(producto.stock, 10);
         // Permitimos stock 0 si se desea, pero podrías cambiar a >= 1 si es requisito estricto
        if (isNaN(stockNum) || stockNum < 0) { setError("El stock debe ser un número igual o mayor a 0."); return; }
        
        if (!producto.imagenes) { setError("Debe subir al menos una imagen."); return; }
        
        if (selectedCategorias.size === 0) { setError("Debe seleccionar al menos una categoría."); return; }
        // --- FIN VALIDACIONES ---

        setLoading(true); // Inicia estado de carga SOLO si pasa validaciones

        const categoriasParaEnviar = allCategorias.filter(cat => selectedCategorias.has(cat.id));
        
        const productoParaEnviar = {
            ...producto,
            precio: precioNum, // Usa el número parseado
            stock: stockNum,   // Usa el número parseado
            categorias: categoriasParaEnviar 
        };
        console.log("Producto para enviar:", productoParaEnviar); 

        const url = isEditing ? `${API_URL_PRODUCTOS}/${id}` : API_URL_PRODUCTOS;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { /* ... (opciones fetch) ... */ });
            // ... (manejo respuesta y navegación) ...
             if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || `Error al ${isEditing ? 'actualizar' : 'crear'} producto`);
            }
            alert(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito`);
            navigate('/admin/productos');
        } catch (err) {
             console.error("Error en handleSubmit:", err);
            setError(err.message);
        } finally {
            setLoading(false); 
        }
    };
    // --- 👆 FIN handleSubmit MODIFICADO 👆 ---

    const currentImageUrls = producto.imagenes ? producto.imagenes.split(',').filter(url => url) : [];

    // --- Renderizado ---
    if (loadingCats || (isEditing && loading && !producto)) { /* ... Spinner ... */ }
    if (errorCats) { /* ... Error Categorías ... */ }
    if (isEditing && error && !producto) { /* ... Error Producto ... */ }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="p-4">
                        <Card.Title as="h2">{isEditing ? 'Editar Producto' : 'Crear Producto'}</Card.Title>
                        {/* Muestra errores generales Y DE VALIDACIÓN */}
                        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>} 
                        
                        <Form onSubmit={handleSubmit}>
                            {/* Nombre y Género (input nombre ya tiene required HTML) */}
                            <Row> <Col md={8}><Form.Group className="mb-3" controlId="nombre"><Form.Label>Nombre (*)</Form.Label><Form.Control type="text" name="nombre" value={producto.nombre} onChange={handleChange} required /></Form.Group></Col> <Col md={4}><Form.Group className="mb-3" controlId="genero">...</Form.Group></Col> </Row>
                            
                            {/* Descripción (añadir required HTML) */}
                            <Form.Group className="mb-3" controlId="descripcion">
                                <Form.Label>Descripción (*)</Form.Label>
                                <Form.Control as="textarea" rows={3} name="descripcion" value={producto.descripcion} onChange={handleChange} required />
                            </Form.Group>
                            
                            {/* Precio y Stock (añadir required y min HTML) */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="precio">
                                        <Form.Label>Precio (*)</Form.Label>
                                        <Form.Control type="number" name="precio" value={producto.precio} onChange={handleChange} required min="1" /> 
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="stock">
                                        <Form.Label>Stock (*)</Form.Label>
                                         {/* Cambiado min a 0, ajusta a 1 si es necesario */}
                                        <Form.Control type="number" name="stock" value={producto.stock} onChange={handleChange} required min="0" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Sección Imágenes (sin cambios en JSX) */}
                            <Form.Group className="mb-3" controlId="imagenUpload">...</Form.Group>
                            <Form.Group className="mb-3">{/* Mostrar Imágenes Actuales */}</Form.Group>
                            
                            {/* Sección Categorías (sin cambios en JSX) */}
                            <Form.Group className="mb-3">...</Form.Group>
                           
                            {/* Checkbox Activo (sin cambios en JSX) */}
                            <Form.Group className="mb-3" controlId="activo">...</Form.Group>
                            
                            {/* Botón Submit (sin cambios en JSX) */}
                            <Button variant="primary" type="submit" disabled={loading || uploading || loadingCats}>...</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// Asegúrate de pegar aquí las funciones completas si las acorté
export default AdminProductosForm;