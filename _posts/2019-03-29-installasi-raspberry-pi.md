---
id: 6
title: 'Installasi Raspberry  Pi'
date: 2019-03-29T09:13:17+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=6
permalink: /installasi-raspberry-pi/
wp_last_modified_info:
  - June 14, 2019 @ 8:29 pm
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
---
Bismillah,  
Siapa yang tidak kenal dengan raspberry, sebuah komputer mini dengan kemampuannya yang hampir mendekati dengan komputer pada umumnya. Dengan ukuran yang kecil dan harga yang terjangkau sehingga sangat praktis jika digunakan, baik digunakan untuk kepentingan akademik ataupun industrial

Kebetulan saya baru beli raspberry untuk belajar computer vision di online shop, setelah mencari-cari saya memilih fullset raspberry pi 3 B + sehingga tinggal dicolokan terus bisa digunakan tanpa perlu beli komponen yang lain. Untuk detail spesifikasi raspberry tersebut bisa ngecek di [official websitenya.](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/) Beberapa point yang perlu dilakukan untuk melakukan installasi adalah sebagai berikut;

  * [Install OS raspberry pi](#install-os-raspberry)
  * [Konfigurasi network](#konfigurasi-network)
  * [Masuk ke raspberry pi](#masuk-ke-raspberry-pi)
  * [Mengubah timezone](#mengubah-timezone)
  * [Update dan upgrade](#update-dan-upgrade)
  * [Passwordless login](#passwordless-login)
  * [Automount USB](#automount-USB)
  * [Penutup](#penutup)
  * [Referensi](#referensi)

#### Install OS raspberry pi {#install-os-raspberry}

Sebenarnya ketika saya membeli sudah termasuk OS, tapi saya masih kurang puas untuk jika tidak melakukan sendiri. Infonya dari penjual OS yang sudah terinstall adalah raspbian desktop exclude software, yang akan saya install masih sama yaitu raspbian dekstop include software. Raspbian merupakan OS official dari raspberry, sebenarnya masih bisa memiliki OS yang lain jika temen-temen ingin mencobanya. Daftarnya bisa dicek di <a rel="noreferrer noopener" aria-label="website raspberry (opens in a new tab)" href="https://www.raspberrypi.org/downloads/raspbian/" target="_blank">website raspberry</a>. Setelah download OS selanjutnya adalah install OS ke microSD, cek terlebih dahulu microSD tersebut terletak dilokasi mana. Saya menggunakan mac OS

<pre class="wp-block-code"><code>diskutil list</code></pre>

outputnya

<pre class="wp-block-preformatted">/dev/disk0 (internal, physical):<br />    #:                       TYPE NAME                    SIZE       IDENTIFIER<br />    0:      GUID_partition_scheme                        *250.1 GB   disk0<br />    1:                        EFI EFI                     209.7 MB   disk0s1<br />    2:                 Apple_APFS Container disk1         199.8 GB   disk0s2<br />    3:                  Apple_HFS DATA                    49.9 GB    disk0s3<br /><br />/dev/disk1 (synthesized):<br />    #:                       TYPE NAME                    SIZE       IDENTIFIER<br />    0:      APFS Container Scheme -                      +199.8 GB   disk1<br />                                  Physical Store disk0s2<br />    1:                APFS Volume OD3NG                   101.7 GB   disk1s1<br />    2:                APFS Volume Preboot                 23.0 MB    disk1s2<br />    3:                APFS Volume Recovery                509.8 MB   disk1s3<br />    4:                APFS Volume VM                      1.1 GB     disk1s4<br /><br />/dev/disk2 (external, physical):<br />    #:                       TYPE NAME                    SIZE       IDENTIFIER<br />    0:     FDisk_partition_scheme                        *15.9 GB    disk2<br />    1:             Windows_FAT_32 boot                    46.0 MB    disk2s1<br />    2:                      Linux                         15.9 GB    disk2s2</pre>

Dari output di atas ditampilkan bahwa MicroSD terletak pada `/dev/disk2` dengan type `Windows_FAT_32`

kemudian unmount disk tersebut agar bisa dilakukan copy file image ke MicroSD

<pre class="wp-block-code"><code>diskutil unmountDisk /dev/disk2</code></pre>

Langkah yang terakhir adalah melakukan copy file image yang sudah didownload sebelumnya ke MicroSD, jangan lupa menambahkan `r` pada alamat disknya.

<pre class="wp-block-preformatted"><code>$ sudo dd bs=1m if=Downloads/2018-11-13-raspbian-stretch-full.img of=/dev/rdisk2</code><br /><br />5052+0 records in<br /> 5052+0 records out<br /> 5297405952 bytes transferred in 388.597547 secs (13632114 bytes/sec)</pre>

Sampai langkah di atas sebenarnya sudah selesai untuk proses installasi, kemudian gimana caranya mengakses raspberry yang sudah terinstall? Karena saya tidak memiliki keyboard dan mouse apalagi monitor atau istilahnya headless raspberry, caranya adalah dengan melakukan remote raspberry tersebut dengan mengaktifkan ssh. Buat terlebih dahulu file ssh tanpa ekstensi pada direktori boot MicroSD, ketikan perintah di bawah ini melalui terminal

<pre class="wp-block-code"><code>touch /Volumes/boot/ssh</code></pre>

#### Konfigurasi network {#konfigurasi-network}

Raspberry pi 3 B+ sudah ditanamkan wifi untuk melakukan koneksi, raspberry tersebut akan coba saya konekan ke modem mifi agar ipnya gampang kita ketahui tetapi misalkan akan dikonekan ke jaringan yang lebih luas kita harus masuk ke router atau menggunakan tool untuk mengetahui ip yang terdapat pada raspberry kita. Raspberry bisa kita setting wifinya untuk konek ke apn tertentu tanpa harus masuk ke raspberry terlebih dulu, perintah yang dapat digunakan adalah sebagai berikut

<pre class="wp-block-code"><code>vim /Volumes/boot/wpa_supplicant.conf</code></pre>

Sebenarnya tidak harus menggunakan vim, silakan menggunakan editor teks favorit. Tetapi intinya adalah membuat file `wpa_supplicant.conf` dengan isi file seperti di bawah ini

<pre class="wp-block-preformatted">country=ID<br /> ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev<br /> update_config=1<br /> network={<br />    ssid="Noureen Cell"<br />    psk="lepengdados"<br /> }</pre>

Pada bagian ssid dan psk silakan diisikan sesuai dengan nama SSID dan password SSID yang digunakan. Sampai langkah ini selanjutnya kita akan login ke raspberry yang telah kita setting. Jangan lupa untuk meng-unmount MicroSD agar lebih aman menggunakan perintah yang telah kita gunakan di atas

<pre class="wp-block-code"><code>diskutil unmountDisk /dev/disk2</code></pre>

#### Masuk ke raspberry pi {#masuk-ke-raspberry-pi}

Setelah kita melakukan instalasi dengan OS raspberry yang terbaru dan mengkonfigurasi, selanjutnya kita akan mencoba raspberry. Seperti yang sudah saya sampaikan di atas bahwa, saya menggunakan modem mifi sehingga sangat mudah untuk mengetahui ip dan mac address raspberry tersebut. Langsung saja kita remote menggunakan ssh, untuk user default raspberry adalah _pi_ dan password yang digunakan _raspberry_

<pre class="wp-block-preformatted">$ ssh pi@192.168.8.102<br /> The authenticity of host '192.168.8.102 (192.168.8.102)' can't be established.<br /> ECDSA key fingerprint is SHA256:Qg/ZqSPIK3lthUUato2/sfEROurKDb5n0PvscSUJLQU.<br /> Are you sure you want to continue connecting (yes/no)? yes<br /> Warning: Permanently added '192.168.8.102' (ECDSA) to the list of known hosts.<br /> pi@192.168.8.102's password:<br /> Linux raspberrypi 4.14.79-v7+ #1159 SMP Sun Nov 4 17:50:20 GMT 2018 armv7l<br /> The programs included with the Debian GNU/Linux system are free software;<br /> the exact distribution terms for each program are described in the<br /> individual files in /usr/share/doc/*/copyright.<br /> Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent<br /> permitted by applicable law.<br /> Last login: Tue Nov 13 14:24:53 2018<br /> SSH is enabled and the default password for the 'pi' user has not been changed.<br /> This is a security risk - please login as the 'pi' user and type 'passwd' to set a new password.<br /> pi@raspberrypi:~ $<br /></pre>

#### Mengubah Timezone {#mengubah-timezone}

Coba ketikkan perintah di bawah ini

<pre class="wp-block-code"><code>pi@raspberrypi:~ $ date
Sat Mar 30 15:35:32 GMT 2019</code></pre>

Coba bandingkan dengan jam Anda saat ini, ya tentunya akan selisih sekitar 7 jam. Akan kita ubah sehingga menggunakan GMT+7 dengan perintah di bawah ini, nanti akan muncul dialog untuk menentukan lokasi. Pilih saja Asia untuk benua, dan Jakarta untuk daerahnya.

<pre class="wp-block-preformatted">pi@raspberrypi:~ $ sudo dpkg-reconfigure tzdata
perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
	LANGUAGE = (unset),
	LC_ALL = (unset),
	LC_CTYPE = "UTF-8",
	LANG = "en_GB.UTF-8"
    are supported and installed on your system.
perl: warning: Falling back to a fallback locale ("en_GB.UTF-8").
locale: Cannot set LC_CTYPE to default locale: No such file or directory
locale: Cannot set LC_ALL to default locale: No such file or directory
/usr/bin/locale: Cannot set LC_CTYPE to default locale: No such file or directory
/usr/bin/locale: Cannot set LC_ALL to default locale: No such file or directory

Current default time zone: 'Asia/Jakarta'
Local time is now:      Sat Mar 30 22:44:01 WIB 2019.
Universal Time is now:  Sat Mar 30 15:44:01 UTC 2019.</pre>

#### Update dan Upgrade {#update-dan-upgrade}

Walaupun kita sudah download OS terbaru dari official website raspberry tapi biasanya ada beberapa paket yang dibutuhkan untuk dilakukan update. Langkah yang dapat dilakukan bisa menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y && sudo apt-get autoclean && sudo reboot</code></pre>

#### Passwordless login {#passwordless-login}

Sesuai dengan namanya, ketika login ke raspberry kita tidak perlu memasukkan username dan password asalkan _public key_ laptop atau komputer sudah terdaftar. Cara mendaftarkan _public key_ tersebut adalah sebagai berikut

<pre class="wp-block-preformatted">$ ssh-copy-id pi@192.168.8.102<br /> /usr/bin/ssh-copy-id: ERROR: No identities found</pre>

Jangan kwatir dengan pesan error tersebut, hal tersebut terjadi karena belum ada public key pada laptop atau komputer kita. Untuk membuatnya dapat menggunakan perintah di bawah ini

<pre class="wp-block-preformatted">$ ssh-keygen -t rsa<br /> Generating public/private rsa key pair.<br /> Enter file in which to save the key (/Users/od3ng/.ssh/id_rsa):<br /> Enter passphrase (empty for no passphrase):<br /> Enter same passphrase again:<br /> Your identification has been saved in /Users/od3ng/.ssh/id_rsa.<br /> Your public key has been saved in /Users/od3ng/.ssh/id_rsa.pub.<br /> The key fingerprint is:<br /> SHA256:1Q85t2R/XMSKne9a2qWsuuKCM+/kELwXAlpbtaEkYcE od3ng@Od3ngs-MacBook-Pro.local<br /> The key's randomart image is:<br /> +---[RSA 2048]----+<br /> | .=o. o        ..|<br /> | .Eo o o   . . ..|<br /> |  o o .   . =o+o.|<br /> | o =     .  .B++.|<br /> |. . + . S     o.+|<br /> |     + .        o|<br /> |    o.o        .o|<br /> |    +=. .    . =o|<br /> |     =+o..oo..=..|<br /> +----[SHA256]-----+<br /><br />$ ssh-copy-id -i .ssh/id_rsa.pub pi@192.168.8.102<br /> /usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: ".ssh/id_rsa.pub"<br /> /usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed<br /> /usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys<br /> pi@192.168.8.102's password:<br /> Number of key(s) added:        1<br /> Now try logging into the machine, with:   "ssh 'pi@192.168.8.102'"<br /> and check to make sure that only the key(s) you wanted were added.</pre>

Selanjutnya kita tambahkan konfigurasi tambahan untuk menonaktifkan password ketika login, artinya hanya diizinkan menggunakan _public key._ Tambahkan konfigurasi seperti pada perintah di bawah ini

<pre class="wp-block-code"><code>sudo nano /etc/ssh/sshd_config</code></pre>

Sesuaikan nilai konfigurasi seperti di bawah ini

<pre class="wp-block-preformatted"><code>PermitRootLogin no </code><br /><code>PubkeyAuthentication yes </code><br /><code>ChallengeResponseAuthentication no </code><br /><code>PasswordAuthentication no UsePAM no</code></pre>

#### Automount USB {#automount-USB}

Di raspberry usb yang kita tancapkan tidak bisa plug and play seperti di windows, kemudian file type seperti NTFS juga tidak bisa langsung terbaca. Ada paket yang dibutuhkan terkait permasalah tersebut 

<pre class="wp-block-code"><code>sudo apt-get install usbmount ntfs-3g
sudo nano /etc/usbmount/usbmount.conf</code></pre>

Selanjutnya sesuai isi file tersebut seperti berikut ini

<pre class="wp-block-preformatted">FILESYSTEMS="vfat ntfs fuseblk ext2 ext3 ext4 hfsplus"<br /> FS_MOUNTOPTIONS="-fstype=ntfs-3g,nls=utf8,umask=007,gid=46 -fstype=fuseblk,nls=utf8,umask=007,gid=46 -fstype=vfat,gid=1000,uid=1000,umask=007"</pre>

<pre class="wp-block-code"><code>sudo nano /etc/udev/rules.d/usbmount.rules</code></pre>

Isi file tersebut seperti berikut ini

<pre class="wp-block-preformatted">KERNEL=="sd*", DRIVERS=="sbp2",         ACTION=="add",  PROGRAM="/bin/systemd-escape -p --template=usbmount@.service $env{DEVNAME}", ENV{SYSTEMD_WANTS}+="%c"
KERNEL=="sd*", SUBSYSTEMS=="usb",       ACTION=="add",  PROGRAM="/bin/systemd-escape -p --template=usbmount@.service $env{DEVNAME}", ENV{SYSTEMD_WANTS}+="%c"
KERNEL=="ub*", SUBSYSTEMS=="usb",       ACTION=="add",  PROGRAM="/bin/systemd-escape -p --template=usbmount@.service $env{DEVNAME}", ENV{SYSTEMD_WANTS}+="%c"
KERNEL=="sd*",                          ACTION=="remove",       RUN+="/usr/share/usbmount/usbmount remove"
KERNEL=="ub*",                          ACTION=="remove",       RUN+="/usr/share/usbmount/usbmount remove"</pre>

<pre class="wp-block-code"><code>sudo nano /etc/systemd/system/usbmount@.service</code></pre>

Isi file tersebut seperti berikut ini

<pre class="wp-block-code"><code>[Unit]
BindTo=%i.device
After=%i.device

[Service]
Type=oneshot
TimeoutStartSec=0
Environment=DEVNAME=%I
ExecStart=/usr/share/usbmount/usbmount add
RemainAfterExit=yes</code></pre>

Kemudian coba tancapkan flaskdisk yang Anda punya pada raspberry dan masuk ke terminal ketikkan perintah di bawah ini untuk mengetahui flaskdisk mount dimana

<pre class="wp-block-preformatted">pi@raspberrypi:~ $ tail -n2 /etc/mtab
/dev/sda1 /media/pi/ODENG vfat rw,nosuid,nodev,relatime,uid=1000,gid=1000,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,showexec,utf8,flush,errors=remount-ro 0 0
/dev/sda1 /media/usb0 vfat rw,nodev,noexec,noatime,nodiratime,uid=1000,gid=1000,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,showexec,utf8,flush,errors=remount-ro 0 0</pre>

#### Penutup {#penutup}

Demikian adalah langkah-langkah awal yang perlu kita lakukan ketikak baru memiliki raspberry, dalam hal ini yagn digunakan adalah raspberry 3B +. Semoga langkah-langkah di atas bermanfaat untuk yang baru memiliki raspberry seperti saya. Pada postingan yang akan datang akan saya coba menulis mengakses raspberry desktop menggunakan terminal, ditunggu ya. Mohon doanya semoga saya istiqomah menulis di blog ini.

#### Referensi {#referensi}

  * <https://software.endy.muhardin.com/linux/raspi-hardening/>
  * <https://stackoverflow.com/questions/22530886/ssh-copy-id-no-identities-found-error>