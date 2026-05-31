export interface Point {
  x: number;
  y: number;
}

export interface HermitePoint {
  x: number;
  y: number;
  derivadas: number[];
}

export interface DividedDifferencesRequest {
  puntos: Point[];
  x_a_evaluar?: number;
  metodo?: 'divididas' | 'finitas';
  direccion?: 'adelante' | 'atras';
  pivote?: number;
}

export interface HermiteRequest {
  // Modo Manual
  puntos?: HermitePoint[];
  // Modo Simbólico
  funcion?: string;
  x_puntos?: number[];
  ordenes?: number[];
  
  x_a_evaluar?: number;
}

export interface DividedDifferencesResponse {
  coeficientes: number[];
  tabla: (number | null)[][];
  pasos: Array<{
    orden: number;
    descripcion: string;
    formula: string;
  }>;
  polinomio_latex: string;
  polinomio_reducido_latex: string;
  puntos_x: number[];
  puntos_y: number[];
  nodos_z: number[];
  valor_evaluado?: {
    x: number;
    y: number;
  };
  curva?: Array<{x: number, y: number}>;
  tangentes?: Array<{x0: number, y0: number, x1: number, y1: number, label: string}>;
}
