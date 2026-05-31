import React from 'react';
import { LeastSquaresForm } from '../../../components/forms/LeastSquaresForm';
import { SimpleFormulaDisplay } from '../../../components/results/SimpleFormulaDisplay';
import { InterpolationChart } from '../../../components/visualizers/InterpolationChart';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { useLeastSquares } from '../../../hooks/useLeastSquares';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import styles from '../../NewtonPage.module.css';

export const LeastSquaresPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { mutate, data, isPending, error, formValues } = useLeastSquares();

  const handleFormSubmit = (values: any) => {
    mutate(values);
  };

  const initialValues = formValues || {
    puntos: [
      { x: 1.0, y: 1.84 },
      { x: 1.1, y: 1.96 },
      { x: 1.3, y: 2.21 },
      { x: 1.5, y: 2.45 },
      { x: 1.9, y: 2.94 },
      { x: 2.1, y: 3.18 }
    ],
    grado: 1
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Mínimos Cuadrados</h1>
        <p>Encuentra la función que mejor se ajusta a un conjunto de puntos mediante regresión polinomial.</p>
      </header>

      <div className={styles.dashboardGrid}>
        <aside>
          <LeastSquaresForm 
            onSubmit={handleFormSubmit} 
            isLoading={isPending} 
            initialValues={initialValues}
          />
        </aside>

        <main className={styles.mainContent}>
          {(error || data) && (
            <div className={clsx(
              styles.statusBanner,
              error ? styles.statusWarning : styles.statusSuccess
            )}>
              {error ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                  {error ? 'Cálculo Detenido' : 'Ajuste Exitoso'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
                  {error 
                    ? ((error as any)?.response?.data?.detail || error.message)
                    : `Se ha calculado la regresión de grado ${initialValues.grado} con éxito.`}
                </p>
              </div>
            </div>
          )}

          {data ? (
            <>
              {/* 1. Procedimiento - Tabla de Sumatorias */}
              <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.5rem', fontWeight: 700 }}>
                  Procedimiento Matemático
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.pasos.map((paso, idx) => {
                    if (paso.tipo === 'tabla') {
                      return (
                        <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                           <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>{paso.descripcion}</span>
                           <div style={{ overflowX: 'auto' }}>
                             <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                               <thead>
                                 <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                   {paso.columnas?.map((col, ci) => (
                                     <th key={ci} style={{ padding: '0.75rem' }}><MathRenderer math={col} /></th>
                                   ))}
                                 </tr>
                               </thead>
                               <tbody>
                                 {paso.filas?.map((fila, fi) => (
                                   <tr key={fi} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                     {fila.map((val, vi) => (
                                       <td key={vi} style={{ padding: '0.75rem' }}>{val.toFixed(4)}</td>
                                     ))}
                                   </tr>
                                 ))}
                                 <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                                   {paso.totales?.map((tot, ti) => (
                                     <td key={ti} style={{ padding: '0.75rem' }}>Σ = {tot.toFixed(4)}</td>
                                   ))}
                                 </tr>
                               </tbody>
                             </table>
                           </div>
                        </div>
                      );
                    }
                    if (paso.tipo === 'sistema' || paso.tipo === 'resultado') {
                      return (
                        <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                           <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>{paso.descripcion}</span>
                           <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                             <MathRenderer math={paso.formula || ''} block />
                           </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </section>

              {/* 2. Resultados Finales */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  Función de Ajuste
                </h3>
                <SimpleFormulaDisplay formula={data.polinomio_latex} />
                
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Coeficiente de Determinación (R²)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{data.r_squared.toFixed(6)}</div>
                  </div>
                </div>

                {data.valor_evaluado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 600, color: '#166534', marginBottom: '0.25rem' }}>Punto Evaluado</div>
                    <MathRenderer math={`f(${data.valor_evaluado.x}) = ${data.valor_evaluado.y.toFixed(6)}`} />
                  </div>
                )}
              </div>

              {/* 3. Gráfica */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  Ajuste Curvilíneo
                </h3>
                <InterpolationChart 
                  puntosX={data.puntos_x}
                  puntosY={data.puntos_y}
                  polinomioLatex={data.polinomio_latex.replace('f(x) = ', '')}
                  curva={data.curva}
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', color: '#94a3b8', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📉</div>
              <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Listo para el ajuste</h3>
              <p style={{ fontSize: '0.95rem' }}>Introduce los datos experimentales para calcular la mejor aproximación.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
