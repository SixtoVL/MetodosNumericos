import React, { useState, useRef } from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ChevronDown, BookOpen, Target, FunctionSquare, AlertCircle, Info } from 'lucide-react';
import styles from './InterpolationTheory.module.css';

const InterpolationTheory: React.FC = () => {
  const [activeModules, setActiveModules] = useState<number[]>([1]);
  const moduleRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
  };

  const toggleModule = (id: number) => {
    const isOpening = !activeModules.includes(id);
    
    if (activeModules.includes(id)) {
      setActiveModules(activeModules.filter(m => m !== id));
    } else {
      setActiveModules([...activeModules, id]);
    }

    // Si se está abriendo, hacemos scroll al inicio del módulo
    if (isOpening) {
      setTimeout(() => {
        const ref = moduleRefs[id as keyof typeof moduleRefs];
        if (ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.badge}>Teoría y Fundamentos</span>
        <h1>Interpolación Numérica</h1>
        <p>
          Técnicas para estimar valores intermedios a partir de un conjunto de datos discretos mediante funciones matemáticas exactas.
        </p>
      </header>

      {/* Módulo 1 */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(1) ? styles.active : ''}`}
        ref={moduleRefs[1]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(1)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>1</div>
            <h2>Introducción a la Interpolación</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>
        
        {activeModules.includes(1) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Target size={18} inline /> Objetivo del módulo</h3>
              <p>Comprender el problema fundamental de la interpolación, su formulación matemática, su solución básica (interpolación lineal) y el concepto general de interpolación polinomial.</p>
            </section>

            <section className={styles.section}>
              <h3>Problema de Interpolación</h3>
              <h4>Planteamiento intuitivo</h4>
              <p>Se dispone de un conjunto de datos discretos:</p>
              <MathRenderer math="(x_0, y_0), (x_1, y_1), \dots, (x_n, y_n)" block />
              <p>Donde <MathRenderer math="x_i" /> son valores independientes y <MathRenderer math="y_i" /> son valores observados. El objetivo es encontrar una función <MathRenderer math="f(x)" /> que permita estimar valores intermedios y modelar el comportamiento de los datos.</p>
              
              <div className={styles.infoBox}>
                <strong>Definición formal:</strong> Sea <MathRenderer math="\{(x_i, y_i)\}_{i=0}^{n}" /> un conjunto de puntos con <MathRenderer math="x_i \neq x_j" /> si <MathRenderer math="i \neq j" />. Se dice que una función <MathRenderer math="f" /> interpola los datos si:
                <MathRenderer math="f(x_i) = y_i \quad \text{para todo } i = 0,1,\dots,n" block />
              </div>

              <h4>Teorema fundamental (existencia y unicidad)</h4>
              <p>Dado un conjunto de <MathRenderer math="n+1" /> puntos con abscisas distintas, existe un <strong>único</strong> polinomio <MathRenderer math="P_n(x)" /> de grado menor o igual a <MathRenderer math="n" /> que interpola dichos puntos.</p>
            </section>

            <section className={styles.section}>
              <h3>Interpolación Lineal</h3>
              <p>Es el caso más simple, donde se utilizan dos puntos para construir un polinomio de grado 1 (una recta).</p>
              <MathRenderer math="P_1(x)=y_0 + \frac{y_1 - y_0}{x_1 - x_0}(x - x_0)" block />
              
              <div className={styles.example}>
                <strong>Ejemplo:</strong> Datos <MathRenderer math="(1,2), (3,6)" />. Para <MathRenderer math="x=2" />:
                <MathRenderer math="P(2) = 2 + \frac{6-2}{3-1}(2-1) = 4" block />
              </div>
            </section>

            <section className={styles.section}>
              <h3>Interpolación Polinomial General</h3>
              <p>Se busca un polinomio de grado <MathRenderer math="n" />:</p>
              <MathRenderer math="P_n(x) = a_0 + a_1 x + a_2 x^2 + \cdots + a_n x^n" block />
              <p>Esto genera un sistema de ecuaciones cuya matriz de coeficientes se conoce como <strong>Matriz de Vandermonde</strong>.</p>
              
              <div className={styles.warningBox}>
                <strong>Problemas prácticos:</strong> 
                <ul>
                  <li>Inestabilidad numérica.</li>
                  <li>Fenómeno de Runge (oscilaciones grandes en grados altos).</li>
                </ul>
              </div>
            </section>

            <section className={styles.section}>
              <h3>Interpolación vs Aproximación</h3>
              <ul>
                <li><strong>Interpolación:</strong> Pasa exactamente por los puntos. Ideal para datos precisos.</li>
                <li><strong>Aproximación:</strong> Minimiza el error global sin pasar necesariamente por los puntos. Ideal para datos con ruido.</li>
              </ul>
            </section>
          </div>
        )}
      </div>

      {/* Módulo 2 */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(2) ? styles.active : ''}`}
        ref={moduleRefs[2]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(2)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>2</div>
            <h2>Interpolación de Lagrange</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(2) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><FunctionSquare size={18} inline /> Idea fundamental</h3>
              <p>La interpolación de Lagrange proporciona una solución directa y explícita para construir el polinomio interpolante sin necesidad de resolver sistemas de ecuaciones lineales.</p>
            </section>

            <section className={styles.section}>
              <h3>Polinomios base de Lagrange</h3>
              <p>Para cada <MathRenderer math="i = 0,1,\dots,n" />, se define el polinomio base <MathRenderer math="L_i(x)" /> como:</p>
              <MathRenderer math="L_i(x) = \prod_{\substack{j=0 \\ j \neq i}}^{n} \frac{x - x_j}{x_i - x_j}" block />
              
              <div className={styles.infoBox}>
                <strong>Propiedad "Selector":</strong> 
                <MathRenderer math="L_i(x_j) = 1 \text{ si } i=j, \text{ else } 0" block />
                Esto significa que cada polinomio base vale 1 en su punto correspondiente y 0 en todos los demás.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Fórmula de Lagrange</h3>
              <p>El polinomio interpolante final es una combinación lineal de los polinomios base:</p>
              <MathRenderer math="P_n(x)=\sum_{i=0}^{n} y_i L_i(x)" block />
            </section>

            <section className={styles.section}>
              <h3>Error de interpolación</h3>
              <p>Para una función <MathRenderer math="f" /> derivable <MathRenderer math="n+1" /> veces:</p>
              <MathRenderer math="f(x) - P_n(x) = \frac{f^{(n+1)}(\xi)}{(n+1)!} \prod_{i=0}^{n} (x - x_i)" block />
              <div className={styles.warningBox}>
                <AlertCircle size={16} inline /> El error aumenta con la "curvatura" de la función y depende críticamente de la distribución de los puntos.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Implementación Eficiente</h3>
              <p>Aunque la forma directa es fácil de entender, en computación se prefiere la <strong>Forma Baricéntrica</strong>:</p>
              <MathRenderer math="P(x) = \frac{\sum \frac{w_i y_i}{x - x_i}}{\sum \frac{w_i}{x - x_i}}" block />
              <p>Esto ofrece mayor estabilidad numérica y eficiencia en la evaluación.</p>
            </section>

            <section className={styles.section}>
              <h3><Info size={18} inline /> Ejemplo Completo</h3>
              <p>Dados los puntos <MathRenderer math="(1,2), (2,3), (4,1)" />:</p>
              <ol>
                <li>Calcular <MathRenderer math="L_0(x), L_1(x), L_2(x)" /> usando los nodos <MathRenderer math="1, 2, 4" />.</li>
                <li>Construir <MathRenderer math="P(x) = 2L_0(x) + 3L_1(x) + 1L_2(x)" />.</li>
              </ol>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterpolationTheory;
