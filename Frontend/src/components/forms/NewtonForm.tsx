import React, { useState } from 'react';
import type { NewtonRequest } from '../../schemas/newton.schema';
import styles from './NewtonForm.module.css';
import { Plus, Trash2, Play, Calculator } from 'lucide-react';

interface NewtonFormProps {
  onSolve: (data: NewtonRequest) => void;
  isPending: boolean;
}

export const NewtonForm: React.FC<NewtonFormProps> = ({ onSolve, isPending }) => {
  // Restauramos los valores por defecto para una mejor UX inicial
  const [funciones, setFunciones] = useState<string[]>(['x_1^2 + x_2^2 - 4', 'exp(x_1) + x_2 - 1']);
  const [puntoInicial, setPuntoInicial] = useState<number[]>([1, -1]);
  const [tolerancia, setTolerancia] = useState<number>(0.0001);
  const [iteraciones, setIteraciones] = useState<number>(20);

  const handleAddVariable = () => {
    setFunciones([...funciones, '']);
    setPuntoInicial([...puntoInicial, 0]);
  };

  const handleRemoveVariable = (index: number) => {
    if (funciones.length > 1) {
      setFunciones(funciones.filter((_, i) => i !== index));
      setPuntoInicial(puntoInicial.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: NewtonRequest = {
      funciones,
      punto_inicial: puntoInicial,
      tolerancia,
      iteraciones,
    };
    onSolve(data);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}><Calculator size={20} /></div>
          <h2>Configuración del Sistema</h2>
        </div>
        <button type="button" onClick={handleAddVariable} className={styles.addButton}>
          <Plus size={16} /> Agregar Ecuación
        </button>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.equationsList}>
          {funciones.map((func, index) => (
            <div key={index} className={styles.equationRow}>
              <div className={styles.fieldMain}>
                <label>Función f_{index + 1}(x)</label>
                <input
                  type="text"
                  value={func}
                  onChange={(e) => {
                    const newFuncs = [...funciones];
                    newFuncs[index] = e.target.value;
                    setFunciones(newFuncs);
                  }}
                  placeholder="Ej: x_1^2 - 4"
                />
              </div>
              <div className={styles.fieldSmall}>
                <label>x_{index + 1} inicial</label>
                <input
                  type="number"
                  step="any"
                  value={puntoInicial[index]}
                  onChange={(e) => {
                    const newPoints = [...puntoInicial];
                    newPoints[index] = parseFloat(e.target.value);
                    setPuntoInicial(newPoints);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveVariable(index)}
                className={styles.removeButton}
                disabled={funciones.length <= 1}
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footerParams}>
          <div className={styles.paramsGrid}>
            <div className={styles.field}>
              <label>Tolerancia</label>
              <input
                type="number"
                step="any"
                value={tolerancia}
                onChange={(e) => setTolerancia(parseFloat(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label>Máx. Iteraciones</label>
              <input
                type="number"
                value={iteraciones}
                onChange={(e) => setIteraciones(parseInt(e.target.value))}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isPending}>
            {isPending ? (
              'Procesando...'
            ) : (
              <><Play size={20} fill="currentColor" /> Resolver Sistema</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
