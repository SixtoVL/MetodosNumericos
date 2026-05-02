import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import type { DividedDifferencesRequest, Point } from '../../schemas/interpolation.schema';
import styles from './NewtonForm.module.css';

interface Props {
  onSubmit: (data: DividedDifferencesRequest) => void;
  isLoading: boolean;
  initialValues?: DividedDifferencesRequest;
}

export const DividedDifferencesForm: React.FC<Props> = ({ onSubmit, isLoading, initialValues }) => {
  // Permitimos que x e y sean string para poder borrarlos en el input
  const [puntos, setPuntos] = useState<(any)[]>(initialValues?.puntos || [
    { x: 1, y: 1 },
    { x: 2, y: 4 },
    { x: 4, y: 16 }
  ]);
  const [xAEvaluar, setXAEvaluar] = useState<number | string>(initialValues?.x_a_evaluar ?? 3);

  useEffect(() => {
    if (initialValues) {
      setPuntos(initialValues.puntos);
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
    newPuntos[index] = {
      ...newPuntos[index],
      [field]: value // Guardamos el string directo del input
    };
    setPuntos(newPuntos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación: No permitir campos vacíos en los puntos
    const hasEmptyFields = puntos.some(p => p.x === '' || p.y === '');
    if (hasEmptyFields) {
      alert("Por favor, completa todos los campos de los puntos.");
      return;
    }

    if (puntos.length < 2) return;

    // Convertir a números antes de enviar a la API
    const puntosProcesados = puntos.map(p => ({
      x: typeof p.x === 'string' ? parseFloat(p.x) : p.x,
      y: typeof p.y === 'string' ? parseFloat(p.y) : p.y
    }));

    onSubmit({
      puntos: puntosProcesados,
      x_a_evaluar: xAEvaluar === '' ? null : (typeof xAEvaluar === 'string' ? parseFloat(xAEvaluar) : xAEvaluar)
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}><Calculator size={20} /></div>
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
                  type="number"
                  step="any"
                  placeholder="x"
                  value={punto.x}
                  onChange={(e) => handleUpdatePoint(index, 'x', e.target.value)}
                  className={styles.mainInput}
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="y"
                  value={punto.y}
                  onChange={(e) => handleUpdatePoint(index, 'y', e.target.value)}
                  className={styles.mainInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemovePoint(index)}
                  className={styles.removeButton}
                  disabled={puntos.length <= 2}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.footerParams}>
          <div className={styles.field} style={{ marginBottom: '1.5rem' }}>
            <label>Punto a evaluar (opcional)</label>
            <input
              type="number"
              step="any"
              placeholder="Ej: 2.5"
              value={xAEvaluar}
              onChange={(e) => setXAEvaluar(e.target.value)}
              className={styles.mainInput}
            />
          </div>

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
