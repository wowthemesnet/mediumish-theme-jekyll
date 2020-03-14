---
id: 310
title: Mengenal Identifier Framework Hibernate(Bagian 2)
date: 2019-06-20T22:07:37+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=310
permalink: /mengenal-identifier-framework-hibernate-bagian-2/
wp_last_modified_info:
  - June 20, 2019 @ 10:11 pm
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
  - composite
  - hibernate
  - id
  - identifier
  - java
---
Bismillah,  
Pada postingan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/mengenal-identifier-framework-hibernate/" target="_blank">sebelumnya</a> sudah dibahas mengenai identifier sederhana dengan sebuah kolom sebagai identifier, sementara masih ada lagi identifier yang lebih komplek lagi dengan kolom lebih dari satu. Identifier seperti ini sering disebut composite identifier. Biasanya model identifier jenis ini akan entitasnya berelasi dengan entitas yang lain, beberapa point yang akan dibahas adalah sebagai berikut

  * [Composite identifier menggunakan](#Composite-identifier-menggunakan-@EmbeddedId) `<a href="#Composite-identifier-menggunakan-@EmbeddedId">@EmbeddedId</a>`
  * [Composite identifier menggunakan](#Composite-identifier-menggunakan-@IdClass) `<a href="#Composite-identifier-menggunakan-@IdClass">@IdClass</a>`
  * [Composite identifier dengan asosiasi](#Composite-identifier-dengan-asosiasi)
  * [Composite identifier dengan generated properties](#Composite-identifier-dengan-generated-properties)
  * [References](#References)

#### Composite identifier menggunakan `@EmbeddedId` {#Composite-identifier-menggunakan-@EmbeddedId}

`@EmbeddedId` digunakan untuk menjadikan lebih dari satu identifier dalam sebuah entitas, untuk lebih jelasnya dapat dicontohkan seperti pada potongan program di bawah ini

<pre class="wp-block-code"><code>@Embeddable
public class MahasiswaPK implements Serializable {
    private String nim;
    private String no_telf;

    public MahasiswaPK() {
    }

    public MahasiswaPK(String nim, String no_telf) {
        this.nim = nim;
        this.no_telf = no_telf;
    }

//Getter dan setter silakan generate menggunakan IDE</code></pre>

Entitas `MahasiswaPK` berisi field-field untuk dijadikan kolom sebagai primary key, jangan lupa ditambahkan anotasi `@Embeddable`. Dengan menggunakan `@Embeddable` entitas MahasiswaPK dapat disisipkan dalam entitas yang lain, entitas lain tersebut adalah `Mahasiswa`. Dapat dilihat seperti berikut ini

<pre class="wp-block-code"><code>Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @EmbeddedId
    private MahasiswaPK mhs_pk;
    @Column(name = "nama", nullable = false, length = 50)
    private String nama;
    @Column(name = "ipk", nullable = false, length = 4)
    private float ipk;
    @Column(name = "jurusan", nullable = false, length = 50)
    private String jurusan;

    public Mahasiswa() {
    }

    public Mahasiswa(MahasiswaPK mhs_pk, String nama, float ipk, String jurusan) {
        this.mhs_pk = mhs_pk;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

//Getter dan setter silakan generate menggunakan IDE</code></pre>

Dengan menambahkan `@EmbeddedId` maka field-field yang terdapat pada entitas `MahasiswaPK` akan ditambahkan ke dalam entitas `Mahasiswa`, sehingga hibernate akan membuatkan tabel `mahasiswa` dengan primary key `nim` dan `no_telf`. 

#### Composite identifier menggunakan `@IdClass` {#Composite-identifier-menggunakan-@IdClass}

Masih mirip-mirip dengan yang di atas bahwa `@IdClass` membutuhkan entitas yang lain, bedanya adalah field-field harus ditulis pada entitas yang membutuhkan identifier. Untuk lebih jelasnya kita lihat potongan kode di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
@IdClass(MahasiswaPK.class)
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    @Id
    private String no_telf;
    @Column(name = "nama", nullable = false, length = 50)
    private String nama;
    @Column(name = "ipk", nullable = false, length = 4)
    private float ipk;
    @Column(name = "jurusan", nullable = false, length = 50)
    private String jurusan;

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String no_telf, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.no_telf = no_telf;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

//Getter dan setter silakan generate menggunakan IDE</code></pre>

Pada entitas `Mahasiswa` perlu ditambahkan `@IdClass` dengan class apa yang menjadi identifier, selain itu juga perlu dituliskan kembali field-field `MahasiswaPK` pada entitas `Mahasiswa`. Sebelum deklarasi field-field perlu disisipkan `@Id`, selain itu `@IdClass` juga dapat ditambahkan generate nilai otomatis menggunakan `@GeneratedValue` juga.

#### Composite identifier dengan asosiasi {#Composite-identifier-dengan-asosiasi}

Selanjutnya identifier model jenis ini menggunakan relasi @ManyToOne untuk entitas-entitas yang berelasi, sebagai contoh digambarkan dalam ERD seperti di bawahi ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/Identifier-dengan-asosiasi.png" alt="Identifier dengan asosiasi" class="wp-image-312" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/Identifier-dengan-asosiasi.png 572w, https://www.sinaungoding.com/wp-content/uploads/2019/06/Identifier-dengan-asosiasi-300x63.png 300w" sizes="(max-width: 572px) 100vw, 572px" /><figcaption>Identifier dengan asosiasi</figcaption></figure>
</div>

Kemudian kita akan coba mapping ke dalam class java menggunakan identifier composite, potongan program dapat dilihat pada contoh di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table(name = "buku")
public class Buku implements Serializable {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    private Penulis penulis;
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    private Penerbit penerbit;
    @Id
    private String judul;

    public Buku() {
    }

    public Buku(Penulis penulis, Penerbit penerbit, String judul) {
        this.penulis = penulis;
        this.penerbit = penerbit;
        this.judul = judul;
    }

//Getter dan setter silakan generate menggunakan IDE</code></pre>

Jika dilihat dari gambar ERD dan entitas `Buku` di atas ditunjukkan relasi yang terjadi antara entitas `Buku` dengan entitas `Penulis` dan `Penerbit` adalah Many To One, sebagai ilustrasi seorang penulis dapat menulis lebih dari satu buku dan sebuat penerbit dapat menerbitkan buku lebih dari satu. Kemudian untuk entitas `Penulis` dan `Penerbit` tidak ada konfigurasi yang aneh-aneh, deklarasi entitas seperti biasa.

#### Composite identifier dengan generated properties {#Composite-identifier-dengan-generated-properties}

Composite model jenis identifier yang terdapat identitas harus dilakukan assign manual, tidak dapat dilakukan generate misalnya menggunakan `@Generated`, `@CreationTimestamp` atau `@ValueGenerationType` dan yang lainnya. Untuk lebih jelasnya dapat dilihat pada contoh entitas-entitas di bawah ini

<pre class="wp-block-code"><code>@Embeddable
public class MahasiswaPK implements Serializable {

    private String nim;
    private String no_telf;

    public MahasiswaPK() {
    }

    public MahasiswaPK(String nim, String no_telf) {
        this.nim = nim;
        this.no_telf = no_telf;
    }

//Getter dan setter silakan generate menggunakan IDE</code></pre>

Entitas MahasiswaPK merupakan entitas yang field-fieldnya akan dijadikan identifier pada entitas yang lain, `@Embeddable` digunakan untuk menginformasikan bahwa field yang di dalam entitas MahasiswaPK merupakan identifier.

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    private MahasiswaPK pK;
    @Column(name = "nama", nullable = false, length = 50)
    private String nama;
    @Column(name = "ipk", nullable = false, length = 4)
    private float ipk;
    @Column(name = "jurusan", nullable = false, length = 50)
    private String jurusan;

    public Mahasiswa() {
    }

    public Mahasiswa(MahasiswaPK pK, String nama, float ipk, String jurusan) {
        this.pK = pK;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

//Getter setter silakan generate menggunakan IDE</code></pre>

Sedangkan entitas `Mahasiswa` merupakan entitas yang akan diembed identifier dari entitas `MahasiswaPK`, dengan menambahkan `@Id` sebelum deklarasi instance `MahasiswaPK`. Untuk kode lengkap silakan unduh di <a href="https://github.com/0d3ng/maven-crud-hibernate.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>

Demikianlah artikel saya mengenai identifier pada framework hibernate, semoga bermanfaat dan menjadi informasi yang baru untuk temen-temen yang lagi belajar framework hibernate. Kritik dan saran masih diharapkan untuk meningkatkan kwalitas artikel-artikel yang saya tulis. ^_^

#### References {#References}

  * [https://docs.jboss.org/hibernate/orm/5.4/userguide/html\_single/Hibernate\_User_Guide.html#identifiers-composite](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#identifiers-composite)
  * <https://www.baeldung.com/hibernate-identifiers>
  * <https://vladmihalcea.com/from-jpa-to-hibernates-legacy-and-enhanced-identifier-generators/>