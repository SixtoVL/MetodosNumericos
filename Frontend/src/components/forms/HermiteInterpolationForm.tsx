import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, ListOrdered, Braces } from 'lucide-react';
import type { HermiteRequest, HermitePoint } from '../../schemas/interpolation.schema';
import styles from './NewtonForm.module.css'; // Reutilizamos estilos con toggle
import clsx from 'clsx';

interface Props {
  onSubmit: (values: HermiteRequest) => void;
  isLoading: boolean;
  initialValues?: HermiteRequest;
}

// Interfaz interna para manejar el estado del formulario permitiendo strings vacíos
interface FormHermitePoint {
  x: number | string;
  y: number | string;
  derivadas: (number | string)[];
}

export const HermiteInterpolationForm: React.FC<Props> = ({ onSubmit, isLoading, initialValues }) => {
  // Estado para puntos (permitimos string | number para poder borrar valores en el input)
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
    const lastX = puntos.length > 0 ? (typeof puntos[puntos.length - 1].x === 'number' ? (puntos[puntos.length - 1].x as number) : parseFloat(puntos[puntos.length - 1].x as string) || 0) : 0;
    setPuntos([...puntos, { x: lastX + 1, y: 0, derivadas: [] }]);
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
      derivadas: [...newPuntos[pIndex].derivadas, 0] 
    };
    setPuntos(newPuntos);
  };

  const removeDerivada = (pIndex: number, dIndex: number) => {
    const newPuntos = [...puntos];
    if (newPuntos[pIndex].derivadas.length > 0) {
      newPuntos[pIndex].derivadas = newPuntos[pIndex].derivadas.filter((_, i) => i !== dIndex);
      setPuntos(newPuntos);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir de FormHermitePoint a HermitePoint (todos los valores a number)
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
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}>
            <Calculator size={20} />
          </div>
          <h2>Interpolación de Hermite</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <ListOrdered size={18} />
              <h3>Puntos de Datos</h3>
            </div>
            <button type="button" onClick={addPunto} className={styles.addButtonMini}>
              <Plus size={14} /> Punto
            </button>
          </div>

          <div className={styles.listContainer}>
            {puntos.map((punto, pIdx) => (
              <div key={pIdx} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div className={styles.itemRow} style={{ marginBottom: '0.75rem' }}>
                  <span className={styles.itemIndex}>P{pIdx}</span>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem' }}>x</label>
                    <input 
                      type="number" step="any" value={punto.x} 
                      onChange={(e) => updatePuntoField(pIdx, 'x', e.target.value)}
                      className={styles.mainInput}
                      required
                    />
                  </div>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem' }}>f(x)</label>
                    <input 
                      type="number" step="any" value={punto.y} 
                      onChange={(e) => updatePuntoField(pIdx, 'y', e.target.value)}
                      className={styles.mainInput}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '80px', padding: '0 0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Nodos</span>
                    <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {punto.derivadas.length + 1}
                    </div>
                  </div>
                  <button type="button" onClick={() => removePunto(pIdx)} className={styles.removeButton} disabled={puntos.length <= 1}>
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div style={{ paddingLeft: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Información adicional</span>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>(Derivadas)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => addDerivada(pIdx)} 
                      className={styles.addButtonMini} 
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                      disabled={punto.derivadas.length >= 2}
                    >
                      <Plus size={12} /> Derivada
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {punto.derivadas.length === 0 && (
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                        Solo valor de la función (1 repetición).
                      </p>
                    )}
                    {punto.derivadas.map((der, dIdx) => (
                      <div key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'white', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>
                          f{dIdx === 0 ? "'" : "''"}(x)
                        </span>
                        <input 
                          type="number" step="any" value={der} 
                          onChange={(e) => updateDerivada(pIdx, dIdx, e.target.value)}
                          style={{ width: '70px', border: 'none', fontSize: '0.85rem', outline: 'none', fontWeight: 500 }}
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
        </div>

        <div className={styles.footerParams}>
          <div className={styles.field}>
            <label>Punto a evaluar (opcional)</label>
            <input 
              type="number" step="any" value={xEval} 
              onChange={(e) => setXEval(e.target.value)}
              placeholder="Ej: 1.5"
              className={styles.mainInput}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={isLoading}
          style={{ marginTop: '1.5rem' }}
        >
          {isLoading ? 'Calculando...' : 'Calcular Hermite'}
          <Calculator size={18} />
        </button>
      </form>
    </div>
  );
};
