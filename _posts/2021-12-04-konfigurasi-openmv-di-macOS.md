---
layout: post
title:  "Konfigurasi openMV di MacOS"
author: odeng
categories: [OpenMV]
tags: [openmv, micropython]
image: assets/images/11.jpg
description: "My review of Inception movie. Acting, plot and something else in this short description."
featured: true
hidden: true
rating: 4.5
---

Bismillah,  
Hah, sampai lupa punya blog. Hari ini saya ada perangkat baru namanya OpenMV, yang mana perangkat tersebut merupakan sebuah
microprocessor yang sudah dibekali untuk kebutuhan computer vision. Sebenarnya mirip dengan arduino dan sejenisnya tetapi
memang fungsi diperluas include modul kamera. Untuk lebih jelasnya silakan mengunjungi di website resminya di [sini](https://openmv.io/collections/cams/products/openmv-cam-h7-r2).

Ada beberapa tahapan yang bisa dilakukan seperti di bawah ini
  * [Download OpenMV IDE](#Konfigurasi-Spring-Boot)
  * [Install libusb](#Install-libusb)
  * [Hello world](#Hello-world)
  * [Referensi](#Referensi)<figure class="wp-block-image">

#### Download OpenMV IDE {#Download-OpenMV-IDE}

OpenMV datang tidak hanya hardware tetapi mereka juga menawarkan dengan kode editor yang bisa kita gunakan secara gratis,
OpenMV bisa diimplementasikan menggunakan C++ dan Python. Langkah awal yang bisa kita lakukan yaitu dengan download di 
halaman [ini](https://openmv.io/pages/download), selanjutnya silakan lakukan installasi seperti pada software pada umumnya
di MacOS. File hasil download berukuran kurang lebih 170Mb, versi terakhir yang saya gunakan adalah v2.8.1. 

#### Install libusb {#Install-libusb}

OpenMV tidak bisa lakukan sebelum melakukan installasi lib-usb, library ini digunakan untuk komunikasi 
OpenMV menggunakan USB pada laptop kita. Beberapa perintah yang bisa digunakan adalah sebagai beikut, bisa menggunakan
MacPorts atau HomeBrew.
Untuk MacPorst menggunakan perintah di bawah ini
<pre class="wp-block-code"><code>
sudo port install libusb py-pip
sudo pip install pyusb
</code></pre>
Sedangkan untuk perintah brew bisa paste 2 baris perintah di bawah ini
<pre class="wp-block-code">
<code>
sudo brew install libusb python
sudo pip install pyusb
</code>
</pre>
Setelah kedua perintah di atas berhasil dijalankan, selanjutnya hubungkan OpenMV pada MacOS Anda. Saya menggunakan MacBook
Pro mid 2012 dengan sistem operasi Mojave bisa berjalan dengan normal dan tidak terjadi masalah ketika melakukan konfigurasi ini.

#### Hello world {#Hello-world}

Setelah OpenMV editor telah dipasang pada MacBook dan depedency juga sudah diinstall dengan, kemudian silakan hubungkan
OpenMV pada laptop menggunakan USB. Jika muncul untuk dilakukan ugrade firmware dan software pendukung silakan dilakukan
update terlebih dahulu.

#### Referensi {#Referensi}

  * <https://openmv.io/collections/cams/products/openmv-cam-h7-r2>
  * <https://openmv.io/pages/download>
  * <https://docs.openmv.io/openmvcam/tutorial/software_setup.html>