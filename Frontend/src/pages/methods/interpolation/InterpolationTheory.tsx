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
              <p>La interpolación de Lagrange proporciona una solución directa y explícita para construir el polinomio interpolante. A diferencia de otros métodos, no requiere resolver sistemas de ecuaciones ni construir tablas intermedias.</p>
              <div className={styles.infoBox}>
                <strong>Intuición de "Pesos":</strong> Puedes ver el polinomio de Lagrange como una <strong>suma ponderada</strong>. Cada valor <MathRenderer math="y_i" /> de tus datos tiene un "peso" o "influencia" <MathRenderer math="L_i(x)" /> que varía según el valor de <MathRenderer math="x" /> que quieras calcular.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Polinomios base de Lagrange</h3>
              <p>Para cada punto <MathRenderer math="i" />, se define un polinomio base <MathRenderer math="L_i(x)" /> que tiene una propiedad única: es "ciego" a todos los demás puntos.</p>
              <MathRenderer math="L_i(x) = \prod_{\substack{j=0 \\ j \neq i}}^{n} \frac{x - x_j}{x_i - x_j}" block />
              
              <div className={styles.infoBox}>
                <strong>Propiedad "Selector":</strong> 
                <MathRenderer math="L_i(x_j) = 1 \text{ si } i=j, \text{ else } 0" block />
                Geométricamente, el polinomio <MathRenderer math="L_i" /> sube hasta 1 en su propio nodo <MathRenderer math="x_i" /> y se apaga (vale 0) en todos los demás nodos de la tabla.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Fórmula de Lagrange</h3>
              <p>El polinomio final es simplemente la suma de todos los valores <MathRenderer math="y_i" /> multiplicados por su respectiva función de influencia:</p>
              <MathRenderer math="P_n(x)=\sum_{i=0}^{n} y_i L_i(x)" block />
            </section>

            <section className={styles.section}>
              <h3><AlertCircle size={18} /> El Desafío: El Fenómeno de Runge</h3>
              <p>Aunque Lagrange es elegante, tiene un peligro oculto en ingeniería. Al usar muchos puntos (grado alto) con un espaciamiento uniforme, el polinomio tiende a <strong>oscilar salvajemente</strong> cerca de los extremos de la tabla.</p>
              <div className={styles.warningBox}>
                <strong>Regla de oro:</strong> Evita usar un único polinomio de Lagrange de grado alto (mayor a 5 o 6). En su lugar, es preferible usar trazadores (splines) o el método de Newton si necesitas añadir datos progresivamente.
              </div>
            </section>

            <section className={styles.section}>
              <h3>Implementación y Eficiencia</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className={styles.example}>
                  <h4>Forma Baricéntrica</h4>
                  <p>Es la versión optimizada para computadoras. Reduce el costo de evaluación y mejora la estabilidad numérica:</p>
                  <MathRenderer math="P(x) = \frac{\sum \frac{w_i y_i}{x - x_i}}{\sum \frac{w_i}{x - x_i}}" block />
                </div>
                <div className={styles.infoBox}>
                  <h4>vs. Newton</h4>
                  <p><strong>Rigidez:</strong> Si tienes un polinomio de Lagrange para 10 puntos y añades el punto 11, debes <strong>recalcular todo</strong> desde cero. En Newton, solo añades un término más.</p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3><Zap size={18} /> Ventajas y Desventajas</h3>
              <div className={styles.methodGrid}>
                <div className={styles.infoBox} style={{ borderLeft: '4px solid #10b981' }}>
                  <strong>Ventajas:</strong>
                  <ul>
                    <li>Fórmula explícita y directa.</li>
                    <li>Excelente para demostraciones teóricas.</li>
                    <li>No requiere pasos previos (tablas).</li>
                  </ul>
                </div>
                <div className={styles.warningBox}>
                  <strong>Desventajas:</strong>
                  <ul>
                    <li>Computacionalmente costoso ($O(n^2)$).</li>
                    <li>Inestable para grados altos (Runge).</li>
                    <li>Difícil de actualizar con nuevos datos.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3><Activity size={18} /> Ejemplo Maestro: Construcción de Lagrange</h3>
              <p>Vamos a interpolar los siguientes 3 puntos para encontrar el valor estimado en <MathRenderer math="x = 3" />:</p>
              <div className={styles.example}>
                <MathRenderer math="\text{Puntos: } (1, 2), (2, 3), (4, 1)" block />
              </div>

              <h4>1. Polinomios Base (<MathRenderer math="L_i" />)</h4>
              <p>Calculamos la "influencia" de cada punto. Nota cómo el denominador es simplemente la resta de los nodos <MathRenderer math="x" />:</p>
              <div className={styles.methodGrid}>
                <div className={styles.infoBox}>
                  <MathRenderer math="L_0(x) = \frac{(x-2)(x-4)}{(1-2)(1-4)} = \frac{(x-2)(x-4)}{3}" block />
                </div>
                <div className={styles.infoBox}>
                  <MathRenderer math="L_1(x) = \frac{(x-1)(x-4)}{(2-1)(2-4)} = \frac{(x-1)(x-4)}{-2}" block />
                </div>
                <div className={styles.infoBox}>
                  <MathRenderer math="L_2(x) = \frac{(x-1)(x-2)}{(4-1)(4-2)} = \frac{(x-1)(x-2)}{6}" block />
                </div>
              </div>

              <h4>2. Armado del Polinomio Final</h4>
              <p>Multiplicamos cada base por su valor <MathRenderer math="y" /> correspondiente:</p>
              <div className={styles.infoBox}>
                <MathRenderer math="P(x) = 2 \cdot L_0(x) + 3 \cdot L_1(x) + 1 \cdot L_2(x)" block />
              </div>

              <h4>3. Evaluación en <MathRenderer math="x = 3" /></h4>
              <p>Sustituimos el valor deseado en cada base y sumamos los resultados:</p>
              <div className={styles.example} style={{ borderLeft: '4px solid #3b82f6', backgroundColor: '#eff6ff' }}>
                <ul>
                  <li><MathRenderer math="L_0(3) = (3-2)(3-4)/3 = -1/3" /></li>
                  <li><MathRenderer math="L_1(3) = (3-1)(3-4)/-2 = 1" /></li>
                  <li><MathRenderer math="L_2(3) = (3-1)(3-2)/6 = 1/3" /></li>
                </ul>
                <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
                <MathRenderer math="P(3) = 2(-1/3) + 3(1) + 1(1/3)" block />
                <MathRenderer math="P(3) = -2/3 + 3 + 1/3 = 2.66..." block />
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 600, color: '#1e40af' }}>
                  Intuición: El punto x=2 aportó toda su magnitud (peso 1) mientras que los extremos se restaron entre sí debido a la curvatura.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Módulo 3: Interpolación de Newton */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(3) ? styles.active : ''}`}
        ref={moduleRefs[3]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(3)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>3</div>
            <h2>Interpolación de Newton</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(3) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Target size={18} /> Objetivo del módulo</h3>
              <p>Desarrollar la forma de interpolación de Newton basada en el concepto de diferencias, tanto para puntos con espaciamiento arbitrario como para datos equiespaciados, comprendiendo sus ventajas computacionales e incrementales.</p>
            </section>

            <section className={styles.section}>
              <h3><PlusSquare size={18} /> Idea fundamental</h3>
              <p>El polinomio de Newton construye la solución de forma <strong>incremental</strong>. Esto permite agregar nuevos puntos sin reconstruir todo el cálculo desde cero, siendo significativamente más eficiente que la forma de Lagrange para grandes conjuntos de datos.</p>
              <MathRenderer 
                math="P_n(x) = a_0 + a_1(x - x_0) + a_2(x - x_0)(x - x_1) + \cdots + a_n(x - x_0)\dots(x - x_{n-1})" 
                block 
              />
            </section>

            {/* SUBSECCIÓN 1: DIFERENCIAS DIVIDIDAS */}
            <div className={styles.subModule}>
              <h2 className={styles.subModuleTitle}>1. Diferencias Divididas</h2>
              <section className={styles.section}>
                <p>
                  Las diferencias divididas son la herramienta fundamental para calcular los coeficientes <MathRenderer math="a_i" /> cuando los puntos tienen cualquier distribución en el eje X.
                </p>
                <div className={styles.infoBox}>
                  <strong>Ventajas Clave:</strong>
                  <ul>
                    <li>Construcción incremental: Permite añadir puntos sin reiniciar el cálculo.</li>
                    <li><strong>Flexibilidad total:</strong> A diferencia de otros métodos, no importa si los puntos están ordenados o su espaciamiento es irregular.</li>
                  </ul>
                </div>
              </section>

              <section className={styles.section}>
                <h3><PlusSquare size={18} /> Origen y Demostración</h3>
                <p>¿Por qué usamos diferencias divididas? Si planteamos el polinomio en su forma de Newton:</p>
                <MathRenderer math="P_n(x) = a_0 + a_1(x - x_0) + a_2(x - x_0)(x - x_1) + \dots" block />
                
                <p>Podemos encontrar los coeficientes evaluando en cada nodo progresivamente:</p>
                <div className={styles.example}>
                  <ol>
                    <li>
                      <strong>Para <MathRenderer math="x_0" />:</strong>
                      <MathRenderer math="P(x_0) = a_0 = f(x_0)" />
                      <br/>Luego, <MathRenderer math="a_0 = f[x_0]" />.
                    </li>
                    <li style={{ marginTop: '0.8rem' }}>
                      <strong>Para <MathRenderer math="x_1" />:</strong>
                      <MathRenderer math="P(x_1) = a_0 + a_1(x_1 - x_0) = f(x_1)" />
                      <br/>Despejando <MathRenderer math="a_1" />: <MathRenderer math="a_1 = \frac{f(x_1) - f(x_0)}{x_1 - x_0} = f[x_0, x_1]" />.
                    </li>
                    <li style={{ marginTop: '0.8rem' }}>
                      <strong>Para <MathRenderer math="x_2" />:</strong>
                      <MathRenderer math="P(x_2) = a_0 + a_1(x_2 - x_0) + a_2(x_2 - x_0)(x_2 - x_1) = f(x_2)" />
                      <br/>Al sustituir <MathRenderer math="a_0" /> y <MathRenderer math="a_1" /> y realizar el álgebra, surge la estructura de "diferencia de diferencias":
                      <MathRenderer math="a_2 = \frac{f[x_1, x_2] - f[x_0, x_1]}{x_2 - x_0} = f[x_0, x_1, x_2]" block />
                    </li>
                  </ol>
                </div>
              </section>

              <section className={styles.section}>
                <h3>Definición Formal y Recursiva</h3>
                <ul>
                  <li><strong>Orden 0:</strong> <MathRenderer math="f[x_i] = y_i" block /></li>
                  <li><strong>Orden 1:</strong> <MathRenderer math="f[x_i, x_{i+1}] = \frac{f[x_{i+1}] - f[x_i]}{x_{i+1} - x_i}" block /></li>
                  <li><strong>Orden k:</strong> <MathRenderer math="f[x_i, \dots, x_{i+k}] = \frac{f[x_{i+1}, \dots, x_{i+k}] - f[x_i, \dots, x_{i+k-1}]}{x_{i+k} - x_i}" block /></li>
                </ul>
                <div className={styles.warningBox}>
                  <AlertCircle size={16} /> <strong>Regla del Denominador:</strong> Nota que siempre se restan los <strong>extremos</strong> del intervalo de puntos actual (<MathRenderer math="x_{i+k} - x_i" />), ignorando los nodos intermedios.
                </div>
              </section>

              <section className={styles.section}>
                <h3>Propiedades e Intuición</h3>
                <ul>
                  <li><strong>Simetría:</strong> <MathRenderer math="f[x_0, x_1] = f[x_1, x_0]" />. El orden de los nodos no altera el valor del coeficiente.</li>
                  <li><strong>Relación con derivadas:</strong> Si la función es suave, las diferencias divididas se aproximan a las derivadas de la función: <MathRenderer math="f[x_0, \dots, x_k] \approx \frac{f^{(k)}(\xi)}{k!}" />.</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3><Table size={18} /> Tabla de Diferencias Divididas</h3>
                <div className={styles.infoBox} style={{ overflowX: 'auto' }}>
                  <MathRenderer math="
                  \begin{array}{c|c|c|c|c}
                  x_i & f[x_i] & f[x_i,x_{i+1}] & f[x_i,x_{i+1},x_{i+2}] & \cdots \\
                  \hline
                  x_0 & \mathbf{a_0} & & & \\
                  x_1 & y_1 & \mathbf{a_1} & & \\
                  x_2 & y_2 & f[x_1,x_2] & \mathbf{a_2} & \\
                  x_3 & y_3 & f[x_2,x_3] & f[x_1,x_2,x_3] & \ddots \\
                  \vdots & \vdots & \vdots & \vdots & \ddots
                  \end{array}" block />
                </div>
                <p>Los coeficientes <MathRenderer math="a_i" /> del polinomio de Newton corresponden siempre a la <strong>diagonal superior</strong> (o primera fila) de la tabla.</p>
              </section>

              <hr className={styles.divider} />

              <section className={styles.section}>
                <h3><Activity size={18} /> Ejemplo Maestro: De la Tabla al Polinomio</h3>
                <p>Integramos todo lo aprendido con un conjunto de 4 puntos para observar la construcción completa:</p>
                <div className={styles.example}>
                  <MathRenderer math="\text{Puntos: } (0, 1), (1, 3), (2, 7), (4, 21)" block />
                </div>

                <h4>1. Construcción de la Tabla</h4>
                <div className={styles.infoBox} style={{ overflowX: 'auto' }}>
                  <MathRenderer math="
                  \begin{array}{c|c|c|c|c}
                  x_i & f[x_i] & \text{Orden 1} & \text{Orden 2} & \text{Orden 3} \\
                  \hline
                  \mathbf{0} & \mathbf{1} & & & \\
                  \mathbf{1} & 3 & \mathbf{2} & & \\
                  \mathbf{2} & 7 & 4 & \mathbf{1} & \\
                  \mathbf{4} & 21 & 7 & 1 & \mathbf{0} \\
                  \end{array}" block />
                </div>

                <h4>2. Selección de Coeficientes</h4>
                <p>Tomamos los valores de la diagonal superior (resaltados):</p>
                <ul>
                  <li><MathRenderer math="a_0 = 1" /> (Término independiente)</li>
                  <li><MathRenderer math="a_1 = 2" /> (Pendiente inicial entre <MathRenderer math="x_0" /> y <MathRenderer math="x_1" />)</li>
                  <li><MathRenderer math="a_2 = 1" /> (Cambio de la pendiente entre los primeros tres puntos)</li>
                  <li><MathRenderer math="a_3 = 0" /> (Indica que los datos son cuadráticos, no cúbicos)</li>
                </ul>

                <h4>3. Armado del Polinomio de Newton</h4>
                <div className={styles.infoBox}>
                  <MathRenderer math="P(x) = a_0 + a_1(x-x_0) + a_2(x-x_0)(x-x_1) + a_3(x-x_0)(x-x_1)(x-x_2)" block />
                  <MathRenderer math="P(x) = 1 + 2(x-0) + 1(x-0)(x-1) + 0" block />
                  <MathRenderer math="\text{Simplificando: } P(x) = x^2 + x + 1" block />
                </div>

                <h4>4. Evaluación y Verificación</h4>
                <p>Si quisiéramos estimar el valor en <MathRenderer math="x=3" />:</p>
                <div className={styles.example}>
                  <MathRenderer math="P(3) = 1 + 2(3) + 3(3-1) = 1 + 6 + 6 = 13" block />
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                    Nota: Aunque el polinomio simplificado es <MathRenderer math="x^2+x+1" />, la forma de Newton permite evaluar sin necesidad de expandir el álgebra, lo cual es más estable numéricamente.
                  </p>
                </div>
              </section>
            </div>

            <hr className={styles.divider} />

            {/* SUBSECCIÓN 2: DIFERENCIAS FINITAS */}
            <div className={styles.subModule}>
              <h2 className={styles.subModuleTitle}>2. Diferencias Finitas</h2>
              <section className={styles.section}>
                <p>
                  Cuando los datos están equiespaciados (paso <MathRenderer math="h" /> constante), las diferencias divididas se simplifican a <strong>Diferencias Finitas</strong>. En este caso, no dividimos en cada paso de la tabla, sino que aplicamos un factor de corrección al final en la fórmula del polinomio.
                </p>
                <MathRenderer math="x_{i+1} - x_i = h \quad (\text{constante})" block />
              </section>

              <section className={styles.section}>
                <h3>La Variable Normalizada <MathRenderer math="s" /></h3>
                <p>Para simplificar las fórmulas, definimos una variable adimensional <MathRenderer math="s" /> que representa la distancia del punto <MathRenderer math="x" /> al punto de referencia en unidades de <MathRenderer math="h" />:</p>
                <div className={styles.infoBox}>
                  <MathRenderer math="s = \frac{x - x_{\text{ref}}}{h}" block />
                  <p>Esto permite que el polinomio se exprese en términos de combinaciones simples de <MathRenderer math="s" />, facilitando su cálculo manual y computacional.</p>
                </div>
              </section>

              <div className={styles.methodGrid}>
                {/* 2.1 Newton hacia adelante */}
                <div className={styles.infoBox} style={{ borderLeft: '4px solid #3b82f6' }}>
                  <h3>2.1 Newton hacia adelante (Gregory-Newton Forward)</h3>
                  <p>Se utiliza cuando <MathRenderer math="x" /> está cerca del inicio de la tabla. El punto de referencia es <MathRenderer math="x_0" />.</p>
                  
                  <h4>Operador de Diferencia (<MathRenderer math="\Delta" />)</h4>
                  <MathRenderer math="\Delta y_i = y_{i+1} - y_i" block />
                  
                  <h4>Construcción del Polinomio</h4>
                  <p>Se utilizan los valores de la <strong>diagonal descendente</strong> que parte de <MathRenderer math="y_0" />:</p>
                  <MathRenderer 
                    math="P_n(x) = y_0 + s\Delta y_0 + \frac{s(s-1)}{2!}\Delta^2 y_0 + \frac{s(s-1)(s-2)}{3!}\Delta^3 y_0 + \dots" 
                    block 
                  />
                  <div className={styles.example} style={{ fontSize: '0.9rem' }}>
                    <strong>Intuición:</strong> Los términos <MathRenderer math="s(s-1)\dots" /> van "avanzando" a través de los nodos desde el inicio.
                  </div>
                </div>

                {/* 2.2 Newton hacia atrás */}
                <div className={styles.infoBox} style={{ borderLeft: '4px solid #10b981' }}>
                  <h3>2.2 Newton hacia atrás (Gregory-Newton Backward)</h3>
                  <p>Se utiliza cuando <MathRenderer math="x" /> está cerca del final de la tabla. El punto de referencia es <MathRenderer math="x_n" />.</p>
                  
                  <h4>Operador de Diferencia (<MathRenderer math="\nabla" />)</h4>
                  <MathRenderer math="\nabla y_i = y_i - y_{i-1}" block />
                  
                  <h4>Construcción del Polinomio</h4>
                  <p>Se utilizan los valores de la <strong>diagonal ascendente</strong> que termina en <MathRenderer math="y_n" />:</p>
                  <MathRenderer 
                    math="P_n(x) = y_n + s\nabla y_n + \frac{s(s+1)}{2!}\nabla^2 y_n + \frac{s(s+1)(s+2)}{3!}\nabla^3 y_n + \dots" 
                    block 
                  />
                  <div className={styles.example} style={{ fontSize: '0.9rem' }}>
                    <strong>Intuición:</strong> Los términos <MathRenderer math="s(s+1)\dots" /> van "retrocediendo" a través de los nodos desde el final.
                  </div>
                </div>
              </div>

              <section className={styles.section} style={{ marginTop: '2rem' }}>
                <h3><Table size={18} /> Selección de Coeficientes en la Tabla</h3>
                <p>Visualmente, así es como eliges los datos de tu tabla de diferencias para cada método:</p>
                <div className={styles.infoBox} style={{ overflowX: 'auto', textAlign: 'center' }}>
                  <MathRenderer math="
                  \begin{array}{c|c|c|c}
                  x_i & y_i & \Delta y_i & \Delta^2 y_i \\
                  \hline
                  x_0 & \color{#3b82f6}{y_0} & & \\
                  x_1 & y_1 & \color{#3b82f6}{\Delta y_0} & \\
                  x_2 & y_2 & \Delta y_1 & \color{#3b82f6}{\Delta^2 y_0} \quad \leftarrow \text{Adelante} \\
                  \hline
                  \vdots & \vdots & \vdots & \vdots \\
                  \hline
                  x_{n-2} & y_{n-2} & & \color{#10b981}{\nabla^2 y_n} \quad \leftarrow \text{Atrás} \\
                  x_{n-1} & y_{n-1} & \color{#10b981}{\nabla y_n} & \\
                  x_n & \color{#10b981}{y_n} & & \\
                  \end{array}" block />
                </div>
              </section>

              <section className={styles.section}>
                <h3>Resumen Comparativo</h3>
                <table className={styles.comparisonTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Elemento</th>
                      <th style={{ padding: '0.5rem' }}>Newton Adelante</th>
                      <th style={{ padding: '0.5rem' }}>Newton Atrás</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '0.5rem' }}><strong>Referencia (<MathRenderer math="x_{\text{ref}}" />)</strong></td>
                      <td style={{ padding: '0.5rem' }}><MathRenderer math="x_0" /> (Primer punto)</td>
                      <td style={{ padding: '0.5rem' }}><MathRenderer math="x_n" /> (Último punto)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '0.5rem' }}><strong>Variable <MathRenderer math="s" /></strong></td>
                      <td style={{ padding: '0.5rem' }}><MathRenderer math="(x - x_0)/h" /></td>
                      <td style={{ padding: '0.5rem' }}><MathRenderer math="(x - x_n)/h" /></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '0.5rem' }}><strong>Signo en términos</strong></td>
                      <td style={{ padding: '0.5rem' }}><MathRenderer math="s(s-1)(s-2)\dots" /></td>
                      <td style={{ padding: '0.5rem' }}><MathRenderer math="s(s+1)(s+2)\dots" /></td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <hr className={styles.divider} />

              <section className={styles.section}>
                <h3><Activity size={18} /> Ejemplo Maestro: El Poder de h Constante</h3>
                <p>Para entender la diferencia práctica, observemos un mismo conjunto de datos equiespaciados analizado desde ambas direcciones.</p>
                <div className={styles.example}>
                  <MathRenderer math="\text{Puntos: } (10, 20), (20, 40), (30, 70), (40, 110)" block />
                  <p>Aquí el paso es constante: <MathRenderer math="h = 10" />.</p>
                </div>

                <h4>1. Tabla de Diferencias Finitas (Única)</h4>
                <div className={styles.infoBox} style={{ overflowX: 'auto' }}>
                  <MathRenderer math="
                  \begin{array}{c|c|c|c|c}
                  x_i & y_i & \Delta y & \Delta^2 y & \Delta^3 y \\
                  \hline
                  10 & \color{#3b82f6}{20} & & & \\
                  20 & 40 & \color{#3b82f6}{20} & & \\
                  30 & 70 & 30 & \color{#3b82f6}{10} & \\
                  40 & \color{#10b981}{110} & \color{#10b981}{40} & \color{#10b981}{10} & \color{#3b82f6}{0} \\
                  \end{array}" block />
                </div>

                <div className={styles.methodGrid}>
                  <div className={styles.example} style={{ borderTop: '3px solid #3b82f6' }}>
                    <h4>A. Newton Adelante (para x = 15)</h4>
                    <p>Referencia: <MathRenderer math="x_0=10" />. Distancia: <MathRenderer math="s = (15-10)/10 = 0.5" />.</p>
                    <p>Usamos la diagonal descendente (<span style={{color:'#3b82f6'}}>azul</span>):</p>
                    <MathRenderer 
                      math="P(0.5) = 20 + 0.5(20) + \frac{0.5(0.5-1)}{2!}(10) + 0" 
                      block 
                    />
                    <p><strong>Resultado:</strong> <MathRenderer math="20 + 10 - 1.25 = 28.75" /></p>
                  </div>

                  <div className={styles.example} style={{ borderTop: '3px solid #10b981' }}>
                    <h4>B. Newton Atrás (para x = 35)</h4>
                    <p>Referencia: <MathRenderer math="x_n=40" />. Distancia: <MathRenderer math="s = (35-40)/10 = -0.5" />.</p>
                    <p>Usamos la diagonal ascendente (<span style={{color:'#10b981'}}>verde</span>):</p>
                    <MathRenderer 
                      math="P(-0.5) = 110 + (-0.5)(40) + \frac{-0.5(-0.5+1)}{2!}(10) + 0" 
                      block 
                    />
                    <p><strong>Resultado:</strong> <MathRenderer math="110 - 20 - 1.25 = 88.75" /></p>
                  </div>
                </div>

                <div className={styles.infoBox} style={{ marginTop: '1.5rem' }}>
                  <Info size={16} /> <strong>Conclusión:</strong> Aunque la tabla es la misma, elegir el punto de referencia adecuado (pivote) minimiza el valor absoluto de <MathRenderer math="s" />, lo que mejora significativamente la precisión y estabilidad del cálculo.
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Módulo 4: Interpolación Lineal (Caso Particular) */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(4) ? styles.active : ''}`}
        ref={moduleRefs[4]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(4)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>4</div>
            <h2>Interpolación Lineal</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(4) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <p>
                Aunque ya hemos visto métodos potentes para <MathRenderer math="n" /> puntos, la interpolación lineal es el cimiento de la computación numérica. Es simplemente el <strong>caso particular</strong> de los métodos anteriores cuando solo tenemos 2 puntos (<MathRenderer math="n=1" />).
              </p>
            </section>

            <section className={styles.section}>
              <h3>1. Como caso de Diferencias Divididas (Newton)</h3>
              <p>Si aplicamos la <strong>Forma de Newton</strong> del Módulo 4 para dos puntos <MathRenderer math="(x_0, y_0)" /> y <MathRenderer math="(x_1, y_1)" />:</p>
              <MathRenderer math="P_1(x) = f[x_0] + f[x_0, x_1](x - x_0)" block />
              <p>Donde la diferencia dividida de primer orden <MathRenderer math="f[x_0, x_1]" /> es exactamente la <strong>pendiente</strong> <MathRenderer math="m" />:</p>
              <MathRenderer math="f[x_0, x_1] = \frac{y_1 - y_0}{x_1 - x_0}" block />
              <div className={styles.infoBox}>
                <strong>Conclusión:</strong> La fórmula clásica <MathRenderer math="y = y_0 + m(x - x_0)" /> no es más que un polinomio de Newton de grado 1.
              </div>
            </section>

            <section className={styles.section}>
              <h3>2. Como caso de Lagrange</h3>
              <p>Si usamos la fórmula del Módulo 2 para <MathRenderer math="n=1" />, los polinomios base de Lagrange se convierten en:</p>
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '1rem 0' }}>
                <MathRenderer math="L_0(x) = \frac{x - x_1}{x_0 - x_1}" />
                <MathRenderer math="L_1(x) = \frac{x - x_0}{x_1 - x_0}" />
              </div>
              <p>El polinomio resultante es:</p>
              <MathRenderer math="P_1(x) = y_0 \left( \frac{x - x_1}{x_0 - x_1} \right) + y_1 \left( \frac{x - x_0}{x_1 - x_0} \right)" block />
              <p>Esta forma es equivalente a la anterior, pero visualiza la influencia ponderada de cada punto.</p>
            </section>

            <section className={styles.section}>
              <h3>Interpretación Geométrica</h3>
              <p>Geométricamente, estamos trazando una <strong>línea recta</strong> que une los dos puntos. Es la aproximación más simple y supone que la función cambia a un ritmo constante entre los nodos.</p>
            </section>

            <section className={styles.section}>
              <h3>Análisis del Error</h3>
              <p>El error de truncamiento en la interpolación lineal nos dice qué tan lejos estamos de la función real <MathRenderer math="f(x)" />:</p>
              <MathRenderer math="R_1(x) = \frac{f''(\xi)}{2}(x - x_0)(x - x_1)" block />
              <div className={styles.infoBox}>
                <strong>¿Qué significa esto?</strong>
                <ul>
                  <li>Si la función real es una recta, <MathRenderer math="f''(x) = 0" />, por lo que el error es cero.</li>
                  <li>A mayor curvatura (<MathRenderer math="f''" />), mayor será el error de la recta.</li>
                  <li>El error es máximo cerca del centro del intervalo y cero en los nodos.</li>
                </ul>
              </div>
            </section>

            <section className={styles.section}>
              <h3>Interpolación Lineal Segmentaria (Piecewise)</h3>
              <p>En la práctica, si tenemos 10 puntos, no solemos usar un polinomio de grado 9 (que puede oscilar salvajemente). En su lugar, aplicamos <strong>interpolación lineal por tramos</strong>:</p>
              <ul>
                <li>Se conectan los puntos adyacentes con "micro-rectas".</li>
                <li>Es la base de los <strong>Splines</strong>.</li>
                <li>Garantiza que la aproximación sea "estable", aunque no sea suave en los puntos de unión (vértices).</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><Target size={18} /> ¿Qué problemas reales resuelve?</h3>
              <p>Aunque parece un método simple, la interpolación lineal es la "navaja suiza" en ingeniería por su velocidad y facilidad de implementación:</p>
              <ul>
                <li><strong>Lectura de Tablas Técnicas:</strong> Es el estándar para consultar tablas termodinámicas (vapor, presión) o financieras. Si tu dato está entre dos filas de la tabla, usas una recta para estimar el valor exacto.</li>
                <li><strong>Calibración de Sensores:</strong> Los sensores físicos (voltaje, presión, temperatura) a menudo se calibran tomando dos puntos de referencia y trazando una recta para convertir la señal eléctrica en una unidad legible.</li>
                <li><strong>Optimización de Software (LUTs):</strong> Para ahorrar batería o CPU, el software de alto rendimiento evita calcular funciones complejas ($sin, log$) repetidamente; en su lugar, consulta una "Tabla de Búsqueda" (Look-up Table) e interpola linealmente entre los valores más cercanos.</li>
                <li><strong>Navegación y GPS:</strong> Si un receptor GPS recibe tu posición cada segundo, el software usa interpolación lineal para "dibujar" el movimiento fluido del vehículo en el mapa entre cada actualización.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><Zap size={18} /> Aplicación en Computación: El "Lerp"</h3>
              <p>En videojuegos y gráficos por computadora, esta fórmula se conoce como <strong>Lerp</strong> (Linear Interpolation). Se usa para animaciones suaves:</p>
              <MathRenderer math="\text{lerp}(a, b, t) = a + t(b - a)" block />
              <p>Donde <MathRenderer math="t" /> es un porcentaje entre 0 y 1. Si notas la estructura, es exactamente la misma que la de Newton/Diferencias Divididas que explicamos antes.</p>
            </section>

            <section className={styles.section}>
              <h3><Info size={18} /> Ejemplo Unificado</h3>
              <p>Dados <MathRenderer math="(2, 4)" /> y <MathRenderer math="(5, 10)" />, estimar en <MathRenderer math="x=3" />:</p>
              <div className={styles.example}>
                <ol>
                  <li><strong>Pendiente (Diff. Dividida):</strong> <MathRenderer math="f[2, 5] = \frac{10-4}{5-2} = \frac{6}{3} = 2" />.</li>
                  <li><strong>Newton:</strong> <MathRenderer math="P(3) = 4 + 2(3 - 2) = 4 + 2 = 6" />.</li>
                  <li><strong>Lagrange:</strong> <MathRenderer math="P(3) = 4(\frac{3-5}{2-5}) + 10(\frac{3-2}{5-2}) = 4(\frac{-2}{-3}) + 10(\frac{1}{3}) = \frac{8}{3} + \frac{10}{3} = \frac{18}{3} = 6" />.</li>
                </ol>
                <strong>¡Ambos caminos llevan al mismo resultado!</strong>
              </div>
            </section>

            <div className={styles.warningBox}>
              <AlertCircle size={16} /> <strong>Limitación:</strong> Al usar solo 2 puntos, ignoramos cualquier curvatura (aceleración) de la función original, lo que puede generar errores grandes si los puntos están muy separados.
            </div>
          </div>
        )}
      </div>

      {/* Módulo 5: Interpolación de Hermite */}
      <div 
        className={`${styles.moduleWrapper} ${activeModules.includes(5) ? styles.active : ''}`}
        ref={moduleRefs[5]}
      >
        <button className={styles.moduleHeader} onClick={() => toggleModule(5)}>
          <div className={styles.moduleTitle}>
            <div className={styles.moduleNumber}>5</div>
            <h2>Interpolación de Hermite</h2>
          </div>
          <ChevronDown className={styles.icon} size={20} />
        </button>

        {activeModules.includes(5) && (
          <div className={styles.moduleContent}>
            <section className={styles.section}>
              <h3><Activity size={18} /> Idea General: El Polinomio Osculador</h3>
              <p>
                La interpolación de Hermite es una extensión potente de los métodos de Newton y Lagrange. Su diferencia fundamental radica en que <strong>no solo utiliza puntos (x, y)</strong>, sino también la <strong>información de la pendiente (derivada)</strong> en esos puntos.
              </p>
              <div className={styles.infoBox}>
                En latín, <em>osculare</em> significa "besar". El polinomio de Hermite se conoce como osculador porque "besa" a la función real, compartiendo no solo su valor sino también su dirección en cada nodo.
              </div>
            </section>

            <section className={styles.section}>
              <h3><Target size={18} /> ¿Cuándo se utiliza?</h3>
              <p>Es el estándar en ingeniería cuando necesitamos trayectorias suaves:</p>
              <ul>
                <li><strong>Física:</strong> Cuando conoces la posición y la velocidad de un objeto.</li>
                <li><strong>Gráficos:</strong> Para crear curvas suaves (Splines de Hermite) en animaciones.</li>
                <li><strong>Simulaciones:</strong> Donde el cambio de ritmo (derivada) es tan importante como el valor absoluto.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3><GitFork size={18} /> La Clave: Nodos Duplicados</h3>
              <p>Para incluir la derivada en una tabla de diferencias divididas, Hermite propone un "truco" matemático: <strong>Duplicar los nodos</strong>.</p>
              <MathRenderer math="\text{Si tienes } x_0, x_1 \implies \text{Escribes } z_0=x_0, z_1=x_0, z_2=x_1, z_3=x_1" block />
              <p>¿Por qué? Porque un nodo representa el valor de la función y su gemelo representa la derivada.</p>
            </section>

            <section className={styles.section}>
              <h3><FunctionSquare size={18} /> Regla de la Derivada</h3>
              <p>Normalmente, una diferencia dividida es <MathRenderer math="\frac{f(z_1) - f(z_0)}{z_1 - z_0}" />. Pero si <MathRenderer math="z_1 = z_0" />, tendríamos una división entre cero.</p>
              <div className={styles.warningBox}>
                <AlertCircle size={16} /> <strong>La Regla de Oro:</strong> Cuando los nodos son iguales, la diferencia dividida se sustituye directamente por el valor de la derivada:
                <MathRenderer math="f[x_i, x_i] = f'(x_i)" block />
              </div>
            </section>

            <section className={styles.section}>
              <h3><Table size={18} /> Estructura de la Tabla de Hermite</h3>
              <div className={styles.infoBox} style={{ overflowX: 'auto' }}>
                <MathRenderer math="
                \begin{array}{c|c|c|c}
                z_i & f[z_i] & \text{Orden 1} & \text{Orden 2} \\
                \hline
                x_0 & y_0 & & \\
                x_0 & y_0 & \mathbf{f'(x_0)} & \\
                x_1 & y_1 & f[x_0, x_1] & \mathbf{f[x_0, x_0, x_1]} \\
                x_1 & y_1 & f'(x_1) & f[x_0, x_1, x_1] \\
                \end{array}" block />
              </div>
            </section>

            <hr className={styles.divider} />

            <section className={styles.section}>
              <h3><Activity size={18} /> Ejemplo Maestro: Hermite Paso a Paso</h3>
              <p>Hallar el polinomio que cumple:</p>
              <div className={styles.example}>
                <MathRenderer math="f(1)=2, f'(1)=3 \quad \text{y} \quad f(2)=5, f'(2)=4" block />
              </div>

              <h4>1. Preparación de Nodos (z)</h4>
              <p>Duplicamos cada punto y su valor de función:</p>
              <MathRenderer math="z = \{1, 1, 2, 2\} \implies f(z) = \{2, 2, 5, 5\}" block />

              <h4>2. Tabla de Diferencias de Hermite</h4>
              <p>Construimos la tabla usando la regla de la derivada para nodos repetidos (Orden 1) y el método de Newton para órdenes superiores:</p>
              <div className={styles.infoBox} style={{ overflowX: 'auto' }}>
                <MathRenderer math="
                \begin{array}{c|c|c|c|c}
                z_i & f[z_i] & \text{Orden 1} & \text{Orden 2} & \text{Orden 3} \\
                \hline
                1 & \mathbf{2} & & & \\
                1 & 2 & \mathbf{3} \text{ (f')} & & \\
                2 & 5 & 3 & \mathbf{0} & \\
                2 & 5 & 4 \text{ (f')} & 1 & \mathbf{1} \\
                \end{array}" block />
              </div>

              <h4>3. Selección de Coeficientes</h4>
              <p>Tomamos los valores de la diagonal superior resaltados en la tabla:</p>
              <ul>
                <li><MathRenderer math="a_0 = 2" /></li>
                <li><MathRenderer math="a_1 = 3" /></li>
                <li><MathRenderer math="a_2 = 0" /></li>
                <li><MathRenderer math="a_3 = 1" /></li>
              </ul>

              <h4>4. Construcción del Polinomio</h4>
              <p>Usamos la diagonal superior <MathRenderer math="\{2, 3, 0, 1\}" />:</p>
              <div className={styles.infoBox}>
                <MathRenderer math="P(x) = 2 + 3(x-1) + 0(x-1)^2 + 1(x-1)^2(x-2)" block />
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#64748b' }}>
                  Nota: El grado del polinomio resultante es <MathRenderer math="2n+1" />. Con 2 puntos, obtenemos un polinomio de grado 3 (cúbico).
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h3><Zap size={18} /> Resumen de Supervivencia</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.example}>
                  <strong>Reglas Rápidas:</strong>
                  <ul>
                    <li>Duplicar nodos y valores.</li>
                    <li>Usar <MathRenderer math="f'(x)" /> si los nodos son iguales.</li>
                    <li>Diferencias superiores son normales.</li>
                  </ul>
                </div>
                <div className={styles.warningBox}>
                  <strong>Errores a evitar:</strong>
                  <ul>
                    <li>Olvidar duplicar la columna de <MathRenderer math="f(z)" />.</li>
                    <li>Intentar dividir por <MathRenderer math="x_i - x_i" />.</li>
                    <li>Tomar mal la diagonal de coeficientes.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterpolationTheory;
