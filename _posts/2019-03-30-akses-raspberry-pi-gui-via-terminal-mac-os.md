---
id: 29
title: Akses Raspberry Pi GUI Via Terminal Mac OS
date: 2019-03-30T19:21:42+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=29
permalink: /akses-raspberry-pi-gui-via-terminal-mac-os/
wp_last_modified_info:
  - June 14, 2019 @ 8:26 pm
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
  - Mac OS
  - raspberry
  - xquartz
---
Bismillah,  
Pada artikel sebelumnya saya telah <a href="http://www.sinaungoding.com/wordpress/2019/03/29/installasi-raspberry-pi/" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">posting</a> langkah installasi sampai dengan akses melalui terminal. Pada kali ini saya akan mencoba akses melalui terminal juga tetapi versi desktopnya, jadi nanti seolah-olah kita menjalankan langsung raspberry di monitor komputer atau laptop kita. Di bawah ini adalah beberapa point yang akan kita bahas

  * [Cek GUI status raspberry](#cek-GUI-status-raspberry)
  * [Install xquartz](#install-xquartz)
  * [Running aplikasi GUI raspberry](#running-aplikasi-GUI-raspberry)
  * [Running desktop raspberry](#running-desktop-raspberry)
  * [Penutup](#penutup)
  * [Referensi](#referensi)

#### Cek GUI status raspberry {#cek-gui-status-raspberry}

Sebelum memulai pastikan terlebih dahulu raspberry sudah terinstall versi desktop-nya, bisa dicek menggunakan command di bawah ini.

<pre class="wp-block-preformatted">pi@raspberrypi:~ $ dpkg -l | grep raspberrypi-ui-mods<br /> ii  raspberrypi-ui-mods                   1.20190219                        all          Config to customise the LXDE UI for the Raspberry Pi<br /></pre>

#### Install xquartz {#install-xquartz}

Mac OS tidak memiliki X11 untuk melakukan interaksi antara mouse dan keyboard layaknya sistem operasi unix pada umumnya, sehingga membutuhkan library yaitu xquartz. Xquartz merupakan sebuah projek yang dikembangkan secara komunitas oleh Apple untuk mendukung X11 di Mac OS. Silakan download xquartz terbaru di <a rel="noreferrer noopener" aria-label="website resminya (opens in a new tab)" href="https://www.xquartz.org/" target="_blank">website resminya</a>, ketika saya menulis ini versinya adalah 2.7.11. Setelah selesai proses installasi, disarankan logout agar proses installasi berhasil.

#### Running aplikasi GUI raspberry {#running-aplikasi-GUI-raspberry}

Selanjutnya buka terminal di Mac OS dan jalankan baris perintah di bawah ini untuk mengecek apakah proses installasi berhasil

<pre class="wp-block-code"><code>ssh -Y pi@192.168.8.102
idle3 &</code></pre>

Seharusnya nanti akan muncul jendela python editor di laptop atau komputer Anda. Silakan dicoba aplikasi-aplikasi GUI yang sudah terinstall pada raspberry Anda.

#### Running desktop raspberry {#running-desktop-raspberry}

Kita sudah berhasil install xquartz dan menjalankan aplikasi GUI melalui terminal komputer atau laptop kita, untuk dapat menjalankan desktop raspberry dengan mengetikan perintah di bawah ini

<pre class="wp-block-preformatted">$ ssh -X pi@192.168.8.102<br /> Last login: Sun Mar 31 01:04:18 2019 from 192.168.8.101<br />pi@raspberrypi:~ $ startlxde-pi<br /> ** Message: main.vala:102: Session is LXDE-pi<br /> ** Message: main.vala:103: DE is LXDE<br /> (lxsession:12073): Gtk-WARNING **: Locale not supported by C library.<br />     Using the fallback 'C' locale.<br /> ** Message: main.vala:134: log directory: /home/pi/.cache/lxsession/LXDE-pi<br /> ** Message: main.vala:135: log path: /home/pi/.cache/lxsession/LXDE-pi/run.log<br /> X11 connection rejected because of wrong authentication.</pre>

Seharusnya jika semua normal akan muncul jendela desktop raspberry pada layar monitor Anda, akan tetapi ada pesan error yang intinya adalah terjadi kesalahan autentifikasi. Hal tersebut terjadi karena X session tidak mengenali cookiesnya, tambahkan baris perintah di bawah ini agar pesan error hilang. Jalankan kembali perintah `startlxde-pi` setelah menambahkan cookies-nya.

<pre class="wp-block-preformatted">pi@raspberrypi:~ $ xauth list $DISPLAY<br /> raspberrypi/unix:10  MIT-MAGIC-COOKIE-1  6e36bed00b6772b7a6bb5ac0c26f7216<br /><br />pi@raspberrypi:~ $ sudo xauth add raspberrypi/unix:10  MIT-MAGIC-COOKIE-1  6e36bed00b6772b7a6bb5ac0c26f7216</pre>

Ketika muncul dialog error yang berbunyi &#8220;No session for pid xxx&#8221;, silakan jalankan baris perintah di bawah ini. Logout dari terminal client kemudian login dan jalankan kembali desktop raspberry.

<pre class="wp-block-code"><code>sudo mv /usr/bin/lxpolkit /usr/bin/lxpolkit.bak</code></pre>

#### Penutup {#penutup}

Demikianlah langkah-langkah untuk dapat kita gunakan untuk mengakses raspberry kita baik aplikasi GUI bahkan desktopnya, sehingga kita tidak perlu repot-repot untuk menancapkan monitor pada raspberry. Semoga bermanfaat buat temen-temen. Pada postingan yang akan datang akan saya coba menulis tentang bagaimana memasang modul camera di raspberry pi, ditunggu ya. Mohon doanya semoga saya istiqomah menulis di blog ini.

#### Referensi {#referensi}

  * <https://www.raspberrypi.org/documentation/remote-access/ssh/unix.md>
  * <https://support.apple.com/en-gb/HT201341>
  * <https://www.raspberrypi.org/forums/viewtopic.php?t=151447>
  * <https://raspberrypi.stackexchange.com/questions/1719/x11-connection-rejected-because-of-wrong-authentication/1722>
  * <https://github.com/meefik/linuxdeploy/issues/978>