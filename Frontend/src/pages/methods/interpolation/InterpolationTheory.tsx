import React, { useState, useRef } from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ChevronDown, BookOpen, Target, FunctionSquare, AlertCircle, Info, GitFork, Table, PlusSquare } from 'lucide-react';
import styles from './InterpolationTheory.module.css';

const InterpolationTheory: React.FC = () => {
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
              <h3><Target size={18} /> Objetivo del módulo</h3>
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

      {/* Módulo 3 */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(3) ? styles.active : ''}`}
        ref={moduleRefs[3]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(3)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>3</div>
            <h2>Diferencias Divididas</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(3) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Target size={18} inline /> Objetivo del módulo</h3>
              <p>Desarrollar el concepto de diferencias divididas como herramienta fundamental para la construcción eficiente de polinomios interpolantes y comprender su relación con la forma de Newton.</p>
            </section>

            <section className={styles.section}>
              <h3><BookOpen size={18} inline /> Conocimientos Previos</h3>
              <p>Para entender las diferencias divididas, es útil recordar dos conceptos básicos:</p>
              <ul>
                <li><strong>Pendiente de una recta:</strong> La medida de inclinación entre dos puntos <MathRenderer math="(x_0, y_0)" /> y <MathRenderer math="(x_1, y_1)" /> es <MathRenderer math="m = \frac{y_1 - y_0}{x_1 - x_0}" />. Notarás que esta es exactamente la definición de una diferencia dividida de primer orden.</li>
                <li><strong>Recursividad:</strong> Un proceso donde la solución de un problema depende de soluciones a instancias más pequeñas del mismo problema.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><PlusSquare size={18} inline /> ¿De dónde sale esta idea?</h3>
              <p>
                El origen está en la <strong>Forma de Newton</strong> del polinomio interpolante. Si queremos construir un polinomio <MathRenderer math="P(x)" /> que pase por <MathRenderer math="x_0, x_1, \dots" />, lo planteamos de forma acumulativa:
              </p>
              <MathRenderer math="P(x) = a_0 + a_1(x - x_0) + a_2(x - x_0)(x - x_1) + \dots" block />
              <p>
                Al intentar despejar los coeficientes <MathRenderer math="a_i" /> evaluando en cada punto, surge naturalmente una estructura repetitiva. Los matemáticos descubrieron que estos coeficientes <MathRenderer math="a_i" /> son precisamente las <strong>Diferencias Divididas</strong>.
              </p>
            </section>

            <section className={styles.section}>
              <h3>Definición recursiva</h3>
              <p>Las diferencias divididas capturan cómo cambia la "tasa de cambio" de la función a medida que usamos más puntos:</p>
              <ul>
                <li><strong>Orden cero (El valor):</strong> <MathRenderer math="f[x_i] = y_i" />. Es simplemente la altura del punto.</li>
                <li><strong>Primer orden (La pendiente):</strong> <MathRenderer math="f[x_i, x_{i+1}] = \frac{f[x_{i+1}] - f[x_i]}{x_{i+1} - x_i}" />. Es la pendiente entre dos puntos adyacentes.</li>
                <li><strong>Orden general (La curvatura):</strong> <MathRenderer math="f[x_i, \dots, x_{i+k}] = \frac{f[x_{i+1}, \dots, x_{i+k}] - f[x_i, \dots, x_{i+k-1}]}{x_{i+k} - x_i}" />.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><Info size={18} inline /> Intuición Matemática</h3>
              <p>
                Puedes pensar en las diferencias divididas como <strong>"Derivadas Discretas"</strong>. 
              </p>
              <div className={styles.infoBox}>
                <ul>
                  <li>Primer orden <MathRenderer math="\approx" /> Primera derivada (Velocidad).</li>
                  <li>Segundo orden <MathRenderer math="\approx" /> Segunda derivada (Aceleración/Curvatura).</li>
                </ul>
                <p>A medida que el orden aumenta, estamos extrayendo información más profunda sobre la forma y las curvas de los datos.</p>
              </div>
            </section>

            <section className={styles.section}>
              <h3><Table size={18} inline /> ¿Cómo se construye la tabla?</h3>
              <p>Construir la tabla es un proceso sistemático que se realiza de izquierda a derecha por columnas:</p>
              <ol>
                <li><strong>Columna 1 y 2:</strong> Colocas tus datos conocidos <MathRenderer math="x_i" /> y <MathRenderer math="y_i" />.</li>
                <li><strong>Columna 3 (Primer Orden):</strong> Calculas la pendiente entre cada par de puntos adyacentes.</li>
                <li><strong>Columnas Siguientes:</strong> Utilizas los resultados de la columna anterior. 
                  <div className={styles.infoBox}>
                    <strong>Regla de Oro:</strong> Para el denominador, siempre restas el <MathRenderer math="x" /> "más lejano" del <MathRenderer math="x" /> "más cercano" que participan en ese bloque de cálculo.
                  </div>
                </li>
              </ol>
            </section>

            <section className={styles.section}>
              <h3><PlusSquare size={18} inline /> Ejemplo Completo: Armando la Tabla</h3>
              <p>Vamos a interpolar los puntos: <MathRenderer math="(1, 1), (2, 4), (4, 16)" />.</p>
              
              <div className={styles.example}>
                <h4>1. Diferencias de Primer Orden (Pendientes)</h4>
                <ul>
                  <li><MathRenderer math="f[x_0, x_1] = \frac{4 - 1}{2 - 1} = 3" /></li>
                  <li><MathRenderer math="f[x_1, x_2] = \frac{16 - 4}{4 - 2} = \frac{12}{2} = 6" /></li>
                </ul>

                <h4>2. Diferencia de Segundo Orden (Curvatura)</h4>
                <ul>
                  <li><MathRenderer math="f[x_0, x_1, x_2] = \frac{6 - 3}{4 - 1} = \frac{3}{3} = 1" /></li>
                </ul>
              </div>

              <h4>Tabla Resultante</h4>
              <div className={styles.infoBox} style={{ overflowX: 'auto' }}>
                <MathRenderer math="
                \begin{array}{|c|c|c|c|}
                \hline
                x_i & f[x_i] & \text{Orden 1} & \text{Orden 2} \\
                \hline
                1 & \mathbf{1} & & \\
                \hline
                2 & 4 & \mathbf{3} & \\
                \hline
                4 & 16 & 6 & \mathbf{1} \\
                \hline
                \end{array}
                " block />
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                  * Los valores en <strong>negrita</strong> son los coeficientes que se usan para el polinomio de Newton: <MathRenderer math="1, 3, 1" />.
                </p>
              </div>
            </section>

            <div className={styles.warningBox}>
              <AlertCircle size={16} /> <strong>Problemas numéricos:</strong> Sensibilidad extrema si los puntos <MathRenderer math="x_i" /> están muy cercanos entre sí (división por valores pequeños).
            </div>
          </div>
        )}
      </div>

      {/* Módulo 4 */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(4) ? styles.active : ''}`}
        ref={moduleRefs[4]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(4)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>4</div>
            <h2>Fórmula de Interpolación de Newton</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(4) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Target size={18} /> Objetivo del módulo</h3>
              <p>Desarrollar la forma de interpolación de Newton basada en diferencias divididas y sus variantes para datos equiespaciados, comprendiendo sus ventajas computacionales.</p>
            </section>

            <section className={styles.section}>
              <h3><PlusSquare size={18} /> Idea fundamental</h3>
              <p>A partir de las diferencias divididas calculadas en el módulo anterior, construimos el polinomio de forma <strong>incremental</strong>.</p>
              <ul>
                <li>Permite agregar nuevos puntos sin reconstruir todo desde cero.</li>
                <li>Es significativamente más eficiente que la forma de Lagrange para grandes conjuntos de datos.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3>Fórmula General de Newton</h3>
              <p>El polinomio se expresa como una suma acumulativa de términos de grado creciente:</p>
              <MathRenderer 
                math="P_n(x) = f[x_0] + f[x_0, x_1](x - x_0) + f[x_0, x_1, x_2](x - x_0)(x - x_1) + \cdots" 
                block 
              />
              <p>Donde los coeficientes son exactamente los valores de la diagonal superior de nuestra tabla de diferencias divididas.</p>
            </section>

            <section className={styles.section}>
              <h3><Table size={18} /> Casos Especiales: Nodos Equiespaciados</h3>
              <p>Si la distancia entre cada <MathRenderer math="x_i" /> es constante (<MathRenderer math="h" />), podemos simplificar el proceso usando <strong>Diferencias Finitas</strong>.</p>
              
              <div className={styles.infoBox}>
                <h4>Newton hacia Adelante</h4>
                <p>Ideal para interpolar cerca del inicio de los datos (<MathRenderer math="x_0" />).</p>
                <MathRenderer math="P(x) = y_0 + s\Delta y_0 + \frac{s(s-1)}{2!}\Delta^2 y_0 + \cdots" block />
                <p style={{ fontSize: '0.85rem' }}>* Donde <MathRenderer math="s = (x - x_0)/h" /></p>
              </div>

              <div className={styles.infoBox} style={{ borderLeftColor: '#10b981' }}>
                <h4>Newton hacia Atrás</h4>
                <p>Ideal para interpolar cerca del final de los datos (<MathRenderer math="x_n" />).</p>
                <MathRenderer math="P(x) = y_n + s\nabla y_n + \frac{s(s+1)}{2!}\nabla^2 y_n + \cdots" block />
                <p style={{ fontSize: '0.85rem' }}>* Donde <MathRenderer math="s = (x - x_n)/h" /></p>
              </div>
            </section>

            <section className={styles.section}>
              <h3><Info size={18} /> Ejemplo de Construcción</h3>
              <p>Datos: <MathRenderer math="(1,1), (2,4), (3,9), (4,16)" /></p>
              <ol>
                <li><strong>Diferencias (Adelante):</strong> <MathRenderer math="\Delta y_0 = 3" />, <MathRenderer math="\Delta^2 y_0 = 2" />.</li>
                <li><strong>Variable auxiliar:</strong> <MathRenderer math="s = (x-1)/1" />.</li>
                <li><strong>Polinomio:</strong> <MathRenderer math="P(x) = 1 + 3s + \frac{s(s-1)}{2}(2) = 1 + 3s + s^2 - s = s^2 + 2s + 1" block />.</li>
              </ol>
              <div className={styles.example}>
                Sustituyendo <MathRenderer math="s = x-1" />: <MathRenderer math="P(x) = (x-1)^2 + 2(x-1) + 1 = x^2 - 2x + 1 + 2x - 2 + 1 = x^2" />. 
                <strong>¡Exacto!</strong> Los datos correspondían a la función <MathRenderer math="y=x^2" />.
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterpolationTheory;
