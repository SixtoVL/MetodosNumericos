import React, { useState, useRef } from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ChevronDown, Target, Layers, HelpCircle, Info, BookOpen, RefreshCw, GitBranch } from 'lucide-react';
import styles from '../interpolation/InterpolationTheory.module.css';

export const FixedPointTheory: React.FC = () => {
  const [activeModules, setActiveModules] = useState<number[]>([1]);
  const moduleRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
  };

  const toggleModule = (id: number) => {
    const isOpening = !activeModules.includes(id);
    if (activeModules.includes(id)) {
      setActiveModules(activeModules.filter(m => m !== id));
    } else {
      setActiveModules([...activeModules, id]);
    }

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
        <h1>Método de Punto Fijo</h1>
        <p>
          Descubre la simplicidad y potencia de los métodos iterativos basados en la transformación funcional para la búsqueda de equilibrios matemáticos.
        </p>
      </header>

      {/* Módulo 1: Introducción */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(1) ? styles.active : ''}`}
        ref={moduleRefs[1]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(1)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>1</div>
            <h2>Conceptos Fundamentales</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>
        
        {activeModules.includes(1) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><BookOpen size={18} inline /> ¿Qué es un Punto Fijo?</h3>
              <p>
                A diferencia de los métodos que buscan donde una función cruza el eje (raíces), el método de punto fijo busca un valor que permanece "inmóvil" bajo una transformación.
              </p>
              <div className={styles.infoBox}>
                <strong>Definición Intuitiva:</strong> Un punto fijo de una función <MathRenderer math="g" /> es un número <MathRenderer math="x" /> que no cambia cuando se le aplica la función: <MathRenderer math="g(x) = x" />.
              </div>
              
              <h3>Motivación y Aplicaciones</h3>
              <p>
                Este concepto es la base de muchos algoritmos modernos, desde el cálculo de precios en economía (equilibrios de Nash) hasta el ranking de páginas de Google (PageRank). En métodos numéricos, es una herramienta versátil porque permite resolver casi cualquier ecuación <MathRenderer math="f(x)=0" /> si logramos despejarla adecuadamente.
              </p>
            </section>
          </div>
        )}
      </div>

      {/* Módulo 2: Una Variable */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(2) ? styles.active : ''}`}
        ref={moduleRefs[2]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(2)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>2</div>
            <h2>Punto Fijo en una variable</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>
        
        {activeModules.includes(2) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Target size={18} inline /> Transformación Funcional</h3>
              <p>Para resolver <MathRenderer math="f(x) = 0" />, transformamos la ecuación en una forma equivalente:</p>
              <MathRenderer math="x = g(x)" block />
              <p>Por ejemplo, si <MathRenderer math="x^2 - x - 2 = 0" />, una posible <MathRenderer math="g(x)" /> sería <MathRenderer math="g(x) = \sqrt{x+2}" />.</p>
            </section>

            <section className={styles.section}>
              <h3><RefreshCw size={18} inline /> El Proceso Iterativo</h3>
              <p>El método genera una sucesión de valores mediante la regla:</p>
              <MathRenderer math="x_{n+1} = g(x_n)" block />
              <p>Empezamos con un valor inicial <MathRenderer math="x_0" /> y esperamos que la serie se estabilice en el punto fijo.</p>
            </section>

            <section className={styles.section}>
              <h3>Teorema de Convergencia</h3>
              <div className={styles.warningBox}>
                <Info size={16} inline /> <strong>Condición Crítica:</strong> Para que el método converja, la magnitud de la pendiente de <MathRenderer math="g(x)" /> debe ser menor que 1 cerca de la solución:
                <MathRenderer math="|g'(x)| < 1" block />
                Si la pendiente es mayor que 1, el método se alejará de la solución (divergencia).
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Módulo 3: Sistemas Multivariados */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(3) ? styles.active : ''}`}
        ref={moduleRefs[3]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(3)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>3</div>
            <h2>Sistemas Multivariados</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(3) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Layers size={18} inline /> Extensión a Sistemas</h3>
              <p>En varias dimensiones, buscamos un vector de equilibrio:</p>
              <MathRenderer math="\mathbf{X}^{(k+1)} = \mathbf{G}(\mathbf{X}^{(k)})" block />
            </section>

            <section className={styles.section}>
              <h3><GitBranch size={18} inline /> Estrategias de Actualización</h3>
              <div className={styles.example}>
                <h4>Desplazamientos Simultáneos (Jacobi)</h4>
                <p>Se calculan todas las variables usando solo los datos del paso anterior. Es ideal para cálculos en paralelo.</p>
              </div>

              <div className={styles.example} style={{borderLeftColor: '#10b981'}}>
                <h4>Desplazamientos Sucesivos (Gauss-Seidel)</h4>
                <p>Se utilizan los valores "frescos" (recién calculados) para las siguientes variables dentro de la misma iteración. Suele ser más rápido.</p>
              </div>
            </section>

            <div className={styles.warningBox}>
              <h3><HelpCircle size={18} inline /> Comparativa con Newton</h3>
              <ul>
                <li><strong>Facilidad:</strong> No requiere calcular derivadas parciales complejas (Jacobianos).</li>
                <li><strong>Costo:</strong> Cada paso es extremadamente rápido computacionalmente.</li>
                <li><strong>Riesgo:</strong> Encontrar una <MathRenderer math="g(x)" /> que cumpla la convergencia puede ser difícil en sistemas grandes.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
