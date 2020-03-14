---
id: 82
title: Pengenalan Nomor Pelat Mobil dengan OpenCV (Bagian 2)
date: 2019-04-09T05:43:38+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=82
permalink: /pengenalan-nomor-pelat-mobil-dengan-opencv-bagian-2/
wp_last_modified_info:
  - June 14, 2019 @ 7:53 pm
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
  - deep learning
  - opencv
  - plate-recognition
  - python
  - segmentasi
---
Bismillah,  
masih menyambung postingan saya <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/04/08/pengenalan-nomor-pelat-mobil-dengan-opencvbagian-1/" target="_blank">sebelumnya</a> terkait dengan pengenalan nomor pelat mobil kita telah berhasil melokalisasi atau menemukan lokasi nomor pelat. Pada bagian 2 ini kita akan melakukan segmentasi karakter-karakter yang terdapat pada sebuah pelat hasil pemprosesan sebelumnya.

#### Segmentasi Karakter Pelat

Segmentasi merupakan sebuah proses memisahkan daerah atau objek yang penting dari sebuah citra. Jika pada citra pelat yang akan dipisahkan adalah karakter yang terdapat pada sebuah pelat, yaitu karakter alfanumerik(kombinasi angka dan huruf). Tidak semua karakter akan disegmentasi, hanya karakter nomor pelat kendaraan saja sedangkan untuk bulan dan tahun berlaku tidak akan disegmentasi. 

<div class="wp-block-image">
  <figure class="aligncenter is-resized"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/result.jpg" alt="" class="wp-image-77" width="302" height="91" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/result.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/result-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Hasil deteksi pelat</figcaption></figure>
</div>

Gambar di atas merupakan hasil deteksi pelat pada citra inputan yang berhasil dideteksi. Untuk melakukan segmentasi sebenarnya hampir mirip dari metode yang sebelumnya yaitu menggunakan ekstraksi kontur, perbedaannya adalah pada segmentasi karakter pelat disesuaikan ukuran dan rasionya untuk masing-masing karakter. Alur program yang akan kita buat adalah membaca direktori hasil lokalisasi pelat kemudian mengolahnya untuk dilakukan segmentasi, awal kode yang dibuat harus menyertakan depedensi 2 baris kode seperti di bawah ini

<pre class="wp-block-code"><code>import cv2
import os</code></pre>

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/segmentasi-bw.jpg" alt="" class="wp-image-87" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-bw.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-bw-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Konversi menjadi image biner</figcaption></figure>
</div>

Seperti preprocessing pada langkah yang sebelumnya, yang harus dilakukan adalah mengubah gambar menjadi biner untuk dilakukan processing yang lebih lanjut. Baris perintah yang digunakan untuk preprocessing tersebut adalah sebagai berikut

<pre class="wp-block-code"><code># Lokasi hasil pelat
path_plate = "dataset/sliced"

# Looping file di direktori
for name_file in sorted(os.listdir(path_plate)):
    src = cv2.imread(os.path.join(path_plate, name_file))
    blurred = src.copy()
    gray = blurred.copy()

    # Filtering
    for i in range(10):
        blurred = cv2.GaussianBlur(src, (5, 5), 0.5)

    # Ubah ke grayscale
    gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)

    # Image binary
    ret, bw = cv2.threshold(gray.copy(), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    print(ret, bw.shape)
    cv2.imwrite("segmentasi-bw.jpg", bw)
    # cv2.imshow("bw", bw)
    # cv2.waitKey()</code></pre>

Langkah preprocessing selanjutnya adalah melakukan operasi morfologi, operasi morfologi digunakan untuk memisahkan karakter pelat yang berhimpitan. Baris perintah yang dapat digunakan adalah sebagai berikut

<pre class="wp-block-code"><code># Image morfologi, opening
    erode = cv2.erode(bw.copy(), cv2.getStructuringElement(cv2.MORPH_OPEN, (3, 6)))
    cv2.imwrite("segmentasi-erode.jpg", erode)
    # cv2.imshow("erode", erode)
    # cv2.waitKey()</code></pre>

Hasilnya morfologi dapat ditampilkan pada gambar di bawah, terlihat bahwa karakter menipis dari hasil binerisasi sebelumnya. 

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/segmentasi-erode.jpg" alt="" class="wp-image-88" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-erode.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-erode-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Hasil operasi morfologi</figcaption></figure>
</div>

Kemudian ekstraksi kontur dibutuhkan untuk mendapatkan semua kontur yang merupakan kandidat sebuah karakter pelat. Seperti biasanya, kontur harus diseleksi berdasarkan ukuran dan rasio sebuah karakter pelat. Pada bagian ini perlu disesuaikan nilainya, mungkin jika kasus yang berbeda atau dataset yang berbeda nilainya perlu disesuaikan. Nilai pada kode yang saya lampirkan, adalah normatif artinya perlu disesuaikan dengan kebutuhan.

<pre class="wp-block-code"><code># Ekstraksi kontur
    contours, hierarchy = cv2.findContours(erode.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

    # Looping contours untuk mendapatkan kontur yang sesuai
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        ras = format(w / h, '.2f')
        # print("x={}, y={}, w={}, h={}, rasio={}".format(x, y, w, h, ras))
        if h >= 40 and w >= 10 and float(ras) &lt;= 1:
            # Gambar segiempat hasil segmentasi warna merah
            cv2.rectangle(src, (x, y), (x + w, y + h), (0, 0, 255), thickness=1)
            print("+ x={}, y={}, w={}, h={}, rasio={}".format(x, y, w, h, ras))
    cv2.imwrite("segmentasi-result.jpg", src)
    cv2.imshow("result", src)
    cv2.waitKey()</code></pre>

Hasil dari potongan kode di atas akan melakukan segmentasi karakter pelat dari gambar inputan dengan ditandai gambar segiempat berwarna merah. Silakan ditambahkan kodenya sedikit agar bisa melakukan croping pada bagian karakter agar dapat dilakukan pengenalan atau proses yang selanjutnya.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/segmentasi-result.jpg" alt="" class="wp-image-89" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-result.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-result-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Hasil segmentasi</figcaption></figure>
</div>

Ada beberapa catatan terkait hasil di atas, masih memungkinkan karakter tertentu yang tersegmentasi bertumpuk atau bersinggungan misalkan jika nanti menemukan karakter huruf D, O, dan angka 0. Selain itu untuk melakukan pembacaan dilakukan dari kiri ke kanan, hal tersebut perlu dilakukan sorting hasil dari karakter yang tersegmentasi. Perlu dilakukan optimize code yang dibuat saat ini, silakan berekperiment terkait kasus atau kondisi tersebut. Full code untuk melakukan segmentasi dapat Anda clone di <a href="https://github.com/0d3ng/plate-detection-pi/tree/plate-segmentation" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah artikel saya buat tentang segmentasi karakter pelat nomor mobil, semoga bermanfaat bagi yang yang akan atau lagi belajar OpenCV seperti saya. Ditunggu part yang selanjutnya tentang pengenalan karakter nomor pelat mobil. Happy OpenCV. 🙂