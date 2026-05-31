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
  method: 'newton' | 'fixed-point' | 'interpolation' | 'hermite' | 'lagrange';
  onSelect: (values: any) => void;
}

export const ExamplesGuide: React.FC<Props> = ({ method, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getExamples = (): Example[] => {
    if (method === 'newton') {
      return [
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
      ];
    }
    
    if (method === 'fixed-point') {
      return [
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
    }

    if (method === 'hermite') {
      return [
        {
          title: "Ejemplo de Examen",
          description: "Hallar el polinomio osculador de grado 3 para 2 puntos con derivadas.",
          difficulty: "Fácil",
          values: {
            puntos: [{ x: 1, y: 2, dy: 3 }, { x: 2, y: 5, dy: 4 }],
            x_a_evaluar: 1.5
          }
        },
        {
          title: "Trayectoria de un Auto",
          description: "Simula la posición y velocidad en t=0 y t=5 para estimar t=2.5.",
          difficulty: "Medio",
          values: {
            puntos: [{ x: 0, y: 0, dy: 10 }, { x: 5, y: 100, dy: 20 }],
            x_a_evaluar: 2.5
          }
        },
        {
          title: "Curva S (Sigmoide)",
          description: "3 puntos con derivadas cero en los extremos para una curva suave.",
          difficulty: "Avanzado",
          values: {
            puntos: [{ x: 0, y: 0, dy: 0 }, { x: 0.5, y: 0.5, dy: 2 }, { x: 1, y: 1, dy: 0 }],
            x_a_evaluar: 0.25
          }
        }
      ];
    }

    if (method === 'lagrange') {
      return [
        {
          title: "Interpolación Básica",
          description: "3 puntos definen una parábola de forma directa.",
          difficulty: "Fácil",
          values: {
            puntos: [{ x: 1, y: 1 }, { x: 2, y: 4 }, { x: 4, y: 16 }],
            x_a_evaluar: 3
          }
        },
        {
          title: "Cálculo de Logaritmo",
          description: "Estima ln(2) a partir de puntos conocidos de f(x)=ln(x).",
          difficulty: "Medio",
          values: {
            puntos: [{ x: 1, y: 0 }, { x: 1.5, y: 0.4054 }, { x: 3, y: 1.0986 }],
            x_a_evaluar: 2
          }
        },
        {
          title: "Polinomio de 4to Grado",
          description: "5 puntos con valores arbitrarios para observar la oscilación.",
          difficulty: "Avanzado",
          values: {
            puntos: [{ x: 0, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 5 }, { x: 4, y: 4 }],
            x_a_evaluar: 2.5
          }
        }
      ];
    }

    return [
      {
        title: "Newton hacia Adelante",
        description: "Diferencias finitas con puntos equiespaciados (evaluación al inicio).",
        difficulty: "Fácil",
        values: {
          puntos: [{ x: 10, y: 0.1736 }, { x: 20, y: 0.3420 }, { x: 30, y: 0.5000 }, { x: 40, y: 0.6428 }],
          x_a_evaluar: 15,
          metodo: 'finitas',
          direccion: 'adelante'
        }
      },
      {
        title: "Newton hacia Atrás",
        description: "Mismos puntos que el anterior, pero con evaluación al final de la tabla.",
        difficulty: "Fácil",
        values: {
          puntos: [{ x: 10, y: 0.1736 }, { x: 20, y: 0.3420 }, { x: 30, y: 0.5000 }, { x: 40, y: 0.6428 }],
          x_a_evaluar: 35,
          metodo: 'finitas',
          direccion: 'atras'
        }
      },
      {
        title: "Interpolación 3 Puntos",
        description: "Ejemplo básico: Parábola simple que pasa por 3 nodos.",
        difficulty: "Fácil",
        values: {
          puntos: [{ x: 1, y: 1 }, { x: 2, y: 4 }, { x: 4, y: 16 }],
          x_a_evaluar: 3,
          metodo: 'divididas'
        }
      },
      {
        title: "Interpolación 4 Puntos",
        description: "Conjunto de datos para un polinomio cúbico suave.",
        difficulty: "Medio",
        values: {
          puntos: [{ x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 8 }],
          x_a_evaluar: 0.5,
          metodo: 'divididas'
        }
      },
      {
        title: "Interpolación 5 Puntos",
        description: "Interpolación compleja con múltiples variaciones de pendiente.",
        difficulty: "Avanzado",
        values: {
          puntos: [{ x: 0, y: 1 }, { x: 1, y: 2.71 }, { x: 2, y: 7.38 }, { x: 3, y: 20.08 }, { x: 4, y: 54.59 }],
          x_a_evaluar: 2.5,
          metodo: 'divididas'
        }
      }
    ];
  };

  const examples = getExamples();

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
                      <span>
                        {method === 'interpolation' || method === 'hermite'
                          ? `${ex.values.puntos.length} Puntos` 
                          : `${Array.isArray(ex.values.funciones || ex.values.g_func) ? ex.values.funciones?.length || ex.values.g_func?.length : 1} Variables`
                        }
                      </span>
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

export default ExamplesGuide;
