import React, { useState, useRef } from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ChevronDown, Target, Zap, AlertTriangle, Info, BookOpen, Activity, Search } from 'lucide-react';
import styles from '../interpolation/InterpolationTheory.module.css';

const NewtonTheory: React.FC = () => {
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
        <h1>Método de Newton-Raphson</h1>
        <p>
          Explora uno de los algoritmos más eficientes y elegantes del análisis numérico para la resolución de ecuaciones no lineales.
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
              <h3><BookOpen size={18} inline /> ¿Qué es el método de Newton?</h3>
              <p>
                El método de Newton-Raphson es un procedimiento algorítmico que permite hallar aproximaciones de los ceros o raíces de una función real. 
                A diferencia de otros métodos como la bisección, Newton utiliza información de la <strong>derivada</strong> de la función, lo que le permite "adivinar" la dirección hacia la raíz con gran precisión.
              </p>
              
              <div className={styles.infoBox}>
                <strong>Historia:</strong> Fue descrito por Isaac Newton en 1669 y refinado por Joseph Raphson en 1690. Su potencia radica en que, bajo las condiciones adecuadas, la precisión de la aproximación se duplica en cada paso.
              </div>

              <h3>Motivación Matemática</h3>
              <p>
                Muchas ecuaciones en ingeniería (como el cálculo de órbitas o tensiones en materiales) no pueden resolverse con despejes algebraicos simples. 
                El método de Newton transforma un problema no lineal complejo en una serie de problemas lineales (rectas tangentes) que son mucho más fáciles de resolver.
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
            <h2>Newton en una variable</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>
        
        {activeModules.includes(2) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Target size={18} inline /> Problema que resuelve</h3>
              <p>Buscamos el valor de <MathRenderer math="x" /> que satisfaga:</p>
              <MathRenderer math="f(x) = 0" block />
              <div className={styles.example}>
                <strong>Ejemplo práctico:</strong> Si queremos hallar <MathRenderer math="\sqrt{2}" />, resolvemos <MathRenderer math="x^2 - 2 = 0" />.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Interpretación Geométrica</h3>
              <p>
                Imagina que estás en un punto <MathRenderer math="x_n" /> de la curva. Trazamos una <strong>recta tangente</strong> a la función en ese punto. 
                El lugar donde esa recta cruza el eje <MathRenderer math="x" /> será nuestra siguiente y mejor aproximación, <MathRenderer math="x_{n+1}" />.
              </p>
              <p>La ecuación de la tangente es:</p>
              <MathRenderer math="y - f(x_n) = f'(x_n)(x - x_n)" block />
              <p>Haciendo <MathRenderer math="y = 0" /> y despejando <MathRenderer math="x" />, obtenemos la famosa fórmula:</p>
              <MathRenderer math="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" block />
            </section>

            <section className={styles.section}>
              <h3>Algoritmo Paso a Paso</h3>
              <ol>
                <li><strong>Inicialización:</strong> Elegir una semilla o valor inicial <MathRenderer math="x_0" /> (preferiblemente cerca de la raíz).</li>
                <li><strong>Evaluación:</strong> Calcular el valor de la función y su derivada en el punto actual.</li>
                <li><strong>Actualización:</strong> Aplicar la fórmula para obtener el siguiente punto.</li>
                <li><strong>Verificación:</strong> ¿Es el cambio menor que nuestra tolerancia? Si no, repetir desde el paso 2.</li>
              </ol>
            </section>

            <section className={styles.section}>
              <h3><Activity size={18} inline /> Convergencia Cuadrática</h3>
              <p>
                Esta es la característica "estrella" de Newton. Si el error en un paso es <MathRenderer math="10^{-2}" />, en el siguiente será aproximadamente <MathRenderer math="10^{-4}" />, luego <MathRenderer math="10^{-8}" />, y así sucesivamente.
              </p>
            </section>

            <div className={styles.warningBox}>
              <h3><AlertTriangle size={18} inline /> Limitaciones Técnicas</h3>
              <ul>
                <li><strong>Puntos de Inflexión:</strong> Si <MathRenderer math="f'(x_n)" /> es muy cercano a cero, la tangente se vuelve casi horizontal y el método "dispara" la siguiente aproximación muy lejos del objetivo.</li>
                <li><strong>Ciclos Infinitos:</strong> En algunas funciones, el método puede oscilar entre dos valores sin converger nunca.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Módulo 3: Multivariable */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(3) ? styles.active : ''}`}
        ref={moduleRefs[3]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(3)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>3</div>
            <h2>Sistemas de Varias Variables</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(3) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Search size={18} inline /> El desafío de la multidimensión</h3>
              <p>
                Cuando trabajamos con sistemas de ecuaciones, ya no buscamos un punto en una línea, sino un vector en un espacio (2D, 3D o más).
              </p>
              <MathRenderer math="F(\mathbf{x}) = \mathbf{0} \quad \Rightarrow \quad \begin{cases} f_1(x_1, x_2, \dots) = 0 \\ f_2(x_1, x_2, \dots) = 0 \end{cases}" block />
            </section>

            <section className={styles.section}>
              <h3>El Rol del Jacobiano</h3>
              <p>
                En una dimensión usamos la derivada simple. En varias dimensiones, necesitamos todas las derivadas parciales posibles organizadas en una matriz llamada <strong>Jacobiano</strong> (<MathRenderer math="J" />).
              </p>
              <div className={styles.infoBox}>
                El Jacobiano representa la "pendiente" del sistema en todas las direcciones simultáneamente. Si el determinante del Jacobiano es cero, el sistema es singular y el método no puede avanzar.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Ecuación del Sistema Lineal</h3>
              <p>La actualización se convierte en un problema de álgebra lineal:</p>
              <MathRenderer math="J(\mathbf{x}_n) \cdot \Delta \mathbf{x} = -F(\mathbf{x}_n)" block />
              <p>Donde <MathRenderer math="\Delta \mathbf{x}" /> es el paso que debemos dar para acercarnos a la solución:</p>
              <MathRenderer math="\mathbf{x}_{n+1} = \mathbf{x}_n + \Delta \mathbf{x}" block />
            </section>

            <div className={styles.example}>
              <strong>Resumen de complejidad:</strong> Mientras que Newton 1D requiere 1 división, Newton Multivariable requiere resolver un sistema de ecuaciones lineales <MathRenderer math="n \times n" /> en cada iteración.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewtonTheory;
