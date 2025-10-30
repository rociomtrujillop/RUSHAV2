// src/pages/Productos.jsx (ARREGLADO FILTRO DE GÉNERO)
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Breadcrumb } from 'react-bootstrap';

const API_URL_PRODUCTOS = 'http://localhost:8080/api/productos';
const API_URL_CATEGORIAS = 'http://localhost:8080/api/categorias';

// --- (Funciones auxiliares formatearPrecio y agregarAlCarrito - sin cambios) ---
function formatearPrecio(valor) {
    const num = Number(valor);
    return isNaN(num) ? '$?' : num.toLocaleString("es-CL");
}
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (!producto || typeof producto.id === 'undefined') return; 
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
        // Objeto simple para el carrito
        const productoParaCarrito = {
            id: producto.id,
            nombre: producto.nombre || 'Producto',
            precio: producto.precio,
            imagen: `/${producto.imagenes ? producto.imagenes.split(',')[0].trim() : 'img/default.jpg'}`,
            cantidad: 1
        };
        carrito.push(productoParaCarrito);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event('cartUpdated')); // Dispara evento para actualizar header
    alert("Producto añadido al carrito");
}
// --- Fin Funciones auxiliares ---


function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const categoriaIdParam = searchParams.get('categoriaId');
    const searchTermParam = searchParams.get('buscar');
    // --- 1. LEER EL PARÁMETRO DE GÉNERO ---
    const generoParam = searchParams.get('genero'); 
    
    const [searchTermInput, setSearchTermInput] = useState(searchTermParam || '');

    // --- Efecto Principal (MODIFICADO) ---
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [prodResponse, catResponse] = await Promise.all([
                    fetch(API_URL_PRODUCTOS),
                    fetch(API_URL_CATEGORIAS) 
                ]);

                if (!isMounted) return;
                if (!prodResponse.ok) throw new Error('Error al cargar productos');
                if (!catResponse.ok) throw new Error('Error al cargar categorías');

                const prodsData = await prodResponse.json();
                const catsData = await catResponse.json();
                
                if (isMounted) {
                    setProductos(Array.isArray(prodsData) ? prodsData : []);
                    setCategorias(Array.isArray(catsData) ? catsData : []);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        setSearchTermInput(searchTermParam || '');
        return () => { isMounted = false; };
        
    // --- 2. AÑADIR generoParam A LAS DEPENDENCIAS ---
    }, [searchTermParam, categoriaIdParam, generoParam]); 

    // --- (Handlers para Filtros - sin cambios) ---
    const handleSelectCategoria = (categoria) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, categoriaId: categoria.id.toString() }, { replace: true });
    };
    const handleVerTodas = () => {
        const currentParams = Object.fromEntries(searchParams.entries());
        delete currentParams.categoriaId;
        setSearchParams(currentParams, { replace: true });
    };
    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTermInput(newSearchTerm);
        const currentParams = Object.fromEntries(searchParams.entries());
        if (newSearchTerm) {
            setSearchParams({ ...currentParams, buscar: newSearchTerm }, { replace: true });
        } else {
            delete currentParams.buscar;
            setSearchParams(currentParams, { replace: true });
        }
    };
    
    // --- Lógica de Filtrado (MODIFICADA) ---
    const categoriaSeleccionadaObj = categoriaIdParam && !loading
        ? categorias.find(cat => cat.id.toString() === categoriaIdParam)
        : null;
        
    const productosFiltrados = productos.filter(p => {
        if (!p || typeof p !== 'object') return false;

        // Filtro de Categoría (sin cambios)
        const matchesCategory = categoriaIdParam
            ? (Array.isArray(p.categorias) && p.categorias.some(cat => cat && cat.id?.toString() === categoriaIdParam))
            : true;

        // Filtro de Búsqueda (sin cambios)
        const matchesSearch = searchTermParam
            ? (p.nombre && typeof p.nombre === 'string' && p.nombre.toLowerCase().includes(searchTermParam.toLowerCase()))
            : true;
            
        // --- 3. AÑADIR FILTRO DE GÉNERO ---
        const matchesGenero = generoParam
            ? (p.genero && p.genero.toLowerCase() === generoParam.toLowerCase())
            : true; // Si no hay param de genero, muestra todos

        return matchesCategory && matchesSearch && matchesGenero;
    });

    // --- (Renderizado JSX - sin cambios) ---
    if (loading && productos.length === 0) { 
        return <Container className="text-center p-5"><Spinner animation="border" variant="primary" /></Container>;
    }
    if (error && productos.length === 0) {
        return <Container className="p-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    // Define un título dinámico
    let titulo = "Todos los Productos";
    if (categoriaSeleccionadaObj) {
        titulo = `Productos de ${categoriaSeleccionadaObj.nombre}`;
    } else if (generoParam) {
        titulo = `Productos para ${generoParam.charAt(0).toUpperCase() + generoParam.slice(1)}`;
    }

    return (
        <Container className="py-4">
            <h1>{titulo}</h1>

            <Row className="mb-4 gy-3 align-items-center">
                <Col md={5}>
                    <Form.Control 
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTermInput} 
                        onChange={handleSearchChange} 
                    />
                </Col>
                <Col md={7}>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <span className="me-2">Filtrar:</span>
                        <Button
                            variant={!categoriaIdParam ? "primary" : "outline-secondary"}
                            size="sm"
                            onClick={handleVerTodas}
                            className="text-nowrap"
                        >
                            Ver Todas
                        </Button>
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
                         {loading && categorias.length === 0 && <Spinner animation="border" size="sm" variant="secondary"/>}
                    </div>
                </Col>
            </Row>

            {loading && productos.length > 0 && (
                <div className="text-center p-3"><Spinner animation="border" size="sm" variant="primary" /> Recargando...</div>
            )}
            {error && productos.length > 0 && (
                <Alert variant="danger">Error al recargar: {error}</Alert>
            )}

            <Row className="mt-4">
                {!loading && productosFiltrados.length === 0 && (
                    <Col>
                        <Alert variant="info">
                            No se encontraron productos que coincidan con los filtros aplicados.
                        </Alert>
                    </Col>
                )}

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
                                    onClick={(e) => { e.stopPropagation(); agregarAlCarrito(p); }}
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