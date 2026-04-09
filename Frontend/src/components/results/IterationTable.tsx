import React from 'react';
import { MathRenderer } from '../visualizers/MathRenderer';
import type { Tabla } from '../../schemas/newton.schema';
import styles from './IterationTable.module.css';
import { ExportExcelButton } from './ExportExcelButton';

interface IterationTableProps {
  data: Tabla;
}

export const IterationTable: React.FC<IterationTableProps> = ({ data }) => {
  // Función para determinar si un string de cabecera debe ser renderizado como Math
  const isMathHeader = (header: string) => {
    return header.includes('\\') || header.includes('_') || header.includes('||');
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 className={styles.title} style={{ margin: 0 }}>Tabla de Iteraciones</h3>
        <ExportExcelButton data={data} fileName={`Newton_Raphson_Resultados.xlsx`} />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {data.cabecera.map((col, i) => (
                <th key={i}>
                  {isMathHeader(col) ? <MathRenderer math={col} /> : col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.filas.map((fila, i) => (
              <tr key={i}>
                {fila.map((celda, j) => (
                  <td key={j}>
                    {typeof celda === 'number' 
                      ? (Number.isInteger(celda) ? celda : celda.toLocaleString(undefined, {
                          minimumFractionDigits: 6,
                          maximumFractionDigits: 10,
                          useGrouping: false // Evitamos comas en miles para mayor claridad técnica
                        }))
                      : celda}
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
