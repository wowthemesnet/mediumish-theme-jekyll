---
layout: post
title:  "Opciones y forma de uso en el blog"
author: danifernandezs
categories: [ blog, how-to ]
image: assets/images/posts/2023-01-01/jekyll.png
featured: false
hidden: true
---

## Referencia de imágenes externas como imágen para el post

A la hora de definir la imagen a mostrar por el post en la tarjeta correspondiente, también se puede hacer referencia a una imágen externa a este propio repositorio.

### Ejemplo

```
---
layout: post
title:  "External Featured Image"
author: sal
categories: [ Jekyll, tutorial, web development ]
image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a20c472bc23308e390c8ffae3dd90c60&auto=format&fit=crop&w=750&q=80"
---
```

## Texto con formato de cita

En ocasiones puede ser necesario citar de forma textual algún bloque de texto o frase, para estas situaciones podemos agregar citas al post que se quiera publicar.

Como por ejemplo.

> "Más vale proyecto publicado con licencia libre, que ciento en el cajón" #proverbioFriki
<div style="text-align: right"> <p><a href='https://twitter.com/Obijuan_cube/status/646235942072791040'>@Obijuan_cube</a></p> </div>

### Ejemplo

```
A continuación se incluye texto "citado"

>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu.

```

## Formateo especial

Además de negrita y cursiva, también se pueden emplear otros formatos especiales en Markdown cuando se desee.

+ ~~tachado~~
+ ==resaltado==
+ \*escape de carateres\*


## Escribiendo bloques de código

Hay dos tipos de elementos de código que se pueden insertar en Markdown, el primero en línea y el otro en bloque. 

El código en línea se formatea envolviendo cualquier palabra o palabras en comillas invertidas, `así`. 

Los fragmentos de código más grandes se pueden mostrar en varias líneas usando tres marcas de retroceso:

```
.my-link {
    text-decoration: underline;
}
```

#### HTML

```html
<li class="ml-1 mr-1">
    <a target="_blank" href="#">
    <i class="fab fa-twitter"></i>
    </a>
</li>
```

#### CSS

```css
.highlight .c {
    color: #999988;
    font-style: italic; 
}
.highlight .err {
    color: #a61717;
    background-color: #e3d2d2; 
}
```

#### JS

```js
// alertbar later
$(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 280) {
        $('.alertbar').fadeIn();
    } else {
        $('.alertbar').fadeOut();
    }
});
```

#### Python

```python
print("Hello World")
```

#### Ruby

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

#### C

```c
printf("Hello World");
```

## Full HTML

En Markdown se puede escribir HTML directamente y funcionará como normalmente lo hace HTML. ¡Sin limites! 

Aquí un ejemplo estándar para incluir un video de YouTube:
<p><iframe style="width:100%;" height="315" src="https://www.youtube.com/embed/Cniqsc9QfDo?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></p>

## Uso de spoilers

Los spoilers son una técnica utilizada para ocultar información relevante. Al utilizar un spoiler, se oculta el contenido que puede afectar la experiencia del usuario y se requiere que haga clic para revelar esa información.

Es importante etiquetar adecuadamente los spoilers para que los usuarios puedan elegir si quieren revelar el contenido o no.

### Ejemplo de uso

En este párrfo, a partir de este momento <span class="spoiler">el contenido está oculto tras un spoiler</span> y para revelar su contenido deberás hacer click sobre el texto oculto.

### ¿Cómo emplear spoilers?

```html
<span class="spoiler">Este texto está oculto tras la necesidad de hacer click en él previamente.</span>
```
