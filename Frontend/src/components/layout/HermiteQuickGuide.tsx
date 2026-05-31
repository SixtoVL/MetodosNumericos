import React, { useState } from 'react';
import { Info, X, ChevronDown, ChevronUp, Calculator, Hash, Star, Zap } from 'lucide-react';
import styles from './MathSyntaxGuide.module.css';
import { MathRenderer } from '../visualizers/MathRenderer';

export const HermiteQuickGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button 
        className={styles.triggerButton} 
        onClick={() => setIsOpen(!isOpen)}
        title="Guía de Uso de Hermite"
      >
        <Info size={20} />
        <span>Guía de Uso</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <div className={styles.titleGroup}>
                <Calculator size={24} className={styles.iconPrimary} />
                <h2>Interpolación de Hermite</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </header>

            <div className={styles.modalBody}>
              <section className={styles.section}>
                <h3><Hash size={18} /> ¿Cómo ingresar los datos?</h3>
                <p>
                  En Hermite, la cantidad de información que tengas en cada punto determina cuántas veces se repite el nodo en la tabla:
                </p>
                
                <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>Información</th>
                        <th style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>Datos</th>
                        <th style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>Repeticiones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>Solo valor</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>(x, f(x))</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>1</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>Valor y 1ra der.</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>(x, f(x), f'(x))</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>2</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>Valor, 1ra y 2da der.</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>(x, f(x), f'(x), f''(x))</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className={styles.section}>
                <h3><Star size={18} /> La "Magia" de Hermite</h3>
                <p>El método utiliza <strong>nodos expandidos</strong> (duplicados o triplicados) para integrar las derivadas:</p>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '0.5rem 0' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <MathRenderer math="f[x_i, x_i] = f'(x_i)" block />
                  </div>
                  <div>
                    <MathRenderer math="f[x_i, x_i, x_i] = \frac{f''(x_i)}{2!}" block />
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3><Zap size={18} /> Datos Técnicos</h3>
                <ul className={styles.list}>
                  <li><strong>Grado del Polinomio</strong>: Si ingresas <MathRenderer math="n" /> puntos, obtendrás un polinomio de grado <MathRenderer math="2n-1" />.</li>
                  <li><strong>Suavidad</strong>: Este método garantiza que la curva no solo pase por los puntos, sino que tenga la dirección exacta que tú definas.</li>
                </ul>
              </section>

              <section className={styles.infoBox}>
                <h4>Consejo de Examen:</h4>
                <p>
                  Asegúrate de que tus valores de <strong>x</strong> estén en orden ascendente. Aunque el método funciona igual, la tabla de diferencias será mucho más fácil de leer y validar.
                </p>
              </section>
            </div>
            
            <footer className={styles.modalFooter}>
              <button className={styles.primaryButton} onClick={() => setIsOpen(false)}>
                Entendido
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
