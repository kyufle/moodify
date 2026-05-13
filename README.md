# Moodify

Aplicación desarrollada con [Expo](https://expo.dev) y React Native.

## Arquitectura

- **Frontend:** React Native (Expo) en la carpeta `moodify-app`.
- **Backend:** Laravel y MySQL en la carpeta `moodify_backend`.

## Cómo arrancar la aplicación (Paso a paso)

Para ejecutar la aplicación en tu entorno local, necesitas desplegar ambas partes:

### 1. Iniciar el Backend (Laravel)

Abre una terminal nueva, sitúate en la carpeta principal `moodify` y sigue estos pasos:

1. **Entra al directorio del backend:**
   ```bash
   cd moodify_backend
   ```

2. *(Solo la primera vez)* **Prepara la base de datos MySQL**:
   Asegúrate de que tu servidor MySQL esté corriendo y crea una base de datos llamada `moodify`. Verifica que las credenciales en tu archivo `moodify_backend/.env` sean correctas. Después, ejecuta las migraciones:
   ```bash
   php artisan migrate
   ```

3. **Inicia el servidor local de Laravel:**
   ```bash
   php artisan serve
   ```
   *El servidor quedará corriendo en `http://127.0.0.1:8000`.*

### 2. Iniciar el Frontend (React Native - Expo)

Abre **otra terminal**, sitúate en la carpeta principal `moodify` y sigue estos pasos:

1. **Entra en el directorio de la aplicación:**
   ```bash
   cd moodify-app
   ```

2. **Inicia el servidor de desarrollo de Expo:**
   ```bash
   npm start
   ```

3. **Prueba la aplicación**:
   Usa el código QR con **Expo Go** en tu móvil, u oprime **`a`**, **`i`**, o **`w`** en la terminal para emuladores o web.