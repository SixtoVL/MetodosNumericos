# Sistema de Métodos Numéricos Avanzados: Plataforma de Resolución Integral

Este proyecto es una plataforma web robusta y profesional diseñada para resolver problemas complejos de ingeniería y matemáticas mediante métodos numéricos de alta precisión. Actualmente, el sistema cuenta con implementaciones líderes de los métodos de **Newton-Raphson Analítico** y **Punto Fijo Multivariable**, permitiendo la resolución de sistemas de ecuaciones no lineales con una fidelidad matemática excepcional.

La plataforma se divide en un **Backend de alto rendimiento** (Python/FastAPI) encargado del procesamiento simbólico y numérico, y un **Frontend científico interactivo** (React/TypeScript) que proporciona un dashboard dinámico para la visualización de resultados.

---

## Características Principales y Funcionalidades

### Motor de Cálculo Simbólico Avanzado
El sistema utiliza la potencia de **SymPy** para realizar operaciones de álgebra computacional. Esto permite:
- **Diferenciación Exacta**: Generación de matrices Jacobianas analíticas para Newton-Raphson, eliminando los errores de truncamiento asociados a los métodos de diferencias finitas.
- **Parsing Flexible**: Soporte para sintaxis matemática natural, incluyendo el uso de paréntesis `()`, corchetes `[]` y llaves `{}` como símbolos de agrupación, así como la detección automática de multiplicación implícita (ej. `3x` se interpreta como `3*x`).

### Dashboard Científico Interactivo
La interfaz de usuario ha sido diseñada para maximizar la comprensión del proceso de resolución:
- **Visualización Geométrica con GeoGebra**: Integración de gráficos en 2D y 3D que muestran en tiempo real las intersecciones de las funciones originales o las superficies de iteración.
- **Renderizado de Fórmulas en LaTeX**: Todas las ecuaciones ingresadas y los resultados intermedios se presentan en notación matemática profesional.
- **Transparencia Algorítmica Total**: El sistema no solo entrega la raíz final; despliega un **procedimiento detallado paso a paso** que incluye la evaluación numérica de matrices y funciones en cada iteración.

### Robustez y Diagnóstico Inteligente
Se han implementado capas de protección para garantizar la estabilidad del sistema:
- **Gestión de Errores Parciales**: Si un cálculo diverge o encuentra un error matemático en una iteración avanzada, el sistema no colapsa. Devuelve todas las iteraciones completadas exitosamente junto con un banner de diagnóstico naranja ("Cálculo Detenido").
- **Análisis de Tendencia**: El motor analiza si el error está disminuyendo (convergencia lenta), aumentando (divergencia) o fluctuando (oscilación), proporcionando consejos correctivos al usuario.
- **Protección Numérica**: Blindaje contra desbordamientos (overflow) y valores no definidos (NaN/Inf), limitando los cálculos a magnitudes manejables (10^100) para asegurar la integridad de la comunicación JSON.

---

## Stack Tecnológico

### **Backend (Motor de Cálculo)**
- **FastAPI**: Framework moderno y rápido para la construcción de la API REST.
- **SymPy**: Biblioteca de matemáticas simbólicas para el cálculo de derivadas y parsing de expresiones.
- **NumPy**: Procesamiento vectorial de alta velocidad y resolución de sistemas lineales.
- **Pydantic**: Validación estricta de esquemas de datos y tipado.
- **Logging**: Sistema de trazabilidad profunda que registra en terminal las peticiones y respuestas con formato JSON legible.

### **Frontend (Interfaz de Usuario)**
- **React 18 + Vite**: Arquitectura de componentes reactiva y compilación ultra rápida.
- **TypeScript**: Tipado robusto para garantizar la integridad de los datos científicos.
- **TanStack Query (React Query)**: Gestión eficiente de estados asíncronos y persistencia de resultados en caché durante la navegación.
- **Lucide Icons**: Set de iconos vectoriales para una interfaz intuitiva.
- **KaTeX / MathRenderer**: Renderizado de alta fidelidad para notación LaTeX.
- **GeoGebra Web API**: Motor dinámico para la visualización de curvas y superficies.

---

## Estructura del Repositorio

```text
MetodosNumericos/
├── Backend/        # API REST, Lógica matemática y Algoritmos (Python)
│   ├── controllers/# Orquestación de peticiones y Logging
│   ├── methods/    # Motores matemáticos (Newton, Punto Fijo)
│   ├── routes/     # Definición de Endpoints
│   └── schemas/    # Modelos de datos Pydantic
├── Frontend/       # Dashboard interactivo y Visualización (React/TS)
│   ├── src/
│   │   ├── api/    # Servicios de comunicación con el Backend
│   │   ├── components/ # UI, Formularios y Visualizadores
│   │   ├── hooks/  # Lógica de estado persistente
│   │   └── pages/  # Contenedores de las calculadoras
└── README.md       # Documentación general del sistema
```

---

## Instalación y Configuración Rápida

### **1. Configuración del Backend**
El backend requiere Python 3.9 o superior. Se recomienda el uso de un entorno virtual para aislar las dependencias.

```bash
cd Backend
# Crear entorno virtual
python -m venv venv
# Activar entorno virtual (Windows)
venv\Scripts\activate
# Activar entorno virtual (Linux/macOS)
source venv/bin/activate
# Instalar dependencias
pip install -r requirements.txt
# Iniciar servidor
python server.py
```
*El servidor iniciará por defecto en `http://localhost:8000`.*

### **2. Configuración del Frontend**
Requiere Node.js y npm instalados.

```bash
cd Frontend
# Instalar dependencias del proyecto
npm install
# Iniciar servidor de desarrollo
npm run dev
```
*La aplicación estará disponible en `http://localhost:5173`.*

---

## Flujo de Trabajo Implementado

### Resolución por Newton-Raphson Analítico
1. El usuario ingresa las funciones $f(x) = 0$.
2. El backend calcula el Jacobiano simbólico exacto.
3. Se ejecuta el ciclo iterativo resolviendo $J \cdot \Delta x = -F$ en cada paso.
4. Se monitorea la convergencia cuadrática y se detectan matrices singulares.

### Resolución por Punto Fijo con Desplazamientos Sucesivos
1. El usuario define el sistema original y los despejes $x = g(x)$.
2. El backend utiliza una estrategia tipo **Gauss-Seidel** (desplazamientos sucesivos), donde los valores actualizados de las variables se utilizan inmediatamente en el cálculo de las siguientes dentro de la misma iteración.
3. Se realiza un análisis de tendencia si el método no alcanza la tolerancia en el límite de iteraciones.

---

## Hoja de Ruta (Roadmap) de Desarrollo

Este sistema está en constante evolución técnica. Próximamente se integrarán las siguientes capacidades:
- Solución de Ecuaciones de una Variable: Métodos de Bisección, Regla Falsa y Secante.
- Sistemas de Ecuaciones Lineales: Eliminación Gaussiana y Factorización LU.
- Interpolación y Ajuste de Curvas: Polinomios de Lagrange y Mínimos Cuadrados.
- Integración Numérica: Regla de Simpson y Trapecio.
- Exportación Profesional: Generación de reportes detallados en formatos Excel y PDF.

---

## Contribuciones e Integridad Científica
El proyecto ha sido diseñado para servir como una herramienta educativa y profesional de alta fidelidad. Cada resultado entregado por la plataforma es completamente verificable a través de su traza de procedimiento detallada, asegurando que el usuario pueda auditar cada paso matemático realizado por los algoritmos.
