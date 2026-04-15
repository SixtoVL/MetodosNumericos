import React from 'react';
import { MathRenderer } from '../../../components/visualizers/MathRenderer';
import styles from '../newton/NewtonTheory.module.css';

export const FixedPointTheory: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.badge}>Teoría y Fundamentos</span>
        <h1>Método de Punto Fijo</h1>
        <p>
          El método de punto fijo es una técnica iterativa fundamental que permite encontrar raíces transformando la ecuación original en una forma funcional.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Parte I: Punto Fijo en una variable</h2>
        
        <h3>Definición del Problema</h3>
        <p>Dada una ecuación <MathRenderer math="f(x) = 0" inline />, buscamos transformarla en una forma equivalente:</p>
        <MathRenderer math="x = g(x)" block />
        <p>
          Un valor <MathRenderer math="\alpha" inline /> tal que <MathRenderer math="\alpha = g(\alpha)" inline /> se denomina <strong>punto fijo</strong> de la función <MathRenderer math="g" inline />.
        </p>

        <div className={styles.example}>
          <strong>Ejemplo Visual:</strong> La solución es el punto exacto donde la curva <MathRenderer math="y = g(x)" inline /> corta a la recta identidad <MathRenderer math="y = x" inline />.
        </div>

        <h3>Teorema de Convergencia</h3>
        <p>La convergencia está garantizada si en el intervalo de búsqueda se cumple:</p>
        <MathRenderer math="|g'(x)| < 1" block />
        <p>
          Si la derivada es positiva, la convergencia es monótona; si es negativa, las aproximaciones oscilan alrededor de la raíz.
        </p>
      </section>

      <hr />

      <section className={styles.section}>
        <h2>Parte II: Sistemas de Ecuaciones</h2>
        <p>
          Para sistemas multivariados, extendemos la idea a un vector de funciones <MathRenderer math="\mathbf{G}" inline />:
        </p>
        <MathRenderer math="\mathbf{X}^{(k+1)} = \mathbf{G}(\mathbf{X}^{(k)})" block />

        <h3>Modos de Actualización: ¿Simultáneos o Sucesivos?</h3>
        <p>Existen dos formas principales de aplicar las iteraciones en un sistema:</p>
        
        <div className={styles.infoBox}>
          <h4>1. Desplazamientos Simultáneos (Tipo Jacobi)</h4>
          <p>Es el método utilizado en esta aplicación. Todas las nuevas aproximaciones se calculan usando <strong>únicamente</strong> los valores del paso anterior.</p>
          <MathRenderer math="x_1^{(k+1)} = g_1(x_1^{(k)}, x_2^{(k)})" />
          <MathRenderer math="x_2^{(k+1)} = g_2(x_1^{(k)}, x_2^{(k)})" />
          <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}><em>Ventaja: Fácil de paralelizar y visualizar como una trayectoria clara.</em></p>
        </div>

        <div className={styles.infoBox} style={{borderLeftColor: '#10b981'}}>
          <h4>2. Desplazamientos Sucesivos (Tipo Gauss-Seidel)</h4>
          <p>Se utilizan los valores <strong>recién calculados</strong> de las variables para obtener las siguientes en la misma iteración.</p>
          <MathRenderer math="x_1^{(k+1)} = g_1(x_1^{(k)}, x_2^{(k)})" />
          <MathRenderer math="x_2^{(k+1)} = g_2(x_1^{(k+1)}, x_2^{(k)})" />
          <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}><em>Ventaja: Suele converger en menos iteraciones que el método simultáneo.</em></p>
        </div>

        <h3>Visualización Matemática en GeoGebra</h3>
        <p>
          Para visualizar correctamente el punto fijo en un plano, no basta con graficar las funciones de forma aislada. Debemos representar las <strong>curvas de nivel de equilibrio</strong>:
        </p>
        
        <div className={styles.warningBox}>
          <ul>
            <li>Para la primera función: graficamos la curva <MathRenderer math="x = g_1(x, y)" inline />.</li>
            <li>Para la segunda función: graficamos la curva <MathRenderer math="y = g_2(x, y)" inline />.</li>
          </ul>
          <p>La intersección de estas curvas representa el punto donde el sistema "deja de moverse", es decir, el <strong>Punto Fijo</strong>.</p>
        </div>

        <h3>Diferencias con Newton</h3>
        <ul>
          <li><strong>Costo:</strong> El Punto Fijo es más económico por iteración ya que no calcula el Jacobiano.</li>
          <li><strong>Velocidad:</strong> Su convergencia es <strong>lineal</strong>, mientras que Newton es cuadrática (duplica precisión cada paso).</li>
          <li><strong>Estabilidad:</strong> Es extremadamente sensible a cómo se despeje la función <MathRenderer math="g(x)" inline />.</li>
        </ul>
      </section>
    </div>
  );
};
