import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, TrendingUp } from 'lucide-react';
import type { LeastSquaresRequest } from '../../schemas/regression.schema';
import styles from './NewtonForm.module.css';
import clsx from 'clsx';

interface Props {
  onSubmit: (data: LeastSquaresRequest) => void;
  isLoading: boolean;
  initialValues?: LeastSquaresRequest;
}

export const LeastSquaresForm: React.FC<Props> = ({ onSubmit, isLoading, initialValues }) => {
  const [puntos, setPuntos] = useState<(any)[]>(initialValues?.puntos || [
    { x: 1, y: 0.5 },
    { x: 2, y: 2.5 },
    { x: 3, y: 2.0 },
    { x: 4, y: 4.0 },
    { x: 5, y: 3.5 },
    { x: 6, y: 6.0 }
  ]);
  const [grado, setGrado] = useState<number>(initialValues?.grado || 1);
  const [xAEvaluar, setXAEvaluar] = useState<number | string>(initialValues?.x_a_evaluar ?? '');

  useEffect(() => {
    if (initialValues) {
      setPuntos(initialValues.puntos);
      setGrado(initialValues.grado);
      setXAEvaluar(initialValues.x_a_evaluar ?? '');
    }
  }, [initialValues]);

  const handleAddPoint = () => {
    setPuntos([...puntos, { x: '', y: '' }]);
  };

  const handleRemovePoint = (index: number) => {
    if (puntos.length > 2) {
      setPuntos(puntos.filter((_, i) => i !== index));
    }
  };

  const handleUpdatePoint = (index: number, field: 'x' | 'y', value: string) => {
    const newPuntos = [...puntos];
    newPuntos[index] = { ...newPuntos[index], [field]: value };
    setPuntos(newPuntos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (puntos.length < (grado + 1)) return;

    const puntosProcesados = puntos.map(p => ({
      x: typeof p.x === 'string' ? parseFloat(p.x) : p.x,
      y: typeof p.y === 'string' ? parseFloat(p.y) : p.y
    }));

    onSubmit({
      puntos: puntosProcesados,
      grado,
      x_a_evaluar: xAEvaluar === '' ? undefined : (typeof xAEvaluar === 'string' ? parseFloat(xAEvaluar) : xAEvaluar),
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}><TrendingUp size={20} /></div>
          <h2>Configuración</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Plus size={18} />
              <h3>Puntos (x, y)</h3>
            </div>
            <button type="button" onClick={handleAddPoint} className={styles.addButtonMini}>
              Añadir
            </button>
          </div>

          <div className={styles.listContainer}>
            {puntos.map((punto, index) => (
              <div key={index} className={styles.itemRow}>
                <span className={styles.itemIndex}>{index}</span>
                <input
                  type="number" step="any" placeholder="x" value={punto.x}
                  onChange={(e) => handleUpdatePoint(index, 'x', e.target.value)}
                  className={styles.mainInput} required
                />
                <input
                  type="number" step="any" placeholder="y" value={punto.y}
                  onChange={(e) => handleUpdatePoint(index, 'y', e.target.value)}
                  className={styles.mainInput} required
                />
                <button
                  type="button" onClick={() => handleRemovePoint(index)}
                  className={styles.removeButton} disabled={puntos.length <= 2}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Selector de Grado */}
        <div className={styles.field} style={{ marginBottom: '1.5rem' }}>
          <label>Tipo de Ajuste (Grado)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className={clsx(styles.dirBtn, grado === 1 && styles.dirBtnActive)}
              onClick={() => setGrado(1)}
            >
              Lineal (1°)
            </button>
            <button
              type="button"
              className={clsx(styles.dirBtn, grado === 2 && styles.dirBtnActive)}
              onClick={() => setGrado(2)}
            >
              Cuadrático (2°)
            </button>
          </div>
        </div>

        <div className={styles.footerParams}>
          <div className={styles.field} style={{ marginBottom: '1.5rem' }}>
            <label>Punto a evaluar (opcional)</label>
            <input
              type="number" step="any" placeholder="Ej: 7.5"
              value={xAEvaluar}
              onChange={(e) => setXAEvaluar(e.target.value)}
              className={styles.mainInput}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading || puntos.length < (grado + 1)}
          >
            {isLoading ? 'Calculando...' : 'Calcular Ajuste'}
          </button>
        </div>
      </form>
    </div>
  );
};
