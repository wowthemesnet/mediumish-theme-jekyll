---
id: 361
title: Mengapa Equals dan Hashcode?
date: 2019-06-24T11:34:45+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=361
permalink: /mengapa-equals-dan-hashcode/
wp_last_modified_info:
  - June 24, 2019 @ 9:19 pm
wplmi_shortcode:
  - '[lmt-post-modified-info]'
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
categories:
  - Java
tags:
  - collection
  - equals hashcode
  - java
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/header-equals-hashcode-e1561350652107-1024x474.jpg" alt="Header equals hashcode" class="wp-image-362" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/header-equals-hashcode-e1561350652107-1024x474.jpg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/06/header-equals-hashcode-e1561350652107-300x139.jpg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/06/header-equals-hashcode-e1561350652107-768x355.jpg 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
</div>

Bismillah,  
Pada kesempatan ini saya akan membahas sebuah method yang mungkin sering terlupakan bagi Anda yang baru belajar atau mengenal java, tetapi bagi para programmer java sejati sudah biasa dan artikel ini sepertinya terasa garing. Agar sistematis alurnya saya membagi artikel ini menjadi beberapa point seperti di bawah ini

  * [Pendahuluan](#Pendahuluan)
  * [Contoh Kasus](#Contoh-Kasus)
  * [Penerapan Equals dan Hashcode](#Penerapan-Equals-dan-Hashcode)
  * [References](#References)

#### Pendahuluan {#Pendahuluan}

Equals dan hascode merupakan sebuah method yang terdapat pada class `Object` atau paket `java.lang`, sehingga ketika kita membuat sebuah class maka akan mewarisi kedua method tersebut. Method equals digunakan untuk membandingkan 2 objek apakah sama atau tidak, objek yang sama maksudnya adalah sama secara logis walaupun memiliki reference yang berbeda atau alamat memori berbeda. Selain itu biasanya digunakan dalam collection ketika akan menampung sebuah objek.

Sedangkan hashcode sebuah method yang mengembalikan nilai integer tertentu, nilai integer tersebut di-generate berdasarkan nilai attribut atau field yang terdapat pada sebuah objek. Sehingga ketika class yang di-instance berulang kali dengan nilai attribut atau field yang sama akan menghasil nilai hashcode yang sama. 

#### Contoh Kasus {#Contoh-Kasus}

Untuk memudahkan gambaran mengenai penjelasan method equals dan hashcode di atas, dicontohkan sebuah kode program seperti di bawah ini

<pre class="wp-block-code"><code>public class Mahasiswa{

    private long id;
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

    //Getter dan setter

}</code></pre>

Selanjutnya kita buatkan unit test untuk menginstance dari class `Mahasiswa` untuk melihat pengaruh method equals dan hashcode, kira-kira seperti ini unit test yang kita buat

<pre class="wp-block-code"><code>public class MahasiswaTest {

    @Test
    public void testEqualsHashcode() {
        Set&lt;Mahasiswa> s = new HashSet&lt;>();
        Mahasiswa m = new Mahasiswa("075410099", "Noprianto", 3.99F, "Teknologi Informasi");
        m.setId(1L);
        Mahasiswa m1 = new Mahasiswa("075410099", "Noprianto", 3.99F, "Teknologi Informasi");
        m1.setId(1L);
        
        s.add(m);
        s.add(m1);
        s.forEach((mhs) -> {
            System.out.println("" + mhs);
        });
        assertTrue(m.equals(m1));
    }

}</code></pre>

Kemudian kita jalankan unit test di atas, hasilnya dapat dilihat pada tampilan di bawah ini

<pre class="wp-block-preformatted">T E S T S
Running com.odeng.maven.equals.hashcode.entitas.MahasiswaTest
Mahasiswa{id=1, nim=075410099, nama=Noprianto, ipk=3.99, jurusan=Teknologi Informasi}
Mahasiswa{id=1, nim=075410099, nama=Noprianto, ipk=3.99, jurusan=Teknologi Informasi}
Tests run: 1, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.2 sec &lt;&lt;&lt; FAILURE!
Results :
Failed tests:   testEqualsHashcode(com.odeng.maven.equals.hashcode.entitas.MahasiswaTest)
Tests run: 1, Failures: 1, Errors: 0, Skipped: 0</pre>

Output di atas menampilkan bahwa objek `m` dan objek `m1` padahal semua nilai attributnya sama, hal ini terjadi karena ada keyword `new` ketika membuat sebuah instance sehingga akan dialokasikan ke alamat tertentu.

#### Penerapan Equals dan Hashcode {#Penerapan-Equals-dan-Hashcode}

Setelah adanya kasus di atas, hal yang perlu dilakukan adalah dengan melakukan override kedua method tersebut. Untuk dapat meng-override ulang method tersebut sudah tersedia pada kebanyakan editor, misalkan saya menggunakan Netbeans 8.2. Ketika menggunakan Netbeans langkah yang dilakukan adalah dengan cara `klik kanan class Mahasiswa - Insert Code - equals() and hashcode() - pilih attributnya semua - klik Generate`. Hasilnya setelah di-genereate adalah sebagai berikut

<pre class="wp-block-code"><code>@Override
    public int hashCode() {
        int hash = 3;
        hash = 17 * hash + (int) (this.id ^ (this.id >>> 32));
        hash = 17 * hash + Objects.hashCode(this.nim);
        hash = 17 * hash + Objects.hashCode(this.nama);
        hash = 17 * hash + Float.floatToIntBits(this.ipk);
        hash = 17 * hash + Objects.hashCode(this.jurusan);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Mahasiswa other = (Mahasiswa) obj;
        if (this.id != other.id) {
            return false;
        }
        if (Float.floatToIntBits(this.ipk) != Float.floatToIntBits(other.ipk)) {
            return false;
        }
        if (!Objects.equals(this.nim, other.nim)) {
            return false;
        }
        if (!Objects.equals(this.nama, other.nama)) {
            return false;
        }
        if (!Objects.equals(this.jurusan, other.jurusan)) {
            return false;
        }
        return true;
    }</code></pre>

Selanjutnya jalankan kembali unit test dan bisa dilihat output yang dihasilkan setelah meng-override kedua method tersebut

<pre class="wp-block-preformatted">T E S T S
Running com.odeng.maven.equals.hashcode.entitas.MahasiswaTest
Mahasiswa{id=1, nim=075410099, nama=Noprianto, ipk=3.99, jurusan=Teknologi Informasi}
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.227 sec
Results :
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0</pre>

Terlihat pada output di atas bahwa pengujian menggunakan unit test berhasil, antar objek `m` dan `m1` ketika dibandingkan hasilnya `true` walaupun terdapat pada lokasi memori yang berbeda. Pada collection juga yang tersimpan hanya 1 objek, tidak seperti yang sebelumnya bahwa keduanya ikut tertampil. Penerapan equals dan hashcode sangat penting, terlebih jika akan membangun sebuah aplikasi yang bersifat transactional dan keakuratan data sangat diperhatikan. Kode lengkap di atas silakan bisa didapatkan di <a href="https://github.com/0d3ng/maven-equals-hashcode.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah pembahasan tentang method equals dan hashcode pada pemrograman java, semoga bermanfaat dan selalu semangat buat berkoding ria dengan java. Untuk kritik dan saran silakan dicoret-coret dengan tujuan memberi motivasi penulis memperbaiki konten blog ini. 🙂

#### References {#References}

  * <https://docs.jboss.org/hibernate/stable/core.old/reference/en/html/persistent-classes-equalshashcode.html>
  * <https://vladmihalcea.com/the-best-way-to-implement-equals-hashcode-and-tostring-with-jpa-and-hibernate/>
  * Bima, Ifnu.2011._Java Desktop_