import React from 'react';
import Plotly from 'plotly.js/lib/core';
import createPlotlyComponent from 'react-plotly.js/factory';

const createPlotly = (createPlotlyComponent as any).default || createPlotlyComponent;
const Plot = createPlotly(Plotly);

interface InterpolationChartProps {
  puntosX: number[];
  puntosY: number[];
  polinomioLatex?: string;
  curva?: Array<{x: number, y: number}>;
  tangentes?: Array<{x0: number, y0: number, x1: number, y1: number, label: string}>;
}

export const InterpolationChart: React.FC<InterpolationChartProps> = ({ puntosX, puntosY, curva, tangentes }) => {
  const data: any[] = [
    {
      x: puntosX,
      y: puntosY,
      type: 'scatter',
      mode: 'markers',
      marker: { color: '#ef4444', size: 10, line: { color: 'white', width: 2 } },
      name: 'Puntos de Interpolación',
    }
  ];

  // Si tenemos la curva real calculada por el backend, la usamos
  if (curva && curva.length > 0) {
    data.push({
      x: curva.map(p => p.x),
      y: curva.map(p => p.y),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#3b82f6', width: 3 },
      name: 'Polinomio de Hermite',
    });
  } else {
    // Fallback: Spline sobre los puntos (menos preciso)
    data.push({
      x: puntosX,
      y: puntosY,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#3b82f6', shape: 'spline', dash: 'dot' },
      name: 'Polinomio (Aprox)',
    });
  }

  // Agregar tangentes si existen
  if (tangentes && tangentes.length > 0) {
    tangentes.forEach((t, i) => {
      data.push({
        x: [t.x0, t.x1],
        y: [t.y0, t.y1],
        type: 'scatter',
        mode: 'lines',
        line: { color: '#10b981', width: 2, dash: 'dash' },
        name: i === 0 ? 'Tangentes (Derivadas)' : undefined,
        showlegend: i === 0,
        hoverinfo: 'text',
        text: t.label
      });
    });
  }

  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <Plot
        data={data}
        layout={{
          autosize: true,
          margin: { l: 60, r: 30, t: 20, b: 60 },
          xaxis: { 
            title: 'x', 
            gridcolor: '#f1f5f9',
            zerolinecolor: '#94a3b8'
          },
          yaxis: { 
            title: 'y', 
            gridcolor: '#f1f5f9',
            zerolinecolor: '#94a3b8'
          },
          plot_bgcolor: '#ffffff',
          paper_bgcolor: '#ffffff',
          showlegend: true,
          legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' },
          hovermode: 'closest'
        }}
        config={{ responsive: true, displayModeBar: false }}
        useResizeHandler
        style={{ width: '100%', height: '450px' }}
      />
    </div>
  );
};
