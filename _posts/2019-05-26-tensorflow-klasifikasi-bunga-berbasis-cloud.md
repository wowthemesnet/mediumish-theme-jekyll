---
id: 194
title: 'Tensorflow &#8211; Klasifikasi Bunga Berbasis Cloud'
date: 2019-05-26T15:44:45+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=194
permalink: /tensorflow-klasifikasi-bunga-berbasis-cloud/
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
wp_last_modified_info:
  - June 14, 2019 @ 3:53 pm
wplmi_shortcode:
  - '[lmt-post-modified-info]'
categories:
  - Python
tags:
  - google cloud platform
  - google cloud storage
  - klasifikasi
  - tensorboard
  - tensorflow
---
Bismillah,  
Saya yakin teman-teman yang sudah biasa melakukan training untuk membuat sebuah model dalam hal ini adalah klasifikasi dilakukan di local komputer/laptop. Hal itu nggak masalah jika spesifikasi komputer/laptop high end ataupun masih menggunakan dataset yang relative sedikit, masih belum 500 per kelas ke atas. Bagaimana jika dataset yang digunakan lebih dari itu ataupun spesifikasi komputer/laptop tergolong rendah seperti yang saya miliki, hal tersebut bisa diatasi dengan training on cloud punya Google Cloud Platform. 

Sebenarnya artikel yang akan saya tulis masih berhubungan dari yang <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/05/14/tensorflow-custom-object-detection-api-cloud/" target="_blank">sebelumnya</a>, jadi langkah-langkah nanti ada kelanjutan dari yang sebelumnya. Jika temen-temen belum melihat artikel saya sebelumnya, sebaiknya membaca terlebih dahulu. Jadi yang akan kita bahas adalah mengklasifikasi citra bunga(daisy, dandelion, roses, sunflowers, tulips) dengan model yang sebelumnya sudah kita training on cloud memanfaatkan layanannya Google Cloud Platform menggunakan tensorflow.

<blockquote class="wp-block-quote">
  <p>
    Untuk dapat menjalankan artikel ini saya menggunakan python versi 2.7.15, saya mencoba menggunakan python versi 3.6.5 tetapi saya menemukan error dimana-dimana. Sebaiknya temen-temen juga menggunakan python versi 2.7 juga, silakan gunakan virtualenv untuk mempermudah manajemen project yang temen-temen buat.
  </p>
  
  <p>
    Selain kebutuhan di atas Anda juga harus sudah konfigurasi Google Cloud Platform, konfigurasi Cloud SDK, dan mengaktifkan API(Cloud Machine Learning Engine, Compute Engine, dan Cloud Dataflow )
  </p>
</blockquote>

#### Persiapan Dataset

Dataset yang akan kita gunakan adalah dataset bunga, dataset tersebut dapat Anda unduh di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="http://download.tensorflow.org/example_images/flower_photos.tgz" target="_blank">sini</a>, dataset tersebut terdapat 5 kelas yaitu daisy, dandelion, roses, sunflowers, dan tulips dengan masing-masing jumlahnya lebih dari 600 buah. Kemudian Anda juga butuh upload dataset tersebut ke dalam Google Cloud Storage, silakan buat dulu bucket-nya jika Anda belum membuatnya menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>gsutil mb -l us-central1 gs://tf-classification-roses
gsutil mb -l us-central1 gs://tf-classification-flowers-ml</code></pre>

Perintah di atas digunakan untuk membuat bucket dengan region _us-central1_ dengan nama bucket adalah _tf-classification-roses_ dan _tf-classification-flowers-ml._ _tf-classification-roses_ digunakan untuk menyimpan dataset sedangkan _tf-classification-flowers-ml_ digunakan untuk menyimpan model yang akan kita buat, silakan upload dataset menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>gsutil -m cp -r daisy gs://tf-classification-roses/dataset_images</code></pre>

Dengan perintah di atas kita akan upload folder _daisy_ ke dalam Google Cloud Storage yang sebelumnya telah kita buat, jangan lupa menambahkan paramter -m agar proses uploading dilakukan secara thread agar proses berjalan lebih cepat. Upload semua folder dataset yang telah kita download sebelumnya. Sehingga jika dicek menggunakan perintah _gsutills_ hasilnya adalah sebagai berikut

<pre class="wp-block-code"><code>gsutil ls gs://tf-classification-roses/dataset_images</code></pre>

Jika sudah selesai upload di Google Cloud Storage hasilnya adalah sebagai berikut ini

<pre class="wp-block-preformatted">gs://tf-classification-roses/dataset_images/daisy/<br />gs://tf-classification-roses/dataset_images/dandelion/<br />gs://tf-classification-roses/dataset_images/roses/<br />gs://tf-classification-roses/dataset_images/sunflowers/<br />gs://tf-classification-roses/dataset_images/tulips/</pre>

Selanjutnya buatkan kode python seperti di bawah ini, jangan lupa juga untuk paket-paket yang dibutuhkan seperti pandas dan numpy harus diinstall. 

<pre class="wp-block-code"><code>import os
import pandas as pd
import argparse
import numpy as np
from sklearn.model_selection import train_test_split
import random

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--input_folder", required=True, help="Input directory folder")
ap.add_argument("-o", "--output_folder", required=True, help="Output directory folder")
ap.add_argument("-gcs", "--gcs_path", required=True, help="GCS directory folder")
ap.add_argument("-tr", "--train", type=float, default=0.8, help="Value sum of training data")
ap.add_argument("-te", "--test", type=float, default=0.2, help="Value sum of testing data")
args = vars(ap.parse_args())

FOLDERS = args["input_folder"]
OUTPUT = args["output_folder"]
BASE_GCS_PATH = args["gcs_path"]
train_size = args["train"]
test_size = args["test"]

data_array = []
data_folder = []

for folder in sorted(os.listdir(FOLDERS)):
    data_folder.append(folder)
# print(data_folder)
file_names = [os.listdir(os.path.join(FOLDERS, f)) for f in data_folder]
# print(type(file_names))
# [print(len(f)) for f in file_names]
# [print(f) for f in file_names]

file_dict = dict(zip(data_folder, file_names))
# print(type(file_dict))

for key, file_list in file_dict.items():
    # print(key, file_list)
    for file_name in file_list:
        if ".jpg" not in file_name:
            continue
        data_array.append((os.path.join(BASE_GCS_PATH, key, file_name), key))
# print(data_array)
random.shuffle(data_array)

dt = np.array(data_array)

x_train, x_test = train_test_split(dt, test_size=test_size, train_size=train_size)
# print(len(x_train))
# print(len(x_test))

with open(os.path.join(OUTPUT, "labels.txt"), 'w') as f_labels:
    for tr in data_folder:
        f_labels.write(tr + "\n")

dataframe = pd.DataFrame(x_train)
# print(dataframe)
dataframe.to_csv(os.path.join(OUTPUT, "train_set.csv"), index=False, header=False)
dataframe = pd.DataFrame(x_test)
dataframe.to_csv(os.path.join(OUTPUT, "test_set.csv"), index=False, header=False)
dataframe = pd.DataFrame(dt)
dataframe.to_csv(os.path.join(OUTPUT, "all_data.csv"), index=False, header=False)</code></pre>

Sebenarnya kode di atas digunakan untuk menuliskan informasi dataset ke dalam sebuah file, yaitu file \*.txt dan file \*.csv. File \*.txt berisi label atau kelas dari semua dataset yang telah didownload(daisy, dandelion, roses, sunflowers, dan tulips), sedangkan file \*.csv berisi informasi tentang dataset berupa pembagian data training dan evaluasi. Kemudian jalankan kode di atas menggunakan perintah di bawah ini pada terminal Anda

<pre class="wp-block-code"><code>python data_preparation.py -i dataset_images -o dataset -gcs gs://tf-classification-roses -tr 0.9 -te 0.1</code></pre>

Penjelasan dari perintah di atas adalah -i maksudnya adalah lokasi dataset terdapat pada folder _dataset_images_, -o adalah file-file \*.txt dan \*.csv akan disimpan pada folder mana, untuk -gcs adalah folder untuk Google Cloud Storage. Ada paramter lagi yaitu -tr untuk presentase training dan -te untuk presntase evaluasi, jika tidak dimasukan ke dalam paramter secara defaultnya adalah untuk training 80% dan evaluasi 20%. Kemudian upload file-file tersebut ke Google Cloud Storage menggunakan perintah seperti sebelumnya.

<pre class="wp-block-code"><code>gsutil -m cp dataset/*.csv gs://tf-classification-roses/dataset
gsutil -m cp dataset/*.txt gs://tf-classification-roses/dataset</code></pre>

Kemudian cek hasilnya menggunakan perintah _ls_, seharusnya outputnya seperti di bawah ini

<pre class="wp-block-code"><code>gsutil ls gs://tf-classification-roses/dataset</code></pre>

<pre class="wp-block-preformatted">gs://tf-classification-roses/dataset/all_data.csv<br />gs://tf-classification-roses/dataset/eval_set.csv<br />gs://tf-classification-roses/dataset/labels.txt<br />gs://tf-classification-roses/dataset/train_set.csv</pre>

Selanjutnya siapkan parameter-parameter untuk melakukan proses preprocessing dan training menggunakan script di bawah ini

<pre class="wp-block-code"><code>declare -r JOB_ID="flowers_${USER}_$(date +%Y%m%d_%H%M%S)"
declare -r BUCKET="tf-classification-flowers-ml"
declare -r GCS_PATH="${BUCKET}/${USER}/${JOB_ID}"
declare -r DICT_FILE=gs://tf-classification-roses/dataset/labels.txt

declare -r MODEL_NAME=flowers
declare -r VERSION_NAME=v1

echo
echo "Using job id: " $JOB_ID
set -v -e</code></pre>

#### Data Preprocessing Training dan Evaluasi

Untuk memudahkah proses tersebut silakan ketik perintah di bawah ini

<pre class="wp-block-code"><code>git clone https://github.com/GoogleCloudPlatform/cloudml-samples.git
cd flowers</code></pre>

Sebenarnya Google sudah menyiapkan template dan sample ketika kita akan melakukan proses training, kita bisa melakukan custom kode tersebut untuk kebutuhan kita. Sekarang ketika baris perintah di bawah ini pada terminal Anda

<pre class="wp-block-code"><code>python trainer/preprocess.py \
  --input_dict "$DICT_FILE" \
  --input_path "gs://tf-classification-roses/dataset/eval_set.csv" \
  --output_path "${GCS_PATH}/preproc/eval" \
  --cloud</code></pre>

<pre class="wp-block-code"><code>python trainer/preprocess.py \
  --input_dict "$DICT_FILE" \
  --input_path "gs://tf-classification-roses/dataset/train_set.csv" \
  --output_path "${GCS_PATH}/preproc/train" \
  --cloud</code></pre>

Ketika preprocessing dijalankan normalnya outputnya adalah seperti ditampilkan di bawah ini

<pre class="wp-block-preformatted">/Users/od3ng/.virtualenvs/tf-flower-classification-cloud/lib/python2.7/site-packages/tensorflow/contrib/lite/python/<strong>init</strong>.py:26: PendingDeprecationWarning: WARNING: TF Lite has moved from tf.contrib.lite to tf.lite. Please update your imports. This will be a breaking error in TensorFlow version 2.0.<br />   _warnings.warn(WARNING, PendingDeprecationWarning)<br /> /Users/od3ng/.virtualenvs/tf-flower-classification-cloud/lib/python2.7/site-packages/apache_beam/runners/dataflow/dataflow_runner.py:795: DeprecationWarning: options is deprecated since First stable release. References to .options will not be supported<br />   standard_options = transform_node.inputs[0].pipeline.options.view_as(<br /> DEPRECATION: Python 2.7 will reach the end of its life on January 1st, 2020. Please upgrade your Python as Python 2.7 won't be maintained after that date. A future version of pip will drop support for Python 2.7.<br /> Collecting apache-beam==2.8.0<br />   Using cached https://files.pythonhosted.org/packages/81/ea/11cec69a659af024f7f37e928ff533ad5e30b7a519d9982e2bb5b81fcb52/apache-beam-2.8.0.zip<br />   Saved /private/var/folders/tp/mp43kxs13nxcycjyxncxb02c0000gn/T/tmp246MaR/apache-beam-2.8.0.zip<br /> Successfully downloaded apache-beam<br /> DEPRECATION: Python 2.7 will reach the end of its life on January 1st, 2020. Please upgrade your Python as Python 2.7 won't be maintained after that date. A future version of pip will drop support for Python 2.7.<br /> Collecting apache-beam==2.8.0<br />   Using cached https://files.pythonhosted.org/packages/0f/63/ea5453ba656d060936acf41d2ec057f23aafd69649e2129ac66fdda67d48/apache_beam-2.8.0-cp27-cp27mu-manylinux1_x86_64.whl<br />   Saved /private/var/folders/tp/mp43kxs13nxcycjyxncxb02c0000gn/T/tmp246MaR/apache_beam-2.8.0-cp27-cp27mu-manylinux1_x86_64.whl<br /> Successfully downloaded apache-beam</pre>

Untuk memantau proses tersebut Anda juga dapat melakukannya selain dari menu Dataflow pada dashboard Google Cloud Platform, yaitu menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>gcloud dataflow jobs list</code></pre>

#### Training di Cloud

Setelah proses preprocessing selesai dilakukan, yang selanjutnya adalah menjalankan proses training dengan submit job di cloud. Perintah yang perlu Anda jalankan adalah sebagai berikut

<pre class="wp-block-code"><code>gcloud ai-platform jobs submit training "$JOB_ID" \
  --stream-logs \
  --module-name trainer.task \
  --package-path trainer \
  --staging-bucket "$BUCKET" \
  --region us-central1 \
  --runtime-version=1.13 \
  -- \
  --output_path "${GCS_PATH}/training" \
  --eval_data_paths "${GCS_PATH}/preproc/eval*" \
  --train_data_paths "${GCS_PATH}/preproc/train*"</code></pre>

Untuk memantau proses tersebut Anda bisa menggunakan visual dengan tensorboard atau command line

<pre class="wp-block-code"><code>gcloud ai-platform jobs stream-logs "$JOB_NAME"</code></pre>

Jika menggunakan tensorboard adalah sebagai berikut

<pre class="wp-block-code"><code>OUTPUT_PATH = "${GCS_PATH}/training"

tensorboard --logdir=$OUTPUT_PATH</code></pre>

Selanjutnya silakan buka browser Anda, dan ketikkan alamat http://localhost:6006/

#### Deploy model dan Testing Prediction

Untuk dapat digunakan model tersebut langkah selanjutnya kita harus export ke AI Platform, sebenarnya sama halnya ketika kita training secara manual di lokal. Hasil training *.ckpt kemudian ditransofrmasikan ke dalam sebuah Tensorflow graph, perintah yang dapat dilakukan adalah sebagai berikut

<pre class="wp-block-code"><code>gcloud ai-platform models create "$MODEL_NAME" \
  --regions us-central1
gcloud ai-platform versions create "$VERSION_NAME" \
  --model "$MODEL_NAME" \
  --origin "${GCS_PATH}/training/model" \
  --runtime-version=1.13</code></pre>

Selanjutnya silakan Anda mencari image di Google untuk testing model yang telah kita buat, image tersebut kategori berupa daisy, dandelion, roses, sunflowers, ataupun tulips. Kemudian konvert image tersebut ke dalam format json menggunakan perintah di bawah ini, file dadelion.jpeg saya jadikan contoh.

<pre class="wp-block-code"><code>  python -c 'import base64, sys, json; img = base64.b64encode(open(sys.argv[1], "rb").read()); print json.dumps({"key":"0", "image_bytes": {"b64": img}})' dandelion.jpeg &> request.json</code></pre>

Untuk mencoba prediksi dari image yang telah kita konversi ke dalam format json, silakan panggil API menggunakan command di bawah ini

<pre class="wp-block-code"><code>  gcloud ai-platform predict --model ${MODEL_NAME} --json-instances request.json</code></pre>

<pre class="wp-block-preformatted">KEY  PREDICTION  SCORES<br /> 0    1           [1.5986735888873227e-05, 0.9981531500816345, 9.933071396517335e-07, 0.001826173742301762, 1.9648341549327597e-06, 1.8392506717646029e-06]</pre>

Hasil dari perintah predict di atas menandakan bahwa image yang kita request dengan memanggil benar terklasifikasi sebagai dandelion dengan akurasi 99.8%, nilai 1 pada PREDICTION adalah index dari dandelion. Index dari label model yang kita buat adalah daisy &#8211; 0, dandelion &#8211; 1, roses &#8211; 2, sunflowers &#8211; 3, tulips &#8211; 4. Untuk source code bisa anda dapatkan di <a href="https://github.com/0d3ng/tf-training-on-cloud.git" target="_blank" rel="noreferrer noopener" aria-label="github (opens in a new tab)">github</a>.

Demikianlah tulisan saya yang masih sederhana untuk melakukan training data menggunakan Google Cloud Platfom, semoga bermanfaat bagi temen-temen yang masih belajar machine learning seperti saya. Jika Anda saran ataupun kritik, sangat saya harapkan untuk meningkatkan kualitas tulisan di blog ini. 🙂

#### Referensi

  * <https://cloud.google.com/ml-engine/docs/tensorflow/flowers-tutorial>
  * <https://cloud.google.com/ml-engine/docs/tensorflow/regions>
  * <https://cloud.google.com/ml-engine/docs/tensorflow/getting-started-training-prediction>
  * <https://github.com/GoogleCloudPlatform/cloudml-samples/tree/master/cloudml-template>
  * <https://github.com/Krishna-Parekh/signClassify>
  * <https://www.tensorflow.org/hub/tutorials/image_retraining>