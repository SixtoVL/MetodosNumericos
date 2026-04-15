export const FIXED_POINT_SCHEMA_VERSION = '1.0.0';

export interface FixedPointRequest {
  g_func: string | string[];
  punto_inicial: number | number[];
  tolerancia: number;
  iteraciones: number;
}

export interface FixedPointFormulas {
  g_latex: string[];
  metodo: string;
}

export interface Tabla {
  cabecera: string[];
  filas: (number | string)[][];
}

export interface ProcedimientoStep {
  n: number;
  x_actual: number[];
  g_evaluada: number[];
  error_absoluto: number;
  error_relativo: number;
}

export interface FixedPointResponse {
  raiz: number[];
  convergio: boolean;
  mensaje: string;
  formulas: FixedPointFormulas;
  funciones_geogebra: string[];
  tabla: Tabla;
  procedimiento: ProcedimientoStep[];
}
