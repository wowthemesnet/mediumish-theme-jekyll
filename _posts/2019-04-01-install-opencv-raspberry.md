---
id: 40
title: Install OpenCV Raspberry
date: 2019-04-01T10:17:03+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=40
permalink: /install-opencv-raspberry/
wp_last_modified_info:
  - June 14, 2019 @ 8:13 pm
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
  - opencv
  - virtualenv
  - virtualenvwrapper
---
Bismillah,  
Seperti pernyataan sebelumnya yang saya sampaikan pada <a rel="noreferrer noopener" aria-label="postingan lalu (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/03/31/memasang-modul-kamera-di-raspberry/" target="_blank">postingan lalu</a> bahwa saya akan mulai melangkah lebih jauh untuk memanfaatkan raspberry pi sebagai perangkat _computer vision_. Agara dapat digunakan kita membutuhkan paket atau framework untuk _computer vision_, salah satu yang terkenal adalah OpenCV(Open Source Computer Vision Library). Ditulis menggunakan bahasa pemrograman C/C++ dan dapat di-wrap oleh bahasa pemrograman java ataupun python yang dapat berjalan di multi platform seperti Windows, Linux, Mac OS, iOS dan Android. _Table of content_ yang akan saya sampaikan adalah sebagai berikut

  * [Install OpenCV](#install-opencv)
  * [Ujicoba OpenCV](#ujicoba-opencv)
  * [Penutup](#penutup)
  * [Referensi](#referensi)

#### Install OpenCV {#install-opencv}

Untuk proses installasi OpenCV akan kita coba untuk dari source, mengapa demikian karena raspberry pi merupakan menggunakan arsitektur yang berbeda dari komputer pada umumnya. Beberapa perintah yang perlu dijalankan adalah sebagai berikut

<pre class="wp-block-code"><code>sudo apt-get purge wolfram-engine
sudo apt-get purge libreoffice*
sudo apt-get clean
sudo apt-get autoremove</code></pre>

Perintah di atas digunakan untuk menghapus beberapa paket yang tidak digunakan pada raspberry, salah satu adalah libreoffice. Lumayan bisa menghemat space MicroSD hampir 1 GB, setelah itu coba cek disk usage Anda harusnya lebih besar dari yang sebelumnya menggunakan command _df -h_

<pre class="wp-block-code"><code>sudo apt-get update && sudo apt-get upgrade
sudo apt-get install build-essential cmake unzip pkg-config
sudo apt-get install libjpeg-dev libpng-dev libtiff-dev
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
sudo apt-get install libxvidcore-dev libx264-dev
sudo apt-get install libgtk-3-dev
sudo apt-get install libcanberra-gtk*
sudo apt-get install libatlas-base-dev gfortran
sudo apt-get install python3-dev</code></pre>

Perintah di atas adalah depedency atau paket-paket yang dibutuhkan ketika kita ingin memasang OpenCV pada raspberry. Yang selanjutnya download source OpenCV versi terbaru menggunakan command di bawah ini

<pre class="wp-block-code"><code>wget -O opencv.zip https://github.com/opencv/opencv/archive/4.0.1.zip
wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/4.0.1.zip
unzip opencv.zip
unzip opencv_contrib.zip
mv opencv-4.0.1 opencv
mv opencv_contrib-4.0.1 opencv_contrib</code></pre>

OpenCV versi yang terakhir 4.0.1 ketika saya menulis artikel ini, Anda bisa mengecek versi yang terakhir pada situs resminya di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://opencv.org/releases.html" target="_blank">sini</a>. Ada 2 source yang akan kita download, yaitu _opencv_ dan _opencv_contrib_. _opencv_contrib_ berisi modul-modul tambahan dari opencv, versi yang Anda download harus sama. Selanjutnya kita membutuhkan virtualenv dan virtualenvwrapper, fungsi tool tersebut digunakan untuk manajemen projek yang kelak akan kita buat menggunakan python tentunya, untuk lebih jelasnya bisa mengunjungi blog <a rel="noreferrer noopener" aria-label="ini (opens in a new tab)" href="https://www.petanikode.com/python-virtualenv/" target="_blank">ini</a>. Perintah yang dapat digunakan adalah di bawah ini

<pre class="wp-block-code"><code>sudo pip3 install virtualenv virtualenvwrapper</code></pre>

Setelah selesai kemudian kita perlu mengkonfigurasi _virtualenv_ dan _virtualenvwrapper_ agar setiap kita login ke raspberry dengan user tersebut mengeksekusi script _virtualenvwrapper_, tambahkan beberapa baris di bawah ini pada file _.profile_ dalam home direktori menggunakan editor kesayangan Anda(vi, vim, atau nano)

<pre class="wp-block-code"><code># virtualenv and virtualenvwrapper
export WORKON_HOME=$HOME/.virtualenvs
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
source /usr/local/bin/virtualenvwrapper.sh</code></pre>

Atau tanpa menggunakan editor, jalankan perintah dibawah ini pada terminal baris demi baris. Silakan pilih yang paling mudah menurut Anda

<pre class="wp-block-code"><code>echo -e "\n# virtualenv and virtualenvwrapper" >> ~/.profile
echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.profile
echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3" >> ~/.profile
echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.profile</code></pre>

Untuk memberikan perubahan pada file _.profile_ jangan lupa menjalankan perintah di bawah ini

<pre class="wp-block-code"><code>source ~/.profile</code></pre>

Selanjutnya kita coba _virtualenvwrapper_ tersebut, jalankan perintah di bawah ini 

<pre class="wp-block-code"><code>mkvirtualenv cv -p python3
workon cv</code></pre>

Outputnya harusnya menjadi seperti di bawah ini

<pre class="wp-block-preformatted">(cv) pi@raspberrypi:~/Downloads $</pre>

Dengan menjalankan perintah di atas seharusnya nanti tampilan terminal Anda menjadi , kita akan membuat _virtualenv_ dengan nama _cv_ menggunakan python3 untuk interpreternya dan aktif pada _virtualenv cv_. Untuk lebih jelaskan silakan baca manualnya atau bisa lihat di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://virtualenvwrapper.readthedocs.io/en/latest/command_ref.html" target="_blank">sini</a>. Selanjutnya silakan masuk ke direktori _opencv_ dan buat folder _build_ serta masuk direktori tersebut, kemudian jalankan command _cmake_ seperti berikut

<pre class="wp-block-code"><code>cd opencv
mkdir build
$ cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
    -D ENABLE_NEON=ON \
    -D ENABLE_VFPV3=ON \
    -D BUILD_TESTS=OFF \
    -D OPENCV_ENABLE_NONFREE=ON \
    -D INSTALL_PYTHON_EXAMPLES=OFF \
    -D BUILD_EXAMPLES=OFF ..</code></pre>

Beberapa baris terakhir seharusnya outputnya seperti di bawah ini, pastikan interpreter _python3_ dan _numpy_ berada di dalam direktori _.virtualenvs_

<pre class="wp-block-preformatted">--   Python 3:<br /> --     Interpreter:                 /home/pi/.virtualenvs/cv/bin/python3 (ver 3.5.3)<br /> --     Libraries:                   /usr/lib/arm-linux-gnueabihf/libpython3.5m.so (ver 3.5.3)<br /> --     numpy:                       /home/pi/.virtualenvs/cv/lib/python3.5/site-packages/numpy/core/include (ver 1.16.2)<br /> --     install path:                lib/python3.5/site-packages/cv2/python-3.5</pre>

Karena proses compile membutuhkan waktu yang cukup lama dan memakan resource yang besar sehingga membutuhkan optimize pada swap raspberry pi Anda dengan mengedit file _/etc/dphys-swapfile_, silakan gunakan editor file kesayangan Anda. Jalankan perintah di bawah ini terkait hal tersebut

<pre class="wp-block-code"><code>sudo nano /etc/dphys-swapfile</code></pre>

<pre class="wp-block-preformatted"># set size to absolute value, leaving empty (default) then uses computed value<br /># you most likely don't want this, unless you have an special disk situation<br />#CONF_SWAPSIZE=100<br /> CONF_SWAPSIZE=2048</pre>

<pre class="wp-block-code"><code>sudo /etc/init.d/dphys-swapfile stop
sudo /etc/init.d/dphys-swapfile start
make -j4</code></pre>

Setelah lama menunggu proses compile beberapa jam selanjutnya jalan perintah di bawah ini dan **jangan lupa untuk mengembalikan konfigurasi swape seperti konfigurasi di awal swap size 100Mb, kemudian restart servicenya**

<pre class="wp-block-code"><code>sudo make install
sudo ldconfig</code></pre>

Langkah terakhir adalah dengan membuat simbolik link opencv yang telah kita compile ke dalam virtualenvs menggunakan perintah di bawah ini, perhatikan baik-baik untuk lokasi library OpenCV hasil kita compile.

<pre class="wp-block-code"><code>cd ~/.virtualenvs/cv/lib/python3.5/site-packages/
ln -s /usr/local/lib/python3.5/site-packages/cv2/python-3.5/cv2.cpython-35m-arm-linux-gnueabihf.so cv2.so</code></pre>

#### Ujicoba OpenCV {#ujicoba-opencv}

Untuk mencoba hasil installasi opencv yang cukup memakan waktu lama, selanjutnya kita jalankan script di bawah ini. Jika berhasil seharusnya nanti muncul versi dari OpenCV yang kita install

<pre class="wp-block-code"><code>workon cv
python
>>> import cv2
>>> cv.__version__
'4.0.1'
>>> exit()</code></pre>

#### Penutup {#penutup}

Demikianlah langkah-langkah yang cukup menguras waktu, semoga tulisan saya bermanfaat bagi temen-temen yang ingin memulai belajar OpenCV untuk tugas kampus ataupun project komersial. Pada tulisan yang akan datang akan saya coba membuat program sederhana menggunakan OpenCV untuk mendeteksi wajah menggunakan Haar. Ditunggu ya&#8230;

#### Referensi {#referensi}

  * <https://opencv.org/>
  * <https://www.pyimagesearch.com/2017/09/04/raspbian-stretch-install-opencv-3-python-on-your-raspberry-pi/>
  * <https://www.learnopencv.com/install-opencv-4-on-raspberry-pi/>
  * <https://realpython.com/python-virtual-environments-a-primer/>
  * <https://virtualenvwrapper.readthedocs.io/en/latest/install.html>