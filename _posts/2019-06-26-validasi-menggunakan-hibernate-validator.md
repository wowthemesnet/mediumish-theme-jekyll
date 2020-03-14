---
id: 366
title: Validasi Menggunakan Hibernate Validator
date: 2019-06-26T15:50:23+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=366
permalink: /validasi-menggunakan-hibernate-validator/
wp_last_modified_info:
  - June 26, 2019 @ 3:50 pm
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
  - hibernate
  - hibernate-validator
  - java
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/06/header-hibernate-validator-1024x683.jpg" alt="" class="wp-image-368" /></figure>
</div>

Bismillah,  
Postingan kali ini masih berkaitan dengan hibernate, walaupun berbeda topiknya dari <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/relasi-many-to-many-hibernate-anotasi/" target="_blank">sebelumnya</a> tentang bagaimana hibernate memberlakukan teknik penyimpanan data untuk disimpan dalam sebuah database. Tetapi pada pembahasan kali ini lebih untuk validasi sebelum data tersebut disimpan ke database, validasi sangat penting sekali dilakukan karena data yang tidak dilakukan validasi tentunya banyak menimbulkan data-data yang invalid bahkan missing. Efek dari data invalid dan missing adalah penggalian informasi yang terdapat pada data tersebut susah dilakukan, yang lebih fatal adalah informasi yang disajikan tidak akurat atau mengarah ke informasi yang salah.

Contohnya misalkan kita akan merekam data tentang buku, dimana buku memiliki attribut-attribut seperti judul, penulis, penerbit, tahun terbit, dan isbn. Misalkan tahun terbit akan kita batasi, hanya 10 tahun terakhir dan isbn juga sudah ada standarnya yaitu <a rel="noreferrer noopener" aria-label="13 digit (opens in a new tab)" href="https://id.wikipedia.org/wiki/International_Standard_Book_Number" target="_blank">13 digit</a>. Hal-hal tersebut tidak perlu kita lakukan secara manual dengan membuat fungsi sendiri, tetapi dapat dilakukan menggunakan Hibernate Validator. Untuk mempermudah penulisan saya buat beberapa topik seperti di bawah ini

  * [Kebutuhan Penggunaan](#Kebutuhan-Penggunaan)
  * [Contoh Penggunaan](#Contoh-Penggunaan)
  * [Custom Message](#Custom-Message)
  * [Custome Message File Properties](#Custome-Message-File-Properties)
  * [Referensi](#Referensi)

#### Kebutuhan Penggunaan {#Kebutuhan-Penggunaan}

Beberapa hal yang disarankan untuk menjalankan contoh kode dengan baik adalah sebagai berikut

  * <a rel="noreferrer noopener" aria-label="Apache Maven (opens in a new tab)" href="https://maven.apache.org/" target="_blank">Apache Maven</a>
  * <a rel="noreferrer noopener" aria-label="Java 8 (opens in a new tab)" href="https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html" target="_blank">Java 8</a>
  * <a href="https://mvnrepository.com/artifact/org.hibernate.validator/hibernate-validator" target="_blank" rel="noreferrer noopener" aria-label="Hibernate Validator versi 6.0.17.Final (opens in a new tab)">Hibernate Validator versi 6.0.17.Final</a>

Sebenarnya editor-editor yang sering digunakan oleh programmer java seperi Netbeans, Intellij IDEA, dan Eclipse sudah include Apache Maven. Teruntuk Eclipse jika membutuhkan plugin yang tidak tersedia, bisa menambahkan plugin sendiri. Dengan adanya include di editor tidak perlu install tersendiri, tetapi jika menginginkan installasi sendiri tidak bermasalah. 🙂

#### Contoh Penggunaan {#Contoh-Penggunaan}

Sebagai contoh kita akan membuat sebuah entitas Buku seperti di bawah ini, tetapi silakan ditambahkan ke file `pom.xm` depedensi yang dibutuhkan terlebih dahulu.

<pre class="wp-block-preformatted">&lt;dependency>
    &lt;groupId>org.hibernate&lt;/groupId>
    &lt;artifactId>hibernate-validator&lt;/artifactId>
    &lt;version>6.0.17.Final&lt;/version>
&lt;/dependency>
&lt;dependency>
    &lt;groupId>org.glassfish&lt;/groupId>
    &lt;artifactId>javax.el&lt;/artifactId>
    &lt;version>3.0.1-b09&lt;/version>
&lt;/dependency>
&lt;dependency>
    &lt;groupId>junit&lt;/groupId>
    &lt;artifactId>junit&lt;/artifactId>
    &lt;version>4.12&lt;/version>
    &lt;scope>test&lt;/scope>
&lt;/dependency>
&lt;dependency>
    &lt;groupId>org.hamcrest&lt;/groupId>
    &lt;artifactId>hamcrest-core&lt;/artifactId>
    &lt;version>1.3&lt;/version>
    &lt;scope>test&lt;/scope>
&lt;/dependency></pre>

Depedensi `javax.el` dibutuhkan hibernate validator karena sebuah implementasi dari Unified Expression Language(<a rel="noreferrer noopener" aria-label="JSR 341 (opens in a new tab)" href="http://jcp.org/en/jsr/detail?id=341" target="_blank">JSR 341</a>) untuk mengevaluasi ekspresi dinamik pada constraint violation message. Sedangkan `junit` digunakan untuk unit testing pada kode yang telah kita buat.

<pre class="wp-block-code"><code>public class Buku {
    @Size(min = 6, max = 6)
    private String kode;
    @NotNull
    private String judul;
    @NotNull
    private String penulis;
    @NotNull
    private String penerbit;
    @Min(1970)
    private int tahun_terbit;
    @Size(min = 13, max = 13)
    private String isbn;

    public Buku() {
    }

    public Buku(String kode, String judul, String penulis, String penerbit, int tahun_terbit, String isbn) {
        this.kode = kode;
        this.judul = judul;
        this.penulis = penulis;
        this.penerbit = penerbit;
        this.tahun_terbit = tahun_terbit;
        this.isbn = isbn;
    }

//Getter dan setter</code></pre>

Untuk melakukan validasi menggunakan hibernate validator yang dilakukan adalah dengan menambahkan anotasi, seperti yang dicontohkan adalah `@NotNull, @Size, dan @Min`. `@NotNull` digunakan untuk melakukan validasi bahwa attribut tersebut harus diset, `@Size` untuk memberikan contraint ukuran dari sebuah field, dan `@Min` untuk membatasi nilai dari sebuah field atau attribut. Kemudian tambahkan kode untuk melakukan unit test seperti di bawah ini

<pre class="wp-block-code"><code>public class BukuTest {
    private static Validator validator;

    @Before
    public void setUp() {
        ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @Test
    public void testBuku() {
        Buku buku = new Buku("00001", "Mencari Anak Di Negeri Arah", "Noprianto", "Andi Press", 1969, "1234567890123");
        Set&lt;ConstraintViolation&lt;Buku>> validate = validator.validate(buku);
        Iterator&lt;ConstraintViolation&lt;Buku>> iterator = validate.iterator();

        while (iterator.hasNext()) {
            System.out.println(iterator.next().getMessage());
        }
        assertEquals(validate.size(),0);
    }
}</code></pre>

Kemudian jika dijalankan hasil yang didapatkan adalah sebagai berikut

<pre class="wp-block-preformatted">Jun 26, 2019 2:22:51 PM org.hibernate.validator.internal.util.Version 
INFO: HV000001: Hibernate Validator 6.0.17.Final
must be greater than or equal to 1970
size must be between 6 and 6
java.lang.AssertionError: 
Expected :2
Actual   :0</pre>

Ketika dijalankan unit test terjadi kegagalan atau `java.lang.AssertionError`, penyebabnya karena tahun terbit adalah 1969, sedangkan contraintnya adalah minimal harus 1970 sehinga muncul pesan `"must be greater than or equal to 1970"`. Kemudian untuk kode `00001` dengan panjang field minimal 6, sehingga mngakibatkan pesan `"size must be between 6 and 6"`. Coba sekarang disesuaikan untuk attribut-attribut tersebut sehingga tidak memunculkan pesan-pesan di atas.

#### Custom Message {#Custom-Message}

Pesan bawaan yang terjadi ketika contraint tidak terpenuhi dapat kita modifikasi sesuai dengan keinginan kita, hal yang dapat dilakukan adalah dengan menambahkan attribut pada property anotasi, dapat dicontohkan sebagai berikut

<pre class="wp-block-code"><code>@Size(min = 6, max = 6,message = "Minimal panjang kode adalah 6 dan Maksimal adalah 6")
private String kode;</code></pre>

Custome message tetap harus dimasukkan ke dalam kode, bagaimana jika suatu saat kita ingin mengubahnya tanpa melakukan compile ulang program kita? Hal tersebut dapat dilakukan dengan menambahkan file properties.

#### Custome Message File Properties {#Custome-Message-File-Properties}

Pesan yang ditampilkan dapat juga dioverride dan diletakkan pada sebuah file properties, yaitu dengan membuat file `ValidationMessages.properties`. Ketika menggunakan maven dapat diletakkan di _/src/main/resources_. Dapat dicontohkan isi file `ValidationMessages.properties` sebagai berikut

<pre class="wp-block-code"><code>javax.validation.constraints.NotNull.message         = Tidak boleh kosong</code></pre>

Untuk nama-nama properties yang lebih lengkap dapat Anda dapatkan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/hibernate/hibernate-validator/blob/master/engine/src/main/resources/org/hibernate/validator/ValidationMessages.properties" target="_blank">sini</a>. Bagaimana mudah bukan menggunakan hibernate validator, sekarang kita tidak repot-repot lagi untuk menghabiskan waktu membuat fungsi untuk mengecek satu persatu data yang diinputkan oleh user. Kode lengkap dapat didapatkan di <a href="https://github.com/0d3ng/maven-hibernate-validation.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah artikel saya mengenai hibernate validator, semoga bermanfaat dan tambah semangat coding java terlebih lagi menggunakan framework hibernate. Saran dan saran selalu saya butuhkan untuk meningkatkan kwalitas tulisan di blog ini. 🙂

#### Referensi {#Referensi}

  * <https://hibernate.org/validator/documentation/getting-started/>
  * <https://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch02.html#section-builtin-constraints>
  * <https://www.baeldung.com/javax-validation>
  * <https://howtodoinjava.com/hibernate/hibernate-validator-java-bean-validation/>
  * [https://id.wikipedia.org/wiki/International\_Standard\_Book_Number](https://id.wikipedia.org/wiki/International_Standard_Book_Number)
  * [https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Bean\_Validation\_Cheat_Sheet.md](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Bean_Validation_Cheat_Sheet.md)
  * <https://github.com/hibernate/hibernate-validator/blob/master/engine/src/main/resources/org/hibernate/validator/ValidationMessages.properties>