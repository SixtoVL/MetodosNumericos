import React from 'react';
import type { Tabla } from '../../schemas/newton.schema';
import Plotly from 'plotly.js/lib/core';
import createPlotlyComponent from 'react-plotly.js/factory';

// Manejo robusto para Vite/CJS
const createPlotly = (createPlotlyComponent as any).default || createPlotlyComponent;
const Plot = createPlotly(Plotly);

interface PlotlyChartProps {
  tabla: Tabla;
  dimension: number;
}

export const PlotlyChart: React.FC<PlotlyChartProps> = ({ tabla, dimension }) => {
  const nIdx = 0;
  const x1Idx = 1;
  const x2Idx = 2;

  const iterations = tabla.filas.map(f => f[nIdx] as number);
  const x1Values = tabla.filas.map(f => f[x1Idx] as number);

  let data: any[] = [];

  if (dimension === 1) {
    data = [
      {
        x: iterations,
        y: x1Values,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: '#2563eb' },
        name: 'Valor de x',
      }
    ];
  } else if (dimension >= 2) {
    const x2Values = tabla.filas.map(f => f[x2Idx] as number);
    data = [
      {
        x: x1Values,
        y: x2Values,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 10, color: '#2563eb' },
        line: { color: '#94a3b8' },
        name: 'Trayectoria NR',
      },
      {
        x: [x1Values[x1Values.length - 1]],
        y: [x2Values[x2Values.length - 1]],
        type: 'scatter',
        mode: 'markers',
        marker: { size: 15, color: '#16a34a', symbol: 'star' },
        name: 'Raíz Encontrada',
      }
    ];
  }

  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
        Visualización de Convergencia
      </h3>
      <Plot
        data={data}
        layout={{
          autosize: true,
          margin: { l: 50, r: 30, t: 30, b: 50 },
          hovermode: 'closest',
          xaxis: { title: dimension === 1 ? 'Iteración' : 'x₁', gridcolor: '#f1f5f9' },
          yaxis: { title: dimension === 1 ? 'Valor de x' : 'x₂', gridcolor: '#f1f5f9' },
          plot_bgcolor: '#ffffff',
          paper_bgcolor: '#ffffff',
        }}
        useResizeHandler
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};
