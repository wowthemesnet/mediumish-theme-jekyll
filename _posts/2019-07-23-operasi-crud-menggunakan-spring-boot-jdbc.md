---
id: 407
title: Operasi CRUD Menggunakan Spring Boot JDBC
date: 2019-07-23T13:53:25+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=407
permalink: /operasi-crud-menggunakan-spring-boot-jdbc/
wp_last_modified_info:
  - July 23, 2019 @ 9:45 pm
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
  - jdbc
  - Maven
  - spring
  - spring boot
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-jdbc-1024x683.jpg" alt="" class="wp-image-411" /></figure>
</div>

Bismillah,  
Jika pada tulisan yang <a rel="noreferrer noopener" aria-label="lalu (opens in a new tab)" href="https://www.sinaungoding.com/yuk-belajar-spring-boot/" target="_blank">lalu</a> saya sudah mengenalkan framework Spring dan Spring Boot, serta telah membuat CRUD menggunakan JDBC biasa tanpa framework kemudian JDBC dengan framework Hibernate. Pada kesempatan ini akan saya coba membuat CRUD memanfaatkan Spring JDBC.

Seperti yang telah kita ketahui bahwa ketika develop aplikasi menggunakan Spring Boot, konfigurasi aplikasi akan sangat diminimalkan. Misalkan konfigurasi database untuk username, password, port, dan nama database serta masalah datasource yang telah disediakan oleh Spring Boot. Berikut ini adalah point-point yang akan kita bahas ke depan

  * [Konfigurasi Spring Boot](#Konfigurasi-Spring-Boot)
  * [Persiapan Database](#Persiapan-Database)
  * [Pembuatan Entitas](#Pembuatan-Entitas)
  * [Pembuatan DAO](#Pembuatan-DAO)
  * [Testing Aplikasi](#Testing-Aplikasi)
  * [Referensi](#Referensi)

#### Konfigurasi Spring Boot {#Konfigurasi-Spring-Boot}

Pada point ini sudah pernah dibahas pada postingan saya [sebelumn](https://www.sinaungoding.com/yuk-belajar-spring-boot/)<a rel="noreferrer noopener" aria-label="ya (opens in a new tab)" href="https://www.sinaungoding.com/yuk-belajar-spring-boot/" target="_blank">ya</a>, saya akan menggunakan IntelliJ IDEA untuk membuat konfigurasi Spring Boot tersebut. Library yang kita butuhkan adalah JDBC API, MySQL Driver, dan Lombok. 

  * `JDBC API`; menyediakan jembatan untuk mengakses database melalui aplikasi
  * `MySQL Driver`; Driver yang dibutuhkan aplikasi Java, karena DBMS MySQL
  * `Lombok`; menyediakan method setter dan getter

Setelah library-library dibutuhkan telah ditambahkan file `pom.xml` isinya kurang lebih seperti di bawah ini

<pre class="wp-block-code"><code>...
&lt;dependencies>
        &lt;dependency>
            &lt;groupId>org.springframework.boot&lt;/groupId>
            &lt;artifactId>spring-boot-starter-jdbc&lt;/artifactId>
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

#### Persiapan Database {#Persiapan-Database}

Selanjutnya kita membutuhkan struktur database yang akan kita gunakan untuk menjalankan operasi CRUD, database yang akan digunakan adalah menggunakan MySQL. Silakan gunakan struktur database seperti di bawah ini

<pre class="wp-block-code"><code>CREATE DATABASE IF NOT EXISTS akademik;

USE akademik;

CREATE TABLE IF NOT EXISTS mahasiswa(
nim VARCHAR(10) NOT NULL,
nama VARCHAR(50) NOT NULL,
ipk FLOAT(4,2) NOT NULL,
jurusan VARCHAR(25) NOT NULL,
PRIMARY KEY(nim)
)ENGINE=InnoDB;

INSERT INTO mahasiswa VALUES('075410099','Noprianto',4.00,'Teknologi Informasi');
INSERT INTO mahasiswa VALUES('075410100','Noureen Akhlema Shannum',4.00,'Pendidikan Bahasa Inggris');
INSERT INTO mahasiswa VALUES('075410101','Uwais Al-Qarny',3.99,'Teknik Sipil');</code></pre>

Untuk struktur tabel sebenarnya dapat digenereate ketika aplikasi startup, yang terpenting disipakan dulu databasenya. Selain struktur database di atas, kita juga butuh konfigurasi database agar aplikasi kita dapat terkoneksi dengan database. Konfigurasi tersebut terdapat di dalam folder `resources` pada file `application.properties`, isinya adalah sebagai berikut

<pre class="wp-block-preformatted">spring.datasource.username=root
spring.datasource.password=
spring.datasource.url=jdbc:mysql://localhost:3306/akademik?useLegacyDatetimeCode=false&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.initialization-mode=<em>never</em></pre>

Fungsi konfigurasi Spring Boot secara umum untuk melakukan koneksi ke database, terdapat property `spring.datasource.initialization-mode=`_`never`_ berfungsi agar ketika aplikasi startup akan mencari file `schema*.sql` dan `data*.sql`. File schema biasanya berisi _DDL(Data Definition Language)_ seperti create, alter, dan yang lain, sedangkan file data adalah berisi tentang operasi _DML(Data Manipulation Language)_ seperti insert, update, delete, dan yang lain. Nilai yang terdapat pada spring.datasource.initialization-mode adalah sebagai berikut

  * `never`; berarti tidak menjalankan file sql di dalam folder `resources`
  * `always`; selalu menjalankan file sql
  * `embedded`; digunakan untuk model database embed seperti H2

#### Pembuatan Entitas {#Pembuatan-Entitas}

Entitas berfungsi untuk mapping tabel yang terdapat pada database, biasanya satu entitas akan merepresentasikan satu tabel dalam database. Kode yang dapat digunakan adalah sebagai berikut

<pre class="wp-block-code"><code>@Getter
@Setter
public class Mahasiswa {
    @NonNull
    private String nim;
    @NonNull
    private String nama;
    @NonNull
    private float ipk;
    @NonNull
    private String jurusan;

    public Mahasiswa() {
    }

    public Mahasiswa(String nim, String nama, float ipk, String jurusan) {
        this.nim = nim;
        this.nama = nama;
        this.ipk = ipk;
        this.jurusan = jurusan;
    }
}</code></pre>

Dari pembuatan entitas di atas, terdapat anotasi `@Getter` dan `@Setter` yang digunakan untuk menyediakan method getter dan setter. Metode tersebut disediakan oleh library Lombok, sehingga kita tidak perlu membuat methode tersebut secara manual atau generate dari editor. 

<blockquote class="wp-block-quote">
  <p>
    Ketika menggunakan IntelliJ IDEA, jangan lupa untuk memasang plugin Lombok agar ketika memanggil method getter dan setter dapat dilakukan.
  </p>
</blockquote>

#### Pembuatan DAO {#Pembuatan-DAO}

Tidak ada perubahan untuk DAO dari tulisan-tulisan sebelumnya, merupakan interface yang mendefinisikan operasi-operasi pada sebuah entitas. Isi dari DAO adalah sebagai berikut

<pre class="wp-block-code"><code>public interface MahasiswaDao {
    public boolean insert(Mahasiswa mahasiswa);

    public boolean update(Mahasiswa mahasiswa);

    public boolean delete(Mahasiswa mahasiswa);

    public Mahasiswa getByNim(String nim);

    public List&lt;Mahasiswa> getAll();
}</code></pre>

Setelah membuat operasi-operasinya, selalu butuh implementasi dari operasi-operasi di atas dengan membuat class yang implement class di atas. Class tersebut berisi kode seperti di bawah ini

<pre class="wp-block-code"><code>...
@Repository
public class MahasiswaRepository implements MahasiswaDao {

    private final String INSERT = "INSERT INTO mahasiswa (nim, nama, ipk, jurusan) "
            + "	VALUES (?,?,?,?)";
    private final String UPDATE = "UPDATE mahasiswa SET nama=?, ipk=?, jurusan=? WHERE nim=?";
    private final String DELETE = "DELETE FROM mahasiswa WHERE nim=?";
    private final String SELECT_ALL = "SELECT nim,nama,ipk,jurusan FROM mahasiswa";
    private final String SELECT_BY_NIM = "SELECT nim,nama,ipk,jurusan FROM mahasiswa WHERE nim=?";

    private static Logger LOGGER = LoggerFactory.getLogger(MahasiswaRepository.class.getName());

    @Autowired
    private DataSource dataSource;

    private Connection connection;
    private PreparedStatement preparedStatement;

    @Override
    public boolean insert(Mahasiswa mahasiswa) {
        try {
            connection = dataSource.getConnection();
            preparedStatement = connection.prepareStatement(INSERT);
            preparedStatement.setString(1, mahasiswa.getNim());
            preparedStatement.setString(2, mahasiswa.getNama());
            preparedStatement.setFloat(3, mahasiswa.getIpk());
            preparedStatement.setString(4, mahasiswa.getJurusan());
            return preparedStatement.executeUpdate() > 0 ? true : false;
        } catch (SQLException e) {
            LOGGER.error(null, e);
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    LOGGER.error(null, e);
                }
            }
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    LOGGER.error(null, e);
                }
            }

        }
        return false;
    }
...</code></pre>

Sebenarnya class di atas mirip dengan JDBC biasa, perbedaannya adalah kita tidak perlu melewatkan objek `datasource` untuk mengakses database. Objek `datasource` tersebut telah disediakan oleh Spring, cukup dengan menambahkan anotasi `@Autowired`. Selanjutnya dibutuhkan anotasi `@Repository` untuk memberitahu Spring agar dalam class ini dilakukan scanning atau konfigurasi.

#### Testing Aplikasi {#Testing-Aplikasi}

Waktunya ujicoba aplikasi, setelah kita konfigurasi dan mendefinisikan kebutuhkan untuk menjalankan aplikasi CRUD menggunakan Spring Boot. Saya menggunakan unit test untuk melakukan hal tersebut, kodenya kurang lebih seperti ini

<pre class="wp-block-code"><code>@RunWith(SpringRunner.class)
@SpringBootTest
public class JdbcApplicationTests {

    @Autowired
    private MahasiswaDao mahasiswaDao;

    @Test
    public void getAll() {
        Mahasiswa mahasiswa = new Mahasiswa("075410099", "Noprianto", 3.99F, "Teknik Informatika");
        assertTrue(mahasiswaDao.insert(mahasiswa));
    }

}</code></pre>

Silakan dijalankan kode di atas, jika semuanya normal seharusnya unit test tersebut statusnya `Tests passed.` Jika dilihat dari kode di atas, untuk melakukan menambahkan data mahasiswa ke database hanya dibutuhkan anotasi @Autowired untuk meng-instance MahasiswaDao. Kode program dapat didapatkan di <a href="https://github.com/0d3ng/crud-spring-boot.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah artikel saya mengenai operasi CRUD menggunakan Spring Boot JDBC, semoga dapat menambahkan pengetahuan temen-temen untuk belajar Spring Boot. Kritik dan saran sangat dibutuhkan untuk memberikan motivasi perbaikan blog ini. Happy coding. ^_^

#### Referensi {#Referensi}

  * <https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-sql>
  * <https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html>
  * <https://www.youtube.com/watch?v=BEVrHuIO2lM&list=PL9oC_cq7OYbyhdZmCECQqp7OcS8J5QpAo>