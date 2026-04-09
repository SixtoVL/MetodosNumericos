import React from 'react';
import type { Tabla, GraficaData } from '../../schemas/newton.schema';
import Plotly from 'plotly.js/lib/core';
import createPlotlyComponent from 'react-plotly.js/factory';

// Manejo robusto para Vite/CJS
const createPlotly = (createPlotlyComponent as any).default || createPlotlyComponent;
const Plot = createPlotly(Plotly);

interface PlotlyChartProps {
  tabla: Tabla;
  dimension: number;
  datosGrafica?: GraficaData[];
}

export const PlotlyChart: React.FC<PlotlyChartProps> = ({ tabla, dimension, datosGrafica }) => {
  const nIdx = 0;
  const x1Idx = 1;
  const x2Idx = 2;

  const x1Iter = tabla.filas.map(f => f[x1Idx] as number);
  
  let data: any[] = [];

  // 1. Añadimos primero las funciones del sistema (Capas de fondo)
  if (datosGrafica) {
    datosGrafica.forEach((g) => {
      if (g.type === 'function_1d') {
        data.push({
          x: g.x,
          y: g.y,
          type: 'scatter',
          mode: 'lines',
          line: { color: 'rgba(37, 99, 235, 0.4)', width: 3 },
          name: g.name,
        });
      } else if (g.type === 'contour_2d' && g.z) {
        data.push({
          x: g.x,
          y: g.y,
          z: g.z,
          type: 'contour',
          contours: {
            coloring: 'none',
            showlabels: false,
            start: 0,
            end: 0,
            size: 1
          },
          line: { width: 2 },
          name: g.name,
          showlegend: true
        });
      }
    });
  }

  // 2. Añadimos la trayectoria del método de Newton (Capa superior)
  if (dimension === 1) {
    // En 1D graficamos los puntos sobre la curva y = f(x)
    // Para simplificar, los ponemos en el eje X (y=0) o evaluados
    data.push({
      x: x1Iter,
      y: x1Iter.map(() => 0), // Puntos sobre el eje X para ver avance
      type: 'scatter',
      mode: 'markers+lines',
      marker: { color: '#ef4444', size: 8 },
      line: { color: '#f87171', dash: 'dot' },
      name: 'Pasos Newton',
    });
  } else if (dimension >= 2) {
    const x2Iter = tabla.filas.map(f => f[x2Idx] as number);
    data.push({
      x: x1Iter,
      y: x2Iter,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { size: 8, color: '#ef4444' },
      line: { color: 'rgba(15, 23, 42, 0.7)', width: 2 },
      name: 'Trayectoria NR',
    });
    
    // Punto final resaltado
    data.push({
      x: [x1Iter[x1Iter.length - 1]],
      y: [x2Iter[x2Iter.length - 1]],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 14, color: '#16a34a', symbol: 'star' },
      name: 'Solución',
    });
  }

  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
        Interpretación Geométrica
      </h3>
      <Plot
        data={data}
        layout={{
          autosize: true,
          margin: { l: 50, r: 30, t: 30, b: 50 },
          hovermode: 'closest',
          xaxis: { 
            title: dimension === 1 ? 'Variable x' : 'x₁', 
            gridcolor: '#f1f5f9',
            zeroline: true,
            zerolinecolor: '#94a3b8'
          },
          yaxis: { 
            title: dimension === 1 ? 'f(x)' : 'x₂', 
            gridcolor: '#f1f5f9',
            zeroline: true,
            zerolinecolor: '#94a3b8'
          },
          plot_bgcolor: '#ffffff',
          paper_bgcolor: '#ffffff',
          legend: { orientation: 'h', y: -0.2 }
        }}
        useResizeHandler
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
};
