import React from 'react';
import type { ProcedimientoStep as Step } from '../../schemas/newton.schema';
import { MathRenderer } from '../visualizers/MathRenderer';
import styles from './ProcedureStep.module.css';

interface ProcedureStepProps {
  step: Step;
}

export const ProcedureStep: React.FC<ProcedureStepProps> = ({ step }) => {
  // Convertimos el jacobiano evaluado (matriz numérica) a string de LaTeX para visualización
  const matrixToLatex = (matrix: number[][]) => {
    const rows = matrix.map(row => row.map(val => val.toFixed(4)).join(' & ')).join(' \\\\ ');
    return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
  };

  const vectorToLatex = (vector: number[]) => {
    return `\\begin{bmatrix} ${vector.map(v => v.toFixed(4)).join(' \\\\ ')} \\end{bmatrix}`;
  };

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <span className={styles.badge}>Iteración {step.iteracion}</span>
      </div>
      
      <div className={styles.grid}>
        <div className={styles.mathBlock}>
          <h5>Punto Actual x⁽ᵏ⁾</h5>
          <MathRenderer math={vectorToLatex(step.x_actual)} block />
        </div>
        
        <div className={styles.mathBlock}>
          <h5>Jacobiano J(x⁽ᵏ⁾)</h5>
          <MathRenderer math={matrixToLatex(step.jacobiano_evaluado)} block />
        </div>

        <div className={styles.mathBlock}>
          <h5>Funciones F(x⁽ᵏ⁾)</h5>
          <MathRenderer math={vectorToLatex(step.f_evaluada)} block />
        </div>

        <div className={styles.mathBlock}>
          <h5>Cambio Δx</h5>
          <MathRenderer math={vectorToLatex(step.delta_x)} block />
        </div>
      </div>

      <div className={styles.footer}>
        {step.error !== undefined && (
          <p><strong>Error de iteración:</strong> {step.error.toExponential(6)}</p>
        )}
      </div>
    </div>
  );
};
