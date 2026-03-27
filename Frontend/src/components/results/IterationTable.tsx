import React from 'react';
import type { Tabla } from '../../schemas/newton.schema';
import styles from './IterationTable.module.css';

interface IterationTableProps {
  data: Tabla;
}

export const IterationTable: React.FC<IterationTableProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tabla de Iteraciones</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {data.cabecera.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.filas.map((fila, i) => (
              <tr key={i}>
                {fila.map((celda, j) => (
                  <td key={j}>
                    {typeof celda === 'number' ? celda.toExponential(4) : celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
