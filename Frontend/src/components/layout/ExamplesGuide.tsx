import React, { useState } from 'react';
import { BookOpen, X, ChevronRight, Layers, Target, Activity } from 'lucide-react';
import styles from './ExamplesGuide.module.css';

interface Example {
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Avanzado';
  values: any;
}

interface Props {
  method: 'newton' | 'fixed-point';
  onSelect: (values: any) => void;
}

export const ExamplesGuide: React.FC<Props> = ({ method, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const examples: Example[] = method === 'newton' ? [
    {
      title: "Sistema 2x2 ",
      description: "Intersección de un círculo y una curva exponencial.",
      difficulty: "Fácil",
      values: {
        funciones: ['x_1**2 + x_2**2 - 4', 'exp(x_1) + x_2 - 1'],
        punto_inicial: [1, -1],
        tolerancia: 0.0001,
        iteraciones: 20
      }
    },
    {
      title: "Sistema 2x2 ",
      description: "Sistema cuadrático con elipses e hipérbolas.",
      difficulty: "Medio",
      values: {
        funciones: ['3*x_1**2 + 4*x_2**2 - 16', '2*x_1**2 - 5*x_2**2 - 2'],
        punto_inicial: [1.8, 1.0],
        tolerancia: 0.0001,
        iteraciones: 20
      }
    },
    {
      title: "Sistema 3x3",
      description: "Sistema tridimensional con convergencia rápida y estable.",
      difficulty: "Medio",
      values: {
        funciones: [
          '3*x_1 - cos(x_2*x_3) - 1',
          '4*x_2 - x_1**2 - 2',
          '5*x_3 - sin(x_1) - 3'
        ],
        punto_inicial: [0.5, 0.5, 0.5],
        tolerancia: 0.0001,
        iteraciones: 20
      }
    }
  ] : [
    {
      title: "Sistema 2x2 ",
      description: "Intersección con despejes sucesivos (Gauss-Seidel).",
      difficulty: "Fácil",
      values: {
        funciones_originales: ['x_1**2 + x_2**2 - x_1', 'x_1**2 - x_2**2 - x_2'],
        g_func: ['sqrt(x_2 + x_2**2)', 'sqrt(x_1 - x_1**2)'],
        punto_inicial: [1.0, 0.5],
        tolerancia: 0.0001,
        iteraciones: 20
      }
    },
    {
      title: "Sistema 2x2 ",
      description: "Intersección de seno y coseno.",
      difficulty: "Medio",
      values: {
        funciones_originales: ['cos(x_2) - x_1', 'sin(x_1) - x_2'],
        g_func: ['cos(x_2)', 'sin(x_1)'],
        punto_inicial: [0.5, 0.5],
        tolerancia: 0.0001,
        iteraciones: 20
      }
    },
    {
      title: "Sistema 3x3",
      description: "Despeje del sistema tridimensional estable.",
      difficulty: "Medio",
      values: {
        funciones_originales: [
          '3*x_1 - cos(x_2*x_3) - 1',
          '4*x_2 - x_1**2 - 2',
          '5*x_3 - sin(x_1) - 3'
        ],
        g_func: [
          '(cos(x_2*x_3) + 1)/3',
          '(x_1**2 + 2)/4',
          '(sin(x_1) + 3)/5'
        ],
        punto_inicial: [0.5, 0.5, 0.5],
        tolerancia: 0.0001,
        iteraciones: 20
      }
    }
  ];

  return (
    <div className={styles.container}>
      <button 
        className={styles.triggerButton} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <BookOpen size={20} />
        <span>Ejemplos Listos</span>
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <div className={styles.titleGroup}>
                <Target size={24} className={styles.iconPrimary} />
                <h2>Sistemas de Prueba</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </header>

            <div className={styles.modalBody}>
              <p className={styles.intro}>
                Selecciona un sistema para cargar automáticamente sus valores en la calculadora.
              </p>
              
              <div className={styles.examplesGrid}>
                {examples.map((ex, i) => (
                  <div key={i} className={styles.exampleCard} onClick={() => {
                    onSelect(ex.values);
                    setIsOpen(false);
                  }}>
                    <div className={styles.cardHeader}>
                      <span className={styles.badge} data-difficulty={ex.difficulty}>
                        {ex.difficulty}
                      </span>
                      <Layers size={18} className={styles.cardIcon} />
                    </div>
                    <h4>{ex.title}</h4>
                    <p>{ex.description}</p>
                    <div className={styles.cardFooter}>
                      <Activity size={14} />
                      <span>{Array.isArray(ex.values.funciones || ex.values.g_func) ? ex.values.funciones?.length || ex.values.g_func?.length : 1} Variables</span>
                      <ChevronRight size={16} className={styles.arrow} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
