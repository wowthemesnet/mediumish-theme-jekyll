---
id: 48
title: Face Detection Haar Cascade Classifier Raspberry Pi
date: 2019-04-03T09:23:29+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=48
permalink: /face-detection-haar-cascade-classifier-raspberry-pi/
wp_last_modified_info:
  - June 14, 2019 @ 8:07 pm
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
  - git
  - haar-cascade
  - jetbrain
  - opencv
  - pycharm
  - python
  - raspberry
  - virtualenv
---
Bismillah,  
Sesuai janji saya pada tulisan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/04/01/install-opencv-raspberry/" target="_blank">sebelumnya</a> bahwa saya akan posting membuat aplikasi sederhana menggunakan OpenCV. Aplikasi sederhana yang akan dibuat adalah _face detection_ menggunakan _Haar Cascade Classifier_, algoritma ini dikembangkan oleh Paul Viola dan Michael Jones yaitu dengan melakukan _training image positive_(gambar wajah) dan _image negative_(gambar bukan wajah). Bacaan yang menarik terkait hal tersebut salah satunya ada yang membahas di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://www.superdatascience.com/blogs/opencv-face-detection" target="_blank">sini</a>, beberapa hal yang akan saya bahas di sini adalah sebagai berikut

  * [Install git](#install-git)
  * [Implementasi kode](#implementasi-kode)
  * [Penutup](#penutup)
  * [Referensi](#referensi)

#### Install git {#install-git}

Ya install git, menurut saya sangat penting karena git merupakan salah satu repository untuk _source code_ yang sangat banyak digunakan oleh para programer. Jadi raspberry pi tidak digunakan untuk full coding, raspberry pi digunakan untuk menjalankan source code yang telah kita buat bisa menggunakan laptop/komputer. Alurnya nanti tinggal download atau update code pada server git menggunakan perintah git. Sebelumnya kita install dulu git menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>sudo apt install git
git --version</code></pre>

#### Implementasi kode {#implementasi-kode}

Saya lakukan coding bukan di raspberry dengan menggunakan editor python yang cukup terkenal yaitu PyCharm, jika menginginkan editor tersebut silakan download di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://www.jetbrains.com/pycharm/download/" target="_blank">sini</a>. Sebenarnya untuk membuat project yang terintegasi dengan git bisa menggunakan command line, versi gui plugin yang ada pada PyChartm ataupun bisa langsung ke websitenya <a rel="noreferrer noopener" aria-label="git (opens in a new tab)" href="https://github.com/" target="_blank">github</a>. Jika menginginkan membuat project melalui websitenya, Anda harus terlebih dahulu membuat akun di github. Ada 2 jenis akun yang bisa Anda buat, versi yang gratis dan berbayar. Perbedaan dari sisi layanan salah satunya adalah kita bisa membuat project yang private, kita bisa mengatur siapa saja yang bisa melihat project yang kita buat. Jangan khawatir, silakan Anda membuat akun dengan alamat email konstitusi pendidikan misal *.ac.id maka nanti akan mendapatkan layanan seperti berbayar selama 1 tahun yang nanti bisa diperpanjang. Pada kesempatan kali ini akan dibuat menggunakan salah satu fitur yang ada pada PyCharam, versi yang saya gunakan ketika saya menulis tutorial ini adalah 2018.3.5. Buatlah project baru &#8211; nama project _face-detection-pi_ &#8211; pilih _New environment using VirtualEnv &#8211; Base interpreter &#8211; /usr/local/bin/python3_(gunakan python 3), jika menginginkan library global digunakan semua contreng _Inherit global site-packages_. Disarankan tetap menggunakan library yang dibutuhkan saja atau tidak melakukan contreng pada bagian tersebut, jadi jika dibutuhkan library ya kita tinggal menggunakan perintah _pip install [nama library]_

<blockquote class="wp-block-quote">
  <p>
    duplikasi lebih baik drpd ketika push ke production program ga jalan..<br /> Storage & bandwidth lebih murah drpd waktu utk debug di production atau delay release
  </p>
  
  <cite>salah satu dari akun di grup python indonesia</cite>
</blockquote>

<blockquote class="wp-block-quote">
  <p>
    belajar dr pngalaman, babak belur develop personal project gara2 dependency error ????
  </p>
  
  <cite>masih akun yang sama di grup python indonesia</cite>
</blockquote>

Silakan melakukan coding ria menggunakan PyCharm, buat file python yang isinya sebagai berikut

<pre class="wp-block-code"><code>import cv2

# Untuk mengambil gambar menggunakan streaming video
cap = cv2.VideoCapture(0)
# Load lokasi hasil training dari haar cascade
faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

cv2.namedWindow("face detection", cv2.WINDOW_GUI_EXPANDED)

# Looping terus untuk membaca gambar frame demi frame
while True:
    ret, frame = cap.read()
    if frame is None:
        continue
    # Ubah gambar dari BRG ke grayscale
    gray = cv2.cvtColor(frame.copy(), cv2.COLOR_BGR2GRAY)

    # Hasil dari deteksi wajah adalah list rectangle atau kotak
    faces = faceCascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(30, 30))
    print("found {0} faces!".format(len(faces)))

    # Membuat kotak dengan opencv berdasarkan wajah-wajah yang terdeteksi
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

    cv2.imshow("face detection", frame)
    # Frame akan keluar ketika tombol q pada keyboard ditekan
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Jika selesai release semua resource
cap.release()
cv2.destroyAllWindows()</code></pre>

Secara singkat sudah dijelaskan pada source dan source code tersedia di <a href="https://github.com/0d3ng/plate-detection-pi" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>, tapi yang terpenting adalah silakan parameter ketika mendeteksi diubah-ubah nilainya sehingga mengakibatkan pengaruh yang berbeda misalkan _scaleFactor_ ataupun _minNeighbors_. Kemudian ketika menjalankan pastikan kondisi pencahayaan sekitar Anda juga baik, tidak pada kegelapan ketika Anda menjalankannya karena nanti wajah Anda tidak akan terdeteksi dengan baik. Bacaan yang menarik bisa ditemukan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://realpython.com/face-recognition-with-python/" target="_blank">sini</a>, selanjutnya tambahkan beberapa file seperti _.gitignore_ dan _README.md_. Fungsi dari file tersebut adalah untuk meng-ignore file yang akan diupload atau dipush ke server git, _README.md_ adalah file yang berisi tentang deskripsi dari project yang Anda buat. Isi dari file .gitignore kira-kira seperti ini

<pre class="wp-block-preformatted">### IntelliJ IDEA ###<br />.idea</pre>

Maksud dari isi di atas adalah folder .idea tidak akan diupload, .idea adalah folder yang berisi tentang konfigurasi menggunakan editor PyCharm. Anda bisa menambahkan file-file yang tidak akan diupload sendiri, untuk lebih jelasnya silakan baca-baca terkait dengan .gitignore di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://git-scm.com/docs/gitignore" target="_blank">sini</a>. Dari menu bar Pycharm silakan pilih _VCS &#8211; Import into Version Control &#8211; Create Git Repository_, seharusnya nanti file yang berada di bawah project Anda akan berubah menjadi warna merah. Selanjutnya klik kanan project Anda, pilih _Git &#8211; Commit Directory_. Pada bagian _Unversional Files_ silakan dicontreng, kemudian pada bagian _commit message_ diisi misalkan _Initial commit_. Jika sudah klik tombol _commit_ yang berada pada pojok kanan bawah. Pengisian _commit message_ sangat penting dilakukan agar mudah melakukan logging atau tracking project yang Anda buat, isikan sesuai dengan apa yang telah Anda ubah pada project tersebut.

Kemudian yang Anda harus lakukan adalah upload ke sever git atau istilahnya dengan push menggunakan PyCharm dengan klik kanan project Anda, pilih _git &#8211; Repository &#8211; Push_ atau bisa mengunakan _command+shift+k(Mac OS)_. Muncul kotak dialog klik _Define remote_ isikan url git Anda, misalkan _https://github.com/0d3ng/face-detection-pi_. Pastikan Anda sudah membuat akun github dan membuat repository git sebelumnya.

Kita akan coba menjalankan pada raspberry kita, sebelumnya masuk terlebih dahulu ke raspberry pi Anda dan jalankan perintah di bawah ini untuk menyiapkan segala sesuatuanya

<pre class="wp-block-code"><code>mkdir PyCharmProjects
cd PyCharmProjects
git clone https://github.com/0d3ng/face-detection-pi
cd face-detection-pi
workon cv</code></pre>

<pre class="wp-block-preformatted">(cv) pi@raspberrypi:~/PyCharmProjects/face-detection-pi $ python face-detection.py<br /> VIDEOIO ERROR: V4L: can't open camera by index 0<br /> (process:1811): Gtk-WARNING **: Locale not supported by C library.<br />     Using the fallback 'C' locale.<br /> Unable to init server: Could not connect: Connection refused<br /> (face detection:1811): Gtk-WARNING **: cannot open display: localhost:10.0</pre>

Jika mendapat error di atas silakan jalankan perintah di bawah ini

<pre class="wp-block-code"><code>sudo modprobe bcm2835-v4l2</code></pre>

Sekarang dicoba kembali, jika masih ada error seperti di bawah ini silakan menggunakan command di bawah ini untuk menghilangkan error tersebut

<pre class="wp-block-preformatted">(cv) pi@raspberrypi:~/PyCharmProjects/face-detection-pi $ python face-detection.py<br /> (process:2000): Gtk-WARNING **: Locale not supported by C library.<br />     Using the fallback 'C' locale.<br /> Unable to init server: Could not connect: Connection refused<br /> (face detection:2000): Gtk-WARNING **: cannot open display: 192.168.8.100:0</pre>

<pre class="wp-block-code"><code>export DISPLAY=:0</code></pre>

Semoga sudah tidak error lagi dan bisa tampil face detection-nya. hehe

#### Penutup {#penutup}

Demikianlah contoh pemanfaatan raspberry pi sederhana aplikasi deteksi wajah sekaligus gimana caranya mengupload ke repository, semoga bermanfaat. Ditunggu tutorial yang lain ya, have nice raspberry. 🙂

#### Referensi {#referensi}

  * [https://docs.opencv.org/4.0.1/d7/d8b/tutorial\_py\_face_detection.html](https://docs.opencv.org/4.0.1/d7/d8b/tutorial_py_face_detection.html)
  * <https://projects.raspberrypi.org/en/projects/getting-started-with-git/4>
  * <https://realpython.com/face-recognition-with-python/>
  * <https://www.digitalvidya.com/blog/face-recognition-python/>
  * <https://www.jetbrains.com/help/pycharm/set-up-a-git-repository.html>
  * <https://raspberrypi.stackexchange.com/questions/62276/could-not-open-x-display-unable-to-init-server-could-not-connect>