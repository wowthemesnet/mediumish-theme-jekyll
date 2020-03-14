---
id: 316
title: Installasi Neural Compute Stick 2 Raspberry Pi 3 B+
date: 2019-06-21T22:07:24+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=316
permalink: /installasi-neural-compute-stick-2-raspberry-pi/
wp_last_modified_info:
  - June 28, 2019 @ 1:59 pm
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
  - raspberry-pi
  - vpu
---
<figure class="wp-block-image"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/OpenVino-1-e1561109774616-1024x456.jpg" alt="Persiapan peralatan" class="wp-image-318" /><figcaption>Neural Compute Stick 2</figcaption></figure> 

Bismillah,  
Neural Computer Stick atau yang biasa disingkat NCS merupakan perangkat usb keluaran intel yang bertujuan untuk mempercepat proses deploy dan prototype aplikasi Deep Neural Network(DNN), intel mengatakan di dalam perangkat ini dibenamkan sebuah Intel® Movidius™ Myriad™ X VPU. Versi NCS saat ini 2, dikabarkan 8x lebih cepat dari pendahulunya Intel® Movidius™ Neural Compute Stick (NCS).

<blockquote class="wp-block-quote">
  <p>
    Prototype and deploy deep neural network (DNN) applications smarter and more efficiently with a tiny, fanless, deep learning development kit designed to enable a new generation of intelligent devices.<br />The new, improved Intel® Neural Compute Stick 2 (Intel® NCS 2) features Intel’s latest high-performance vision processing unit: the Intel® Movidius™ Myriad™ X VPU. With more compute cores and a dedicated hardware accelerator for deep neural network inference, the Intel® NCS 2 delivers up to eight times the performance boost compared to the previous generation Intel® Movidius™ Neural Compute Stick (NCS)
  </p>
  
  <cite>Diambil dari website <a rel="noreferrer noopener" aria-label="intel (opens in a new tab)" href="https://software.intel.com/en-us/neural-compute-stick" target="_blank">Intel</a></cite>
</blockquote>

Selain Intel mengeluarkan perangkat untuk kebutuhan computer vision, Intel juga menyediakan platformnya juga yaitu OpenVINO. OpenVINO yang merupakan kepanjangan dari **O**pen&nbsp;**V**isual&nbsp;**I**nferencing and&nbsp;**N**eural Network&nbsp;**O**ptimization didesign khusus untuk mempercepat dalam proses inferencing seperti classification dan object detection. Beberapa pokok bahasan yang akan dibahas adalah sebagai berikut

  * [Test Perangkat Neural Compute Stick 2](#Test-Perangkat-Neural-Compute-Stick-2)
  * [Installasi OpenVINO Toolkit Raspberry](#Installasi-OpenVINO-Toolkit-Raspberry)
  * [Test Installasi OpenVINO](#Test-Installasi-OpenVINO)
  * [Menjalankan Inference Engine Face Detection OpenCV](#Menjalankan-Inference-Engine-Face-Detection-OpenCV)
  * [References](#References)

#### Test Perangkat Neural Compute Stick 2 {#Test-Perangkat-Neural-Compute-Stick-2}

Sebelumnya menggunakan NCS ke penggunaan yang lebih komplek, kita testing terlebih dahulu perangkat tersebut. Beberapa paket yang dibutuhkan adalah sebagai berikut

<pre class="wp-block-code"><code>sudo apt-get install -y libusb-1.0-0-dev libprotobuf-dev libleveldb-dev libsnappy-dev libopencv-dev libhdf5-serial-dev protobuf-compiler libatlas-base-dev git automake byacc lsb-release cmake libgflags-dev libgoogle-glog-dev liblmdb-dev swig3.0 graphviz libxslt-dev libxml2-dev gfortran python3-dev python-pip python3-pip python3-setuptools python3-markdown python3-pillow python3-yaml python3-pygraphviz python3-h5py python3-nose python3-lxml python3-matplotlib python3-numpy python3-protobuf python3-dateutil python3-skimage python3-scipy python3-six python3-networkx python3-tk</code></pre>

Selanjutnya kita perlu download NCSDK ke dalam raspberry, ketikkan perintah di bawah ini pada terminal Anda

<pre class="wp-block-code"><code>cd ~
mkdir workspace
cd workspace
git clone https://github.com/movidius/ncsdk</code></pre>

Kemudian kita butuh compile dan install NCSDK API framework, gunakan perintah di bawah ini untuk melakukan hal tersebut

<pre class="wp-block-code"><code>cd ~/workspace/ncsdk/api/src
make</code></pre>

Ketika dijalankan output yang dihasilkan kurang lebih seperti di bawah ini, yang menandakan paket-paket yang dibutuhkan sudah berhasil dipasang

<pre class="wp-block-preformatted">cc -O2 -Wall -pthread -fPIC -MMD -MP -I. -I../include -I/usr/include/libusb-1.0  -c usb_boot.c -o obj-armv7l/usb_boot.o
cc -O2 -Wall -pthread -fPIC -MMD -MP -I. -I../include -I/usr/include/libusb-1.0  -c usb_link_vsc.c -o obj-armv7l/usb_link_vsc.o
cc -O2 -Wall -pthread -fPIC -MMD -MP -I. -I../include -I/usr/include/libusb-1.0  -c mvnc_api.c -o obj-armv7l/mvnc_api.o
cc -shared obj-armv7l/usb_boot.o obj-armv7l/usb_link_vsc.o obj-armv7l/mvnc_api.o -o obj-armv7l/libmvnc.so.0 -lpthread -lusb-1.0 -ldl
ln -fs obj-armv7l/libmvnc.so.0 libmvnc.so
ln -fs obj-armv7l/libmvnc.so.0 libmvnc.so.0
NCSDK FW successfully installed</pre>

Untuk melakukan installasi jalankan perintah di bawah ini

<pre class="wp-block-code"><code>sudo make install</code></pre>

Output pada terminal Anda normalnya adalah di bawah ini

<pre class="wp-block-preformatted">NCSDK FW successfully installed
mkdir -p /usr/local/include/
mkdir -p /usr/local/lib/
cp obj-armv7l/libmvnc.so.0 /usr/local/lib/
ln -fs libmvnc.so.0 /usr/local/lib/libmvnc.so
cp ../include/*.h /usr/local/include/
mkdir -p /usr/local/lib/mvnc
cp mvnc/MvNCAPI.mvcmd /usr/local/lib/mvnc/
mkdir -p /etc/udev/rules.d/
cp 97-usbboot.rules /etc/udev/rules.d/
mkdir -p /usr/local/lib/python3.5/dist-packages
mkdir -p /usr/local/lib/python2.7/dist-packages
cp -r ../python/mvnc /usr/local/lib/python3.5/dist-packages/
cp -r ../python/mvnc /usr/local/lib/python2.7/dist-packages/
udevadm control --reload-rules
udevadm trigger
ldconfig</pre>

Langkah yang terakhir setelah paket-paket berhasil diinstal, selanjutnya kita akan mencobanya menggunakan contoh kode dari NC App Zoo. Ketikkan baris perintah di bawah ini pada terminal

<pre class="wp-block-code"><code>cd ~/workspace
git clone https://github.com/movidius/ncappzoo
cd ncappzoo/apps/hello_ncs_py
python3 hello_ncs.py</code></pre>

Dan ternyata output yang dihasilkan adalah `"Error - no NCS devices detected, verify an NCS device is connected."`, harusnya jika normal adalah sebagai berikut

<pre class="wp-block-preformatted">Hello NCS! Device opened normally. 
Goodbye NCS! Device closed normally. 
NCS device working.</pre>

Setelah baca-baca forum movidius ternyata raspberry pi 3+ belum disupport untuk NCS 2 menggunakan NCSDK.

<blockquote class="wp-block-quote">
  <p>
    I will tell you the same thing again.<br />&#8220;Neural Compute Stick 2&#8221; = &#8220;NCS2&#8221; = &#8220;MvNCAPI-ma2480.mvcmd&#8221; = Intel does not support NCS2 with NCSDK.<br />&#8220;Neural Compute Stick&#8221; = &#8220;NCS1&#8221; = &#8220;MvNCAPI-ma2450.mvcmd&#8221; = It is officially supported.<br />In order to use &#8220;Neural Compute Stick 2&#8221;, you need to use OpenVINO instead of NCSDK.<br />And, OpenVINO does not work with ARM processors.<br />That is, &#8220;Neural Compute Stick 2&#8221; can not be used with &#8220;RaspberryPi 3 B+&#8221;.<br />OpenVINO runs only on &#8220;x86/64&#8221; series Intel processors.<br />Intel&#8217;s engineers have officially replied that they are fully aware of the need for OpenVINO&#8217;s support for ARM processors.<br />We expect to have to wait for several months to a year.
  </p>
  
  <cite>Salah satu diskusi dari forum movidius [<a rel="noreferrer noopener" aria-label="source (opens in a new tab)" href="https://ncsforum.movidius.com/discussion/comment/4202" target="_blank">source</a>]</cite>
</blockquote>

Dari beberapa pembahasan di atas, NCSDK hanya disupport oleh NCS1 sedangkan NCS2 belum disupport. Kemudian yang dapat dilakukan adalah mencoba menggunakan platform OpenVINO.

#### Installasi OpenVINO Toolkit Raspberry {#Installasi-OpenVINO-Toolkit-Raspberry}

Beberapa platform yang didukung oleh OpenVINO salah satunya adalah raspberry, silakan download terlebih dahulu OpenVINO toolkitnya di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://software.intel.com/en-us/openvino-toolkit/choose-download" target="_blank">sini</a>. Selanjutnya ketikkan perintah di bawah ini pada terminal 

<pre class="wp-block-code"><code>cd ~
mkdir openvino
cd openvino
tar -xf l_openvino_toolkit_raspbi_p_2019.1.144.tgz
$ nano openvino/inference_engine_vpu_arm/bin/setupvars.sh</code></pre>

Kemudian hal yang perlu dilakukan adalah memodifikasi file konfigurasi `setupvars.sh` agar mengarahkan ke direktori installasi OpenVINO toolkit, ketik baris perintah di bawah ini

<pre class="wp-block-code"><code>sudo sed -i "s|&lt;INSTALLDIR>|~/openvino/inference_engine_vpu_arm|" ~/openvino/inference_engine_vpu_arm/bin/setupvars.sh</code></pre>

Tool selanjutnya yang dibutuhkan adalah build tool, untuk build contoh aplikasi yang disertakan oleh OpenVINO toolkit. Jika pada raspberry sudah terinstall, langkah ini boleh dilewati.

<pre class="wp-block-code"><code>sudo apt install cmake</code></pre>

Untuk memberikan pengaruh karena file setupvars.sh sudah terjadi perubahan perlu menjalankan perintah di bawah ini

<pre class="wp-block-code"><code>source ~/openvino/inference_engine_vpu_arm/bin/setupvars.sh</code></pre>

Jika tidak ada yang error konfigurasi yang dibuat, pada layar terminal akan menampilkan pesan seperti berikut

<pre class="wp-block-preformatted">[setupvars.sh] OpenVINO environment initialized</pre>

Kemudian agar setiap Anda login dan membuka terminal baru perlu melakukan konfigurasi automatis OpenVINO toolkit, langkah yang dapat dilakukan dengan menambahkan baris perintah pada file `~/.bashrc`

<pre class="wp-block-code"><code>echo "source ~/openvino/inference_engine_vpu_arm/bin/setupvars.sh" >> ~/.bashrc</code></pre>

Konfigurasi yang terakhir adalah terkait dengan rule pada NCS, jalankan beberapa baris perintah di bawah ini pada terminal

<pre class="wp-block-code"><code>cd ~/openvino
sudo usermod -a -G users "$(whoami)"
sh inference_engine_vpu_arm/install_dependencies/install_NCS_udev_rules.sh</code></pre>

Output yang tertampil pada layar terminal seharusnya seperti ditunjukkan seperti di bawah ini

<pre class="wp-block-preformatted">Update udev rules so that the toolkit can communicate with your neural compute stick
[install_NCS_udev_rules.sh] udev rules installed</pre>

Sebelum melakukan percobaan untuk contoh aplikasi yang terdapat pada OpenVINO toolkit, kita perlu build dulu agar nanti contoh aplikasi bisa dijalan sebagaimana mestinya. Jalankan perintah di bawah ini

<pre class="wp-block-code"><code>mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_FLAGS="-march=armv7-a" /home/pi/openvino/inference_engine_vpu_arm/deployment_tools/inference_engine/samples</code></pre>

Jika semuanya normal sebagaian output yang dihasilkan adalah sebagai berikut

<pre class="wp-block-preformatted">-- The C compiler identification is GNU 6.3.0
-- The CXX compiler identification is GNU 6.3.0
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
...
...
...
-- Found Threads: TRUE
-- Configuring done
-- Generating done
-- Build files have been written to: /home/pi/openvino/build</pre>

Langkah terakhir yang dipersiapkan adalah dengan compile salah contoh yang akan digunakan, misalnya adalah `object_detection_sample_ssd`.

<pre class="wp-block-code"><code>make -j2 object_detection_sample_ssd</code></pre>

Output yang dihasilkan adalah sebagai berikut, jika misalkan terdapat warning bukan error nggak masalah artinya diabaikan saja. Jika sudah selesai outputnya akan menunjukkan proses sampai 100% seperti ditunjukkan di bawah ini

<pre class="wp-block-preformatted">Scanning dependencies of target gflags_nothreads_static
Scanning dependencies of target ie_cpu_extension
[  3%] Building CXX object thirdparty/gflags/CMakeFiles/gflags_nothreads_static.dir/src/gflags.cc.o
[  6%] Building CXX object ie_cpu_extension/CMakeFiles/ie_cpu_extension.dir/ext_argmax.cpp.o
[ 10%] Building CXX object ie_cpu_extension/CMakeFiles/ie_cpu_extension.dir/ext_base.cpp.o
[ 13%] Building CXX object thirdparty/gflags/CMakeFiles/gflags_nothreads_static.dir/src/gflags_reporting.cc.o
[ 13%] Building CXX object ie_cpu_extension/CMakeFiles/ie_cpu_extension.dir/ext_ctc_greedy.cpp.o
[ 13%] Building CXX object thirdparty/gflags/CMakeFiles/gflags_nothreads_static.dir/src/gflags_completions.cc.o
...
...
...
[100%] Linking CXX executable ../armv7l/Release/object_detection_sample_ssd
[100%] Built target object_detection_sample_ssd</pre>

#### Test Installasi OpenVINO {#Test-Installasi-OpenVINO}

Ujicoba yang akan dilakukan adalah untuk mendeteksi wajah pada seseorang, beberapa yang dibutuhkan adalah sebuah model pre-trained. Silakan ketikkan baris perintah di bawah ini untuk melakukan proses download, format model inference yang lain dapat Anda dapatkan di <a href="https://download.01.org/opencv/2019/open_model_zoo/R1/models_bin/" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

<pre class="wp-block-code"><code>wget --no-check-certificate https://download.01.org/opencv/2019/open_model_zoo/R1/models_bin/face-detection-adas-0001/FP16/face-detection-adas-0001.bin
wget --no-check-certificate https://download.01.org/opencv/2019/open_model_zoo/R1/models_bin/face-detection-adas-0001/FP16/face-detection-adas-0001.xml</code></pre>

Selajutnya siapkan dataset yang akan dilakukan ujicoba, kemudian dapat menjalankan perintah di bawah ini. Dataset yang digunakan dalam contoh adalah sebagai berikut

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/OpenVino-3.jpeg" alt="Input gambar" class="wp-image-373" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/OpenVino-3.jpeg 474w, https://www.sinaungoding.com/wp-content/uploads/2019/06/OpenVino-3-300x184.jpeg 300w" sizes="(max-width: 474px) 100vw, 474px" /><figcaption>Input gambar</figcaption></figure>
</div>

<pre class="wp-block-code"><code>./armv7l/Release/object_detection_sample_ssd -m face-detection-adas-0001.xml -d MYRIAD -i linux-torvald.jpeg</code></pre>

Ketika dijalankan output yang dapat ditampilkan pada terminal seharusnya seperti di bawah ini

<pre class="wp-block-preformatted">[ INFO ] InferenceEngine:
        API version ………… 1.6
        Build ……………… 23780
Parsing input parameters
[ INFO ] Files were added: 1
[ INFO ]     linux-torvald.jpeg
[ INFO ] Loading plugin
        API version ............ 1.6 
        Build .................. 23780 
        Description ....... myriadPlugin
[ INFO ] Loading network files:
     face-detection-adas-0001.xml
     face-detection-adas-0001.bin
...
...
...
[122,1] element, prob = 0.0258789    (45,22)-(60,40) batch id : 0
[ INFO ] Image out_0.bmp created!
total inference time: 108.278
Average running time of one iteration: 108.278 ms
Throughput: 9.2355 FPS
[ INFO ] Execution successful</pre>

File `linux-torvald.jpeg` silakan disesuaikan, fungsi perintah tersebut untuk melakukan deteksi sebuah wajah dari sebuah citra gambar seseorang. Selanjutnya dalam direktori yang sama akan menghasilkan file `out_0.bmp`, jika dilihat gambar tersebut pada bagian wajah ada sebuah persegi berwarna ungu. Kira-kira gambar yang dihasilkan adalah sebagai berikut

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/OpenVino-2.png" alt="Hasil face detection OpenVINO" class="wp-image-331" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/OpenVino-2.png 474w, https://www.sinaungoding.com/wp-content/uploads/2019/06/OpenVino-2-300x184.png 300w" sizes="(max-width: 474px) 100vw, 474px" /><figcaption>Hasil face detection OpenVINO</figcaption></figure>
</div>

#### Menjalankan Inference Engine Face Detection OpenCV {#Menjalankan-Inference-Engine-Face-Detection-OpenCV}

Jika pada contoh yang sebelumnya menggunakan C++, selanjutnya dicontohkan menggunakan OpenCV. Beberapa hal yang perlu disiapkan sama dengan contoh yang sebelumnya yaitu model pre-trained, `file face-detection-adas-0001.bin` dan `face-detection-adas-0001.xml`. Data yang akan ditest adalah data yang masih sama ketika menggunakan C++, buatlah kode python seperti berikut ini. Saya sarankan menggunakan virtualenv, install `opencv-python` menggunakan perintah pip jika belum ada paket tersebut.

<pre class="wp-block-code"><code>import cv2 as cv
# Load the model.
net = cv.dnn.readNet('face-detection-adas-0001.xml',
                     'face-detection-adas-0001.bin')
# Specify target device.
net.setPreferableTarget(cv.dnn.DNN_TARGET_MYRIAD)
# Read an image.
frame = cv.imread('linux-torvald.jpeg')
# Prepare input blob and perform an inference.
blob = cv.dnn.blobFromImage(frame, size=(672, 384), ddepth=cv.CV_8U)
net.setInput(blob)
out = net.forward()
# Draw detected faces on the frame.
for detection in out.reshape(-1, 7):
    confidence = float(detection[2])
    xmin = int(detection[3] * frame.shape[1])
    ymin = int(detection[4] * frame.shape[0])
    xmax = int(detection[5] * frame.shape[1])
    ymax = int(detection[6] * frame.shape[0])
    if confidence > 0.5:
        cv.rectangle(frame, (xmin, ymin), (xmax, ymax), color=(0, 255, 0))
# Save the frame to an image file.
cv.imwrite('out.png', frame)</code></pre>

Path file \*.bin dan \*.xml serta data yang akan ditest silakan disesuaikan pada path raspberry Anda. Seharusnya jika semuanya normal akan terbentuk file `out.png`, gambar tersebut pada bagian wajah akan ditandai dengan kotak berwarna hijau. `cv.dnn.DNN_TARGET_MYRIAD` menandakan bahwa ketika menjalankan script memanfaatkan perangkat Neural Compute Stick 2. Kebutuhan-kebutuhan di atas dapat didapatkan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/face-detection-vino.git" target="_blank">sini</a>.

<blockquote class="wp-block-quote">
  <p>
    Silakan Neural Compute Stick 2 yang menancap pada raspberry dilepas, kemudian jalankan kembali script python yang telah Anda buat, Apa yang terjadi?
  </p>
  
  <p>
    Harusnya nanti menampilkan pesan seperti di bawah ini
  </p>
  
  <p>
    E: [ncAPI] [ 142305] ncDeviceOpen:672 Failed to find suitable device, rc: X_LINK_DEVICE_NOT_FOUND<br /> Traceback (most recent call last):<br /> File &#8220;face-detection-vino.py&#8221;, line 13, in <br /> out = net.forward()<br /> cv2.error: OpenCV(4.1.0-openvino) /home/jenkins/workspace/OpenCV/OpenVINO/build/opencv/modules/dnn/src/op_inf_engine.cpp:747: error: (-215:Assertion failed) Failed to initialize Inference Engine backend: Can not init USB device: NC_ERROR in function &#8216;initPlugin&#8217;
  </p>
  
  <p>
    Anda dapat menancapkan kembali agar tidak terjadi error.
  </p>
</blockquote>

Demikianlah tulisan saya tentang cara installasi Neural Compute Stick 2 pada raspberry pi 3 B+ kesayangan Anda, semoga bermanfaat bagi yang baru belajar raspberry seperti saya. Saran dan kritik sangat diharapkan untuk memperbaiki tulisan dan blog ini, silakan tinggal komentar pada kolom yang telah disediakan. 🙂

#### References {#References}

  * <https://software.intel.com/en-us/articles/get-started-with-neural-compute-stick>
  * <https://software.intel.com/en-us/openvino-toolkit>
  * <https://movidius.github.io/blog/ncs-apps-on-rpi/>
  * [https://docs.openvinotoolkit.org/latest/\_docs\_install\_guides\_installing\_openvino\_raspbian.html](https://docs.openvinotoolkit.org/latest/_docs_install_guides_installing_openvino_raspbian.html)
  * <https://www.pyimagesearch.com/2019/04/08/openvino-opencv-and-movidius-ncs-on-the-raspberry-pi/>
  * <https://www.learnopencv.com/using-openvino-with-opencv/>