import sympy as sp
import re
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

def pre_procesar_implicit_mult(funcion_str: str):
    """
    Normaliza el string de la función para ser entendido por SymPy:
    - Reemplaza ^ por ** (potencia)
    - Reemplaza [] y {} por () (agrupadores)
    - Inserta asteriscos (*) en casos de multiplicación implícita.
    """
    f = funcion_str.replace("^", "**")
    f = f.replace("[", "(").replace("]", ")")
    f = f.replace("{", "(").replace("}", ")")
    
    # 1. Caso: x_N x_M -> x_N * x_M
    # Detecta una variable x_N seguida de otra x_M
    f = re.sub(r'(x_\d+)(x_\d+)', r'\1*\2', f)
    
    # 2. Caso: Número seguido de x_N -> Número * x_N
    # Detecta un número seguido de una variable x_N
    f = re.sub(r'(\d+)(x_\d+)', r'\1*\2', f)
    
    # 3. Caso: x_N seguido de letra o función -> x_N * letra
    # Detecta x_N seguido de algo como sin, cos, exp, o (
    f = re.sub(r'(x_\d+)([a-zA-Z\(])', r'\1*\2', f)
    
    # 4. Caso: ) seguido de x_N -> ) * x_N
    f = re.sub(r'(\))(x_\d+)', r'\1*\2', f)
    
    return f

def parsear_funcion(funcion_str: str, variables_str: list):
    """
    Convierte un string humano (ej: '3x^2 + sin x') en una expresión de SymPy.
    """
    # 1. Pre-procesamiento personalizado y de potencias
    f_procesada = pre_procesar_implicit_mult(funcion_str)
    
    # 2. Definir transformaciones estándar de SymPy
    transformaciones = standard_transformations + (implicit_multiplication_application,)
    
    # 3. Diccionario de variables locales
    local_dict = {v: sp.symbols(v) for v in variables_str}
    
    # 4. Convertir a SymPy
    try:
        expr = parse_expr(f_procesada, local_dict=local_dict, transformations=transformaciones)
    except Exception as e:
        raise ValueError(f"Error al parsear '{funcion_str}': {str(e)}")
    
    return expr, list(local_dict.values())

def obtener_funciones_numericas(funciones_str: list, variables_str: list):
    """
    Toma una lista de strings y devuelve funciones lambdificadas para NumPy.
    """
    exprs = []
    simbolos_all = [sp.symbols(v) for v in variables_str]
    
    for f_s in funciones_str:
        expr, _ = parsear_funcion(f_s, variables_str)
        exprs.append(expr)
    
    # Convertimos a funciones numéricas de NumPy (extremadamente rápido)
    # Usamos "numpy" para que entienda exp, sin, cos, etc.
    f_num = sp.lambdify(simbolos_all, exprs, "numpy")
    
    return f_num, exprs, simbolos_all
