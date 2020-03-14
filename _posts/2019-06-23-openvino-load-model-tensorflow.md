---
id: 349
title: 'OpenVINO &#8211; Load Model Tensorflow'
date: 2019-06-23T23:35:43+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=349
permalink: /openvino-load-model-tensorflow/
wp_last_modified_info:
  - June 24, 2019 @ 5:51 am
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
  - neural compute stick 2
  - openvino
  - python
  - raspberry-pi
  - tensorflow
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/vino-header-e1561307419686-1024x453.jpg" alt="Object detection" class="wp-image-356" /></figure>
</div>

Bismillah,  
Jika pada postingan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/installasi-neural-compute-stick-2-raspberry-pi/" target="_blank">sebelumnya</a> saya telah membahas mengenai pengenalan tentang Neural Compute Stick dan platfrom OpenVINO, sekarang akan dibahas lebih jauh lagi terutama pemanfaatan OpenVINO untuk kebutuhan computer vision. Kita akan mencoba menggunakan model yang dibuat oleh tensorflow, sayangnya tidak bisa langsung digunakan harus diubah dulu ke dalam Intermediate Representation(IR) model OpenVINO untuk menghasilkan file \*.bin dan \*.xml. Untuk melakukannnya menggunakan tool yang terdapat di dalam OpenVINO toolkit, dapat ada unduh di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://software.intel.com/en-us/openvino-toolkit/choose-download" target="_blank">sini</a>.

Beberapa perangkat yang saya gunakan adalah mac OS dan raspberry pi 3 B+, mac OS untuk mengubah model tensorflow ke dalam Intermediate Representation(IR) sedangkan raspberry host untuk deploy model dari OpenVINO. Kenapa tidak menggunakan raspberry sebagai tempat konversi juga, karena OpenVINO toolkit raspberry hanya menyediakan Inference Engine saja. Beberapa topik yang akan dibahas adalah sebagai berikut

  * [Installasi OpenVINO Toolkit](#Installasi-OpenVINO-Toolkit)
  * [Koversi Model Tensorflow](#Koversi-Model-Tensorflow)
  * [Inference Engine Object Detection OpenCV](#Inference-Engine-Object-Detection-OpenCV)
  * [Referensi](#Referensi)

#### Installasi OpenVINO Toolkit {#Installasi-OpenVINO-Toolkit}

Setelah selesai download, silakan dilakukan installasi seperti software pada umumnya di mac OS. Jika folder installasi tidak dilakukan perubahan seharusnya terdapat di `/opt/intel`, ketik perintah seperti di bawah ini pada terminal 

<pre class="wp-block-code"><code>cd /opt/intel/openvino_2019.1.144/deployment_tools/model_optimizer/install_prerequisites
./install_prerequisites_tf.sh
</code></pre>

Jika semuanya normal seharusnya nanti akan menampilkan proses installasi paket yang dibutuhkan seperti pada tampilan berikut ini

<pre class="wp-block-preformatted">Requirement already satisfied: tensorflow>=1.2.0 in /usr/local/lib/python3.6/site-packages (from -r /opt/intel/openvino_2019.1.144/deployment_tools/model_optimizer/install_prerequisites/../requirements_tf.txt (line 1)) (1.13.1)
Collecting networkx>=1.11 (from -r /opt/intel/openvino_2019.1.144/deployment_tools/model_optimizer/install_prerequisites/../requirements_tf.txt (line 2))
Downloading https://files.pythonhosted.org/packages/85/08/f20aef11d4c343b557e5de6b9548761811eb16e438cee3d32b1c66c8566b/networkx-2.3.zip (1.7MB)
...
...
...
[WARNING] All Model Optimizer dependencies are installed globally.
[WARNING] If you want to keep Model Optimizer in separate sandbox
[WARNING] run install_prerequisites.sh venv {caffe|tf|mxnet|kaldi|onnx}</pre>

#### Koversi Model Tensorflow {#Koversi-Model-Tensorflow}

Setelah install paket-paket yang dibutuhkan selesai, selanjutnya menjalankan proses konversi model tensorflow ke bentuk Intermediate Representation(IR) menggunakan perintah di bawah ini. Sebelum melakukan konversi, silakan download terlebih dahulu model yang akan digunakan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md" target="_blank">sini</a> atau bisa didapatkan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://docs.openvinotoolkit.org/latest/_docs_MO_DG_prepare_model_convert_model_Convert_Model_From_TensorFlow.html" target="_blank">sini</a> juga. Pada contoh ini saya menggunakan <a href="http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_2018_01_28.tar.gz" target="_blank" rel="noreferrer noopener" aria-label="SSD MobileNet V1 COCO (opens in a new tab)">SSD MobileNet V1 COCO</a>

<pre class="wp-block-code"><code>cd /opt/intel/openvino_2019.1.144/deployment_tools/model_optimizer/
./mo_tf.py --input_model=/Users/od3ng/Downloads/ssd_mobilenet_v1_coco_2018_01_28/frozen_inference_graph.pb --tensorflow_use_custom_operations_config ../../deployment_tools/model_optimizer/extensions/front/tf/ssd_v2_support.json --tensorflow_object_detection_api_pipeline_config ~/Downloads/ssd_mobilenet_v1_coco_2018_01_28/pipeline.config --reverse_input_channels -o /tmp</code></pre>

Untuk path silakan disesuaikan dengan laptop/komputer Anda, jka normalnya harusnya output yang dihasilkan pada terminal adalah sebagai berikut

<pre class="wp-block-preformatted">Model Optimizer arguments:
 Common parameters:
     - Path to the Input Model:  /Users/od3ng/Downloads/ssd_mobilenet_v1_coco_2018_01_28/frozen_inference_graph.pb
     - Path for generated IR:    /tmp
     - IR output name:   frozen_inference_graph
     - Log level:    ERROR
     - Batch:    Not specified, inherited from the model
     - Input layers:     Not specified, inherited from the model
     - Output layers:    Not specified, inherited from the model
     - Input shapes:     Not specified, inherited from the model
     - Mean values:  Not specified
     - Scale values:     Not specified
     - Scale factor:     Not specified
     - Precision of IR:  FP32
     - Enable fusing:    True
     - Enable grouped convolutions fusing:   True
     - Move mean values to preprocess section:   False
     - Reverse input channels:   True
 TensorFlow specific parameters:
     - Input model in text protobuf format:  False
     - Path to model dump for TensorBoard:   None
     - List of shared libraries with TensorFlow custom layers implementation:    None
     - Update the configuration file with input/output node names:   None
     - Use configuration file used to generate the model with Object Detection API:  /Users/od3ng/Downloads/ssd_mobilenet_v1_coco_2018_01_28/pipeline.config
     - Operations to offload:    None
     - Patterns to offload:  None
     - Use the config file:  /opt/intel/openvino_2019.1.144/deployment_tools/model_optimizer/../../deployment_tools/model_optimizer/extensions/front/tf/ssd_v2_support.json
 Model Optimizer version:     2019.1.1-83-g28dfbfd
 The Preprocessor block has been removed. Only nodes performing mean value subtraction and scaling (if applicable) are kept.
 [ SUCCESS ] Generated IR model.
 [ SUCCESS ] XML file: /tmp/frozen_inference_graph.xml
 [ SUCCESS ] BIN file: /tmp/frozen_inference_graph.bin
 [ SUCCESS ] Total execution time: 28.39 seconds.</pre>

#### Inference Engine Object Detection OpenCV {#Inference-Engine-Object-Detection-OpenCV}

Setelah berhasil membuat file inference, selanjutnya kita akan testing hasilnya menggunakan kode python di bawah ini

<pre class="wp-block-code"><code>import cv2 as cv

# Load class txt
LABELS = open("classes.txt").read().strip().split("\n")

# Load the model.
net = cv.dnn.readNet('frozen_inference_graph.xml',
                     'frozen_inference_graph.bin')
# Specify target device.
net.setPreferableTarget(cv.dnn.DNN_TARGET_MYRIAD)

font_scale = 1
font = cv.FONT_HERSHEY_PLAIN
rectangle_bgr = (255, 255, 255)

# Read an image.
frame = cv.imread('objects.jpg')

rows = frame.shape[0]
cols = frame.shape[1]

# Prepare input blob and perform an inference.
blob = cv.dnn.blobFromImage(frame, size=(672, 384), ddepth=cv.CV_8U)
net.setInput(blob)
out = net.forward()
# Draw detected faces on the frame.
for detection in out.reshape(-1, 7):
    confidence = float(detection[2])
    class_id = int(detection[1])
    left = detection[3] * cols
    top = detection[4] * rows
    right = detection[5] * cols
    bottom = detection[6] * rows
    if confidence > 0.8:
        left = detection[3] * cols
        top = detection[4] * rows
        right = detection[5] * cols
        bottom = detection[6] * rows
        text = "{} {:.2f}".format(LABELS[class_id], confidence)

        (text_width, text_height) = cv.getTextSize(text, font, fontScale=font_scale, thickness=1)[0]
        text_offset_x = int(left)
        text_offset_y = int(top) - 2
        box_coord = ((text_offset_x, text_offset_y), (text_offset_x + text_width-2, text_offset_y - text_height - 2))

        cv.rectangle(frame, (int(left), int(top)), (int(right), int(bottom)), (255, 255, 255), thickness=2)
        cv.rectangle(frame, box_coord[0], box_coord[1], rectangle_bgr, cv.FILLED)
        cv.putText(frame, text, (text_offset_x, text_offset_y), font, fontScale=font_scale, color=(0, 0, 0),thickness=1)

# Save the frame to an image file.
cv.imwrite('out.png', frame)</code></pre>

Sebenarnya kode python di atas, mirip dengan kode yang digunakan pada artikel [sebelumnya](https://www.sinaungoding.com/installasi-neural-compute-stick-2-raspberry-pi/) tetapi dimodifikasi sedikit untuk menampilkan nama object yang terdeteksi. Silakan dijalankan kode python tersebut, kemudian untuk gambar yang akan kita proses adalah di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/vino-objects.jpg" alt="Input object detection" class="wp-image-353" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/vino-objects.jpg 500w, https://www.sinaungoding.com/wp-content/uploads/2019/06/vino-objects-300x225.jpg 300w" sizes="(max-width: 500px) 100vw, 500px" /><figcaption>Input object detection</figcaption></figure>
</div>

Ketika terjadi error di bawah ini, silakan ditambahkan parameter `--data_type FP16` pada perintah untuk mengubah ke dalam model inference. Hal tersebut terjadi karena raspberry tidak mendukung FP16 untuk Movidius(Myriad). 

<pre class="wp-block-preformatted">Traceback (most recent call last):
   File "object-detection-vino.py", line 20, in 
     out = net.forward()
 cv2.error: OpenCV(4.1.0-openvino) /home/jenkins/workspace/OpenCV/OpenVINO/build/opencv/modules/dnn/src/op_inf_engine.cpp:747: error: (-215:Assertion failed) Failed to initialize Inference Engine backend: [VPU] Unsupported network precision : FP32 in function 'initPlugin'(openvino)</pre>

Sehingga perintah menjadi seperti di bawah ini

<pre class="wp-block-code"><code>./mo_tf.py --input_model=/Users/od3ng/Downloads/ssd_mobilenet_v1_coco_2018_01_28/frozen_inference_graph.pb --tensorflow_use_custom_operations_config ../../deployment_tools/model_optimizer/extensions/front/tf/ssd_v2_support.json --tensorflow_object_detection_api_pipeline_config ~/Downloads/ssd_mobilenet_v1_coco_2018_01_28/pipeline.config --reverse_input_channels -o /tmp --data_type FP16</code></pre>

Silakan diupdate file \*.bin dan \*.xml sebelumnya, setelah itu dijalankan kembali seharusnya sudah tidak ada error yang terjadi. Hasilnya kira-kira ditampilkan pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/vino-out.png" alt="Output object detection" class="wp-image-354" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/vino-out.png 500w, https://www.sinaungoding.com/wp-content/uploads/2019/06/vino-out-300x225.png 300w" sizes="(max-width: 500px) 100vw, 500px" /><figcaption>Output object detection</figcaption></figure>
</div>

Jika dilihat dari hasilnya sebenarnya hampir sempurna, objek orang yang memakai jaket merah kelihatan kecil tidak dapat terdeteksi. Sebelumnya sudah pernah saya gunakan sebagai contoh ketika langsung menggunakan <a rel="noreferrer noopener" aria-label="OpenCV (opens in a new tab)" href="https://www.sinaungoding.com/object-recognized-menggunakan-opencv/" target="_blank">OpenCV</a> dan hasilnya sempurna, sebenarnya masih bisa disempurnakan dengan mengubah beberapa hyperparameter tetapi jika hanya sebagai contoh untuk menggunakan OpenVINO sudah cukup sih. Kode program di atas dapat diunduh di <a href="https://github.com/0d3ng/object-detection-vino.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah artikel saya tentang pemanfaatan OpenVINO yang lebih luas tentang konversi model tensorlow, semoga bermanfaat dan ditunggu ya artikel-artikel yang akan datang. Saran dan kritik masih diharapkan untuk penyempurnaan blog ini. Happy coding!!! (^-^)

#### Referensi {#Referensi}

  * [https://docs.openvinotoolkit.org/latest/\_docs\_MO\_DG\_prepare\_model\_Config\_Model\_Optimizer.html](https://docs.openvinotoolkit.org/latest/_docs_MO_DG_prepare_model_Config_Model_Optimizer.html)
  * <https://www.youtube.com/watch?v=rUwayTZKnmA>
  * <https://github.com/opencv/opencv/wiki/TensorFlow-Object-Detection-API>
  * [https://docs.openvinotoolkit.org/latest/\_docs\_MO\_DG\_prepare\_model\_convert\_model\_Convert\_Model\_From_TensorFlow.html](https://docs.openvinotoolkit.org/latest/_docs_MO_DG_prepare_model_convert_model_Convert_Model_From_TensorFlow.html)