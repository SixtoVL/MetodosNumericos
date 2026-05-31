from fastapi import HTTPException
from methods.interpolation.divided_differences import divided_differences_method
from methods.interpolation.finite_differences import finite_differences_method
from methods.interpolation.hermite import hermite_method
from schemas.interpolation_schema import InterpolationSchema, HermiteRequest
import logging
import numpy as np
import json

logger = logging.getLogger("InterpolationController")

import sympy as sp
from methods.newton.helpers.parser_matematico import parsear_funcion
from schemas.interpolation_schema import InterpolationSchema, HermiteRequest, HermitePoint

def solve_hermite(data: HermiteRequest):
    input_json = json.dumps(data.model_dump(), indent=2, ensure_ascii=False)
    logger.info(f"--- NUEVA PETICIÓN (Hermite) ---\n{input_json}")

    try:
        puntos_hermite = []
        
        # 1. Modo Simbólico: si viene funcion y x_puntos
        if data.funcion and data.x_puntos:
            logger.info(f"Modo simbólico detectado: f(x) = {data.funcion}")
            expr, vars_sym = parsear_funcion(data.funcion, ["x"])
            x_sym = vars_sym[0]
            
            # Si no vienen órdenes, asumimos solo f'(x)
            ordenes = data.ordenes if data.ordenes else [1] * len(data.x_puntos)
            
            for i, xi in enumerate(data.x_puntos):
                yi = float(expr.subs(x_sym, xi))
                derivadas = []
                # Calcular derivadas según el orden solicitado para este punto
                for orden_der in range(1, ordenes[i] + 1):
                    val_der = float(sp.diff(expr, x_sym, orden_der).subs(x_sym, xi))
                    derivadas.append(val_der)
                
                puntos_hermite.append(HermitePoint(x=xi, y=yi, derivadas=derivadas))
        else:
            # Modo Manual
            if not data.puntos or len(data.puntos) < 1:
                raise HTTPException(status_code=400, detail="Se necesitan puntos para interpolar.")
            puntos_hermite = data.puntos

        if len(puntos_hermite) == 0:
             raise HTTPException(status_code=400, detail="No se proporcionaron puntos válidos.")

        # 2. Ejecutar el método
        resultado = hermite_method(puntos_hermite)

        # 3. Evaluación del punto si se solicita
        def evaluar_newton(x, coefs, nodos_z):
            val = coefs[0]
            prod = 1.0
            for i in range(1, len(coefs)):
                prod *= (x - nodos_z[i-1])
                val += coefs[i] * prod
            return val

        if data.x_a_evaluar is not None:
            xa = data.x_a_evaluar
            val_ev = evaluar_newton(xa, resultado["coeficientes"], resultado["nodos_z"])
            resultado["valor_evaluado"] = {"x": xa, "y": val_ev}

        # 4. Generación de puntos para la curva (Graficación Robusta)
        x_min = min(resultado["nodos_z"])
        x_max = max(resultado["nodos_z"])
        rango = x_max - x_min
        padding = rango * 0.2 if rango > 0 else 1.0
        
        x_plot = np.linspace(x_min - padding, x_max + padding, 200)
        curva = []
        for x_val in x_plot:
            y_val = evaluar_newton(x_val, resultado["coeficientes"], resultado["nodos_z"])
            # Evitar infinitos en el JSON
            if abs(y_val) < 1e100:
                curva.append({"x": float(x_val), "y": float(y_val)})
        
        resultado["curva"] = curva

        # 5. Generación de tangentes para visualización
        tangentes = []
        longitud_tangente = padding * 0.5 if padding > 0 else 0.5
        for p in puntos_hermite:
            if p.derivadas and len(p.derivadas) > 0:
                m = p.derivadas[0] # Primera derivada
                # f(x) + m * (t - x)
                t_start = p.x - longitud_tangente
                t_end = p.x + longitud_tangente
                y_start = p.y + m * (t_start - p.x)
                y_end = p.y + m * (t_end - p.x)
                tangentes.append({
                    "x0": t_start, "y0": y_start,
                    "x1": t_end, "y1": y_end,
                    "label": f"f'({p.x})={m:.2g}"
                })
        
        resultado["tangentes"] = tangentes

        return resultado
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en solve_hermite: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def solve_divided_differences(data: InterpolationSchema):
    metodo_solicitado = data.metodo
    metodo_nombre = "Diferencias Finitas" if metodo_solicitado == "finitas" else "Diferencias Divididas"
    
    # Pretty-print del JSON de entrada
    input_json = json.dumps(data.model_dump(), indent=2, ensure_ascii=False)
    logger.info(f"--- NUEVA PETICIÓN ({metodo_nombre}) ---\n{input_json}")
    
    try:
        # 1. Validaciones básicas
        x_values = [p.x for p in data.puntos]
        if len(x_values) != len(set(x_values)):
            logger.warning("Validación fallida: Valores de X repetidos")
            raise HTTPException(status_code=400, detail="Los valores de x deben ser distintos entre sí.")
            
        if len(data.puntos) < 2:
            logger.warning("Validación fallida: Menos de 2 puntos")
            raise HTTPException(status_code=400, detail="Se necesitan al menos 2 puntos para interpolar.")

        # 2. Análisis de espaciamiento (h)
        h_values = np.diff(x_values)
        es_equiespaciado = np.allclose(h_values, h_values[0], atol=1e-8)
        
        # 3. Lógica de decisión según el toggle y los datos
        if metodo_solicitado == "finitas":
            if not es_equiespaciado:
                logger.warning(f"Conflicto: Toggle ON pero puntos NO equiespaciados. h_values={h_values.tolist()}")
                raise HTTPException(
                    status_code=400, 
                    detail="Los puntos ingresados no tienen una distancia constante (equiespaciados). "
                           "Por favor, revisa tus datos o desactiva el toggle de Diferencias Finitas."
                )
            logger.info(f"Escenario detectado: Toggle ON + Puntos Equiespaciados ({data.direccion}) -> Usando Diferencias Finitas")
            resultado = finite_differences_method(data.puntos, direccion=data.direccion, x_a_evaluar=data.x_a_evaluar, pivote=data.pivote)
        else:
            logger.info("Escenario detectado: Toggle OFF -> Usando Diferencias Divididas")
            resultado = divided_differences_method(data.puntos)
        
        # 4. Evaluación del punto si se solicita
        if data.x_a_evaluar is not None:
            xa = data.x_a_evaluar
            coefs = resultado["coeficientes"]
            nodos_x = resultado.get("nodos_x", resultado["puntos_x"])
            
            valor_evaluado = coefs[0]
            producto = 1.0
            for i in range(1, len(coefs)):
                producto *= (xa - nodos_x[i-1])
                valor_evaluado += coefs[i] * producto
            
            resultado["valor_evaluado"] = {"x": xa, "y": valor_evaluado}
            
        # Pretty-print del JSON de salida
        output_json = json.dumps(resultado, indent=2, ensure_ascii=False)
        logger.info(f"Respuesta generada exitosamente:\n{output_json}")
        return resultado

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en solve_divided_differences: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
