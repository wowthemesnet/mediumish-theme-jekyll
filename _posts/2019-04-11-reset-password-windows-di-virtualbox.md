---
id: 101
title: Reset Password Windows Di VirtualBox
date: 2019-04-11T09:32:45+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=101
permalink: /reset-password-windows-di-virtualbox/
wp_last_modified_info:
  - June 14, 2019 @ 7:47 pm
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
  - lupa password
  - Mac OS
  - reset password
  - virtualbox
  - windows7
---
Bismillah,  
Pada kesempatan kali ini saya akan buat artikel yang berbeda dari yang sangat berbeda sebelumnya. Kejadian ini terjadi ketika saya install windows di VirtualBox, karena lama tidak saya gunakan kemudian ada kebutuhan untuk menggunakannya tetapi saya lupa password windows yang saya install. Sudah ada di benak saya untuk install ulang windows tersebut, tetapi tentunya akan wasting time karena harus konfigurasi lagi dan install software-software semua dari awal. So Sad&#8230;:(  


Setelah browsing akhirnya menemukan tool yang menurut saya sangat bermanfaat bagi temen-temen yang mengalami kasus sama seperti saya. Sebenarnya ada 2 tool yang saya coba yang pertama adalah _pcunlocker_ dan _Trinity Rescue Kit_. Perbedaannya adalah _pcunlocker_ berbayar sedangkan _Trinity Rescue Kit Free_ karena termasuk live distribusi linux, saya menyarankan _Rescue Kit Free_.

<blockquote class="wp-block-quote">
  <p>
    Trinity Rescue Kit or TRK is a&nbsp;<strong>free&nbsp;</strong>live Linux distribution that aims specifically at&nbsp;<strong>recovery and repair operations&nbsp;</strong>on Windows machines, but is equally usable for Linux recovery issues
  </p>
  
  <cite>quote dari website resminya dia di <a href="http://trinityhome.org/Home/index.php?content=TRINITY_RESCUE_KIT____CPR_FOR_YOUR_COMPUTER&front_id=12&lang=en&locale=en" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.</cite>
</blockquote>

Agar lebih sistematis akan saya bagi ke beberapa topik untuk artikel ini

  * [Install Trinity Rescue Kit](#install-trinity-rescue-kit)
  * [Menjalankan Trinity Rescue Kit](#menjalankan-trinity-rescue-kit)
  * [Command Trinity Rescue Kit](#command-trinity-rescue-kit)
  * [Penutup](#penutup)
  * [Referensi](#referensi)

#### Install Trinity Rescue Kit {#install-trinity-rescue-kit}

Seperti dijelaskan di atas bahwa software ini adalah live distribution linux sehingga perlu pasang menggunakan live CD atau load file iso yang sudah kita download sebelumnya. Untuk mendownload silakang mengunjungi website resminya di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="http://trinityhome.org/Home/index.php?content=TRINITY_RESCUE_KIT_DOWNLOAD&front_id=12&lang=en&locale=en" target="_blank">sini</a>, versi yang pernah saya gunakan ketika menulis artikel ini adalah 3.4 build 372.

Silakan buka VirtualBox Anda selanjutnya pilih windows yang akan direset &#8211; _Settings_ &#8211; _Storage_. 

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/TRK-e1554968267453.png" alt="" class="wp-image-102" /><figcaption>Tampilan ketika akan menambahkan file iso</figcaption></figure>
</div>

Kemudian pada bagian _Controller SATA_, _Adds optical drive_ &#8211; pilih _choose disk_ &#8211; klik tombol _Add_, silakan cari file iso _Trinity Rescue Kit_. Jika sudah ketemu, silakan klik tombol _Choose_.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/TRK-1-e1554968454257.png" alt="" class="wp-image-103" /><figcaption>Dialog browse file iso</figcaption></figure>
</div>

Seharusnya nanti akan ditambahkan pada daftar Controller SATA seperti ditunjukkan pada gambar di bawah ini, pastikan SATA Port yang terkecil adalah file iso _Trinity Rescue Kit_ agar bisa boot langsung dari file iso tersebut.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/TRK-2-e1554968741853.png" alt="" class="wp-image-104" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/TRK-2-e1554968741853.png 398w, https://www.sinaungoding.com/wp-content/uploads/2019/04/TRK-2-e1554968741853-300x252.png 300w" sizes="(max-width: 398px) 100vw, 398px" /><figcaption>File iso masuk ke daftar controller: SATA</figcaption></figure>
</div>

#### Menjalankan Trinity Rescue Kit {#menjalankan-trinity-rescue-kit}

Selanjutnya jalankan windows Anda melalui tombol Start, seharusnya nanti akan muncul tampilan seperti di bawah ini jika berhasil boot ke _Trinity Rescue Kit._

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/TRK-3-e1554974423337.png" alt="" class="wp-image-113" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/TRK-3-e1554974423337.png 475w, https://www.sinaungoding.com/wp-content/uploads/2019/04/TRK-3-e1554974423337-300x205.png 300w" sizes="(max-width: 475px) 100vw, 475px" /><figcaption>Menu utama TRK</figcaption></figure>
</div>

Setelah masuk ke dalam menu _Trinity Rescue Kit,_ pilih menu _windows password resetting_ seperti pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/TRK-4-e1554975097189.png" alt="" class="wp-image-111" /><figcaption>Windows password resetting</figcaption></figure>
</div>

Kemudian akan muncul kembali menu seperti di bawah ini, pilihlah _Reset password on build-in Administrator (default action)_ jika Anda mengaktifkan akun Administrator. Tetapi pada kesempatan ini yang akan kita pilih adalah _Winpass with prompt for username first_, masukan username Anda dan akan muncul informasi yang menginfokan bahwa file installasi windows ditemukan, silakan dipilih sesuai dengan yang terinstall di VirtualBox Anda. Jika ditempat saya di /sd2/windows atau 1.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/TK-9-e1554974599775.png" alt="" class="wp-image-112" /><figcaption>Winpass with prompt for username first</figcaption></figure>
</div>

Akan muncul informasi-informasi terkait dengan pengguna yang terdaftar pada windows Anda dan juga informasi operasi-operasi yang dapat dilakukan, misalkan seperti _Clear (blank) user password_. Silakan pilih _Clear (blank) user password_ untuk menghapus password Anda, jika berhasil tampilannya adalah seperti di bawah ini. Selanjutnya silakan Anda masuk ke Windows Anda. 

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/04/TK-10-e1554974729728.png" alt="" class="wp-image-110" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/04/TK-10-e1554974729728.png 519w, https://www.sinaungoding.com/wp-content/uploads/2019/04/TK-10-e1554974729728-300x203.png 300w" sizes="(max-width: 519px) 100vw, 519px" /><figcaption>Clear user password selesai</figcaption></figure>
</div>

#### Command Trinity Rescue Kit {#command-trinity-rescue-kit}

Sebenarnya Trinity Rescue Kit juga menyediakan perintah-perintah yang fungsinya sama dengan yang sebelumnya pernah dijelaskan di atas, temen-temen yang suka command based mungkin ini bisa menjadi alternative karena lebih cepat. Untuk lebih jelasnya silakan mengunjungi dokumentasinya yang ada di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="http://trinityhome.org/Home/index.php?content=3922.2_WINPASS_AND_REGEDIT&front_id=12&lang=en&locale=en" target="_blank">sini</a>. Contoh untuk reset password berdasarkan username, ketikkan perintah di bawah ini

<pre class="wp-block-code"><code>winpass -u "odeng"</code></pre>

Perintah di atas digunakan untuk reset password dengan username &#8220;odeng&#8221;, silakan sesuaikan dengan username yang akan Anda reset. Langkah selanjutnya atau prompt-prompt akan muncul seperti langkah di atas.

#### Penutup {#penutup}

Demikianlah artikel saya tentang reset password windows di VirtualBox, semoga bermanfaat bagi temen-temen. Silakan diexplore fungsi-fungsi yang ada pada _Trinity Rescue Kit_, karena yang saya coba hanya satu fungsi dari beberapa fungsi yang ada pada software tersebut.

#### Referensi {#referensi}

  * <http://www.notoriouswebmaster.com/2015/05/23/cracking-into-your-virtualbox-windows-7-vm-when-youve-forgotten-the-password/>
  * [http://trinityhome.org/Home/index.php?content=3922.2\_WINPASS\_AND\_REGEDIT&front\_id=12&lang=en&locale=en](http://trinityhome.org/Home/index.php?content=3922.2_WINPASS_AND_REGEDIT&front_id=12&lang=en&locale=en)
  * <https://www.top-password.com/knowledge/unlock-windows-password.html>