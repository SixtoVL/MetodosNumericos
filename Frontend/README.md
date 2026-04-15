# Frontend: Interfaz de Análisis Numérico

Una aplicación moderna en React para la visualización y resolución de sistemas no lineales.

## 🛠 Stack Tecnológico
*   **React + TypeScript**: Arquitectura de componentes tipada.
*   **TanStack Query (React Query)**: Gestión de estado global, caché y persistencia.
*   **GeoGebra API**: Visualización interactiva avanzada (2D y 3D).
*   **KaTeX**: Renderizado de alta fidelidad para fórmulas matemáticas.
*   **Lucide React**: Iconografía profesional.
*   **XLSX (SheetJS)**: Exportación de datos a Excel.

## Funcionalidades Implementadas

### 1. Visualización Interactiva con GeoGebra
*   **Detección Dinámica de Dimensión**: El sistema cambia automáticamente entre el motor **GeoGebra Classic (2D)** y **GeoGebra 3D**.
*   **Análisis Funcional**: En 1D, los puntos de iteración se posicionan sobre la curva $f(x)$. En 2D/3D, se muestran curvas y superficies de nivel cero.
*   **Parche de Seguridad**: Bloqueo de zoom del navegador (`STATUS_ACCESS_VIOLATION`) para asegurar estabilidad en exploraciones complejas.

### 2. Persistencia de Datos (UX)
*   **Caché Global**: Los resultados y los valores del formulario persisten al navegar entre la calculadora y la sección de teoría.
*   **Recuperación Automática**: Al volver a la página, el sistema restaura el último cálculo realizado.

### 3. Herramientas de Análisis
*   **Tabla de Iteraciones**: Resultados formateados en decimales legibles (no científicos) con cabeceras matemáticas dinámicas.
*   **Procedimiento Paso a Paso**: Desglose detallado de cada matriz Jacobiana y vector evaluado.
*   **Exportación Profesional**: Botón para descargar la tabla de iteraciones directamente en formato `.xlsx`.

### 4. Sección Teórica
*   Documentación educativa completa renderizada con **MathRenderer** (KaTeX), cubriendo la derivación del método y su extensión multivariable.

##  Requisitos de Instalación
Dentro de la carpeta `Frontend`, ejecutar:
```bash
npm install
# Librerías críticas añadidas recientemente:
npm install xlsx react-katex
```
