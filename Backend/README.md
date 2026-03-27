# Métodos Numéricos Backend (FastAPI + SymPy)

Este es un backend robusto y modular desarrollado con **FastAPI** para resolver problemas de métodos numéricos. Actualmente, cuenta con una implementación avanzada del método de **Newton-Raphson Analítico**, capaz de resolver tanto funciones de una variable como sistemas de ecuaciones no lineales de $n$-dimensiones.

## 🚀 Características Principales

-   **Arquitectura Modular**: Estructura basada en patrones de diseño (Routes, Controllers, Methods, Helpers) para facilitar la escalabilidad.
-   **Cálculo Analítico (SymPy)**: Utiliza motores de cálculo simbólico para obtener derivadas y matrices Jacobianas exactas, eliminando errores de aproximación numérica.
-   **Soporte Multivariable**: Resuelve sistemas de $n$ ecuaciones con $n$ incógnitas de forma automática.
-   **Salida Enriquecida para UI**: 
    -   Genera tablas de iteraciones clásicas.
    -   Proporciona el **procedimiento detallado** paso a paso (evaluación de J y F).
    -   Exporta fórmulas matemáticas en formato **LaTeX** para renderización profesional en el frontend.
-   **Validación de Datos**: Uso de Pydantic para asegurar que las entradas de la API sean correctas.

---

## 🛠️ Tecnologías Utilizadas

-   **Python 3.10+**
-   **FastAPI**: Framework web de alto rendimiento.
-   **SymPy**: Librería para matemáticas simbólicas (Parsing y Jacobianas).
-   **NumPy**: Operaciones vectoriales y resolución de sistemas lineales.
-   **Uvicorn**: Servidor ASGI para despliegue.

---

## 📂 Estructura del Proyecto

```text
Backend/
├── main.py                 # Punto de entrada de la aplicación
├── server.py               # Configuración del servidor Uvicorn
├── routes/                 # Definición de rutas (Endpoints)
├── controllers/            # Lógica de orquestación de peticiones
├── methods/                # Implementación de algoritmos numéricos
├── helpers/                # Utilidades (Parser matemático, Jacobiano)
├── schemas/                # Modelos de validación (Pydantic)
├── requirements.txt        # Dependencias del proyecto
└── newton.md               # Documentación técnica detallada del algoritmo
```

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para poner en marcha el servidor localmente:

1.  **Clonar el repositorio:**
    ```cmd
    git clone <tu-url-del-repo>
    cd Backend
    ```

2.  **Crear y activar el entorno virtual:**
    ```cmd
    python -m venv venv
    venv\Scripts\activate  # Windows
    source venv/bin/activate  # Linux/Mac
    ```

3.  **Instalar dependencias:**
    ```cmd
    pip install -r requirements.txt
    ```

4.  **Iniciar el servidor:**
    ```cmd
    python server.py
    ```
    *El servidor estará disponible en `http://127.0.0.1:8088` (o el puerto configurado).*

---

## 📡 Documentación de la API

### Newton-Raphson Analítico
**Endpoint:** `POST /methods/newton`

**Cuerpo de la Petición (JSON):**
```json
{
  "funciones": ["x_1^2 + x_2^2 - 4", "exp(x_1) + x_2 - 1"],
  "punto_inicial": [1.0, -1.0],
  "tolerancia": 0.00001,
  "iteraciones": 20
}
```

**Respuesta (JSON):**
La respuesta incluye la raíz encontrada, el estado de convergencia, las fórmulas en LaTeX y el objeto `procedimiento` con cada paso del cálculo.

---

## 📖 Documentación Adicional
Para detalles profundos sobre el funcionamiento matemático y el flujo interno del algoritmo de Newton, consulta el archivo [newton.md](./newton.md).
