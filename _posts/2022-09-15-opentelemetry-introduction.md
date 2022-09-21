---
layout: post
title:  "Introducción a Open Telemetry"
author: didac
categories: [ Observabilidad ]
tags: [ OpenTelemetry ]
image: assets/images/post-headers/introduccion-opentelemetry.png
excerpt: "Qué es Open Telemetry y por qué deberías trabajar la telemetría con Open Telemetry en tus proyectos."
description: "Qué es Open Telemetry y por qué deberías trabajar la telemetría con Open Telemetry en tus proyectos."
featured: true
hidden: false
beforetoc: "En esta entrada veremos qué es Open Telemetry y por qué trabajar la telemetría con Open Telemetry en nuestros proyectos."
toc: true
audio: null
---

¿Cuántas veces has tenido que lidiar con implementaciones de telemetría propietarias de diferentes productos / proveedores? 

En  el caso de que hayas tenido que relacionar esa telemetría basándote en las principales tres verticales de la Observabilidad, trazas, métricas y logs, ¿cuánto esfuerzo te ha conllevado conseguirlo? 

En la actualidad tenemos muchísimos proveedores de exportación y explotación de telemetría como Application Insights (Azure, Microsoft), Datadog, New Relic, etc. donde cada uno tiene sus propias definiciones de telemetría y eso nos obliga, además de a aprendernos cómo implementarla en nuestros proyectos en cada caso, a atar todos nuestras aplicaciones y servicios al proveedor escogido. 

OpenTelemetry nació de la necesidad de lidiar con las arquitecturas cada vez más complejas y distribuidas de hoy.

Con Open Telemetry esto ya no nos ocurrirá más, no ataremos nuestras aplicaciones y servicios a proveedores de explotación de temelemtría. Veamos porqué. Empecemos..

## ¿Qué es Open Telemetry?
La cantidad de servicios que se ejecutan en una arquitectura moderna se ha disparado en los últimos años. Tanto es así que los desarrolladores y los equipos de operaciones necesitaban nuevos estándares para recopilar métricas, registros y seguimientos para cumplir con sus objetivos de rendimiento.

OpenTelemetry (OTEL) es un marco de observabilidad de código abierto compuesto por varias herramientas, API y SDK, que opera bajo Cloud Native Computing Foundation (CNCF). Es resultado de la fusión de los proyectos OpenTracing, estándar de telemetría de trazas, y OpenCensus, estándar de telemetría de mñetricas, para ayudar a recopilar datos de telemetría de aplicaciones y servicios, y reenviarlos a herramientas que analizan el rendimiento y el comportamiento. 

OpenTelemetry actualmente admite muchos lenguajes de programación modernos como .Net, Java, C++, Node.js, NestJS, Golang, Rust, Swift, Python, PHP, Ruby, Erlang, etc.

OpenTelemetry es actualmente el segundo proyecto de CNCF con más actividad de desarrollo, sólo por detrás de Kubernetes.

## ¿Por qué deberías empezar a implementar Open Telemetry en tus proyectos?
Para volverse más ágiles, las empresas se están alejando de las arquitecturas monolíticas hacia arquitecturas basadas en microservicios. Sin embargo, una arquitectura más distribuida dificulta que los desarrolladores y los equipos de operaciones comprendan las dependencias entre los servicios durante las interrupciones. La observabilidad, y por lo tanto OpenTelemetry, es un enfoque de instrumentación para recopilar datos procesables sobre estos servicios y sistemas e identificar problemas más rápido.

Los equipos de operaciones deben:

- Saber qué datos recopilar.
- Recopilarlo rápidamente para abordar los problemas de disponibilidad y rendimiento de las aplicaciones o la infraestructura.
- Tener la capacidad de correlacionar métricas, registros y seguimientos para cumplir con los objetivos del equipo para la excelencia operativa.

Pongamos un ejemplo.. Supongamos que tenemos tres aplicaciones que interactúan con un servicio API que envía solicitudes a la base de datos. Cuando el equipo de operaciones recibe una alerta de que la base de datos está inactiva, deben verificar métricas como el uso de la CPU y el uso de la memoria y cómo reciben las solicitudes. Luego, verificarán los logs relacionados con el servicio API y cualquier log y traza relacionado con la aplicación. Con la ayuda de estos 3 pilares de Observabilidad, que son seguimientos, métricas y registros, el equipo de operaciones debería poder averiguar por qué la base de datos está inactiva y solucionar el problema en consecuencia.

Sin embargo, en un momento, no había un formato de datos estandarizado para enviar datos al backend del proveedor de monitorización y observabilidad. Para llevar a cabo la estandarización, la comunidad creó dos proyectos de código abierto:

- OpenTracing: proporciona API independientes del proveedor e instrumentación para el seguimiento distribuido (trazas). Los desarrolladores deben implementar sus propias bibliotecas para cumplir con la especificación.
- OpenCensus: proporciona un conjunto de bibliotecas para varios idiomas que permiten recopilar métricas y trazas de aplicaciones, y transferir datos a cualquiera de los proveedores backend de monitorización y observabilidad compatibles.

OpenTelemetry es el resultado de la fusión de estos proyectos de código abierto recién mencionados con el añadido de una estandarización para la telemetría de logs.

## Componentes de Open Telemetry
En los siguientes puntos entenderemos cuáles son los componentes de Open Telemtry y cuál es la misión de cada uno.

![Componentes de OpenTelemetry](/assets/images/componentes-opentelemetry.png "Componentes de OpenTelemetry")
<small><em>Componentes de OpenTelemetry</em></small>

### OpenTelemetry APIs
Las APIs permiten que diferentes componentes de software se comuniquen entre sí mediante un conjunto de definiciones y protocolos. En OpenTelemetry, las API definen los tipos de datos y las operaciones para generar y correlacionar datos de telemetría, como trazas, métricas y logs.

### OpenTelemetry SDKs
Los SDKs definen conceptos de configuración, procesamiento de datos y exportación. También definen los requisitos para la implementación de cualquier API específica del idioma.

### OTEL Collector
Los colectores de OpenTelemetry, OTEL Collectors, reciben, procesan y exportan datos de telemetría. Requieren de algún proveedor backend de monitorización, como por ejemplo Datadog o New Relic, para recibir y almacenar los datos, que pueden almacenarse en múltiples formatos como OTLP (Open Telemetry Protocol), o formatos que funcionan con Prometheus, Jaeger, etc.

Los colectores de OpenTelemetry, OTEL Collectors, proporcionan dos métodos de implementación:

- Agente: una instancia del colector, OTEL Collector, se ejecuta con la aplicación o en el mismo host que la aplicación como binario, sidecar o daemon/deamon set.
- Gateway: una o más instancias del colector, OTEL Collector, se ejecutan como servicios independientes en clústeres, centros de datos o regiones.

Los colectores de Open Telemetry, OTEL Collectors, están compuestos por:

- Receptores (Receivers) que reciben datos que pueden ser de tipo push o pull.
- Procesadores (Processors) que procesan los datos recibidos.
- Exportadores (Exporters) que exportan/envían los datos que pueden ser push o pull-based.

![Diagrama de la composición OTEL Collector](/assets/images/composicion-pipelines-otel-collector.png "Diagrama de la composición OTEL Collector")
<small><em>Diagrama de la composición OTEL Collector</em></small>

Los exportadores ayudan a desacoplar la instrumentación del backend y brindan la funcionalidad para enviar telemetría a los consumidores. Podemos cambiar el proveedor de backend, como Prometheus, Jaeger y Zipkin, sin tener que cambiar nada en la instrumentación, y tenemos una amplia variedad de provedores y servicios de código abierto o de terceros para elegir.

El flujo de entrada, procesamiento y salida se define con pipelines. Las pipelines constan de uno o más <em>receivers</em>, cero o más <em>processors</em> y uno o más <em>exporters</em>. Las pipelines se diferencian por pipeline de trazas, métricas y logs y también por el o los <em>receivers</em> de entrada a la pipeline.

## Beneficios de Open Telemetry en nuestros sistemas y servicios
Los equipos de desarrollo y operaciones solemos dedicar una cantidad significativa de tiempo a recopilar datos de telemetría y tratar de comprender los diferentes formatos en los que se recopilan los datos. Esto ha llevado a que solucionar cualquier problema relacionado con la infraestructura subyacente o la aplicación sea complejo. OpenTelemetry nos presenta un estándar para recopilar y enviar datos de telemetría en infraestructura o aplicaciones desde arquitecturas complejas (es decir, basadas en microservicios). Esto nos ayuda a los equipos de desarrolladores y operaciones a liberar nuestro tiempo para prevenir incidentes y resolver problemas.

Además de esto nos da las siguientes, y destacables, ventajas al tratarse del estándar de datos de telemetría en el desarrollo de software:
- Desarrollamos una única vez la instrumentación por servicio.
- No estamos aferrados a ningún proveedor backend de monitorización y observabilidad concreto. Esto nos facilita agilidad e innovación.
- Podemos transformar y exportar la inforamción, telemetría, de manera agnóstica a la aplicación gracias al componente de Open Telemetry OTEL Collector.

## Desventajas de Open Telemetry en nuestros sistemas y servicios
Dependiendo del lenguaje de desarrollo los SDKs están aún en versiones alpha ó beta en algunas de las "verticales": trazas, métricas o logs. Esto está en continuo desarrollo y van saliendo las cosas rápido. Actualmente, como antes se ha comentado, Open Telemetry es el segundo proyecto de la CNCF con más actividad en el desarrollo, sólo por detrás de Kubernetes.

## ¿Cómo funciona Open Telemetry?
Open Telemetry recopila datos de telemetría en varios pasos y los exporta a un proveedor de backend mediante un protocolo denominado Open Telemetry Protocol (OTLP).
Open Telemetry le dice a los diferentes componentes del sistema, tanto del lado de la infraestructura como de la aplicación, qué datos recopilar y cómo recopilarlos mediante la instrumentación del código con API.
Luego recopila los datos mediante SDK, los envía para su procesamiento y los exporta.
Finalmente, enriquece los datos utilizando la contextualización de múltiples fuentes al reducir los errores.
OpenTelemetry no proporciona el backend de observabilidad real. Los equipos de desarrollo y/o operaciones son responsables de exportar datos a las numerosas herramientas de análisis patentadas y de código abierto disponibles.

En última instancia, OpenTelemetry nos ayuda a los desarrolladores y equipos de operaciones al proporcionar una arquitectura conectable para que se puedan agregar fácilmente formatos y protocolos adicionales.

La instrumentación es clave. Podemos elegir entre instrumentación automática y manual.

### Instrumentación Automática
Con esta opción, deberemos agregar dependencias y luego configurar la instrumentación de Open Telemetry. Estas dependencias específicas del lenguaje agregarán las capacidades de SDK y API de Open Telemetry. Es posible que también se requieran dependencias del exportador.

Hay diferentes opciones de configuración disponibles, tales como:

- Configuración específica del origen de datos.
- Configuración del exportador.
- Configuración del propagador.
- Configuración de recursos.

### Instrumentación Manual
Con esta opción, deberemos importar la API y el SDK de OpenTelemetry, configurar la API de OpenTelemetry creando un >
<em>tracer</em>, configurar el SDK de Open Telemetry si está creando un proceso, crear datos de telemetría como trazas, métricas y logs, y luego exportar los datos a proveedor backeend como Jaeger, Loki, Prometheus o Zipkin.

<br/>
<b>Enlaces de interés:</b>
- <a href="https://opentelemetry.io" target="_blank">Sitio web de OpenTelemetry</a>.
- <a href="https://www.cncf.io/projects/opentelemetry" target="_blank">OpenTelemetry en el ecosistema CNCF</a>.
- <a href="https://github.com/open-telemetry/opentelemetry-dotnet" target="_blank">Repositorio oficial de .NET de OpenTelemetry</a>.
- <a href="https://github.com/open-telemetry/opentelemetry-dotnet-contrib" target="_blank">Repositorio oficial de contribuciones de .NET de OpenTelemetry</a>.
- <a href="https://github.com/open-telemetry/opentelemetry-collector" target="_blank">Repositorio oficial de OTEL Collector</a>.
- <a href="https://github.com/open-telemetry/opentelemetry-collector-contrib" target="_blank">Repositorio oficial de contribuciones de OTEL Collector</a>.