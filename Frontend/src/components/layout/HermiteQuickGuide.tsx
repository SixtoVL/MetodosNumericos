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
                  A diferencia de la interpolación normal, aquí necesitas tres valores por cada punto:
                </p>
                <ul className={styles.list}>
                  <li><strong>x</strong>: La posición en el eje horizontal.</li>
                  <li><strong>f(x)</strong>: El valor de la función en ese punto.</li>
                  <li><strong>f'(x)</strong>: La pendiente (derivada) en ese punto.</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3><Star size={18} /> La "Magia" de Hermite</h3>
                <p>El método utiliza <strong>nodos duplicados</strong> para integrar las derivadas en una tabla de diferencias:</p>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '0.5rem 0' }}>
                  <MathRenderer math="f[x_i, x_i] = f'(x_i)" block />
                  <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
                    Si los nodos se repiten, la tabla usa automáticamente la derivada.
                  </p>
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
