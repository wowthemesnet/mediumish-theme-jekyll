---
layout: post
title:  "¿Cómo implementar Open Telemetry en C# .NET?"
author: didac
categories: [ .NET, Observabilidad ]
tags: [ OpenTelemetry ]
image: assets/images/post-headers/introduccion-opentelemetry-dotnet.png
excerpt: "Cómo instrumentar nuestros servicios desarrollados en C# .NET con Open Telemetry."
description: "Cómo instrumentar nuestros servicios desarrollados en C# .NET con Open Telemetry."
featured: true
hidden: false
beforetoc: "En esta entrada veremos cómo podemos instrumentar Open Telemetry en nuestras aplicaciones o servicios desarrollados en C# .NET."
toc: true
audio: null
---

Open Telemetry y su proactiva comunidad nos ofrece a los desarrolladores de C# .NET una serie de librerías para poder instrumentar, generar telemetría, fácilmente nuestros procesos. 

Para entender lo que se va a hacer en los siguientes ejemplos es necesario conocer previamente qué es Open Telemetry y sus conceptos básicos. Te invito, si no has tenido ocasión de aprender sobre Open Telemetry, a visitar mi anterior entrada <a href="opentelemetry-introduction" target="_blank">Introducción a OpenTelemetry</a>.

A la hora de configurar el proveedor de trazas, métricas o logs nos encontramos con 3 funcionalidades distintas. Instrumentaciones (Source), Procesadores y Exportadores.

- Instrumentaciones (<em>Instrumentations</em>): Activa la telemetría de trazas para las librerías / funcionalidades descritas en el método de Instrumentación.
- Procesadores (<em>Processors</em>): Transforman la telemetría antes de ser exportada hacia fuera de la aplicación.
- Exportadores (<em>Exporters</em>): Para indicar dónde queremos que se envíe nuestra telemetría.

Antes de empezar a instrumentar nuestro servicio deberemos escribir la siguiente instrucción en cada uno de los hosts (en primera línea de Program.cs) para poder usar canal GRPC de HTTP2 sin TLS para que el host pueda comunicarse con el componente de OTEL Collector a través del puerto GRPC.

```csharp
AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
```

Y por último añadir paquete NuGet OpenTelemetry a nuestro csproj.

Ya estamos <em>ready</em> para continuar con la implementación de la telemetría.

## ¿Cómo instrumentar con Open Telemetry las trazas en .NET?
Ejemplo de código de una implementación básica de OpenTelemetry en la vertical de telemetría de trazas y explicación de la misma.

```csharp
var assemblyName = typeof(Program).Assembly.GetName();
services.AddOpenTelemetryTracing(builder =>
{
    builder.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService(serviceName: assemblyName.Name,
            serviceVersion: assemblyName.Version!.ToString()));
 
    builder
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation(options =>
        {
            options.SetHttpFlavor = true;
            options.RecordException = true;
        })
        #if DEBUG
        .AddConsoleExporter()
        #endif
        .AddOtlpExporter(options => 
            options.Endpoint = new Uri("http://localhost:4317"));
});
```

<b>.AddOpenTelemetryTracing</b> registra el proveedor de trazas de Open Telemetry y nos provee de una sobrecarga en la que podremos configurar el builder del mismo.

<b>.SetResourceBuilder</b> establece el nombre que tendrá el servicio en todo su envío de telemetría de trazas. En el ejemplo se crea el resource por defecto y se le añade la información del servicio con el nombre y la versión del assembly. La versión es importante porque cuando queramos analizar flujos en nuestro proveedor podremos identificar en cuáles versiones de la aplicación se ha reproducido ese error.

### Instrumentaciones automáticas de trazas con OpenTelemetry

<b>Cliente de Http</b><br/>
Para añadir instrumentación automática de llamadas http de nuestro servicio.
Añadir paquete NuGet OpenTelemetry.Instrumentation.Http a nuestro csproj. El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.Http" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.Http</a>.

<b>AspNetCore</b><br/>
Para añadir instrumentación automática de AspNetCore, como por ejemplo llamadas a la API, a nuestro servicio. Uso habitual en APIs.
Añadir paquete NuGet OpenTelemetry.Instrumentation.AspNetCore a nuestro csproj. El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.AspNetCore" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.AspNetCore</a>.

<b>¡Quiero más instrumentaciones automáticas!</b><br/>
Podemos encontrar muchas más instrumentaciones en los repo oficiales <a href="https://github.com/open-telemetry/opentelemetry-dotnet" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet</a> y <a href="https://github.com/open-telemetry/opentelemetry-dotnet-contrib" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet-contrib</a> al igual que en diferentes contribuciones que hacen proveedores de productos o la comunidad.

### Exportadores de trazas con OpenTelemetry

<b>Consola</b><br/>
Exporta las trazas a la consola.<br/>
Añadir paquete NuGet OpenTelemetry.Exporter.Console a nuestro csproj.<br/>
La recomendación es usar éste exportador únicamente en debug. A nivel de código el ejemplo está en los extractos de ejemplo y a nivel de nuget sería tal que así:

```xml
<ItemGroup Condition="'$(Configuration)'=='DEBUG'">
    <PackageReference Include="OpenTelemetry.Exporter.Console" Version="1.3.0" /* Versión actual en el momento de escribir esta entrada */ />
</ItemGroup>
```

El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console</a>.

<b>OTLP (Open Telemetry Protocol)</b><br/>
Exporta las trazas a cualquier endpoint que acepte el protocolo OTLP, por ejemplo OTEL Collector, NewRelic o Aspecto.<br/>
Añadir paquete NuGet OpenTelemetry.Exporter.OpenTelemetryProtocol a nuestro csproj.<br/> 
El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol</a>.

<b>¡Quiero más exportadores!</b><br/>
Podemos encontrar muchos más exportadores en los repo oficiales <a href="https://github.com/open-telemetry/opentelemetry-dotnet" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet</a> y <a href="https://github.com/open-telemetry/opentelemetry-dotnet-contrib" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet-contrib</a> al igual que en diferentes contribuciones que hacen proveedores de productos o la comunidad.

## ¿Cómo instrumentar con Open Telemetry las métricas en .NET?
Ejemplo de código de una implementación básica de OpenTelemetry en la vertical de telemetría de métricas y explicación de la misma.

```csharp
var assemblyName = typeof(HostServiceCollectionExtensions).Assembly.GetName();
 
services.AddOpenTelemetryMetrics(builder =>
{
    builder.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService(serviceName: assemblyName.Name,
            serviceVersion: assemblyName.Version!.ToString()));

    builder
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        #if DEBUG
        .AddConsoleExporter()
        #endif
        .AddOtlpExporter(options => 
            options.Endpoint = new Uri("http://localhost:4317"));
});
```
<b>.AddOpenTelemetryMetrics</b> registra el proveedor de métricas de Open Telemetry y nos provee de una sobrecarga en la que podremos configurar el builder del mismo.

<b>.SetResourceBuilder</b> establece el nombre que tendrá el servicio en todo su envío de telemetría de métricas. En el ejemplo se crea el resource por defecto y se le añade la información del servicio con el nombre y la versión del assembly. La versión es importante porque cuando queramos analizar métricas en nuestro proveedor podremos identificar en cuáles versiones de la aplicación se han reproducido determinadas métricas.

### Instrumentaciones automáticas de métricas con OpenTelemetry

<b>Cliente de Http</b><br/>
Para añadir instrumentación automática de llamadas http de nuestro servicio.
Añadir paquete NuGet OpenTelemetry.Instrumentation.Http a nuestro csproj. El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.Http" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.Http</a>.

<b>AspNetCore</b><br/>
Para añadir instrumentación automática de AspNetCore, como por ejemplo llamadas a la API, a nuestro servicio. Uso habitual en APIs.
Añadir paquete NuGet OpenTelemetry.Instrumentation.AspNetCore a nuestro csproj. El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.AspNetCore" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Instrumentation.AspNetCore</a>.

<b>¡Quiero más instrumentaciones automáticas!</b><br/>
Podemos encontrar muchas más instrumentaciones en los repositorios oficiales <a href="https://github.com/open-telemetry/opentelemetry-dotnet" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet</a> y <a href="https://github.com/open-telemetry/opentelemetry-dotnet-contrib" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet-contrib</a> al igual que en diferentes contribuciones que hacen proveedores de productos o la comunidad.

### Exportadores de métricas con OpenTelemetry

<b>Consola</b><br/>
Exporta las métricas a la consola.<br/>
Añadir paquete NuGet OpenTelemetry.Exporter.Console a nuestro csproj.<br/>
La recomendación es usar éste exportador únicamente en debug. A nivel de código el ejemplo está en los extractos de ejemplo y a nivel de nuget sería tal que así:

```xml
<ItemGroup Condition="'$(Configuration)'=='DEBUG'">
    <PackageReference Include="OpenTelemetry.Exporter.Console" Version="1.3.0" /* Versión actual en el momento de escribir esta entrada */ />
</ItemGroup>
```

El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console</a>.

<b>OTLP (Open Telemetry Protocol)</b><br/>
Exporta las trazas a cualquier endpoint que acepte el protocolo OTLP, por ejemplo OTEL Collector, NewRelic o Aspecto.<br/>
Añadir paquete NuGet OpenTelemetry.Exporter.OpenTelemetryProtocol a nuestro csproj.<br/> 
El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol</a>.

<b>¡Quiero más exportadores!</b><br/>
Podemos encontrar muchos más exportadores en los repositorios oficiales <a href="https://github.com/open-telemetry/opentelemetry-dotnet" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet</a> y <a href="https://github.com/open-telemetry/opentelemetry-dotnet-contrib" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet-contrib</a> al igual que en diferentes contribuciones que hacen proveedores de productos o la comunidad.

## ¿Cómo instrumentar con Open Telemetry los logs en .NET?
Ejemplo de código de una implementación básica de OpenTelemetry en la vertical de telemetría de logs y explicación de la misma.

```csharp
var assemblyName = typeof(Program).Assembly.GetName();
 
loggingBuilder.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService(serviceName: assemblyName.Name,
            serviceVersion: assemblyName.Version!.ToString()));

    options.IncludeFormattedMessage = true;
    options.IncludeScopes = true;

    options
        #if DEBUG
        .AddConsoleExporter()
        #endif
        .AddOtlpExporter(opts =>
            opts.Endpoint = new Uri("http://localhost:4317"));
});
```

<b>.AddOpenTelemetry</b> registra el proveedor de logs de Open Telemetry como uno de los proveedor de ILogger y nos provee de una sobrecarga en la que podremos configurar el builder del mismo. Al estar registrado como proveedor de ILogger todo log que codifiquemos en nuestra aplicación ya será tratado y exportado por el proveedor configurado de OpenTelemetry.

<b>.SetResourceBuilder</b> establece el nombre que tendrá el servicio en todo su envío de telemetría de logs. En el ejemplo se crea el resource por defecto y se le añade la información del servicio con el nombre y la versión del assembly. La versión es importante porque cuando queramos analizar logs en nuestro proveedor podremos identificar en cuáles versiones de la aplicación se han producido determinados.

### Exportadores de logs con OpenTelemetry

<b>Consola</b><br/>
Exporta los logs a la consola.<br/>
Añadir paquete NuGet OpenTelemetry.Exporter.Console a nuestro csproj.<br/>
La recomendación es usar éste exportador únicamente en debug. A nivel de código el ejemplo está en los extractos de ejemplo y a nivel de nuget sería tal que así:

```xml
<ItemGroup Condition="'$(Configuration)'=='DEBUG'">
    <PackageReference Include="OpenTelemetry.Exporter.Console" Version="1.3.0" /* Versión actual en el momento de escribir esta entrada */ />
</ItemGroup>
```

El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console</a>.

<b>OTLP (Open Telemetry Protocol)</b><br/>
Exporta las trazas a cualquier endpoint que acepte el protocolo OTLP, por ejemplo OTEL Collector, NewRelic o Aspecto.<br/>
Añadir paquete NuGet OpenTelemetry.Exporter. OpenTelemetryProtocol.Logs a nuestro csproj.<br/>
El código fuente y su documentación lo encontrarás en el siguiente repo: <a href="https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol.Logs" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol.Logs</a>.

<b>¡Quiero más exportadores!</b><br/>
Podemos encontrar muchos más exportadores en los repositorios oficiales <a href="https://github.com/open-telemetry/opentelemetry-dotnet" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet</a> y <a href="https://github.com/open-telemetry/opentelemetry-dotnet-contrib" target="_blank">https://github.com/open-telemetry/opentelemetry-dotnet-contrib</a> al igual que en diferentes contribuciones que hacen proveedores de productos o la comunidad.