import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import { NewtonPage } from './pages/NewtonPage';
import NewtonTheory from './pages/methods/newton/NewtonTheory';
import { FixedPointPage } from './pages/FixedPointPage';
import { FixedPointTheory } from './pages/methods/fixed_point/FixedPointTheory';
import InterpolationTheory from './pages/methods/interpolation/InterpolationTheory';
import { NewtonInterpolationPage } from './pages/methods/interpolation/NewtonInterpolationPage';
import { Menu } from 'lucide-react';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          {/* Botón Hamburguesa siempre presente */}
          {!isSidebarOpen && (
            <button className="mobile-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          )}

          {/* Overlay siempre presente si el menú está abierto */}
          {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar} 
          />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/metodos/newton/teoria" element={<NewtonTheory />} />
              <Route path="/metodos/newton/calculadora" element={<NewtonPage />} />
              <Route path="/metodos/punto-fijo/teoria" element={<FixedPointTheory />} />
              <Route path="/metodos/punto-fijo/calculadora" element={<FixedPointPage />} />
              <Route path="/metodos/interpolacion/teoria" element={<InterpolationTheory />} />
              <Route path="/metodos/interpolacion/newton" element={<NewtonInterpolationPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
