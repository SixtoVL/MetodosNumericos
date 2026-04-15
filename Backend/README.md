# Backend: Motor de Cálculo Analítico (Newton-Raphson)

Este módulo proporciona el núcleo matemático para la resolución de sistemas de ecuaciones no lineales utilizando el método de Newton-Raphson con derivadas exactas.

##  Tecnologías y Librerías
*   **FastAPI**: Framework de alto rendimiento para la API.
*   **SymPy**: Biblioteca de matemáticas simbólicas para el cálculo del **Jacobiano Analítico**.
*   **NumPy**: Utilizado para la evaluación numérica de alto rendimiento y resolución de sistemas lineales.

##  Características Principales

### 1. Cálculo Analítico Preciso
A diferencia de los métodos que utilizan diferencias finitas para aproximar la derivada, este sistema utiliza **SymPy** para hallar la expresión exacta del Jacobiano. Esto garantiza una convergencia cuadrática real y evita errores de redondeo en la fase de derivación.

### 2. Parser Matemático Inteligente
Implementa un pre-procesador basado en **Regex** que permite al usuario ingresar fórmulas de forma natural:
*   Soporte para multiplicación implícita: `3x_1`, `x_1x_2` $\rightarrow$ `3*x_1`, `x_1*x_2`.
*   Traducción automática para visualizadores: Genera una lista de `funciones_geogebra` donde las variables técnicas se mapean a `x, y, z`.

### 3. Análisis de Error Exhaustivo
El motor devuelve tres métricas de error por cada iteración:
*   **Error Absoluto**: $||x_{k+1} - x_k||$ (distancia recorrida).
*   **Error Relativo**: Normalizado por la magnitud de la solución.
*   **Error Funcional**: $||f(x_k)||$ (qué tan cerca está la función de cero).

##  Estructura de la Respuesta
El backend responde con un objeto JSON enriquecido que incluye:
*   `raiz`: Vector solución.
*   `formulas`: Representaciones en **LaTeX** del sistema y del Jacobiano.
*   `procedimiento`: Traza completa de cada matriz y vector evaluado en cada paso.
*   `funciones_geogebra`: Strings optimizados para renderizado gráfico.
