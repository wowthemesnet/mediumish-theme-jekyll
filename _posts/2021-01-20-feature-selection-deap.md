---
layout: post
title:  "Feature Selection utilizando Algoritmos Genéticos y DEAP"
author: lzamora
categories: [ feature-selection, machine-learning ]
image: assets/images/1_post1.png
beforetoc: "<p>Normalmente, debido a la considerable cantidad de datos los cuales hoy disponemos, cuando desarrollamos modelos de Machine Learning nos encontramos ante un gran desafío que es el de la <strong>SELECCIÓN DE VARIABLES o CARACTERÍSTICAS. (FEATURE SELECTION)</strong></p>

<p>El objetivo es enfocarnos en aquellas variables importantes para el modelo, descartando aquellas que no lo son. Así, <u>minimizaremos los tiempos iterando</u> en menos tiempo y obteniendo un feedback de nuestro entrenamiento mucho mas veloz.
Además, en muchos casos es posible conseguir <u>mejoras en el performance</u> del modelo ya que podríamos prescindir de variables que estén generando ruido.</p>

El objetivo de este artículo es acercarte una de las tantas técnicas utilizadas para la selección de variables: <strong>ALGORITMOS GENÉTICOS</strong>. Para la implementación utilizaremos <strong>DEAP</strong>, una framework de computación evolucionaría disponible en Python."
toc: true
---



## Feature selection

**Es el proceso de reducir el número de variables durante la construcción de un modelo.** Muchas veces nos encontramos ante problemas donde intervienen grandes cantidades de datos y variables, situación que nos puede acarrear ciertos inconvenientes:

+ El entrenamiento se puede ralentizar considerablemente, requiriendo grandes cantidades de memoria y altos requerimientos de cómputos.
+ La performance de algunos modelos podría verse afectada negativamente.

Ejecutar este paso manualmente, en el caso de que el número de variables sea significante, sería impracticable. Es por eso existen diversas técnicas para realizarlo.

En este artículo no desarrollaremos estas técnicas, pero te mostraré cómo utilizar Algoritmos Genéticos para efectuarlo.



## Algoritmos Genéticos (GA)

**Es un método evolutivo estocástico para la optimización de funciones basado en la teoría de la evolución expuesta por Charles Darwin.**

Este opera sobre una población de **cromosomas** (individuos de la población o soluciones candidatas), los cuales típicamente son formulados como una **cadena de bits**, con valores de 0s y 1s (encoding).

![ga_elements]({{ site.baseurl }}/assets/images/2_post1.png)

La idea es iterar generando sucesivas **generaciones** cada vez mejores a las anteriores. Esto se produce seleccionando a los mejores individuos de la población, de acuerdo a una **función fitness**, la cual evaluará y nos dará información sobre que tan bueno es el individuo. 

Luego combinaremos a estos individuos con otros, utilizando diferentes **operadores** para generar a los **descendientes**. Por últimos, estos descendientes podrían someterse a una mutación, y estos conformarán la nueva generación.

Un <u>Algoritmo Genético Básico</u> efectua el siguiente flujo:

![ga_workflow alt ><]({{ site.baseurl }}/assets/images/3_post1.png)

1. **Inicialización**: comenzamos generando de forma aleatoria una población de n cromosomas de longitud l (soluciones candidatas). 

2. **Calculamos la función fitness f(x)** para cada cromosoma x en la población. Esta función evaluará la efectividad o aptitud de cada individuo.

3. Repetimos este paso por la cantidad de generaciones que deseemos crear:

    1. **Selección**: Seleccionamos un par de cromosomas de la población actual. La probabilidad de selección estará dada por la función fitness. La selección se realiza con reemplazo, es decir, un cromosoma puede ser seleccionado más de una vez.

    2. **Crossover**: Con una probabilidad pc combinamos un par de cromosomas seleccionados aleatoriamente y generamos dos descendientes.

    3. **Mutación**: Mutamos a los dos descendientes del paso anterior en cada bit con una probabilidad pm. Estos se convertirán en miembros de la nueva población.

4. **Reemplazamos** la actual población con la nueva población generada.

**IMAGEN 4 OPERADORES**

## Intuición de la selección de variables con GA

Ahora que ya estamos familiarizados con ambos conceptos, veremos cómo estos trabajan en forma conjunta.

Matemáticamente, la selección de variables se puede plantear como un **problema de optimización combinatorial**. Donde las **entradas** serán las diferentes **combinaciones de variables a evaluar**, y la **función objetivo** será **mejorar la performance de un modelo**, tal vez reduciendo algún término de error. 
Es aquí donde aparecen los Algoritmos Genéticos para ayudarnos a resolver este problema.

Podemos esbozar la selección de variables con los Algoritmos Genéticos de la siguiente forma. Supongamos que estamos trabajando en un problema de **clasificación**. El objetivo en este caso podría ser maximizar el **F1 Score**. Está será definida como nuestra **función fitness**. Esta función tomará como posibles soluciones un conjunto de individuos **(distintas combinaciones de variables para entrenar el modelo)**, y evaluará su efectividad. 

Estos individuos tomarán la forma de un vector de **0s y 1s**. Su longitud será igual al número de variables del modelo y cada bit representará a cada una de estas variables. Si estamos en presencia de un 1, utilizaremos la variable correspondiente en esa posición para entrenar el modelo. Caso contrario no la consideramos. 

Un ejemplo concreto sería el siguiente, tenemos a un individuo que será representado por el **vector: [1, 0, 1, 0, 0, 0]**. Este vector nos indica que evaluaremos la **variable número 1** y **la variable número 3**. 

**IMAGEN 5 REPRESENTACION DE INVIDUO Y MODELO**

Cuando decimos que evaluaremos a este individuo, estamos diciendo que entrenaremos el modelo con estas variables y como salida obtendremos un score (F1 score), que nos indicará que tan bueno fue el desempeño de este conjuntos de variables en el entrenamiento de este. 

Por último, seguiremos el flujo del punto anterior e iteraremos tantas veces como nosotros definamos. Al final del proceso tendremos a los mejores individuos (o soluciones) y seleccionaremos a la mejor. Nuestro mejor individuo será aquel que maximice el **F1 Score**.



## DEAP

**DEAP (Distributed Evolutionary Algorithms in Python)** es un framework para cálculo evolutivo desarrollado en Python. Trabaja fácilmente con paralelización y multiprocesamiento. Además, nos brinda un conjunto de herramientas que nos permite rápidamente implementar y testear algoritmos genéticos.
