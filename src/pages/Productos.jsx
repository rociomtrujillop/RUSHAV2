// src/pages/Productos.jsx (Fusionado con Filtro de Categorías y Búsqueda)

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// Importa los componentes necesarios
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Breadcrumb } from 'react-bootstrap'; 

// URLs de API
const API_URL_PRODUCTOS = 'http://localhost:8080/api/productos'; // Endpoint para TODOS los productos
const API_URL_CATEGORIAS = 'http://localhost:8080/api/categorias'; // Endpoint para categorías ACTIVAS

// --- Funciones auxiliares (Asegúrate que estén completas y correctas) ---
function formatearPrecio(valor) {
    const num = Number(valor);
    return isNaN(num) ? '$?' : num.toLocaleString("es-CL");
}
function agregarAlCarrito(producto) {
    // ... (Tu lógica existente para añadir al carrito) ...
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (!producto || typeof producto.id === 'undefined') return; 
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
        const productoParaCarrito = { /* ... */ }; // Crea el objeto
        carrito.push(productoParaCarrito);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto añadido al carrito");
}
// --- Fin Funciones auxiliares ---


function Productos() {
    // Estados
    const [productos, setProductos] = useState([]); // Lista COMPLETA de productos
    const [categorias, setCategorias] = useState([]); // Lista de categorías para filtros
    const [loading, setLoading] = useState(true); // Carga inicial (productos Y categorías)
    const [error, setError] = useState(null);
    
    // Estados para filtros
    const [searchParams, setSearchParams] = useSearchParams();
    const categoriaIdParam = searchParams.get('categoriaId'); // Lee ID de categoría de URL
    const searchTermParam = searchParams.get('buscar');      // Lee término de búsqueda de URL
    
    // Estado local para el input de búsqueda (se sincroniza con URL)
    const [searchTermInput, setSearchTermInput] = useState(searchTermParam || ''); 

    // --- Efecto Principal: Cargar Productos y Categorías ---
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Carga productos y categorías en paralelo
                const [prodResponse, catResponse] = await Promise.all([
                    fetch(API_URL_PRODUCTOS),
                    fetch(API_URL_CATEGORIAS) // Endpoint de categorías activas
                ]);

                if (!isMounted) return;

                if (!prodResponse.ok) throw new Error('Error al cargar productos');
                if (!catResponse.ok) throw new Error('Error al cargar categorías');

                const prodsData = await prodResponse.json();
                const catsData = await catResponse.json();

                if (isMounted) {
                    setProductos(Array.isArray(prodsData) ? prodsData : []);
                    setCategorias(Array.isArray(catsData) ? catsData : []);
                    console.log("Datos cargados:", { productos: prodsData, categorias: catsData });
                }

            } catch (err) {
                console.error("Error en fetchData:", err);
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        // Actualiza el input si el parámetro URL cambia externamente
        setSearchTermInput(searchTermParam || '');

        return () => { isMounted = false; };
    // Depende de los parámetros de URL para recargar si cambian externamente (aunque los cambios locales los manejamos con setSearchParams)
    }, [searchTermParam, categoriaIdParam]); 

    // --- Handlers para Filtros (Actualizan URL) ---
    const handleSelectCategoria = (categoria) => {
        // Mantiene el parámetro 'buscar' si existe, actualiza 'categoriaId'
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, categoriaId: categoria.id.toString() }, { replace: true });
    };

    const handleVerTodas = () => {
        // Mantiene el parámetro 'buscar' si existe, quita 'categoriaId'
        const currentParams = Object.fromEntries(searchParams.entries());
        delete currentParams.categoriaId; // Elimina el filtro de categoría
        setSearchParams(currentParams, { replace: true });
    };

    // Handler para actualizar la búsqueda (actualiza URL al escribir, con debounce opcional)
    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTermInput(newSearchTerm); // Actualiza input inmediatamente

        // Actualiza URL (podrías añadir debounce aquí para no actualizar en cada tecla)
        const currentParams = Object.fromEntries(searchParams.entries());
        if (newSearchTerm) {
            setSearchParams({ ...currentParams, buscar: newSearchTerm }, { replace: true });
        } else {
            delete currentParams.buscar; // Elimina el parámetro si está vacío
            setSearchParams(currentParams, { replace: true });
        }
    };
    
    // --- Lógica de Filtrado (Ahora basada en parámetros de URL) ---
    const categoriaSeleccionadaObj = categoriaIdParam && !loading // Busca objeto solo si hay ID y no está cargando
        ? categorias.find(cat => cat.id.toString() === categoriaIdParam)
        : null;

    const productosFiltrados = productos.filter(p => {
        if (!p || typeof p !== 'object') return false;

        // Filtrar por categoría (usa categoriaIdParam)
        const matchesCategory = categoriaIdParam
            ? (Array.isArray(p.categorias) && p.categorias.some(cat => cat && cat.id?.toString() === categoriaIdParam))
            : true; // Incluye si no hay filtro de categoría en URL

        // Filtrar por término de búsqueda (usa searchTermParam)
        const matchesSearch = searchTermParam
            ? (p.nombre && typeof p.nombre === 'string' && p.nombre.toLowerCase().includes(searchTermParam.toLowerCase()))
            : true; // Incluye si no hay término de búsqueda en URL

        return matchesCategory && matchesSearch;
    });

    if (loading && productos.length === 0) { // Muestra spinner solo en carga inicial
        return <Container className="text-center p-5"><Spinner animation="border" variant="primary" /></Container>;
    }
    if (error && productos.length === 0) { // Muestra error solo si falló la carga inicial
        return <Container className="p-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <Container className="py-4">
            <h1>
                {categoriaSeleccionadaObj ? `Productos de ${categoriaSeleccionadaObj.nombre}` : 'Todos los Productos'}
            </h1>

            <Row className="mb-4 gy-3 align-items-center">
                <Col md={5}>
                     <Form.Control 
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTermInput} // Vinculado al estado local del input
                        onChange={handleSearchChange} 
                    />
                </Col>
                {/* Filtro de Categorías */}
                <Col md={7}>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <span className="me-2">Filtrar:</span>
                        {/* Botón Ver Todas */}
                        <Button
                            variant={!categoriaIdParam ? "primary" : "outline-secondary"} // Usa secondary para inactivo
                            size="sm"
                            onClick={handleVerTodas}
                            className="text-nowrap" // Evita que se parta el texto
                        >
                            Ver Todas
                        </Button>
                        {/* Botones de Categoría */}
                        {categorias.map(cat => (
                            <Button
                                key={cat.id}
                                variant={categoriaIdParam === cat.id.toString() ? "primary" : "outline-secondary"}
                                size="sm"
                                onClick={() => handleSelectCategoria(cat)}
                                className="text-nowrap"
                            >
                                {cat.nombre}
                            </Button>
                        ))}
                         {/* Muestra spinner pequeño si las categorías aún están cargando */}
                         {loading && categorias.length === 0 && <Spinner animation="border" size="sm" variant="secondary"/>}
                    </div>
                </Col>
            </Row>


            {loading && productos.length > 0 && (
                <div className="text-center p-3"><Spinner animation="border" size="sm" variant="primary" /> Recargando...</div>
            )}
            {/* Muestra error si falló una recarga */}
            {error && productos.length > 0 && (
                <Alert variant="danger">Error al recargar: {error}</Alert>
            )}

            {/* Muestra la cuadrícula */}
            <Row className="mt-4">
                {/* Mensaje si no hay resultados */}
                {!loading && productosFiltrados.length === 0 && (
                    <Col>
                        <Alert variant="info">
                            No se encontraron productos que coincidan con los filtros aplicados.
                        </Alert>
                    </Col>
                )}

                {/* Mapeo usa 'productosFiltrados' */}
                {productosFiltrados.map(p => (
                    <Col key={p.id} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="h-100 producto-card"> 
                            <Card.Img 
                                variant="top" 
                                src={`/${p.imagenes ? p.imagenes.split(',')[0].trim() : 'img/default.jpg'}`} 
                                alt={p.nombre || 'Producto'}
                            />
                            <Card.Body> 
                                <Card.Title>
                                    <Link 
                                        to={`/detalle?id=${p.id}`} 
                                        className="text-decoration-none text-dark stretched-link"
                                        title={p.nombre || 'Ver detalle'} 
                                    >
                                        {p.nombre || 'Producto sin nombre'}
                                    </Link>
                                </Card.Title>
                                <Card.Text className="h5 text-primary">          
                                    ${formatearPrecio(p.precio)}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>                                     
                                <Button 
                                    variant="primary" 
                                    className="w-100" 
                                    onClick={(e) => { e.stopPropagation(); agregarAlCarrito(p); }} // Mantenemos stopPropagation por stretched-link
                                >
                                    Añadir al carrito
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
export default Productos;