# Agencia de Viajes - Nuevas Funcionalidades  

Este proyecto es una aplicación web para la gestión de una agencia de viajes. En esta versión, se han añadido las siguientes funcionalidades:  

- **Inicio de sesión de administradores**  
- **Creación de nuevos viajes** mediante un formulario  
- **Subida de imágenes** para asociarlas a los viajes  

---

## Nuevas Funcionalidades  

### Inicio de sesión para administradores  
- Se ha implementado un sistema de autenticación con **email y contraseña**.  
- Los administradores se almacenan en la base de datos en **texto plano**.  
- No hay una opción de registro, por lo que los administradores deben darse de alta manualmente en la base de datos.  
- Se ha creado una nueva tabla en la base de datos llamada **admins** para gestionar los administradores.  
- Si un usuario no autenticado intenta acceder a las páginas de administración, será redirigido a `/login`.  

### Creación de nuevos viajes  
- Se ha implementado un formulario accesible desde `/crear_viaje`.  
- Los datos a ingresar son:  
  - **Título**  
  - **Precio**  
  - **Fecha de ida** y **fecha de vuelta**  
  - **Descripción**  
  - **Número de plazas**  
  - **Slug** (identificador único para URLs amigables)  
  - **Imagen** (seleccionada de una lista de imágenes disponibles en la base de datos)  
- Si hay un error en la creación del viaje, aparece una **alerta explicando el problema**.  
- Si se crea correctamente, se muestra una **alerta de confirmación**.  

### Subida de imágenes  
- Se ha añadido un formulario accesible desde `/subir_imagen` para la subida de imágenes.  
- Se deben subir **dos imágenes** por cada entrada:  
  - **[NOMBRE_IMAGEN].jpg** → Imagen pequeña  
  - **[NOMBRE_IMAGEN]_ln.jpg** → Imagen grande  
- El nombre de la imagen se guarda en la base de datos en la nueva tabla **imagenes**.  
- Se ha utilizado **Multer** con `memory storage` para gestionar la subida de archivos.  
- Si la subida falla, se muestra un **mensaje de error**; si es correcta, se muestra una **confirmación**.  

---

## Dependencias añadidas  

- **Multer**: Para la gestión de la subida de imágenes. Se utiliza con **memory storage** para compatibilidad con Express.  
- **Express-session**: Para gestionar sesiones de administradores.  

---

## Nuevas Rutas y Middleware  

### Middleware  
- **`verificarAdmin`** → Middleware que redirige a `/login` si el usuario no ha iniciado sesión como administrador.  

### Autenticación  
- **`GET /login`** → Muestra el formulario de login de administradores.  
- **`POST /login`** → Verifica email y contraseña. Si son correctos, redirige a `/admin`.  
- **`POST /logout`** → Destruye la sesión del administrador y redirige al login.  

### Panel de administración  
- **`GET /admin`** → Página principal de administración con botones para:  
  - Crear viaje (`/crear_viaje`)  
  - Subir imagen (`/subir_imagen`)  
  - Cerrar sesión  

### Gestión de viajes  
- **`GET /crear_viaje`** → Muestra el formulario para crear un nuevo viaje.  
- **`POST /crear_viaje`** → Procesa el formulario y guarda el viaje en la base de datos.  

### Gestión de imágenes  
- **`GET /subir_imagen`** → Muestra el formulario para subir imágenes.  
- **`POST /subir_imagen`** → Sube las imágenes al servidor y guarda su nombre en la base de datos.

### Error
- **`GET /error`** → Muestra una pantalla de error personalizada más amigable para el usuario

---

## Notas adicionales
- La autenticación de administradores actualmente no usa cifrado.
- He creado nuevas imágenes para utilizarlas por defecto en la creación de nuevos viajes.
- En la base de datos hay dos tablas nuevas: admins e imagenes.
- Nueva variable de entorno: SESSION_SECRET para la gestión de sesiones.
- Hay cambios sutiles en todo el código con mejoras que me daba toc no implementarlas.
