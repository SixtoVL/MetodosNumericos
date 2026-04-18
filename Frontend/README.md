# Frontend: Interfaz de Análisis Numérico

Una aplicación moderna en React para la visualización y resolución de sistemas no lineales.

## Stack Tecnológico
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

---

## Arquitectura de Estilos y Diseño

manejo el diseño actualmente:

1. Encapsulamiento y Cero Colisiones  
Cada componente que he desarrollado (como las nuevas guías de sintaxis o el catálogo de ejemplos) tiene su propio archivo `.module.css` dedicado. Al trabajar así, garantizo que las clases estén totalmente aisladas. Por ejemplo, puedo usar una clase llamada `.container` en diez componentes diferentes y sé con total seguridad que ninguno afectará al otro, porque el sistema genera identificadores únicos para cada uno en tiempo de compilación.

2. Lógica de Estilos Dinámica  
Para las funcionalidades de diagnóstico (como cuando el sistema detecta que un método está divergiendo), implementé el uso de la librería `clsx`. Esto me permite gestionar de forma muy limpia los estados de la interfaz. En lugar de tener lógica pesada en el HTML, simplemente le digo al componente: "si el cálculo es exitoso, usa el estilo verde; si se detuvo por error, aplica el estilo naranja". Esto hace que el código sea mucho más legible y profesional.

3. Consistencia Visual mediante Reutilización  
Para que la aplicación se sienta como un sistema unificado y no como herramientas separadas, apliqué un patrón de herencia de layouts. La página de Punto Fijo utiliza la misma estructura de cuadrícula que definí para Newton. Al compartir estos módulos de estilo base, logré que el panel de configuración izquierdo y el área de resultados derecha mantengan proporciones exactas en todo el sitio, ahorrando código y asegurando una experiencia de usuario (UX) coherente.

4. Acabado 'Premium' con Vanilla CSS Moderno  
Aunque no estoy utilizando librerías de componentes externas (como Bootstrap o Tailwind), he aprovechado al máximo las capacidades de CSS moderno dentro de los módulos. He integrado:
   - Flexbox y Grid para que las tarjetas de los ejemplos y los formularios se adapten perfectamente al espacio.
   - Glassmorphism: Usando `backdrop-filter: blur` para los modales de información, dándoles un toque moderno y elegante.
   - Animaciones Nativas: Definí `@keyframes` dentro de los módulos para que las ventanas de guía aparezcan con transiciones suaves, elevando la percepción de calidad de la herramienta.

5. Optimización para Notación Matemática  
Finalmente, puse especial atención en el renderizado de LaTeX. Los estilos de los contenedores de procedimiento están diseñados con desbordamientos inteligentes. Esto significa que si ingresas un sistema 3x3 con matrices Jacobianas muy grandes, la interfaz no se rompe; el usuario puede desplazarse lateralmente de forma suave dentro del paso de la iteración, manteniendo siempre la integridad del diseño general.

En resumen, usamos CSS Modules, pero implementando nuevas técnicas para que soporten una lógica de negocio más compleja, manteniendo siempre un código limpio, modular y con un estándar visual de alto nivel.

---

##  Requisitos de Instalación
Dentro de la carpeta `Frontend`, ejecutar:
```bash
npm install
# Librerías críticas añadidas recientemente:
npm install xlsx react-katex