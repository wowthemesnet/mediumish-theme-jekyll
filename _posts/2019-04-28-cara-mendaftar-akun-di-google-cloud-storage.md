---
id: 137
title: Cara Mendaftar Akun di Google Cloud Storage
date: 2019-04-28T21:48:20+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=137
permalink: /cara-mendaftar-akun-di-google-cloud-storage/
wp_last_modified_info:
  - June 14, 2019 @ 7:41 pm
wplmi_shortcode:
  - '[lmt-post-modified-info]'
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
categories:
  - Uncategorized
tags:
  - cvc
  - cvv
  - google cloud storage
  - jenius
---
Bismillah,  
Selamat berlibur temen-temen semoga bisa berkumpul dengan keluarga dan orang-orang tersayang. Pada kesempatan kali ini saya akan menulis artikel tentang gimana sih caranya membuat akun di _google cloud storage_, artikel yang sebenarnya ringan tetapi terkadang jengkel dan kesel juga karena beberapa kali saya sempet gagal untuk registrasi.

Berawal dari ketertarikan saya untuk belajar tentang _machine learning_ tetapi karena keterbatasan spesifikasi hardware yang saya miliki masih sangat jauh di bawah standard, mungkin ada yang bertanya hubungannya apa dengan spesifikasi hardware dengan _machine learning_? Jelas sangat berhubungan, karena dalam _machine learning_ ada aktivitas training data yang sangat bergantung dengan spesifikasi hardware yang dimiliki. Tentunya jika memiliki hardware dengan spesifikasi tinggi proses training akan berjalan lebih cepat, minimal ada GPU yang tertanam dalam laptop/PC Anda. Bagi yang belum punya hardware yang mumpuni jangan khawatir atau menjadi kendala untuk belajar _machine learning_, karena google menyediakan <a rel="noreferrer noopener" aria-label="google colab (opens in a new tab)" href="https://colab.research.google.com" target="_blank">google colab</a> untuk memfasilitasi _cloud computing_. Jika kita menggunakan google colab biasanya berurusan dengan dataset untuk melakukan training data, kemudian dataset dan resource tersebut biasanya tersimpan di dalam _google cloud storage_. Untuk dapat menikmati layanan _google cloud storage_ kita harus melakukan registrasi, langkah-langkah yang dapat dilakukan seperti di bawah ini

  * Silakan beranjak ke halaman _<a rel="noreferrer noopener" aria-label="google cloud storage (opens in a new tab)" href="https://cloud.google.com/" target="_blank">google cloud storage</a>_, kemudian cari tombol _**Get started for free**_
  * Pada langkah ke-1 silakan isikan negara Anda, dan check bagian _Terms of service_ dan klik tombol _**AGREE AND CONTINUE**_
  * Pada langkah ke-2 atau informasi pengguna, isikan Account type sesuai dengan kebutuhan untuk Business atau Individual
  * Nama dan alamat silakan diisikan sesuai dengan alamat Anda
  * Pada bagian payment method, silakan diisikan menggunakan kartu kredit atau debit Anda, untuk CVC silakan diisikan. _CVC(Card Verification Code)/CVV(Card Verification Value)_ biasaya terletak di balik kartu debit/kredit
  * Jika alamat kartu sesuai dengan alamat Anda saat ini silakan di-check _Credit or debit card address is same as above_, jika beda disikan sesuai alamat Anda
  * Klik tombol _**START MY FREE TRIAL**_

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/gcs-fail-e1556456699425.png" alt="" class="wp-image-138" /><figcaption>Registrasi Google Cloud Storage Gagal</figcaption></figure>
</div>

Pada gambar di atas menunjukkan proses pendaftaran karena kartu debit yang saya gunakan, saya menggunakan kartu debit Mandiri. Ada yang bilang bahwa kartu debit Mandiri dapat digunakan untuk melakukan pendaftaran dengan syarat fitur VBV(Verified By Visa) sudah diaktifkan, padahal saya sudah ke teller bank Mandiri terdekat dan sudah menunggu 3 hari. Info dari teller untuk proses aktivasi membutuhkan waktu 3 hari, tetapi memang tidak bisa digunaakan untuk mendaftar _google cloud storage_

Akhirnya setelah bertanya-tanya ke forum dan mendapatkan jawaban seperti di bawah ini

<blockquote class="wp-block-quote">
  <p>
    GCP gak bisa pakai VbV atau 3D secure pak. mungkin masih ada kartu kredit yang tidak pakai itu, kartu debit yang bisa setahu saya jenius.
  </p>
  
  <cite>Machine Learning ID</cite>
</blockquote>

<blockquote class="wp-block-quote">
  <p>
    Pakai BNI bisa. Pakai yang VCN.
  </p>
  
  <p>
    Jenius udah mantab lah. Langsung bisa dipakai kalau ke GCP dll.
  </p>
  
  <p>
    Belanja ke AliExpress juga langsung aja pakai jenius
  </p>
  
  <cite>Machine Learning ID</cite>
</blockquote>

Akhirnya saya membuat rekening jenius, untuk proses pembuatannya sangat mudah sekali nggak sampai 15 menit. Kemudian jika Anda di daerah jabodetabek kartu Anda bisa diantar ke rumah, untuk proses pendaftaran silakan bisa diunduh di google play untuk pengguna Android. Ketika saya membuat rekening tersebut di Malang, mereka buka counter di MOG dan MATOS. Setelah memasukan _card number_ dan CVC(kalau di jenius CVV), jika berhasil maka akan diarahkan ke halaman _google cloud storage_ seperti pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/gcs-success-1024x202.png" alt="" class="wp-image-140" /><figcaption>Registrasi Google Cloud Storage Berhasil</figcaption></figure>
</div>

Walaupun proses pendaftaran google cloud storage menggunakan kartu debit/kredit tujuannya adalah untuk memastikan yang mendaftar bukan robot, itu pernyataannya google tetapi kartu debit/kredit tidak boleh saldo Rp.0 atau harus ada isinya. Ketika saya mendaftar terpotong Rp.10.000, tetapi nanti dikembalikan lagi. Ada pernyataan menarik dari seorang teman seperti ini

<blockquote class="wp-block-quote">
  <p>
    Kalau transaksi google minimal harus ada $1 buat ngeping ????
  </p>
  
  <cite>Salah satu akun di telegram</cite>
</blockquote>

Demikianlah artikel saya tentang cara mendaftar akun di _google cloud storage_, semoga bermanfaat dan tetap semangat belajar. Ditunggu tulisan yang akan datang ya. 🙂