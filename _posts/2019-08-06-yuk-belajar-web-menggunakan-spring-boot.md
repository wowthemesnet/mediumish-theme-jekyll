---
id: 442
title: Yuk Belajar Web Menggunakan Spring Boot
date: 2019-08-06T14:10:45+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=442
permalink: /yuk-belajar-web-menggunakan-spring-boot/
wp_last_modified_info:
  - August 7, 2019 @ 10:54 pm
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
  - flyway
  - java
  - spring
  - spring boot
  - thymeleaf
  - web
---
<figure class="wp-block-image"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-1024x729.jpg" alt="" class="wp-image-447" /></figure> 

Bismillah,  
Pada kesempatan kali ini kita akan belajar web java menggunakan Spring Boot, walaupun sebelumnya framework Spring untuk web sudah menyediakan Spring MVC. Jika pada framework tersebut kita harus konfigurasi aplikasi dalam menggunakan `web.xml`, sebaliknya ketika menggunakan Spring Boot sudah tidak dibutuhkan lagi. Beberapa point yang akan kita bahas adalah sebagai berikut

  * [Konfigurasi Spring Boot](#Konfigurasi-Spring-Boot)
  * [Buat File HTML](#Buat-File-HTML)
  * [Menambahkan Entitas](#Menambahkan-Entitas)
  * [Migrasi Database](#Migrasi-Database)
  * [Membuat Controller](#Membuat-Controller)
  * [Buat Template Thymeleaf](#Buat-Template-Thymeleaf)
  * [Implementasi Paging](#Implementasi-Paging)
  * [Referensi](#Referensi)

#### Konfigurasi Spring Boot

Sebenarnya untuk konfigurasi terkait dengan depedency yang dibutuhkan tidak jauh beda dengan yang saya posting di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://www.sinaungoding.com/consume-rest-menggunakan-resttemplate-spring-boot/" target="_blank">sini</a>, yang paling penting adalah depedency `spring-boot-starter-web` dan terdapat depedency lagi yaitu `spring-boot-starter-thymeleaf`. `spring-boot-starter-thymeleaf` digunakan sebagai view aplikasi web yang akan kita buat, ya walaupun sebenarnya bisa menggunakan jsp atau html. Sehingga file `pom.xml` seperti berikut ini

<pre class="wp-block-code"><code>&lt;dependencies>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-web&lt;/artifactId>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-thymeleaf&lt;/artifactId>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-test&lt;/artifactId>
            &lt;scope>test&lt;/scope>
        &lt;/dependency>
    &lt;/dependencies></code></pre>

#### Buat File HTML {#Buat-File-HTML}

Selanjutnya kita akan coba buat file html sebagai view, silakan buat file html sederhana seperti ini. Misalkan saya beri nama `index.html`, file tersebut secara automatis akan dicari oleh Spring Boot sebagai home screen aplikasi kita. File tersebut dibuat di dalam folder `resources/templates`. Kira-kira isinya adalah sebagai berikut

<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html lang="en">
&lt;head>
    &lt;meta charset="UTF-8">
    &lt;title>Selamat Datang Spring Boot&lt;/title>
&lt;/head>
&lt;body>
&lt;h2>Belajar Web Menggunakan Spring Boot&lt;/h2>
&lt;/body>
&lt;/html></code></pre>

Silakan masukan alamat <http://localhost:8081/> seharusnya akan menampilkan html yang telah dibuat sebelumnya, port 8081 silakan disesuaikan pada file `application.properties` pada folder `resources`. Sampai langkah ini sebenarnya sudah berhasil untuk membuat aplikasi web menggunakan Spring Boot, **ya aplikasi web statis**. Gimana jika aplikasi web dinamis? Sebelum membuat web dinamis, tambahkan terlebih dahulu depedensi berikut

<pre class="wp-block-code"><code>&lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-data-jpa&lt;/artifactId>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>mysql&lt;/groupId>
            &lt;artifactId>mysql-connector-java&lt;/artifactId>
            &lt;scope>runtime&lt;/scope>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.projectlombok&lt;/groupId>
            &lt;artifactId>lombok&lt;/artifactId>
&lt;/dependency></code></pre>

#### Menambahkan Entitas {#Menambahkan-Entitas}

Karena rencananya yang digunakan sebagai contoh adalah untuk melakukan manipulasi data mahasiswa sehingga yang dibutuhkan adalah entitas Mahasiswa, isinya kurang lebih seperti di bawah ini

<pre class="wp-block-code"><code>@Entity
@Data
public class Mahasiswa {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private String id;
    @NotNull
    @NotBlank
    @Column(unique = true)
    private String nim;
    @NotNull
    @NotBlank
    private String nama;
    private float ipk;
    @NotNull
    @NotBlank
    private String jurusan;
}</code></pre>

Penjelasan dari kode di atas adalah sebagai berikut

  * `@Entity`, mendeklarasikan bahwa class Mahasiswa adalah berupa entitas yang akan di-mapping ke dalam sebuah tabel dalam database.
  * `@Data`, menandai class Mahasiswa akan diberikan method getter dan setter
  * `@Id`, `@GeneratedValue(generator = "uuid2")`, `@GenericGenerator(name = "uuid2", strategy = "uuid2")` digunakan untuk field id digunakan sebagai primary di database dengan nilai diisi menggunakan UUID.
  * `@Column(unique = true)`, maksudnya adalah agar field nim dibuat unik pada database
  * `@NotNull` dan `@NotBlank`, field yang mendapatkan anotasi itu tidak boleh kosong ataupun NULL.

#### Migrasi Database {#Migrasi-Database}

Sebenarnya ketika membuat entitas, bisa aja kita langsung dibuatkan struktur tabelnya tetapi kali ini kita akan membuat struktur tabel dengan file sql yang telah kita persiapkan sebelumnya, Spring Boot dapat melakukan database migrasi menggunakan depedency Flyway. Terlebih dahulu kita tambahkan depedency tersebut pada file `pom.xml` seperti berikut ini

<pre class="wp-block-preformatted">&lt;dependency&gt;<br />    &lt;groupId&gt;org.flywaydb&lt;/groupId&gt;<br />    &lt;artifactId&gt;flyway-core&lt;/artifactId&gt;<br />&lt;/dependency&gt;</pre>

Pada file `application.properties` juga perlu ditambahkan lokasi file sql yang akan dieksekusi, konfigurasi seperti berikut ini

<pre class="wp-block-code"><code>spring.flyway.locations=classpath:db/migration</code></pre>

Sebenarnya default pengecekan file sql terdapat di dalam folder `resources/db/migration`, tetapi kita bisa mengganti lokasi file sql tersebut dengan mengubah nilai pada `spring.flyway.locations=[lokasi file sql]`. Jangan lupa menambahkan file sql tersebut pada direktori tersebu, selanjutnya untuk penamaan juga harus mengikuti flyway yaitu `V<VERSION>__<NAME>.sql.` Misalkan `V1.0__init_tables.sql`. Selanjutnya silakan dijalankan seharusnya aplikasi akan membuatkan schema sesuai dengan file sql dan akan terbentuk tabel `flyway_schema_history` dalam database Anda.

#### Membuat Controller {#Membuat-Controller}

Controller dalam aplikasi web merupakan pintu masuk dari request client, tugasnya adalah meneruskan ke model atau mengembalikan request ke client. Berikut ini adalah implementasi kode untuk controller tersebut

<pre class="wp-block-code"><code>@Controller
public class MahasiswaController {
    @Autowired
    private MahasiswaDao mahasiswaDao;

    @GetMapping("/index")
    public ModelMap getAll(Pageable pageable) {
        return new ModelMap().addAttribute("mahasiswas", mahasiswaDao.findAll(pageable));
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/index";
    }
}</code></pre>

Penjelasan kode di atas adalah sebagai berikut

  * `@Controller`, menandai bahwa class `MahasiswaController` adalah sebuah controller yang akan dilakukan scan oleh Spring
  * `@Autowired`, untuk meng-inisiasi objek `mahasiswaDao`.
  * `@GetMapping("/index")`, method di bawahnya berarti menggunakan http request GET. Sedangkan parameter objek `pageable` agar support paging.
  * `redirect:/index`, berarti ketika memanggil pada path `"/"` maka akan diteruskan ke path `"/index"` pada browser.

#### Buat Template Thymeleaf {#Buat-Template-Thymeleaf}

Template Thymeleaf merupakan salah satu template engine yang tersedia pada Spring Boot, karena ketika menggunakan jsp dianggap kurang menarik sehingga menggunakan template engine. File `index.html` yang sebelumnya perlu disesuaikan seperti berikut ini

<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html xmlns:th="http://www.thymeleaf.org">
&lt;head>
    &lt;meta charset="UTF-8">
    &lt;title>Selamat Datang Spring Boot&lt;/title>
&lt;/head>
&lt;body>
&lt;h2>Belajar Web Template Engine Thymeleaf Menggunakan Spring Boot&lt;/h2>
&lt;h2>List Mahasiswa&lt;/h2>

&lt;table>
    &lt;tr>
        &lt;th>Nim&lt;/th>
        &lt;th>Nama&lt;/th>
        &lt;th>IPK&lt;/th>
        &lt;th>Jurusan&lt;/th>
        &lt;th>Action&lt;/th>
    &lt;/tr>
    &lt;tr th:each="mhs : ${mahasiswas}">
        &lt;td th:text="${mhs.nim}"> &lt;/td>
        &lt;td th:text="${mhs.nama}"> &lt;/td>
        &lt;td th:text="${mhs.ipk}"> &lt;/td>
        &lt;td th:text="${mhs.jurusan}"> &lt;/td>
        &lt;td>
            &lt;a href="#">Edit&lt;/a> | 
            &lt;a href="#">Hapus&lt;/a> | 
            &lt;a href="#">Detail&lt;/a>
        &lt;/td>
    &lt;/tr>
&lt;/table>
&lt;/body>
&lt;/html></code></pre>

Silakan dijalankan aplikasi yang telah dibuat, kemudian ketikan pada browser [http://localhost:8081](http://localhost:8081/) seharusnya jika semua normal akan tampil data-data yang sebelumnya telah kita tambahkan di database. Tampilannya jika berhasil seperti pada gambar di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Thymeleaf-Spring-Boot.png" alt="Thymeleaf Spring Boot" class="wp-image-444" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Thymeleaf-Spring-Boot.png 747w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Thymeleaf-Spring-Boot-300x129.png 300w" sizes="(max-width: 747px) 100vw, 747px" /><figcaption>Thymeleaf Spring Boot</figcaption></figure>
</div>

#### Implementasi Paging {#Implementasi-Paging}

Seperti yang telah disebutkan sebelumnya bahwa pada controller yang telah kita buat support untuk paging, kebetulan sudah ada yang membuat untuk kebutuhan tersebut. Detail silakan cek di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/jpenren/thymeleaf-spring-data-dialect" target="_blank">sini</a>. Sebelumnya kita harus menambahkan depedency pada file `pom.xml`, isinya adalah sebagai berikut

<pre class="wp-block-code"><code>&lt;dependency>
            &lt;groupId>io.github.jpenren&lt;/groupId>
            &lt;artifactId>thymeleaf-spring-data-dialect&lt;/artifactId>
            &lt;version>3.4.0&lt;/version>
&lt;/dependency></code></pre>

Selain itu, kita juga butuh untuk mendefiniskan sebuah `@Bean` untuk melakukan konfigurasi. Tambahkan kode berikut ini pada class yang memiliki anotasi `@SpringBootApplication`, yang saya contohkan class `DemoThymeleafApplication`.

<pre class="wp-block-code"><code>@Bean
    public SpringDataDialect springDataDialect() {
        return new SpringDataDialect();
    }</code></pre>

Kita juga butuh menambahkan css bootstrap dan script untuk menampilkan icon paging pada file yang akan diberikan paging, saya tambahkan menggunakan BootStrapCDN dan script tersebut seperti berikut ini

<pre class="wp-block-code"><code>&lt;link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></code></pre>

<pre class="wp-block-code"><code>&lt;div class="row">
    &lt;div class="col-sm-6">
    	&lt;div sd:pagination-summary="">info&lt;/div>
    &lt;/div>
    &lt;div class="col-sm-6">
    	&lt;nav class="pull-right">
		&lt;ul class="pagination" sd:pagination-split="7" sd:pagination="full">
			&lt;!-- Pagination created by SpringDataDialect, this content is just for mockup -->
			&lt;li class="disabled">&lt;a href="#" aria-label="Previous">&lt;span aria-hidden="true">«&lt;/span>&lt;/a>&lt;/li>
		   	&lt;li class="active">&lt;a href="#">1 &lt;span class="sr-only">(current)&lt;/span>&lt;/a>&lt;/li>
		&lt;/ul>
	&lt;/nav>
    &lt;/div>
&lt;/div></code></pre>

Untuk macam-macam paging yang bisa digunakan, silakan cek di dokumentasi resminya sang pembuatnya. Sekarang coba jalankan aplikasi yang telah ditambahkan paging, dan lihat hasilnya pada browser Anda. Kira-kira hasilnya seperti di bawah ini

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Thymeleaf-Spring-Boot-Paging-1024x405.png" alt="Thymeleaf Spring Boot Paging" class="wp-image-445" /><figcaption>Thymeleaf Spring Boot Paging</figcaption></figure>
</div>

Hasilnya lebih menarik dari sebelumnya, karena telah diberikan css. Sekarang silakan ujicoba untuk menerapkan paging dengan mengetik alamat ini pada browser Anda, <http://localhost:8081/index?size=1>. Pagingnya seharusnya akan berubah. 🙂

Demikianlah artikel saya tentang belajar web menggunakan Spring Boot dengan template engine Thymeleaf, semoga bermanfaat dan menambah ilmu yang baru. Kritik dan saran yang membangun sangat diharapkan untuk menambah semangat saya untuk menulis. Full code dapat didapatkan di <a href="https://github.com/0d3ng/demo-thymeleaf.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>. ^_^

#### Referensi {#Referensi}

  * <https://docs.spring.io/spring-boot/docs/2.1.6.RELEASE/reference/htmlsingle/boot-features-developing-web-applications.html>
  * <https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html>
  * <https://spring.io/guides/gs/serving-web-content/>
  * <https://spring.io/guides/gs/spring-boot/>
  * <https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc>
  * <https://github.com/jpenren/thymeleaf-spring-data-dialect>
  * <https://www.youtube.com/playlist?list=PL9oC_cq7OYbyhdZmCECQqp7OcS8J5QpAo>