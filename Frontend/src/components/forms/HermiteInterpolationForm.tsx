import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, ListOrdered } from 'lucide-react';
import type { HermiteRequest, HermitePoint } from '../../schemas/interpolation.schema';
import styles from './NewtonForm.module.css';
import clsx from 'clsx';

interface Props {
  onSubmit: (values: HermiteRequest) => void;
  isLoading: boolean;
  initialValues?: HermiteRequest;
}

interface FormHermitePoint {
  x: number | string;
  y: number | string;
  derivadas: (number | string)[];
}

export const HermiteInterpolationForm: React.FC<Props> = ({ onSubmit, isLoading, initialValues }) => {
  const [puntos, setPuntos] = useState<FormHermitePoint[]>(
    initialValues?.puntos?.map(p => ({
      x: p.x,
      y: p.y,
      derivadas: [...p.derivadas]
    })) || [
      { x: 0.8, y: 0.22363362, derivadas: [2.1691753] },
      { x: 1.0, y: 0.65809197, derivadas: [2.0466965] }
    ]
  );
  
  const [xEval, setXEval] = useState<string>(initialValues?.x_a_evaluar?.toString() || '');

  useEffect(() => {
    if (initialValues && initialValues.puntos) {
      setPuntos(initialValues.puntos.map(p => ({
        x: p.x,
        y: p.y,
        derivadas: [...p.derivadas]
      })));
      setXEval(initialValues.x_a_evaluar?.toString() || '');
    }
  }, [initialValues]);

  const addPunto = () => {
    setPuntos([...puntos, { x: '', y: '', derivadas: [] }]);
  };

  const removePunto = (index: number) => {
    if (puntos.length > 1) {
      setPuntos(puntos.filter((_, i) => i !== index));
    }
  };

  const updatePuntoField = (index: number, field: 'x' | 'y', value: string) => {
    const newPuntos = [...puntos];
    newPuntos[index] = { ...newPuntos[index], [field]: value };
    setPuntos(newPuntos);
  };

  const updateDerivada = (pIndex: number, dIndex: number, value: string) => {
    const newPuntos = [...puntos];
    const newDerivadas = [...newPuntos[pIndex].derivadas];
    newDerivadas[dIndex] = value;
    newPuntos[pIndex] = { ...newPuntos[pIndex], derivadas: newDerivadas };
    setPuntos(newPuntos);
  };

  const addDerivada = (pIndex: number) => {
    const newPuntos = [...puntos];
    newPuntos[pIndex] = { 
      ...newPuntos[pIndex], 
      derivadas: [...newPuntos[pIndex].derivadas, ''] 
    };
    setPuntos(newPuntos);
  };

  const removeDerivada = (pIndex: number, dIndex: number) => {
    const newPuntos = [...puntos];
    newPuntos[pIndex].derivadas = newPuntos[pIndex].derivadas.filter((_, i) => i !== dIndex);
    setPuntos(newPuntos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const puntosProcesados: HermitePoint[] = puntos.map(p => ({
      x: typeof p.x === 'string' ? parseFloat(p.x) : p.x,
      y: typeof p.y === 'string' ? parseFloat(p.y) : p.y,
      derivadas: p.derivadas.map(d => typeof d === 'string' ? parseFloat(d) : d)
    }));

    onSubmit({
      puntos: puntosProcesados,
      x_a_evaluar: xEval !== '' ? parseFloat(xEval) : undefined
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}>
            <Calculator size={20} />
          </div>
          <h2>Configuración Hermite</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <ListOrdered size={18} />
              <h3>Puntos y Derivadas</h3>
            </div>
            <button type="button" onClick={addPunto} className={styles.addButtonMini}>
              Añadir Punto
            </button>
          </div>

          <div className={styles.listContainer}>
            {puntos.map((punto, pIdx) => (
              <div key={pIdx} className={styles.hermitePointCard} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                <div className={styles.itemRow} style={{ marginBottom: '0.75rem', gap: '0.75rem' }}>
                  <span className={styles.itemIndex}>{pIdx}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
                    <input 
                      type="number" step="any" placeholder="x" value={punto.x} 
                      onChange={(e) => updatePuntoField(pIdx, 'x', e.target.value)}
                      className={styles.mainInput}
                      required
                    />
                    <input 
                      type="number" step="any" placeholder="f(x)" value={punto.y} 
                      onChange={(e) => updatePuntoField(pIdx, 'y', e.target.value)}
                      className={styles.mainInput}
                      required
                    />
                  </div>
                  <button type="button" onClick={() => removePunto(pIdx)} className={styles.removeButton} disabled={puntos.length <= 1}>
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div style={{ marginLeft: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Derivadas en x_{pIdx}</span>
                    <button 
                      type="button" 
                      onClick={() => addDerivada(pIdx)} 
                      className={styles.addButtonMini}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                    >
                      + Derivada
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {punto.derivadas.length === 0 && (
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>Sin derivadas adicionales</span>
                    )}
                    {punto.derivadas.map((der, dIdx) => (
                      <div key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'white', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6' }}>f{Array(dIdx + 1).fill("'").join('')}</span>
                        <input 
                          type="number" step="any" value={der} 
                          onChange={(e) => updateDerivada(pIdx, dIdx, e.target.value)}
                          style={{ width: '60px', border: 'none', fontSize: '0.8rem', outline: 'none', fontWeight: 500 }}
                          required
                        />
                        <button type="button" onClick={() => removeDerivada(pIdx, dIdx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.footerParams}>
          <div className={styles.field} style={{ marginBottom: '1.5rem' }}>
            <label>Punto a evaluar (opcional)</label>
            <input 
              type="number" step="any" value={xEval} 
              onChange={(e) => setXEval(e.target.value)}
              placeholder="Ej: 1.5"
              className={styles.mainInput}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? 'Calculando...' : 'Calcular Hermite'}
          </button>
        </div>
      </form>
    </div>
  );
};
