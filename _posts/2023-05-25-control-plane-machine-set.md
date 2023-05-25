---
layout: post
title:  "Por Fin, Machine Set operator para el control plane de tus clústeres"
author: danifernandezs
categories: [ ocp4, control-plane, operadores, machines, machine-api]
image: assets/images/posts/2023-05-25/control-plane-machine-set.png
featured: false
hidden: false
toc: true
---

Durante la gestión de máquinas, que luego se convierten en nodos de un clúster de OpenShift, únicamente podíamos controlar aquellas que iban a conformar los nodos de cómputo.<br><br>
Sin embargo, en el control plane siempre habían sido máquinas muy estáticas y creadas en momento de instalación, y tanto su modificación como su sustitución, siempre había sido un proceso manual, <u>hasta ahora</u>.<br><br>
Con el `control plane machine set` podemos definir la configuración deseada para las máquinas que forman/formarán el control plane de nuestro clúster de OpenShift.

# Situación actual (OCP 4.13) de esta feature

Se comenzó con esta feature en OpenShift 4.12, pero ahora mismo, en OpenShift 4.13 está soportado Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP) y VMware vSphere como proveedores de infraestructura donde se encuentre en ejecución el clúster.

<style>
  .tb { border-collapse: collapse; }
  .tb th, .tb td { padding: 5px; border: solid 1px #777; text-align: center;}
</style>

<table class="tb">
  <tr>
    <th>Proveedor</th>
    <th>Activado por defecto</th>
    <th>Custom Resource pre-creado</th>
    <th>Creación manual del Custom Resource</th>
  </tr>
  <tr>
    <td>AWS</td>
    <td>X</td>
    <td>X</td>
    <td></td>
  </tr>
  <tr>
    <td>Azure</td>
    <td>X</td>
    <td>X</td>
    <td></td>
  </tr>
  <tr>
    <td>GCP</td>
    <td>X</td>
    <td>X</td>
    <td></td>
  </tr>
  <tr>
    <td>VMware vSphere</td>
    <td></td>
    <td></td>
    <td>X</td>
  </tr>
</table>
<br>

Hay que tener en cuenta, que el recurso precreado sólo estará disponible en estado `Activo` en los clústeres de nueva instalación.

Tanto para AWS, Azure y GCP, si se trata de clústeres actualizados, el recurso deberá ser activado por un administrador.

<a href="https://docs.openshift.com/container-platform/4.13/machine_management/control_plane_machine_management/cpmso-getting-started.html#cpmso-platform-matrix_cpmso-getting-started" target="_blank">Supported Cloud Providers - Official OCP4.13 Documentation</a>

# Descripción general

El `control plane machine set` utiliza un recurso personalizado (Custom Resource), `ControlPlaneMachineSet` con el que  automatizar y gestionar la administración de las máquinas del plano de control dentro de un clúster de OpenShift.

Cuando el recurso `ControlPlaneMachineSet` se encuentra configurado y activado, el operador se encargará de cumplir con la cantidad de máquinas definidas para conformar el control plane del clúster con la configuración definida en el propio recurso.

Esto permite el reemplazo automático de máquinas que formarán el control plane si se encuentran en un estado degradado e incluso de implementar los cambios definidos para las propias máquinas del control plane.

# Limitaciones 

Hay que tener en cuenta que este recurso está pensado para un mantenimiento y gestión de las máquinas del plano de control, tanto en día 2 como en una operativa recurrente, por lo que tanto la configuración como ajustes deberán realizarse tras la instalación del clúster y no antes o durante una instalación nueva.

- El operador necesita del `Machine API Operator` por lo que no soporta clústeres con las máquinas provisionadas de forma manual.
- Sólo AWS, Azure, GPC y VMware vSphere está soportado (a versión OCP4.13).
- Sólo planos de control con tres máquinas se soportan.
- El escalado horizontal de nodos no está soportado usando este operador.
- El despliegue de máquinas para el control plane en instancias efímeras (spot o similares) o con discos efímeros no está soportado e incrementa el riesgo de perdida de datos y de fallos.

# Situaciones que nos encontraremos

Las situaciones y la forma de trabajar con el `control plane machine set` va a depender del estado en el que se encuentre el propio recuro de `ControlPlaneMachineSet` en el clúster.

Así, nos podemos encontrar con las siguientes casuísticas.

## Clústeres con el recurso generado y activo
Si el clúster ya tiene el recurso creado y está en estado activo no se requiere ninguna intervención de un administrador.

## Clústeres con el recurso generado pero inactivo
Si el clúster ya tiene el recurso creado pero está inactivo, un administrador deberá revisar el recurso y su configuración y luego, activarlo.

## Clústeres sin el recurso generado
Los clústeres en versión donde ya se encuentra el operador pero no tienen el recurso creado, será necesario crearlo y configurarlo ajustado al clúster para luego poder activarlo.

## No sé en qué estado está el recurso

No hay problema, se puede comprobar su estado, de recurso creado o no y si su estado es Activo o Inactivo.

```bash
$ oc get controlplanemachineset -n openshift-machine-api
NAME      DESIRED   CURRENT   READY   UPDATED   UNAVAILABLE   STATE    AGE
cluster   3         3         3       3                       Active   3d
```
Recibiremos 3 posibles resultados:
- Active 
  - El recurso `ControlPlaneMachineSet` está activado en el clúster
- Inactive 
  - El recurso `ControlPlaneMachineSet` está desactivado en el clúster, y para activarlo se requiere la intervención de un administrador.
- Error from server (NotFound) 
  - El recurso `ControlPlaneMachineSet` no existe en el clúster, si se desea usar, un administrador deberá crearlo, configurarlo y activarlo.

# Usando el Control Plane Machine Set

Como tenemos 4 posibilidades para usar el `ControlPlaneMachineSet` y sería imposible tener todos los datos en este mismo post, se repartirá en un post específico para el recurso en cada uno de Cloud Providers soportados.

En cada uno de ellos veremos las típicas necesidades para usar el operador, que serían:
- Incremento de disco en los nodos del Control Plane
- Aumento de recursos (cambio de tipo de instancia) en los nodos del Control Plane

También comprobaremos su estado de recurso precreado en las instalaciones nuevas y la necesidad de crearlo y activarlo en aquellos casos que el recurso no está disponible de forma automática.

Se puede ir a esos post directamente desde los siguientes enlaces:
- <a href="{{ site.baseurl }}/ocp413-control-plane-machine-set-aws" target="_blank">Control Plane Machine Set en AWS con OCP4.13</a>
- <a href="{{ site.baseurl }}/ocp413-control-plane-machine-set-azure" target="_blank">Control Plane Machine Set en Azure con OCP4.13</a>
- <a href="{{ site.baseurl }}/ocp413-control-plane-machine-set-gcp" target="_blank">Control Plane Machine Set en GCP con OCP4.13</a>
- <a href="{{ site.baseurl }}/ocp413-control-plane-machine-set-vmware-vsphere" target="_blank">Control Plane Machine Set en VMware vSphere con OCP4.13</a>

