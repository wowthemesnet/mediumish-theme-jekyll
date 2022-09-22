---
layout: post
title:  "Ingesta de telemetría Open Telemetry, OTLP, en Datadog"
author: didac
categories: [ Observabilidad, Monitoring ]
tags: [ OpenTelemetry, Datadog ]
image: assets/images/post-headers/open-telemetry-datadog.png
excerpt: "¿Cómo exportar nuestra telemetría de OpenTelemetry a Datadog?"
description: "Observabilidad con OpenTelemetry y Datadog. ¿Cómo exportar nuestra telemetría de OpenTelemetry a Datadog?"
featured: false
hidden: false
beforetoc: "En esta entrada veremos cómo exportar nuestra telemetría de OpenTelemetry a Datadog."
toc: true
audio: null
---

El proveedor de monitoreo Datadog actualmente soporta el protocolo de Open Telemetry, OTLP, en dos de las tres verticales de observabilidad, trazas y métricas. Existen exportadores tanto para el colector de Open Telemetry, OTEL Collector, como para diferentes lenguajes de programación que convierten las telemetría de OTLP a la telemetría propia de Datadog. La vertical restante, los logs, no están soportados al no existir exportador oficial alguno pero en esta entrada descubriremos cómo podemos solucionarlo.

Para poder seguir esta entrada primero es necesario tener el servicio de OTEL Collector en nuestro host corriendo. Puedes encontrar cómo tener un contenedor de OTEL Collector en Docker listo para únicamente la adición de exportadores en la anterior entrada "OTEL Collector".

## Exportando trazas de Open Telemetry a Datadog
Datadog tiene un exportador para el OTEL Collector, lo podemos encontrar en el repo de contribuciones de OTEL Collector <a href="https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/datadogexporter" target="_blank">opentelemetry-collector-contrib</a>.

Para poder exportar la telemetría de la vertical trazas del protocolo de Open Telemetry a Datadog a través del OTEL Collector tendremos que añadir un nuevo exportador, el de Datadog, en nuestro fichero de configuración de OTEL Colector para posteriormente añadirle Datadog en la pipeline de trazas que nos interese de nuestro mismo archivo de OTEL Collector.

```yaml
receivers:
  otlp:
    protocols:
      grpc:

processors:

exporters:
    datadog:
    api:
        site: <SITE DOMAIN>
        key: <API KEY>

service:
    pipelines:
        traces:
            receivers: [otlp]
            processors: []
            exporters: [datadog]
```

## Exportando métricas de Open Telemetry a Datadog
Para lograr enviar esta vertical, métricas, ya lo tendremos más fácil porque ya tenemos el exportador añadido en el OTEL Collector.

Para poder exportar la telemetría de la vertical de métricas del protocolo de Open Telemetry a Datadog haremos uso del ya añadido exportador de Datadog en nuestro fichero de configuración de OTEL Colector y lo añadiremos en la pipeline de métricas que nos interese de nuestro mismo archivo de OTEL Collector.

```yaml
receivers:
  otlp:
    protocols:
      grpc:

processors:

exporters:
    datadog:
    api:
        site: <SITE DOMAIN>
        key: <API KEY>

service:
    pipelines:
        metrics:
            receivers: [otlp]
            processors: []
            exporters: [datadog]
```

## Exportando logs a Datadog con correlación a las trazas originarias de OTLP
Esta vertical, logs, es para la que no encontraremos, de momento, soporte alguno a través del exportador de Datadog para OTEL Collector. Como consecuencia hemos de buscarnos las habichuelas para poder exportar nuestros logs a Datadog y poderlos correlacionar con las trazas generadas desde Open Telemetry.

Para poder exportar los logs a Datadog y correlacionarlos con las trazas generadas desde Open Telemetry echaremos un vistazo a la siguiente página de los docs de Datadog en la que explica qué debemos hacer por parte nuestra para poder relacionar logs y trazas de Datadog.

A modo de resumen <span class="spoiler">nos indican que los logs deben tener las claves dd.traceId y dd.spanId y el valor del traceId y el spanId respectivamente de la traza relacionada como atributos. Esto quiere decir que desde nuestras aplicaciones deberemos a través de pipelines de logging o de manera manual en cada instrucción de log añadir esas clave-valor para que veamos nuestros logs y trazas correlacionados en Datadog.</span>

En este punto ya cada lenguaje de programación quizás tenga una librería de alguna contribución de algún desarrollador que te configure una pipeline de logging para determinadas librerías o no. En el caso de .NET tenemos una contribución que un servidor creó con Serilog para poder tener esa pipeline preconfigurada que te añada estos atributos en cada uno de los logs.

### Ejemplo correlación de logs con trazas de OpenTelemetry con Datadog y .NET / C#.
El ejemplo con dotnet lo realizaremos con la librería de Serilog y algunas extensiones de la misma.

Añadiremos en nuestro .csproj las siguientes librerías:
- <a href="https://www.nuget.org/packages/Serilog.AspNetCore/" target="_blank">Serilog.AspNetCore</a>: librería de Serilog. <a href="https://github.com/serilog/serilog-aspnetcore" target="_blank">Enlace al código fuente del NuGet</a>.
- <a href="https://www.nuget.org/packages/Serilog.Sinks.Datadog.Logs" target="_blank">Serilog.Sinks.Datadog.Logs</a>: extensión de Serilog para exportar los logs a Datadog. <a href="https://github.com/DataDog/serilog-sinks-datadog-logs/" target="_blank">Enlace al código fuente del NuGet</a>.
- <a href="https://www.nuget.org/packages/Serilog.Enrichers.Datadog.OpenTelemetry" target="_blank">Serilog.Enrichers.Datadog.OpenTelemetry</a>: extensión de Serilog para añadir la información de la correlación de la traza, traceId y spanId, como atributos en el log que sepa interpretar Datadog. <a href="https://github.com/didacrius/serilog-enrichers-datadog-opentelemetry" target="_blank">Enlace al código fuente del NuGet</a>.

```xml
<PackageReference Include="Serilog" Version="2.11.0" />
<PackageReference Include="Serilog.Sinks.Datadog.Logs" Version="1.0.0" />
<PackageReference Include="Serilog.Enrichers.Datadog.OpenTelemetry" Version="1.0.0" />
```

En nuestro program.cs .NET 6 o startup.cs anteriores versiones de .NET añadiremos el siguiente código:

```csharp
var datadogConf = new DatadogConfiguration(url: builder.Configuration.GetValue<string>("Datadog:Endpoints:Logs:EndpointAddress"));

builder.Logging
    .AddSerilog(new LoggerConfiguration()
        .Enrich.FromLogContext()
        .Enrich.WithDatadogTraceId()
        .Enrich.WithDatadogSpanId()
        .WriteTo.DatadogLogs(builder.Configuration.GetValue<string>("Datadog:ApiKey"),
            service: assemblyName.Name,
            configuration: datadogConf)
        .CreateLogger());
```

Y <em>voilà</em>! Una vez arranquemos nuestros servicios deberíamos de empezar a ver cómo nos llegan trazas, métricas y logs a Datadog y cómo están correllacionados entre ellos. Desde una traza podremos ver os logs asociados a la misma al igual que las métricas globales del servicio durante ese período de tiempo y desde un log podremos ver la traza asociada al mismo.