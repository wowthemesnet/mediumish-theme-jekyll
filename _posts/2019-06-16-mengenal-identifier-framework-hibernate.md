---
id: 257
title: Mengenal Identifier Framework Hibernate(Bagian 1)
date: 2019-06-16T22:16:55+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=257
permalink: /mengenal-identifier-framework-hibernate/
wp_last_modified_info:
  - June 16, 2019 @ 10:16 pm
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
  - generated-value
  - hibernate
  - identifier
  - java
  - sequence
  - uuid
---
Bismillah,  
Jika pada artikel <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/mengenal-framework-hibernate-java/" target="_blank">sebelumnya</a> kita telah berkenalan dengan framework hibernate, pada kesempatan kali ini kita akan belajar lebih dalam lagi yaitu tentang identifier atau jika dianotasikan menggunakan `"@Id".` Sebelumnya pernah disinggung sedikit tentang `@Id`, yaitu digunakan untuk primary key dalam sebuah entitas atau tabel jika pada database relational. Beberapa sifat dari identifier yaitu

  * `UNIQUE`; nilainya harus berbeda untuk masing-masing row
  * `NOT NULL`; nilainya tidak boleh kosong
  * `IMMUTABLE`; ketika diinsert nilainya sudah tidak bisa diubah kembali

Setiap entitas wajib hukumnya mempunyai field/kolom sebagai identifier. Berikut ini adalah model dari identifier pada framework hibernate yang sangat sederhana, kita dapat menggunakan identifier-identifier di bawah ini untuk aplikasi yang akan kita bangun. Beberapa point yang akan dibahas adalah sebagai berikut;

  * [Assigned identifiers](#Assigned-identifiers)
  * [Generated identifier](#Generated-identifier)
  * [Generated identifier sequence](#Generated-identifier-sequence)
  * [Tabel identifier generator](#Tabel-identifier-generator)
  * [UUID identifier generator](#UUID-identifier-generator)
  * [Reference](#Reference)

#### Assigned identifiers {#Assigned-identifiers}

Untuk memberikan nilai pada identifer jenis ini, aplikasi akan memberikan nilai pada kolom di database ketika menjalankan method save/persist. Sebagai contoh implementasinya adalah di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table
public class Peminjaman implements Serializable {

    @Id
    private long id;
    @Temporal(TemporalType.TIMESTAMP)
    private Date tanggal_transaksi;

    public Peminjaman() {
    }

    public Peminjaman(long id, Date tanggal_transaksi) {
        this.id = id;
        this.tanggal_transaksi = tanggal_transaksi;
    }
  
   //Getter setter bisa di-generate menggunakan IDE </code></pre>

Penulisan `@Id` pun sangat sederhana, tidak ditambahkan anotasi yang lain setelah `@Id`. Kemudian penggunaan tipe data `Date, Datetime`, atau `Time` jika dimapping ke dalam menggunakan `@Temporal` dengan penyesuaian `TemporalType`. Selanjutnya untuk unit testnya kurang lebih seperti di bawah ini

<pre class="wp-block-code"><code>@Test
    public void testSave() {
        Peminjaman p = new Peminjaman();
        p.setId(2L);
        p.setTanggal_transaksi(new Date());
        assertTrue(service.save(p));

    }</code></pre>

Jika dilihat potongan unit test di atas, instance dari class `Peminjaman` melakukan assign dengan nilai 2. Jika hal tersebut tidak dilakukan tentunya akan terjadi error.

Penggunaan `@Id` jenis ini tentunya disesuaikan dengan kebutuhan, biasanya digunakan untuk kolom/field yang dijadikan identifier menggunakan tipe data `String`. Contoh penerapannya adalah ketika kita akan membuat sebuah entitas/tabel di database untuk primary key diinput secara manual, sebagai contoh entitas mahasiswa dengan NIM sebagai primary key atau entitas transaksi dengan kode transaksi sebagai primary key.

#### Generated identifier {#Generated-identifier}

Sesuai dengan namanya identifier ini dapat secara automatis memberikan nilai oleh hibernate, gunakan anotasi @GeneratedValue setelah @Id untuk menginformasikan bahwa nilai kolom/field akan dibuatkan secara automatis.

<pre class="wp-block-code"><code>@Entity
@Table
public class Peminjaman implements Serializable {

    @Id
    @GeneratedValue
    private long id;
    @Temporal(TemporalType.TIMESTAMP)
    private Date tanggal_transaksi;

    public Peminjaman() {
    }

    public Peminjaman(long id, Date tanggal_transaksi) {
        this.id = id;
        this.tanggal_transaksi = tanggal_transaksi;
    }

   //getter setter bisa digenerate menggunakan editor</code></pre>

Hanya ditambahkan satu baris perintah anotasi `@GeneratedValue` dari class yang sebelumnya, kemudian untuk class unit testnya adalah sebagai berikut

<pre class="wp-block-code"><code>@Test
    public void testSave() {
        Peminjaman p = new Peminjaman();
        p.setTanggal_transaksi(new Date());
        assertTrue(service.save(p));
    }</code></pre>

Dalam implementasi method pada unit test juga berkurang 1 baris yaitu yang sebelumnya terdapat `p.setId(2L)`, ketika menggunakan `@GeneratedValue` assign ke kolom/field identifier ditiadakan. Ketika dijalankan coba cek tabel yang terbentuk pada database, hibernate juga akan membuat tabel dengan nama `hibernate_sequence` untuk menyimpan nilai selanjutnya dari identifier. Bagaimana jika semua entitas menggunakan identifer menggunakan `@GeneratedValue` semua?

Identifier model seperti ini bisa digunakan untuk entitas/tabel yang menyimpan informasi transaksional dan nilainya tidak ditunjukkan kepada seorang pengguna, hanya dikonsumi oleh sistem.

#### Generated identifier sequence {#Generated-identifier-sequence}

Sebenarnya model jenis ini adalah perbaikan atau solusi dari anotasi yang hanya `@GeneratedValue`, permasalahannya adalah ketika ada banyak entitas yang menggunakan jenis tersebut maka nilai identifiernya akan sama karena mengacu pada tabel `hibernate_sequence`. Untuk lebih jelasnya dapat dilhat seperti pada contoh di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table
public class Pengembalian implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "sequence-generator")
    @SequenceGenerator(name = "sequence-generator",sequenceName = "sequence_pengembalian",allocationSize = 10)
    private long id;
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date tanggalPengembalian;

    public Pengembalian() {
    }

    public Pengembalian(long id, Date tanggalPengembalian) {
        this.id = id;
        this.tanggalPengembalian = tanggalPengembalian;
    }

    //getter setter bisa digenerate menggunakan editor</code></pre>

Dalam anotasi `@GeneratedValue` terdapat property `strategy` dan `generator` dan ditambakan anotasi `@SequenceGenerator`, `sequenceName` digunakan untuk memberikan nama sequence dan `allocationSize` ada nilai increment ketika method save/persist dijalankan. Misalkan dibuat nilai 10 berarti setiap data bertambah nilai primary key akan bertambah 10. Untuk unit test masih sama dengan yang sebelumnya, setelah menjalankan unit test coba dicek di database, seharusnya tabel `sequence_pengembalian` akan dibuatkan oleh hibernate.

#### Tabel identifier generator {#Tabel-identifier-generator}

Generate nilai automatis menggunakan tabel identifer akan membuat sebuah tabel di dalam database oleh hibernate yang berisi informasi nilai identifier dan juga nama tabelnya dari identifier tersebut. Di bawah ini adalah contoh penggunaanya

<pre class="wp-block-code"><code>@Entity
@Table
public class Pengembalian implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE,generator = "table-generator")
    @TableGenerator(name = "table-generator",table = "table_identifier",pkColumnName = "table_name",valueColumnName = "pengembalian_id",allocationSize = 10)
    private long id;
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date tanggalPengembalian;

    public Pengembalian() {
    }

    public Pengembalian(long id, Date tanggalPengembalian) {
        this.id = id;
        this.tanggalPengembalian = tanggalPengembalian;
    }</code></pre>

Pada bagian `strategy` diganti menjadi `GenerationType.TABLE` dan juga pada `generator` menjadi `"table-generator"`, kemudian anotasi yang digunakan setelah anotasi `@GeneratedValue` adalah `@TableGenerator`. Property yang dapat digunakan dalam `@TableGenerator` meliputi `table` untuk menentukan nama tabelnya, `pkColumnName` merupakan primary key dari kolom dari tabel tersebut, dan juga `valueColumnName` berfungsi sebagai nama kolom dari sebuah identifier. Kemudian jalankan unit testnya dan cek di database, seharusnya akan ada tabel baru yang terbentuk.

#### UUID identifier generator {#UUID-identifier-generator}

Hibernate juga menyediakan mekanisme pembuatan identifier menggunakan `UUID`, `UUID` merupakan kepanjangan dari `Universallly unique identifier` digunakan untuk mengidentifikasi informasi dalam sistem komputer. 

<pre class="wp-block-code"><code>@Entity
@Table
public class Pengembalian implements Serializable {

    @Id
    @GeneratedValue
    private UUID id;
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date tanggalPengembalian;

    public Pengembalian() {
    }

    public Pengembalian(UUID id, Date tanggalPengembalian) {
        this.id = id;
        this.tanggalPengembalian = tanggalPengembalian;
    }</code></pre>

Yang perlu dilakukan adalah hanya menggunakan anotas `@GeneratedValue` dan mengubah variabel id menjadi sebuah object dari class `UUID`, ketika unit test dijalankan dan dicek di dalam database maka kolom id pada tabel `Pengembalian` akan menyimpan data dengan tipe data blob/binary dengan panjang 255. Kemudian kita akan tambahkan property pada anotasi `@GeneratedValue` seperti contoh di bawah ini

<pre class="wp-block-code"><code>@Entity
@Table
public class Pengembalian implements Serializable {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(40)")
    private String id;
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date tanggalPengembalian;

    public Pengembalian() {
    }

    public Pengembalian(String id, Date tanggalPengembalian) {
        this.id = id;
        this.tanggalPengembalian = tanggalPengembalian;
    }</code></pre>

Pada class `Pengembalian` kita tambahkan property generator dengan nama `"uuid2"` pada anotasi `@GenerateValue`, kemudian ditambahkan `@GenericGenerator(name = "uuid2", strategy = "uuid2")` dan `@Column(columnDefinition = "VARCHAR(40)")` untuk menentukan definisi kolom pada tabel di database beserta tipe datanya. Silakan dijalankan unit test, selanjutnya cek di tabel `Pengembalian` seharusnya nilai id akan diisi oleh UUID dengan standadr IETF RFC 4122. Source code dapat didapatkan di <a href="https://github.com/0d3ng/maven-crud-hibernate.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah pembahasan yang masih sederhana mengenai identifier hibernate, pada tulisan yang akan datang mengenai identifier yang multiple value dalam entitas atau sering disebut composite identier. Semoga bermanfaat bagi temen-temen yang baru mulai belajar hibernate, jangan lupa kritik dan saran sangat diharapkan. 🙂

#### Reference {#Reference}

  * [https://docs.jboss.org/hibernate/orm/5.4/userguide/html\_single/Hibernate\_User_Guide.html#identifiers-generators-auto](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#identifiers-generators-auto)
  * <https://vladmihalcea.com/hibernate-and-uuid-identifiers/>
  * [https://en.wikipedia.org/wiki/Universally\_unique\_identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier)