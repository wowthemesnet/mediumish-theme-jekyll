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
beforetoc: "<p>En estos últimos años los algoritmos de Machine Learning(ML) han resuelto una amplia variedad de tareas con gran éxito, alcanzando el state of the art en diversas áreas. Esto no sólo se debe al desarollo de nuevos algoritmos (más potentes y más grandes), en muchos casos la correcta selección de hiperparámetros de estos ha contribuido a lograr este éxito.</p>
Sin embargo, seleccionar los hiperparámetros de un modo preciso para un algoritmo determinado no es una tarea para nada trivial. Existe una amplia variedad métodos para resolver este tipo problema y en este árticulo te presentaré a Hyperband.
"
toc: true
---



## Hyperparameter optimization

Los algoritmos de ML tienen múltiples, diversos y complejos hiperparámetros. Por ejemplo, si desarrollamos una red neuronal deberíamos indicar el número de capas que la componen, definir un learning rate o seleccionar un método de regularización entre otros.

Esto provoca que el número de configuraciones distintas posibles a utilizar sea inmensurable, y que seleccionar la mejor sea una tarea muy difícil de realizar por no decir casi imposible.

Cuando hablamos de la mejor, nos referimos a aquella combinación de hiper parámetros que para un algoritmo determinado retorna el mayor rendimiento posible dado un conjunto de validación.

El principal problema a partir de todo esto, es que es sumamente costoso evaluar una configuración determinada, lo que complejiza aun más la búsqueda y como ya te habrás podido dar cuenta hacerla manualmente no es factible. 

Es aquí donde nos topamos con un método que nos ayudará a resolver este tipo de problemas y al que se lo conoce como Hyperparameter Optimization(HPO) o Hyperparameter Tuning.

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_2.png)


Dado que el rendimiento que obtiene un algoritmo sobre un conjunto de validación puede ser modelado como una función **f : X $$ \to $$ R** de sus hiper parámetros **x ∈ X** (f puede ser cualquier función de error, por ejemplo el RMSE en un problema de regresión o el AUC Score para un problema de clasificación), el problema de HPO se puede plantear de la siguiente forma:
<center>$$\mathbf {x* ∈ arg min_{x∈X} f(x)}$$</center>

Es palabras simples, debemos encontrar aquellas configuración hiperparámetros para un algoritmo que minimicen una función de error definida. Existen diferentes enfoques de HPO como veremos en el siguiente gráfico:

![ga_elements alt ><]({{ site.baseurl }}/assets/images/2_post_img_3.png)

Pero en este artículo como mencionamos al inicio hablaremos sobre Hyperband. 

## Successive halving


## Hyperband


## Implementacion con Ray Tune


## Conclusiones


**Referencias:**


**Lecturas recomendadas:**