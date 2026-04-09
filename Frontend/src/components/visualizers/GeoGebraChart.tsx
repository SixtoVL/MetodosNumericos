import React, { useEffect, useRef } from 'react';
import { MathRenderer } from './MathRenderer';
import type { Tabla } from '../../schemas/newton.schema';

interface GeoGebraChartProps {
  tabla: Tabla;
  dimension: number;
  funciones: string[];
}

declare global {
  interface Window {
    GGBApplet: any;
  }
}

export const GeoGebraChart: React.FC<GeoGebraChartProps> = ({ tabla, dimension, funciones }) => {
  const containerId = "ggb-element";
  const containerRef = useRef<HTMLDivElement>(null);
  const appletRef = useRef<any>(null);

  // Silenciador de logs ruidosos de GeoGebra
  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const filter = (args: any[], originalFn: Function) => {
      const msg = args.join(' ');
      // Filtramos mensajes típicos de GeoGebra que ensucian la consola
      if (
        msg.includes('[LaTeX]') || 
        msg.includes('GeoGebra HTML5') || 
        msg.includes('applet injected') ||
        msg.includes('Font jlm')
      ) return;
      originalFn(...args);
    };

    console.log = (...args) => filter(args, originalLog);
    console.warn = (...args) => filter(args, originalWarn);
    console.info = (...args) => filter(args, originalInfo);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, []);

  // Parche para evitar el error STATUS_ACCESS_VIOLATION bloqueando el zoom del navegador
  useEffect(() => {
    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', preventBrowserZoom, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', preventBrowserZoom);
      }
    };
  }, []);

  useEffect(() => {
    // Limpiamos el contenedor antes de inyectar uno nuevo si cambia la dimensión
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const ggbDiv = document.createElement('div');
      ggbDiv.id = containerId;
      containerRef.current.appendChild(ggbDiv);
    }

    const params = {
      "appName": dimension === 3 ? "3d" : "classic",
      "width": 800,
      "height": 550,
      "showToolBar": false,
      "showAlgebraInput": true,
      "showMenuBar": false,
      "enableLabelDrags": false,
      "enableShiftDragZoom": true,
      "enableRightClick": false,
      "showResetIcon": true,
      "language": "en",
      "useBrowserForJS": true,
      "appletOnLoad": (api: any) => {
        appletRef.current = api;
        updatePlot(api);
      }
    };

    const applet = new window.GGBApplet(params, true);
    applet.inject(containerId);
  }, [dimension]);

  useEffect(() => {
    if (appletRef.current) {
      updatePlot(appletRef.current);
    }
  }, [tabla, funciones]);

  const updatePlot = (api: any) => {
    try {
      api.reset();
      
      // 1. Lógica según Dimensión
      funciones.forEach((f, i) => {
        const fName = `f${i+1}`;
        try {
          if (dimension === 1) {
            api.evalCommand(`${fName}(x) = ${f}`);
            api.setColor(fName, 37, 99, 235);
          } 
          else if (dimension === 2) {
            api.evalCommand(`${fName}(x,y) = ${f}`);
            const eqName = `eq${i+1}`;
            api.evalCommand(`${eqName}: ${fName}(x,y) = 0`);
            const colors = [[37, 99, 235], [220, 38, 38]];
            const color = colors[i % colors.length];
            api.setColor(eqName, color[0], color[1], color[2]);
            api.setLineThickness(eqName, 4);
          }
          else if (dimension === 3) {
            const surfName = `surf${i+1}`;
            api.evalCommand(`${surfName}: ${f} = 0`);
            const colors = [[37, 99, 235], [220, 38, 38], [16, 185, 129]];
            const color = colors[i % colors.length];
            api.setColor(surfName, color[0], color[1], color[2]);
          }
        } catch (err) {
          console.warn(`Error en GGB para ${fName}:`, err);
        }
      });

      // 2. Trayectoria
      const x1Idx = 1;
      const x2Idx = 2;
      const x3Idx = 3;
      let prevPointName = "";

      tabla.filas.forEach((fila, i) => {
        const xVal = (fila[x1Idx] as number).toFixed(10);
        let yVal = "0";
        let zVal = "0";

        if (dimension === 1) yVal = `f1(${xVal})`;
        else if (dimension === 2) yVal = (fila[x2Idx] as number).toFixed(10);
        else if (dimension === 3) {
          yVal = (fila[x2Idx] as number).toFixed(10);
          zVal = (fila[x3Idx] as number).toFixed(10);
        }

        const pName = `P${i}`;
        api.evalCommand(`${pName} = (${xVal}, ${yVal}${dimension === 3 ? ',' + zVal : ''})`);
        api.setPointStyle(pName, 0);
        api.setPointSize(pName, 4);
        api.setColor(pName, 239, 68, 68);
        api.setLabelVisible(pName, false);

        if (prevPointName !== "") {
          const sName = `s${i}`;
          api.evalCommand(`${sName} = Segment[${prevPointName}, ${pName}]`);
          api.setLineStyle(sName, 2);
          api.setColor(sName, 148, 163, 184);
        }
        prevPointName = pName;
      });

      if (prevPointName !== "") {
        api.setPointStyle(prevPointName, 3);
        api.setPointSize(prevPointName, 8);
        api.setColor(prevPointName, 22, 163, 74);
        api.setLabelVisible(prevPointName, true);
        api.setCaption(prevPointName, "Raiz");
      }

      if (dimension < 3) api.setCoordSystem(-5, 5, -5, 5);
      else api.evalCommand("SetViewDirection[(1,1,1)]");
      
    } catch (err) {
      console.error("Error crítico en GeoGebra updatePlot:", err);
    }
  };

  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Visualización Dinámica ({dimension}D)
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Prevención de Zoom activada</span>
      </div>
      {/* Contenedor principal con referencia */}
      <div ref={containerRef} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '550px' }}>
        <div id={containerId}></div>
      </div>

      {/* Guía de Interpretación */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1.25rem', 
        background: '#f8fafc', 
        borderRadius: '8px', 
        borderLeft: '4px solid #2563eb' 
      }}>
        <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: 700 }}>
          ¿Qué representa esta gráfica?
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li>
            <strong>Funciones (<MathRenderer math="f_i = 0" />):</strong> Las curvas azules y rojas (o superficies en 3D) muestran dónde se cumple cada ecuación. La solución es el punto de intersección de todas ellas.
          </li>
          <li>
            <strong>Trayectoria Newton:</strong> La línea quebrada roja muestra cómo el algoritmo "viaja" desde el punto inicial hacia la raíz en cada iteración.
          </li>
          <li>
            <strong>Raíz Encontrada:</strong> Marcada con una estrella verde, es el punto final donde el sistema ha convergido según la tolerancia definida.
          </li>
          {dimension === 3 && (
            <li style={{ marginTop: '0.5rem', color: '#2563eb', fontWeight: 600 }}>
              💡 Interacción 3D: Arrastra con el botón derecho para rotar y la rueda para hacer zoom sobre las superficies.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
