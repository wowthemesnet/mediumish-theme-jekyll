---
layout: post
title:  "¿Qué son los datos de telemetría en el desarrollo de software?"
author: didac
categories: [ Observabilidad ]
tags: [ OpenTelemetry ]
image: assets/images/post-headers/que-es-la-telemetria-desarrollo-software.png
excerpt: "En el desarrollo de software, la telemetría se refiere a un proceso automatizado de recopilación de datos de forma remota y la transmisión de estos a una ubicación que analiza el rendimiento."
description: "En el desarrollo de software, la telemetría se refiere a un proceso automatizado de recopilación de datos de forma remota y la transmisión de estos a una ubicación que analiza el rendimiento."
featured: false
hidden: false
beforetoc: "En esta entrada veremos qué son los datos de telemetría en el desarrollo de software y porqué es importante implementarla en nuestros proyectos."
toc: true
audio: null
---

Cuando desarrollamos cualquier aplicación o tenemos un sistema con diferentes componentes de infraestructura poco conocemos de lo que sucede dentro de ello excepto lo que el <em>profiler</em> de la aplicación escupe en caso de que lo activemos o lo que esos componentes de infraestructura nos enseñen de manera amigable nostros, lo usuarios.

Esto de lo que estamos hablando ya es telemetría, pero la gracia de entenderla y saber más allá de lo que escupe una aplicación o un componente por defecto. Empecemos..

## ¿Qué es la telemetría en el desarrollo de software?
La cantidad de servicios que se ejecutan en una arquitectura moderna se ha disparado en los últimos años. Tanto es así que los desarrolladores y los equipos de operaciones necesitaban nuevos estándares para recopilar métricas, registros y seguimientos para cumplir con sus objetivos de rendimiento.

OpenTelemetry (OTEL) es un marco de observabilidad de código abierto compuesto por varias herramientas, API y SDK, que opera bajo Cloud Native Computing Foundation (CNCF). Es resultado de la fusión de los proyectos OpenTracing, estándar de telemetría de trazas, y OpenCensus, estándar de telemetría de mñetricas, para ayudar a recopilar datos de telemetría de aplicaciones y servicios, y reenviarlos a herramientas que analizan el rendimiento y el comportamiento. 

OTEL actualmente admite muchos lenguajes de programación modernos como .Net, Java, C++, Node.js, NestJS, Golang, Rust, Swift, Python, PHP, Ruby, Erlang, etc.

La telemetría se utiliza en múltiples campos, como la meteorología, la medicina y el desarrollo de software. En el desarrollo de software, la telemetría se refiere a un proceso automatizado de recopilación de datos sobre diferentes sistemas y aplicaciones de forma remota y la transmisión de éstos a una ubicación que analiza el rendimiento de dichos sistemas y aplicaciones y desde donde nosotros podremos explotarlos.

Las  trazas, las métricas y los logs son tipos de datos de telemetría (comúnmente conocidos como las verticales de la observabilidad). Puedemos usar OpenTelemetry para instrumentar, generar, recopilar y exportar estos datos de telemetría desde nuestras aplicaciones o infraestructura para comprender lo que está sucediendo. Cada tipo de fuente de datos tiene una función específica en el monitoreo de aplicaciones e infraestructura, que trataremos a continuación.

## Las 3 pilares de la Observabilidad
Cuando hablamos de los tres pilares de la Observabilidad nos referimos a los tres principales tipos de datos de telemtría que podemos exportar desde nuestros sistemas y servicios y que brindan de datos suficientes para luego empezar a tener una buena Observabilidad si los sabemos explotar y, por supuesto, hemos sabido analizar y generar telemetría de calidad desde nuestros servicios.

### Trazas
Cuando un usuario, una aplicación o un servicio realiza una solicitud, una traza brinda una imagen de alto nivel de lo que está sucediendo, es decir nos pinta el flujo de una acción de principio a fin. En las arquitecturas basadas en microservicios, habrá muchos servicios interdependientes y la mayoría de las operaciones involucran múltiples saltos a través de múltiples servicios.

En tales casos, el seguimiento permite la visibilidad de la salud de extremo a extremo de una aplicación.

Usualmente las aplicaciones de proveedores de análisis y explotación de telemetría suelen presentar cada una de las traas en diagramas de Gantt ó Flame Graphs.

![Trazas de telemetría en JaegerUI representada en diagrama de Gantt](/assets/images/opentelemetry-trazas-telemetria-jaegerui.png "Trazas de telemetría en JaegerUI representada en diagrama de Gantt")
<small><em>Diagrama de Gantt en JaegerUI</em></small>

### Métricas
Las métricas nos proporcionan información estadística sobre un sistema, aplicación o servicio. Las métricas nos brindan información sobre la medición, la hora en que se capturó y los metadatos asociados.

Con la ayuda de las métricas, podemos comprender medidas clave para nuestra infraestructura o aplicación, como:
- Uso de CPU.
- Uso de memoria.
- Red.
- Promedio de carga.

Y, podemos hacerlo a través de diferentes dimensiones, tales como:
- Nombre de host.
- Nombre de la aplicación.
- Servicio.

Con la ayuda de las métricas, nuestro equipo de operaciones o los propios equipos de desarrollo podremos monitorear los indicadores clave de rendimiento (conocidos como KPI) para obtener una foto a más alto nivel del rendimiento de los sistemas y aplicaciones. Las trazas y logs también se pueden tomar para generar métricas adicionales (conocidas como custom metrics), como el tiempo de un flujo end to end, el tiempo de determinadas acciones, etc. Y los datos también se pueden agregar para proporcionar métricas agregadas, como recuento, suma, promedio, porcentaje, etc.

![Métricas de telemetría en Grafana](/assets/images/grafana-metricas-telemetria.png "Métricas de telemetría en Grafana")
<small><em>Dashboard de métricas en Grafana</em></small>

### Logs
Los logs contienen datos de alto nivel o detallados, como:
- La marca de tiempo de cuando ocurrió el evento.
- El nombre del sistema que registra esa información, gravedad, nombre de la aplicación, mensaje descriptivo del evento, etc.
- Datos estructurados, no estructurados o de texto sin formato.

Los equipos de operaciones y/o desarrollores de los equipos suelen determinar cuántos logs recopilar (nivel/tipo de log), durante qué períodos y con qué nivel de detalle, equilibrando lo que necesitan para resolver los problemas y los costos de almacenamiento de los logs. Podemos configurar períodos de retención apropiados para los logs. Si bien no es fácil leer todos los logs cuando ocurre un incidente, OpenTelemetry ayuda a recopilar y enviar estos logs a diferentes herramientas para un análisis más rápido.

![Telemetría de Logs en Grafana LLoki](/assets/images/loki-logs-telemetria-software.png "Telemetría de Logs en Grafana Loki")
<small><em>Grafana Loki</em></small>