# Métodos Numéricos UI (React + TypeScript)

Esta es la interfaz de usuario moderna y profesional para el sistema de resolución de sistemas de ecuaciones no lineales mediante el **Método de Newton-Raphson Analítico**. 

La aplicación funciona como un **Dashboard Científico**, integrando herramientas de renderizado matemático y visualización de datos en tiempo real.

---

## 🚀 Tecnologías Principales (Tech Stack)

Para garantizar la precisión científica y una experiencia de usuario fluida, se ha seleccionado el siguiente stack:

-   **React 18 + Vite**: Framework base con compilación ultra rápida.
-   **TypeScript**: Tipado estricto para asegurar la integridad de los datos matemáticos.
-   **TanStack Query (React Query)**: Gestión de estado asíncrono y comunicación eficiente con el Backend.
-   **KaTeX (react-katex)**: Motor de renderizado de alto rendimiento para fórmulas LaTeX generadas por el servidor.
-   **Plotly.js (react-plotly.js)**: Librería líder en gráficos científicos para visualizar trayectorias de convergencia y raíces.
-   **Lucide React**: Set de iconos minimalistas para la interfaz.
-   **CSS Modules**: Estilos encapsulados para mantener la modularidad y limpieza visual.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura modular similar a la del Backend para facilitar su mantenimiento y escalabilidad:

```text
Frontend/src/
├── api/            # Configuración de Axios y Servicios (postNewton)
├── components/     # Componentes de UI (Formularios, Tablas, Visualizadores)
│   ├── forms/      # Formularios dinámicos para n-funciones
│   ├── results/    # Renderizado de tablas y fórmulas analíticas
│   └── visualizers/# Gráficos de Plotly y Steppers de procedimiento
├── hooks/          # Custom Hooks (useNewton) para lógica de negocio
├── pages/          # Páginas principales (NewtonPage)
├── schemas/        # Definiciones de tipos e interfaces de TypeScript
└── styles/         # Estilos globales y variables de diseño
```

---

## ✨ Funcionalidades Clave

1.  **Formulario Dinámico**: Permite agregar dinámicamente $n$ funciones e incógnitas. El sistema valida automáticamente que el número de funciones coincida con el número de puntos iniciales.
2.  **Visualizador de Fórmulas Analíticas**: Renderiza la matriz Jacobiana simbólica calculada por el Backend en tiempo real.
3.  **Gráfico de Trayectoria**: Visualización interactiva en 1D (convergencia) y 2D (trayectoria en el plano $x_1$ vs $x_2$) con resaltado de la raíz encontrada.
4.  **Panel de Procedimiento Paso a Paso**: Desglose detallado de cada iteración, mostrando la evaluación numérica de la matriz $J$ y el vector $F$.
5.  **Indicadores de Estado**: Banners informativos que indican si el método convergió, el error final y mensajes detallados del servidor.

---

## ⚙️ Configuración y Ejecución

1.  **Instalar dependencias**:
    ```bash
    cd Frontend
    npm install
    ```

2.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la raíz de la carpeta `Frontend`:
    ```env
    VITE_API_URL=http://localhost:8088
    ```

3.  **Iniciar Servidor de Desarrollo**:
    ```bash
    npm run dev
    ```

---

## 📡 Integración con el Backend

El Frontend consume el endpoint `POST /methods/newton` enviando un objeto `NewtonRequest` y recibiendo un `NewtonResponse` que incluye:
-   `formulas`: Strings en formato LaTeX.
-   `tabla`: Matriz de datos para el historial de iteraciones.
-   `procedimiento`: Lista de objetos con el detalle matemático de cada paso.
