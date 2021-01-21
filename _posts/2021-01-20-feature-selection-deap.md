---
layout: post
title:  "Feature selection utilizando Algoritmos Genéticos con DEAP"
author: lzamora
categories: [ feature-selection, machine-learning ]
image: assets/images/3.jpg
beforetoc: "<p>Normalmente, en el desarrollo de modelos de Machine Learning en consecuencia a que en la actualidad trabajamos con grandes cantidades de datos, nos encontramos ante un gran desafío que es la de la selección de características o variables. (Feature selection).</p>

<p>Esta, no solo nos permite iterar de forma más ágil en el proceso de desarrollo y prueba. Además, en muchos casos nos permite obtener mejoras considerables en el modelo.</p>

El objetivo de este artículo es acercarte una de las tantas técnicas utilizadas para la selección de características como son los algoritmos genéticos. En este caso utilizando DEAP, una framework de computación evolucionaria disponible en Python."
toc: true
---


## Feature selection

Es el proceso de reducir el número de variables durante la construcción de un modelo. Muchas veces nos encontramos ante problemas donde intervienen grandes cantidades de variables. En este caso nos enfrentamos a diversos problemas:

+ El entrenamiento se puede ralentizar considerablemente requiriendo grandes cantidades de memoria y altos requerimientos de cómputos.
+ La performance de algunos modelos podría verse afectada negativamente.

Existen distintas técnicas para realizar este proceso, ya que si tendríamos que hacerlo manualmente, si el número de variables es significante, esto sería impracticable. 

En este artículo te mostraré cómo utilizar Algoritmos Genéticos para efectuarlo.



## Algoritmos Genéticos (GA)

Es un método evolutivo estocástico para la optimización de funciones basado en la teoría de la evolución expuesta por Charles Darwin.

Este opera sobre una población de cromosomas (individuos de la población), los cuales típicamente son formulados como una cadena de bits, con valores de 0s y 1s (encoding).

La idea es iterar generando sucesivas generaciones cada vez mejores a las anteriores.
Esto se produce seleccionando a los individuos más aptos de la población de acuerdo a una función fitness que dependerá del dominio sobre el cual se esté trabajando, la cual nos dirá que tan bueno es el individuo. 

Luego combinaremos a estos con otros individuos utilizando  diferentes operadores generando a los descendientes, los que podrían someterse a una mutación. Estos conformarán la nueva generación.

Un algoritmo genético básico trabaja de la siguiente forma:

1. Inicialización: comenzamos generando de forma aleatoria una población de n cromosomas de longitud l (soluciones candidatas). 

2. Calculamos la función fitness f(x) para cada cromosoma x en la población. Esta función evaluará la efectividad o aptitud de cada individuo.

3. Repetimos este paso por la cantidad de generaciones que deseemos crear:

    1. Selección: Seleccionamos un par de cromosomas de la población actual. La probabilidad de selección estará dada por la función fitness. La selección se realiza con reemplazo, es decir, un cromosoma puede ser seleccionado más de una vez.

    2. Crossover: Con una probabilidad pc combinamos un par de cromosomas seleccionados aleatoriamente y generamos dos descendientes.

    3. Mutación: Mutamos a los dos descendientes del paso anterior en cada bit con una probabilidad pm. Estos se convertirán en miembros de la nueva población.

4. Reemplazamos la actual población con la nueva población generada.



## Feature selection con GA

Ahora que ya estamos familiarizados con ambos conceptos, veremos cómo trabajan de forma conjunta.

Matemáticamente, la selección de características se puede plantear como un problema de optimización combinatorial. Donde los inputs serán las diferentes combinaciones de variables a evaluar y cuya función objetivo será mejorar la performance de un modelo tal vez reduciendo un término de error. Es aquí donde aparecen los algoritmos genéticos para resolver este problema.

Podemos esbozar el problema de la siguiente forma. Supongamos que trabajamos en un problema de clasificación. El objetivo en este caso puede ser maximizar la curva ROC. Está será definida como nuestra función fitness. Esta función tomará como posible solución un conjunto de individuos (distintas combinaciones de variables para entrenar el modelo ), y evaluará su efectividad. 

Estos individuos tomarán la forma de un vector de 0s y 1s.  Su longitud será igual al número de variables disponibles y cada bit representará a una de estas variables. Si estamos en presencia de un 1, indica que utilizaremos la variable correspondiente en esa posición para entrenar el modelo. Caso contrario no la consideramos. 

Por ejemplo, utilizamos el individuo que será representado por el vector: [1, 0, 1, 0, 0, 0]. Este vector nos dice que evaluaremos la variable número 1 y la variable número 3.
Siendo más preciso entrenaremos el modelo con estas variables. La evaluación será responsabilidad de la función fitness que en nuestro caso nos devolverá el área bajo la curva ROC.

Como mencionamos anteriormente podemos iterar tantas veces como nosotros quisiéramos. Al final del proceso tendremos a los mejores individuos (o soluciones) y seleccionaremos a la mejor. Nuestro mejor individuo será aquel que maximice el área bajo la curva ROC.


## DEAP

DEAP(Distributed Evolutionary Algorithms in Python) es un framework para cálculo evolutivo desarrollado en Python. Trabaja fácilmente con paralelización y multiprocesamiento.  Este nos brinda un conjunto de herramientas que nos permite rápidamente implementar y testear algoritmos genéticos.
