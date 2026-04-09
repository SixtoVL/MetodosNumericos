import React, { useState, useEffect } from 'react';
import type { NewtonRequest } from '../../schemas/newton.schema';
import styles from './NewtonForm.module.css';
import { Plus, Trash2, Play, Calculator, Variable, Sigma, AlertTriangle } from 'lucide-react';

interface NewtonFormProps {
  onSolve: (data: NewtonRequest) => void;
  isPending: boolean;
  initialValues?: NewtonRequest;
}

export const NewtonForm: React.FC<NewtonFormProps> = ({ onSolve, isPending, initialValues }) => {
  const [funciones, setFunciones] = useState<string[]>(initialValues?.funciones || ['x_1^2 + x_2^2 - 4', 'exp(x_1) + x_2 - 1']);
  const [puntoInicial, setPuntoInicial] = useState<number[]>(initialValues?.punto_inicial || [1, -1]);
  const [tolerancia, setTolerancia] = useState<number>(initialValues?.tolerancia || 0.0001);
  const [iteraciones, setIteraciones] = useState<number>(initialValues?.iteraciones || 20);

  useEffect(() => {
    if (initialValues) {
      setFunciones(initialValues.funciones);
      setPuntoInicial(initialValues.punto_inicial);
      setTolerancia(initialValues.tolerancia);
      setIteraciones(initialValues.iteraciones);
    }
  }, [initialValues]);

  const handleAddFunction = () => setFunciones([...funciones, '']);
  const handleRemoveFunction = (index: number) => {
    if (funciones.length > 1) setFunciones(funciones.filter((_, i) => i !== index));
  };

  const handleAddVariable = () => setPuntoInicial([...puntoInicial, 0]);
  const handleRemoveVariable = (index: number) => {
    if (puntoInicial.length > 1) setPuntoInicial(puntoInicial.filter((_, i) => i !== index));
  };

  const isSquareSystem = funciones.length === puntoInicial.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSquareSystem) return;
    
    onSolve({
      funciones,
      punto_inicial: puntoInicial,
      tolerancia,
      iteraciones,
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}><Calculator size={20} /></div>
          <h2>Configuración del Sistema</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* SECCIÓN DE ECUACIONES */}
        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Sigma size={18} />
              <h3>Ecuaciones (f = 0)</h3>
            </div>
            <button type="button" onClick={handleAddFunction} className={styles.addButtonMini}>
              <Plus size={14} /> Añadir
            </button>
          </div>
          <div className={styles.listContainer}>
            {funciones.map((func, index) => (
              <div key={index} className={styles.itemRow}>
                <span className={styles.itemIndex}>f_{index + 1}</span>
                <input
                  type="text"
                  value={func}
                  onChange={(e) => {
                    const newFuncs = [...funciones];
                    newFuncs[index] = e.target.value;
                    setFunciones(newFuncs);
                  }}
                  placeholder="Ej: x_1^2 - 4"
                  className={styles.mainInput}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFunction(index)}
                  className={styles.removeButton}
                  disabled={funciones.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN DE VARIABLES */}
        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Variable size={18} />
              <h3>Puntos Iniciales</h3>
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

        {/* VALIDACIÓN DE SISTEMA CUADRADO */}
        {!isSquareSystem && (
          <div className={styles.validationWarning}>
            <AlertTriangle size={18} />
            <p>El número de funciones ({funciones.length}) debe coincidir con el de variables ({puntoInicial.length}).</p>
          </div>
        )}

        {/* PARÁMETROS GLOBALES */}
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
              <label>Iteraciones</label>
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
