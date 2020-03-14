---
id: 387
title: 'OpenVINO &#8211; Object Detection YOLO3'
date: 2019-07-15T22:39:53+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=387
permalink: /openvino-object-detection-yolo3/
wp_last_modified_info:
  - July 17, 2019 @ 12:35 am
wplmi_shortcode:
  - '[lmt-post-modified-info]'
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
categories:
  - Raspberry Pi
tags:
  - object-detection
  - openvino
  - raspberry-pi
  - tensorflow
---
<div class="wp-block-image">
  <figure class="aligncenter is-resized"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-1024x576.jpeg" alt="Output object detection" class="wp-image-399" width="768" height="432" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-1024x576.jpeg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-300x169.jpeg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-768x432.jpeg 768w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output.jpeg 1280w" sizes="(max-width: 768px) 100vw, 768px" /></figure>
</div>

Bismillah,  
Jika pada kesempatan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/openvino-load-model-tensorflow/" target="_blank">sebelumnya</a> saya sudah posting mengenai objek detection pada sebuah gambar menggunakan `Single Shot Detection(SSD),` sekarang akan saya coba object detection dengan input berupa video menggunakan `You Only Look Once(YOLO)` versi 3. Peralatan yang akan digunakan adalah Raspberry Pi 3B+ dengan tertancap Neural Compute Stick 2 serta saya menggunakan Mac OSx yang sudah terinstall OpenVINO sdk. Beberapa point yang akan kita lakukan adalah sebagai berikut

  * [Download Model YOLO3](#Download-Model-YOLO3)
  * [Convert Model YOLO3 ke dalam Model Inference](#Convert-Model-YOLO3-ke-dalam-Model-Inference)
  * [Menjalankan Demo Program](#Menjalankan-Demo-Program)
  * [Referensi](#Referensi)

#### Download Model YOLO3 {#Download-Model-YOLO3}

Karena kita menggunakan model pre-trained sehingga kita tidak perlu membuat dari nol, kita cukup memanfaatkan model yang sudah tersedia. Silakan ketik perintah di bawah ini pada terminal Anda

<pre class="wp-block-code"><code>git clone https://github.com/mystic123/tensorflow-yolo-v3.git</code></pre>

Perintah di atas digunakan untuk download kode menggunakan git, jika pada komputer/laptop Anda belum terinstall git silakan install terlebih dahulu atau bisa download langsung tanpa harus melakukan cloning. Pada project tersebut adalah contoh model YOLO3 tetapi masih menggunakan komputer/laptop belum Raspberry dan NCS2. Hal yang dibutuhkan selanjutnya adalah label atau nama class dari object detection, ketikkan perintah di bawah ini pada terminal Anda

<pre class="wp-block-code"><code>wget https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names</code></pre>

Hasil download file di atas adalah daftar object-object yang dapat dikenali oleh YOLO3 kelak, ada 80 object yang dapat dikenali. Isi dari file tersebut kurang lebih seperti ini

<pre class="wp-block-preformatted">person
bicycle
car
motorbike
aeroplane
bus
train
truck
boat
traffic light
...</pre>

Selanjutnya kita bisa melakukan download model YOLO3, ada 2 jenis yang dapat kita gunakan yaitu versi untuk komputer pada umumnya dan perangkat dengan spesifikasi minimal(Raspberry, Android, dll). Ketik perintah di bawah ini pada terminal Anda

<pre class="wp-block-code"><code>wget https://pjreddie.com/media/files/yolov3.weights
wget https://pjreddie.com/media/files/yolov3-tiny.weights</code></pre>

File tersebut adalah hasil training dari YOLO3, `yolov3.weights` adalah versi yang full. Sedangkan `yolov3-tiny.weights` diperuntukkan untuk perangkat kecil. Yang perlu Anda lakukan selanjutnya yaitu ketik baris perintah di bawah ini

<pre class="wp-block-code"><code>python3 ./convert_weights.py --data_format NHWC</code></pre>

Perintah di atas digunakan untuk melakukan generate file check point, file tersebut dibutuhkan untuk membuat file `Protocol Buffer(*.pb)`. `data_format NHWC` maksudnya adalah karena nanti kita menjalankan menggunakan CPU, jika menggunakan GPU diganti dengan `NCHW`. Jika semuanya normal seharusnya output dari perintah di atas seperti di bawah ini

<pre class="wp-block-preformatted">WARNING: The TensorFlow contrib module will not be included in TensorFlow 2.0.
 For more information, please see:
 https://github.com/tensorflow/community/blob/master/rfcs/20180907-contrib-sunset.md
 https://github.com/tensorflow/addons
 If you depend on functionality not listed there, please file an issue. 
 WARNING:tensorflow:From /Users/od3ng/.virtualenvs/tf-object-detection/lib/python3.6/site-packages/tensorflow/python/framework/op_def_library.py:263: colocate_with (from tensorflow.python.framework.ops) is deprecated and will be removed in a future version.
 Instructions for updating:
 Colocations handled automatically by placer.</pre>

Output dari file tersebut seharusnya akan membentuk folder `saved_model`, silakan ketik perintah di bawah ini

<pre class="wp-block-code"><code>python3 ./convert_weights_pb.py --data_format NHWC</code></pre>

Seperti yang diinfokan di atas, perintah di atas untuk membuat file `Protocol Buffer(*.pb)`, sampai dengan langkah ini sebenarnya model dari YOLO3 sudah dapat digunakan. Output dari perintah di atas adalah sebagai berikut

<pre class="wp-block-preformatted">WARNING: The TensorFlow contrib module will not be included in TensorFlow 2.0.
 For more information, please see:
 https://github.com/tensorflow/community/blob/master/rfcs/20180907-contrib-sunset.md
 https://github.com/tensorflow/addons
 If you depend on functionality not listed there, please file an issue. 
 WARNING:tensorflow:From /Users/od3ng/.virtualenvs/tf-object-detection/lib/python3.6/site-packages/tensorflow/python/framework/op_def_library.py:263: colocate_with (from tensorflow.python.framework.ops) is deprecated and will be removed in a future version.
 Instructions for updating:
 Colocations handled automatically by placer.
 WARNING:tensorflow:From /Users/od3ng/PycharmProjects/tensorflow-yolo-v3/utils.py:53: convert_variables_to_constants (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
 Instructions for updating:
 Use tf.compat.v1.graph_util.convert_variables_to_constants
 WARNING:tensorflow:From /Users/od3ng/.virtualenvs/tf-object-detection/lib/python3.6/site-packages/tensorflow/python/framework/graph_util_impl.py:245: extract_sub_graph (from tensorflow.python.framework.graph_util_impl) is deprecated and will be removed in a future version.
 Instructions for updating:
 Use tf.compat.v1.graph_util.extract_sub_graph
 1208 ops written to frozen_darknet_yolov3_model.pb.</pre>

Sampai dengan langkah ini model yang telah kita buat, sebenarnya sudah selesai untuk format modelnya tensorflow. Silakan ketika program di bawah ini untuk melakukan ujicoba model yang telah kita buat, kita akan menggunakan gambar berikut ini untuk dilakukan detection

<div class="wp-block-image">
  <figure class="aligncenter is-resized"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-input-1024x576.jpeg" alt="Input object detection" class="wp-image-398" width="768" height="432" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-input-1024x576.jpeg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-input-300x169.jpeg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-input-768x432.jpeg 768w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-input.jpeg 1280w" sizes="(max-width: 768px) 100vw, 768px" /><figcaption>Input object detection</figcaption></figure>
</div>

<pre class="wp-block-code"><code>python3 demo.py --input_img ~/Desktop/OpenVINO-YOLO3-input.jpeg --output_img ~/Desktop/OpenVINO-YOLO3-output.jpeg --data_format NHWC</code></pre>

<pre class="wp-block-preformatted">...
File "demo.py", line 92, in main
     iou_threshold=FLAGS.iou_threshold)
   File "/Users/od3ng/PycharmProjects/tensorflow-yolo-v3/utils.py", line 191, in non_max_suppression
     image_pred = image_pred.reshape(-1, shape[-1])</pre>

Ketika mendapati error seperti di atas, silakan ganti kode program yang terdapat pada file `utils.py`

<pre class="wp-block-code"><code>shape = image_pred.shape 
non_zero_idxs = np.nonzero(image_pred) 
image_pred = image_pred[non_zero_idxs] 
image_pred = image_pred.reshape(-1, shape[-1])</code></pre>

Ganti beberapa baris di atas menjadi seperti di bawah ini

<pre class="wp-block-code"><code>image_pred = np.array([p for p in image_pred if p[4] > 0])</code></pre>

Setelah diganti kode di atas seharusnya tidak terjadi error kembali, hasilkan dari gambar input di atas kira-kira seperti di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter is-resized"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-1024x576.jpeg" alt="Output object detection" class="wp-image-399" width="768" height="432" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-1024x576.jpeg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-300x169.jpeg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output-768x432.jpeg 768w, https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-output.jpeg 1280w" sizes="(max-width: 768px) 100vw, 768px" /><figcaption>Output object detection</figcaption></figure>
</div>

#### Convert Model YOLO3 ke dalam Model Inference {#Convert-Model-YOLO3-ke-dalam-Model-Inference}

Agar file Protocol Buffer(\*.pb) dapat digunakan pada OpenVINO, kita perlu mengubahnya ke dalam format inference(\*.bin dan *.xml). Hal tersebut dapat dilakukan menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>cd /opt/intel/openvino/deployment_tools/model_optimizer
/mo_tf.py --input_model ~/PycharmProjects/tensorflow-yolo-v3-pi/frozen_darknet_yolov3_model.pb --tensorflow_use_custom_operations_config ../../deployment_tools/model_optimizer/extensions/front/tf/yolo_v3.json -o ~/PycharmProjects/tensorflow-yolo-v3-pi --data_type FP16 --batch 1</code></pre>

Jangan lupa untuk tambahan parameter `--data_type FP16` karena akan dijalankan pada raspberry.

#### Menjalankan Demo Program {#Menjalankan-Demo-Program}

Langkah terakhir yang akan kita coba yaitu menjalankan demo program yang telah kita buat sebelumnya, silakan download kode di <a href="https://github.com/0d3ng/tensorflow-yolo-v3-pi.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a> dan jalankan kode python seperti di bawah ini

<pre class="wp-block-code"><code>python3 openvino_yolov3.py -d MYRIAD -i frozen_darknet_yolov3_model.xml</code></pre>

Jika ketika dijalankan mendapatai error seperti di bawahi ini, pastikan tensorflow yang Anda gunakan untuk mengkonversi model tensorflow ke dalam model inference adalah versi <= 1.12.0

<pre class="wp-block-preformatted">t = IENetwork(model=model_xml, weights=model_bin)
   File "ie_api.pyx", line 271, in openvino.inference_engine.ie_api.IENetwork.<strong>cinit</strong>
 RuntimeError: Error reading network: in Layer detector/darknet-53/Conv_1/Conv2D: trying to connect an edge to non existing output port: 2.1</pre>

Jika semua normal, outputnya ditunjukkan pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter is-resized"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/OpenVINO-YOLO3-video.gif" alt="Output video object detection" class="wp-image-403" width="680" height="480" /><figcaption>Output video object detection</figcaption></figure>
</div>

Demikianlah tulisan saya mengenai object detection menggunakan model pre-trained yaitu YOLO3 pada OpenVINO, semoga bermanfaat dan tetap memotivasi temen-temen yang belajar OpenVINO. Kritik dan saran sangat diharapkan untuk meningkatkan kwalitas blog ini, happy coding. 🙂

#### Referensi {#Referensi}

  * [https://docs.openvinotoolkit.org/latest/\_docs\_MO\_DG\_prepare\_model\_convert\_model\_tf\_specific\_Convert\_YOLO\_From_Tensorflow.html](https://docs.openvinotoolkit.org/latest/_docs_MO_DG_prepare_model_convert_model_tf_specific_Convert_YOLO_From_Tensorflow.html)
  * [https://qiita.com/PINTO/items/94d5557fca9911cc892d#24-fps-boost-raspberrypi3-with-four-neural-compute-stick-2-ncs2-mobilenet-ssd&#8211;yolov3-48-fps-for-core-i7](https://qiita.com/PINTO/items/94d5557fca9911cc892d#24-fps-boost-raspberrypi3-with-four-neural-compute-stick-2-ncs2-mobilenet-ssd--yolov3-48-fps-for-core-i7)
  * <https://itnext.io/implementing-yolo-v3-in-tensorflow-tf-slim-c3c55ff59dbe>
  * <https://blog.paperspace.com/how-to-implement-a-yolo-object-detector-in-pytorch/>
  * <https://qiita.com/PINTO/items/7dd7135085a7249bf17a#support-for-local-training-and-openvino-of-one-class-tiny-yolov3-with-a-proprietary-data-set>
  * <https://cv-tricks.com/object-detection/faster-r-cnn-yolo-ssd/>
  * <https://github.com/mystic123/tensorflow-yolo-v3/issues/20>