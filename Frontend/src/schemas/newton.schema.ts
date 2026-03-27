// Definimos una constante dummy para evitar que el archivo se trate como un módulo vacío
export const NEWTON_SCHEMA_VERSION = '1.0.0';

export interface NewtonRequest {
  funciones: string[];
  punto_inicial: number[];
  tolerancia: number;
  iteraciones: number;
}

export interface Formulas {
  funciones: string[];
  jacobiano: string;
}

export interface Tabla {
  cabecera: string[];
  filas: (number | string)[][];
}

export interface ProcedimientoStep {
  iteracion: number;
  x_actual: number[];
  f_evaluada: number[];
  jacobiano_evaluado: number[][];
  delta_x: number[];
  nuevo_x: number[];
  error: number;
}

export interface NewtonResponse {
  raiz: number[];
  iteraciones: number;
  error_final: number;
  convergio: boolean;
  mensaje: string;
  formulas: Formulas;
  tabla: Tabla;
  procedimiento: ProcedimientoStep[];
}
