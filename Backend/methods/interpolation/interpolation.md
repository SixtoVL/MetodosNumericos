# Documentación Técnica: Interpolación Numérica

## Introducción
Este módulo implementa técnicas para el problema de la interpolación, donde dado un conjunto de puntos discretos $(x_i, y_i)$, buscamos una función que pase exactamente por todos ellos.

## Módulo 1: Conceptos Fundamentales
La interpolación se diferencia de la aproximación en que el error en los nodos de datos debe ser exactamente cero. 
- **Existencia y Unicidad:** Para $n+1$ puntos, existe un único polinomio de grado $\le n$.
- **Interpolación Lineal:** Aproximación local mediante segmentos de recta entre dos puntos.

## Módulo 2: Interpolación de Lagrange
El método de Lagrange construye el polinomio interpolante como una combinación lineal de polinomios base $L_i(x)$.

### Polinomios Base
$$L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}$$

### Polinomio de Lagrange
$$P(x) = \sum y_i L_i(x)$$

## Consideraciones Numéricas
- **Fenómeno de Runge:** Oscilaciones en los bordes para puntos equiespaciados de alto grado.
- **Forma Baricéntrica:** Se recomienda para implementaciones computacionales por su estabilidad y velocidad.
