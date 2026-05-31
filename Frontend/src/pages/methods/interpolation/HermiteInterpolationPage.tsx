import React from 'react';
import { HermiteInterpolationForm } from '../../../components/forms/HermiteInterpolationForm';
import { SimpleFormulaDisplay } from '../../../components/results/SimpleFormulaDisplay';
import { InterpolationChart } from '../../../components/visualizers/InterpolationChart';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ExamplesGuide } from '../../../components/layout/ExamplesGuide';
import { HermiteQuickGuide } from '../../../components/layout/HermiteQuickGuide';
import { useHermiteInterpolation } from '../../../hooks/useHermiteInterpolation';
import { ExportExcelButton } from '../../../components/results/ExportExcelButton';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import styles from '../../NewtonPage.module.css';

export const HermiteInterpolationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { mutate, data, isPending, error, formValues } = useHermiteInterpolation();

  const handleFormSubmit = (values: any) => {
    mutate(values);
  };

  const handleSelectExample = (values: any) => {
    queryClient.setQueryData(['hermite-form-values'], values);
  };

  const initialValues = formValues || {
    puntos: [
      { x: 0.8, y: 0.22363362, derivadas: [2.1691753] },
      { x: 1.0, y: 0.65809197, derivadas: [2.0466965] }
    ],
    x_a_evaluar: 0.9
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Interpolación de Hermite</h1>
        <p>Construye el polinomio interpolante que respeta tanto los puntos como sus derivadas de cualquier orden.</p>
      </header>

      <div className={styles.dashboardGrid}>
        <aside>
          <HermiteQuickGuide />
          <ExamplesGuide method="hermite" onSelect={handleSelectExample} />
          
          <HermiteInterpolationForm 
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
                  {error ? 'Cálculo Detenido' : 'Interpolación Exitosa'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
                  {error 
                    ? ((error as any)?.response?.data?.detail || error.message)
                    : `Se ha construido el polinomio de Hermite de grado ${data.coeficientes.length - 1}.`}
                </p>
              </div>
            </div>
          )}

          {data ? (
            <>
              {/* 1. Tabla de Hermite (Nodos Expandidos) */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    Tabla de Hermite (Nodos Expandidos)
                  </h3>
                  <ExportExcelButton 
                    data={{
                      cabecera: ['zi', 'f[zi]', ...data.tabla[0].slice(2).map((_, i) => `Orden ${i + 1}`)],
                      filas: data.tabla.map(fila => fila.map(v => v === null ? '' : v))
                    }}
                    fileName="tabla_hermite.xlsx"
                  />
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem' }}>z_i</th>
                        <th style={{ padding: '0.75rem' }}>f[z_i]</th>
                        {data.tabla[0].slice(2).map((_, i) => (
                          <th key={i} style={{ padding: '0.75rem' }}>Orden {i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.tabla.map((fila, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {fila.map((valor, j) => {
                            const isCoefficient = (i === 0 && j >= 1);
                            return (
                              <td 
                                key={j} 
                                style={{ 
                                  padding: '0.75rem', 
                                  fontWeight: isCoefficient ? 'bold' : 'normal', 
                                  color: isCoefficient ? '#3b82f6' : (valor === null ? 'transparent' : 'inherit'),
                                  backgroundColor: isCoefficient ? '#eff6ff' : 'transparent',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {valor !== null ? (typeof valor === 'number' ? valor.toFixed(4) : valor) : ''}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Procedimiento */}
              <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.5rem', fontWeight: 700 }}>
                  Procedimiento Matemático
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.pasos.map((paso, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Paso {idx + 1}</span>
                      <p style={{ fontWeight: 500, color: '#475569', marginBottom: '1rem' }}>{paso.descripcion}</p>
                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                        <MathRenderer math={paso.formula} block />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Polinomio */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  Polinomio de Hermite (Forma de Newton)
                </h3>
                <SimpleFormulaDisplay formula={data.polinomio_latex} />

                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginTop: '1.5rem', marginBottom: '1rem' }}>
                  Polinomio Reducido
                </h3>
                <SimpleFormulaDisplay formula={data.polinomio_reducido_latex} />
                
                {data.valor_evaluado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 600, color: '#166534', marginBottom: '0.25rem' }}>Punto Evaluado</div>
                    <MathRenderer math={`P(${data.valor_evaluado.x}) = ${data.valor_evaluado.y.toFixed(6)}`} />
                  </div>
                )}
              </div>

              {/* 4. Gráfica */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  Representación Gráfica
                </h3>
                <InterpolationChart 
                  puntosX={data.puntos_x}
                  puntosY={data.puntos_y}
                  polinomioLatex={data.polinomio_reducido_latex.replace('P(x) = ', '')}
                  curva={data.curva}
                  tangentes={data.tangentes}
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', color: '#94a3b8', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🖋️</div>
              <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Listo para calcular Hermite</h3>
              <p style={{ fontSize: '0.95rem' }}>Introduce puntos y sus derivadas para ver la magia de la suavidad.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
