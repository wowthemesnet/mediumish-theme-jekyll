---
layout: post
title:  "¿Cómo medir el rendimiento del código con BenchmarkDotNet?"
author: didac
categories: [ .NET ]
tags: [ rendimiento ]
image: assets/images/posts/benchmark-performance-library/medir-renidmiento-codigo-benchmarkdotnet.png
excerpt: "Cómo medir el rendimiento del código desarrollado en C# .NET con BenchmarkDotNet."
description: "Cómo medir el rendimiento del código desarrollado en C# .NET con BenchmarkDotNet."
featured: false
hidden: false
beforetoc: "En esta entrada veremos cómo podemos medir el rendimiento del código desarrollado en C# .NET con BenchmarkDotNet."
toc: true
audio: null
---

Si eres de los que leen artículos de .NET sean de la propia Microsoft o de terceros, estoy seguro que más de una vez te habrás encontrado las estadísticas de "rendimiento" de un fragmento de código pequeño. Pues que sepas que esas  estadísticas pueden ser generadas gracias a un paquete NuGet llamado "<b>BenchmarkDotNet</b>" y que tras leer este artículo tú también podrás empezar a sacar esas métricas para consumo propio, blogs o lo que te venga en gana.

En este artículo, vamos a echar un vistazo a lo que es BenchmarkDotNet y cómo puede ser útil para evaluar y comparar diferentes bloques de código en términos de rendimiento.

## ¿Qué es BenchmarkDotNet?
Hoy en día, para lograr un resultado determinado, hay muchas librerías o APIs disponibles. Es por eso que, a veces, cuando estamos escribiendo cualquier pieza de código, podemos enfrentarnos a situaciones donde debemos comparar las opciones disponibles y realizar algún tipo de evaluación comparativa para asegurarnos de cómo se comportan las bibliotecas para diferentes tipos de inputs en diferentes entornos.

La evaluación comparativa no es una tarea fácil. Requiere que escribamos un código para ejecutar las instrucciones de las que deseamos realizar la evaluación comparativa.

BenchmarkDotNet es una biblioteca que nos puede ayudar a hacer este trabajo. No necesitaremos escribir ningún código adicional para configurar el proyecto que llama al código que debe probarse. Es tan fácil como escribir pruebas unitarias. La librería de <strong>BenchmarkDotNet es de código abierto</strong> y está disponible como paquete NuGet.

A tener en cuenta:
- BenchmarkDotNet <b>se puede usar con proyectos .NET Framework y .NET Core (ahora denominado.NET)</b>.
- A nivel de plataforma no tiene ningún requisito concreto y se puede ejecutar en <b>Windows, Linux o MacOS</b>.

## Ejecutando pruebas de rendimiento con BenchmarkDotNet
En este ejemplo usaremos el paquete nuget BenchmarkDotNet para comparar un código determinado y  muy  simple que calcula el hash. Este ejemplo está tomado de la documentación de BenchmarkDotNet.

Primero deberemos crear una aplicación de consola basada en .NET 6 y añadir la referencia al paquete de BenchmarkDotNet <b>dotnet add package BenchmarkDotNet</b> o desde nuestro IDE.

![NuGet BenchmarkDotNet, Rider IDE](/assets/images/posts/benchmark-performance-library/benchmarkdotnet-nuget-pckg.png "NuGet BenchmarkDotNet, Rider IDE")
<small><em>NuGet BenchmarkDotNet, Rider IDE</em></small>

Una vez tenemos nuestra aplicación de consola ready con todas sus dependencias para realizar pruebas de rendimiento agregaremos una nueva clase denominada <em>MyBenchmarks</em>.

### Métodos para la evaluación comparativa de rendimiento
Nuestra clase <em>MyBenchmarks</em> tiene dos campos: sha256, que es la instancia predeterminada para calcular el hash con SHA256, y md5, que es para calcular el hash con MD5. Luego, hay dos métodos públicos que usan estas instancias y calculan el hash.

Queremos medir el rendimiento de estos dos métodos. Por lo tanto, agreguemos el atributo de atributo Benchmark en esos dos métodos para indicar a BenchmarkDotNet que queremos realizar pruebas de rendimiento y extraer sus métricas de los mismos.

### Inputs para la evaluación comparativa de rendimiento
Añadiremos un constructor en nuestra clase <em>MyBenchmarks</em> y haremos uso de Random para generar una matriz de bytes aleatorios.

```csharp
public class MyBenchmarks
{
    private const int N = 10000;
    private readonly byte[] data;

    private readonly SHA256 sha256 = SHA256.Create();
    private readonly MD5 md5 = MD5.Create();

    public MyBenchmarks()
    {
        data = new byte[N];
        new Random(42).NextBytes(data);
    }

    [Benchmark]
    public byte[] Sha256() => sha256.ComputeHash(data);

    [Benchmark]
    public byte[] Md5() => md5.ComputeHash(data);
}
```

### BenchmarkRunner
Como se muestra en el fragmento de código, hay 3 formas diferentes de para que nuestra aplicación de consola lance las pruebas de rendimiento, benchmarks.

```csharp
// Usar cualquiera de las siguientes instrucciones para ejecutar las pruebas de rendimiento declaradas en un tipo o assembly

// Para correr todos los benchmarks contenidos en el assembly especificado
var summary = BenchmarkRunner.Run(typeof(Program).Assembly);

// Para correr todos benchmarks contenidos en el tipo especificado
var summary = BenchmarkRunner.Run<MyBenchmarks>();

// Para correr todos benchmarks contenidos en el tipo especificado
var summary = BenchmarkRunner.Run(typeof(MyBenchmarks));
```

### Ejecutar la evaluación comparativa de rendimiento
Debemos correr la aplicación en modo release para realizar correctamente la evaluación comparativa. Además, no deberíamos tener ningún depurador adjunto al proceso.

Para ejecutar la aplicación mediante dotnet CLI: <b>dotnet run -c release</b>.

La ejecución de los benchmarks puede tardar varios segundos, hasta minutos. BenchmarkDotNet ejecutará cada uno de los benchmarks varias veces. <a href="https://benchmarkdotnet.org/articles/guides/how-it-works.html" target="_blank">Documentación oficial</a>.

### ¿Cómo interpretar los resultados?
Una vez finalizada la ejecución se imprimirá por consola, es el output por defecto (<a href="https://benchmarkdotnet.org/articles/configs/exporters.html" target="_blank">ver más exportadores</a>), el resultado resumido. A continuación comparto el resultado que he obtenido en mi máquina. Ell resultado variará dependiendo de la máquina en la que se corra y cuantos recursos de lla misma estén libres el momento de la prueba.

Ahora vamos a entender qué significa este resultado. Como podemos ver hay cuatro columnas:

- <b><em>Method</em></b>: nos proporciona el nombre del método medido.
- <b><em>Mean</em></b>: nos transmite el tiempo promedio (media aritmética) de todas las mediciones para el método dado. La siguiente instantánea muestra que la ejecución del método Sha256 tarda en promedio 39,85 nanosegundos.
- <b><em>Error</em></b> (en términos estadísticos): nos expresa la mitad del intervalo de confianza del 99,9 %. Entonces podemos seguros en un 99,9 % de que el tiempo de ejecución medio real está dentro de los 0,096 nanosegundos de la media muestreada para el método Sha256.
- <b><em>StdDev</em></b> (desviación estándar): nos proporciona información sobre cuánto variaron los tiempos de ejecución con respecto al tiempo medio. En la siguiente captura, podemos ver que el tiempo de ejecución del método Sha256 varió en 0,090 nanosegundos con respecto al tiempo medio correspondiente. Cuanto menor es la desviación estándar, más cerca está el tiempo de ejecución medio de la muestra del tiempo de ejecución medio ideal.

![Resultados por consola de BenchmarkDotNet](/assets/images/posts/benchmark-performance-library/benchmark-results.png "Resultados por consola de BenchmarkDotNet")
<br/><small><em>Resultados por consola de BenchmarkDotNet</em></small>

### Extraer memoria asignada
De una manera muy sencilla podemos ver cuánta memoria es asignada en cada ejecución de la comparativa de las pruebas de rendimiento. Esto nos será muy útil para también poder comparar la memoria que se asigna en cada uno de los casos en el <em>heap</em> y que, por lo tanto,el colector de basura (GC) tendrá que limpiar en algún momento.

Añadiremos el atributo <b>[MemoryDiagnoser]</b> en nuestra clase <em>MyBenchmarks</em> para extaer la memoria asignada en cada ejecución.

```csharp
[MemoryDiagnoser]
public class MyBenchmarks
{
    private const int N = 10000;
    private readonly byte[] data;

    private readonly SHA256 sha256 = SHA256.Create();
    private readonly MD5 md5 = MD5.Create();

    public MyBenchmarks()
    {
        data = new byte[N];
        new Random(42).NextBytes(data);
    }

    [Benchmark]
    public byte[] Sha256() => sha256.ComputeHash(data);

    [Benchmark]
    public byte[] Md5() => md5.ComputeHash(data);
}
```

Ahora al ejecutar de nuevo nuestra aplicación de consola en modo release <b>dotnet run -c release</b> veremos que nos aparecen columnas indicando cuanta memoria ha sido asignada en cada uno de las diferentes pruebas de rendimiento, benchmarks.

![Resultados por consola de BenchmarkDotNet con la memoria asignada](/assets/images/posts/benchmark-performance-library/benchmark-memory-results.png "Resultados por consola de BenchmarkDotNet con la memoria asignada")
<br/><small><em>Resultados por consola de BenchmarkDotNet con la memoria asignada</em></small>

## Conclusiones sobre BenchmarkDotNet
Hay varias situaciones en las que podemos utilizar BenchmarkDotNet. Por ejemplo cuando queremos comparar el rendimiento de diferentes librerías así como la memoria que se asigna en el heap.

En este artículo no hemos cubierto completamente todas las funciones y opciones de personalización disponibles de BecnhmarkDotNet, únicamente hemos aterrizado en BenchmarkDotNet y nos hemos preparado para poder empezar a hacer pruebas y profundizar más en la librería so queremos explotarla a fondo. Para ver todo lo que BenchmarkDotNet nos ofrece tenemos disponible su documentación en <a href="https://benchmarkdotnet.org/" target="_blank">benchmarkdotnet.org</a>.

¡Espero que te haya podido aportar algo en este artículo! Recuerda que puedes dejar tu comentario para cualquier cosa. ¡Muchas gracias!