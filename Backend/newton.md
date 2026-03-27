# Documentación Técnica: Newton-Raphson con SymPy (Analítico)

Esta versión del algoritmo utiliza **Cálculo Simbólico (SymPy)** para procesar funciones matemáticas naturales y obtener derivadas exactas, mejorando drásticamente la precisión y la experiencia del usuario.

## 1. Flujo de la Petición

El flujo modular se mantiene, pero la inteligencia de procesamiento ha aumentado:

1.  **Endpoint**: Recibe el JSON con funciones en lenguaje natural (ej: `x_1^2 + sin x_1`).
2.  **Controlador**: Valida los datos y los envía al método.
3.  **Lógica del Método (`newton.py`)**: 
    *   Identifica cuántas variables hay basándose en `punto_inicial`.
    *   Solicita al **Parser** y al **Jacobiano** las funciones ejecutables.
    *   Ejecuta el ciclo de Newton-Raphson usando las funciones analíticas.
4.  **Helpers**: Traducen el texto a matemáticas puras y calculan derivadas exactas.

---

## 2. Detalle de los Helpers (Entradas y Salidas)

Para mantener la limpieza del código, el algoritmo principal delega tareas en los siguientes módulos:

### A. `helpers/parser_matematico.py`
Es el "traductor" que permite que el usuario escriba funciones de forma natural.
-   **Recibe**: 
    -   `funciones_str` (List[str]): Lista de funciones como texto (ej: `["3x_1^2", "sin x_2"]`).
    -   `variables_str` (List[str]): Lista de nombres de variables (ej: `["x_1", "x_2"]`).
-   **Proceso**:
    -   Limpia el texto (cambia `^` por `**`, detecta multiplicaciones implícitas como `3x`).
    -   Utiliza `sp.parse_expr` para crear expresiones simbólicas.
-   **Regresa**: 
    -   `f_num`: Una función de NumPy "lambdificada" (ejecutable a alta velocidad).
    -   `exprs`: Las expresiones simbólicas originales de SymPy.
    -   `simbolos`: Los objetos de símbolo de SymPy utilizados.

### B. `helpers/calcular_jacobiano.py`
Encargado de la diferenciación automática y analítica.
-   **Recibe**: 
    -   `funciones_str` (List[str]).
    -   `variables_str` (List[str]).
-   **Proceso**:
    -   Obtiene las expresiones del parser.
    -   Calcula la **Matriz Jacobiana Analítica** mediante `sp.Matrix(exprs).jacobian(simbolos)`. Esto genera las fórmulas exactas de las derivadas parciales.
-   **Regresa**:
    -   `f_eval`: Función numérica para evaluar el vector de funciones $F(x)$.
    -   `j_eval`: Función numérica para evaluar la matriz Jacobiana $J(x)$.

---

## 3. El Algoritmo en `newton.py`

El algoritmo ahora es más robusto y preciso al no depender de aproximaciones numéricas ($h \to 0$):

1.  **Preparación**: Se generan los evaluadores analíticos `f_eval` y `j_eval` una sola vez antes de iniciar el bucle.
2.  **Bucle de Iteración**:
    *   **Evaluación**: Se calculan los valores numéricos de $F$ y $J$ en el punto actual $x$.
    *   **Sistema Lineal**: Se resuelve $J \cdot \Delta x = -F$ usando `np.linalg.solve`.
    *   **Actualización**: $x_{nuevo} = x_{actual} + \Delta x$.
    *   **Error**: Se utiliza la Norma del vector $\Delta x$ para medir la convergencia.
3.  **Tabla de Resultados**: Se construye dinámicamente según el número de variables y funciones detectadas.

---

## 4. Ventajas del Enfoque Analítico

| Característica | Método Numérico (Diferencias Finitas) | Método Analítico (SymPy) |
| :--- | :--- | :--- |
| **Precisión** | Aproximada (depende de $h$) | **Exacta** (máxima precisión de máquina) |
| **Estabilidad** | Puede fallar si $h$ es muy pequeño/grande | **Muy estable** |
| **Entrada** | Requiere sintaxis de Python estrictamente | **Acepta lenguaje natural** (`x^2`, `3x`) |
| **Velocidad** | Rápido | **Ultra rápido** (gracias a `lambdify`) |

---

## 5. Ejemplo de Notación Soportada
El backend ahora entiende perfectamente expresiones como:
- `x_1^2 + 5x_2 - np.exp(x_1)`
- `sin(x_1) + cos(x_2)`
- `(x_1 - 2)^2 + (x_2 - 3)^2 - 25`
