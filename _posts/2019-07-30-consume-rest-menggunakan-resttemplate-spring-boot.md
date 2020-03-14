---
id: 432
title: Consume REST Menggunakan RestTemplate Spring Boot
date: 2019-07-30T14:49:24+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=432
permalink: /consume-rest-menggunakan-resttemplate-spring-boot/
wp_last_modified_info:
  - July 30, 2019 @ 2:49 pm
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
  - client
  - REST
  - RestTemplate
  - spring
  - spring boot
  - web services
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/REST-Client-1024x683.jpg" alt="" class="wp-image-435" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/REST-Client-1024x683.jpg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/07/REST-Client-300x200.jpg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/REST-Client-768x512.jpg 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
</div>

Bismillah,  
Pada kesempatan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/yuk-belajar-web-service-rest-spring-boot/" target="_blank">sebelumnya</a> saya telah posting Web Service REST menggunakan Spring Boot, di tulisan ini saya akan coba gimana membuat REST client dan tentunya menggunakan Spring Boot. Walaupun sebenarnya bisa dicoba dengan mudah menggunakan tool yang sudah ada seperti browser, curl, ataupun yang lebih cantik menggunakan Postman. Tetapi tidak salahnya kita coba implementasikan Web Service REST client menggunakan Java. Beberapa point yang akan kita bahas adalah sebagai berikut

  * [Konfigurasi Spring Boot](#Konfigurasi-Spring-Boot)
  * [Membuat Entitas](#Membuat-Entitas)
  * [Membuat Class Bantu](#Membuat-Class-Bantu)
  * [Ujicoba Aplikasi](#Ujicoba-Aplikasi)
  * [Referensi](#Referensi)

#### Konfigurasi Spring Boot {#Konfigurasi-Spring-Boot}

Hal pertama yang perlu kita lakukan ada mengkonfigurasi aplikasi yang akan kita buat, bisa menggunakan Spring Initializr di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://start.spring.io/" target="_blank">sini</a> atau create project baru IntelliJ jenis projeknya Spring Initializr. Depedensi yang dibutuhakan adalah `Spring Web Starter` dan `Lombok`. Ya sederahan sekali depedensi yang dibutuhkan, `Spring Web Starter` menyediakan class `RestTemplate` sedangkan `Lombok` yang menyediakan getter dan setter. Berikut ini adalah potongan file `pom.xml` dari project yang akan kita buat

<pre class="wp-block-code"><code>...
&lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-web&lt;/artifactId>
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

Selain file `pom.xml`, konfigurasi yang dibutuhkan adalah menambahkan property pada file `application.properties` di dalam folder `resources`. Isi file tersebut adalah sebagai berikut

<pre class="wp-block-code"><code>base.url=http://localhost:8081</code></pre>

Fungsi properties di atas sebenarnya hanya menyediakan alamat url dari Web Service yang akan kita akses, kita letakkan di file `application.properties` agar kodingan kita lebih rapih dan juga ketika kita jadikan `*.jar` aplikasi kita tidak ikut di dalamnya . 

#### Membuat Entitas {#Membuat-Entitas}

Selanjutnya kita perlu membuat entitas untuk menampung atua mengirimkan objek ke Web Service yang akan kita akses, contoh entitas yang kita buat adalah entitas `Mahasiswa`. Kodenya seperti di bawah ini

<pre class="wp-block-code"><code>@Data
public class Mahasiswa {
    private String nim;
    private String nama;
    private String jurusan;
    private float ipk;
}</code></pre>

Cukup menambahkan `@Data` kita sudah tidak perlu lagi membuat method getter dan setter, anotasi tersebut telah disediakan oleh depedensi `Lombok`.

#### Membuat Class Bantu {#Membuat-Class-Bantu}

Class bantu ini digunakan untuk menyediakan service-service entitas tertentu, misalkan yang sudah kita buat entitas `Mahasiswa` berarti isi class bantu tersebut antara lain `GetMahasiswa, insertMahasiswa, updateMahasiswa,` dll. Contoh kodenya adalah sebagai berikut

<pre class="wp-block-code"><code>@Service
public class AkademikRestClient {

    private final static Logger LOGGER = LoggerFactory.getLogger(AkademikRestClient.class.getName());

    @Value(value = "${base.url}")
    private String basUrl;
    @Autowired
    private RestTemplate restTemplate;

    public String getMahasiswas() {
        String response = restTemplate.getForObject(basUrl + "/api/mahasiswa", String.class);
        LOGGER.info(response);
        return response;
    }

    public Mahasiswa getMahasiswaByNim(String nim) {
        Mahasiswa mahasiswa = restTemplate.getForObject(basUrl + "/api/mahasiswa/{nim}", Mahasiswa.class, nim);
        LOGGER.info(mahasiswa.toString());
        return mahasiswa;
    }

    public String getMahasiswaNama(String nama) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(basUrl + "/api/mahasiswaNama")
                .queryParam("nama", nama);
        LOGGER.info(builder.toUriString());
        String response = restTemplate.getForObject(builder.toUriString(), String.class);
        LOGGER.info(response);
        return response;
    }

    public boolean insert(Mahasiswa mahasiswa) {
        HttpEntity&lt;Mahasiswa> mahasiswaHttpEntity = new HttpEntity&lt;>(mahasiswa);
        ResponseEntity&lt;String> response = restTemplate.exchange(basUrl + "/api/mahasiswa", HttpMethod.POST, mahasiswaHttpEntity, String.class);
        LOGGER.info("" + response.getStatusCode().value());
        return (HttpStatus.CREATED.value() == response.getStatusCodeValue());
    }

}</code></pre>

Penjelasan kode di atas adalah sebagai berikut

  * `@Service`, untuk menandai bahwa class tersebut akan di-`Autowire` di lain class. Sebenarnya `@Service` bisa diganti dengan `@Component` atau `@Repository`
  * `@Value(value = "${base.url}")`, digunakan untuk mengambil nilai yang terdapat pada file application.properties dengan properti `base.url`
  * `@Autowired`, anotasi tersebut pada instance `restTemplate` menandakan bahwa instance tersebut di-inisialisasi dari Spring. Class RestTemplate menyediakan fungsi untuk mengakses REST dengan method `GET, POST, PUT, dan DELETE.` 

Terdapat beberapa class dan method yang penting di atas, class dan method tersebut adalah sebagai berikut

  * `getForObject()`, digunakan untuk mengambil data dengan method yang disediakan adalah `GET`. Ketika dari sisi server hanya mengembalikan HttpStatus sebaiknya tidak menggunakan ini, digunakan ketika server mengembalikan data. 
  * `exchange()`, method ini dapat digunakan untuk semua method http, kita dapat mengambil HttpStatus jika dari server hanya mengembalikan HttpStatus.
  * Class `UriComponentsBuilder`, class yang dapat digunakan untuk membantu request dengan parameter. Misalkan jika method yang kita panggil menggunakan `RequestParameter`. Contoh penggunaannya dicontohkan seperti berikut ini

<pre class="wp-block-code"><code>public String getMahasiswaNama(String nama) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(basUrl + "/api/mahasiswaNama")
                .queryParam("nama", nama);
        LOGGER.info(builder.toUriString());
        String response = restTemplate.getForObject(builder.toUriString(), String.class);
        LOGGER.info(response);
        return response;
    }</code></pre>

Method di atas contoh penggunaan menggunakan parameter, url yang dipanggil seperti ini `http://localhost:8081/api/mahasiswaNama?nama=[parameter]`. Misalkan parameternya ada banyak, tambahkan `.queryParam("nama_parameter","valuenya").`

#### Ujicoba Aplikasi {#Ujicoba-Aplikasi}

Untuk melakukan ujicoba bisa menggunakan unit test, kira-kira kode yang dapat digunakan adalah sebagai berikut

<pre class="wp-block-code"><code>@RunWith(SpringRunner.class)
@SpringBootTest
public class ClientApplicationTests {

    @Autowired
    private AkademikRestClient akademikRestClient;

    @Ignore
    @Test
    public void getMahasiswasTest() {
        String response = akademikRestClient.getMahasiswas();
        assertTrue(response != null && !response.isEmpty());
    }

    @Ignore
    @Test
    public void getMahasiswasByNimTest() {
        Mahasiswa response = akademikRestClient.getMahasiswaByNim("075410099");
        assertTrue(response != null);
    }

    @Ignore
    @Test
    public void getMahasiswasByNamaTest() {
        String response = akademikRestClient.getMahasiswaNama("noprianto");
        assertTrue(response != null && !response.isEmpty());
    }

    @Test
    public void insertMahasiswasTest() {
        Mahasiswa mahasiswa = new Mahasiswa();
        mahasiswa.setNim("075410105");
        mahasiswa.setIpk(2.50F);
        mahasiswa.setJurusan("Teknologi Informasi");
        mahasiswa.setNama("Fullan Bin Fudail");
        assertTrue(akademikRestClient.insert(mahasiswa));
    }

}</code></pre>

Silakan jalankan unit test di atas, hilangkan anotasi `@Ignore` agar setiap methode dilakukan testing. Bagimana mudah bukan? Untuk kode dari contoh di atas dapat didownload di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/akademik-client.git" target="_blank">sini</a>.

Demikianlah tulisan saya penggunaan Spring Boot untuk mengkonsumsi Web Service REST, semoga bermanfaat dan menjadi pengetahuan baru bagi Anda yang sedang belajar Java atau Spring Boot. Kritik dan saran selalu diharapkan untuk meningkatkan kwalitas tulisan saya. 🙂

#### Referensi {#Referensi}

  * <https://www.youtube.com/watch?v=RH4xMPbKLUM&list=PL9oC_cq7OYbw-5C0oaOtuF2bbXsqgFPqy&index=17>
  * <https://spring.io/guides/gs/consuming-rest/>
  * <https://stackoverflow.com/questions/8297215/spring-resttemplate-get-with-parameters>
  * <https://springbootdev.com/2017/11/21/spring-resttemplate-exchange-method/>