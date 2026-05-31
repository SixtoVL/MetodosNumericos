import { Point } from './interpolation.schema';

export interface LeastSquaresRequest {
  puntos: Point[];
  grado: number;
  x_a_evaluar?: number;
}

export interface LeastSquaresResponse {
  coeficientes: number[];
  pasos: Array<{
    tipo: 'tabla' | 'sistema' | 'resultado';
    descripcion: string;
    columnas?: string[];
    filas?: number[][];
    totales?: number[];
    formula?: string;
  }>;
  polinomio_latex: string;
  r_squared: number;
  puntos_x: number[];
  puntos_y: number[];
  y_pred: number[];
  valor_evaluado?: {
    x: number;
    y: number;
  };
  curva?: Array<{x: number, y: number}>;
}
