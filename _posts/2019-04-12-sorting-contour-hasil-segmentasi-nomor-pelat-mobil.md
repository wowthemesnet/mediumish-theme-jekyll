---
id: 120
title: Sorting Contour Hasil Segmentasi Nomor Pelat Mobil
date: 2019-04-12T09:50:52+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=120
permalink: /sorting-contour-hasil-segmentasi-nomor-pelat-mobil/
wp_last_modified_info:
  - June 14, 2019 @ 7:44 pm
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
  - contour
  - opencv
  - python
  - segmentasi
  - sorting
---
Bismillah,  
Masih inget pada postingan yang sebelumnya hasil segmentasi nomor pelat yang masih terbalik sehingga ketika dilakukan pengenalan nomor pelat hasilnya juga tidak benar. Kasusnya kira-kira ditampilkan pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/segmentasi-result.jpg" alt="" class="wp-image-89" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-result.jpg 302w, https://www.sinaungoding.com/wp-content/uploads/2019/04/segmentasi-result-300x90.jpg 300w" sizes="(max-width: 302px) 100vw, 302px" /><figcaption>Hasil segmentasi</figcaption></figure>
</div>

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/Screen-Shot-2019-04-10-at-16.32.57-e1554904746302.png" alt="" class="wp-image-96" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/Screen-Shot-2019-04-10-at-16.32.57-e1554904746302.png 376w, https://www.sinaungoding.com/wp-content/uploads/2019/04/Screen-Shot-2019-04-10-at-16.32.57-e1554904746302-300x110.png 300w" sizes="(max-width: 376px) 100vw, 376px" /><figcaption>Hasil pengenalan</figcaption></figure>
</div>

Dari hasil segmentasi dan pengenalan di atas ditunjukkan bahwa yang akan dilakukan pengenalan AB 1267 N, tetapi karena ketika segmentasi masih ngacak sehingga urutannya pun BA61N27. Yang harus kita lakukan adalah melakukan urutan contour tersebut, urutan berdasarkan koordinat sumbu x dari kiri ke kanan atau dari sumbu x yang nilainya terkecil ke terbesar. Dengan menggunakan python dapat dilakukan menggunakan perintah sederhana seperti di bawah ini

<pre class="wp-block-code"><code>def sort_contours(contours, method="left-to-right"):
    reverse = False
    index = 0

    if method == "right-to-left" or method == "bottom-to-top":
        reverse = True

    if method == "top-to-bottom" or method == "bottom-to-top":
        index = 1

    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    contours, bounding_boxes = zip(*sorted(zip(contours, bounding_boxes), key=lambda b: b[1][index], reverse=reverse))

    return contours, bounding_boxes</code></pre>

Sebenarnya yang paling penting dari perintah di atas adalah 3 baris terakhir, pertama yang kita lakukan adalah buat sebuah variabel untuk menyimpan list box dan kita manfaatkan fungsi _sorted_ bawaan python untuk mengurutkan 2 list sekaligus _contours dan bounding_boxes_. Untuk lebih jelasnya silakan bisa membaca di <a href="https://www.pyimagesearch.com/2015/04/20/sorting-contours-using-python-and-opencv/" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/Screen-Shot-2019-04-12-at-16.39.52-e1555062107737.png" alt="" class="wp-image-121" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/Screen-Shot-2019-04-12-at-16.39.52-e1555062107737.png 312w, https://www.sinaungoding.com/wp-content/uploads/2019/04/Screen-Shot-2019-04-12-at-16.39.52-e1555062107737-300x96.png 300w" sizes="(max-width: 312px) 100vw, 312px" /><figcaption>Hasil setelah sorting contour</figcaption></figure>
</div>

Dari gambar di atas menunjukan bahwa hasil segmentasi sudah sesuai urutan karakternya, perlu diingat bahwa untuk melakukan sorting countour sebaiknya setelah contour tersebut sudah difilter terlebih dahulu setelah itu baru diurutkan. Tujuannya adalah biar tidak mengurangi waktu pre-processing untuk melakukan sorting, silakan cek di <a href="https://github.com/0d3ng/plate-detection-pi/tree/plate-segmentasi-sorting-contour" target="_blank" rel="noreferrer noopener" aria-label="github (opens in a new tab)">github</a> saya source code terkait hal tersebut

Demikian sedikit trik untuk mempercantik hasil segmentasi nomor pelat, semoga bermanfaat dan terus tidak menyerah untuk belajar computer vision. Happy python&#8230;:)