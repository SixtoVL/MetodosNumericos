import React from 'react';
import Plotly from 'plotly.js/lib/core';
import createPlotlyComponent from 'react-plotly.js/factory';

const createPlotly = (createPlotlyComponent as any).default || createPlotlyComponent;
const Plot = createPlotly(Plotly);

interface InterpolationChartProps {
  puntosX: number[];
  puntosY: number[];
  polinomioLatex: string;
}

export const InterpolationChart: React.FC<InterpolationChartProps> = ({ puntosX, puntosY }) => {
  // Crear puntos para la curva del polinomio
  const minX = Math.min(...puntosX);
  const maxX = Math.max(...puntosX);
  const range = maxX - minX;
  const padding = range * 0.1 || 1;
  
  const plotX: number[] = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    plotX.push((minX - padding) + (i / steps) * (range + 2 * padding));
  }

  // Nota: Para graficar el polinomio real necesitaríamos evaluarlo en el frontend
  // o recibir los puntos de la curva desde el backend. 
  // Por ahora graficaremos solo los puntos y una línea que los une para evitar errores de evaluación.

  const data: any[] = [
    {
      x: puntosX,
      y: puntosY,
      type: 'scatter',
      mode: 'markers',
      marker: { color: '#ef4444', size: 10 },
      name: 'Puntos originales',
    },
    {
      x: puntosX,
      y: puntosY,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#3b82f6', shape: 'spline' },
      name: 'Polinomio (Aprox)',
    }
  ];

  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
      <Plot
        data={data}
        layout={{
          autosize: true,
          margin: { l: 50, r: 30, t: 30, b: 50 },
          xaxis: { title: 'x', gridcolor: '#f1f5f9' },
          yaxis: { title: 'y', gridcolor: '#f1f5f9' },
          plot_bgcolor: '#ffffff',
          paper_bgcolor: '#ffffff',
          showlegend: true,
          legend: { orientation: 'h', y: -0.2 }
        }}
        useResizeHandler
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};
