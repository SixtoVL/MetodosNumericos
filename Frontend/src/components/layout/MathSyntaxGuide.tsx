import React, { useState } from 'react';
import { Info, X, ChevronDown, ChevronUp, Calculator, Hash, Star } from 'lucide-react';
import styles from './MathSyntaxGuide.module.css';

interface Props {
  method: 'newton' | 'fixed-point';
}

export const MathSyntaxGuide: React.FC<Props> = ({ method }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button 
        className={styles.triggerButton} 
        onClick={() => setIsOpen(!isOpen)}
        title="Guía de Sintaxis"
      >
        <Info size={20} />
        <span>Guía de Sintaxis</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <div className={styles.titleGroup}>
                <Calculator size={24} className={styles.iconPrimary} />
                <h2>¿Cómo ingresar tus funciones?</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </header>

            <div className={styles.modalBody}>
              <section className={styles.section}>
                <h3><Hash size={18} /> Variables Obligatorias</h3>
                <p>
                  El sistema utiliza una nomenclatura estricta para las incógnitas:
                </p>
                <ul className={styles.list}>
                  <li><strong>x_1</strong>: Para la primera variable (o única variable).</li>
                  <li><strong>x_2, x_3...</strong>: Para sistemas multivariables.</li>
                  <li className={styles.hint}><em>Ejemplo: Para f(x, y, z) usa x_1, x_2, x_3.</em></li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3><Star size={18} /> Operadores y Funciones</h3>
                <div className={styles.grid}>
                  <div className={styles.gridItem}>
                    <span className={styles.code}>+ - * /</span>
                    <span>Básicos</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.code}>** o ^</span>
                    <span>Potencia (x_1^2)</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.code}>sqrt()</span>
                    <span>Raíz cuadrada</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.code}>exp()</span>
                    <span>Exponencial (e^x)</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.code}>sin, cos, tan</span>
                    <span>Trigonométricas</span>
                  </div>
                  <div className={styles.gridItem}>
                    <span className={styles.code}>log()</span>
                    <span>Logaritmo natural</span>
                  </div>
                </div>
              </section>

              <section className={styles.infoBox}>
                <h4>Regla de Oro del Método:</h4>
                {method === 'newton' ? (
                  <p>
                    Ingresa funciones igualadas a cero <strong>f(x) = 0</strong>.<br />
                    <em>Ejemplo: Para √2 usa <code>x_1**2 - 2</code></em>
                  </p>
                ) : (
                  <p>
                    1. Define el sistema original <strong>f(x) = 0</strong> para la gráfica.<br />
                    2. Define el despeje <strong>x = g(x)</strong> para el cálculo.<br />
                    <em>Ejemplo: Para √2, g(x) podría ser <code>x_1/2 + 1/x_1</code></em>
                  </p>
                )}
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
