---
id: 94
title: Pengenalan Nomor Pelat Mobil dengan OpenCV (Bagian 3)
date: 2019-04-10T10:25:37+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=94
permalink: /pengenalan-nomor-pelat-mobil-dengan-opencv-bagian-3/
wp_last_modified_info:
  - June 14, 2019 @ 7:50 pm
wplmi_shortcode:
  - '[lmt-post-modified-info]'
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
categories:
  - OpenCV
  - Python
tags:
  - anpr
  - confusion matrix
  - deep learning
  - keras
  - opencv
  - plate-recognition
  - python
  - tensorflow
---
Bismillah, Inilah part terakhir artikel saya tentang pengenalan nomor pelat mobil dengan OpenCV. Sebaiknya bagi temen-temen yang belum membaca artikel saya sebelumnya dibaca terlebih dahulu terkait artikel ini agar lebih gampang untuk difahami. Karena lumayan panjang prosesnya akan saya kelompokkan beberapa bagian seperti di bawah ini

  * [Pendahuluan](#pendahuluan)
  * [Persiapan data untuk training](#persiapan-data-untuk-training)
  * [Training data](#training-data)
  * [Testing data](#testing-data)
  * [Referensi](#referensi)

#### Pendahuluan {#pendahuluan}

Untuk melakukan pengenalan nomor pelat mobil kita akan menggunakan deep learning, bagi yang telah belajar neural network tentunya tidak masalah jika belajar deep learning karena dasarnya adalah neural network. Menurut saya bacaan yang menarik terkait deep learning bisa ditemukan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://medium.com/@samuelsena/pengenalan-deep-learning-8fbb7d8028ac" target="_blank">sini</a>. Untuk dapat menggunakan deep learning kita harus menyiapkan dataset untuk dilakukan training karakter 0-9 dan A-Z, nanti akan saya siapkan terkait data training tersebut. Banyak framework yang dapat digunakan untuk di dalamnya terdapat deep learning, salah satunya adalah tensor flow dari <a href="https://www.tensorflow.org/tutorials" target="_blank" rel="noreferrer noopener" aria-label="Google (opens in a new tab)">Google</a>.

#### Persiapan data untuk training {#persiapan-data-untuk-training}

Sebelum melakukan training data, terlebih dahulu kita siapkan data yang akan dilakukan training yaitu data image karakter A-Z dan karakter angka 0-9. Untuk membuat data tersebut bisa menggunakan source code sebelumnya untuk melakukan segmentasi atau jika menginginkan lebih ekstream gunakan image editor untuk dilakukan croping satu persatu. Kemudian selanjutnya gunakan source code di bawah ini untuk proses persiapan untuk training.

<pre class="wp-block-code"><code>import os
import tqdm
import cv2
import random
import numpy as np
import pickle

# Direktori data training
DATADIR = "dataset/training"
dirs = []

training_data = []
width, height = 100, 100

# Looping direktori data training untuk diambil nama karakternya
for char_name in sorted(os.listdir(DATADIR)):
    dirs.append(char_name)

# Looping semua image data training untuk diubah menjadi array
for char_name in dirs:
    path = os.path.join(DATADIR, char_name)
    class_number = dirs.index(char_name)
    for img in tqdm(os.listdir(path)):
        try:
            img_array = cv2.imread(os.path.join(data_dir_testing, car, char_image), cv2.IMREAD_ANYCOLOR)
            new_array = cv2.resize(img_array, (width, height))
            training_data.append([new_array, class_number])
        except Exception as e:
            pass

random.shuffle(training_data)
X = []
Y = []

for feature, label in training_data:
    X.append(feature)
    Y.append(label)

X = np.array(X).reshape(-1, width, height, 1)

# Tulis ke file pickle
pickle_out = open("X.pickle", "wb")
pickle.dump(X, pickle_out)
pickle_out.close()

pickle_out = open("Y.pickle", "wb")
pickle.dump(Y, pickle_out)
pickle_out.close()</code></pre>

Penjelasan kode di atas adalah sebagai berikut ini

  * Import terlebih dahulu beberapa yang paket-paket yang dibutuhkan, ada beberapa paket yang baru misalkan _tqdm_ digunakan untuk meload data diikuti dengan progress bar, _numpy_ merupakan sebuah paket yang digunakan untuk melakukan operasi-operasi matriks atau array serta _pickle_ adalah depedensi untuk menyimpan file untuk model data training.
  * Looping data training yang kelak digunakan untuk melabeli hasil pengenalan. Looping semua file training untuk diubah ke dalam sebuah image array.
  * Variabel X dan variabel Y digunakan untuk menyimpan label dan feature, label berisi karakter A-Z dan 0-9 sedangkan feture berisi data image array masing-masing label tersebut.
  * Terakhir tulis isi variabel X dan variabel Y ke dalam sebuah file pickle. File pickle tersebut nanti akan diload ketika proses training data.

#### Training data {#training-data}

Sama halnya seorang manusia yang baru lahir, dia belum memiliki kecerdasan dan kemampuan otaknya masih belum bisa maksimal. Demikian juga dengan komputer agar cerdas harus dilatih atau ditraining agar bisa mengenali, dalam hal ini mengenali karakter nomor pelat mobil. Berikut ini code yang bisa digunakan untuk melakukan training data. 

<pre class="wp-block-code"><code>import pickle
from keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, ZeroPadding2D
from keras.models import Model
from keras.optimizers import Adam
from keras.utils.np_utils import to_categorical

# Load file pickle
pickle_in = open("X.pickle", "rb")
X = pickle.load(pickle_in)

pickle_in = open("Y.pickle", "rb")
Y = pickle.load(pickle_in)

Y = to_categorical(Y)
X = X / 255.0
width, height = 100, 100

# Input layer
inputs = Input(shape=(width, height, 1))
conv_layer = ZeroPadding2D(padding=(2, 2))(inputs)
conv_layer = Conv2D(16, (5, 5), strides=(1, 1), activation='relu')(conv_layer)
conv_layer = MaxPooling2D((2, 2))(conv_layer)
conv_layer = Conv2D(32, (3, 3), strides=(1, 1), activation='relu')(conv_layer)
conv_layer = Conv2D(32, (3, 3), strides=(1, 1), activation='relu')(conv_layer)
conv_layer = MaxPooling2D((2, 2))(conv_layer)
conv_layer = Conv2D(64, (3, 3), strides=(1, 1), activation='relu')(conv_layer)

flaten = Flatten()(conv_layer)

fc_layer = Dense(256, activation='relu')(flaten)
fc_layer = Dense(64, activation='relu')(fc_layer)

# Output layer
outputs = Dense(34, activation='softmax')(fc_layer)

adam = Adam(lr=0.0001)
model = Model(inputs=inputs, outputs=outputs)
model.compile(optimizer=adam, loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(X, Y, epochs=20, verbose=1)

model.save('anpr.model')</code></pre>

Dengan kode di atas kita akan membuat sebuah model, kode di atas menggunakan deep learning dengan arsitektur _CNN(Convolutional Neural Network)_. Sebenarnya yang saya ketahui perbedaan mendasar arsitektur ini dengan neural network biasa adalah masalah feature extraction, feature merupakan sebuah ciri yang khas yang membedakan antara objek satu dengan objek lainnya. Sebagai contoh karakter A dan karakter B pada pelat kendaraan tentunya memiliki ciri dengan bentuk yang berbeda. Feature extraction yang dimiliki _CNN(Convolutional Neural Network)_ sudah disediakan, kita tinggal mengutak-utik arsitekturnya/parameter yang ada di dalamnya. Sedangkan neural network biasa kita harus mencari sendiri atau dilakukan secara manual untuk mencari feature tersebut. Di bawah ini adalah bagian kode yang digunakan untuk membuat atau membangun sebuah feature tersebut. 

<pre class="wp-block-code"><code>conv_layer = ZeroPadding2D(padding=(2, 2))(inputs)
conv_layer = Conv2D(16, (5, 5), strides=(1, 1), activation='relu')(conv_layer)
conv_layer = MaxPooling2D((2, 2))(conv_layer)
conv_layer = Conv2D(32, (3, 3), strides=(1, 1), activation='relu')(conv_layer)
conv_layer = Conv2D(32, (3, 3), strides=(1, 1), activation='relu')(conv_layer)
conv_layer = MaxPooling2D((2, 2))(conv_layer)
conv_layer = Conv2D(64, (3, 3), strides=(1, 1), activation='relu')(conv_layer)</code></pre>

Untuk lebih jelasnya terkait penjelasan potongan kode di atas bisa membaca dokumentasinya _tensor flow dan keras_ atau ada bacaan yang menarik di <a rel="noreferrer noopener" aria-label="medium (opens in a new tab)" href="https://medium.com/@samuelsena/pengenalan-deep-learning-part-7-convolutional-neural-network-cnn-b003b477dc94" target="_blank">medium</a>. Seperti yang sudah saya sampaikan bahwa arsitekturnya atau parameternya tidak harus sama seperti di atas, bisa dicoba yang paling optimal dengan mencoba-coba sesuai dengan data yang temen-temen punya. Selain itu untuk melakukan training data jika datanya banyak membutuhkan waktu yang lama, sedangkan untuk deep learning sendiri pada banyak contoh kasus untuk image datanya ribuan. Sangat disarankan menggunakan komputer yang memiliki spesifikasi tinggi, minimal ada GPU-nya.

#### Testing data {#testing-data}

Kita sudah berhasil membuat sebuah model yang siap digunakan untuk melakukan testing, testing merupakan sebuah proses yang digunakan untuk menguji model yang telah kita buat. Jika hasilnya masih belum sesuai yang diharapkan berarti model yang kita buat masih jelek, untuk mengukur model tersebut bisa menggunakan akurasi atau jika yang lebih komplet menggunakan _confusion matrix_. Sebenarnya untuk menguji atau mengetahui model yang kita buat _tensor flow_ sudah ada tool yang di dalamnya, yaitu menggunakan _tensor board._

<pre class="wp-block-code"><code>import os
import cv2
import tensorflow as tf
import numpy as np

data_dir_training = "dataset/training-bak"
data_dir_testing = "dataset/testing"
dirs = []
width, height = 100, 100

model = tf.keras.models.load_model("anpr.model")

for char_name in sorted(os.listdir(data_dir_training)):
    dirs.append(char_name)

for car in sorted(os.listdir(data_dir_testing)):
    temp = ""
    for char_img in sorted(os.listdir(os.path.join(data_dir_testing, car))):
        img_array = cv2.imread(os.path.join(data_dir_testing, car, char_img), cv2.IMREAD_ANYCOLOR)
        new_array = cv2.resize(img_array, (width, height))
        new_array = np.array(new_array).reshape(-1, width, height, 1)

        new_array = new_array / 255.0

        prediction = model.predict(new_array)
        temp += dirs[np.argmax(prediction[0])]

    print("folder name: {} no: {}".format(car, temp))</code></pre>

Contoh kode di atas adalah untuk melakukan testing, alurnya adalah membaca direktori hasil segmentasi nomor pelat mobil. Hasilnya memang tidak 100% benar, masih ada kesalahan atau kekeliruan ketika melakukan prediksi. Salah satu faktornya adalah pre-processing yang masih belum baik, kemudian juga dataset untuk melakukan training karakter masih sangat minim. Berikut ini merupakan kronologi atau perubahan-perubahan dari proses pengenalan pelat

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/car6-1-e1554679360862.jpg" alt="" class="wp-image-70" /><figcaption>Gambar masukan</figcaption></figure>
</div>

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/result.jpg" alt="" class="wp-image-77" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/result.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/result-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Hasil deteksi pelat</figcaption></figure>
</div>

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/segmentasi-result.jpg" alt="" class="wp-image-89" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-result.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-result-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Hasil segmentasi</figcaption></figure>
</div>

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/Screen-Shot-2019-04-10-at-16.32.57-e1554904746302.png" alt="" class="wp-image-96" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/Screen-Shot-2019-04-10-at-16.32.57-e1554904746302.png 376w, https://www.sinaungoding.com/wp-content/uploads/2019/04/Screen-Shot-2019-04-10-at-16.32.57-e1554904746302-300x110.png 300w" sizes="(max-width: 376px) 100vw, 376px" /><figcaption>Hasil pengenalan</figcaption></figure>
</div>

Dari hasil akhir gambar di atas memang menunjukkan bahwa belum 100% berhasil mengenali setiap karakter, huruf B dikenali sebagai angka 8, huruf A dikenali sebagai angka 4, dan huruf N dikenali sebagai huruf H. Selain itu juga, urutan karakter juga masih salah yang seharusnya AB 1267 N tetapi tersegmentasi BA61N27. Ada beberapa catatan yang perlu diimprovement terkait dengan data training, hiper parameter yang perlu disesuaikan di dalam arsitektur deep learning yang telah kita buat, dan sorting hasil segmentasi. Tapi pointnya adalah temen-temen semoga bisa memahami dengan contoh di atas yang telah dibuat.

Demikianlah artikel yang masih sangat sederhana untuk menerapkan OpenCV dan deep learning, semoga temen-temen punya gambaran dan _insight_. Happy OpenCV&#8230;:)

#### Referensi {#referensi}

  * <https://medium.com/@samuelsena/pengenalan-deep-learning-8fbb7d8028ac>
  * <https://www.tensorflow.org/overview/>