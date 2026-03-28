import React from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import styles from './NewtonTheory.module.css';

const NewtonTheory: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.badge}>Fundamentos Matemáticos</span>
        <h1>Método de Newton-Raphson Analítico</h1>
        <p>
          El método de Newton-Raphson es un algoritmo eficiente para encontrar aproximaciones de los ceros o raíces de una función real. 
          En su versión multivariable, es la piedra angular para resolver sistemas de ecuaciones no lineales.
        </p>
      </header>

      <section className={styles.section}>
        <h2>1. Definición del Problema</h2>
        <p>Dado un sistema de $n$ ecuaciones no lineales con $n$ incógnitas:</p>
        <MathRenderer math="F(\mathbf{x}) = \mathbf{0}" block />
        <p>Donde $\mathbf{x} = [x_1, x_2, \dots, x_n]^T$ es el vector de variables y $F$ es el vector de funciones.</p>
      </section>

      <section className={styles.section}>
        <h2>2. La Matriz Jacobiana</h2>
        <p>
          Para sistemas multivariables, la derivada se generaliza mediante la **Matriz Jacobiana** $J(\mathbf{x})$, 
          que contiene todas las derivadas parciales de primer orden:
        </p>
        <MathRenderer 
          math="J(\mathbf{x}) = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \dots & \frac{\partial f_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_n}{\partial x_1} & \dots & \frac{\partial f_n}{\partial x_n} \end{bmatrix}" 
          block 
        />
      </section>

      <section className={styles.section}>
        <h2>3. Algoritmo de Iteración</h2>
        <p>El método genera una sucesión de aproximaciones mediante la fórmula:</p>
        <MathRenderer math="\mathbf{x}^{(k+1)} = \mathbf{x}^{(k)} - J(\mathbf{x}^{(k)})^{-1} F(\mathbf{x}^{(k)})" block />
        <p>En la práctica, para evitar invertir la matriz, resolvemos el sistema lineal:</p>
        <MathRenderer math="J(\mathbf{x}^{(k)}) \Delta \mathbf{x} = -F(\mathbf{x}^{(k)})" block />
        <p>Y actualizamos: $\mathbf{x}^{(k+1)} = \mathbf{x}^{(k)} + \Delta \mathbf{x}$.</p>
      </section>

      <div className={styles.infoBox}>
        <strong>💡 Ventaja Analítica:</strong> Nuestro sistema utiliza SymPy para calcular el Jacobiano de forma simbólica, 
        lo que garantiza una precisión absoluta en las derivadas y una convergencia cuadrática óptima.
      </div>
    </div>
  );
};

export default NewtonTheory;
