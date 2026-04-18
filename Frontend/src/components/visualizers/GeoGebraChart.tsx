import React, { useEffect, useRef } from 'react';
import { MathRenderer } from './MathRenderer';
import type { Tabla } from '../../schemas/newton.schema';

interface GeoGebraChartProps {
  tabla: Tabla;
  dimension: number;
  funciones: string[];
  metodo?: 'newton' | 'punto-fijo';
}

declare global {
  interface Window {
    GGBApplet: any;
  }
}

export const GeoGebraChart: React.FC<GeoGebraChartProps> = ({ tabla, dimension, funciones, metodo = 'newton' }) => {
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

  useEffect(() => {
    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const container = containerRef.current;
    if (container) container.addEventListener('wheel', preventBrowserZoom, { passive: false });
    return () => container?.removeEventListener('wheel', preventBrowserZoom);
  }, []);

  useEffect(() => {
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
    if (appletRef.current) updatePlot(appletRef.current);
  }, [tabla, funciones, metodo]);

  const updatePlot = (api: any) => {
    try {
      api.reset();
      const varsGeo = ["x", "y", "z"];
      
      funciones.forEach((f, i) => {
        const fName = `f${i+1}`;
        try {
          const colors = [[37, 99, 235], [220, 38, 38], [16, 185, 129]];
          const color = colors[i % colors.length];

          if (metodo === 'punto-fijo') {
            const eqName = `eq${i+1}`;
            let command = "";
            
            if (f.includes('=')) {
              // Si ya viene con un =, lo usamos tal cual (ej: x = sqrt(y))
              command = `${eqName}: ${f}`;
            } else {
              // Si no tiene =, decidimos:
              // Si la dimensión es > 1 y estamos en punto fijo, 
              // el backend ahora envía o el sistema original f(x,y) o g(x,y)
              // Intentaremos graficarlo como f(x,y) = 0 a menos que sea una sola variable
              if (dimension === 1) {
                // En 1D punto fijo, f es g(x), graficamos y = g(x) e y = x
                api.evalCommand(`g${i+1}(x) = ${f}`);
                api.setColor(`g${i+1}`, color[0], color[1], color[2]);
                if (i === 0) {
                  api.evalCommand("rectaIdentidad: y = x");
                  api.setColor("rectaIdentidad", 156, 163, 175);
                  api.setLineStyle("rectaIdentidad", 2);
                }
                return; // Salir del loop para esta función
              } else {
                // En sistemas, si no tiene =, GeoGebra necesita saber si es x=... o f=0
                // Como prioridad, si el usuario ingresó "Sistema Original", f debería ser f(x,y) = 0
                // Pero si son los despejes g(x), debería ser x = g1, y = g2...
                // Lógica: Si f contiene la variable propia (ej: g1 tiene x), es probable f=0.
                // Si no, asignamos x, y, z secuencialmente.
                const currentVar = varsGeo[i];
                if (f.includes(currentVar)) {
                  command = `${eqName}: ${f} = 0`;
                } else {
                  command = `${eqName}: ${currentVar} = ${f}`;
                }
              }
            }
            api.evalCommand(command);
            api.setColor(eqName, color[0], color[1], color[2]);
            api.setLineThickness(eqName, 4);
          } else {
            if (dimension === 1) {
              api.evalCommand(`${fName}(x) = ${f}`);
              api.setColor(fName, color[0], color[1], color[2]);
            } else if (dimension === 2) {
              api.evalCommand(`${fName}(x,y) = ${f}`);
              const eqName = `eq${i+1}`;
              api.evalCommand(`${eqName}: ${fName}(x,y) = 0`);
              api.setColor(eqName, color[0], color[1], color[2]);
              api.setLineThickness(eqName, 4);
            } else if (dimension === 3) {
              const surfName = `surf${i+1}`;
              api.evalCommand(`${surfName}: ${f} = 0`);
              api.setColor(surfName, color[0], color[1], color[2]);
            }
          }
        } catch (err) {
          console.warn(`Error en GGB para ${fName}:`, err);
        }
      });

      // Trayectoria común
      const x1Idx = 1;
      const x2Idx = 2;
      const x3Idx = 3;
      let prevPointName = "";

      tabla.filas.forEach((fila, i) => {
        const xVal = (fila[x1Idx] as number).toFixed(10);
        let yVal = dimension >= 2 ? (fila[x2Idx] as number).toFixed(10) : "0";
        let zVal = dimension === 3 ? (fila[x3Idx] as number).toFixed(10) : "0";

        // Caso especial 1D: y es f(x) o simplemente 0 para ver la recta
        if (dimension === 1 && metodo === 'newton') yVal = `f1(${xVal})`;

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
        api.setCaption(prevPointName, "Solución");
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
          Visualización Dinámica ({dimension}D) - {metodo === 'newton' ? 'Newton' : 'Punto Fijo'}
        </h3>
      </div>
      <div ref={containerRef} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '550px' }}>
        <div id={containerId}></div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: 700 }}>
          ¿Qué representa esta gráfica?
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li>
            <strong>Funciones:</strong> {metodo === 'newton' 
              ? 'Las curvas muestran donde f(x)=0. La raíz es la intersección.' 
              : 'Las curvas muestran x = g(x,y). El punto fijo es donde se intersectan.'}
          </li>
          <li>
            <strong>Trayectoria:</strong> La línea quebrada roja muestra la evolución de las aproximaciones.
          </li>
          <li>
            <strong>Solución:</strong> La estrella verde marca el punto final de convergencia.
          </li>
        </ul>
      </div>
    </div>
  );
};
