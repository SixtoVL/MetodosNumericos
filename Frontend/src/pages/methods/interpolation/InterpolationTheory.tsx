import React, { useState, useRef } from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import { ChevronDown, BookOpen, Target, FunctionSquare, AlertCircle, Info, GitFork, Table, PlusSquare, Zap, Activity } from 'lucide-react';
import styles from './InterpolationTheory.module.css';

const InterpolationTheory: React.FC = () => {
  const [activeModules, setActiveModules] = useState<number[]>([1]);
  const moduleRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null),
    5: useRef<HTMLDivElement>(null),
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

      {/* Módulo 1: Introducción */}
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
              <p>Comprender el problema fundamental de la interpolación, su formulación matemática y el concepto general de aproximación por polinomios.</p>
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
              <h3>Interpolación Polinomial General</h3>
              <p>Se busca un polinomio de grado <MathRenderer math="n" />:</p>
              <MathRenderer math="P_n(x) = a_0 + a_1 x + a_2 x^2 + \cdots + a_n x^n" block />
              <p>Esto genera un sistema de ecuaciones cuya matriz de coeficientes se conoce como <strong>Matriz de Vandermonde</strong>.</p>
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

      {/* Módulo 2: Lagrange */}
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
              <h3><FunctionSquare size={18} /> Idea fundamental</h3>
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
                <AlertCircle size={16} /> El error aumenta con la "curvatura" de la función y depende críticamente de la distribución de los puntos.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Implementación Eficiente</h3>
              <p>Aunque la forma directa es fácil de entender, en computación se prefiere la <strong>Forma Baricéntrica</strong>:</p>
              <MathRenderer math="P(x) = \frac{\sum \frac{w_i y_i}{x - x_i}}{\sum \frac{w_i}{x - x_i}}" block />
              <p>Esto ofrece mayor estabilidad numérica y eficiencia en la evaluación.</p>
            </section>

            <section className={styles.section}>
              <h3><Info size={18} /> Ejemplo Completo</h3>
              <p>Dados los puntos <MathRenderer math="(1,2), (2,3), (4,1)" />:</p>
              <ol>
                <li>Calcular <MathRenderer math="L_0(x), L_1(x), L_2(x)" /> usando los nodos <MathRenderer math="1, 2, 4" />.</li>
                <li>Construir <MathRenderer math="P(x) = 2L_0(x) + 3L_1(x) + 1L_2(x)" />.</li>
              </ol>
            </section>
          </div>
        )}
      </div>

      {/* Módulo 3: Diferencias Divididas */}
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
              <h3><Target size={18} /> Objetivo del módulo</h3>
              <p>
                Desarrollar el concepto de diferencias divididas como herramienta fundamental para la construcción eficiente de polinomios interpolantes, comprender su interpretación matemática y su relación directa con la forma de Newton.
              </p>
            </section>

            <section className={styles.section}>
              <h3><GitFork size={18} /> Idea Fundamental</h3>
              <p>
                Aunque la interpolación de Lagrange proporciona una solución explícita, no es eficiente computacionalmente cuando el número de puntos es grande o cuando se añaden nuevos datos.
              </p>
              <div className={styles.infoBox}>
                Las diferencias divididas permiten:
                <ul>
                  <li>Construir el polinomio de forma <strong>incremental</strong>.</li>
                  <li><strong>Reutilizar cálculos previos</strong> al añadir nuevos nodos.</li>
                  <li>Facilitar la implementación de la interpolación de Newton.</li>
                </ul>
              </div>
            </section>

            <section className={styles.section}>
              <h3><BookOpen size={18} /> Conocimientos Previos</h3>
              <p>Para entender las diferencias divididas, es útil recordar:</p>
              <ul>
                <li><strong>Pendiente de una recta:</strong> La medida de inclinación entre dos puntos es <MathRenderer math="m = \frac{y_1 - y_0}{x_1 - x_0}" />, que es la base del primer orden.</li>
                <li><strong>Recursividad:</strong> Un proceso donde definimos algo en términos de sí mismo pero con casos más simples.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><PlusSquare size={18} /> ¿De dónde sale esta idea? (Origen)</h3>
              <p>
                Surge al plantear el polinomio en <strong>Forma de Newton</strong>:
              </p>
              <MathRenderer math="P(x) = a_0 + a_1(x - x_0) + a_2(x - x_0)(x - x_1) + \dots" block />
              <p>
                Al intentar despejar los coeficientes <MathRenderer math="a_i" /> evaluando en cada nodo, los matemáticos descubrieron que estos valores repetitivos podían calcularse mediante un algoritmo recursivo: las diferencias divididas.
              </p>

              <div className={styles.example}>
                <strong>Demostración del despeje:</strong>
                <p>Si evaluamos el polinomio en los primeros puntos, el proceso de "limpieza" de variables revela el patrón:</p>
                <ol>
                  <li>
                    <strong>En <MathRenderer math="x_0" />:</strong> <MathRenderer math="f(x_0) = a_0" />. 
                    Por lo tanto, <MathRenderer math="a_0 = f[x_0]" />.
                  </li>
                  <li>
                    <strong>En <MathRenderer math="x_1" />:</strong> <MathRenderer math="f(x_1) = a_0 + a_1(x_1 - x_0)" />.
                    Sustituyendo <MathRenderer math="a_0" /> y despejando <MathRenderer math="a_1" />:
                    <MathRenderer math="a_1 = \frac{f(x_1) - f(x_0)}{x_1 - x_0} = f[x_0, x_1]" block />
                  </li>
                  <li>
                    <strong>En <MathRenderer math="x_2" />:</strong> <MathRenderer math="f(x_2) = a_0 + a_1(x_2 - x_0) + a_2(x_2 - x_0)(x_2 - x_1)" />.
                    Al despejar <MathRenderer math="a_2" />, surge una estructura que resta las dos "pendientes" anteriores:
                    <MathRenderer math="a_2 = \frac{\frac{f(x_2) - f(x_1)}{x_2 - x_1} - \frac{f(x_1) - f(x_0)}{x_1 - x_0}}{x_2 - x_0} = f[x_0, x_1, x_2]" block />
                  </li>
                </ol>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Este patrón de "diferencia de diferencias" es el que da nombre al método y permite que el cálculo sea recursivo.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h3>Definición Formal y Recursiva</h3>
              <p>Sea un conjunto de puntos <MathRenderer math="\{(x_i, y_i)\}" /> con <MathRenderer math="x_i" /> distintos:</p>
              <ul>
                <li><strong>Orden Cero:</strong> Es simplemente el valor de la función: 
                  <MathRenderer math="f[x_i] = y_i" block />
                </li>
                <li><strong>Primer Orden:</strong> Representa la pendiente entre dos puntos: 
                  <MathRenderer math="f[x_i, x_{i+1}] = \frac{f[x_{i+1}] - f[x_i]}{x_{i+1} - x_i}" block />
                </li>
                <li><strong>Orden General (k):</strong> Se define a partir de los órdenes anteriores: 
                  <MathRenderer math="f[x_i, x_{i+1}, \dots, x_{i+k}] = \frac{f[x_{i+1}, \dots, x_{i+k}] - f[x_i, \dots, x_{i+k-1}]}{x_{i+k} - x_i}" block />
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><Info size={18} /> Interpretación e Intuición</h3>
              <ul>
                <li><strong>Pendientes secantes:</strong> Las de primer orden miden la inclinación local.</li>
                <li><strong>Generalización de Derivadas:</strong> Las de orden superior capturan la "aceleración" o variación de la variación (curvatura).</li>
                <li><strong>Variación Progresiva:</strong> Permiten observar cómo cambia el comportamiento de la función a medida que integramos más información.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3>Propiedades Importantes</h3>
              <ol>
                <li><strong>Simetría:</strong> No dependen del orden de los puntos. <MathRenderer math="f[x_0, x_1] = f[x_1, x_0]" />.</li>
                <li><strong>Linealidad:</strong> El operador de diferencia dividida es lineal respecto a las funciones.</li>
                <li><strong>Relación con derivadas:</strong> Si los nodos coinciden (límite), se relacionan con la derivada de orden k: <MathRenderer math="f[x, \dots, x] = \frac{f^{(k)}(x)}{k!}" />.</li>
                <li><strong>Unicidad:</strong> Determinan de manera única los coeficientes del polinomio interpolante.</li>
              </ol>
            </section>

            <section className={styles.section}>
              <h3><Table size={18} /> Tabla de Diferencias Divididas</h3>
              <p>Se organizan visualmente para facilitar el cálculo por columnas:</p>
              <div className={styles.infoBox} style={{ overflowX: 'auto' }}>
                <MathRenderer math="
                \begin{array}{c|c|c|c|c}
                x_i & f[x_i] & f[x_i,x_{i+1}] & f[x_i,x_{i+1},x_{i+2}] & \cdots \\
                \hline
                x_0 & y_0 & & & \\
                x_1 & y_1 & f[x_0,x_1] & & \\
                x_2 & y_2 & f[x_1,x_2] & f[x_0,x_1,x_2] & \\
                \vdots & \vdots & \vdots & \vdots & \ddots
                \end{array}" block />
              </div>
              <p><strong>Regla de construcción:</strong> Para el denominador, siempre restas el <MathRenderer math="x" /> del extremo final del intervalo menos el del extremo inicial.</p>
            </section>

            <section className={styles.section}>
              <h3>Interpretación como Coeficientes</h3>
              <p>Las diferencias de la <strong>diagonal superior</strong> (o primera fila según la tabla) son los coeficientes <MathRenderer math="a_k" />:</p>
              <ul>
                <li><MathRenderer math="f[x_0]" />: Término constante.</li>
                <li><MathRenderer math="f[x_0, x_1]" />: Coeficiente lineal.</li>
                <li><MathRenderer math="f[x_0, x_1, x_2]" />: Coeficiente cuadrático.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><Zap size={18} /> Ventajas y Desafíos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.example}>
                  <strong>Ventajas:</strong>
                  <ul>
                    <li>Construcción incremental.</li>
                    <li>Más eficientes que Lagrange.</li>
                    <li>Fácil actualización de datos.</li>
                  </ul>
                </div>
                <div className={styles.warningBox}>
                  <strong>Desafíos Numéricos:</strong>
                  <ul>
                    <li>Sensibilidad a puntos muy cercanos.</li>
                    <li>Acumulación de error de redondeo.</li>
                    <li>Dependencia de la distribución de nodos.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3><PlusSquare size={18} /> Ejemplo Paso a Paso</h3>
              <p>Dados los puntos: <MathRenderer math="(1,1), (2,4), (4,16)" />.</p>
              <div className={styles.example}>
                <ol>
                  <li><strong>Orden 0:</strong> <MathRenderer math="f[x_0]=1, f[x_1]=4, f[x_2]=16" />.</li>
                  <li><strong>Orden 1:</strong> 
                    <MathRenderer math="f[x_0,x_1]=\frac{4-1}{2-1}=3" /> y <MathRenderer math="f[x_1,x_2]=\frac{16-4}{4-2}=6" />.
                  </li>
                  <li><strong>Orden 2:</strong> 
                    <MathRenderer math="f[x_0,x_1,x_2]=\frac{6-3}{4-1}=1" />.
                  </li>
                </ol>
                <p><strong>Resultado:</strong> Coeficientes obtenidos: <MathRenderer math="1, 3, 1" />.</p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Módulo 4: Newton */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(4) ? styles.active : ''}`}
        ref={moduleRefs[4]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(4)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>4</div>
            <h2>Interpolación de Newton</h2>
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

      {/* Módulo 5: Interpolación Lineal */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(5) ? styles.active : ''}`}
        ref={moduleRefs[5]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(5)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>5</div>
            <h2>Interpolación Lineal</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(5) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Activity size={18} /> Definición</h3>
              <p>Es el caso más simple de interpolación, donde se utilizan dos puntos y se construye un polinomio de grado 1 (una recta).</p>
            </section>

            <section className={styles.section}>
              <h3>Formulación Matemática</h3>
              <MathRenderer math="P_1(x)=y_0 + \frac{y_1 - y_0}{x_1 - x_0}(x - x_0)" block />
              <p>Esta es la ecuación de la recta que pasa por dos puntos, donde el término fraccionario representa la pendiente.</p>
              
              <h4>Forma alternativa</h4>
              <MathRenderer math="P(x) = y_0 \cdot \frac{x - x_1}{x_0 - x_1} + y_1 \cdot \frac{x - x_0}{x_1 - x_0}" block />
            </section>

            <section className={styles.section}>
              <h3>Interpretación Geométrica</h3>
              <p>Se asume que el comportamiento de la función entre dos nodos es lineal. Es una aproximación local muy útil por su sencillez pero limitada por su falta de captura de curvatura.</p>
            </section>

            <section className={styles.section}>
              <h3><Info size={18} /> Ejemplo Práctico</h3>
              <p>Datos: <MathRenderer math="(1,2), (3,6)" />. Interpolación en <MathRenderer math="x=2" />:</p>
              <div className={styles.example}>
                <MathRenderer math="P(2) = 2 + \frac{6-2}{3-1}(2-1) = 2 + \frac{4}{2}(1) = 4" block />
              </div>
            </section>

            <div className={styles.warningBox}>
              <AlertCircle size={16} /> <strong>Error:</strong> El error de la interpolación lineal depende directamente de la "curvatura" (segunda derivada) de la función real.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterpolationTheory;
