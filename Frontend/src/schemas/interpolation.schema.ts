export interface Point {
  x: number;
  y: number;
}

export interface DividedDifferencesRequest {
  puntos: Point[];
  x_a_evaluar?: number | null;
  metodo?: 'divididas' | 'finitas';
  direccion?: 'adelante' | 'atras';
  pivote?: number;
}

export interface DividedDifferencesResponse {
  coeficientes: number[];
  tabla: number[][];
  pasos: Array<{
    orden: number;
    descripcion: string;
    formula: string;
  }>;
  polinomio_latex: string;
  puntos_x: number[];
  puntos_y: number[];
  nodos_x: number[];
  pivote_usado?: number;
  valor_evaluado?: {
    x: number;
    y: number;
  };
}
