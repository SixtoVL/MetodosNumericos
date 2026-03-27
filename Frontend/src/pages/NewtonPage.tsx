import React from 'react';
import { NewtonForm } from '../components/forms/NewtonForm';
import { FormulaDisplay } from '../components/results/FormulaDisplay';
import { IterationTable } from '../components/results/IterationTable';
import { ProcedureStep } from '../components/visualizers/ProcedureStep';
import { PlotlyChart } from '../components/visualizers/PlotlyChart';
import { useNewton } from '../hooks/useNewton';
import { Loader2, AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
import styles from './NewtonPage.module.css';
import clsx from 'clsx';

export const NewtonPage: React.FC = () => {
  const mutation = useNewton();
  const { data, isPending, isError, error } = mutation;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Newton-Raphson Analítico</h1>
        <p>Resolución de sistemas de ecuaciones no lineales con cálculo de Jacobiano simbólico.</p>
      </header>

      <div className={styles.dashboardGrid}>
        <aside>
          <NewtonForm 
            onSolve={(data) => mutation.mutate(data)} 
            isPending={isPending} 
          />
          
          {isPending && (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', marginTop: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Loader2 className="animate-spin" size={32} color="#2563eb" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 500 }}>Calculando matrices simbólicas...</p>
            </div>
          )}

          {isError && (
            <div style={{ background: '#fef2f2', padding: '1.25rem', borderRadius: '12px', color: '#b91c1c', display: 'flex', gap: '0.75rem', marginTop: '1rem', border: '1px solid #fecaca' }}>
              <AlertCircle size={24} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Error de Ejecución</strong>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{error.message}</p>
              </div>
            </div>
          )}
        </aside>

        <main className={styles.mainContent}>
          {data ? (
            <>
              <div className={clsx(styles.statusBanner, data.convergio ? styles.statusSuccess : styles.statusError)}>
                {data.convergio ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                    {data.convergio ? 'Convergencia Exitosa' : 'El método no convergió'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>{data.mensaje}</p>
                </div>
              </div>

              <FormulaDisplay formulas={data.formulas} />
              
              <PlotlyChart tabla={data.tabla} dimension={data.raiz.length} />

              <IterationTable data={data.tabla} />
              
              <section>
                <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.5rem', fontWeight: 700 }}>
                  Procedimiento Paso a Paso
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.procedimiento.map((step, i) => (
                    <ProcedureStep key={i} step={step} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Calculator size={64} strokeWidth={1} />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Listo para Resolver</h3>
                <p style={{ fontSize: '0.95rem' }}>Configure el sistema en el panel izquierdo y haga clic en "Resolver".</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
