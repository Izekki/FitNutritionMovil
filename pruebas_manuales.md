# Guía de Pruebas Manuales de la API Completa - fitNutrition

Esta guía contiene la lista de todos los endpoints de la API de `fitNutrition` junto con ejemplos de solicitudes y respuestas JSON correspondientes.

---

## 1. Endpoints de Autenticación (`/api/autenticacion`)

### A. Login Web (Médicos, Administradores y Pacientes)
*   **URL:** `POST /api/autenticacion/ingresar`
*   **Cuerpo de la Solicitud (Administrador):**
    ```json
    {
      "login": "miguellmrjilo@gmail.com",
      "password": "admin123"
    }
    ```
*   **Cuerpo de la Solicitud (Médico):**
    ```json
    {
      "login": "carlos.ramirez@fitnutrition.com",
      "password": "medico123"
    }
    ```
*   **Cuerpo de la Solicitud (Paciente):**
    ```json
    {
      "login": "ana.martinez@gmail.com",
      "password": "1234"
    }
    ```
*   **Respuesta Exitosa (HTTP 200 OK):**
    ```json
    {
      "error": false,
      "mensaje": "Acceso concedido",
      "token": "d820875c-3f41-4560-b6ab-a70d10b7ee04",
      "usuario": {
        "idUsuario": 1,
        "login": "miguellmrjilo@gmail.com",
        "rol": "Administrador",
        "estatus": true
      }
    }
    ```

### B. Login Móvil (Paciente)
*   **URL:** `POST /api/autenticacion/ingresar-movil`
*   **Cuerpo de la Solicitud:**
    ```json
    {
      "email": "ana.martinez@gmail.com",
      "codigoAcceso": "1234"
    }
    ```
*   **Respuesta Exitosa (HTTP 200):**
    ```json
    {
      "error": false,
      "mensaje": "Acceso concedido",
      "token": "fa3b2c1d-1234-5678-abcd-ef0123456789",
      "usuario": {
        "idUsuario": 1,
        "login": "ana.martinez@gmail.com",
        "rol": "Paciente",
        "estatus": true
      }
    }
    ```

### C. Cerrar Sesión
*   **URL:** `POST /api/autenticacion/cerrar-sesion`
*   **Descripción:** Finaliza el estado de autenticación de forma lógica.
*   **Respuesta Exitosa (HTTP 200 OK):**
    ```json
    {
      "error": false,
      "mensaje": "Sesión cerrada exitosamente"
    }
    ```

### D. Cambiar Contraseña / Código de Acceso
*   **URL:** `POST /api/autenticacion/cambiar-contrasena`
*   **Cuerpo de la Solicitud (Médico):**
    ```json
    {
      "id": 1,
      "rol": "medico",
      "contrasenaActual": "medico123",
      "contrasenaNueva": "medicoNueva123"
    }
    ```
*   **Cuerpo de la Solicitud (Administrador):**
    ```json
    {
      "id": 1,
      "rol": "administrador",
      "contrasenaActual": "admin123",
      "contrasenaNueva": "adminNueva123"
    }
    ```
*   **Cuerpo de la Solicitud (Paciente):**
    ```json
    {
      "id": 1,
      "rol": "paciente",
      "contrasenaActual": "1234",
      "contrasenaNueva": "5678"
    }
    ```
*   **Respuesta Exitosa (HTTP 200 OK):**
    ```json
    {
      "error": false,
      "mensaje": "Contraseña cambiada exitosamente"
    }
    ```
*   **Respuesta de Error (HTTP 200 OK o 400 Bad Request):**
    ```json
    {
      "error": true,
      "mensaje": "La contraseña actual es incorrecta"
    }
    ```

---

## 2. Endpoints CRUD por Rol

> [!NOTE]
> Por motivos de seguridad, los endpoints de consulta (`GET` individual o listado) no retornan campos sensibles como `contrasena` (en Administradores y Médicos) o `codigoAcceso` (en Pacientes).

### A. Administradores (`/api/administradores`)
*   **GET `/api/administradores`**: Obtener todos.
    *   *Respuesta (JSON):*
        ```json
        [
          {
            "idAdministrador": 1,
            "email": "miguellmrjilo@gmail.com",
            "nombreAdmin": "Teo"
          }
        ]
        ```
*   **GET `/api/administradores/{id}`**: Obtener por ID (si no existe, retorna 404 Not Found con cuerpo de `Respuesta`).
*   **POST `/api/administradores`**: Crear administrador.
    *   *Request Body:*
        ```json
        {
          "email": "nuevo.admin@fitnutrition.com",
          "contrasena": "adminPassword",
          "nombreAdmin": "Admin Auxiliar"
        }
        ```
*   **PUT `/api/administradores/{id}`**: Actualizar.
*   **DELETE `/api/administradores/{id}`**: Eliminar.

### B. Médicos (`/api/medicos`)
*   **GET `/api/medicos`**: Obtener todos.
    *   *Respuesta (JSON):*
        ```json
        [
          {
            "idMedico": 1,
            "numPersonal": 1001,
            "cedulaProfesional": "CED123456",
            "nombreMedico": "Carlos",
            "apellidosMedico": "Ramirez Lopez",
            "fechaNacimiento": "1980-05-10",
            "genero": "M",
            "email": "carlos.ramirez@fitnutrition.com",
            "telefono": "2281234567",
            "domicilio": "Xalapa, Veracruz",
            "fotografia": "medico1.jpg"
          }
        ]
        ```
*   **GET `/api/medicos/{id}`**: Obtener por ID.
*   **POST `/api/medicos`**: Crear médico.
    *   *Request Body:*
        ```json
        {
          "numPersonal": 1002,
          "cedulaProfesional": "CED987654",
          "nombreMedico": "Laura",
          "apellidosMedico": "Gomez Perez",
          "contrasena": "laura123",
          "fechaNacimiento": "1985-11-22",
          "genero": "F",
          "email": "laura.gomez@fitnutrition.com",
          "telefono": "2287654321",
          "domicilio": "Xalapa, Veracruz",
          "fotografia": null
        }
        ```
*   **PUT `/api/medicos/{id}`**: Actualizar.
*   **DELETE `/api/medicos/{id}`**: Eliminar.

### C. Pacientes (`/api/pacientes`)
*   **GET `/api/pacientes`**: Obtener todos.
    *   *Respuesta (JSON):*
        ```json
        [
          {
            "idPaciente": 1,
            "idMedico": 1,
            "nombrePaciente": "Ana",
            "apellidosPaciente": "Martinez Gomez",
            "fechaNacimiento": "2000-08-15",
            "genero": "F",
            "peso": 62.50,
            "estatura": 1.65,
            "talla": 28.00,
            "email": "ana.martinez@gmail.com",
            "telefono": "2289876543",
            "domicilio": "Coatepec, Veracruz",
            "fotografia": "paciente1.jpg"
          }
        ]
        ```
*   **GET `/api/pacientes/{id}`**: Obtener por ID.
*   **POST `/api/pacientes`**: Crear paciente.
    *   *Request Body:*
        ```json
        {
          "idMedico": 1,
          "nombrePaciente": "Pedro",
          "apellidosPaciente": "Ortiz Ruiz",
          "fechaNacimiento": "1995-03-12",
          "genero": "M",
          "peso": 75.00,
          "estatura": 1.78,
          "talla": 32.00,
          "email": "pedro.ortiz@gmail.com",
          "telefono": "2285551234",
          "domicilio": "Xalapa, Veracruz",
          "fotografia": null,
          "codigoAcceso": "5678"
        }
        ```
*   **PUT `/api/pacientes/{id}`**: Actualizar.
*   **DELETE `/api/pacientes/{id}`**: Eliminar.

---

## 3. Catálogos Nutricionales (`/api/catalogos`)

### A. Dietas
*   **GET `/api/catalogos/dietas`**: Listar todas.
*   **GET `/api/catalogos/dietas/{id}`**: Obtener por ID.
*   **POST `/api/catalogos/dietas`**: Crear dieta.
    *   *Request Body:*
        ```json
        {
          "nombreDieta": "Dieta Baja en Carbohidratos",
          "caloriasTotales": 1800.0,
          "descripcion": "Restricción de hidratos de carbono para pérdida de peso.",
          "estatusEdicion": "Editable"
        }
        ```
*   **PUT `/api/catalogos/dietas/{id}`**: Actualizar dieta.
*   **DELETE `/api/catalogos/dietas/{id}`**: Eliminar dieta.

### B. Alimentos
*   **GET `/api/catalogos/alimentos`**: Listar todos.
*   **GET `/api/catalogos/alimentos/{id}`**: Obtener por ID.
*   **POST `/api/catalogos/alimentos`**: Crear alimento.
    *   *Request Body:*
        ```json
        {
          "nombreAlimento": "Huevo cocido",
          "calorias": 155.0,
          "porcion": "100g",
          "proteinas": 13.0,
          "carbohidratos": 1.1,
          "grasas": 11.0
        }
        ```
*   **PUT `/api/catalogos/alimentos/{id}`**: Actualizar alimento.
*   **DELETE `/api/catalogos/alimentos/{id}`**: Eliminar alimento.

---

## 4. Citas (`/api/citas`)
*   **GET `/api/citas`**: Listar todas.
*   **GET `/api/citas/{id}`**: Obtener por ID.
*   **POST `/api/citas`**: Crear cita.
    *   *Request Body:*
        ```json
        {
          "idPaciente": 1,
          "idMedico": 1,
          "fecha": "2026-06-15",
          "hora": "11:00:00",
          "estado": "Asignada",
          "observaciones": "Control mensual de peso."
        }
        ```
*   **PUT `/api/citas/{id}`**: Actualizar cita.
*   **DELETE `/api/citas/{id}`**: Eliminar cita.

---

## 5. Consultas (`/api/consultas`)
*   **GET `/api/consultas`**: Listar todas.
*   **GET `/api/consultas/{id}`**: Obtener por ID.
*   **POST `/api/consultas`**: Registrar consulta.
    *   *Request Body:*
        ```json
        {
          "idPaciente": 1,
          "idMedico": 1,
          "idCita": 1,
          "idDieta": 1,
          "fecha": "2026-05-20",
          "pesoCapturado": 62.50,
          "tallaCapturada": 1.65,
          "imcCalculado": 22.96,
          "observaciones": "Paciente evoluciona favorablemente."
        }
        ```
*   **PUT `/api/consultas/{id}`**: Actualizar consulta.
*   **DELETE `/api/consultas/{id}`**: Eliminar consulta.

---

## 6. Mapeo Dieta - Alimentos (`/api/dieta-alimentos`)
*   **GET `/api/dieta-alimentos`**: Listar todas las asociaciones.
*   **GET `/api/dieta-alimentos/{id}`**: Obtener asociación por ID.
*   **GET `/api/dieta-alimentos/dieta/{idDieta}`**: Obtener alimentos asociados a una dieta.
*   **GET `/api/dieta-alimentos/alimento/{idAlimento}`**: Obtener dietas asociadas a un alimento.
*   **POST `/api/dieta-alimentos`**: Asociar alimento a dieta.
    *   *Request Body:*
        ```json
        {
          "idDieta": 1,
          "idAlimento": 2,
          "porcion": "150g",
          "caloriasPorcion": 195.0
        }
        ```
*   **PUT `/api/dieta-alimentos/{id}`**: Actualizar asociación.
*   **DELETE `/api/dieta-alimentos/{id}`**: Eliminar asociación.

---

## 7. Carga y Visualización de Imágenes (`/uploads`)

> [!NOTE]
> Este módulo dinámico permite subir y servir imágenes de perfil para médicos y pacientes, almacenándolas en el sistema de archivos del servidor (`C:/fitNutrition/uploads/`) y guardando únicamente el nombre del archivo generado en la columna `fotografia` de la base de datos.

### A. Subir Fotografía (Médico o Paciente)
*   **URL:** `POST /uploads/upload`
*   **Content-Type:** `multipart/form-data`
*   **Parámetros de la Solicitud (Form-Data):**
    *   `file`: Archivo binario de la imagen (JPEG/PNG).
    *   `entityType`: Tipo de entidad (`medico` o `paciente`).
    *   `id`: ID del médico (`idMedico`) o del paciente (`idPaciente`).
*   **Respuesta Exitosa (HTTP 200 OK):**
    ```json
    {
      "error": false,
      "mensaje": "Fotografía guardada exitosamente",
      "fileName": "paciente_1_1717374000.jpg"
    }
    ```
*   **Respuesta de Error (HTTP 400 / 500):**
    ```json
    {
      "error": true,
      "mensaje": "Formato de archivo no soportado. Debe ser JPG, JPEG o PNG"
    }
    ```

### B. Visualizar/Servir Imagen (Recurso Estático)
*   **URL:** `GET /uploads/ver/{fileName}`
*   **Descripción:** Retorna el flujo binario directo de la imagen almacenada. Ideal para cargarse en etiquetas `<Image>` de React Native o componentes de JavaFX.
*   **Ejemplo de URL:** `http://192.168.3.8:8084/FitNutrition/uploads/ver/paciente_1_1717374000.jpg`
*   **Respuesta Exitosa (HTTP 200 OK):** Flujo de bytes con cabecera `Content-Type: image/jpeg` o `image/png`.
*   **Respuesta de Error (HTTP 404 Not Found):** Si el archivo no existe.

