INSERT INTO categorias (nombre, descripcion, tipo, activa) VALUES
('Poleras', 'Poleras y remeras', 'principal', true),
('Jeans', 'Jeans de todos los tipos', 'principal', true),
('Chaquetas', 'Chaquetas y abrigos', 'principal', true),
('Zapatillas', 'Calzado urbano', 'principal', true),
('Accesorios', 'Gorros, carteras, etc.', 'principal', true),
('Vestidos', 'Vestidos femeninos', 'principal', true),
('Shorts', 'Shorts y bermudas', 'principal', true),
('Tops', 'Tops y blusas', 'principal', true),
('Faldas', 'Faldas femeninas', 'principal', true),
('Von Dutch', 'Marca Von Dutch', 'temporal', true),
('Ecko', 'Marca Ecko', 'temporal', true),
('CA7RIEL & Paco Amoroso', 'Marca colaboración', 'temporal', true),
('Rilakkuma', 'Marca Rilakkuma', 'temporal', true),
('Emily the Strange', 'Marca Emily the Strange', 'temporal', true);

INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
('Administrador', 'admin@rushav.cl', 'admin123', 'super-admin', true);

INSERT INTO productos (nombre, descripcion, precio, stock, imagenes, genero, activo) VALUES
('Polera Heartstruck', 'Polera oversize con estampado exclusivo.', 9990, 20, 'img/producto1.jpg,img/producto1.2.jpg', 'hombre', true),
('Jeans flare negro', 'Jeans con estilo flare.', 29990, 12, 'img/producto2.jpg,img/producto2.2.jpg', 'hombre', true),
('Chaqueta efecto cuero', 'Chaqueta de cuero sintético con detalles en metal.', 39990, 8, 'img/producto3.jpg,img/producto3.2.jpg', 'hombre', true),
('Zapatillas skate Ecko', 'Zapatillas estilo urbano, cómodas y resistentes.', 49990, 5, 'img/producto4.jpg,img/producto4.2.jpg,img/producto4.3.jpg', 'hombre', true),
('Jeans baggy gris', 'Jeans anchos estilo baggy, color gris cloro.', 29990, 15, 'img/producto5.jpg', 'hombre', true),
('Cortavientos azul gráfico oversize', 'Cortavientos ligero con estampado gráfico.', 15990, 10, 'img/producto6.jpg,img/producto6.2.jpg', 'unisex', true),
('Vestido blanco bordado', 'Vestido blanco con detalles bordados.', 25990, 13, 'img/producto7.jpg,img/producto7.2.jpg', 'mujer', true),
('Gorro Von Dutch', 'Gorro von dutch estilo retro, ajustable.', 11990, 10, 'img/producto8.jpg,img/producto8.2.jpg', 'unisex', true),
('Chaqueta de mezclilla Ecko', 'Chaqueta de mezclilla Ecko, estilo urbano y moderno.', 19990, 10, 'img/producto9.jpg,img/producto9.2.jpg', 'hombre', true),
('Top Von Dutch', 'Top corto Von Dutch, ideal para looks casuales.', 16990, 10, 'img/producto10.jpg,img/producto10.2.jpg', 'mujer', true),
('Falda denim Von Dutch', 'Falda denim mini Von Dutch bordado.', 18990, 10, 'img/producto11.jpg,img/producto11.2.jpg', 'mujer', true),
('Short mini CA7RIEL & Paco Amoroso', 'Short mini CA7RIEL & Paco Amoroso, estampado azul papota.', 25990, 4, 'img/producto12.jpg,img/producto12.2.jpg', 'unisex', true),
('Peludo Rilakkuma', 'Peludo piel sintetica estampado Rilakkuma.', 35990, 7, 'img/producto13.jpg,img/producto13.2.jpg', 'mujer', true),
('Cartera Emily the Strange', 'Cartera de cuero sintético con estampado de Emily the Strange y pins.', 17990, 2, 'img/producto14.jpg,img/producto14.2.jpg', 'mujer', true),
('Jorts parches estrellas', 'Jorts de mezclilla con detalles de estrella.', 19990, 3, 'img/producto15.jpg,img/producto15.2.jpg', 'hombre', true);

INSERT INTO producto_categorias (producto_id, categoria_id) VALUES
(1, 1), (1, 10),   -- Polera Heartstruck -> Poleras, Von Dutch
(2, 2), (2, 11),   -- Jeans flare -> Jeans, Ecko
(3, 3),            -- Chaqueta -> Chaquetas
(4, 4), (4, 11),   -- Zapatillas -> Zapatillas, Ecko
(5, 2),            -- Jeans baggy -> Jeans
(6, 3),            -- Cortavientos -> Chaquetas
(7, 6),            -- Vestido -> Vestidos
(8, 5), (8, 10),   -- Gorro -> Accesorios, Von Dutch
(9, 3), (9, 11),   -- Chaqueta mezclilla -> Chaquetas, Ecko
(10, 8), (10, 10), -- Top -> Tops, Von Dutch
(11, 9), (11, 10), -- Falda -> Faldas, Von Dutch
(12, 7), (12, 12), -- Short -> Shorts, CA7RIEL
(13, 7), (13, 13), -- Peludo -> Shorts, Rilakkuma
(14, 5), (14, 14), -- Cartera -> Accesorios, Emily
(15, 7);           -- Jorts -> Shorts