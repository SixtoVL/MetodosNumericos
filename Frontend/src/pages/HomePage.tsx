import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, BookOpen, BarChart3, ChevronRight, Zap } from 'lucide-react';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Zap size={14} /> Sistema Académico v1.0
          </div>
          <h1>Solución Avanzada de <br /><span>Métodos Numéricos</span></h1>
          <p>
            Plataforma interactiva diseñada para el aprendizaje y resolución de sistemas 
            complejos de ingeniería. Potencia tus cálculos con precisión simbólica.
          </p>
          <div className={styles.actions}>
            <button 
              className={styles.primaryBtn} 
              onClick={() => navigate('/metodos/newton/calculadora')}
            >
              Comenzar ahora <ChevronRight size={18} />
            </button>
            <button 
              className={styles.secondaryBtn}
              onClick={() => navigate('/metodos/newton/teoria')}
            >
              Ver Teoría
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.matrixPreview}>
            {/* Representación visual abstracta de una matriz */}
            {[...Array(9)].map((_, i) => (
              <div key={i} className={styles.matrixCell} style={{ opacity: Math.random() * 0.7 + 0.3 }}>
                {(Math.random() * 2 - 1).toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.iconBox}><Calculator /></div>
          <h3>Cálculo Analítico</h3>
          <p>Obtén derivadas y Jacobianas exactas mediante el motor simbólico SymPy.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconBox}><BarChart3 /></div>
          <h3>Visualización Interactiva</h3>
          <p>Gráficos dinámicos con Plotly para observar la convergencia de raíces.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconBox}><BookOpen /></div>
          <h3>Base Teórica</h3>
          <p>Documentación técnica y fundamentos matemáticos por cada método.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
