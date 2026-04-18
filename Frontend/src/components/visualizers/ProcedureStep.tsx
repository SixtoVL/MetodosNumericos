import React from 'react';
import type { ProcedimientoStep as NewtonStep } from '../../schemas/newton.schema';
import type { ProcedimientoStep as FixedPointStep } from '../../schemas/fixed_point.schema';
import { MathRenderer } from '../visualizers/MathRenderer';
import styles from './ProcedureStep.module.css';

type Step = (NewtonStep & FixedPointStep) | any;

interface ProcedureStepProps {
  step: Step;
}

export const ProcedureStep: React.FC<ProcedureStepProps> = ({ step }) => {
  // Convertimos el jacobiano evaluado (matriz numérica) a string de LaTeX para visualización
  const matrixToLatex = (matrix?: number[][]) => {
    if (!matrix || matrix.length === 0) return '';
    const rows = matrix.map(row => row.map(val => val.toFixed(4)).join(' & ')).join(' \\\\ ');
    return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
  };

  const vectorToLatex = (vector?: number[]) => {
    if (!vector || vector.length === 0) return '';
    return `\\begin{bmatrix} ${vector.map(v => v.toFixed(4)).join(' \\\\ ')} \\end{bmatrix}`;
  };

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <span className={styles.badge}>Iteración {step.n || (step as any).iteracion}</span>
      </div>
      
      <div className={styles.grid}>
        {step.x_actual && (
          <div className={styles.mathBlock}>
            <h5>Punto Actual x⁽ᵏ⁾</h5>
            <MathRenderer math={vectorToLatex(step.x_actual)} block />
          </div>
        )}
        
        {(step as any).jacobiano_evaluado && (
          <div className={styles.mathBlock}>
            <h5>Jacobiano J(x⁽ᵏ⁾)</h5>
            <MathRenderer math={matrixToLatex((step as any).jacobiano_evaluado)} block />
          </div>
        )}

        {step.g_evaluada && (
          <div className={styles.mathBlock}>
            <h5>Evaluación g(x⁽ᵏ⁾)</h5>
            <MathRenderer math={vectorToLatex(step.g_evaluada)} block />
          </div>
        )}

        {(step as any).f_evaluada && (
          <div className={styles.mathBlock}>
            <h5>Funciones F(x⁽ᵏ⁾)</h5>
            <MathRenderer math={vectorToLatex((step as any).f_evaluada)} block />
          </div>
        )}

        {(step as any).delta_x && (
          <div className={styles.mathBlock}>
            <h5>Cambio Δx</h5>
            <MathRenderer math={vectorToLatex((step as any).delta_x)} block />
          </div>
        )}
      </div>
    </div>
  );
};
