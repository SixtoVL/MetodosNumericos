## Backend: Motor de Cálculo Numérico

### Descripción General

El backend de este proyecto ha sido desarrollado con **FastAPI** sobre **Python 3**, y está concebido como un motor de cálculo especializado en la resolución de sistemas de ecuaciones no lineales. Su propósito principal es ejecutar algoritmos numéricos de alta precisión de forma asíncrona y eficiente, desacoplando completamente la lógica matemática del frontend.

El sistema recibe estructuras de datos que representan sistemas de ecuaciones, procesa dichas entradas mediante métodos numéricos avanzados y devuelve una respuesta estructurada que permite una visualización detallada e interactiva en la interfaz de usuario.

---

### Arquitectura de la API y Flujo de Peticiones

La arquitectura sigue un enfoque desacoplado en tres capas bien definidas, lo que permite mantener una separación clara de responsabilidades:

#### 1. Capa de Rutas (Routes)
Define los endpoints HTTP (principalmente `POST`) correspondientes a los métodos implementados, como Newton y Punto Fijo. En esta capa se valida que el cuerpo de cada petición cumpla estrictamente con los esquemas definidos mediante **Pydantic**, garantizando integridad desde el punto de entrada.

#### 2. Capa de Controladores (Controllers)
Actúa como intermediaria entre las rutas y la lógica de negocio. Aquí se orquesta el flujo completo de ejecución, incluyendo la implementación de un sistema de logging detallado que registra tanto el JSON de entrada como el de salida en un formato legible. Además, centraliza el manejo de errores de alto nivel, asegurando que el servidor siempre genere una respuesta válida.

#### 3. Capa de Métodos (Methods)
Contiene la lógica matemática pura. Esta capa está organizada en submódulos especializados por algoritmo, lo que permite mantener implementaciones limpias, reutilizables y fácilmente extensibles para nuevos métodos numéricos.

---

### Sistema de Logging y Depuración

Se ha implementado un sistema de trazabilidad utilizando la librería estándar `logging` de Python, con el objetivo de facilitar la depuración y auditoría de cálculos.

Cada petición genera un registro detallado en la terminal del servidor que incluye:

- El JSON de entrada completo, formateado con indentación para mejorar su legibilidad  
- Indicadores del inicio del procesamiento simbólico  
- Advertencias matemáticas en caso de detectar condiciones como divisiones por cero o desbordamientos durante iteraciones específicas  
- El JSON de salida final, lo que permite verificar la consistencia y exactitud de los resultados antes de ser enviados al frontend  

Este enfoque permite inspeccionar el comportamiento interno del sistema sin necesidad de instrumentación adicional.

---

### Estrategia de Robustez y Manejo de Errores

El backend ha sido diseñado para operar de forma resiliente ante escenarios numéricos complejos o inestables, evitando fallos abruptos del sistema.

#### Manejo de Resultados Parciales
Cuando un método numérico encuentra una condición crítica (por ejemplo, divergencia) en una iteración `N`, el sistema no interrumpe la ejecución mediante una excepción no controlada. En su lugar, captura el estado del cálculo y construye una respuesta que incluye todas las iteraciones exitosas previas (desde `1` hasta `N-1`), junto con un mensaje de error descriptivo.

Esto permite que el frontend represente el progreso del algoritmo hasta el punto de fallo, aportando valor diagnóstico al usuario.

#### Protección de Memoria y Serialización
Para evitar errores del tipo `Internal Server Error (500)` derivados de valores no serializables como infinito o `NaN`, el sistema establece un umbral de seguridad. Cualquier cálculo que genere valores con magnitud absoluta superior a `10^100` es interrumpido de forma controlada.

Con esta restricción se garantiza que todas las respuestas generadas sean compatibles con el formato JSON y no comprometan la estabilidad del servidor.

---

### Tecnologías Utilizadas

- **FastAPI**  
  Framework web de alto rendimiento, orientado a la construcción de APIs modernas y eficientes  

- **SymPy**  
  Motor de álgebra simbólica utilizado para el parsing de expresiones matemáticas y la diferenciación automática  

- **NumPy**  
  Librería optimizada para computación numérica y operaciones de álgebra lineal sobre estructuras vectoriales  

- **Pydantic**  
  Sistema de validación de datos basado en tipos, utilizado para definir esquemas robustos en las entradas y salidas de la API  