---
layout: post
title:  "Hyperparameter optimization con Hyperband y Ray Tune"
description: ""
author: lzamora
categories: [ hyperparameter-optimization, machine-learning ]
featured: true
hidden: true
comments: false
image: assets/images/2_post_img_1.png
beforetoc: "<p>En estos últimos años los algoritmos de Machine Learning(ML) han resuelto con éxito una amplia variedad de tareas, alcanzando el state of the art en diversas áreas. Esto no sólo se debe al desarrollo de nuevos algoritmos (más potentes y más grandes). En muchos casos la selección de buenos hiperparámetros ha contribuido a este logro.</p>
Sin embargo, seleccionar hiperparámetros de una manera precisa no es una tarea para nada trivial. En consecuencia existen distintas técnicas enfocadas a resolver este tipo problema y en este artículo te presentaré a Hyperband.
"
toc: true
---



## Hyperparameter optimization

Llamamos hiperparámetros a todos los parámetros de un modelo que no se actualizan durante el training y que se utilizan para configurarlo. Actualmente, estos modelos tienen  múltiples, diversos y complejos hiperparámetros que se deben ajustar para un mejor funcionamiento y esta tarea implica un gran desafío.

Conceptualmente, el ajuste de hiperparémetros se puede plantear como un problema de optimización, donde el objetivo es encontrar una configuración de hiperparámetros para un modelo determinado que nos permita obtener el mayor rendimiento posible sobre un conjunto de validación. Al método que se utiliza para resolver este tipo de problema se lo conoce como **Hyperparameter Optimization(HPO) o Hyperparameter Tuning**.

Matemáticamente, podemos formularlo de la siguiente forma. Dado que el rendimiento que obtiene un modelo sobre un conjunto de validación puede ser modelado como una función **f : X $$ \to $$ R** de sus hiperparámetros **x ∈ X** (f puede ser cualquier función de error, por ejemplo el RMSE en un problema de regresión o el AUC Score para un problema de clasificación). El problema que deber resolver la HPO es encontrar x* tal que:
<center>$$\mathbf {x* ∈ arg min_{x∈X} f(x)}$$</center>

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_2.png)

Esta optimización tiene varias implicaciones que no podemos omitir:
+ En primer lugar, la evaluación de cada configuración es sumamente costosa, ya que implica entrenar un modelo, y esto puede llevar horas o días. 
+ El espacio de búsqueda de hiperpámetros puede ser incalculable. 
+ Por otro lado, no se calculan gradientes, por lo tanto el método de optimización tendrá que buscar a ciegas dentro del espacio mencionado, o valerse de métodos que le permita generar búsquedas más inteligentes. Es por eso que a este tipo de optimización se la denomina como **black-box optimization**.


## Enfoques de HPO
Se han propuestos varios enfoques para abordar **HPO**. Este árticulo no está focalizado en profundizar cada uno de estos. Sin embargo, resumiremos brevemente los métodos más populares en efecto de tener un mayor entendimiento de cuales son las ventajas que nos proporciona Hyperband y que falencias intenta suplir.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_3.png)


### Grid Search/Random Search
**Grid Search** es uno de los enfoques más populares debido a su simplicidad. Este algoritmo trabaja discretizando el espacio de búsqueda y generando todas las posibles configuraciones de hiperparametros posibles. Luego, evalúa cada una de estas configuraciones, y al finalizar selecciona a la de mayor desempeño

Este enfoque posee algunas desventajas. En primer lugar, el número de configuraciones a evaluar crecerá exponencialmente con respecto al número de hiperparámetros que se deban ajustar.

Por otra parte, supongamos que tenemos solo dos hiperparametros para ajustar a nuestro modelo, uno es muy importante para este y el otro no. En este ejemplo cada uno tendrá 3 valores posibles y por ende nuestro espacio de búsqueda estará compuesto por 9 configuraciones en total.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_4.png)

Como se puede observar en la figura anterior el algoritmo no ha podido encontrar el mejor valor para el hiperparámetro importante luego de evaluar cada configuración debido al uso del espacio discretizado.

**Random Search** es una variante a Grid Search que intenta solventar el problema anterior, muestreando aleatoriamente configuraciones sin discretizar el espacio de búsqueda. Al no tener una condición de fin implícita la cantidad de configuraciones muestreadas a evaluar será escogida por nosotros.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_5.png)

Este algoritmo también tiene la misma falencia respecto al número de hiperparámetros que debe ajustar, ya que a mayor espacio de búsqueda necesitará una mayor cantidad de muestreos para tener una mínima cobertura sobre este que asegure cierta aceptación.


### Optimización Bayesiana
Tanto Grid Search como Random Search convergen eventualmente luego de un tiempo determinado. Pero en la práctica esto es inviable debido a que los recursos (tiempo y costos) de los cuales disponemos suelen ser limitados. Dada estas restricciones,  necesitaremos de algoritmos más inteligentes para buscar buenas configuraciones y es aquí donde se nos presenta la **Optimización Bayesiana (BO)**.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_6.png)

Tengamos de referencia la figura anterior para comprender con más claridad cómo es que este algoritmo trabaja. BO está compuesto principalmente por dos componentes, por un lado un modelo sustituto y por otro lado una función de adquisición.

Nuestro objetivo es encontrar el punto que minimice la función objetivo **f** , representada por la línea negra discontinua. Pero ya mencionamos que no conocemos el valor real de **f**, por lo tanto BO tratará de aproximarla en varias iteraciones a través de un **modelo sustituto** utilizando algún modelo probabilístico dada observaciones pasadas, es decir, configuraciones ya evaluadas. Esto queda reflejado en la línea negra junto a la incertidumbre de la estimación representada por el sombreado azul.

La decisión de cuál será la siguiente configuración a evaluar siempre es tomada por la función de adquisición. Este tendrá como referencia al modelo sustituto construido hasta el momento e intentará explorar aquellas zonas donde existe muy poca información o hay buenas probabilidades de encontrarnos con buenas configuraciones.

Si bien BO funciona muy bien en este tipo de optimizaciones, tiene una desventaja que no podemos dejar pasar y es que no se pueden paralelizar los recursos ya que el proceso es secuencial. Además, las variantes más clásicas de BO también tendrán problema es espacios de búsquedas de altas dimensiones.


## Successive Halving
Antes de hablar sobre Hyperband, debemos mencionar a su predecesor **Successives Halving**. La idea detrás del algoritmo deriva directamente de su nombre: asignar uniformemente un presupuesto a un conjunto de configuraciones de hiperparámetros, evaluar el rendimiento de todas las configuraciones, descartar la mitad menos prometedora y repetir hasta que quede sólo una configuración.

El algoritmo asigna exponencialmente más recursos a configuraciones más prometedoras. Es muy similar a Random Seach con la diferencia de que aplicará early stopping a las configuraciones que peor desempeño están obteniendo.


![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_7.gif)

La ventaja de este algoritmo es que puede paralelizar recursos como lo hacen sus primos (Grid Search y Random Search), pero requiere como entrada el número de configuraciones **n** a evaluar y cuál será el presupuesto **B** que utilizaremos. Lo que convierte a esta decisión en nuevos hiperparámetros.
 



## Implementacion con Ray Tune


## Conclusiones


**Referencias:**


**Lecturas recomendadas:**