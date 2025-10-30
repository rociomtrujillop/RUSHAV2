// src/pages/Categorias.jsx (Completo y Corregido)

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Breadcrumb } from 'react-bootstrap';

// URLs de API
const API_URL_CATEGORIAS = 'http://localhost:8080/api/categorias';
const API_URL_PRODUCTOS_POR_CAT = 'http://localhost:8080/api/productos/categoria';

// --- Funciones auxiliares (Asegúrate que estén completas y correctas) ---
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (!producto || typeof producto.id === 'undefined') {
        console.error("agregarAlCarrito: producto inválido", producto);
        alert("Error al añadir al carrito: producto no válido.");
        return;
    }
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
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
    alert("Producto añadido al carrito");
}

function formatearPrecio(valor) {
    const num = Number(valor);
    if (isNaN(num) || valor === null || valor === undefined) {
        console.warn("formatearPrecio recibió valor inválido:", valor);
        return '$?';
    }
    return num.toLocaleString("es-CL");
}
// --- Fin Funciones ---

// --- Componente Principal ---
function Categorias() {
    // Estados
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingProds, setLoadingProds] = useState(false);
    const [errorCats, setErrorCats] = useState(null);
    const [errorProds, setErrorProds] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const categoriaIdParam = searchParams.get('categoriaId');

    // --- Efecto 1: Cargar categorías ---
    useEffect(() => {
        let isMounted = true;
        setCategorias([]); // Limpia al inicio
        const fetchCategorias = async () => {
            setLoadingCats(true);
            setErrorCats(null);
            try {
                const response = await fetch(API_URL_CATEGORIAS);
                if (!isMounted) return;
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error ${response.status} Cat: ${errorText}`);
                }
                const data = await response.json();
                if (!isMounted) return;
                if (!Array.isArray(data)) {
                    throw new Error("Respuesta Cat no es array.");
                }
                setCategorias(data);

                if (categoriaIdParam) {
                    const catEncontrada = data.find(c => c.id.toString() === categoriaIdParam);
                    if (catEncontrada) {
                        if (isMounted) setCategoriaSeleccionada(catEncontrada);
                    } else {
                        searchParams.delete('categoriaId');
                        if (isMounted) setSearchParams(searchParams, { replace: true });
                    }
                }
            } catch (err) {
                console.error("Error en fetchCategorias:", err);
                if (isMounted) setErrorCats(err.message);
            } finally {
                if (isMounted) setLoadingCats(false);
            }
        };
        fetchCategorias();
        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Solo al montar

    // --- Efecto 2: Cargar productos ---
    useEffect(() => {
        if (!categoriaIdParam) { // Ahora depende directamente del param
            setProductos([]);
            setLoadingProds(false);
            setErrorProds(null);
            // También resetea la categoría seleccionada si se quita el param
            setCategoriaSeleccionada(null); 
            return;
        }

        // Busca la categoría seleccionada DESPUÉS de que carguen las categorías
        if (!loadingCats && categorias.length > 0) {
            const catActual = categorias.find(c => c.id.toString() === categoriaIdParam);
            setCategoriaSeleccionada(catActual); // Actualiza el objeto categoría seleccionada
        }

        let isMounted = true;
        const fetchProductos = async () => {
            setLoadingProds(true);
            setErrorProds(null);
            setProductos([]);
            const url = `${API_URL_PRODUCTOS_POR_CAT}/${categoriaIdParam}`;
            try {
                const response = await fetch(url);
                if (!isMounted) return;
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error ${response.status} Prod: ${errorText}`);
                }
                const data = await response.json();
                if (!isMounted) return;
                if (!Array.isArray(data)) {
                    throw new Error("Respuesta Prod no es array.");
                }
                setProductos(data);
            } catch (err) {
                console.error("Error en fetchProductos:", err);
                if (isMounted) setErrorProds(err.message);
            } finally {
                if (isMounted) setLoadingProds(false);
            }
        };
        fetchProductos();
        return () => { isMounted = false; };
    }, [categoriaIdParam, categorias, loadingCats]); // Depende del param y de que las categorías hayan cargado

    // --- Handlers ---
    const handleSelectCategoria = (categoria) => {
        setSearchParams({ categoriaId: categoria.id.toString() }, { replace: true });
    };
    const handleVerTodas = () => {
        setSearchParams({}, { replace: true }); // Limpia params
    };


    // --- Renderizado ---
    return (
        <Container className="py-4">

            <h1>
                {/* Usa el objeto categoriaSeleccionada para el título */}
                {categoriaSeleccionada ? `Productos de ${categoriaSeleccionada.nombre}` : 'Explora Nuestras Categorías'}
            </h1>

            {/* Filtro de categorías */}
            {loadingCats && <Spinner animation="border" size="sm" />}
            {errorCats && <Alert variant="danger">{errorCats}</Alert>}
            {!loadingCats && !errorCats && Array.isArray(categorias) && categorias.length > 0 && (
                <div className="mb-4">
                    <h5 className="mb-3">Filtrar por categoría:</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {/* Mapeo de botones de categoría */}
                        {categorias.map(cat => (
                            <Button
                                key={cat.id}
                                variant={categoriaIdParam === cat.id.toString() ? "primary" : "outline-primary"} // Activo si ID coincide con param
                                size="sm"
                                onClick={() => handleSelectCategoria(cat)}
                            >
                                {cat.nombre}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            {!loadingCats && !errorCats && categorias.length === 0 && (
                 <Alert variant="info">No hay categorías disponibles.</Alert>
            )}

            {/* Grid de productos */}
            {/* Muestra spinner si está cargando productos específicos (loadingProds es true) */}
            {loadingProds && (
                <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {/* Muestra error si falló al cargar productos específicos */}
            {errorProds && (
                <Alert variant="danger">{errorProds}</Alert>
            )}

            {/* Muestra productos o mensajes informativos */}
            {/* Solo muestra esta sección si NO está cargando productos Y no hubo error de productos */}
            {!loadingProds && !errorProds && (
                <Row className="mt-4">
                    {/* Mensaje "Selecciona categoría" (solo si no hay ID en URL) */}
                    {!categoriaIdParam && (
                        <Col xs={12}>
                            <Alert variant="info">Selecciona una categoría para ver los productos.</Alert>
                        </Col>
                    )}
                    {/* Mensaje "No hay productos" (solo si hay ID en URL y array vacío) */}
                    {categoriaIdParam && productos.length === 0 && (
                        <Col xs={12}>
                            <Alert variant="info">No se encontraron productos para esta categoría.</Alert>
                        </Col>
                    )}

                    {/* Mapeo de productos (con clase producto-card) */}
                    {Array.isArray(productos) && productos.map(p => (
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
                                        onClick={(e) => { 
                                            e.stopPropagation(); // Previene click en link si usas stretched-link
                                            agregarAlCarrito(p);
                                        }}
                                    >
                                        Añadir al carrito
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default Categorias;