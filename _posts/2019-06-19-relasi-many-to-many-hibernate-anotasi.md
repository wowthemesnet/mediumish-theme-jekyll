---
id: 283
title: Relasi Many to Many Hibernate Anotasi
date: 2019-06-19T16:34:26+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=283
permalink: /relasi-many-to-many-hibernate-anotasi/
wp_last_modified_info:
  - August 21, 2019 @ 2:52 pm
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
  - hibernate
  - java
  - many-to-many
---
Bismillah,  
Many to many adalah jenis relasi yang terakhir untuk menangai bertukarnya informasi antar entitas, jika pada artikel <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/relasi-one-to-many-hibernate-anotasi/" target="_blank">sebelumnya</a> terdapat banyak mekanisme yang dapat digunakan walaupun tidak semua optimal. Sedangkan pada relasi many to many tidak banyak model yang dapat digunakan, hibernate untuk melakukan relasi ini menggunakan anotasi `@ManyToMany`. Hal yang menjadi perhatian adalah ketika menggunakan relasi ini, pasti akan terbentuk sebuah tabel baru oleh hibernate. Ilustrasi penerapan relasi many to many misalnya ketika relasi yang terjadi antara Mahasiswa dengan sebuah Tugas, bisa saja satu mahasiswa mengerjakan tugas yang banyak dan juga tugas yang sama dikerjakan oleh banyak mahasiswa. Beberapa model `@ManyToMany` yang digunakan hibernate adalah sebagai berikut

  * [@ManyToMany Unidirectional](#@ManyToMany-Unidirectional)
  * [@ManyToMany Bidirectional](#@ManyToMany-Bidirectional)
  * [@ManyToMany Link Entity](#@ManyToMany-Link-Entity)
  * [Penutup](#Penutup)
  * [Referensi](#Referensi)

#### @ManyToMany Unidirectional {#@ManyToMany-Unidirectional}

Sama halnya dengan relasi pendahulu, @ManyToMany juga terdapat model relasi unidirectional. Misalkan kita memiliki relasi ERD seperti gambar di bawah ini<figure class="wp-block-image">

<img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/many-to-many.png" alt="Many to many unidirectional" class="wp-image-293" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/many-to-many.png 616w, https://www.sinaungoding.com/wp-content/uploads/2019/06/many-to-many-300x74.png 300w" sizes="(max-width: 616px) 100vw, 616px" /> <figcaption>Many to many unidirectional</figcaption></figure> 

Setelah kita mapping ke dalam class java berarti membutuhkan class `Tugas` dan class `Mahasiswa`, sedangkan class MahasiswaTugas tidak perlu dibuat karena akan digenerate oleh hibernate.

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @ManyToMany(cascade = CascadeType.ALL)
    private List&lt;Tugas> tugases = new ArrayList&lt;>();

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }

//Getter setter silakan digenerate dengan IDE</code></pre>

Dengan menambahkan anotasi `@ManyToMany` untuk menginformasikan bahwa entitas Mahasiswa berinteraksi dengan entitas Tugas, hampir sama dengan `@OneToMany` yaitu membuatkan `field collection List` dengan wrapper class `Tugas`. Sedangkan entitas `Tugas` hanya mendefiniskan entitas biasa, tidak ada yang perlu dikonfigurasi seperti entitas `Mahasiswa`. Ketika dijalankan proses insert menggunakan hibernate, query yang tampil pada output editor Anda adalah sebagai berikut

<pre class="wp-block-preformatted">Hibernate: insert into mahasiswa (ipk, jurusan, nama, nim) values (?, ?, ?, ?)
Hibernate: insert into tugas (nama, tanggal_submitted, id) values (?, ?, ?)
Hibernate: insert into tugas (nama, tanggal_submitted, id) values (?, ?, ?)
Hibernate: insert into mahasiswa_tugas (Mahasiswa_nim, tugases_id) values (?, ?)
Hibernate: insert into mahasiswa_tugas (Mahasiswa_nim, tugases_id) values (?, ?)
Hibernate: select mahasiswa_.nim, mahasiswa_.ipk as ipk2_0_, mahasiswa_.jurusan as jurusan3_0_, mahasiswa_.nama as nama4_0_ from mahasiswa mahasiswa_ where mahasiswa_.nim=?
Hibernate: insert into mahasiswa (ipk, jurusan, nama, nim) values (?, ?, ?, ?)
Hibernate: insert into mahasiswa_tugas (Mahasiswa_nim, tugases_id) values (?, ?)</pre>

Jika dilihat query di atas, terdapat query insert ke tabel penghubung yaitu `mahasiswa_tugas`. Sebenarnya selain cara di atas, ada lagi yaitu menggunakan anotasi `@JoinTable` sehingga kita dapat mendefiniskan nama tabel penghubung dan kolomnya dapat didefiniskan sesuai dengan keinginan kita.

#### @ManyToMany Bidirectional {#@ManyToMany-Bidirectional}

Dengan Bidirectional sebenarnya masih sama dari sisi stuktur tabel di database seperti di atas, tetapi berbeda dari sisi mapping class java karena kedua entitas harus bisa saling bertukar informasi. Untuk entitas Mahasiswa masih sama, yang berbeda adalah pada entitas Tugas seperti berikut

<pre class="wp-block-code"><code>@Entity
@Table(name = "tugas")
public class Tugas implements Serializable {

    @Id
    @GeneratedValue
    private int id;
    private String nama;
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date tanggal_submitted;
    @ManyToMany(mappedBy = "tugases")
    private List&lt;Mahasiswa> mahasiswas = new ArrayList&lt;>();

    public Tugas() {
    }

    public Tugas(String nama, Date tanggal_submitted) {
        this.nama = nama;
        this.tanggal_submitted = tanggal_submitted;
    }

//Getter dan setter silakan digenerate menggunakan IDE</code></pre>

Karena Bidirectional sehingga membutuhkan anotasi `@ManyToMany` juga pada entitas `Tugas`, `mappedBy = "tugases"` berarti pada entitas Mahasiswa akan ada instance dengan nama `tugases`.

#### @ManyToMany Link Entity {#@ManyToMany-Link-Entity}

Selain model-model di atas, yang dapat dilakukan teknik lain adalah `@ManyToMany` dengan melakukan linked pada sebuah entitas. Teknik ini menurut saya dari sisi codingan lebih banyak karena harus mengimplementasi template CRUD dari hibernate pada kedua entitasnya, relasi yang terjadi pada tabel di database ditunjukkan pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/many-to-many-bidi.png" alt="Many to many bidirectional" class="wp-image-296" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/many-to-many-bidi.png 601w, https://www.sinaungoding.com/wp-content/uploads/2019/06/many-to-many-bidi-300x78.png 300w" sizes="(max-width: 601px) 100vw, 601px" /><figcaption>Many to many bidirectional</figcaption></figure>
</div>

Kemudian untuk mapping class java dari gambar di atas, dapat dicontohkan seperti di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table(name = "mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    @OneToMany(mappedBy = "mahasiswa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List&lt;MahasiswaTugas> tugases = new ArrayList&lt;>();

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
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

    public void addTugas(Tugas tugas) {
        MahasiswaTugas mahasiswaTugas = new MahasiswaTugas(this, tugas);
        tugases.add(mahasiswaTugas);
        tugas.getMahasiswas().add(mahasiswaTugas);
    }

    public void removeTugas(Tugas tugas) {
        MahasiswaTugas mahasiswaTugas = new MahasiswaTugas(this, tugas);
        tugas.getMahasiswas().remove(mahasiswaTugas);
        tugases.remove(mahasiswaTugas);
        mahasiswaTugas.setMahasiswa(null);
        mahasiswaTugas.setTugas(null);
    }

    public List&lt;MahasiswaTugas> getTugases() {
        return tugases;
    }

    public void setTugases(List&lt;MahasiswaTugas> tugases) {
        this.tugases = tugases;
    }

    @Override
    public String toString() {
        return "Mahasiswa{" + "nim=" + nim + ", nama=" + nama + ", ipk=" + ipk + ", jurusan=" + jurusan + '}';
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 59 * hash + Objects.hashCode(this.nim);
        hash = 59 * hash + Objects.hashCode(this.nama);
        hash = 59 * hash + Float.floatToIntBits(this.ipk);
        hash = 59 * hash + Objects.hashCode(this.jurusan);
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
    }

}</code></pre>

Yang berbeda dari yang sebelumnya adalah bahwa terdapat method `addTugas()` dan `removeTugas()` untuk menghapus dari instance `Tugas`. Kemudian untuk entitas Tugas potongan kodenya adalah sebagai berikut

<pre class="wp-block-code"><code>@Entity
@Table(name = "tugas")
public class Tugas implements Serializable {

    @Id
    @GeneratedValue
    private int id;
    private String nama;
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date tanggal_submitted;
    @OneToMany(mappedBy = "tugas",cascade = CascadeType.ALL,orphanRemoval = true)
    private List&lt;MahasiswaTugas> mahasiswas = new ArrayList&lt;>();

    public Tugas() {
    }

    public Tugas(String nama, Date tanggal_submitted) {
        this.nama = nama;
        this.tanggal_submitted = tanggal_submitted;
    }

//Getter dan setter silakan generate menggunakan IDE</code></pre>

Karena Bidirectional sehingga pada kedua entitas memiliki anotasi `@OneToMany`, dari anotasi tersebut nanti dibutuhkan mapping entitas untuk menjembatani kedua entitas tersebut yaitu entitas `MahasiswaTugas`. Potongan kode yang dapat digunakan adalah sebagai berikut

<pre class="wp-block-code"><code>@Entity
@Table(name = "mhs_tgs")
public class MahasiswaTugas implements Serializable {

    @Id
    @ManyToOne
    private Mahasiswa mahasiswa;
    @Id
    @ManyToOne
    private Tugas tugas;

    public MahasiswaTugas() {
    }

    public MahasiswaTugas(Mahasiswa mahasiswa, Tugas tugas) {
        this.mahasiswa = mahasiswa;
        this.tugas = tugas;
    }</code></pre>

Entitas di atas dilakukan linking ke dua entitas yaitu dengan menambahkan `@Id` dan anotasi `@ManyToOne`, berfungsi untuk merelasikan kedua identifier yang terdapat pada entitas `Mahasiswa` dan entitas `Tugas`. Untuk code lengkap di atas dapat didapatkan di <a href="https://github.com/0d3ng/maven-hibernate-association.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

#### Penutup {#Penutup}

Demikianlah artikel saya mengenai anotasi `@ManyTo@Many`, semoga bermanfaat dan dapat diterapkan dalam kasus yang ditemukan dalam dunia nyata untuk aplikasi yang akan dibangun. Kritik dan saran senantiasa diharapkan untuk memperbaiki artikel-artikel yang ditulis. 🙂

#### Referensi {#Referensi}

  * [https://docs.jboss.org/hibernate/orm/5.4/userguide/html\_single/Hibernate\_User_Guide.html#associations-many-to-many](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#associations-many-to-many)
  * <https://vladmihalcea.com/the-best-way-to-use-the-manytomany-annotation-with-jpa-and-hibernate/>
  * <https://howtodoinjava.com/hibernate/hibernate-many-to-many-mapping-using-annotations/>