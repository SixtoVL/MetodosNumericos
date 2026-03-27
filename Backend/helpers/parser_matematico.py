import sympy as sp
import re

def parsear_funcion(funcion_str: str, variables_str: list):
    """
    Convierte un string humano (ej: '3x^2 + sin x') en una función de SymPy
    y luego en una función numérica rápida de NumPy.
    """
    # 1. Pre-procesamiento básico para SymPy
    # Cambiar ^ por ** para potencias
    f_procesada = funcion_str.replace("^", "**")
    
    # Soporte para multiplicación implícita (ej: 3x -> 3*x)
    # Buscamos un número seguido de una letra
    f_procesada = re.sub(r'(\d)([a-zA-Z_])', r'\1*\2', f_procesada)
    
    # 2. Definir los símbolos de SymPy basados en las variables enviadas
    # Si las variables son x_1, x_2... SymPy las entiende como símbolos
    simbolos = [sp.symbols(v) for v in variables_str]
    
    # 3. Convertir string a expresión de SymPy
    expr = sp.parse_expr(f_procesada, transformations=sp.parsing.sympy_parser.T + (sp.parsing.sympy_parser.implicit_multiplication_application,))
    
    return expr, simbolos

def obtener_funciones_numericas(funciones_str: list, variables_str: list):
    """
    Toma una lista de strings y devuelve funciones lambdificadas para NumPy.
    """
    exprs = []
    simbolos_all = [sp.symbols(v) for v in variables_str]
    
    for f_s in funciones_str:
        expr, _ = parsear_funcion(f_s, variables_str)
        exprs.append(expr)
    
    # Convertimos las expresiones simbólicas a funciones numéricas de NumPy
    # Esto es extremadamente rápido
    f_num = sp.lambdify(simbolos_all, exprs, "numpy")
    
    return f_num, exprs, simbolos_all
