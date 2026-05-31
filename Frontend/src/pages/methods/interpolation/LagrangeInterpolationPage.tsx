import React from 'react';
import { LagrangeForm } from '../../../components/forms/LagrangeForm';
import { SimpleFormulaDisplay } from '../../../components/results/SimpleFormulaDisplay';
import { InterpolationChart } from '../../../components/visualizers/InterpolationChart';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ExamplesGuide } from '../../../components/layout/ExamplesGuide';
import { MathSyntaxGuide } from '../../../components/layout/MathSyntaxGuide';
import { useLagrangeInterpolation } from '../../../hooks/useLagrangeInterpolation';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import styles from '../../NewtonPage.module.css';

export const LagrangeInterpolationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { mutate, data, isPending, error, formValues } = useLagrangeInterpolation();

  const handleFormSubmit = (values: any) => {
    mutate(values);
  };

  const handleSelectExample = (values: any) => {
    queryClient.setQueryData(['lagrange-form-values'], values);
  };

  const initialValues = formValues || {
    puntos: [
      { x: 8.1, y: 16.94410 },
      { x: 8.3, y: 17.56492 },
      { x: 8.6, y: 18.50515 },
      { x: 8.7, y: 18.82091 }
    ],
    x_a_evaluar: 8.4
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Interpolación de Lagrange</h1>
        <p>Construye el polinomio interpolante usando el método de Lagrange.</p>
      </header>

      <div className={styles.dashboardGrid}>
        <aside>
          <MathSyntaxGuide method="interpolation" />
          <ExamplesGuide method="interpolation" onSelect={handleSelectExample} />
          
          <LagrangeForm 
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
                    : `Se ha construido el polinomio de Lagrange correctamente.`}
                </p>
              </div>
            </div>
          )}

          {data ? (
            <>
              {/* 1. Procedimiento */}
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

              {/* 2. Polinomio Resultante */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  Polinomio Interpolante (Forma de Lagrange)
                </h3>
                <SimpleFormulaDisplay formula={data.polinomio_latex} />

                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginTop: '1.5rem', marginBottom: '1rem' }}>
                  Polinomio Reducido (Simplificado)
                </h3>
                <SimpleFormulaDisplay formula={data.polinomio_reducido_latex} />
                
                {data.valor_evaluado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 600, color: '#166534', marginBottom: '0.25rem' }}>Punto Evaluado</div>
                    <MathRenderer math={`P(${data.valor_evaluado.x}) = ${data.valor_evaluado.y.toFixed(6)}`} />
                  </div>
                )}
              </div>

              {/* 3. Gráfica */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                  Representación Gráfica
                </h3>
                <InterpolationChart 
                  puntosX={data.puntos_x}
                  puntosY={data.puntos_y}
                  polinomioLatex={data.polinomio_reducido_latex}
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', color: '#94a3b8', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
              <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Listo para calcular</h3>
              <p style={{ fontSize: '0.95rem' }}>Introduce los puntos en el panel de la izquierda y presiona "Calcular Lagrange".</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
