---
id: 423
title: Yuk Belajar Web Service REST Spring Boot
date: 2019-07-26T16:10:37+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=423
permalink: /yuk-belajar-web-service-rest-spring-boot/
wp_last_modified_info:
  - July 30, 2019 @ 3:39 pm
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
  - CRUD
  - java
  - REST
  - spring
  - spring boot
  - web services
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/Web-Service-Spring-Boot-1024x684.jpg" alt="" class="wp-image-427" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/Web-Service-Spring-Boot-1024x684.jpg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Web-Service-Spring-Boot-300x200.jpg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Web-Service-Spring-Boot-768x513.jpg 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
</div>

Bismillah,  
Beberapa artikel yang telah lalu saya telah membuat postingan tentang penggunaan Spring Boot, kali ini saya akan mencoba kembali untuk mengimplementasikan Web Service REST. Karena REST merupakan aplikasi web juga sehingga membutuhkan web server, tapi jangan kwatir Spring Boot telah menyediakan yaitu menggunakan Tomcat. Beberapa point yang akan kita bahas adalah sebagai berikut

  * [Konfigurasi Spring Boot](#Konfigurasi-Spring-Boot)
  * [Pembuatan Entitas](#Pembuatan-Entitas)
  * [Pembuatan DAO](#Pembuatan-DAO)
  * [Pembuatan Controller](#Pembuatan-Controller)
  * [Testing Aplikasi](#Testing-Aplikasi)
  * [Referensi](#Referensi)

#### Konfigurasi Spring Boot {#Konfigurasi-Spring-Boot}

Untuk kebutuhan REST kita membutuhkan beberapa depedensi seperti `Spring Web Starter, Spring Data JPA, MySQL Driver, dan Lombok`. `Spring Web Started` adalah depedensi yang di dalamnya terdapat paket-paket seperti Spring MVC, Tomcat, dan kebutuhan untuk aplikasi web. Potongan dari file `pom.xml` adalah sebagai berikut

<pre class="wp-block-code"><code>...
&lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-data-jpa&lt;/artifactId>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-web&lt;/artifactId>
        &lt;/dependency>

        &lt;dependency>
            &lt;groupId>mysql&lt;/groupId>
            &lt;artifactId>mysql-connector-java&lt;/artifactId>
            &lt;scope>runtime&lt;/scope>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.projectlombok&lt;/groupId>
            &lt;artifactId>lombok&lt;/artifactId>
            &lt;optional>true&lt;/optional>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-test&lt;/artifactId>
            &lt;scope>test&lt;/scope>
        &lt;/dependency>
...</code></pre>

Selanjutnya kita akan mengkonfigurasi terkait dengan konfigurasi database, konfigurasi terkait dengan Spring Boot pada file `application.properties` yang terdapat di dalam folder `resources`. Isinya adalah sebagai berikut

<pre class="wp-block-preformatted">spring.datasource.username=root<br />spring.datasource.password=<br />spring.jpa.hibernate.ddl-auto=validate<br />spring.datasource.url=jdbc:mysql://localhost:3306/akademik?useLegacyDatetimeCode=false&serverTimezone=UTC<br />spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver<br />spring.jpa.show-sql=true<br />spring.jpa.properties.hibernate.format_sql=true<br />server.port=8081<br />spring.jackson.serialization.<em>indent_output</em>=true<br /></pre>

Penjelasannya adalah sebagai berikut terkait dengan konfigurasi di atas

  * `spring.jpa.hibernate.ddl-auto=validate;` memastikan stuktur yang terdapat pada entitas sama dengan struktur di database, jika beda akan ada error.
  * `spring.jpa.show-sql=true;` untuk menampilkan query ketika terjadi operasi di dalam database
  * `spring.jpa.properties.hibernate.format_sql=true;` agara format query yang tampil di output lebih terformat.
  * `server.port=8081;` port yang digunakan oleh tomcat, defaultnya adalah 8080.
  * `spring.jackson.serialization.`_`indent_output`_`=true;` digunakan untuk merapikan tampilan ouput JSON 

#### Pembuatan Entitas {#Pembuatan-Entitas}

Entitas yang akan kita gunakan adalah entitas mahasiswa, sehingga kita butuh class `Mahasiswa` untuk kebutuhan tersebut. Deklarasi class dapat ditunjukkan seperti di bawah ini

<pre class="wp-block-code"><code>@Data
@Entity
public class Mahasiswa {
    @Id
    private String nim;
    @NotNull
    @NotEmpty
    private String nama;
    @NotNull
    @NotEmpty
    private String jurusan;
    @NotNull
    private float ipk;
}</code></pre>

Penjelasan dari deklarasi class di atas, terdapat anotasi `@Data` merupakan deklarasi untuk menyediakan method setter dan getter oleh Lombok. Sedangkan anotasi `@NotNull` dan `@NotEmpty` digunakan agar field tersebut tidak boleh `NULL` dan tidak boleh kosong(empty String), anotasi tersebut membutuhkan Hibernate Validator.

#### Pembuatan DAO {#Pembuatan-DAO}

Sementara untuk DAO menggunakan extends interface `PagingAndSortingRepository`, sama seperti `CrudRepository` yaitu membutuhkan wrapper berupa entitas(Mahasiswa) dan tipe data untuk ID(String). Hal utama menggunakan `PagingAndSortingRepository` adalah Spring Boot telah menyediakan untuk kebutuhan pagination dan sorting. Kodenya disajikan seperti di bawah ini

<pre class="wp-block-code"><code>import com.sinaungoding.akademik.aplikasiakademik.entity.Mahasiswa;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface MahasiswaDao extends PagingAndSortingRepository&lt;Mahasiswa, String> {
}</code></pre>

Di dalam interface di atas tidak ada method yang lain, tetapi misalkan ada kebutuhan lain yang tidak disediakan oleh `PagingAndSortingRepository` bisa mendeklarasikan method di dalamnya.

<blockquote class="wp-block-quote">
  <p>
    Untuk membuat method sesuai dengan kebutuhan, perlu diperhatikan penamaan method yang kita buat. Misalkan kita akan menampilkan mahasiswa dengan ipk tertentu, nama method yang digunakan berarti <code>getMahasiswaByIpk</code>.
  </p>
</blockquote>

#### Pembuatan Controller {#Pembuatan-Controller}

Controller diibaratkan adalah pintu masuk request dari pengguna, dalam controller bertindak meneruskan request dari pengguna atau mengembalikan kembali ke pengguna. Kira-kira potongan kode untuk controller adalah sebagai berikut

<pre class="wp-block-code"><code>@RestController
public class MahasiswaApiController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MahasiswaApiController.class.getName());

    @Autowired
    private MahasiswaDao mahasiswaDao;

    @GetMapping("/api/mahasiswa")
    @ResponseBody
    public Page&lt;Mahasiswa> getAll(Pageable page) {
        return mahasiswaDao.findAll(page);
    }

    @GetMapping("/api/mahasiswaNama")
    @ResponseBody
    public Page&lt;Mahasiswa> getAllByNama(@RequestParam(name = "nama") String nama, Pageable pageable) {
        return mahasiswaDao.getMahasiswaByNamaContaining(nama, pageable);
    }

    @GetMapping("/api/mahasiswa/{nim}")
    @ResponseBody
    public Mahasiswa getByNim(@PathVariable(name = "nim") Mahasiswa mahasiswa) {
        return mahasiswa;
    }

    @PostMapping("/api/mahasiswa")
    @ResponseStatus(HttpStatus.CREATED)
    public void insert(@RequestBody @Valid Mahasiswa mahasiswa) {
        mahasiswaDao.save(mahasiswa);

    }

    @PutMapping("/api/mahasiswa/{nim}")
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable("nim") String nim, @RequestBody @Valid Mahasiswa mahasiswa) {
        Mahasiswa mhs = mahasiswaDao.findById("nim").get();
        if (mhs == null) {
            LOGGER.warn("Mahasiswa nim {} tidak ditemukan", nim);
            return;
        }
        BeanUtils.copyProperties(mahasiswa, mhs);
        mahasiswaDao.save(mhs);
    }

    @DeleteMapping("/api/mahasiswa/{nim}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable("nim") Mahasiswa mahasiswa) {
        if (mahasiswa != null) {
            mahasiswaDao.delete(mahasiswa);
        }
    }
}</code></pre>

Beberapa point untuk penjelasan kode di atas adalah sebagai berikut

  * `@RestController`; memberitahukan ke Spring bahwa class MahasiswaApiController merupakan sebuah kontroller.
  * `@Autowired`; digunakan untuk menginstance dari `interface MahasiswaDao`
  * `@GetMapping("/api/mahasiswa")`; menggunakna method `GET` untuk mendapatkan data mahasiswa, `http://[host]:[port]/api/mahasiswa`
  * `@ResponseBody`; untuk memberikan response ke pemanggil menggunakan format JSON. `Class Pageable` berarti data yang disajikan bisa disajikan per halaman(page).
  * `@PathVariable`; mekanisme yang digunakan untuk request menggunakan path. Misalkan `http://[host]:[port]/api/mahasiswa/075410099`
  * `@PostMapping("/api/mahasiswa")`; berarti method `POST` digunakan untuk menyimpan data/insert.
  * `@ResponseStatus(HttpStatus.CREATED)`; mengembalikan response ke pemanggilnya menggunakan status hpp, `HttpStatus.CREATED = 201.`
  * `@RequestBody @Valid Mahasiswa mahasiswa`; berarti ketika akan melewatkan data pada sebuah body, `@Valid` untuk memvalidasi data ketika melakukan request. Misalkan sebuah nama tidak boleh null atau nama tidak boleh kosong.
  * `BeanUtils.`_`copyProperties`_`(mahasiswa, mhs)`; maksudnya adalah digunakan untuk mengcopy property(nim, nama, ipk, &#8230;) objek `mahasiswa` ke objek `mhs`.

#### Testing Aplikasi {#Testing-Aplikasi}

Untuk melakukan ujicoba bisa menggunakan CURL, browser, atau tool yang lain misalkan Postman. Misalkan saya menggunakan Postman untuk melakukan ambil data semua mahasiswa, contoh alamat yang bisa diakses sebagai berikut dengan methode `GET`.

<pre class="wp-block-code"><code>http://localhost:8081/api/mahasiswa</code></pre>

Output dari request di atas adalah sebagai berikut

<pre class="wp-block-preformatted">{
     "content": [
         {
             "nim": "075410099",
             "nama": "Noprianto",
             "jurusan": "Teknolog Informasi",
             "ipk": 3.99
         },
         {
             "nim": "075410100",
             "nama": "Singgih Kuncoro",
             "jurusan": "Manajemen Informasi",
             "ipk": 3.5
         },
         {
             "nim": "075410101",
             "nama": "Singgih Permana",
             "jurusan": "Teknologi Informasi",
             "ipk": 3.54
         }
     ],
     "pageable": {
         "sort": {
             "sorted": false,
             "unsorted": true,
             "empty": true
         },
         "offset": 0,
         "pageSize": 20,
         "pageNumber": 0,
         "unpaged": false,
         "paged": true
     },
     "last": true,
     "totalPages": 1,
     "totalElements": 3,
     "size": 20,
     "number": 0,
     "numberOfElements": 3,
     "first": true,
     "sort": {
         "sorted": false,
         "unsorted": true,
         "empty": true
     },
     "empty": false
 }</pre>

Output di atas ketika kita menggunakan class `Pageable`, bisa dibuat per halaman. Silakan diganti alamat requestnya seperti di bawah ini kira-kira outputnya seperti apa?

<pre class="wp-block-code"><code>http://localhost:8081/api/mahasiswa?size=2</code></pre>

Jika perintah di atas hasilnya adalah jumlah data yang ditampilkan hanya menjadi 2 data saja. Kode lengkap dapat Anda dapat di <a href="https://github.com/0d3ng/aplikasi-akademik.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah artikel saya mengenai Web Service REST dengan Spring Boot, semoga menjadi pengetahuan yang baru bagi yang sedang belajar Java. Kritik dan saran sangat dibutuhkan untuk meningkatkan kwalitas blog ini. 🙂

#### Referensi {#Referensi}

  * <https://docs.spring.io/spring-boot/docs/2.1.6.RELEASE/reference/html/>
  * <https://spring.io/guides/gs/rest-service/>
  * <https://spring.io/guides/gs/accessing-data-rest/>
  * <https://www.youtube.com/playlist?list=PL9oC_cq7OYbw-5C0oaOtuF2bbXsqgFPqy>