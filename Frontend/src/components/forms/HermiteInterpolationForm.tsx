import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import type { HermiteRequest, HermitePoint } from '../../schemas/interpolation.schema';
import styles from './FixedPointForm.module.css'; // Reutilizamos estilos de formulario

interface Props {
  onSubmit: (values: HermiteRequest) => void;
  isLoading: boolean;
  initialValues?: HermiteRequest;
}

export const HermiteInterpolationForm: React.FC<Props> = ({ onSubmit, isLoading, initialValues }) => {
  const [puntos, setPuntos] = useState<HermitePoint[]>(initialValues?.puntos || [
    { x: 1, y: 2, dy: 3 },
    { x: 2, y: 5, dy: 4 }
  ]);
  const [xEval, setXEval] = useState<string>(initialValues?.x_a_evaluar?.toString() || '');

  useEffect(() => {
    if (initialValues) {
      setPuntos(initialValues.puntos);
      setXEval(initialValues.x_a_evaluar?.toString() || '');
    }
  }, [initialValues]);

  const addPunto = () => {
    const lastX = puntos.length > 0 ? puntos[puntos.length - 1].x : 0;
    setPuntos([...puntos, { x: lastX + 1, y: 0, dy: 0 }]);
  };

  const removePunto = (index: number) => {
    if (puntos.length > 2) {
      setPuntos(puntos.filter((_, i) => i !== index));
    }
  };

  const updatePunto = (index: number, field: keyof HermitePoint, value: string) => {
    const newPuntos = [...puntos];
    newPuntos[index] = { ...newPuntos[index], [field]: parseFloat(value) || 0 };
    setPuntos(newPuntos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      puntos,
      x_a_evaluar: xEval !== '' ? parseFloat(xEval) : undefined
    });
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.iconContainer}>
          <Calculator size={20} />
        </div>
        <div>
          <h3>Método de Hermite</h3>
          <p>Interpolación con Derivadas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.sectionTitle}>Puntos y Derivadas</div>
        
        <div className={styles.pointsList} style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
          {puntos.map((punto, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>x</label>
                <input
                  type="number"
                  step="any"
                  value={punto.x}
                  onChange={(e) => updatePunto(index, 'x', e.target.value)}
                  className={styles.input}
                  style={{ padding: '0.4rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>f(x)</label>
                <input
                  type="number"
                  step="any"
                  value={punto.y}
                  onChange={(e) => updatePunto(index, 'y', e.target.value)}
                  className={styles.input}
                  style={{ padding: '0.4rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>f'(x)</label>
                <input
                  type="number"
                  step="any"
                  value={punto.dy}
                  onChange={(e) => updatePunto(index, 'dy', e.target.value)}
                  className={styles.input}
                  style={{ padding: '0.4rem' }}
                />
              </div>
              <button
                type="button"
                onClick={() => removePunto(index)}
                className={styles.removeButton}
                disabled={puntos.length <= 2}
                style={{ marginTop: '1rem', color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addPunto} className={styles.addButton} style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', border: '2px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', transition: 'all 0.2s' }}>
          <Plus size={16} /> Agregar Punto
        </button>

        <div className={styles.inputGroup}>
          <label>Punto a evaluar (opcional)</label>
          <input
            type="number"
            step="any"
            placeholder="Ej: 1.5"
            value={xEval}
            onChange={(e) => setXEval(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.actions}>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading || puntos.length < 2}
          >
            {isLoading ? 'Calculando...' : 'Calcular Interpolación'}
          </button>
        </div>
      </form>
    </div>
  );
};
