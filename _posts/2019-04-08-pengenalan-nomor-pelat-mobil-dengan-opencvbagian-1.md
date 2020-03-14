---
id: 68
title: Pengenalan Nomor Pelat Mobil dengan OpenCV (Bagian 1)
date: 2019-04-08T07:38:44+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=68
permalink: /pengenalan-nomor-pelat-mobil-dengan-opencvbagian-1/
wp_last_modified_info:
  - June 14, 2019 @ 7:54 pm
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
  - deep learning
  - opencv
  - plate-detection
  - plate-recognition
  - python
---
Bismillah,  
Di beberapa kota besar seperti Surabaya, Bandung, ataupun Yogyakarta sudah santer terdengar tilang otomatis bagi kendaraan yang melanggar rambu lalu lintas. Wow terdengar canggih, tapi sebenarnya teknologi seperti itu sudah lama di negara lain khususnya di Eropa. Kenapa bisa tilang otomatis, jawabannya adalah memanfaatkan kamera _CCTV(Closed-circuit television)_ yang terpasang, biasanya dipasang pada persimpangan jalan atau lampu merah. Jadi bagi Anda yang berkendara sepeda motor tidak tertib administrasi ataupun tingkah laku di jalan perlu berfikir dua kali. 🙂 

Selain sebagai kamera pengawas, _CCTV(Closed-circuit television)_ juga dapat dimanfaatkan lebih jauh lagi yaitu mengetahui nomor kendaraan Anda. Jelas, setelah nomor kendaraan Anda diketahui maka status kendaraan tersebut pula diketahui apakah terdaftar di kepolisian atau tidak, status pajak sudah jatuh tempo atau belum. Sebenarnya masih bisa dimanfaatkan banyak lagi, salah satunya adalah bisa digunakan menghitung kepadatan lalu lintas untuk me-manage lampu lintas kapan harus hijau atapun merah. 

Fokus tulisan ini tidak membahas semua manfaat kamera _CCTV(Closed-circuit television)_, tapi hanya satu yaitu tentang pengenalan nomor pelat kendaraan itu sendiri atau istilah lain yaitu _ANPR(Automatic Number Plat Recognition)_. Sebenarnya ada tiga tahapan atau proses yang dilakukan pada sistem ini. Tiga tahap tersebut adalah sebagai berikut:

  * Mendeteksi pelat kendaraan
  * Segmentasi karakter pelat
  * Mengenali karakter itu sendiri

#### Mendeteksi Pelat Kendaraan

Mendeteksi pelat kendaraan adalah langkah yang pertama kali dilakukan untuk mengenali nomor pelat kendaraan, algoritmanya pun banyak untuk dapat melakukan proses ini dari yang sederahana sampai ribet tergantung dari kondisi atau kasus yang ada. Beberapa metode atau algoritma yang bisa digunakan adalah _Deep Learning, Haar Cascade, dan Contour Detection_. Pada kesempatan kali ini saya akan mencoba untuk mengimplementasikan _Contour Detection_ untuk mengetahui keberadaan objek pelat kendaraan. Prinsip dari algoritma ini adalah dengan mengekstrak kontur yang terdapat pada sebuah citra atau gambar, kontur yang berbentuk dan menyerupai pelat kendaraan yang dipilih sebagai kandidat sebuah pelat kendaraan.

<div class="wp-block-image">
  <figure class="aligncenter"><a href="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/car6-1-e1554679360862.jpg" target="_blank" rel="noreferrer noopener"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/car6-1-e1554679360862.jpg" alt="" class="wp-image-70" /></a><figcaption>contoh input kendaraan</figcaption></figure>
</div>

Gambar di atas merupakan gambar input yang akan kita gunakan untuk mencoba mendeteksi suatu pelat kendaraan. Sebelumnya menjalankan code python, terlebih dahulu silakan install paket-paket yang dibutuhkan yaitu opencv-python. Beberapa yang perlu diimport adalah sebagai berikut

<pre class="wp-block-code"><code>import cv2
import Utils
import sys
import os</code></pre>

Alur program yang akan kita buat adalah dengan cara membaca folder untuk dilakukan pengolahan gambar. Kita membutuhkan looping terkait kebutuhan tersebut

<pre class="wp-block-code"><code># Folder untuk menyimpan dataset
path_slice = "dataset/sliced"
path_source = "dataset/source"

# Template untuk proyeksi vertikal
pv_template = Utils.proyeksi_vertical(cv2.imread("dataset/templates/plate/template.jpg", cv2.IMREAD_ANYCOLOR))

for file_name in sorted(os.listdir(path_source)):
    image = cv2.imread(os.path.join(path_source, file_name))
    src = image.copy()
    blurred = image.copy()
    print(image.shape)
    # Filtering gaussian blur
    for i in range(10):
        blurred = cv2.GaussianBlur(image, (5, 5), 0.5)

    # Conversi image BGR2GRAY
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Image binerisasi menggunakan adaptive thresholding
    bw = cv2.adaptiveThreshold(rgb, 255.0, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 5, 10)

    # Operasi dilasi
    bw = cv2.dilate(bw, cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1)))</code></pre>

Setelah folder dibaca kemudian perlu dilakukan filtering untuk menghilangkan noise atau derau yang terdapat pada citra. Hasil dari citra yang telah dihilangkan noisenya, perlu dilakukan grayscale atau keabuan sebelum diubah menjadi citra biner. Proses binerisasi menggunakan adaptive thresholding, kenapa tidak menggunakan Otsu setelah saya coba adaptive thresholding lebih baik hasilnya daripada Otsu. Hasil binerisasi ditunjukkan pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/bw-e1554704369755.jpg" alt="" class="wp-image-75" /><figcaption>Image binerisasi</figcaption></figure>
</div>

Selanjutnya setelah proses binerisasi, langkah yang perlu kita lakukan adalah melakukan ekstraksi kontur untuk mendapatkan semua kontur yang terdapat image biner hasil proses sebelumnya. Untuk masalah ekstraksi kontur dapat digunakan baris perintah di bawah ini

<pre class="wp-block-code"><code>contours, hierarchy = cv2.findContours(bw, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)</code></pre>

Hasil dari ekstraksi kontur sangatlah banyak sehingga perlu dilakukan seleksi kontur untuk mendapatkan kontur yang benar-benar kandidat dari sebuah pelat. Berikut ini code yang dapat digunakan untuk kebutuhan tersebut

<pre class="wp-block-code"><code>slices = []
    img_slices = image.copy()
    idx = 0
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        area = cv2.contourArea(cnt)
        ras = format(w / h, '.2f')
        # Pilih kontur dengan ukuran dan rasio tertentu
        if 30 &lt;= h and (100 &lt;= w &lt;= 400) and (2.7 &lt;= float(ras) &lt;= 4):
            idx = idx + 1
            print("x={}, y={}, w={}, h={}, area={}, rasio={}".format(x, y, w, h, area, ras))
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), thickness=1)
            cv2.putText(image, "{}x{}".format(w, h), (x, int(y + (h / 2))), cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255))
            cv2.putText(image, "{}".format(ras), (x + int(w / 2), y + h + 13), cv2.FONT_HERSHEY_PLAIN, 1,
                        (0, 0, 255))
            crop = img_slices[y:y - 3 + h + 6, x:x - 3 + w + 6]
            slices.append(crop)</code></pre>

Untuk menyeleksi sebuah kandidat pelat membutuhkan ukuran dan rasio dari sebuah pelat sendiri, ukuran dan rasio tergantung dari dataset yang Anda gunakan. Silakan disesuaikan dengan ukuran dan rasio dengan kebutuhan Anda terkait hal tersebut karena sangat tergantung dari input citra. Sebenarnya walaupun sudah diseleksi tetap saja masih ada kontur yang menyerupai pelat, pada gambar di bawah ini masih menyisakan 2 kontur yaitu yang pertama adalah kontur yang benar-benar pelat dan kontur bukan pelat yang ditunjukkan pada gambar di bawah ini. What is next to do?

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/image-e1554704464312.jpg" alt="" class="wp-image-76" /><figcaption>Hasil deteksi kontur</figcaption></figure>
</div>

Langkah terakhir yang perlu dilakukan adalah dengan melakukan proyeksi vertikal ataupun proyeksi horizontal. Metode ini adalah dengan cara menambahkan piksel secara vertikal ataupun horizontal. Jangan khawatir sudah saya sertakan untuk operasi tersebut, potongan programnya adalah sebagai berikut

<pre class="wp-block-code"><code>def proyeksi_vertical(img):
    blurred = cv2.GaussianBlur(img.copy(), (5, 5), 0)
    gray = cv2.cvtColor(blurred.copy(), cv2.COLOR_BGR2GRAY)
    # cv2.imshow("gray", gray)
    # cv2.waitKey()
    resized = cv2.resize(gray.copy(), (450, 145))
    # cv2.imshow("resized", resized)
    # cv2.waitKey()
    ret, bw = cv2.threshold(resized.copy(), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # cv2.imshow("bw", bw)
    # cv2.waitKey()
    bw = bw / 255.
    bw_data = np.asarray(bw)
    pvertical = np.sum(bw_data, axis=1)
    return pvertical</code></pre>

Kandidat-kandidat pelat yang terdeteksi dilakukan proyeksi vertikal dibandingkan dengan template yang sebelumnya kita buat, untuk membuat template bisa dilakukan secara manual menggunakan tool image editor. Proses perbandingan tersebut tersaji dalam source code seperti di bawah ini

<pre class="wp-block-code"><code>result = None
    max_value = sys.float_info.max
    for sl in slices:
        # cv2.imshow("slice ke {}".format(slices.index(sl) + 1), sl)
        # cv2.waitKey()
        pv_numpy = Utils.proyeksi_vertical(sl.copy())
        rs_sum = cv2.sumElems(cv2.absdiff(pv_template, pv_numpy))
        # print("sum: {} slice ke {}".format(rs_sum[0], slices.index(sl) + 1))
        if rs_sum[0] &lt;= max_value:
            max_value = rs_sum[0]
            result = sl
    cv2.waitKey()
    cv2.imwrite(os.path.join(path_slice, file_name), result)</code></pre>

Hasil akhir dari langkah-langkah yang kita lakukan seharusnya seperti di bawah ini.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/result.jpg" alt="" class="wp-image-77" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/result.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/result-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Hasil deteksi pelat</figcaption></figure>
</div>

Demikianlah salah satu task yang sudah kita lakukan untuk melakukan pengenalan pelat, masih ada 2 task lagi yang kita butuhkan. Full source code bisa didownload di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/plate-detection-pi" target="_blank">sini</a>, tunggu ya artikel saya yang akan datang. Cheers&#8230;.!