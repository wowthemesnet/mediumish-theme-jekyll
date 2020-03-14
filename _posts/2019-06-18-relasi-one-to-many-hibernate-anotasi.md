---
id: 275
title: Relasi One to Many Hibernate Anotasi
date: 2019-06-18T15:32:46+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=275
permalink: /relasi-one-to-many-hibernate-anotasi/
wp_last_modified_info:
  - June 18, 2019 @ 3:32 pm
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
  - one-to-many
  - unidirectional
---
Bismillah,  
Artikel kali ini adalah lanjutan dari <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/relasi-one-to-one-hibernate-anotasi/" target="_blank">sebelumnya</a> yang masih membahas mengenai relasi/asosiasi pada framework hibernate, yaitu one to many atau disimbolkan anotasi `@OneToMany`. Asosiasi ini dimana sebuah entitas dapat menerima atau meng-set informasi dari banyak instance dari entitas, sebagai contoh misalkan relasi yang terjadi antara entitas `Mahasiswa` dengan entitas `Mata Kuliah`. Misalkan ada si fulan yang mengambil matakuliah algoritma dan pemrograman, praktikum algoritma dan pemrograman, struktur data, praktikum struktur data, dan agama. Sama halnya dengan asosiasi yang sebelumnya telah kita pelajari, `@OneToMany` juga memiliki model `Unidirectional` dan `BidiRectional`. Beberapa penerapan `@OneToMany` yang dapat diterapkan menggunakan hibernate adalah sebagai berikut

  * `<a href="#@OneToMany-Unidirectional">@OneToMany</a>` [Unidirectional](#@OneToMany-Unidirectional)
  * `<a href="#@OneToMany-Unidirectional-Join-Kolom">@OneToMany</a>` [Unidirectional Join Kolom](#@OneToMany-Unidirectional-Join-Kolom)
  * `<a href="#@OneToMany-Unidirectional-Join-Tabel">@OneToMany</a>` [Unidirectional Join Tabel](#@OneToMany-Unidirectional-Join-Tabel)
  * `<a href="#@OneToMany-Bidirectional">@OneToMany</a>` [Bidirectional](#@OneToMany-Bidirectional)

#### `@OneToMany` Unidirectional {#@OneToMany-Unidirectional}

`@OneToMany` Unidirectional yang paling sederhana, ditampilkan seperti pada relasi tabel pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many.png" alt="One to many relational unidirectional" class="wp-image-276" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many.png 712w, https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many-300x58.png 300w" sizes="(max-width: 712px) 100vw, 712px" /><figcaption>One to many relational unidirectional</figcaption></figure>
</div>

Jika kita mapping ke dalam class Java yang perlu dilakukan adalah menuliskan kode seperti ini

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List&lt;MataKuliah> mataKuliahs = new ArrayList&lt;MataKuliah>();

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

//getter setter silakan digenerate menggunakan IDE</code></pre>

Dari potongan kode di atas setelah `@OneToMany` dengan property yang sebelumnya telah kita gunakan sehingga tidak perlu diperjelas kembali, ada instance `mataKuliahs` bertipe collection. Tujuan dari instance tersebut adalah agar instance `Mahasiswa` dapat menerima dan meng-set data dari entitas `Alamat`. Jika menggunaan model seperti ini, hibernate akan membuat tabel baru yang menyimpan informasi primary key kedua entitas. Jika pada contoh di atas tabel tersebut adalah `"mahasiswa_mata_kuliah"`, jika kita lihat sql yang dijalankan oleh hibernate adalah sebagai berikut

<pre class="wp-block-preformatted">Hibernate: insert into mahasiswa (ipk, jurusan, nama, nim) values (?, ?, ?, ?)
Hibernate: insert into mata_kuliah (namaMataKuliah, sks, kodeMataKuliah) values (?, ?, ?)
Hibernate: insert into mata_kuliah (namaMataKuliah, sks, kodeMataKuliah) values (?, ?, ?)
Hibernate: insert into mata_kuliah (namaMataKuliah, sks, kodeMataKuliah) values (?, ?, ?)
Hibernate: insert into mata_kuliah (namaMataKuliah, sks, kodeMataKuliah) values (?, ?, ?)
Hibernate: insert into mahasiswa_mata_kuliah (Mahasiswa_nim, mataKuliahs_kodeMataKuliah) values (?, ?)
Hibernate: insert into mahasiswa_mata_kuliah (Mahasiswa_nim, mataKuliahs_kodeMataKuliah) values (?, ?)
Hibernate: insert into mahasiswa_mata_kuliah (Mahasiswa_nim, mataKuliahs_kodeMataKuliah) values (?, ?)
Hibernate: insert into mahasiswa_mata_kuliah (Mahasiswa_nim, mataKuliahs_kodeMataKuliah) values (?, ?)</pre>

Wow, banyak sekali query insert yang dieksekusi karena ada 3 tabel yang harus diinsert data. Sepertinya model seperti ini tidak efisien, bayangnya jika datanya ada 10, 100, atau 1000? 🙁

#### `@OneToMany` Unidirectional Join Kolom {#@OneToMany-Unidirectional-Join-Kolom}

Model lain `Unidirectional` yang lain adalah Join kolom, anotasi yang digunakan setelah `@OneToMany` adalah `@JoinColumn`. Ketika menggunakan join kolom berarti akan ada kolom salah satu entitas menjadi foreign key pada entitas yang lain. Relasi tabel pada database relational ditunjukkan pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many-jointcolumn.png" alt="One to many relational unidirectional join column" class="wp-image-277" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many-jointcolumn.png 423w, https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many-jointcolumn-300x108.png 300w" sizes="(max-width: 423px) 100vw, 423px" /><figcaption>One to many relational unidirectional join column</figcaption></figure>
</div>

Mapping class Java untuk kedua entitas di atas adalah sebagai berikut

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "nim")
    private List&lt;MataKuliah> mataKuliahs = new ArrayList&lt;MataKuliah>();

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

//getter setter silakan generate menggunakan IDE</code></pre>

Mirip dengan deklarasi yang sebelumnya, hanya menambahkan `@JoinColumn` setelah `@OneToMany`. Ketika menggunakan model relasi jenis ini hanya akan dibuatkan 2 tabel, tetapi kolom `nim` akan menjadi foreign key pada entitas `MataKuliah`. Kemudian sql yang dijalankan ketika proses insert oleh hibernate adalah sebagai berikut

<pre class="wp-block-preformatted">Hibernate: insert into mahasiswa (ipk, jurusan, nama, nim) values (?, ?, ?, ?)
Hibernate: insert into mata_kuliah (nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?)
Hibernate: insert into mata_kuliah (nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?)
Hibernate: insert into mata_kuliah (nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?)
Hibernate: insert into mata_kuliah (nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?)
Hibernate: update mata_kuliah set nim=? where kode_mata_kuliah=?
Hibernate: update mata_kuliah set nim=? where kode_mata_kuliah=?
Hibernate: update mata_kuliah set nim=? where kode_mata_kuliah=?
Hibernate: update mata_kuliah set nim=? where kode_mata_kuliah=?</pre>

Ternyata query yang dijalankan masih belum efisen, perbedaaannya terdapat query update ketika hibernate menjalankan method `save()`.

#### `@OneToMany` Unidirectional Join Tabel {#@OneToMany-Unidirectional-Join-Tabel}

Sama seperti yang model yang pertama sebenarnya, perbedaannya adalah ketika menggunakan model jenis ini nama tabel dan kolom-kolomnya yang menghubungkan kedua entitas dapat diberi nama sesuai yang kita inginkan. Anotasi yang digunakan setelah `@OneToMany` menggunakan `@JoinTable`, mapping class Java dapat dicontohkan seperti berikut ini

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinTable(name = "mhs_mk", joinColumns = @JoinColumn(name = "nim"), inverseJoinColumns = @JoinColumn(name = "kode_mk"))
    private List&lt;MataKuliah> mataKuliahs = new ArrayList&lt;MataKuliah>();

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }</code></pre>

Dari kode di atas terdapat baris `@JoinTable(name = "mhs_mk", joinColumns = @JoinColumn(name = "nim"), inverseJoinColumns = @JoinColumn(name = "kode_mk"))` maksudnya adalah akan membuat sebuah tabel dengan nama `"mhs_mk"` dengan kolom `"nim"` dan kolom `"kode_mk"`.

#### `@OneToMany` Bidirectional {#@OneToMany-Bidirectional}

Model jenis ini merupakan relasi yang paling efisien untuk dapat digunakan pada aplikasi yang akan Anda bangun, jika pada ERD seperti di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many-bidi.png" alt="One to many relational bidirectional" class="wp-image-278" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many-bidi.png 407w, https://www.sinaungoding.com/wp-content/uploads/2019/06/one-to-many-bidi-300x109.png 300w" sizes="(max-width: 407px) 100vw, 407px" /><figcaption>One to many relational bidirectional</figcaption></figure>
</div>

Gambar ERD di atas memang mirip dengan anotasi menggunakan `@OneToMany Unidirectional` join kolom, perbedaaanya adalah pada class Java mappingnya. Mapping tersebut dapat dilihat pada potongan kode di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToMany(mappedBy = "mahasiswa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List&lt;MataKuliah> mataKuliahs = new ArrayList&lt;MataKuliah>();

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

//getter setter silakan digenerate menggunakan IDE</code></pre>

Dengan menambahakan property `mappedBy = "mahasiswa"` pada `@OneToMany` berfungsi untuk memapping instance mahasiswa ke dalam entitas `MataKuliah`, selanjutnya untuk entitas `MataKuliah` java class mapping adalah sebagai berikut

<pre class="wp-block-code"><code>@Entity
@Table(name = "mata_kuliah")
public class MataKuliah implements Serializable {

    @Id
    @Column(name = "kode_mata_kuliah")
    private String kodeMataKuliah;
    @Column(name = "nama_mata_kuliah")
    private String namaMataKuliah;
    private short sks;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nim")
    private Mahasiswa mahasiswa;

    public MataKuliah() {
    }

    public MataKuliah(String kodeMataKuliah, String namaMataKuliah, short sks) {
        this.kodeMataKuliah = kodeMataKuliah;
        this.namaMataKuliah = namaMataKuliah;
        this.sks = sks;
    }

//Silakan getter dan setter digenerated menggunakan IDE</code></pre>

Berbeda dari yang sebelumnya pada entitas `MataKuliah` ditambahkan `@ManyToOne(fetch = FetchType.LAZY)` atau kebalikan dari relasi `@OneToMany` pada entitas `Mahasiswa`, `fetch = FetchType.LAZY` bertujuan agar ketika instance `Mahasiswa` load data tidak semua data yang terdapat pada entitas `MataKuliah` tidak terload. Sementara untuk query yang dijalankan oleh hibernate adalah sebagai berikut

<pre class="wp-block-preformatted">Hibernate: insert into mahasiswa (ipk, jurusan, nama, nim) values (?, ?, ?, ?)
Hibernate: insert into mata_kuliah (nim, nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?, ?)
Hibernate: insert into mata_kuliah (nim, nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?, ?)
Hibernate: insert into mata_kuliah (nim, nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?, ?)
Hibernate: insert into mata_kuliah (nim, nama_mata_kuliah, sks, kode_mata_kuliah) values (?, ?, ?, ?)</pre>

Terlihat dari output ketika method `save()` dijalankan, querynya lebih sederhana dibanding dengan `@OneToMany`yang sebelumnya. Untuk kode di atas dapat didapatkan di <a href="https://github.com/0d3ng/maven-hibernate-association.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikian tulisan saya tentang relasi one to many menggunakan hibernate, semoga bermanfaat dan menjadi ilmu yang baru untuk temen-temen yang baru belajar hibernate seperti saya. Saran dan kritik senantiasa dinantikan untuk memperbaiki kekurangan tulisan pada blog ini. ^_^