---
id: 54
title: Menghubungkan Raspberry pi ke Laptop dengan VNC
date: 2019-04-03T11:46:06+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=54
permalink: /menghubungkan-raspberry-pi-ke-laptop-dengan-vnc/
wp_last_modified_info:
  - June 14, 2019 @ 7:57 pm
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
  - raspberry
  - raspberry-pi-indonesia
  - remote
  - ssh
  - vnc
---
<blockquote class="wp-block-quote">
  <p>
    Coba pakai vnc pak ke rpi nya untuk check dia sendiri bisa nyala ndak.
  </p>
  
  <cite>salah satu member grup di Raspberry PI Indonesia</cite>
</blockquote>

<blockquote class="wp-block-quote">
  <p>
    Yups remote display lebih mudah dibanding ssh harusnya. Hehe
  </p>
  
  <cite>salah satu member grup di Raspberry PI Indonesia</cite>
</blockquote>

Bismillah,  
Berawal dari error yang saya alami ketika menjalankan aplikasi python nggak bisa muncul windowsnya kemudian saya tanyakan ke grup Raspberry PI Indonesia, ternyata ada yang mengampaikan quote seperti di atas dan akhirnya saya coba install VNC. Jika pada <a href="http://www.sinaungoding.com/wordpress/2019/03/30/akses-raspberry-pi-gui-via-terminal-mac-os/" target="_blank" rel="noreferrer noopener" aria-label="postingan yang lalu (opens in a new tab)">postingan yang lalu</a> saya membahas gimana caranya menghubungkan raspberry pi menggunakann ssh forwarding, kali ini menggunakan VNC(Virtual Network Computing). VNC merupakan sebuah aplikasi desktop yang digunakan sebagai remote control antara komputer yang satu(VNC server) dengan komputer yang lain(VNC client). Tanpa panjang lebar, silakan Anda masuk ke raspberry pi kemudian jalankan perintah di bawah ini pada terminal 

<pre class="wp-block-code"><code>sudo apt-get update
sudo apt-get install realvnc-vnc-server realvnc-vnc-viewer
sudo raspi-config</code></pre>

Sebenarnya perintah di yang pertama untuk menginstall paket untuk kebutuhan VNC, tetapi jika Anda sebelumnya install OS raspbian yang versi dekstop dan include software maka VNC sudah terinstall. Jika sudah silakan diaktifkan VNC terlebih dahulu, dengan memilih _Interfacing Options &#8211; VNC &#8211; Yes_ pada dialog _Raspberry Pi Software Configuration Tool_

Selanjutnya download vnc viewer di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://www.realvnc.com/en/connect/download/viewer/" target="_blank">sini</a>, kemudian silakan install dan jalankan vnc viewernya. Masukan username dan password raspberry pi Anda. Jujur saya lebih suka menggunakan ssh forwarding dibandingkan dengan VNC, mungkin karena belum terbiasa menggunakan VNC. Eh, ternyata resolusinya bisa disesuaikan sesuai dengan ukuran layar monitor laptop/komputer kita. Gimana konfigurasinya, mudah kan?

Demikianlah cara installasi VNC untuk urusan remote raspberry pi kita menggunakan lingkungan desktop yang lebih elegen dari terminal, jadi tidak ada alasan bagi yang alergi terhadap layar hitam atau terminal untuk mencoba raspberry pi. Semoga bermanfaat, ditunggu ya tutorial yang akan datang. 🙂

  * <https://www.raspberrypi.org/documentation/remote-access/vnc/>
  * <https://www.realvnc.com/en/connect/download/viewer/>