---
id: 35
title: Memasang Modul Kamera di Raspberry
date: 2019-03-31T06:33:23+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=35
permalink: /memasang-modul-kamera-di-raspberry/
wp_last_modified_info:
  - June 14, 2019 @ 8:17 pm
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
  - computer vision
  - raspberry-pi
  - raspberry-pi-camera
---
Bismillah,  
Sesuai pernyataan saya pada <a rel="noreferrer noopener" aria-label="postingan yang lalu (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/03/29/installasi-raspberry-pi/" target="_blank">postingan yang lalu</a> bahwa saya belajar raspberry untuk _computer vision_ sehingga kamera adalah perangkat yang hukumnya wajib terpasang pada raspberry Anda. Raspberry pi kamera yang saya gunakan adalah _Raspberry Pi Camera Rev 1.3_, versi tersebut tertulis pada board kamera. Sebenarnya yang saya ketahui ada 2 macam versi raspberry kamera yang sejenis, pertama _Raspberry Pi Camera Modul V1.3_ dan _Official Raspberry Pi Camera Modul V2_. Perbedaan yang paling mencolok adalah terkait dengan harga dan kwalitas lensa yang digunakan, saya beli dengan harga sekitar 140 ribu sedangkan yang official selisih sekitar 200 ribu. Kemudian untuk urusan lensa yang official sudah menggunakan lensa Sony dengan 8MP, sedangkan yang saya miliki lensanya tertulis Sunny dengan 5MP. Karena buat belajar bagi saya nggak masalah dan isi kantong juga cekak, beli yang murah dulu. Beberapa point yang akan saya bahas adalah sebagai berikut

  * [Memasang modul kamera](#memasang-modul-kamera)
  * [Mengaktifkan modul kamera](#mengaktifkan-modul-kamera)
  * [Uji coba modul kamera](#uji-coba-modul-kamera)
  * [Penutup](#penutup)
  * [Referensi](#referensi)

#### Memasang modul kamera {#memasang-modul-kamera}

Raspberry kamera menggunakan kabel flexi FCC, kabel tersebut tipis sehingga diperlukan kehatian-hatian ketika melakukan pemasangan ke raspberry Anda. Ukuran kabel tersebut sekitar 20 cm, sebenarnya bisa saja Anda hanya membeli kabelnya saja jika dirasa masih kurang panjang. Ukuran 30 cm dengan kisaran harga 25 ribu. Soket kamera terletak di antara port audio dan HDMI, jangan kwatir salah slot karena sudah sangat jelas tertulis CAMERA. Hanya ada 2 soket sebenarnya selain kamera, yang satunya digunakan untuk DISPLAY. Untuk memulainya terlebih dahulu Anda lepas pelindung soketnya, berwarna orange kemudian tarik pelan-pelan pengait yang menancap sampai longgar. Masukan ujung kabel flexi FCC ke modul kamera, ujung kabel warna biru menghadap ke port audio. Jika sudah dirasa menancap ujung kabelnya, tancapkan kembali pengait yang sebelumnya dilonggarkan. Mungkin untuk lebih jelas dan detail bisa menonton video pada <a href="https://www.youtube.com/watch?v=tHjwx2AQHxU" target="_blank" rel="noreferrer noopener" aria-label="youtube (opens in a new tab)">youtube</a> terkait permasangan tersebut. 

#### Mengaktifkan modul kamera {#mengaktifkan-modul-kamera}

Setelah proses pemasangan selesai, kamera tersebut tidak bisa langsung digunakan seperti pada kamera pada umumnya kita harus terlebih dahulu mengaktifkan modul kamera tersebut. Caranya pun sangat sederhana karena sudah include pada raspberry pi, tidak perlu install driver ataupun paket yang dibutuhkan. Silakan masuk ke terminal Anda, remote raspberry pi tersebut dan ketikkan perintah seperti berikut

<pre class="wp-block-code"><code>sudo raspi-config</code></pre>

Seharusnya akan muncul kotak dialog _Raspberry Pi Software Configuration Tool (raspi-config)_, pilih _Interfacing Options_ untuk melakukan konfigrasi perangkat yang terhubung ke raspberry menggunakan tombol panah naik turun pada keyboard. Selanjutnya kan muncul dialog _Enable/Disable_ untuk mengaktifkan perangkat yang terpasang, pilih _P1 Camera_ dan yang terakhir pilih _Yes_ dan muncul pesan dialog yang menginfokan bahwa interface kamera sudah diaktifkan. Silakan keluar dari kotak dialog _Raspberry Pi Software Configuration Tool (raspi-config)_ dengan pindah ke tab _Finish_ menggunakn tombol tab pada keyboard Anda. Silakan reboot raspberry untuk memberikan perubahan proses aktifasi modul kamera tersebut.

#### Uji coba modul kamera {#uji-coba-modul-kamera}

Untuk melakukan uji coba modul kamera yang telah pasang dan diaktifkan, kita patut bersyukur bahwa tool-tool atau aplikasi penting telah ditanamkan pada raspberry sehingga sekali lagi kita tidak perlu install modul atau paket yang lain. Beberapa perintah dasar untuk mengambil gambar dan mengambil video berbasis command line sudah tersedia seperti pada contoh di bawah ini ketika akan mengambil gambar. 

<pre class="wp-block-code"><code>raspistill -o image.jpg</code></pre>

Ketika perintah di atas dijalankan, Led kamera yang terdapat pada raspberry akan menyala berwarna merah. Fungsi perintah tersebut adalah untuk mengambil gambar dengan nama _image.jpg_, _parameter -o_ artinya adalah output atau nama file yang dihasilkan. Untuk mengetahui lebih detail perintah di atas silakan ketikkan perintah di bawah ini

<pre class="wp-block-code"><code>raspistill -?</code></pre>

Contoh yang lain misalkan kita akan mengambil video dapat menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>raspivid -o video.h264 -t 10000</code></pre>

Dengan menggunakan perintah di atas kita akan mengambil video dengan output file _video.h264_ dengan durasi 10 detik. Untuk mengetahui lebih detail terkait parameter yang digunakan, silakan ketikkan perintah di bawah ini 

<pre class="wp-block-code"><code>aspivid -?</code></pre>

#### Penutup {#penutup}

Demikianlah beberapa langkah yang bisa kita lakukan untuk memasang modul kamera pada raspberry pi, semoga tulisan saya bermanfaat. Pada postingan yang akan datang akan saya coba memanfaatkan kamera tersebut untuk _computer vision_, ditunggu ya. Mohon doanya semoga saya istiqomah menulis di blog ini.

#### Referensi {#referensi}

  * <https://www.raspberrypi.org/documentation/configuration/camera.md>
  * <https://kbsezginel.github.io/raspberry-pi/rpi-camera>
  * <https://www.youtube.com/watch?v=tHjwx2AQHxU>