---
layout: post
title:  "Deploy NodeJS Application on Google Cloud App Engine"
author: munna
categories: [ tutorial, Deployment]
tags: [GAE, NodeJS, PostgreSQL]
image: assets/images/google-app-engine-deployment.png
description: "Deploy NodeJS application on Google App Engine with Google Cloud PostgreSQL"
featured: true
hidden: true
# rating: 4.5
---

Google Cloud App Engine is best platform where NodeJS app can deploy easly in few minutes.No need to worry about infrastructure, runtime envoirment because App Engine takes care of these complected things.

# What is Google Cloud App Engine

Googe Cloud App Engine (GAE) is a deployment platform which suppot PAAS (Platform as a Service) deployment model. PAAS deployment is worry free for developer as they not need to think about installing all things to server before deployment. PAAS means just upload your resource to server and everything will be configured according to selected platform. Platform can be anything like Python,NodeJs,.Net etc.

- Let's follow these simple steps 

## Requirnments 
1. App Engine to host the application
2. SQL instance to use in App Engine.

## Create SQL instance in Google cloud console
I am going to create SQL server instance first as will have to use this host, database name etc in my NodeJS Application while configure it in App Engine.

1. Follow [Quick Start for Cloud SQL](https://cloud.google.com/sql/docs/postgres/quickstart)
2. Enable TCP connection to your computer so that you can easily import your data. Follow [Enabling public IP](https://cloud.google.com/sql/docs/postgres/configure-ip#add)
3. Connect to pgAdmin and import database.

## Setup a new Google App Engine (GAE)

### Create new Google App Engine (GAE)

`gcloud app create --name <app-name>`

### Configure code to Google App Engin (GAE)

`git clone https://github.com/munna/AngularJs-boilerplate-IdentityServer4.git`
### Create app.yaml
Navigate to project location and create app.yaml file
`vi app.yaml`
and place the content.
~~~~~~yaml
runtime: nodejs
env: flex
service: <application-name> # Must provide service name if you setup multiple service in single app engine.
beta_settings:
  cloud_sql_instances: <SQL-CLOUD-INSTANCE-NAME>=tcp:5432
~~~~~~
> Note:- *tcp:5432* is must important part to enable tcp connection with SQL cloud connection, otherwise you will
have to look on setup of *cloud-sql-proxy*

> Note: App Engine standard enviroments do not support connecting to the Cloud SQL instance using TCP. Your code should not try to access the instance using an IP address (such as 127.0.0.1 or 172.17.0.1) unless you have configured [Serverless VPC Access](https://cloud.google.com/vpc/docs/configure-serverless-vpc-access).

### Configure PostgreSQL connection in your application.
Now we have everything to run our application just need to change our configuration to change PostgreSQL connection string in our configuration file.
`username:'postgres',server:'172.17.0.1',password:'<password>',database:'<db-name>'`

Note:- Server must use *localhost OR 172.17.0.1 OR 127.0.0.1*

## Deploy Application

Everything is ready now move on to perform final steps. execute below command
`gcloud app deploy`

## Important commands which may need
```bash
#set project in cloud console
gcloud config set project <project-id>
#browse app via cloud console. <application-name> is name of service provided in app.yaml
gcloud app browse -s <application-name>
#see log of service
gcloud app logs tail -s <application-name>
#find running application if you need to stop.
sudo netstat -plten |grep node
#stop running application 
sudo kill -9 <progress-id-from-above-command>
```










