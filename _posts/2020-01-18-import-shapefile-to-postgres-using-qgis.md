---
layout: post
title:  "Import Shapefile to PostgreSQL using QGIS."
author: munna
categories: [ tutorial, Deployment]
tags: [GAE, NodeJS, PostgreSQL]
image: assets/images/google-app-engine-deployment.png
description: "QGiS is best tools to perform any types of GIS task. Can be also use QGIS for import data into QGIS from excel/csv/shapefiles etc."
featured: false
hidden: true
# rating: 4.5
---

QGIS is best OpenSource desktop tools to perform any types of GIS task. Here i will show you how to import shape files to postgres using QGIS.


## Setup a PostgreSQL connection in QGIS.
I don't see any straitforward option in QGIS to add database connection so i decided to add new PostGIS layer and setup a new database connection. Follow these steps.

1. *Add New Layer* - Press `ctrl+Shift+D` or Go To Menu "Layer"->"Add New Layer" ->"Add PostGIS Layers"
2. You will see "Data Source Manager" Dialog where you can setup new connection or you can see this list of all existing connection.

See this video if you find any issue to pe

1. Create a new database connection of your PostgreSQL server in QGiS. See the first video.
2. Add new Vector Layer in QGIS. 
3. Import Shape file to postgres . see video for more details.
4. using custom search so you will have to prepare documents table again based on new searchwgs data. execute below sql script on SQL.

```
--Clear existing search token
truncate table documents;
SELECT * FROM documents
-- prepare documents for faster search
insert into documents (document_id,document_text,document_tokens)
SELECT gid ,descriptio,to_tsvector(descriptio) from searchwgs
```