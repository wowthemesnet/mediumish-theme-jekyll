---
layout: post
title:  "Grafana con Tempo, Prometheus y Loki en Docker"
author: didac
categories: [ Observabilidad, Monitoring ]
tags: [ OpenTelemetry, Datadog ]
image: assets/images/post-headers/grafana-tempo-loki-prometheus.png
excerpt: "¿Cómo configurar Grafana para conectar con Tempo, Prometheus y Loki y correlacionarlos?"
description: "¿Cómo configurar Grafana para conectar con Tempo, Prometheus y Loki y correlacionarlos?"
featured: false
hidden: false
beforetoc: "En esta entrada veremos cómo conectar Grafana a los diferentes datasources de Tempo, Prometheus y Loki y cómo correlacionarlos entre ellos."
toc: true
---

En esta entrada veremos cómo tener Grafana pre-configurado con Tempo, Prometheus y Loki en Docker. También veremos de manera muy breve qué nos solución nos ofrecen los diferentes servicios, anteriormente citados, de los que Grafana sacará esa información.

## Grafana
### ¿Qué es Grafana?
<strong>Grafana es uno de los mejores y más completos servicios de monitoring de código abierto</strong>, Open Source, donde podemos tener una UI amigable a la vez que poder explotar los <strong>datos de las diferentes verticales de la observabilidad, trazas, métricas y logs, desde un mismo punto centralizado</strong> y poder correlacionar dichas verticales entre ellas para tener una buena base para la observabilidad de nuestro sistema.

### ¿Cómo añadir Grafana en Docker?
- Añadir Grafana en el fichero de docker-compose.

```yaml
grafana:
    image: grafana/grafana:9.0.1
    container_name: grafana
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
      - GF_AUTH_DISABLE_LOGIN_FORM=true
    volumes:
      - /etc/localtime:/etc/localtime:ro
    restart: unless-stopped
    ports:
      - 3001:3000
```

## Tempo
### ¿Qué es Grafana Tempo?
<strong>Grafana Tempo es un servicio, altamente escalable y de código abierto, de ingesta de trazas distribuidas</strong>. Puede ingerir métricas de gran variedad de protocolos, sobre todo los de código abierto como OpenTelemetry. Tiene una gran integración con Grafana, Prometheus y Loki.

### ¿Cómo añadir Grafana Tempo en Docker?
- Añadir Grafana Tempo en el fichero de docker-compose.

```yaml
tempo:
    image: grafana/tempo:1.4.1
    container_name: tempo
    command: [ "-config.file=/etc/tempo.yaml" ]
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - ./configs/tempo.yml:/etc/tempo.yaml
    restart: unless-stopped
    ports:
      - 3200:3200  # tempo
      - 4007:4317  # grpc
```

En este ejemplo se abre el puerto de tempo para exponer las trazas recibidas y el puerto grpc / http2 para la ingesta de trazas. Este último puerto será donde los diferentes servicios enviarán su telemetría relativa a trazas.

- Archivo de configuración <em>config/tempo.yml</em> de Grafana Tempo.

```yaml
server:
  http_listen_port: 3200

search_enabled: true                   # enable tempo trace search ( beta preview )

distributor:
  receivers:
    otlp:
      protocols:
        http:
        grpc:
          endpoint: tempo:4007

ingester:
  trace_idle_period: 10s               # the length of time after a trace has not received spans to consider it complete and flush it
  max_block_bytes: 1_000_000           # cut the head block when it hits this size or ...
  max_block_duration: 5m               #   this much time passes

compactor:
  compaction:
    compaction_window: 1h              # blocks in this time window will be compacted together
    max_block_bytes: 100_000_000       # maximum size of compacted blocks
    block_retention: 1h
    compacted_block_retention: 10m

storage:
  trace:
    backend: local                     # backend configuration to use
    block:
      bloom_filter_false_positive: .05 # bloom filter false positive rate.  lower values create larger filters but fewer false positives
      index_downsample_bytes: 1000     # number of bytes per index record
      encoding: zstd                   # block encoding/compression.  options: none, gzip, lz4-64k, lz4-256k, lz4-1M, lz4, snappy, zstd, s2
    wal:
      path: /tmp/tempo/wal             # where to store the the wal locally
      encoding: snappy                 # wal encoding/compression.  options: none, gzip, lz4-64k, lz4-256k, lz4-1M, lz4, snappy, zstd, s2
    local:
      path: /tmp/tempo/blocks
    pool:
      max_workers: 100                 # worker pool determines the number of parallel requests to the object store backend
      queue_depth: 10000
```

## Prometheus
### ¿Qué es Prometheus?
<strong>Prometheus es un servicio de ingesta y agregación de métricas</strong>. Prometheus tiene la peculariadad respecto a los demás servicios, Tempo y  Loki, que <strong>usa un sistema pull para la ingesta de métricas</strong> es decir que en vez de que los servicios envíen las métricas a Prometheus,sistema push, es Prometheus quien pregunta por las métricas, scrapping, cada cierto tiempo periódicamente.

### ¿Cómo añadir Prometheus en Docker?
- Añadir Prometheus en el fichero de docker-compose.

```yaml
prometheus:
    image: prom/prometheus:v2.37.0
    container_name: prometheus
    volumes:
      - ./configs/prometheus.yaml:/etc/prometheus/prometheus.yml
    restart: unless-stopped
    ports:
      - "9091:9090"
```

En este ejemplo se abre el puerto de Prometheus para exponer las métricas recibidas. En este caso no expone puerto para recibir métricas porque Prometheus realiza la ingesta de telemetría mediante <em>scraping</em>, el sistema <em>pull</em> que hemos comentado anteriormente, donde es el servicio de telemetría, en este caso Prometheus, quien extrae los datos generados por otros servicios. 

- Archivo de configuración <em>config/prometheus.yaml</em> de Prometheus.

```yaml
scrape_configs:
  - job_name: 'scrape_servicename'
    scrape_interval: 10s
    static_configs:
      - targets: ['<DOCKER-SERVICE-NAME>:8889']
      - targets: ['<DOCKER-SERVICE-NAME>:8888']
```

En este ejemplo Prometheus extrae las métricas, <em>scraping</em>, que expone el servicio especificado en los puertos especificados.

## Loki
### ¿Qué es Grafana Loki?
<strong>Grafana Loki es un servicio de ingesta de logs</strong>. Entre sus características destacan que se trata de un servicio escalable horizontalmente y, por lo tanto, de alta disponibilidad. Tiene una gran integración con Grafana, Tempo y Prometheus.

### ¿Cómo añadir Grafana Loki en Docker?
- Añadir Grafana Loki en el fichero de docker-compose.

```yaml
loki:
    endpoint: http://loki:3100/loki/api/v1/push
    tls:
      insecure: true
    format: json
    labels:
      resource:
        service.name: "service_name"
      record:
        traceID: "traceid"
```

En este ejemplo se indica la dirección de Loki para la ingesta de trazas. Este último puerto será donde los diferentes servicios enviarán su telemetría relativa a logs.

- Archivo de configuración <em>config/loki.yml</em> de Grafana Loki.

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h
```

## Conectar Grafana con datasources
Para conectar Grafana con los diferentes datasources de Tempo, Prometheus y Loki, deberemos primeramente añadir los siguientes volúmenes al servicio de Grafana de nuestro docker-compose.

```yaml
- ./configs/grafana/grafana.ini:/etc/grafana/grafana.ini
- ./configs/grafana/provisioning/datasources:/etc/grafana/provisioning/datasources
```

El primero de ellos, grafana.ini, lo usaremos para activar una <em>feature</em> de Grafana relacionada con Tempo.

```yaml
[feature_toggles]
enable = tempoSearch tempoBackendSearch
```

El segundo de ellos, datasources, se trata de un directorio que contendrá un fichero llamado datasources.yml en la que configuraremos las conexiones de Grafana con Tempo, Prometheus y Loki para poder consultar y explotar su información (iremos introduciendo los datasources en los siguientes pasos).

```yaml
apiVersion: 1

datasources:
```

### ¿Cómo conectar Grafana con Tempo?
En nuestro archivo de datasources.yml añadiremos el datasource de Tempo.

```yaml
apiVersion: 1

datasources:
- name: Tempo
  type: tempo
  uid: tempo
  access: proxy
  url: http://tempo:3200
  basicAuth: false
  isDefault: false
  version: 1
  editable: false
```

### ¿Cómo conectar Grafana con Prometheus?
En nuestro archivo de datasources.yml añadiremos el datasource de Prometheus.

```yaml
apiVersion: 1

datasources:
- name: Prometheus
  type: prometheus
  uid: prometheus
  access: proxy
  url: http://prometheus:9090
  jsonData:
    timeInterval: 10s
  basicAuth: false
  isDefault: true
  version: 1
  editable: false
```

### ¿Cómo conectar Grafana con Loki?
En nuestro archivo de datasources.yml añadiremos el datasource de Loki.

```yaml
apiVersion: 1

datasources:
- name: Loki
  type: loki
  uid: loki
  access: proxy
  url: http://loki:3100
  basicAuth: false
  isDefault: false
  version: 1
  editable: false
```

#### ¿Cómo correlacionar Grafana Loki (logs) con Tempo (trazas)?
- Para poder movernos de un log de Loki a la traza de Tempo correspondiente a golpe de 'clic' tendremos que añadir campos derivados al datasource de Loki recientemente añadido. 

```yaml
jsonData:
  derivedFields:
    - datasourceUid: tempo
      matcherRegex: "\u0022traceid\u0022:\u0022(\\w+)\u0022"
      name: TraceId
      url: '$${__value.raw}'
```

La propiedad <em>datasourceUid</em> hace referencia al datasource con ese valor en su propiedad <em>uid</em>.

Con la propiedad <em>matcherRegex</em> específicamos en qué parte del log queremos extraer el id de la traza.

En la propiedad <em>name</em> concretamos el nombre a darle a esa extración del id de la traza a través de la anterior propiedad mencionada <em>matcherRegex</em>.

Y por último con la <em>url</em> establecemos la url donde hacer la consulta, en este caso será el valor del id de la traza en tempo.

Más información en la <a href="https://grafana.com/docs/grafana/latest/datasources/loki" target="_blank">documentación oficial de Grafana sobre datasources de Grafana Loki</a>.

### Integrar Tempo, Prmetheus y Loki con Grafana
El resultado de nuestro archivo de configuración <em>datasources.yml</em> quedará como en el ejemplo de a continuación en el caso de que hayamos configurado los diferentes datasources de Grafana y correlacionado los logs con las trazas.

```yaml
apiVersion: 1

datasources:
- name: Tempo
  type: tempo
  uid: tempo
  access: proxy
  url: http://tempo:3200
  basicAuth: false
  isDefault: false
  version: 1
  editable: false
- name: Prometheus
  type: prometheus
  uid: prometheus
  access: proxy
  url: http://prometheus:9090
  jsonData:
    timeInterval: 10s
  basicAuth: false
  isDefault: true
  version: 1
  editable: false
- name: Loki
  type: loki
  uid: loki
  access: proxy
  url: http://loki:3100
  basicAuth: false
  isDefault: false
  version: 1
  editable: false
  jsonData:
    derivedFields:
      - datasourceUid: tempo
        matcherRegex: "\u0022traceid\u0022:\u0022(\\w+)\u0022"
        name: TraceId
        url: '$${__value.raw}'
```

<em>Et voilà</em>! Ya tendríamos listo nuestra stack de monitorización y observabilidad Open Source con Grafana, Tempo, Prometheus y Loki. Sólo quedaría desde nuestros servicios empezar a enviar telemetría en caso de las trazas y los logs y a exponer telemetría en caso de las métricas