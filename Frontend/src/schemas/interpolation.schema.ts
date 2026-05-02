export interface Point {
  x: number;
  y: number;
}

export interface DividedDifferencesRequest {
  puntos: Point[];
  x_a_evaluar?: number | null;
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
  valor_evaluado?: {
    x: number;
    y: number;
  };
}
