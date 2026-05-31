import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calculator, BookOpen, Settings, ChevronDown, ChevronRight, List, X } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isNewtonOpen, setIsNewtonOpen] = useState(true);
  const [isFixedPointOpen, setIsFixedPointOpen] = useState(false);
  const [isInterpolationOpen, setIsInterpolationOpen] = useState(false);

  const toggleNewton = () => {
    setIsNewtonOpen(!isNewtonOpen);
  };

  const toggleFixedPoint = () => {
    setIsFixedPointOpen(!isFixedPointOpen);
  };

  const toggleInterpolation = () => {
    setIsInterpolationOpen(!isInterpolationOpen);
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={styles.logoIcon}>MN</div>
          <span>Métodos Numéricos</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <span className={styles.groupLabel}>General</span>
          <NavLink to="/" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
            <Home size={20} /> Inicio
          </NavLink>
        </div>

        <div className={styles.navGroup}>
          <span className={styles.groupLabel}>Sistemas No Lineales</span>
          
          {/* Newton-Raphson */}
          <div 
            className={styles.methodTitle} 
            onClick={toggleNewton}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {isNewtonOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            Newton-Raphson
          </div>
          
          {isNewtonOpen && (
            <div className={styles.subMenu}>
              <NavLink to="/metodos/newton/teoria" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <BookOpen size={18} /> Teoría
              </NavLink>
              <NavLink to="/metodos/newton/calculadora" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <Calculator size={18} /> Calculadora
              </NavLink>
            </div>
          )}

          {/* Punto Fijo */}
          <div 
            className={styles.methodTitle} 
            onClick={toggleFixedPoint}
            style={{ cursor: 'pointer', userSelect: 'none', marginTop: '0.5rem' }}
          >
            {isFixedPointOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            Punto Fijo
          </div>
          
          {isFixedPointOpen && (
            <div className={styles.subMenu}>
              <NavLink to="/metodos/punto-fijo/teoria" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <BookOpen size={18} /> Teoría
              </NavLink>
              <NavLink to="/metodos/punto-fijo/calculadora" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <Calculator size={18} /> Calculadora
              </NavLink>
            </div>
          )}

          {/* Interpolación */}
          <div 
            className={styles.methodTitle} 
            onClick={toggleInterpolation}
            style={{ cursor: 'pointer', userSelect: 'none', marginTop: '0.5rem' }}
          >
            {isInterpolationOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            Interpolación
          </div>
          
          {isInterpolationOpen && (
            <div className={styles.subMenu}>
              <NavLink to="/metodos/interpolacion/teoria" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <BookOpen size={18} /> Teoría
              </NavLink>
              <NavLink to="/metodos/interpolacion/newton" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <Calculator size={18} /> Interpolación de Newton
              </NavLink>
              <NavLink to="/metodos/interpolacion/hermite" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <Calculator size={18} /> Interpolación de Hermite
              </NavLink>
              <NavLink to="/metodos/interpolacion/lagrange" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
                <Calculator size={18} /> Interpolación de Lagrange
              </NavLink>
            </div>
          )}
        </div>

        <div className={styles.navGroup}>
          <span className={styles.groupLabel}>Próximos Métodos</span>
          <div className={styles.lockedLink}><List size={20} /> Bisección</div>
          <div className={styles.lockedLink}><List size={20} /> Gauss-Seidel</div>
        </div>
      </nav>

      <div className={styles.footer}>
        <NavLink to="/settings" onClick={onClose} className={({isActive}) => isActive ? styles.active : ''}>
          <Settings size={20} /> Configuración
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
