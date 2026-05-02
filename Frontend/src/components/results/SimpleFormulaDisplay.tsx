import React from 'react';
import { MathRenderer } from '../visualizers/MathRenderer';
import styles from './FormulaDisplay.module.css';

interface SimpleFormulaDisplayProps {
  formula: string;
  title?: string;
}

export const SimpleFormulaDisplay: React.FC<SimpleFormulaDisplayProps> = ({ formula, title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        {title && <h4>{title}</h4>}
        <div className={styles.formulaBox}>
          <MathRenderer math={formula} block />
        </div>
      </div>
    </div>
  );
};
