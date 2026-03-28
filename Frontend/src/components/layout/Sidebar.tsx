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

  const toggleNewton = () => {
    setIsNewtonOpen(!isNewtonOpen);
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
