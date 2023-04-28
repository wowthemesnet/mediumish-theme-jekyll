---
layout: post
title:  "Por Fin, Machine Set operator para el control plane de los clústeres"
author: danifernandezs
categories: [ ocp4, control-plane, operadores, machines ]
image: assets/images/posts/2023-05-04/control-plane-machine-set.png
featured: false
hidden: false
toc: true
---

¿Cómo? ¿Desinstalar un operador y retirar todos los recursos creados por el mismo?. Además, ¿el mismísimo operador de Service Mesh?, pero si está de moda usar Istio. <br>
Existen situaciones en las que es necesario o deseable retirar el operador de Service Mesh, por ejemplo, si se ha probado y no se ajusta a las necesidades que se desean cubrir o si no es el producto adecuado para resolver el problema original que se intentó abordar.<br>
En el caso que se plantea, se decide retirar OpenShift Service Mesh para poder desplegar otra Mesh de otro proveedor, ya que no es compatible tener Istio desplegado en el mismo clúster con la nueva Mesh.

Eliminaremos todos los recursos que componen `Red Hat OpenShift Service Mesh`.

## Pasos que realizaremos

- Desinstalaremos los operadores
  - Service Mesh
  - Jaeger
  - Kiali
- Eliminaremos el daemonset del CNI driver
- Limpiaremos el namespace de istio-system
- Eliminamos todos los CRDs usados por el stack de Service Mesh
- Eliminamos la Service Account de Istio y su ConfigMap

## Comprobamos la existencia de los operadores

Comprobamos que tanto la suscripción, los installPlan aprobados y los CSV (Cluster Service Version) están presentes en el clúster.

```bash
$ oc get subscription.operators -n openshift-distributed-tracing
NAME                  PACKAGE               SOURCE                  CHANNEL
jaeger-product        jaeger-product        redhat-operator-index   stable

$ oc get subscription.operators -n openshift-operators
NAME                  PACKAGE               SOURCE                  CHANNEL
kiali-ossm            kiali-ossm            redhat-operator-index   stable
servicemeshoperator   servicemeshoperator   redhat-operator-index   stable

$ oc get ip -n openshift-distributed-tracing
NAME            CSV                          APPROVAL    APPROVED
install-4wwcv   jaeger-operator.v1.29.1      Automatic   true

$ oc get ip -n openshift-operators
NAME            CSV                          APPROVAL    APPROVED
install-67mcl   kiali-operator.v1.36.7       Automatic   true
install-fvbpg   servicemeshoperator.v2.1.1   Automatic   true
install-zrlvj   servicemeshoperator.v2.1.1   Automatic   true

$ oc get csv
NAME                              DISPLAY                                          VERSION    REPLACES                     PHASE
elasticsearch-operator.5.1.8-17   OpenShift Elasticsearch Operator                 5.1.8-17                                Succeeded
jaeger-operator.v1.29.1           Red Hat OpenShift distributed tracing platform   1.29.1                                  Succeeded
kiali-operator.v1.36.7            Kiali Operator                                   1.36.7     kiali-operator.v1.36.6       Succeeded
servicemeshoperator.v2.1.1        Red Hat OpenShift Service Mesh                   2.1.1-0    servicemeshoperator.v2.1.0   Succeeded
```

Comprobamos que los pods de los operadores están en ejecución en el clúster.

```bash
$ oc get po -n openshift-operators
NAME                               READY   STATUS    RESTARTS   AGE
istio-node-grb7b                   4/4     Running   0          225d
istio-node-k9rxs                   4/4     Running   0          225d
istio-node-trgp9                   4/4     Running   0          225d
istio-node-zwn2j                   4/4     Running   0          225d
istio-operator-7dd69667cc-hd6vd    1/1     Running   0          62d
jaeger-operator-6654c85ff8-bvkwj   2/2     Running   4          62d
kiali-operator-77495b847d-ssvm4    1/1     Running   0          62d
```

## Eliminamos los operadores del stack de Service Mesh

Borramos las suscripciones a los operadores de jaeger, kiali y Service Mesh, tras el borrado, comprobamos que se han eliminado de forma correcta del clúster.

```bash
$ oc delete subscription.operators jaeger-product -n openshift-distributed-tracing
subscription.operators.coreos.com "jaeger-product" deleted

$ oc delete subscription.operators kiali-ossm servicemeshoperator -n openshift-operators
subscription.operators.coreos.com "kiali-ossm" deleted
subscription.operators.coreos.com "servicemeshoperator" deleted
```

Aún eliminando las suscripciones, podemos ver que los pods que forman los operadores continúan en ejecución, esto es normal, ya que siguen presentes en el clúster los CSV (Cluster Service Version) de esos operadores.

```bash
$ oc get po -n openshift-operators
NAME                               READY   STATUS    RESTARTS   AGE
istio-node-grb7b                   4/4     Running   0          225d
istio-node-k9rxs                   4/4     Running   0          225d
istio-node-trgp9                   4/4     Running   0          225d
istio-node-zwn2j                   4/4     Running   0          225d
istio-operator-7dd69667cc-hd6vd    1/1     Running   0          62d
jaeger-operator-6654c85ff8-bvkwj   2/2     Running   4          62d
kiali-operator-77495b847d-ssvm4    1/1     Running   0          62d
```

Borramos los CSV (Cluster Service Version) asociados a cada operador y comprobamos su correcta eliminación

```bash
$ oc delete csv jaeger-operator.v1.29.1 servicemeshoperator.v2.1.1 kiali-operator.v1.36.7
clusterserviceversion.operators.coreos.com "jaeger-operator.v1.29.1" deleted
clusterserviceversion.operators.coreos.com "servicemeshoperator.v2.1.1" deleted
clusterserviceversion.operators.coreos.com "kiali-operator.v1.36.7" deleted

$ oc get csv
NAME                              DISPLAY                            VERSION    REPLACES   PHASE
elasticsearch-operator.5.1.8-17   OpenShift Elasticsearch Operator   5.1.8-17              Succeeded
```

*Nota: En este caso, el operador de ElasticSearch no se elimina ya que se continuará usando para el stack de Logging de la plataforma.*

Ahora ya podemos ver que los pods que formaban los operadores ya no están en ejecución en el clúster, por lo que ya no podrán atender a sus propios recursos (CRs) y no aplicarán configuraciones o reconciliarán las existentes para el stack de Service Mesh.

```bash
$ oc get po -n openshift-operators
NAME               READY   STATUS    RESTARTS   AGE
istio-node-grb7b   4/4     Running   0          225d
istio-node-k9rxs   4/4     Running   0          225d
istio-node-trgp9   4/4     Running   0          225d
istio-node-zwn2j   4/4     Running   0          225
```

***NOTA: Si existe en el clúster más de una Mesh desplegada se pueden recibir errores al borrar el control plane por existir `validatingwebhookconfiguration` y `mutatingwebhookconfigurations` duplicados que será necesario eliminarlos para conseguir que el Service Mesh Control Plane pueda ser eliminado de forma correcta.***

## Borrado de los Validatingwebhookconfiguration y mutatingwebhookconfigurations

Comprobamos su existencia en el clúster y los eliminamos.

```bash
$ oc get validatingwebhookconfiguration,mutatingwebhookconfigurations |grep openshift-operators.servicemesh
validatingwebhookconfiguration.admissionregistration.k8s.io/openshift-operators.servicemesh-resources.maistra.io   3          225d
mutatingwebhookconfiguration.admissionregistration.k8s.io/openshift-operators.servicemesh-resources.maistra.io   2          225d



$ oc delete validatingwebhookconfiguration/openshift-operators.servicemesh-resources.maistra.io
validatingwebhookconfiguration.admissionregistration.k8s.io "openshift-operators.servicemesh-resources.maistra.io" deleted

$ oc delete mutatingwebhookconfiguration/openshift-operators.servicemesh-resources.maistra.io
mutatingwebhookconfiguration.admissionregistration.k8s.io "openshift-operators.servicemesh-resources.maistra.io" deleted
```

Comprobamos que han sido borrados completamente.

```bash
$ oc get validatingwebhookconfiguration,mutatingwebhookconfigurations |grep openshift-operators.servicemesh
```

## Borrado del Admission controller y del driver CNI de Istio

Comprobamos y eliminamos el servicio asociado a Maistra.

```bash
$ oc get svc maistra-admission-controller -n openshift-operators
NAME                           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
maistra-admission-controller   ClusterIP   172.30.178.219   <none>        443/TCP   226d

$ oc delete svc maistra-admission-controller -n openshift-operators
service "maistra-admission-controller" deleted

$ oc get svc maistra-admission-controller -n openshift-operators
Error from server (NotFound): services "maistra-admission-controller" not found
```

Eliminamos el DaemonSet que se encontraba aún en ejecución.
```bash
$ oc get ds -lmaistra-version -n openshift-operators
NAME         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
istio-node   4         4         4       4            4           beta.kubernetes.io/os=linux   225d

$ oc delete ds -lmaistra-version -n openshift-operators
daemonset.apps "istio-node" deleted

$ oc get ds -lmaistra-version -n openshift-operators
No resources found in openshift-operators namespace.
```

## Borrado de los roles y bindings asociados al stack de Service Mesh

```bash
$ oc get clusterrole/istio-admin clusterrole/istio-cni clusterrolebinding/istio-cni
NAME                                                CREATED AT
clusterrole.rbac.authorization.k8s.io/istio-admin   2022-07-25T15:33:22Z
clusterrole.rbac.authorization.k8s.io/istio-cni     2022-07-25T15:33:22Z

NAME                                                     ROLE                    AGE
clusterrolebinding.rbac.authorization.k8s.io/istio-cni   ClusterRole/istio-cni   225d

$ oc delete clusterrole/istio-admin clusterrole/istio-cni clusterrolebinding/istio-cni
clusterrole.rbac.authorization.k8s.io "istio-admin" deleted
clusterrole.rbac.authorization.k8s.io "istio-cni" deleted
clusterrolebinding.rbac.authorization.k8s.io "istio-cni" deleted
```
```bash
$ oc get clusterrole istio-view istio-edit
NAME         CREATED AT
istio-view   2022-07-25T15:33:22Z
istio-edit   2022-07-25T15:33:22Z

$ oc delete clusterrole istio-view istio-edit
clusterrole.rbac.authorization.k8s.io "istio-view" deleted
clusterrole.rbac.authorization.k8s.io "istio-edit" deleted
```
```bash
$ oc get clusterrole jaegers.jaegertracing.io-v1-admin jaegers.jaegertracing.io-v1-crdview jaegers.jaegertracing.io-v1-edit jaegers.jaegertracing.io-v1-view
NAME                                  CREATED AT
jaegers.jaegertracing.io-v1-admin     2022-07-25T14:41:39Z
jaegers.jaegertracing.io-v1-crdview   2022-07-25T14:41:39Z
jaegers.jaegertracing.io-v1-edit      2022-07-25T14:41:39Z
jaegers.jaegertracing.io-v1-view      2022-07-25T14:41:39Z

$ oc delete clusterrole jaegers.jaegertracing.io-v1-admin jaegers.jaegertracing.io-v1-crdview jaegers.jaegertracing.io-v1-edit jaegers.jaegertracing.io-v1-view
clusterrole.rbac.authorization.k8s.io "jaegers.jaegertracing.io-v1-admin" deleted
clusterrole.rbac.authorization.k8s.io "jaegers.jaegertracing.io-v1-crdview" deleted
clusterrole.rbac.authorization.k8s.io "jaegers.jaegertracing.io-v1-edit" deleted
clusterrole.rbac.authorization.k8s.io "jaegers.jaegertracing.io-v1-view" deleted
```

## Limpiando los CRDs asociados a Istio

```bash
$ oc get crds -o name | grep '.*\.istio\.io'
customresourcedefinition.apiextensions.k8s.io/adapters.config.istio.io
customresourcedefinition.apiextensions.k8s.io/attributemanifests.config.istio.io
customresourcedefinition.apiextensions.k8s.io/authorizationpolicies.security.istio.io
customresourcedefinition.apiextensions.k8s.io/destinationrules.networking.istio.io
customresourcedefinition.apiextensions.k8s.io/envoyfilters.networking.istio.io
customresourcedefinition.apiextensions.k8s.io/gateways.networking.istio.io
customresourcedefinition.apiextensions.k8s.io/handlers.config.istio.io
customresourcedefinition.apiextensions.k8s.io/httpapispecbindings.config.istio.io
customresourcedefinition.apiextensions.k8s.io/httpapispecs.config.istio.io
customresourcedefinition.apiextensions.k8s.io/instances.config.istio.io
customresourcedefinition.apiextensions.k8s.io/peerauthentications.security.istio.io
customresourcedefinition.apiextensions.k8s.io/quotaspecbindings.config.istio.io
customresourcedefinition.apiextensions.k8s.io/quotaspecs.config.istio.io
customresourcedefinition.apiextensions.k8s.io/rbacconfigs.rbac.istio.io
customresourcedefinition.apiextensions.k8s.io/requestauthentications.security.istio.io
customresourcedefinition.apiextensions.k8s.io/rules.config.istio.io
customresourcedefinition.apiextensions.k8s.io/serviceentries.networking.istio.io
customresourcedefinition.apiextensions.k8s.io/servicerolebindings.rbac.istio.io
customresourcedefinition.apiextensions.k8s.io/serviceroles.rbac.istio.io
customresourcedefinition.apiextensions.k8s.io/sidecars.networking.istio.io
customresourcedefinition.apiextensions.k8s.io/telemetries.telemetry.istio.io
customresourcedefinition.apiextensions.k8s.io/templates.config.istio.io
customresourcedefinition.apiextensions.k8s.io/virtualservices.networking.istio.io
customresourcedefinition.apiextensions.k8s.io/workloadentries.networking.istio.io
customresourcedefinition.apiextensions.k8s.io/workloadgroups.networking.istio.io

$ oc get crds -o name | grep '.*\.istio\.io' | xargs -r -n 1 oc delete
customresourcedefinition.apiextensions.k8s.io "adapters.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "attributemanifests.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "authorizationpolicies.security.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "destinationrules.networking.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "envoyfilters.networking.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "gateways.networking.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "handlers.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "httpapispecbindings.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "httpapispecs.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "instances.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "peerauthentications.security.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "quotaspecbindings.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "quotaspecs.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "rbacconfigs.rbac.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "requestauthentications.security.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "rules.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "serviceentries.networking.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "servicerolebindings.rbac.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "serviceroles.rbac.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "sidecars.networking.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "telemetries.telemetry.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "templates.config.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "virtualservices.networking.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "workloadentries.networking.istio.io" deleted
customresourcedefinition.apiextensions.k8s.io "workloadgroups.networking.istio.io" deleted
```

## Comprobamos si existe Service Mesh Member Roll

Comprobamos si existe el recuros de Service Mesh Member Roll desplegado. Si es así lo eliminaremos también.

```bash
$ oc get smmr -A
No resources found
```

En este caso no se encontraba desplegado, por lo que no es necesario eliminarlo.

## Eliminamos el Service Mesh Control Plane

Ya podemos borrar el control plane del Service Mesh

```bash
$ oc get smcp -n istio-system
NAME    READY   STATUS            PROFILES      VERSION   AGE
basic   9/9     ComponentsReady   ["default"]   2.0.8     225d

$ oc delete smcp basic -n istio-system
servicemeshcontrolplane.maistra.io/basic deleted
```

Veremos como los pods comenzarán a ser eliminados.

```bash
$ oc get po -n istio-system
NAME                                   READY   STATUS        RESTARTS   AGE
grafana-f8bcf4656-bllgt                0/2     Terminating   0          19m
istio-egressgateway-7bd88577bd-wknxv   1/1     Terminating   0          19m
istio-ingressgateway-b5d4b99cc-vsxlg   1/1     Terminating   0          19m
istiod-basic-6985d799ff-ppfq6          0/1     Terminating   0          19m
jaeger-6dd96f99d4-bl5jz                0/2     Terminating   0          19m
kiali-64ff6dbc65-whhbq                 1/1     Running       0          19m
prometheus-6588f6bb9f-7vz5s            3/3     Terminating   0          19m

$ oc get scmp
error: the server doesn't have a resource type "scmp"
```

## Borramos Kiali

Eliminamos la instancia de Kiali.

```bash
$ oc get po -n istio-system
NAME                     READY   STATUS    RESTARTS   AGE
kiali-64ff6dbc65-whhbq   1/1     Running   0          20m

$ oc get kiali -n istio-system
NAME    AGE
kiali   225d

$ oc delete kiali kiali -n istio-system
kiali.kiali.io "kiali" deleted

$ oc get kiali -n istio-system
error: the server doesn't have a resource type "kiali"
```

Veremos como los pods comenzarán a ser eliminados.

```bash
$ oc get po -n istio-system
NAME                     READY   STATUS        RESTARTS   AGE
kiali-64ff6dbc65-whhbq   0/1     Terminating   0          22m
```

## Eliminamos el proyecto de Istio

```bash
$ oc delete project istio-system
project.project.openshift.io "istio-system" deleted
```

## Eliminamos el proyecto de Jaeger

```bash
$ oc delete project openshift-distributed-tracing
project.project.openshift.io "openshift-distributed-tracing" deleted
```

## Borramos los CRDs de Maistra

```bash
$ oc get crds -o name | grep '.*\.maistra\.io'
customresourcedefinition.apiextensions.k8s.io/servicemeshcontrolplanes.maistra.io
customresourcedefinition.apiextensions.k8s.io/servicemeshextensions.maistra.io
customresourcedefinition.apiextensions.k8s.io/servicemeshmemberrolls.maistra.io
customresourcedefinition.apiextensions.k8s.io/servicemeshmembers.maistra.io
customresourcedefinition.apiextensions.k8s.io/servicemeshpolicies.authentication.maistra.io
customresourcedefinition.apiextensions.k8s.io/servicemeshrbacconfigs.rbac.maistra.io

$ oc get crds -o name | grep '.*\.maistra\.io' | xargs -r -n 1 oc delete
customresourcedefinition.apiextensions.k8s.io "servicemeshcontrolplanes.maistra.io" deleted
customresourcedefinition.apiextensions.k8s.io "servicemeshextensions.maistra.io" deleted
customresourcedefinition.apiextensions.k8s.io "servicemeshmemberrolls.maistra.io" deleted
customresourcedefinition.apiextensions.k8s.io "servicemeshmembers.maistra.io" deleted
customresourcedefinition.apiextensions.k8s.io "servicemeshpolicies.authentication.maistra.io" deleted
customresourcedefinition.apiextensions.k8s.io "servicemeshrbacconfigs.rbac.maistra.io" deleted
```

## Borramos los CRDs asociados a Kiali

```bash
$ oc get crds -o name | grep '.*\.kiali\.io'
customresourcedefinition.apiextensions.k8s.io/kialis.kiali.io
customresourcedefinition.apiextensions.k8s.io/monitoringdashboards.monitoring.kiali.io

$ oc get crds -o name | grep '.*\.kiali\.io' | xargs -r -n 1 oc delete
customresourcedefinition.apiextensions.k8s.io "kialis.kiali.io" deleted
customresourcedefinition.apiextensions.k8s.io "monitoringdashboards.monitoring.kiali.io" deleted
```

## Borramos los CRDs asociados a Jaeger

```bash
$ oc get crds jaegers.jaegertracing.io
NAME                       CREATED AT
jaegers.jaegertracing.io   2022-07-25T14:41:12Z

$ oc delete crds jaegers.jaegertracing.io
customresourcedefinition.apiextensions.k8s.io "jaegers.jaegertracing.io" deleted
```

## Eliminamos los ConfigMaps del Mesh y la Service Account

```bash
$ oc get cm -n openshift-operators
NAME                        DATA   AGE
31e04290.jaegertracing.io   0      226d
istio-cni-config            4      226d
kube-root-ca.crt            1      253d
maistra-operator-cabundle   1      226d
openshift-service-ca.crt    1      253d

$ oc delete cm 31e04290.jaegertracing.io istio-cni-config maistra-operator-cabundle -n openshift-operators
configmap "31e04290.jaegertracing.io" deleted
configmap "istio-cni-config" deleted
configmap "maistra-operator-cabundle" deleted
```

```bash
$ oc get sa -n openshift-operators
NAME        SECRETS   AGE
builder     2         253d
default     2         253d
deployer    2         253d
istio-cni   2         226d

$ oc delete sa istio-cni -n openshift-operators
serviceaccount "istio-cni" deleted
```

Y de esta forma conseguimos eliminar el stack de Service Mesh y todos los recursos asociados a su despliegue.

Todo este paso a paso es una depuración de la documentación oficial para eliminar el stack de Service Mesh, la cual es la <a href="https://docs.openshift.com/container-platform/4.8/service_mesh/v2x/removing-ossm.html" target="_blank">siguiente para OpenShift 4.8</a>
