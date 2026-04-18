Documentación Técnica: Método de Punto Fijo Multivariable con Desplazamientos Sucesivos

Introducción
El módulo de Punto Fijo implementado en este sistema representa una solución avanzada para la resolución de ecuaciones no lineales y sistemas de ecuaciones multivariables. A diferencia de las implementaciones académicas simples, este motor integra capacidades de parsing simbólico, análisis de convergencia en tiempo real y una arquitectura de desplazamientos sucesivos inspirada en el método de Gauss-Seidel para maximizar la estabilidad numérica.

Arquitectura del Algoritmo
La implementación se desglosa en cuatro fases críticas de ejecución que garantizan la integridad de los resultados.

Fase 1: Normalización y Parsing Simbólico
El sistema recibe las funciones de iteración g(x) y, opcionalmente, las funciones originales f(x). Utilizando la librería SymPy, el backend realiza una limpieza de sintaxis que permite el uso de corchetes, llaves y multiplicación implícita. Las expresiones se convierten en funciones lambda de NumPy, lo que permite evaluaciones vectoriales de alto rendimiento. En esta etapa, el sistema también genera las representaciones LaTeX que se utilizarán en la interfaz de usuario para la validación visual de las fórmulas ingresadas.

Fase 2: Estrategia de Desplazamientos Sucesivos
Se ha implementado una lógica de desplazamientos sucesivos (Gauss-Seidel) en lugar de desplazamientos simultáneos (Jacobi). En sistemas multivariables, esto significa que tan pronto como se calcula el nuevo valor de una variable x_i, dicho valor se utiliza inmediatamente para calcular la variable x_(i+1) dentro de la misma iteración. Esta técnica reduce significativamente el número de iteraciones necesarias para la convergencia y aumenta la probabilidad de éxito en sistemas con una fuerte dependencia entre variables.

Fase 3: Ciclo Iterativo y Protección Numérica
El núcleo del método ejecuta las evaluaciones funcionales bajo un estricto control de errores. Se utiliza un gestor de estados de error de NumPy para capturar excepciones de desbordamiento (overflow) y operaciones inválidas. El sistema detiene automáticamente la ejecución si detecta valores que superan los límites computacionales (10^100) o si se generan valores no definidos (NaN o Infinitos). Esta protección es fundamental para evitar el colapso del servidor durante procesos de divergencia extrema.

Fase 4: Análisis de Tendencia y Diagnóstico Inteligente
Una de las funcionalidades más innovadoras es el motor de diagnóstico. Cuando el método agota el número máximo de iteraciones sin alcanzar la tolerancia deseada, el sistema analiza el historial de errores absolutos. Si el error muestra una tendencia decreciente, se informa al usuario de una convergencia lenta. Si el error aumenta de forma sostenida, se diagnostica una divergencia, sugiriendo un cambio en el despeje o en el punto inicial. Si el error fluctúa sin un patrón claro, se reporta inestabilidad u oscilación.

Estructura de Datos de Salida
El método devuelve un objeto JSON enriquecido que permite una reconstrucción total del proceso en el frontend.
1. Raíz: El último vector de valores calculado, incluso en caso de error parcial.
2. Convergió: Un booleano que indica si se alcanzó la tolerancia.
3. Mensaje: Un reporte detallado del estado final del cálculo.
4. Fórmulas: Las expresiones procesadas y convertidas a formato LaTeX.
5. Funciones GeoGebra: Cadenas de texto con sintaxis optimizada para el motor gráfico, traduciendo variables y operadores.
6. Tabla: Datos tabulares con n, valores de variables y errores.
7. Procedimiento: Un desglose detallado de cada evaluación realizada en cada paso para fines de auditoría matemática.

Reglas de Convergencia
Para que este método garantice resultados, el sistema de despejes propuesto g(x) debe cumplir idealmente con que la norma de su matriz Jacobiana sea menor a la unidad en el entorno de la solución. El sistema facilita la experimentación con diferentes despejes mediante su interfaz flexible.
