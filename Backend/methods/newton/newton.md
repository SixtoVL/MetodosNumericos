Documentación Técnica: Método de Newton-Raphson Analítico Multivariable

Introducción
El método de Newton-Raphson implementado en este proyecto es un motor de resolución de sistemas de ecuaciones no lineales que destaca por su precisión y profundidad analítica. A diferencia de las versiones numéricas que aproximan derivadas mediante diferencias finitas, este sistema calcula el Jacobiano de forma simbólica, lo que permite obtener una convergencia cuadrática real y una mayor exactitud en la determinación de las raíces.

Flujo de Resolución Matemática
El proceso de cálculo sigue una secuencia rigurosa diseñada para proporcionar la máxima transparencia en los cálculos intermedios.

1. Generación de la Matriz Jacobiana
Tras recibir el sistema de ecuaciones como una lista de cadenas de texto, el motor utiliza diferenciación automática simbólica para construir la matriz Jacobiana. Cada entrada J[i,j] representa la derivada parcial de la i-ésima función respecto a la j-ésima variable. Este proceso garantiza que el sistema lineal resuelto en cada iteración sea matemáticamente exacto según las definiciones del usuario.

2. Evaluación y Resolución del Sistema Lineal
En cada iteración, se evalúan tanto el vector de funciones F como la matriz Jacobiana J en el punto actual x. El sistema procede a resolver la ecuación matricial J * delta_x = -F. Para ello, se utiliza la librería NumPy con optimizaciones para álgebra lineal. El nuevo punto se calcula como x_nuevo = x_actual + delta_x.

3. Monitoreo de Convergencia y Errores
El sistema monitorea tres tipos de errores fundamentales:
- Error absoluto: La norma del vector de cambio delta_x.
- Error relativo: El cambio normalizado respecto a la magnitud del nuevo punto.
- Error funcional: La norma del vector de funciones evaluado, indicando qué tan cerca está el sistema de cumplir la igualdad a cero.

Capacidades de Diagnóstico y Robustez
Newton-Raphson es un método extremadamente potente pero sensible a la singularidad de la matriz Jacobiana. Por ello, el sistema incluye:

- Detección de Matrices Singulares: Si el determinante del Jacobiano es nulo o extremadamente cercano a cero (menor a 1e-18), el método se detiene y reporta el problema exacto, permitiendo al usuario ajustar el punto inicial.
- Prevención de Desbordamiento: Si el método entra en un ciclo de divergencia y los valores superan el umbral de 10^100, se interrumpe la ejecución para proteger la integridad del servidor y la comunicación JSON.
- Análisis de Tendencia: Al igual que en el método de punto fijo, si no se alcanza la convergencia en el límite de iteraciones, el sistema analiza si el error está disminuyendo o aumentando, proporcionando consejos contextuales sobre el punto inicial.

Visualización y Datos para el Usuario
La respuesta del backend incluye una traza completa de la resolución. Se proporcionan las funciones en formato LaTeX, el Jacobiano en formato de matriz LaTeX y una lista de pasos detallados que muestran la evaluación numérica de la matriz y las funciones en cada punto de la iteración. Esto convierte a la calculadora no solo en una herramienta de resolución, sino en una plataforma de aprendizaje y validación de pasos matemáticos.

Integración con GeoGebra
Para la visualización gráfica, las ecuaciones se procesan para eliminar sintaxis técnica de programación y se adaptan a la gramática de GeoGebra, permitiendo la representación de curvas de nivel en 2D y superficies en 3D que se intersectan en la solución encontrada.
