---
id: 161
title: 'Tensorflow &#8211; Testing Model Hasil Training'
date: 2019-05-16T15:25:49+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=161
permalink: /tensorflow-testing-model-hasil-training/
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
wp_last_modified_info:
  - June 14, 2019 @ 4:11 pm
wplmi_shortcode:
  - '[lmt-post-modified-info]'
categories:
  - Python
tags:
  - google cloud platform
  - google cloud storage
  - tensorflow
---
Bismillah,  
Jika pada artikel <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/05/14/tensorflow-custom-object-detection-api-cloud/" target="_blank">sebelumnya</a> kita sudah mencoba untuk melakukan training object detection menggunakan tensorflow di cloud, pada kesempatan kali ini kita akan mencoba hasil dari training tersebut. Agar dapat digunakan model hasil training yang telah kita lakukan, satu step lagi yang harus dilakukan adalah dengan export ke Tensorflow graph proto. 

#### Download Training Model

Download terlebih dahulu hasil training tersebut ke local menggunakan terminal menggunakan command gsutil.

<pre class="wp-block-code"><code>gsutil -m cp -R gs://tf-plate-detection-ml/data .</code></pre>

Fungsi dari perintah di atas adalah download folder data yang terdapat pada Google Cloud Storage pada current direktori, paramter &#8220;m&#8221; digunakan untuk multithreading sedangkan paramter &#8220;R&#8221; adalah karena yang kita copy adalah direktori. Pada bagian _gs://tf-plate-detection-ml/data_ silakan disesuaikan dengan nama bucket yang Anda punya di Google Cloud Storage, jika kita perhatikan hasil download tersebut terdapat struktur file-file seperti ini

  * model.ckpt-${CHECKPOINT_NUMBER}.data-00000-of-00001
  * model.ckpt-${CHECKPOINT_NUMBER}.index
  * model.ckpt-${CHECKPOINT_NUMBER}.meta

Misalkan seperti di bawah ini

<pre class="wp-block-preformatted">data/model.ckpt-10005.data-00000-of-00001 data/model.ckpt-9266.meta                 data/model.ckpt-9840.index                data/model.ckpt.data-00000-of-00001<br /> data/model.ckpt-10005.index               data/model.ckpt-9275.data-00000-of-00001  data/model.ckpt-9840.meta                 data/model.ckpt.index<br /> data/model.ckpt-10005.meta                data/model.ckpt-9275.index                data/model.ckpt-9841.data-00000-of-00001  data/model.ckpt.meta<br /> data/model.ckpt-9266.data-00000-of-00001  data/model.ckpt-9275.meta                 data/model.ckpt-9841.index<br /> data/model.ckpt-9266.index                data/model.ckpt-9840.data-00000-of-00001  data/model.ckpt-9841.meta</pre>

#### Export Training Model

Selanjutnya kita bisa melakukan export menggunakan perintah di bawah ini dari direktori _tensorflow/models/research_, tensorflow yang pada awal pertama kali kita download tetap akan digunakan terus karena disana banyak sekali tool yang akan kita manfaatkan ke depan.

<pre class="wp-block-code"><code># From tensorflow/models/research/
INPUT_TYPE=image_tensor
PIPELINE_CONFIG_PATH={path to pipeline config file}
TRAINED_CKPT_PREFIX={path to model.ckpt}
EXPORT_DIR={path to folder that will be used for export}
python object_detection/export_inference_graph.py \
    --input_type=${INPUT_TYPE} \
    --pipeline_config_path=${PIPELINE_CONFIG_PATH} \
    --trained_checkpoint_prefix=${TRAINED_CKPT_PREFIX} \
    --output_directory=${EXPORT_DIR}</code></pre>

Jika ketika menjalankan perintah di atas terdapat error di bawah ini, silakan tambahkan satu baris perintah seperti ini _export PYTHONPATH=$PYTHONPATH:_`<em>pwd</em>`_:_`<em>pwd</em>`_/slim_

<pre class="wp-block-code"><code>Traceback (most recent call last):
  File "object_detection/export_inference_graph.py", line 102, in &lt;module>
    from object_detection import exporter
ModuleNotFoundError: No module named 'object_detection'</code></pre>

Normalnya output perintah ketika export ke tensforflow graph proto ada sebagai berikut

<pre class="wp-block-preformatted">...<br />Postprocessor/BatchMultiClassNonMaxSuppression/map/while/PadOrClipBoxList/sub_9 (1/1 flops)<br />   Postprocessor/BatchMultiClassNonMaxSuppression/map/while/add (1/1 flops)<br />   Postprocessor/BatchMultiClassNonMaxSuppression/map/while/add_1 (1/1 flops)<br />   Postprocessor/BatchMultiClassNonMaxSuppression/ones/Less (1/1 flops)<br />   Preprocessor/map/while/Less (1/1 flops)<br />   Preprocessor/map/while/Less_1 (1/1 flops)<br />   Preprocessor/map/while/add (1/1 flops)<br />   Preprocessor/map/while/add_1 (1/1 flops)<br /> ======================End of Report==========================<br /> WARNING:tensorflow:From /usr/local/lib/python3.6/site-packages/tensorflow/python/training/saver.py:1266: checkpoint_exists (from tensorflow.python.training.checkpoint_management) is deprecated and will be removed in a future version.<br /> Instructions for updating:<br /> Use standard file APIs to check for files with this prefix.<br /> WARNING:tensorflow:From /usr/local/lib/python3.6/site-packages/tensorflow/python/tools/freeze_graph.py:232: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.<br /> Instructions for updating:<br /> Use tf.compat.v1.graph_util.convert_variables_to_constants<br /> WARNING:tensorflow:From /usr/local/lib/python3.6/site-packages/tensorflow/python/framework/graph_util_impl.py:245: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.<br /> Instructions for updating:<br /> Use tf.compat.v1.graph_util.extract_sub_graph<br /> WARNING:tensorflow:From /Volumes/DATA/Work/Coder/Python/tensor-flow/object-detection/models/research/object_detection/exporter.py:267: build_tensor_info (from tensorflow.python.saved_model.utils_impl) is deprecated and will be removed in a future version.<br /> Instructions for updating:<br /> This function will only be available through the v1 compatibility library as tf.compat.v1.saved_model.utils.build_tensor_info or tf.compat.v1.saved_model.build_tensor_info.<br />...</pre>

Kemudian silakan dicek pada output direktori hasil export seharusnya terdapat beberapa file seperti di bawah ini

<pre class="wp-block-preformatted">-rw-r--r--  1 od3ng  staff    77B May 16 14:04 checkpoint<br /> -rw-r--r--  1 od3ng  staff    22M May 16 14:05 frozen_inference_graph.pb<br /> -rw-r--r--  1 od3ng  staff    21M May 16 14:04 model.ckpt.data-00000-of-00001<br /> -rw-r--r--  1 od3ng  staff   8.7K May 16 14:04 model.ckpt.index<br /> -rw-r--r--  1 od3ng  staff   945K May 16 14:04 model.ckpt.meta<br /> -rw-r--r--  1 od3ng  staff   4.2K May 16 14:05 pipeline.config<br /> drwxr-xr-x  4 od3ng  staff   128B May 16 14:05 saved_model</pre>

#### Code Implementation

Silakan buat code python di bawah ini untuk running hasil model yang telah kita buat.

<pre class="wp-block-code"><code>import numpy as np
import tensorflow as tf
import cv2 as cv

# Read the graph.
with tf.gfile.FastGFile('model/frozen_inference_graph.pb', 'rb') as f:
    graph_def = tf.GraphDef()
    graph_def.ParseFromString(f.read())

with tf.Session() as sess:
    # Restore session
    sess.graph.as_default()
    tf.import_graph_def(graph_def, name='')

    # Read and preprocess an image.
    img = cv.imread('39.jpg')
    rows = img.shape[0]
    cols = img.shape[1]
    # inp = cv.resize(img, (300, 300))
    inp = img.copy()
    inp = inp[:, :, [2, 1, 0]]  # BGR2RGB

    # Run the model
    out = sess.run([sess.graph.get_tensor_by_name('num_detections:0'),
                    sess.graph.get_tensor_by_name('detection_scores:0'),
                    sess.graph.get_tensor_by_name('detection_boxes:0'),
                    sess.graph.get_tensor_by_name('detection_classes:0')],
                   feed_dict={'image_tensor:0': inp.reshape(1, inp.shape[0], inp.shape[1], 3)})

    # Visualize detected bounding boxes.
    num_detections = int(out[0][0])
    for i in range(num_detections):
        classId = int(out[3][0][i])
        score = float(out[1][0][i])
        bbox = [float(v) for v in out[2][0][i]]
        print("Class id : {}".format(classId))
        print("Score    : {}".format(score))
        print("bbox     : {}".format(bbox))
        if score >= 0.8:
            x = bbox[1] * cols
            y = bbox[0] * rows
            right = bbox[3] * cols
            bottom = bbox[2] * rows
            cv.rectangle(img, (int(x), int(y)), (int(right), int(bottom)), (125, 255, 51), thickness=2)
            text = "{}: {:.4f}".format(classId, score)
            cv.putText(img, text, (int(x), int(y) - 5), cv.FONT_HERSHEY_SIMPLEX, 0.75, (125, 255, 51), 2)

cv.imshow('TensorFlow Custom Object Detection', img)
cv.waitKey()</code></pre>

Hasil dari program di atas seharusnya seperti di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/05/Hasil-Testing-e1557992381977.png" alt="Hasil Testing" class="wp-image-163" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/05/Hasil-Testing-e1557992381977.png 442w, https://www.sinaungoding.com/wp-content/uploads/2019/05/Hasil-Testing-e1557992381977-300x177.png 300w" sizes="(max-width: 442px) 100vw, 442px" /><figcaption>Hasil Testing</figcaption></figure>
</div>

Binggo! Hasil di atas hampir sempurna object plate dapat terdeteksi walaupun masih ada object lain yang terdeteksi, seharusnya hanya satu saja yang terdeteksi yaitu object plate. Untuk dapat melakukan itu ada banyak faktor yang perlu dilakukan enchancment, yang paling utama adalah jumlah dataset yang digunakan sebaiknya more than 500 dan jumlah iterasi ketika melakukan training. Contoh model yang saya gunakan datasetnya baru sekitar 70an dengan iterasi 10000. 🙂 Untuk resource silakan bisa diambil di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/tf-plate-detection-cloud.git" target="_blank">sini</a>

Semoga tulisan saya bermanfaat, happy coding using python and tensorflow. Cheers!!! 😀

#### Referensi

  * [https://github.com/tensorflow/models/blob/master/research/object\_detection/g3doc/exporting\_models.md](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/exporting_models.md)
  * <https://github.com/opencv/opencv/wiki/TensorFlow-Object-Detection-API>