---
id: 419
title: Operasi CRUD Menggunakan Spring Boot JPA
date: 2019-07-24T21:47:01+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=419
permalink: /operasi-crud-menggunakan-spring-boot-jpa/
wp_last_modified_info:
  - July 24, 2019 @ 9:47 pm
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
  - spring
  - spring boot
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-Data-JPA-1024x683.jpg" alt="" class="wp-image-421" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-Data-JPA-1024x683.jpg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-Data-JPA-300x200.jpg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-Data-JPA-768x512.jpg 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
</div>

Bismillah,  
Postingan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/operasi-crud-menggunakan-spring-boot-jdbc2/" target="_blank">sebelumnya</a> sudah membahas mengenai operasi CRUD menggunakan Spring Boot JDBC, di sana kita sudah dimanjakan dengan template crud oleh Spring menggunakan class `JdbcTemplate` dan `JdbcDaoSupport`. Sebenarnya masih ada kekurangan, yaitu kita tetap harus menuliskan query ke dalam database. Dengan adanya kekurangan tersebut akan tersebut munculnya **Java Persistance API(JPA)**, ketika menggunakan JPA kita tidak membutuhakan query pada umumnya tetapi yang digunakan adalah query ke sebuah objek. Beberapa yang akan kita bahas adalah sebagai berikut

  * [Konfigurasi Spring Boot JPA](#Konfigurasi-Spring-Boot-JPA)
  * [Konfigurasi File Properties](#Konfigurasi-File-Properties)
  * [Pembuatan Entitas](#Pembuatan-Entitas)
  * [Pembuatan Repository](#Pembuatan-Repository)
  * [Testing Aplikasi](#Testing-Aplikasi)
  * [Referensi](#Referensi)

#### Konfigurasi Spring Boot JPA {#Konfigurasi-Spring-Boot-JPA}

Untuk melakukan konfigurasi tidak jauh beda dengan yang sebelumnya yaitu saya menggunakan IntelliJ IDEA, atau Anda bisa menggunakan versi web untuk membuat project Spring Boot menggunakan Spring Initialzr di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://start.spring.io/" target="_blank">sini</a>. Beberapa library yang dibutuhkan adalah `Spring Data JPA, MySQL Driver, dan Lombok`. Potongan file `pom.xml` adalah sebagai berikut

<pre class="wp-block-code"><code>...
&lt;dependencies>
        &lt;dependency>
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
            &lt;optional>true&lt;/optional>
        &lt;/dependency>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-test&lt;/artifactId>
            &lt;scope>test&lt;/scope>
        &lt;/dependency>
    &lt;/dependencies>
...</code></pre>

#### Konfigurasi File Properties {#Konfigurasi-File-Properties}

Selain file `pom.xml`, file konfigurasi yang sangat penting adalah file `application.properties` yang terdapat di dalam folder `resources`. File tersebut berfungsi untuk mengkonfigurasi perilaku aplikasi Spring Boot ketika berjalan, isi dari file kurang lebih seperti di bawah ini

<pre class="wp-block-code"><code>spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=validate
spring.datasource.url=jdbc:mysql://localhost:3306/akademik?useLegacyDatetimeCode=false&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true</code></pre>

Penjelasan dari maksud konfigurasi di atas adalah sebagai berikut

  * `spring.jpa.hibernate.ddl-auto=validate`, berarti struktur mapping class entitas dengan database divalidasi. Ketika tidak sesuai maka akan menunjukkan error ketika dijalankan.
  * `spring.jpa.show-sql=true`, query akan ditampilkan pada output ketika melakukan operasi database.
  * `spring.jpa.properties.hibernate.format_sql=true`, query akan terlihat lebih rapi identasinya.

#### Pembuatan Entitas {#Pembuatan-Entitas}

Karena kita akan membuat CRUD yang berkaitan dengan akademik, contohnya adalah entitas mahasiswa sehingga entitas yang akan dibuat adalah sebagai berikut

<pre class="wp-block-code"><code>import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Setter
@Entity
public class Mahasiswa {
    @Id
    private String nim;
    private String nama;
    private String jurusan;
    private float ipk;
}</code></pre>

Penjelasan dari kode di atas adalah sebagai berikut

  * Anotasi `@Getter dan @Setter` digunakan untuk menyediakan method Getter dan Setter tanpa kita membuatnya, karena telah disediakan oleh Lombok.
  * `@Entitas`, berarti bahwa class `Mahasiswa` adalah sebuah entitas yang akan dimapping ke dalam tabel mahasiswa pada database. Ketika nama tabel dibuat sama dengan nama entitas, kita tidak perlu menambahkan anotasi `@Table` ditambahkan property nama tabel.
  * `@Id` merupakan identifier atau primary key dalam entitas mahasiswa, identifier tersebut wajib hukumnya.

#### Pembuatan Repository {#Pembuatan-Repository}

Selain pada entitas yang beda dari sebelumnya, perbedaan yang sangat mencolok adalah pada bagian ini. Jika yang sebelumnya class ini merupakan class yang mengimplementasi sebuah interface DAO, jika pada class ini tetap sebuah interface yang extends interface `CrudRepository`. Kodenya seperti di bawah ini

<pre class="wp-block-code"><code>import com.sinaungoding.crud.jpa.entitas.Mahasiswa;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MahasiswaRepository extends CrudRepository&lt;Mahasiswa, String> {
    public List&lt;Mahasiswa> findByNamaContaining(String nama);
}</code></pre>

Dengan extends interface `CrudRepository` kita sudah mempunya fungsi-fungsi untuk aplikasi crud yang akan kita bangun, pada interface tersebut terdapat sebuah wrapper yaitu entitas dan tipe data dari field yang dijadikan identifier atau `@Id`. Tetapi misalkan kita akan menambahkan operasi yang lebih komplek lagi, kita bisa mendefinisikan operasi tersebut. Misalkan kita akan mencari nama mahasiswa yang mengandung kata tertentu, method `findByNamaContaining()` perlu ditambahkan. Penamaan method menjadi dasar Spring untuk melakukan query objek, tetapi jika mau membuat nama method sesuai selera perlu ditambahkan anotasi `@Query` di atas method yang Anda buat. Misalkan sebagai berikut

<pre class="wp-block-code"><code>@Query("select u from User u where u.emailAddress = ?1")
User findByEmailAddress(String emailAddress);</code></pre>

Perintah di atas digunakan untuk mengambil data user berdasarkan alamat email, query yang dituliskan bukan query sql tetapi query objek.

#### Testing Aplikasi {#Testing-Aplikasi}

Kita akan mencoba aplikasi crud yang telah kita buat menggunakan junit, kode programnya kurang lebih seperti di bawah ini

<pre class="wp-block-code"><code>@RunWith(SpringRunner.class)
@SpringBootTest
public class JpaApplicationTests {

    @Autowired
    private MahasiswaRepository mahasiswaRepository;

    @Test
    @Ignore
    public void insertTest() {
        Mahasiswa mahasiswa = new Mahasiswa();
        mahasiswa.setNim("075410100");
        mahasiswa.setNama("Singgih Kuncoro");
        mahasiswa.setIpk(3.50F);
        mahasiswa.setJurusan("Manajemen Informasi");
        Mahasiswa save = mahasiswaRepository.save(mahasiswa);
        assertNotNull(save);
        mahasiswa = new Mahasiswa();
        mahasiswa.setNim("075410101");
        mahasiswa.setNama("Singgih Permana");
        mahasiswa.setIpk(3.54F);
        mahasiswa.setJurusan("Teknologi Informasi");
        save = mahasiswaRepository.save(mahasiswa);
        assertNotNull(save);
    }

    @Test
    @Ignore
    public void getMahasiswaByNimTest() {
        Mahasiswa mhs = mahasiswaRepository.findById("075410099").get();
        assertNotNull(mhs);
    }

    @Test
    @Ignore
    public void getAllMahasiswaTest() {
        Iterable&lt;Mahasiswa> mahasiswas = mahasiswaRepository.findAll();
        List&lt;Mahasiswa> list = new ArrayList&lt;>();
        for (Mahasiswa mahasiswa : mahasiswas) {
            list.add(mahasiswa);
        }
        assertTrue(!list.isEmpty());
    }

    @Test
    public void getMahasiswaByNamaLike() {
        List&lt;Mahasiswa> mahasiswas = mahasiswaRepository.findByNamaContaining("Singgih");
        assertTrue(!mahasiswas.isEmpty());
    }

}</code></pre>

Jika semuanya normal, method getMahasiswaByNamaLike() ketika dijalankan stautsnya &#8220;passed&#8221;. Tampilan di tab run editor kira-kira terdapat log seperti di bawah ini

<pre class="wp-block-code"><code>...
Hibernate: 
    select
        mahasiswa0_.nim as nim1_0_,
        mahasiswa0_.ipk as ipk2_0_,
        mahasiswa0_.jurusan as jurusan3_0_,
        mahasiswa0_.nama as nama4_0_ 
    from
        mahasiswa mahasiswa0_ 
    where
        mahasiswa0_.nama like ? escape ?
...</code></pre>

Output di atas karena pada file application.properties telah ditambahkan `spring.jpa.show-sql=true` dan `spring.jpa.properties.hibernate.format_sql=true`. Bagaimana mudah bukan untuk membuat aplikasi CRUD menggunakan Spring Boot JPA? Full kode dapat Anda dapatkan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/crud-jpa-spring-boot.git" target="_blank">sini</a>.

Demikianlah tulisan saya tentang penggunakan Spring Data JPA menggunakan Spring Boot, semoga tulisan saya bermanfaat. Saran dan kiritik sangat diharapkan untuk memperbaiki blog ini. ^_^

#### Referensi {#Referensi}

  * <https://docs.spring.io/spring-data/jpa/docs/2.1.9.RELEASE/reference/html/>
  * <https://www.mkyong.com/spring-boot/spring-boot-spring-data-jpa/>
  * <https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa>