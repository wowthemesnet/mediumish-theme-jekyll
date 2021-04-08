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
beforetoc: "<p>Desde hace unos años los algoritmos de <b>Machine Learning(ML)</b> han resuelto con éxito una amplia variedad de tareas alcanzando el state of the art en diversas áreas. Esto no sólo se debe al desarrollo de nuevos algoritmos, más potentes y más grandes, en varias ocasiones la selección de buenos hiperparámetros ha contribuido a esta conquista.</p>
Sin embargo, seleccionar hiperparámetros de una manera precisa no es una tarea para nada trivial y en consecuencia, existen distintas técnicas enfocadas a resolver este tipo problema. En este artículo te presentaré a <b>HYPERBAND</b>.
"
toc: true
---


## Optimización de hiperparámetros

Definimos como hiperparámetros a todos los parámetros de un modelo que no se actualizan durante el entrenamiento y que se utilizan para configurarlo. En la actualidad, una buena proporción de estos modelos tienen múltiples, diversos y complejos hiperparámetros que se deben ajustar para alcanzar un mejor 
rendimiento y esta tarea implica un gran desafío.

Conceptualmente, el ajuste de hiperparémetros se puede plantear como un problema de optimización, donde el objetivo es encontrar una configuración de hiperparámetros para un modelo determinado que nos permita obtener el mayor rendimiento posible sobre un conjunto de validación. Al método que se utiliza para resolver este tipo de problema se lo conoce como **Hyperparameter Optimization(HPO) o Hyperparameter Tuning**.

Matemáticamente, podemos formularlo del modo siguiente: Dado que el rendimiento que obtiene un modelo sobre un conjunto de validación puede ser modelado como una función **f : X $$ \to $$ R** de sus hiperparámetros **x ∈ X** (f puede ser cualquier función de error, por ejemplo el RMSE en un problema de regresión o el AUC Score para un problema de clasificación). El problema que deber resolver la **HPO** es encontrar **x** tal que:
<center>$$\mathbf {x* ∈ arg min_{x∈X} f(x)}$$</center>

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_2.png)

Esta tipo de optimización tiene varios puntos que debemos considerar:
+ En primer lugar, la evaluación de cada configuración es sumamente costosa, ya que implica entrenar un modelo y esto puede llevar horas o días. 
+ Como ya mencionamos, el espacio de búsqueda de hiperpámetros puede ser exorbitante. 
+ Por otro lado, no se calculan gradientes, por lo tanto el método de optimización tendrá que buscar a ciegas dentro del espacio mencionado, o valerse de métodos que le permita generar búsquedas más inteligentes. Es por eso que a este tipo de optimización se la denomina como **black-box optimization**.


## Enfoques de HPO

Se han propuestos varios enfoques para abordar el problema de **HPO**. Este árticulo no está focalizado en profundizar a todos. Sin embargo, resumiremos brevemente los métodos más populares en efecto de tener un mayor entendimiento de cuales son las ventajas que nos proporciona **Hyperband** y cuales son las falencias que intentara suplir.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_3.png)

### Grid Search/Random Search

**Grid Search** es uno de los enfoques más populares debido a su simplicidad al implementar. Este algoritmo actua discretizando el espacio de búsqueda para poder generar todas las configuraciones posibles de hiperparametros. Luego, evalúa cada una de estas configuraciones, y al finalizar selecciona a la de mayor desempeño.

Este enfoque posee ciertas desventajas. Por un lado, el número de configuraciones a evaluar crecerá exponencialmente con respecto al número de hiperparámetros que se deban ajustar.

Por otra parte, supongamos que tenemos solo dos hiperparametros para ajustar a nuestro modelo, uno es muy importante para este y el otro no. En este ejemplo cada uno tendrá 3 valores posibles y por ende nuestro espacio de búsqueda estará compuesto por 9 configuraciones en total.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_4.png)

Como se puede observar en la figura 3, el algoritmo no ha podido encontrar el mejor valor para el "hiperparámetro importante" luego de evaluar cada configuración debido al uso del espacio discretizado.

**Random Search** es una variante a Grid Search que intenta solventar la problematoca anterior, muestreando aleatoriamente configuraciones sin discretizar el espacio de búsqueda. Al no tener una condición de fin implícita la cantidad de configuraciones muestreadas a evaluar será escogida por nosotros.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_5.png)

Este algoritmo también tiene la misma falencia respecto a la dimensionalidad del espacio de busqueda, ya que a mayor espacio necesitará una mayor cantidad de muestreos para tener una mínima cobertura sobre este que asegure cierta aceptación.


### Optimización Bayesiana

Tanto Grid Search como Random Search convergen eventualmente luego de un tiempo determinado. Pero en la práctica esto no es viable, ya que los recursos (tiempo y costos) de los cuales disponemos suelen ser limitados.

Dada estas restricciones, necesitaremos de algoritmos más inteligentes para buscar buenas configuraciones y abandonar por un momento las búsquedas a ciegas. Aquí es donde se nos presenta la **Optimización Bayesiana (BO)**.

En esencia, la optimización bayesiana es un modelo de probabilidad que quiere aprender una función objetivo costosa aprendiendo basándose en observaciones previas. Tiene dos características poderosas: modelo sustituto y función de adquisición.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_6.png)

La figura anterior será un buen punto de partida para entender cómo es que **BO** trabaja.

Como mencionamos anteriormente, nuestro objetivo es encontrar el punto que minimice la función objetivo **f**. Pero recordemos que desconocemos el valor real de esta.

Entonces, supongamos que inicialmente seleccionemos dos configuraciones a evaluar (representadas por los puntos negros). A continuación lo que BO tratará de hacer es ajustar un **modelo sustituto** para aproximar a **f** utilizando algún modelo probabilístico dada las configuraciones ya observadas.

Luego, la decisión de cuál será la siguiente configuración a evaluar sera tomada por la función de adquisición. Intentará explorar aquellas zonas donde existe muy poca información y potencialmente podamos encontrarnos con buenas configuraciones.

Finalmente, la configuración seleccionada por la función de adquisición se agregara al conjunto de configuraciones ya evaluadas, y nuevamente se ajustará el modelo sustituto. Se iterará tantas veces como sea necesario, y al final seleccionaremos el punto que minimice la función aproximada.

Si bien **BO** funciona muy bien en este tipo de optimizaciones, tiene una desventaja que no podemos dejar pasar y es que no se pueden paralelizar los recursos debido a que el proceso es secuencial. Además, las variantes más clásicas de BO también tendrán problema con espacios de búsquedas de altas dimensiones.


## Successive Halving
Antes de ir a nuestro tema en cuestión, debemos mencionar a su predecesor **Successives Halving (SH)**. 

La idea detrás del algoritmo deriva directamente de su nombre: 
+ Asigna uniformemente un presupuesto (Por ejemplo: tiempo de entrenamiento, número de epochs, etc.) a un conjunto de configuraciones de hiperparámetros muestreadas aleatoriamente.
+ Evalúa el rendimiento de todas las configuraciones. 
+ Descartar la mitad menos prometedora cumplido un presupuesto determinado. 
+ Repetir hasta que quede sólo una configuración.

El objeto de **SH** asignar exponencialmente más recursos a configuraciones más prometedoras. En su funcionamiento podemos observar que es similar a Random Search, pero con la diferencia de que aplica early stopping descartando aquellas configuraciones que peor desempeño estén obteniendo.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_7.gif)

Desafortunadamente también nos enfrentamos a un problema con este tipo de enfoque. SH requiere como entrada el número de configuraciones **n** a evaluar. Dado un presupuesto B finito (por ejemplo, una hora de tiempo de entrenamiento para elegir una configuración de hiperparámetro), los recursos B/n se asignan en promedio entre todas las configuraciones. Sin embargo, para una B fija, no está claro a priori si deberíamos: 
+ **(a)** considerar muchas configuraciones **(n grande)** con un tiempo medio de entrenamiento pequeño; o 
+ **(b)** considere un pequeño número de configuraciones **(n pequeña)** con tiempos de entrenamiento promedio más largos.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_8.png)

Utilizaremos un ejemplo para comprender mejor este trade off. La figura 2 muestra los rendimientos obtenidos por dos configuraciones (v1 y v2) sobre un conjunto de validación en función de los recursos totales asignados.

Inicialmente, es muy difícil diferenciar una de la otra. Es más, podríamos argumentar que v2 viene teniendo mejor desempeño sobre v1. En este caso, si hubiésemos seleccionados un **n grande**, habríamos descartado a v1 dada estas circunstancias. 

Pero luego de un tiempo determinado, cuando el desempeño de ambas configuraciones se estabilizan, observamos que v1 ha sido en realidad la que mayor rendimiento, y esto sólo se podía haber detectado tiendo un **n** relativamente limitado.

A pesar de este obstáculo, SH agiliza considerablemente el tiempo de búsqueda de buenas configuraciones si se elige un **n** relativamente óptimo. Pero como ya observamos, es una tarea sumamente difícil, convirtiendo esta decisión en otro hiperparámetro. Además, de la misma manera que Grid Search y Random Search puede paralelizar la búsqueda reduciendo aún más los tiempos convirtiéndolo en un competidor muy veloz.


## Hyperband
Ahora sí llegó el momento de hablar sobre **Hyperband (HB)**. Al igual que su predecesor, **HB** pone el foco en acelerar el enfoque de Random Search asignando recursos de forma adaptativa, paralelizando los recursos y utilizando early stopping, poniendo así el foco en las configuraciones más prometedoras. 

Esto le permite funcionar determinadamente bien en problemas con alta dimensionalidad de hiperparametros y obteniendo así un excelente balance entre velocidad y performance.


**HB** se observa en el algoritmo 1. Aborda el problema de “n versus B/n” que tiene **SH** al considerar varios valores posibles de **n** para un **B** fijamente preestablecido, en esencia realizando ejecutando Grid Search sobre varios posibles para **n**. 

Asociado con cada valor de n habrá un presupuesto mínimo **r** que se asignará a todas las configuraciones antes de que se descarten algunas; un valor mayor de **n** corresponde a una **r menor** y, por lo tanto, una early stopping más agresivo. 

Hyperband tiene dos componentes principales: 
+ **(1)** El ciclo interno que invoca **SH**  para valores fijos de **n** y **r** (líneas 3-9)
+ **(2)** el ciclo externo itera sobre diferentes valores de **n** y **r** (líneas 1-2).

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_9.png)


Este algoritmo requiere dos entradas: 
+ (1) **R**, la cantidad máxima de recurso que se puede asignar a una sola configuración, y 
+ (2) **η**, una entrada que controla la proporción de configuraciones descartadas en cada ronda de **SH**.

Tanto **R** como **η** determinarán los distintos valores para **n** que se evaluarán y el presupuesto **B** total a utilizar. **HB** comenzará considerando el valor más alto para **n** maximizando así la exploración. Luego ya le dará paso a la llamada de **SH**. 

En cada una de estas invocaciones se reducirá en un factor **η** la cantidad de configuraciones a seguir evaluando, hasta dejar solamente una. Una vez finalizado tanto los ciclos internos como externos se retornará a la configuración que haya obtenido un mejor papel.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_10.png)

La hiperbanda puede aprovechar situaciones en las que la asignación adaptativa funciona bien, al mismo tiempo que se protege en situaciones en las que se requieren asignaciones más conservadoras.


## Implementacion con Ray Tune


## Conclusiones


**Referencias:**


**Lecturas recomendadas:**