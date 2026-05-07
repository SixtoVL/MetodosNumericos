import React, { useState, useEffect } from 'react';
import { DividedDifferencesForm } from '../../../components/forms/DividedDifferencesForm';
import { SimpleFormulaDisplay } from '../../../components/results/SimpleFormulaDisplay';
import { InterpolationChart } from '../../../components/visualizers/InterpolationChart';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ExamplesGuide } from '../../../components/layout/ExamplesGuide';
import { MathSyntaxGuide } from '../../../components/layout/MathSyntaxGuide';
import { useDividedDifferences } from '../../../hooks/useDividedDifferences';
import { AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
import clsx from 'clsx';
import styles from '../../NewtonPage.module.css';

export const DividedDifferencesPage: React.FC = () => {
  const { mutate, data, isPending, error } = useDividedDifferences();
  const [currentParams, setCurrentParams] = useState<any>({
    puntos: [{ x: 1, y: 1 }, { x: 2, y: 4 }, { x: 4, y: 16 }],
    x_a_evaluar: 3,
    metodo: 'divididas'
  });

  // Ejecutar el cálculo inicial por defecto
  useEffect(() => {
    mutate(currentParams);
  }, []);

  const handleFormSubmit = (values: any) => {
    setCurrentParams(values);
    mutate(values);
  };

  const handleSelectExample = (values: any) => {
    setCurrentParams(values);
    mutate(values);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Interpolación de Newton</h1>
        <p>Construye el polinomio interpolante a partir de un conjunto de puntos.</p>
      </header>

      <div className={styles.dashboardGrid}>
        {/* PANEL IZQUIERDO: CONFIGURACIÓN */}
        <aside>
          <MathSyntaxGuide method="interpolation" />
          <ExamplesGuide method="interpolation" onSelect={handleSelectExample} />
          
          <DividedDifferencesForm 
            onSubmit={handleFormSubmit} 
            isLoading={isPending} 
            initialValues={currentParams}
          />
        </aside>

        {/* PANEL DERECHO: RESULTADOS */}
        <main className={styles.mainContent}>
          {/* Banner de Estado Inteligente (Error o Éxito) */}
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
                    : `Se ha construido el polinomio de Newton usando ${currentParams.metodo === 'finitas' ? 'Diferencias Finitas' : 'Diferencias Divididas'}.`}
                </p>
              </div>
            </div>
          )}

          {data ? (
            <>
              {/* 1. Tabla de Diferencias */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  {currentParams.metodo === 'finitas' ? 'Tabla de Diferencias Finitas' : 'Tabla de Diferencias Divididas'}
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem' }}>x_i</th>
                        <th style={{ padding: '0.75rem' }}>f[x_i]</th>
                        {data.tabla[0].slice(2).map((_, i) => (
                          <th key={i}>Orden {i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.tabla.map((fila, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {fila.map((valor, j) => {
                            // Lógica de resaltado inteligente:
                            let isCoefficient = false;
                            if (currentParams.metodo === 'finitas' && currentParams.direccion === 'atras') {
                              // Newton Atrás: Los coeficientes están en la diagonal inferior (último valor no nulo de cada columna j >= 1)
                              const rowIdxForCoef = data.tabla.length - j;
                              isCoefficient = (i === rowIdxForCoef && j >= 1);
                            } else {
                              // Newton Adelante o Divididas: Primera fila (i=0) para j >= 1
                              isCoefficient = (i === 0 && j >= 1);
                            }

                            return (
                              <td 
                                key={j} 
                                style={{ 
                                  padding: '0.75rem', 
                                  fontWeight: isCoefficient ? 'bold' : 'normal', 
                                  color: isCoefficient ? '#3b82f6' : (valor === null ? 'transparent' : 'inherit'),
                                  backgroundColor: isCoefficient ? '#eff6ff' : 'transparent'
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
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Paso {idx + 1}</span>
                      <p style={{ fontWeight: 500, color: '#475569', marginBottom: '1rem' }}>{paso.descripcion}</p>
                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <MathRenderer math={paso.formula} block />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Polinomio Resultante */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  Polinomio Interpolante (Forma de Newton)
                </h3>
                <SimpleFormulaDisplay formula={data.polinomio_latex} />
                
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
                  polinomioLatex={data.polinomio_latex}
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', color: '#94a3b8', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
              <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Listo para calcular</h3>
              <p style={{ fontSize: '0.95rem' }}>Introduce los puntos en el panel de la izquierda y presiona "Calcular Interpolación".</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
