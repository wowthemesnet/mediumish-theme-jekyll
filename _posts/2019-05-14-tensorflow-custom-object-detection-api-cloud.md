---
id: 151
title: 'TensorFlow &#8211; Custom Object Detection API Cloud'
date: 2019-05-14T17:02:34+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=151
permalink: /tensorflow-custom-object-detection-api-cloud/
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
wp_last_modified_info:
  - June 14, 2019 @ 4:21 pm
wplmi_shortcode:
  - '[lmt-post-modified-info]'
categories:
  - Python
tags:
  - computer vision
  - custom object detection
  - google cloud platform
  - google cloud storage
  - tensorboard
  - tensorflow
---
Bismillah,  
Gak papa ya judulnya menggunakan bahasa inggris, ke depan semoga konten juga bisa menggunakan bahasa inggris juga. Sebenarnya dari judul sudah kelihatan, yang akan kita lakukan adalah melakukan training data menggunakan cloud yaitu google colab. Google colab merupakan layanan google yang secara gratis untuk belajar machine learning berbasis cloud, kemudian dengan google colab kita juga tidak dikhawatirkan dengan spesifikasi komputer yang minim untuk melakukan training data karena yang cukup Anda butuhkan adalah koneksi internet. Bagi Anda yang sudah terbiasa menggunakan jupyter notebook akan sangat gampang jika menggunakannya, untuk lebih jelasnya bisa Anda baca-baca di website resminya di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://colab.research.google.com/notebooks/welcome.ipynb" target="_blank">sini</a>. Sebelum Anda memulai sebaiknya hal-hal berikut ini wajib sudah dilakukan

  * Mendaftar dan membuat project di google cloud platform. Bisa dibaca pada tulisan saya di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/04/28/cara-mendaftar-akun-di-google-cloud-storage/" target="_blank">sini</a>.
  * Install Tensorflow Object Detection API. Sudah sangat lengkap di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/installation.md" target="_blank">sini</a> untuk step by stepnya.
  * Setting google cloud storage, karena nanti data-data akan disimpan di sana.
  * Install Google Cloud SDK, agar mudah melakukan perintah-perintah melalui komputer Anda. Dapat Anda temui proses instllasi tersebut di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://cloud.google.com/sdk/docs/" target="_blank">sini</a>.
  * Menyiapkan semua konfigurasi yang dibutuhkan untuk melakukan training, sebaiknya Anda sudah berhasil menjalankan training di local komputer/laptop untuk beberapa iterasi.

Untuk memudahkan dalam memahami alur dari tulisan ini, saya bagi menjadi beberapa point seperti berikut

  * [Pembuatan Paket Installasi](#Pembuatan-Paket-Installasi)
  * [Mendefinisikan Environment Variable](#Mendefinisikan-Environment-Variable)
  * [Upload File Konfigurasi Training](#Upload-File-Konfigurasi-Training)
  * [Monitoring Training Dengan Tensorboard](#Monitoring-Training-Dengan-Tensorboard)
  * [Referensi](#Referensi)

#### Pembuatan Paket Installasi {#Pembuatan-Paket-Installasi}

Paket disini nanti yang dibutuhkan ketika proses training, tool untuk pembuatan paket sudah disediakan ketika kita download atau clone tensorflow. Ketikkan perintah di bawah ini untuk membuat paket depedency TF-slim dan libraray <a rel="noreferrer noopener" aria-label="picocotools (opens in a new tab)" href="https://github.com/cocodataset/cocoapi/tree/master/PythonAPI/pycocotools" target="_blank">picocotools</a>.

<pre class="wp-block-code"><code># dari direktori tensorflow/models/research/
bash object_detection/dataset_tools/create_pycocotools_package.sh /tmp/pycocotools</code></pre>

Ketika dijalankan output dari perintah di atas kira-kira seperti di bawah ini.

<pre class="wp-block-preformatted">Cloning into 'cocoapi'…<br />remote: Enumerating objects: 953, done.<br />remote: Total 953 (delta 0), reused 0 (delta 0), pack-reused 953<br />Receiving objects: 100% (953/953), 11.70 MiB | 2.48 MiB/s, done.<br />Resolving deltas: 100% (566/566), done</pre>

Sekarang coba dilakukan pengecekan dalam direktori _/tmp/pycocotools_ seharusnya ada file _pycocotools-2.0.tar.gz_. Selanjutnya kita akan membuat modul object detection dengan command di bawah ini

<pre class="wp-block-code"><code>python3 setup.py sdist</code></pre>

Kira-kira output dari perintah di atas ada sebagai berikut

<pre class="wp-block-preformatted">...<br />creating object_detection-0.1<br />creating object_detection-0.1/object_detection<br />creating object_detection-0.1/object_detection.egg-info<br />creating object_detection-0.1/object_detection/anchor_generators<br />creating object_detection-0.1/object_detection/box_coders<br />...</pre>

Silakan cek hasil perintah di atas dalam direktori _dist_, seharusnya akan ada file _object_detection-0.1.tar.gz_ yang terbentuk. Kemudian modul selanjutnya yang akan kita buat adalah slim, dengan perintah di bawah ini yang perlu Anda lakukan.

<pre class="wp-block-code"><code>(cd slim && python3 setup.py sdist)</code></pre>

Output pada terminal Anda kurang lebih seperti di bawah ini

<pre class="wp-block-preformatted">...<br />creating slim-0.1<br />creating slim-0.1/datasets<br />creating slim-0.1/deployment<br />creating slim-0.1/nets<br />creating slim-0.1/nets/mobilenet<br />...</pre>

Hasil dari perintah di atas bisa Anda cek dalam direktori _slim/dist_ seharusnya akan terbentuk file _slim-0.1.tar.gz_

#### Mendefinisikan Environment Variable

Untuk memudahkan pemanggilan variabel yang kelak akan digunakan sebaiknya Anda mendefinisikan diawal dalam sebuah variabel environment agar menghindari typo atau salah ketika. Berikut ini yang bisa Anda lakukan, saya hanya mendefiniskan untuk nama project dan direktori google cloud storage. Jika Anda ingin menambahkan environment variabel yang lain silakan.

<pre class="wp-block-code"><code>export PROJECT=$(gcloud config list project --format "value(core.project)")
export YOUR_GCS_BUCKET="gs://${PROJECT}-ml"</code></pre>

Nilai dalam variabel environment silakan disesuaikan dengan yang terdapat dalam project Anda, untuk nama variabel sebaiknya mengandung makna serta mudah untuk diketik, jangan terlalu panjang karena nanti akan kita panggil dengan mengetik manual. Variabel environment tersebut hanya bersifat sementara, jika buka tab baru terminal atau ditutup maka variabel tersebut akan hilang.

#### Upload File Konfigurasi Training  {#Upload-File-Konfigurasi-Training}

Untuk dapat upload file konfigurasi sebenarnya langkahnya sangat mudah sekali, file tersebut tentunya akan kita upload ke google cloud storage yang telah kita konfigurasi sebelumnya(pembuatan bucket). Anda bisa menggunakan mode gui yang telah disediakan google atau dapat memanfaatkan Google Cloud SDK, perintah di bawah ini menggunakan Google Cloud SDK melalui terminal. 

<pre class="wp-block-code"><code>gsutil cp train.record ${YOUR_GCS_BUCKET}/data/train.record
gsutil cp test.record ${YOUR_GCS_BUCKET}/data/test.record
gsutil cp object_detection/data/plate_number_map.pbtxt \
    ${YOUR_GCS_BUCKET}/data/plate_number_map.pbtxt</code></pre>

Perintah di atas digunakan untuk melakukan upload atau copy file \*.record dan \*.pbtxt ke Google Cloud Storage Anda, file \*.record adalah file hasil hasil covert dari labeling ke file TFRecord sedangkan file \*.pbtxt adalah file yang berisi tentang informasi label dan class id dari sebuah training. Anda bisa membaca tentang pembuataan file tersebut bisa ditemukan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://imamdigmi.github.io/post/tensorflow-custom-object-detection/" target="_blank">sini</a>, di blog tersebut dijelaskan secara detail. Selanjutnya yang dibutuhkan adalah arsitektur model yang sudah ada misalkan ssd menggunakan dataset coco, silakan download terlebih dahulu di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_2018_01_28.tar.gz" target="_blank">sini</a>.

<pre class="wp-block-preformatted">├── checkpoint<br /> ├── frozen_inference_graph.pb<br /> ├── model.ckpt.data-00000-of-00001<br /> ├── model.ckpt.index<br /> ├── model.ckpt.meta<br /> ├── pipeline.config<br /> └── saved_model<br />     ├── saved_model.pb<br />     └── variables<br /> 2 directories, 7 files</pre>

Isi file tersebut ditampilkan seperti di atas, selanjutnya Anda juga membutuhkan file config dari model tersebut. Silakan download file yang dimaksud di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/tensorflow/models/blob/master/research/object_detection/samples/configs/ssd_mobilenet_v1_pets.config" target="_blank">sini</a> atau sebenarnya juga terdapat dalam folder _object_detection/samples/configs/_, yang harus Anda sesuaikan adalah lokasi dari file-file yang dibutuhkan. Contoh konfigurasi yang saya gunakan adalah sebagai berikut

<pre class="wp-block-preformatted"># SSD with Mobilenet v1, configured for the Raccoon dataset.<br /># Users should configure the fine_tune_checkpoint field in the train config as<br /># well as the label_map_path and input_path fields in the train_input_reader and<br /># eval_input_reader. Search for "${YOUR_GCS_BUCKET}" to find the fields that<br /># should be configured.<br /> <br />model {<br />   ssd {<br />     num_classes: 1<br />     box_coder {<br />       faster_rcnn_box_coder {<br />         y_scale: 10.0<br />         x_scale: 10.0<br />         height_scale: 5.0<br />         width_scale: 5.0<br />       }<br />     }<br />     matcher {<br />       argmax_matcher {<br />         matched_threshold: 0.5<br />         unmatched_threshold: 0.5<br />         ignore_thresholds: false<br />         negatives_lower_than_unmatched: true<br />         force_match_for_each_row: true<br />       }<br />     }<br />     similarity_calculator {<br />       iou_similarity {<br />       }<br />     }<br />     anchor_generator {<br />       ssd_anchor_generator {<br />         num_layers: 6<br />         min_scale: 0.2<br />         max_scale: 0.95<br />         aspect_ratios: 1.0<br />         aspect_ratios: 2.0<br />         aspect_ratios: 0.5<br />         aspect_ratios: 3.0<br />         aspect_ratios: 0.3333<br />       }<br />     }<br />     image_resizer {<br />       fixed_shape_resizer {<br />         height: 300<br />         width: 300<br />       }<br />     }<br />     box_predictor {<br />       convolutional_box_predictor {<br />         min_depth: 0<br />         max_depth: 0<br />         num_layers_before_predictor: 0<br />         use_dropout: false<br />         dropout_keep_probability: 0.8<br />         kernel_size: 1<br />         box_code_size: 4<br />         apply_sigmoid_to_scores: false<br />         conv_hyperparams {<br />           activation: RELU_6,<br />           regularizer {<br />             l2_regularizer {<br />               weight: 0.00004<br />             }<br />           }<br />           initializer {<br />             truncated_normal_initializer {<br />               stddev: 0.03<br />               mean: 0.0<br />             }<br />           }<br />           batch_norm {<br />             train: true,<br />             scale: true,<br />             center: true,<br />             decay: 0.9997,<br />             epsilon: 0.001,<br />           }<br />         }<br />       }<br />     }<br />     feature_extractor {<br />       type: 'ssd_mobilenet_v1'<br />       min_depth: 16<br />       depth_multiplier: 1.0<br />       conv_hyperparams {<br />         activation: RELU_6,<br />         regularizer {<br />           l2_regularizer {<br />             weight: 0.00004<br />           }<br />         }<br />         initializer {<br />           truncated_normal_initializer {<br />             stddev: 0.03<br />             mean: 0.0<br />           }<br />         }<br />         batch_norm {<br />           train: true,<br />           scale: true,<br />           center: true,<br />           decay: 0.9997,<br />           epsilon: 0.001,<br />         }<br />       }<br />     }<br />     loss {<br />       classification_loss {<br />         weighted_sigmoid {<br />           anchorwise_output: true<br />         }<br />       }<br />       localization_loss {<br />         weighted_smooth_l1 {<br />           anchorwise_output: true<br />         }<br />       }<br />       hard_example_miner {<br />         num_hard_examples: 3000<br />         iou_threshold: 0.99<br />         loss_type: CLASSIFICATION<br />         max_negatives_per_positive: 3<br />         min_negatives_per_image: 0<br />       }<br />       classification_weight: 1.0<br />       localization_weight: 1.0<br />     }<br />     normalize_loss_by_num_matches: true<br />     post_processing {<br />       batch_non_max_suppression {<br />         score_threshold: 1e-8<br />         iou_threshold: 0.6<br />         max_detections_per_class: 100<br />         max_total_detections: 100<br />       }<br />       score_converter: SIGMOID<br />     }<br />   }<br /> }<br /> train_config: {<br />   batch_size: 8<br />   optimizer {<br />     rms_prop_optimizer: {<br />       learning_rate: {<br />         exponential_decay_learning_rate {<br />           initial_learning_rate: 0.004<br />           decay_steps: 800720<br />           decay_factor: 0.95<br />         }<br />       }<br />       momentum_optimizer_value: 0.9<br />       decay: 0.9<br />       epsilon: 1.0<br />     }<br />   }<br />   fine_tune_checkpoint: "gs://tf-plate-detection-ml/data/model.ckpt"<br />   from_detection_checkpoint: true<br />   num_steps: 10000<br />   data_augmentation_options {<br />     random_horizontal_flip {<br />     }<br />   }<br />   data_augmentation_options {<br />     ssd_random_crop {<br />     }<br />   }<br /> }<br /> train_input_reader: {<br />   tf_record_input_reader {<br />     input_path: "gs://tf-plate-detection-ml/data/train.record"<br />   }<br />   label_map_path: "gs://tf-plate-detection-ml/data/plate_number_map.pbtxt"<br /> }<br /> eval_config: {<br />   num_examples: 40<br /> }<br /> eval_input_reader: {<br />   tf_record_input_reader {<br />     input_path: "gs://tf-plate-detection-ml/data/test.record"<br />   }<br />   label_map_path: "gs://tf-plate-detection-ml/data/plate_number_map.pbtxt"<br />   shuffle: false<br />   num_readers: 1<br /> }</pre>

<pre class="wp-block-code"><code>gsutil cp ssd_mobilenet_v1_coco_2018_01_28/model.ckpt.* ${YOUR_GCS_BUCKET}/data/
gsutil cp [path_file_config].config ${YOUR_GCS_BUCKET}/data/</code></pre>

Strukur direktori yang terdapat di dalam Google Cloud Storage kira-kira seperti di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/05/Google-Cloud-Platform-e1557822465593.png" alt="Google Cloud Platform" class="wp-image-157" /><figcaption>Google Cloud Platform</figcaption></figure>
</div>

Satu file lagi yang dibutuhkan adalah file yaml untuk mendeskripsikan parameter-parameter ketika melakukan training. Contoh isi file tersebut adalah sebagai berikut

<pre class="wp-block-preformatted">trainingInput:<br />   runtimeVersion: '1.13'<br />   pythonVersion: '3.5'<br />   scaleTier: CUSTOM<br />   masterType: standard<br />   workerCount: 3<br />   workerType: standard<br />   parameterServerCount: 1<br />   parameterServerType: standard</pre>

Untuk memahami tentang konfigurasi tersebut dapat dipahami di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://cloud.google.com/ml-engine/docs/tensorflow/training-jobs" target="_blank">sini</a>, dengan melakukan ujicoba pada parameter-parameter tersebut akan memaksimalkan ketika training. Tetapi tentunya konfigurasi tersebut disesuaikan dengan layanan Google Cloud, maksudnya adalah Google Cloud memberikan spesifikasi minimal ketika kita mendaftar di akun yang gratis. Jika untuk kebutuhan belajar, menurut saya sudah mencukupi daripada harus menjalankan di local komputer/laptop. 

Silakan jalankan perintah di bawah ini untuk melakukan training, atau membuat job pada Google Cloud

<pre class="wp-block-preformatted">gcloud ai-platform jobs submit training object_detection_<code>date +%m_%d_%Y_%H_%M_%S</code> \<br />     --job-dir=${YOUR_GCS_BUCKET}/train \<br />     --packages dist/object_detection-0.1.tar.gz,slim/dist/slim-0.1.tar.gz,/tmp/pycocotools/pycocotools-2.0.tar.gz \<br />     --module-name object_detection.model_main \<br />     --region us-central1 \<br />     --config object_detection/samples/cloud/cloud-sample.yml \<br />     -- \<br />     --model_dir=${YOUR_GCS_BUCKET}/data \<br />     --pipeline_config_path=${YOUR_GCS_BUCKET}/data/ssd_mobilenet_v1_plate_number_cloud.config</pre>

Kemudian untuk memantau job training yang kita lakukan dapat menggunakan perintah di bawah ini, sebenarnya Anda juga bisa melihat aktifitasnya dalam dashboard Google Cloud Platform via browser tetapi saya lebih suka lewat terminal. 

<pre class="wp-block-code"><code>gcloud ai-platform jobs stream-logs [job_id]</code></pre>

Contohnya adalah sebagai berikut

<pre class="wp-block-code"><code>gcloud ai-platform jobs stream-logs object_detection_05_14_2019_13_23_17</code></pre>

<pre class="wp-block-preformatted">...<br />ERROR    2019-05-14 09:20:53 +0700   service         import matplotlibnmatplotlib.use('Agg')nimport matplotlib.pyplot as plt<br />ERROR    2019-05-14 09:20:53 +0700   service                                         ^<br />ERROR    2019-05-14 09:20:53 +0700   service     SyntaxError: invalid syntax<br />ERROR    2019-05-14 09:20:53 +0700   service<br />ERROR    2019-05-14 09:20:53 +0700   service     To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=84697927134&resource=ml_job%2Fjob_id%2Fobject_detection_05_14_2019_09_14_13&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%22object_detection_05_14_2019_09_14_13%22<br />INFO    2019-05-14 09:21:45 +0700   service     Finished tearing down training program.<br />INFO    2019-05-14 09:21:45 +0700   service     Job failed.<br />...</pre>

Jika ditemukan error di atas jangan khawatir, ada yang perlu Anda sesuaikan sedikit ketika pembuatan paket picocotools. Error tersebut karena karakter new line &#8220;\n&#8221; pada MacOS. Silakan disesuikan file yang ada di _object\_detection/dataset\_tools/create\_pycocotools\_package.sh_

<pre class="wp-block-code"><code>sed "s/import matplotlib\.pyplot as plt/import matplotlib\nmatplotlib\.use\(\'Agg\'\)\nimport matplotlib\.pyplot as plt/g" pycocotools/coco.py > coco.py.updated</code></pre>

Diganti menjadi

<pre class="wp-block-code"><code>sed "s/import matplotlib\.pyplot as plt/import matplotlib;matplotlib\.use\(\'Agg\'\);import matplotlib\.pyplot as plt/g" pycocotools/coco.py > coco.py.updated</code></pre>

#### Monitoring Training Dengan Tensorboard {#Monitoring-Training-Dengan-Tensorboard}

Dengan tensorflow kita dapat melihat hasil visualisasi dari hasil training yang telah kita lakukan atau sedang berlangsung. Silakan jalankan perintah di bawah ini pada terminal untuk melihat hasil training menggunakan tensorboard

<pre class="wp-block-code"><code>gcloud auth application-default login
tensorboard --logdir=${YOUR_GCS_BUCKET}</code></pre>

Kemudian buka browser Anda dengan URL _localhost:6060_, jika semuanya normal harusnya akan tampil seperti ditunjukkan pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter is-resized"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/05/Tensorboard-1024x557.png" alt="Tensorboard" class="wp-image-158" width="729" height="396" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/05/Tensorboard-1024x557.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/05/Tensorboard-300x163.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/05/Tensorboard-768x418.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/05/Tensorboard.png 1251w" sizes="(max-width: 729px) 100vw, 729px" /><figcaption>Tensorboard</figcaption></figure>
</div>

Demikianlah tulisan saya mengenai training data object detection API tensorflow memanfaatkan layanana Google Cloud Platform, untuk file-file pendukung dapat diunduh di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/tf-plate-detection-cloud.git" target="_blank">sini</a>. Semoga bermanfaat bagi temen-temen yang suka bermain dengan computer vision. Cheers! 🙂

## Referensi {#Referensi}

  * [https://github.com/tensorflow/models/blob/master/research/object\_detection/g3doc/running\_on_cloud.md](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/running_on_cloud.md)
  * [https://github.com/tensorflow/models/blob/master/research/object\_detection/g3doc/running\_pets.md](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/running_pets.md)
  * <https://stackoverflow.com/questions/51430391/tensorflow-object-detection-training-error-with-tpu>
  * <https://github.com/tensorflow/models/issues/5033>
  * <https://github.com/tensorflow/models/pull/6563/commits/7385a6fb88f5cb879caf96b84998da8ca513f1fb>
  * <https://imamdigmi.github.io/post/tensorflow-custom-object-detection/>