import React, { useState, useEffect } from 'react';
import type { FixedPointRequest } from '../../schemas/fixed_point.schema';
import styles from './FixedPointForm.module.css';
import { Plus, Trash2, Play, Calculator, Variable, Sigma, AlertTriangle } from 'lucide-react';

interface FixedPointFormProps {
  onSolve: (data: FixedPointRequest) => void;
  isPending: boolean;
  initialValues?: FixedPointRequest;
}

export const FixedPointForm: React.FC<FixedPointFormProps> = ({ onSolve, isPending, initialValues }) => {
  const [originalFuncs, setOriginalFuncs] = useState<string[]>(
    initialValues?.funciones_originales || ['x_1**2 + x_2**2 - x_1', 'x_1**2 - x_2**2 - x_2']
  );

  const [gFuncs, setGFuncs] = useState<string[]>(
    Array.isArray(initialValues?.g_func) 
      ? initialValues.g_func 
      : typeof initialValues?.g_func === 'string' 
        ? [initialValues.g_func] 
        : ['sqrt(x_2 + x_2**2)', 'sqrt(x_1 - x_1**2)']
  );

  const [puntoInicial, setPuntoInicial] = useState<number[]>(
    Array.isArray(initialValues?.punto_inicial)
      ? initialValues.punto_inicial
      : typeof initialValues?.punto_inicial === 'number'
        ? [initialValues.punto_inicial]
        : [1, 0.5]
  );
  
  const [tolerancia, setTolerancia] = useState<number>(initialValues?.tolerancia || 0.0001);
  const [iteraciones, setIteraciones] = useState<number>(initialValues?.iteraciones || 20);

  useEffect(() => {
    if (initialValues) {
      setOriginalFuncs(initialValues.funciones_originales || Array(gFuncs.length).fill(''));
      setGFuncs(Array.isArray(initialValues.g_func) ? initialValues.g_func : [initialValues.g_func as string]);
      setPuntoInicial(Array.isArray(initialValues.punto_inicial) ? initialValues.punto_inicial : [initialValues.punto_inicial as number]);
      setTolerancia(initialValues.tolerancia);
      setIteraciones(initialValues.iteraciones);
    }
  }, [initialValues]);

  // Sincronizar originalFuncs y gFuncs
  useEffect(() => {
    if (originalFuncs.length !== gFuncs.length) {
      if (originalFuncs.length < gFuncs.length) {
        setOriginalFuncs([...originalFuncs, ...Array(gFuncs.length - originalFuncs.length).fill('')]);
      } else {
        setOriginalFuncs(originalFuncs.slice(0, gFuncs.length));
      }
    }
  }, [gFuncs.length]);

  const handleAddFunction = () => {
    setGFuncs([...gFuncs, '']);
    setOriginalFuncs([...originalFuncs, '']);
  };

  const handleRemoveFunction = (index: number) => {
    if (gFuncs.length > 1) {
      setGFuncs(gFuncs.filter((_, i) => i !== index));
      setOriginalFuncs(originalFuncs.filter((_, i) => i !== index));
    }
  };

  const handleAddVariable = () => setPuntoInicial([...puntoInicial, 0]);
  const handleRemoveVariable = (index: number) => {
    if (puntoInicial.length > 1) setPuntoInicial(puntoInicial.filter((_, i) => i !== index));
  };

  const isSquareSystem = gFuncs.length === puntoInicial.length;
  
  const areFuncsFilled = 
    gFuncs.every(f => f.trim() !== '') && 
    originalFuncs.every(f => f.trim() !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSquareSystem || !areFuncsFilled) return;
    
    onSolve({
      g_func: gFuncs.length === 1 ? gFuncs[0] : gFuncs,
      punto_inicial: puntoInicial.length === 1 ? puntoInicial[0] : puntoInicial,
      tolerancia,
      iteraciones,
      funciones_originales: originalFuncs
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}><Calculator size={20} /></div>
          <h2>Punto Fijo: x = g(x)</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* SECCIÓN 1: SISTEMA ORIGINAL */}
        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <AlertTriangle size={18} color="#2563eb" />
              <h3>Sistema Original f(x) = 0</h3>
            </div>
            <button type="button" onClick={handleAddFunction} className={styles.addButtonMini}>
              <Plus size={14} /> Añadir
            </button>
          </div>
          <div className={styles.listContainer}>
            {originalFuncs.map((func, index) => (
              <div key={index} className={styles.itemRow}>
                <span className={styles.itemIndex}>f_{index + 1}</span>
                <input
                  type="text"
                  value={func}
                  onChange={(e) => {
                    const newFuncs = [...originalFuncs];
                    newFuncs[index] = e.target.value;
                    setOriginalFuncs(newFuncs);
                  }}
                  placeholder="Ej: x_1**2 + x_2**2 - 5"
                  className={styles.mainInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFunction(index)}
                  className={styles.removeButton}
                  disabled={gFuncs.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 2: DESPEJES G(X) */}
        <section className={styles.formSection} style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Sigma size={18} />
              <h3>Despejes g(x) para el método</h3>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '-0.5rem 0 1rem 1.5rem' }}>
            Define las funciones para la iteración x_(k+1) = g(x_k).
          </p>
          <div className={styles.listContainer}>
            {gFuncs.map((func, index) => (
              <div key={index} className={styles.itemRow}>
                <span className={styles.itemIndex}>g_{index + 1}</span>
                <input
                  type="text"
                  value={func}
                  onChange={(e) => {
                    const newFuncs = [...gFuncs];
                    newFuncs[index] = e.target.value;
                    setGFuncs(newFuncs);
                  }}
                  placeholder="Ej: sqrt(5 - x_2**2)"
                  className={styles.mainInput}
                  required
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Variable size={18} />
              <h3>Punto Inicial</h3>
            </div>
            <button type="button" onClick={handleAddVariable} className={styles.addButtonMini}>
              <Plus size={14} /> Añadir
            </button>
          </div>
          <div className={styles.listContainer}>
            {puntoInicial.map((val, index) => (
              <div key={index} className={styles.itemRow}>
                <span className={styles.itemIndex}>x_{index + 1}</span>
                <input
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => {
                    const newPoints = [...puntoInicial];
                    newPoints[index] = parseFloat(e.target.value) || 0;
                    setPuntoInicial(newPoints);
                  }}
                  className={styles.mainInput}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVariable(index)}
                  className={styles.removeButton}
                  disabled={puntoInicial.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {!isSquareSystem && (
          <div className={styles.validationWarning}>
            <AlertTriangle size={18} />
            <p>El número de funciones ({gFuncs.length}) debe coincidir con el de variables ({puntoInicial.length}).</p>
          </div>
        )}

        <div className={styles.footerParams}>
          <div className={styles.paramsGrid}>
            <div className={styles.field}>
              <label>Tolerancia</label>
              <input
                type="number"
                step="any"
                value={tolerancia}
                onChange={(e) => setTolerancia(parseFloat(e.target.value) || 0.0001)}
              />
            </div>
            <div className={styles.field}>
              <label>Iteraciones Máx</label>
              <input
                type="number"
                value={iteraciones}
                onChange={(e) => setIteraciones(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isPending || !isSquareSystem}
          >
            {isPending ? 'Calculando...' : <><Play size={18} fill="currentColor" /> Resolver</>}
          </button>
        </div>
      </form>
    </div>
  );
};
