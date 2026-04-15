# Método de Punto Fijo (Fixed Point Method)

Este módulo implementa el algoritmo de Punto Fijo para la resolución de ecuaciones y sistemas de ecuaciones no lineales.

## Flujo del Algoritmo

### 1. Preparación y Parsing
*   **Normalización:** El sistema acepta tanto una sola función (univariado) como un vector de funciones (multivariado).
*   **Pre-procesamiento:** Se utiliza una lógica de limpieza de strings para manejar potencias (`^` a `**`) y multiplicaciones implícitas (`3x` a `3*x`).
*   **Simbología:** Se utiliza SymPy para interpretar las expresiones matemáticas y convertirlas en funciones numéricas altamente eficientes mediante `lambdify` de NumPy.

### 2. Proceso Iterativo
El núcleo del método sigue la regla de actualización:
$$X^{(k+1)} = G(X^{(k)})$$

*   **Desplazamientos Simultáneos:** En cada paso, se calculan todas las nuevas coordenadas del vector utilizando únicamente los valores del paso anterior. Esto asegura una trayectoria predecible y facilita la visualización.
*   **Criterio de Parada:** El bucle se detiene cuando la **Norma Euclídea** del cambio entre vectores es menor que la tolerancia definida por el usuario.
    $$\| X^{(k+1)} - X^{(k)} \| < \text{tol}$$

### 3. Visualización y GeoGebra
*   **Univariado:** Se intersecta la función $y = g(x)$ con la recta identidad $y = x$.
*   **Sistemas (2D):** Se grafican las curvas de equilibrio $x = g_1(x, y)$ y $y = g_2(x, y)$. La solución es el punto de cruce de estas trayectorias.
*   **Mapeo de Variables:** Se traduce automáticamente la notación interna (`x_1`, `x_2`, `x_3`) a notación geométrica (`x`, `y`, `z`) para compatibilidad total con GeoGebra.

## Estructura de Datos (JSON)
El resultado se entrega en un formato rico que permite al Frontend renderizar:
*   `raiz`: El vector solución aproximado.
*   `formulas`: Representaciones en LaTeX de las funciones originales.
*   `tabla`: Datos para la tabla de iteraciones clásica.
*   `procedimiento`: Un objeto detallado que desglosa cada evaluación individual por iteración para auditoría matemática.
