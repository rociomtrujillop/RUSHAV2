# Tienda E-Commerce "Rushav" - Proyecto Full-Stack

Este proyecto es una aplicación web full-stack completa que simula una tienda de ropa (e-commerce). Implementa una API RESTful en el backend usando Spring Boot y un frontend dinámico (SPA) usando React.

---

## Descripción del Proyecto

La aplicación está dividida en dos componentes principales:

1. **Frontend (Cliente):** Es la tienda pública donde los visitantes pueden registrarse, ver productos, filtrar por categorías, añadir productos a un carrito y completar un formulario de checkout
2. **Backend (Administración):** Un panel de administración (`/admin`) protegido por contraseña. Los administradores pueden gestionar (Crear, Leer, Actualizar, Eliminar) usuarios, productos y categorías. Incluye un dashboard con estadísticas clave y accesos directos a listas filtradas.

## Arquitectura

El proyecto sigue una arquitectura de API REST desacoplada:

* **Backend (API):** Construido con **Spring Boot**, expone una API REST para manejar toda la lógica de negocio y la persistencia de datos. La seguridad se gestiona con **Spring Security** (usando `HttpBasic` y autenticación basada en roles).
* **Frontend (SPA):** Construido con **React (Vite)**, consume la API del backend. [cite_start]El estado de autenticación del usuario se maneja globalmente usando **React Context API** (`AuthContext`) [cite: 26-52].
* **Base de Datos:** Se utiliza **MySQL** como motor de base de datos relacional, gestionado a través de **Spring Data JPA**.

---

## Tecnologías Utilizadas

| Stack | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Backend** | Java (JDK 17) | Lenguaje principal |
| | Spring Boot | Framework de la API |
| | Spring Security | Autenticación (HttpBasic) y autorización (Roles) |
| | Spring Data JPA | Conexión y queries a la base de datos |
| | Maven | Gestión de dependencias del backend |
| | Mockito | Pruebas unitarias de servicios |
| **Frontend** | React 19 | Librería principal de UI |
| | Vite | Herramienta de construcción y servidor de desarrollo |
| | React Router | [cite_start]Enrutamiento de la SPA (Cliente y Admin) [cite: 729-745] |
| | React Bootstrap | [cite_start]Framework de componentes de UI [cite: 14-25, 58-82, 100-108] |
| | Context API | [cite_start]Manejo de estado global (`AuthContext`) [cite: 26-52] |
| | Vitest | [cite_start]Pruebas unitarias de componentes (ej. `Contacto.test.jsx` [cite: 437-445]) |
| **Base de Datos** | MySQL | Almacenamiento de datos |
| **Documentación** | Swagger (Springdoc) | Documentación interactiva de la API |

---

## Instalación y Ejecución

Este proyecto está dividido en dos repositorios separados. Sigue los pasos para cada uno.

### 1. Backend (API Spring Boot)

**Requisitos:**
* JDK 17 (o superior)
* Maven
* Un servidor MySQL (ej. XAMPP, MySQL Workbench)

**Instalación:**
1.  Clona este repositorio:
    ```bash
    git clone [URL-DE-TU-REPO-BACKEND]
    cd rushav-backend
    ```
2.  **Base de Datos:** Abre tu gestor de MySQL y crea una nueva base de datos (schema) llamada `rushav_db`.
    ```sql
    CREATE DATABASE rushav_db;
    ```
3.  **Configuración:** Abre el archivo `src/main/resources/application.properties`.
    * Asegúrate de que `spring.datasource.username` y `spring.datasource.password` coincidan con tu configuración local de MySQL.
    * **¡Importante!** El proyecto está configurado con `spring.jpa.hibernate.ddl-auto=create-drop` y `spring.sql.init.mode=always`. Esto significa que **la base de datos se borrará y se volverá a crear con datos de prueba (`data.sql`) cada vez que inicies el backend**.

**Ejecución:**
1.  Abre el proyecto con tu IDE (IntelliJ, Eclipse, VSCode).
2.  Ejecuta la clase principal `RushavBackendApplication.java`.
3.  El backend se estará ejecutando en `http://localhost:8080`.

### 2. Frontend (React)

**Requisitos:**
* Node.js (v18 o superior)

**Instalación:**
1.  Clona este repositorio en una **carpeta separada**:
    ```bash
    git clone [URL-DE-TU-REPO-FRONTEND]
    cd tiendarushav
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

**Ejecución:**
1.  Inicia el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
2.  Abre tu navegador y ve a `http://localhost:5173` (o el puerto que indique la terminal).

---

## Documentación de API y Credenciales

### Documentación Swagger
Una vez que el **backend** esté corriendo, puedes acceder a la documentación interactiva completa de la API (que incluye instrucciones de cómo autenticarse) en:

**`http://localhost:8080/swagger-ui.html`**

### Credenciales de Prueba
El script `data.sql` del backend crea el siguiente usuario administrador por defecto:

* **Usuario:** `admin@rushav.cl`
* **Contraseña:** `admin123`
