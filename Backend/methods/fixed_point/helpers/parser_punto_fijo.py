import sympy as sp
import re
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

def pre_procesar_implicit_mult(funcion_str: str):
    """
    Normaliza el string matemático:
    1. Reemplaza potencias (^ por **).
    2. Inserta asteriscos en multiplicaciones implícitas detectadas (p.ej. 3x_1 -> 3*x_1).
    3. Protege las funciones matemáticas integradas de SymPy.
    """
    f = funcion_str.replace("^", "**")
    
    # Caso: x_N x_M -> x_N * x_M
    f = re.sub(r'(x_\d+)(x_\d+)', r'\1*\2', f)
    # Caso: Número seguido de x_N -> Número * x_N
    f = re.sub(r'(\d+)(x_\d+)', r'\1*\2', f)
    # Caso: x_N seguido de letra o función -> x_N * letra
    f = re.sub(r'(x_\d+)([a-zA-Z\(])', r'\1*\2', f)
    # Caso: ) seguido de x_N -> ) * x_N
    f = re.sub(r'(\))(x_\d+)', r'\1*\2', f)
    
    # Soporte para variables x, y, z si no se usa notación x_N
    f = re.sub(r'(\d)([a-zA-Z])', r'\1*\2', f)
    
    # Evitar que algo como x(y+1) se quede sin asterisco, 
    # pero protegiendo funciones conocidas (sin, cos, exp, log, tan, etc.)
    # Por ahora, confiaremos en implicit_multiplication_application de SymPy para los casos estándar.
    
    return f

def parsear_funcion(funcion_str: str, variables_str: list):
    f_procesada = pre_procesar_implicit_mult(funcion_str)
    transformaciones = standard_transformations + (implicit_multiplication_application,)
    local_dict = {v: sp.symbols(v) for v in variables_str}
    
    try:
        expr = parse_expr(f_procesada, local_dict=local_dict, transformations=transformaciones)
    except Exception as e:
        raise ValueError(f"Error al parsear '{funcion_str}': {str(e)}")
    
    return expr, list(local_dict.values())

def obtener_funciones_punto_fijo(g_funcs: list, variables_str: list):
    exprs = []
    simbolos_all = [sp.symbols(v) for v in variables_str]
    
    for g_s in g_funcs:
        expr, _ = parsear_funcion(g_s, variables_str)
        exprs.append(expr)
    
    g_num = sp.lambdify(simbolos_all, exprs, "numpy")
    
    # Generar representaciones en LaTeX
    latex_g = [sp.latex(expr) for expr in exprs]
    
    return g_num, exprs, simbolos_all, latex_g
