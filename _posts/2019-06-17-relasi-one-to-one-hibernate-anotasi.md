---
id: 262
title: Relasi One to One Hibernate Anotasi
date: 2019-06-17T21:37:25+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=262
permalink: /relasi-one-to-one-hibernate-anotasi/
wp_last_modified_info:
  - June 18, 2019 @ 7:25 am
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
  - asosiasi
  - bidirectional
  - hibernate
  - java
  - one-to-one
  - unidirectional
---
Bismillah,  
Jika pada artikel <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/mengenal-identifier-framework-hibernate/" target="_blank">sebelumnya</a> kita telah membahas mengenai identifier di hibernate, pada kesempatan ini akan belajar mengenai relasi atau sering disebut assosiasi. Aplikasi yang akan kita bangun mustahil jika entitas tidak berelasi dengan entitas yang lain, walaupun aplikasi yang sederhana pun. Bisa saja aplikasi yang kita bangun hanya terdapat 1 entitas atau tidak ada relasi antar entitas, tapi fungsi aplikasi tidak akan maksimal.

Tujuan dari relasi antar entitas adalah agar bisa saling bertukar informasi, ada dua model relasi yang sering kita dengar yaitu `Unidirectional dan Bidirectional`. `Unidirectional` adalah hanya akan ada salah satu entitas yang bertukar informasi, sebaliknya `Bidirectional` berarti antar entitas bisa saling bertukar informasi. Relasi yang dapat digunakan adalah `OneToOne, OneToMany, dan ManyToMany`. Tetapi pada kesempatan ini yang akan kita bahas adalah relasi `OneToOne`, pokok bahasan yang dapat disajikan adalah sebagai berikut

  * `<a href="#@OneToOne-Join-Kolom-Unidirectional">@OneToOne</a>` [Join Kolom Unidirectional](#@OneToOne-Join-Kolom-Unidirectional)
  * `<a href="#@OneToOne-Join-Kolom-Bidirectional">@OneToOne</a>` [Join Kolom Bidirectional](#@OneToOne-Join-Kolom-Bidirectional)
  * `<a href="#@OneToOne-Join-Table">@OneToOne</a>` [Join Tabel](#@OneToOne-Join-Table)
  * `<a href="#@OneToOne-Share-Primary-Key">@OneToOne</a>` [Share Primary Key](#@OneToOne-Share-Primary-Key)

#### `@OneToOne` Join Kolom Unidirectional {#@OneToOne-Join-Kolom-Unidirectional}

Salah satu model yang digunakan adalah join kolom, pada hibernate menggunakan anotasi `@JoinColumn` setelah anotasi `@OneToOne`. Misalkan kita punya relasi di database seperti gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one.png" alt="One to one relational" class="wp-image-268" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one.png 431w, https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one-300x214.png 300w" sizes="(max-width: 431px) 100vw, 431px" /><figcaption>One to one relational join kolom</figcaption></figure>
</div>

Dari gambar di atas akan kita coba mapping ke dalam class Java seperti di bawah ini menggunakan anotasi `@OneToOne` dengan model `@JoinColumn`.

<pre class="wp-block-code"><code>@Entity
@Table
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "alamat_id")
    private Alamat alamat;

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan, Alamat alamat) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
        this.alamat = alamat;
    }

//Getter setter bisa digenerate menggunakan IDE</code></pre>

Sementara untuk entitas `Alamat` standard tidak ada yang istimewa, beberapa property yang sebelumnya belum digunakan `cascade = CascadeType.ALL, fetch = FetchType.LAZY, dan orphanRemoval = true`. `cascade` digunakan dalam masalah konsistensi data, `CascadeType.ALL` berarti semua operasi(update,delete,dll) data berpengaruh ke entitas tersebut. `fetch` berkaitan dengan retrieve data atau load data ketika ada entitas yang saling berelasi, `FetchType.LAZY` berarti tidak secara automatis diload atau hanya diload ketika ada objek yang dipanggil. Sedangkan kebalikannya adalah `FetchType.EAGER`, sementara `orphanRemoval = true` berfungsi agar ketika menghapus record pada entitas maka akan terhapus juga pada entitas yang berelasi.

Contoh di atas adalah model relasi `Unidirectional`, dimana class `Alamat` menjadi instance di dalam class `Mahasiswa`. Dapat dikatakan bahwa class `Mahasiswa` dapat mengambil informasi instance dari class `Alamat`, sedangkan class `Alamat` tidak bisa melihat informasi class `Mahasiswa`. 

#### `@OneToOne` Join Kolom Bidirectional {#@OneToOne-Join-Kolom-Bidirectional}

Jika pada contoh sebelumnya adalah model relasi `Unidirectional`, kita akan coba untuk contoh yang `Bidirectional`. Relasi tabel pada database kira-kira seperti ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one-bidi.png" alt="One to one relational bidirectional" class="wp-image-272" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one-bidi.png 403w, https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one-bidi-300x157.png 300w" sizes="(max-width: 403px) 100vw, 403px" /><figcaption>One to one relational bidirectional</figcaption></figure>
</div>

Relasi tabel di atas one to one bidirectional karena satu mahasiswa hanya memiliki satu alamat, alamat bergantung dengan mahasiswa artinya tidak mungkin ada alamat tanpa ada mahasiswa. Setelah kita mapping ke dalam class Java menggunakan hibernate, yang perlu dilakukan adalah sebagai berikut

<pre class="wp-block-code"><code>@Entity
@Table
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToOne(mappedBy = "mahasiswa", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Alamat alamat;

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan, Alamat alamat) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
        this.alamat = alamat;
    }

    public String getNim() {
        return nim;
    }

    public void setNim(String nim) {
        this.nim = nim;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public float getIpk() {
        return ipk;
    }

    public void setIpk(float ipk) {
        this.ipk = ipk;
    }

    public String getJurusan() {
        return jurusan;
    }

    public void setJurusan(String jurusan) {
        this.jurusan = jurusan;
    }

    public Alamat getAlamat() {
        return alamat;
    }

    public void setAlamat(Alamat alamat) {
        if (alamat == null) {
            if (this.alamat != null) {
                this.alamat.setMahasiswa(null);
            }
        } else {
            alamat.setMahasiswa(this);
        }
        this.alamat = alamat;
    }

    public void removeAlamat() {
        if (alamat != null) {
            alamat.setMahasiswa(null);
            alamat = null;
        }
    }

    @Override
    public String toString() {
        return "Mahasiswa{" + "nim=" + nim + ", nama=" + nama + ", ipk=" + ipk + ", jurusan=" + jurusan + ", alamat=" + alamat + '}';
    }

}</code></pre>

Pada anotasi `@OneToOne` terdapat property `mappedBy = "mahasiswa"`, bearti nanti akan ada instance dengan nama &#8220;mahasiswa&#8221; pada entitas yang lain yaitu entitas `Alamat`. Selain itu yang method `setAlamat()` terdapat implementasi yang berbeda, intinya adalah selain set instance alamat dengan parameter yang dilewatkan juga set mahasiswa pada entitas `Alamat`. Sementara mapping entitas `Alamat` seperti di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table
public class Alamat implements Serializable {

    @Id
    @GeneratedValue
    private long id;
    private String nama_jalan;
    private int RT;
    private int RW;
    private String kota;
    private String provinsi;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nim")
    private Mahasiswa mahasiswa;

    public Alamat() {
    }

    public Alamat(String nama_jalan, int RT, int RW, String kota, String provinsi) {
        this.nama_jalan = nama_jalan;
        this.RT = RT;
        this.RW = RW;
        this.kota = kota;
        this.provinsi = provinsi;
    }

//getter setter silakan digenerate dengan IDE</code></pre>

Pada entitas `Alamat` terdapat anotasi `@OneToOne` juga karena `Bidirectional` yang menandakan bahwa saling bisa berbagi informasi antara kedua entitas. Untuk merelasikan menggunakan anotasi `@JoinColumn`, berarti nanti ada identifer entitas `Mahasiwa` yang menjadi foreign key pada entitas `Alamat` dalam hal ini yaitu `"nim"`. Kemudian untuk unit test juga sedikit berbeda dari yang Unidirectional, bisa dilhat seperti contoh di bawah ini

<pre class="wp-block-code"><code>@Test
    public void testSave() {
        Alamat a = new Alamat("Jln. Simpang Setaman 1", 6, 15, "Malanga", "Jawa Timur");
        Mahasiswa m = new Mahasiswa("075410099", "Noprianto", 3.99F, "Teknologi Informasi", a);
        m.setAlamat(a);
        assertTrue(service.save(m));
    }</code></pre>

Pada unit test terdapat 1 baris perintah `m.setAlamat(a)` untuk set entitas Mahasiswa, jika hal tersebut tidak dilakukan kolom nim yang terdapat pada tabel alamat nanti nilainya null.

#### `@OneToOne` Join Table {#@OneToOne-Join-Table}

Sesuai dengan namanya relasi `@OneToOne` ini berarti akan membuat sebuah tabel bantu untuk menampung primary key masing-masing entitas. Ilustrasi join tabel digambarkan seperti di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one-jointable.png" alt="One to one join table" class="wp-image-271" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one-jointable.png 603w, https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-one-jointable-300x93.png 300w" sizes="(max-width: 603px) 100vw, 603px" /><figcaption>One to one join table</figcaption></figure>
</div>

Kemudian kita coba mapping ke dalam class Java menggunakan hibernate anotasi yang merepresentasikan tabel relational seperti di atas.

<pre class="wp-block-code"><code>@Entity
@Table
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinTable(name = "Mahasiswa_Alamat",joinColumns = @JoinColumn(name = "nim"),inverseJoinColumns = @JoinColumn(name = "alamat_id"))
    private Alamat alamat;

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan, Alamat alamat) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
        this.alamat = alamat;
    }

//getter setter silakan digenerate menggunakan IDE</code></pre>

Untuk melakukan join tabel relasi one to one menggunakan anotasi @JoinTable dengan property seperti `name = "Mahasiswa_Alamat",joinColumns = @JoinColumn(name = "nim"),inverseJoinColumns = @JoinColumn(name = "alamat_id")` maksudnya adalah membuat tabel baru dengan nama `"Mahasiswa_Alamat"` dengan `"nim"` yang dijoinkan dengan `"alamat_id"`.

#### `@OneToOne` Share Primary Key {#@OneToOne-Share-Primary-Key}

Mekanisme model relasi ini adalah dengan menjadikan primary key suatu entitas dijadikan primary key juga untuk entitas yang lain, untuk dapat melakukannya tentunya nama kolom dan tipenya harus sama. Hibernate menggunakan anotasi `@PrimaryKeyJoinColumn` setelah anotasi `@OneToOne`. Untuk kasus entitas `Mahasiswa` dan entitas `Alamat` tidak dapat digunakan sebagai contoh karena identifier pada entitas `Mahasiswa` bertipe `String`, sedangkan entitas `Alamat` bertipe `long`. Untuk source code bisa didapatkan di <a href="https://github.com/0d3ng/maven-hibernate-association.git" target="_blank" rel="noreferrer noopener" aria-label="github (opens in a new tab)">github</a> saya.

Demikianlah artikel saya tentang penerapan asosiasi `@OneToOne` menggunakan hibernate, masih terdapat asosiasi yang lain seperti `@OneToMany` dan `@ManyToMany`. Insya alloh pada tulisan yang akan datang akan saya bahas, semoga artikel ini bermanfaat dan menambah pengetahuan baru. Kritik dan saran sangat diharapkan untuk meningkatkan kwalitas blog ini. 🙂