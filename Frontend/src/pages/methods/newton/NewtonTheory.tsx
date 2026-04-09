import React from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import styles from './NewtonTheory.module.css';

const NewtonTheory: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.badge}>Teoría y Fundamentos</span>
        <h1>Método de Newton-Raphson</h1>
        <p>
          El método de Newton es uno de los algoritmos más potentes y conocidos para encontrar aproximaciones de las raíces de una función.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Parte I: Newton en una variable</h2>
        
        <h3>Problema que resuelve</h3>
        <p>Queremos encontrar soluciones de:</p>
        <MathRenderer math="f(x) = 0" block />
        <p>Es decir, <strong>raíces de una función</strong>.</p>
        <div className={styles.example}>
          Ejemplo: <MathRenderer math="x^2 - 2 = 0 \Rightarrow x = \sqrt{2}" />
        </div>

        <h3>Idea fundamental (geométrica)</h3>
        <p>El método de Newton se basa en aproximar la función con su <strong>recta tangente</strong>.</p>
        <p>En un punto <MathRenderer math="x_n" />, la tangente es:</p>
        <MathRenderer math="y = f(x_n) + f'(x_n)(x - x_n)" block />
        <p>Buscamos dónde esa recta cruza el eje <MathRenderer math="x" /> (es decir, cuando <MathRenderer math="y = 0" />).</p>

        <h3>Derivación de la fórmula</h3>
        <p>Igualamos la recta a cero:</p>
        <MathRenderer math="0 = f(x_n) + f'(x_n)(x_{n+1} - x_n)" block />
        <p>Despejando obtenemos la fórmula de actualización:</p>
        <MathRenderer math="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" block />

        <h3>Algoritmo</h3>
        <ol>
          <li>Elegir un valor inicial <MathRenderer math="x_0" />.</li>
          <li>Repetir:
            <ul>
              <li>Calcular <MathRenderer math="f(x_n)" />.</li>
              <li>Calcular <MathRenderer math="f'(x_n)" />.</li>
              <li>Actualizar: <MathRenderer math="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" />.</li>
            </ul>
          </li>
          <li>Detener cuando:
            <ul>
              <li><MathRenderer math="|x_{n+1} - x_n|" /> sea pequeño, o</li>
              <li><MathRenderer math="|f(x_n)|" /> sea pequeño.</li>
            </ul>
          </li>
        </ol>

        <h3>Convergencia</h3>
        <p>El método de Newton tiene <strong>convergencia cuadrática</strong>:</p>
        <MathRenderer math="\text{error}_{n+1} \approx C \cdot \text{error}_n^2" block />
        <p>Esto significa que el número de cifras correctas se duplica en cada iteración.</p>

        <h3>Condiciones para que funcione bien</h3>
        <ul>
          <li>La función debe ser derivable.</li>
          <li>Su derivada no debe ser cero cerca de la raíz.</li>
          <li>El punto inicial debe estar cerca de la raíz.</li>
        </ul>

        <h3>Cuándo falla</h3>
        <h4>Derivada cero</h4>
        <p>Si <MathRenderer math="f'(x_n) = 0" />, se produce una división por cero.</p>
        <h4>Punto inicial inadecuado</h4>
        <p>Puede diverger, irse al infinito u oscilar.</p>
        <h4>Funciones no suaves</h4>
        <p>Puntas o discontinuidades dificultan la convergencia.</p>
        <h4>Raíces múltiples</h4>
        <p>Si la raíz tiene multiplicidad mayor que 1, la convergencia se vuelve <strong>lineal</strong>.</p>

        <h3>Interpretación del error</h3>
        <p>Sea <MathRenderer math="r" /> la raíz real. Definimos el error como <MathRenderer math="e_n = x_n - r" />. Entonces:</p>
        <MathRenderer math="e_{n+1} \approx \frac{f''(r)}{2f'(r)} e_n^2" block />

        <div className={styles.infoBox}>
          <strong>Variante para raíces múltiples:</strong> Si la raíz tiene multiplicidad <MathRenderer math="m" />, se puede usar:
          <MathRenderer math="x_{n+1} = x_n - m \frac{f(x_n)}{f'(x_n)}" block />
          Esto mejora la convergencia.
        </div>

        <p><strong>Intuición:</strong> Newton consiste en reemplazar una función complicada por su aproximación lineal (tangente), resolver esa aproximación y repetir el proceso.</p>
      </section>

      <hr />

      <section className={styles.section}>
        <h2>Parte II: Transición a varias variables</h2>
        <p>
          El método de Newton en varias variables es una extensión natural. Mientras que en una variable buscamos <MathRenderer math="f(x) = 0" />, 
          en varias variables resolvemos un sistema:
        </p>
        <MathRenderer math="F(\mathbf{x}) = \mathbf{0}" block />
        <p>donde <MathRenderer math="\mathbf{x} = (x_1, \dots, x_n)" /> y <MathRenderer math="F = (f_1, \dots, f_n)" />.</p>
        <ul>
          <li>En una variable se usa una <strong>recta</strong> (tangente).</li>
          <li>En varias variables se usa un <strong>plano o hiperplano</strong>.</li>
        </ul>

        <h3>Aproximación lineal multivariable</h3>
        <p>La expansión de Taylor de primer orden es:</p>
        <MathRenderer math="F(\mathbf{x}) \approx F(\mathbf{x}_n) + J(\mathbf{x}_n)(\mathbf{x} - \mathbf{x}_n)" block />

        <h3>El Jacobiano</h3>
        <p>La matriz de derivadas parciales que juega el papel de la derivada es el <strong>Jacobiano</strong>:</p>
        <MathRenderer math="J(x,y) = \begin{bmatrix} \frac{\partial f_1}{\partial x} & \frac{\partial f_1}{\partial y} \\ \frac{\partial f_2}{\partial x} & \frac{\partial f_2}{\partial y} \end{bmatrix}" block />

        <h3>Fórmula del método</h3>
        <p>Queremos <MathRenderer math="F(\mathbf{x}_{n+1}) = 0" />, lo que nos lleva a:</p>
        <MathRenderer math="\mathbf{x}_{n+1} = \mathbf{x}_n - J(\mathbf{x}_n)^{-1} F(\mathbf{x}_n)" block />

        <div className={styles.warningBox}>
          <strong>Forma práctica:</strong> En lugar de invertir el Jacobiano, resolvemos el sistema lineal:
          <MathRenderer math="J(\mathbf{x}_n)\Delta \mathbf{x} = -F(\mathbf{x}_n)" block />
          Y actualizamos: <MathRenderer math="\mathbf{x}_{n+1} = \mathbf{x}_n + \Delta \mathbf{x}" />.
        </div>

        <h3>Dificultades y Convergencia</h3>
        <ul>
          <li><strong>Jacobiano no invertible:</strong> Si <MathRenderer math="\det(J) = 0" />, el método no puede continuar.</li>
          <li><strong>Costo computacional:</strong> Requiere calcular derivadas parciales y resolver sistemas lineales.</li>
          <li><strong>Sensibilidad:</strong> Es más sensible al punto inicial que en una dimensión.</li>
        </ul>
        <p>La convergencia sigue siendo <strong>cuadrática</strong> bajo las condiciones adecuadas.</p>

        <div className={styles.infoBox}>
          <strong>Resumen:</strong>
          <ul>
            <li>Newton 1D: tangente <MathRenderer math="\rightarrow" /> número.</li>
            <li>Newton multivariable: plano <MathRenderer math="\rightarrow" /> vector.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default NewtonTheory;
