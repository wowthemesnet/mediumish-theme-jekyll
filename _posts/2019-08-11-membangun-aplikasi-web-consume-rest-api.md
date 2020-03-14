---
layout: post
title:  "Membangun Aplikasi Web Consume REST API"
author: odeng
categories: [Java]
tags: [java, REST, spring, spring boot, web, web services]
image: assets/images/11.jpg
description: "My review of Inception movie. Acting, plot and something else in this short description."
featured: true
hidden: true
rating: 4.5
---

<figure class="wp-block-image"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Spring-Boot-Consume-API-1024x683.jpg" alt="" class="wp-image-465" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Spring-Boot-Consume-API-1024x683.jpg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Spring-Boot-Consume-API-300x200.jpg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Spring-Boot-Consume-API-768x512.jpg 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure> 

Bismillah,  
Pada kesempatan yang lalu saya telah menulis tentang cara membuat aplikasi web menggunakan Spring Boot, pada kesempatan kali ini masih sama yaitu membangun aplikasi web juga menggunakan tool yang sama. Perbedaannya adalah jika yang sebelumnya manipulasi data dilakukan pada aplikasi tersebut, yang akan ditulis sekarang dihandle oleh web service. Beberapa point yang akan kita bahas adalah sebagai berikut

  * [Konfigurasi Spring Boot](#Konfigurasi-Spring-Boot)
  * [Membuat DTO](#Membuat-DTO)
  * [Membuat Service](#Membuat-Service)
  * [Membuat Controller](#Membuat-Controller)
  * [Membuat View](#Membuat-View)
  * [Referensi](#Referensi)<figure class="wp-block-image">

<img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-1024x426.png" alt="" class="wp-image-451" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-1024x426.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-300x125.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-768x319.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2.png 1157w" sizes="(max-width: 1024px) 100vw, 1024px" /> <figcaption>Tampilan Utama</figcaption></figure> 

#### Konfigurasi Spring Boot {#Konfigurasi-Spring-Boot}

Untuk konfigurasi sendiri lebih sederhana daripada ketika business proses terletak pada aplikasi, beberapa yang dibutuhkan adalah sebagai berikut

  * `spring-boot-starter-thymeleaf`; paket ini digunakan untuk template engine atau view pada aplikasi yang akan kita buat, nanti dikombinasikan dengan html.
  * `spring-boot-starter-web`; sebuah paket untuk development aplikasi web
  * `spring-data-commons`; menyediakan class untuk proses paging
  * `thymeleaf-spring-data-dialect`; mendukung fungsi untuk paging, digunakan untuk menangkap paging dari controller kemudian diterjemahkan dalam sebuah view

Jika diterjemahkan dalam sebuah file `pom.xml`, isinya adalah sebagai berikut

<pre class="wp-block-code"><code>&lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-thymeleaf&lt;/artifactId>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-web&lt;/artifactId>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.springframework.data&lt;/groupId>
            &lt;artifactId>spring-data-commons&lt;/artifactId>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>io.github.jpenren&lt;/groupId>
            &lt;artifactId>thymeleaf-spring-data-dialect&lt;/artifactId>
            &lt;version>3.4.0&lt;/version>
        &lt;/dependency>

        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-devtools&lt;/artifactId>
            &lt;scope>runtime&lt;/scope>
            &lt;optional>true&lt;/optional>
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
        &lt;/dependency></code></pre>

Selain file `pom.xml`, konfigurasi yang dibutuhkan adalah pada file `application.properties` pada folder `resources`. Isinya seperti di bawah ini

<pre class="wp-block-code"><code>server.port=8083
server.rest=http://localhost:8082</code></pre>

`server.port` adalah port yang digunakan untuk menjalankan aplikasi, sedangkan `server.rest` merupakan service yang akan diakses oleh aplikasi ini.

#### Membuat DTO {#Membuat-DTO}

DTO atau kepanjangan dari Data Transfer Object merupakan sebuah class untuk menampung hasil request dari sebuah service. Misalkan jika pada sebuah service terdapat entitas Mahasiswa, di dalam DTO juga terdapat Mahasiswa. Pada DTO tidak perlu membuat anotasi @Entity karena sifatnya hanya penampung, contoh penggunaannya adalah sebagai berikut

<pre class="wp-block-code"><code>@Data
public class Mahasiswa {
    private String id;
    private String nim;
    private String nama;
    private String jurusan;
    private float ipk;
}</code></pre>

Anotasi yang digunakan hanya `@Data`, untuk menyediakan method getter dan setter saja.

#### Membuat Service {#Membuat-Service}

Service merupakan sebuah class yang berfungsi untuk melakukan akses service atau API, nanti service ini dipanggil oleh sebuah controller. Penerapannya adalah sebagai berikut

<pre class="wp-block-code"><code>@Service
@Slf4j
public class MahasiswaRestClient {
    @Autowired
    private RestTemplate restTemplate;
    @Value(value = "${server.rest}")
    private String restServer;

    public Page&lt;Mahasiswa> getMahasiswas(String param) {
        ParameterizedTypeReference&lt;RestResponsePage&lt;Mahasiswa>> ptr =
                new ParameterizedTypeReference&lt;RestResponsePage&lt;Mahasiswa>>() {
                };
        return restTemplate.exchange(restServer + "/api/mahasiswa" + (param == null ? "" : "?" + param), HttpMethod.GET, null, ptr).getBody();
    }

    public Mahasiswa getMahasiswa(String id) {
        return restTemplate.getForObject(restServer + "/api/mahasiswa/{id}", Mahasiswa.class, id);
    }

    public boolean insert(Mahasiswa mahasiswa) throws HttpStatusCodeException {
        try {
            HttpEntity&lt;Mahasiswa> mahasiswaHttpEntity = new HttpEntity&lt;>(mahasiswa);
            ResponseEntity&lt;String> response = restTemplate.exchange(restServer + "/api/mahasiswa", HttpMethod.POST, mahasiswaHttpEntity, String.class);
            log.info("" + response.getStatusCode().value());
            log.info("" + response.getBody());
            return (HttpStatus.CREATED.value() == response.getStatusCodeValue());
        } catch (HttpStatusCodeException e) {
            throw e;
        }
    }

    public boolean delete(String id) throws HttpStatusCodeException {
        try {
            ResponseEntity&lt;String> response = restTemplate.exchange(restServer + "/api/mahasiswa/{id}", HttpMethod.DELETE, null, String.class, id);
            log.info("" + response.getStatusCode().value());
            return (HttpStatus.OK.value() == response.getStatusCodeValue());
        } catch (HttpStatusCodeException e) {
            throw e;
        }
    }
}</code></pre>

Secara berurutan penjelasannya adalah sebagai berikut

  * `@Service`; sebuah anotasi untuk memberitahukan Spring bahwa class tersebut harus dilakukan scaning, atau class tersebut berarti terdapat anotasi Spring yang lain untuk fungsi tertentu.
  * `@Slf4j`; digunakan untuk logger, anotasi tersebut disediakan oleh depedensi Lombok.
  * `@Autowire`; untuk menginjek sebuah objek, dalam hal ini adalah objek `restTemplate`. Karena objek `restTemplate` adalah class bawaan Spring sehingga kita harus membuatkan sebuah Bean, nanti akan kita bahas terkait itu.
  * `@Value(value = "${server.rest}")`; digunakan untuk membaca konfigurasi yang terdapat pada file `application.properties` dengan tag property `"server.rest"`

<blockquote class="wp-block-quote is-style-default">
  <p>
    iso yo,,haha, kudune pancen ditangkep nganggo jaring sek pas..nek default cok ra paham.
  </p>
  
  <p>
    Inti dari pernyataan di atas adalah untuk menggunakan catch harus menggunakan catch yang sesuai, misalkan penerapan di atas menggunakan HttpStatusCodeException. Ketika sebelumnya menggunakan Exception, saya selalu gagal mengambil error code dan error message. 🙂
  </p>
  
  <cite>temen telegram</cite>
</blockquote>

#### Membuat Controller {#Membuat-Controller}

Controller merupakan pintu masuk dari sebuah request, berfungs untuk memproses request ataupun mengembalikan reqeust. Ketika memproses request untuk meminta sebuah data, controller akan berhubungan pada sebuah class service. Seperti dicontohkan potongan program di bawah ini

<pre class="wp-block-code"><code>@PostMapping("/mahasiswa/form")
    public String editMahasiswa(@ModelAttribute @Valid Mahasiswa mahasiswa, BindingResult errors, SessionStatus status) {
        log.info(mahasiswa.toString());
        log.info(errors.toString());
        log.info("" + errors.hasErrors());
        log.info("" + errors.hasGlobalErrors());
        try {
            mahasiswaRestClient.insert(mahasiswa);
            status.setComplete();
            return "redirect:/";
        } catch (HttpStatusCodeException e) {
            ResponseEntity&lt;String> response = ResponseEntity.status(e.getStatusCode()).headers(e.getResponseHeaders()).body(e.getResponseBodyAsString());
            log.error(response.getBody());
            log.error("" + response.getStatusCodeValue());
            errors.reject("error.object", response.getBody());
        }
        return "/mahasiswa/form";
    }</code></pre>

Potongan kode di atas digunakan untuk menerima request dari view, berfungsi untuk edit data ataupun menyimpan data. `@ModelAttribute` menandakan bahwa terdapat parameter sebuah objek yaitu Mahasiswa, sedangkan `@Valid` berfungsi untuk memvalidasi sebuah objek yang dilewatkan. Objek `errors` berfungsi untuk menampung error jika terdapat error dan objek `status` untuk menampung data session status. Nilai balik dari method tersebut adalah `String`, ketika berhasil insert data maka akan dikembalikan ke halaman `index` sedangkan jika gagal insert akan tetapi di form yang sama dengan menampilkan errornya apa.

#### Membuat View {#Membuat-View}

Untuk view sendiri sebenarnya tidak banyak perubahan dengan postingan saya yang [sebelumnya](https://www.sinaungoding.com/yuk-belajar-web-menggunakan-spring-boot2/), karena untuk view-nya memang tetap. Perbedaan sedikit hanya bagian action ketika klik tombol tertentu, misalkan seperti pada potongan kode pada file `index.html` di bawah ini

<pre class="wp-block-code"><code>&lt;form method="get" th:action="@{'/mahasiswa/detail_form/'+${mhs.id}}" class="d-inline">
                    &lt;button type="submit" class="btn btn-link btn-sm">Detail&lt;/button>
                &lt;/form></code></pre>

Kode di atas adalah sebuah form yang di dalamnya terdapat sebuah tombol, ketika tombol tersebut diklik akan melakukan sebuah aksi yaitu menampilkan detail mahasiswa. Method yang diakses `GET` dengan path variabel. Kode lengkap dapat didapatkan di <a href="https://github.com/0d3ng/web-consume-api.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>. 🙂

Demikianlah artikel saya tentang membangun sebuah aplikasi web menggunakan Spring Boot, dengan data yang diperoleh dari sebuah web service. Semoga menambah ilmu baru dan menimbulkan semangat terus untuk belajar java. Kritik dan saran sangat diharapkan untuk membantu saya untuk memperbaiki tulisan pada blog ini. ^_^

#### Referensi {#Referensi}

  * <https://spring.io/guides/tutorials/rest/>
  * <https://codereview.stackexchange.com/questions/158891/spring-boot-restful-service>
  * <https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html>
  * <https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc>