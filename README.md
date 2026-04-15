#  Sistema de Métodos Numéricos Avanzados

Este proyecto es una plataforma web robusta y profesional diseñada para resolver problemas complejos de ingeniería y matemáticas mediante métodos numéricos. Actualmente, el sistema cuenta con una implementación líder del **Método de Newton-Raphson Analítico** para sistemas de ecuaciones no lineales.

La plataforma se divide en un **Backend de alto rendimiento** (Python/FastAPI) y un **Frontend científico interactivo** (React/TypeScript).

---

##  Características Principales

-   **Motor de Cálculo Simbólico**: Utiliza **SymPy** para obtener derivadas y matrices Jacobianas exactas, eliminando errores de aproximación en la fase de planteamiento.
-   **Dashboard Científico**: Interfaz moderna con renderizado de fórmulas en **LaTeX** y gráficos interactivos con **Plotly.js**.
-   **Transparencia Algorítmica**: No solo entrega la raíz, sino que muestra el **procedimiento detallado paso a paso** y la tabla de convergencia completa.
-   **Arquitectura Modular**: Diseñado bajo patrones de software que permiten escalar e integrar nuevos métodos numéricos fácilmente.

---

##  Stack Tecnológico

### **Backend (Motor de Cálculo)**
-   **FastAPI**: Framework de alto rendimiento para la API.
-   **SymPy**: Matemáticas simbólicas para Jacobianas analíticas.
-   **NumPy**: Procesamiento vectorial y resolución de sistemas lineales.
-   **Pydantic**: Validación estricta de datos.

### **Frontend (Interfaz de Usuario)**
-   **React + Vite**: Compilación rápida y UI reactiva.
-   **TypeScript**: Tipado robusto para datos científicos.
-   **Plotly.js**: Gráficos de alta precisión para trayectorias de raíces.
-   **KaTeX**: Renderizado profesional de notación matemática.
-   **TanStack Query**: Gestión eficiente de estados y peticiones asíncronas.

---

##  Estructura del Repositorio

```text
MetodosNumericos/
├── Backend/        # API REST, Lógica matemática y Algoritmos (Python)
├── Frontend/       # Dashboard interactivo y Visualización (React/TS)
└── README.md       # Documentación general del sistema
```

---

##  Instalación Rápida

### **1. Backend**
```bash
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python server.py
```

### **2. Frontend**
```bash
cd Frontend
npm install
npm run dev
```

---

##  Hoja de Ruta (Roadmap)

Este sistema está en constante evolución. Próximamente se integrarán los siguientes métodos y funcionalidades:

-   **[ ] Solución de Ecuaciones de una Variable**: Bisección, Regla Falsa, Secante.
-   **[ ] Sistemas de Ecuaciones Lineales**: Gauss-Seidel, Jacobi, Eliminación Gaussiana.
-   **[ ] Interpolación y Ajuste de Curvas**: Polinomios de Lagrange, Newton, Mínimos Cuadrados.
-   **[ ] Integración y Derivación Numérica**: Regla de Simpson (1/3 y 3/8), Trapecio.
-   **[ ] Ecuaciones Diferenciales**: Runge-Kutta de 4to orden, Euler.
-   **[ ] Exportación de Resultados**: Generación de reportes en PDF y archivos Excel.

---

##  Contribuciones e Integridad
El proyecto ha sido diseñado para ser una herramienta educativa y profesional de alta fidelidad, asegurando que cada resultado sea verificable a través de su traza de procedimiento detallada.
