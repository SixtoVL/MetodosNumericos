import React from 'react';
import type { Formulas } from '../../schemas/newton.schema';
import { MathRenderer } from '../visualizers/MathRenderer';
import styles from './FormulaDisplay.module.css';

interface FormulaDisplayProps {
  formulas: Formulas;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ formulas }) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h4>Sistema de Ecuaciones f(x) = 0</h4>
        <div className={styles.formulaBox}>
          {formulas.funciones.map((f, i) => (
            <MathRenderer key={i} math={`${f} = 0`} block />
          ))}
        </div>
      </div>
      
      <div className={styles.section}>
        <h4>Matriz Jacobiana Analítica J(x)</h4>
        <div className={styles.formulaBox}>
          <MathRenderer math={formulas.jacobiano} block />
        </div>
      </div>
    </div>
  );
};
