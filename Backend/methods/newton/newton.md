# Documentación Técnica: Newton-Raphson con Procedimiento Detallado (Analítico)

Esta versión avanzada del algoritmo no solo resuelve sistemas de ecuaciones, sino que genera toda la traza de cálculos intermedios y representaciones matemáticas en LaTeX para su visualización en interfaces de usuario (UI).

---

## 1. Flujo de la Petición y Procedimiento

El sistema ha sido diseñado para ser transparente, permitiendo que el usuario vea exactamente qué sucede en cada paso:

1.  **Análisis Simbólico**: Al recibir las funciones, el sistema las traduce a objetos matemáticos de SymPy.
2.  **Generación de Fórmulas**: Se generan representaciones en **LaTeX** de las funciones y de la matriz Jacobiana analítica.
3.  **Bucle de Cálculo con Traza**: En cada iteración, antes de actualizar el punto $x$, se capturan los valores numéricos de la matriz $J$ y el vector $F$.
4.  **Resolución y Paso**: Se calcula el vector de cambio $\Delta x$ y se almacena en el objeto de procedimiento.

---

## 2. Detalle del Algoritmo Principal (`methods/newton/newton.py`)

El archivo `newton.py` es el "motor" del sistema. A continuación se detalla su lógica interna:

### A. Preparación de Variables
1.  **Identificación de Variables**: El código detecta cuántas variables hay basándose en la longitud de `punto_inicial`. Genera automáticamente nombres internos como `x_1, x_2, ..., x_n`.
2.  **Llamada al Jacobiano Analítico**: Invoca al helper `calcular_jacobiano_analitico`. Este paso es crucial porque:
    *   Convierte los strings en funciones ejecutables (`f_eval`, `j_eval`).
    *   Genera las fórmulas en LaTeX para la UI.

### B. El Bucle de Iteración
El algoritmo entra en un bucle que se repite hasta cumplir el máximo de `iteraciones` o alcanzar la `tolerancia`. En cada ciclo sucede lo siguiente:

1.  **Evaluación Numérica**: 
    *   Se calcula el valor del vector de funciones $F$ evaluando `f_eval` en el punto actual $x$.
    *   Se calcula la matriz Jacobiana $J$ evaluando `j_eval` en el punto actual $x$.
2.  **Captura de Procedimiento (Paso Intermedio)**: Antes de realizar cualquier cálculo de actualización, se guardan los valores de $x$, $F$ y $J$ en un objeto temporal. Esto permite que la UI muestre "de dónde salieron los números".
3.  **Resolución del Sistema Lineal**:
    *   **Caso Multivariable**: Se resuelve el sistema $J \cdot \Delta x = -F$ utilizando `np.linalg.solve`. Esto busca la dirección y magnitud óptima para acercarse a la raíz.
    *   **Caso Univariable (1D)**: Si solo hay una variable, se realiza la división simple $\Delta x = -f(x) / f'(x)$.
4.  **Cálculo del Error**: Se obtiene la **Norma Euclídea** (magnitud) del vector $\Delta x$. Este valor nos dice qué tanto se movió el punto en esta iteración.
5.  **Actualización de Datos**:
    *   Se guarda la fila en la `tabla` de resultados.
    *   Se completa la información del `procedimiento` con el valor del nuevo punto $x_{nuevo} = x + \Delta x$.
6.  **Criterio de Parada**: Si el `error < tolerancia`, el método se detiene y marca `convergio: true`.

---

## 3. Detalle de los Helpers (Entradas y Salidas)

### A. `helpers/parser_matematico.py`
-   **Recibe**: `funciones_str` (List[str]), `variables_str` (List[str]).
-   **Proceso**: Limpieza de texto, soporte para multiplicación implícita (`3x`) y potencias (`^`).
-   **Regresa**: Expresiones simbólicas y funciones de alto rendimiento (NumPy).

### B. `helpers/calcular_jacobiano.py`
-   **Recibe**: `funciones_str`, `variables_str`.
-   **Proceso**: Calcula el Jacobiano simbólico exacto y genera los strings LaTeX.
-   **Regresa**: 
    -   `f_eval`: Evaluador numérico de funciones.
    -   `j_eval`: Evaluador numérico del Jacobiano.
    -   `latex`: Diccionario con `funciones` y `jacobiano` en formato LaTeX.

---

## 4. Estructura de Salida (JSON)

La respuesta del backend incluye tres secciones principales para la UI:

### 1. Sección de Fórmulas (`formulas`)
Strings listos para ser renderizados por MathJax/KaTeX.
```json
"formulas": {
    "funciones": ["x_{1}^{2} + x_{2}^{2} - 4", ...],
    "jacobiano": "\\left[\\begin{matrix}2 x_{1} & 2 x_{2} ... \\end{matrix}\\right]"
}
```

### 2. Tabla Clásica (`tabla`)
Matriz de datos lista para componentes de tabla (DataTables, Grids).
```json
"tabla": {
    "cabecera": ["n", "x_1", "x_2", "f_1", "f_2", "Error"],
    "filas": [ [1, 1.0, -1.0, -2.0, 0.71, 0.92], ... ]
}
```

### 3. Procedimiento Detallado (`procedimiento`)
Lista de objetos que describen cada paso matemático realizado:
*   `x_actual`: Punto de inicio del paso.
*   `f_evaluada`: Valor de las funciones en ese punto.
*   `jacobiano_evaluado`: Matriz numérica de derivadas en ese punto.
*   `delta_x`: Vector de cambio calculado.
*   `nuevo_x`: Resultado final de la iteración.
