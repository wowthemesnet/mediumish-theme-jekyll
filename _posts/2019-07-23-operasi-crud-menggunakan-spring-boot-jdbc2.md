---
id: 415
title: Operasi CRUD Menggunakan Spring Boot JDBC(Bagian 2)
date: 2019-07-23T23:21:12+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=415
permalink: /operasi-crud-menggunakan-spring-boot-jdbc2/
wp_last_modified_info:
  - July 23, 2019 @ 11:21 pm
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
  - jdbc
  - jdbcdaosupport
  - jdbctemplate
  - spring
  - spring boot
---
<figure class="wp-block-image"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-jdbc2-1024x682.jpg" alt="" class="wp-image-417" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-jdbc2-1024x682.jpg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-jdbc2-300x200.jpg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-jdbc2-768x511.jpg 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure> 

Bismillah,  
Sebenarnya postingan kali ini adalah kelanjutan dari postingan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/operasi-crud-menggunakan-spring-boot-jdbc/" target="_blank">sebelumnya</a>, yang mana di dalam postingan tersebut membahas bagaimana Spring menyediakan kemudahan akses ke dalam database. Selain itu, dengan konfigurasi yang sangat sederhana juga. Projek aplikasi yang digunakan dalam artikel ini masih menggunakan projek pada artikel sebelumnya, silakan clone di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/crud-spring-boot.git" target="_blank">sini</a> projek tersebut.

Ternyata Spring juga menyediakan magic kembali untuk urusan jdbc yaitu terdapat `class JdbcTemplate` dan `JdbcDaoSupport` untuk melakukan operasi-operasi database. Agar terstuktur alur ceritanya saya buat beberapa point seperti berikut

  * [Penggunaan class JdbcTemplate](#Penggunaan-class-JdbcTemplate)
  * [Penggunaan JdbcDaoSupport](#Penggunaan-JdbcDaoSupport)
  * [Testing Aplikasi](#Testing-Aplikasi)
  * [Referensi](#Referensi)

#### Penggunaan class JdbcTemplate {#Penggunaan-class-JdbcTemplate}

Class JdbcTemplate merupakan class utama yang terdapat pada paket utama JDBC, fungsi class ini menyederhanakan operasi-operasi dalam database misalkan untuk mendapatkan koneksi ke database atau untuk urusan handle resource dalam database. Contoh penggunaan class JdbcTemplate kurang lebih seperti berikut ini

<pre class="wp-block-code"><code>@Repository
public class MahasiswaRepository implements MahasiswaDao {

    private final String INSERT = "INSERT INTO mahasiswa (nim, nama, ipk, jurusan) "
            + "	VALUES (?,?,?,?)";
    private final String UPDATE = "UPDATE mahasiswa SET nama=?, ipk=?, jurusan=? WHERE nim=?";
    private final String DELETE = "DELETE FROM mahasiswa WHERE nim=?";
    private final String SELECT_ALL = "SELECT nim,nama,ipk,jurusan FROM mahasiswa";
    private final String SELECT_BY_NIM = "SELECT nim,nama,ipk,jurusan FROM mahasiswa WHERE nim=?";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public boolean insert(Mahasiswa mahasiswa) {
        return jdbcTemplate.update(INSERT, new Object[]{mahasiswa.getNim(), mahasiswa.getNama(), mahasiswa.getIpk(), mahasiswa.getJurusan()}) > 0 ? true : false;
    }

    @Override
    public boolean update(Mahasiswa mahasiswa) {
        return jdbcTemplate.update(UPDATE, new Object[]{mahasiswa.getNama(), mahasiswa.getIpk(), mahasiswa.getJurusan(), mahasiswa.getNim()}) > 0 ? true : false;
    }

    @Override
    public boolean delete(Mahasiswa mahasiswa) {
        return jdbcTemplate.update(DELETE, new Object[]{mahasiswa.getNim()}) > 0 ? true : false;
    }

    @Override
    public Mahasiswa getByNim(String nim) {
        return jdbcTemplate.queryForObject(SELECT_BY_NIM, new Object[]{nim}, new MahasiswaRowMapper());
    }

    @Override
    public List&lt;Mahasiswa> getAll() {
        return jdbcTemplate.query(SELECT_ALL, new MahasiswaRowMapper());
    }

    private class MahasiswaRowMapper implements RowMapper&lt;Mahasiswa> {

        @Override
        public Mahasiswa mapRow(ResultSet resultSet, int i) throws SQLException {
            Mahasiswa mahasiswa = new Mahasiswa();
            mahasiswa.setNim(resultSet.getString("nim"));
            mahasiswa.setNama(resultSet.getString("nama"));
            mahasiswa.setJurusan(resultSet.getString("jurusan"));
            mahasiswa.setIpk(resultSet.getFloat("ipk"));
            return mahasiswa;
        }
    }
}</code></pre>

Terlihat kode di atas jauh lebih sederhana ketika menggunakan jdbc biasa, jangan lupa menambahkan `@Autowired` pada `JdbcTemplate` agar class tersebut di-instance-kan oleh framework Spring. Kemudian beralih ke operasi insert ke dalam database, hanya 1 baris dari yang sebelumnya lebih dari 10 baris kode. Dalam operasi tersebut tidak membutuhkan instance class `Connection`, `PreparedStatement`, ataupun melakukan close instance tersebut. Selanjutnya untuk mengambil data kita perlu me-mapping object dengan membuat class yang diturunkan dari interface `RowMapper`.

#### Penggunaan JdbcDaoSupport {#Penggunaan-JdbcDaoSupport}

Sebenarnya tidak jauh beda dengan class `JdbcTemplate` fungsinya, perbedaannya adalah pada class ini harus melewatkan datasource ketika init pertama kali. Untuk penggunaan class ini, caranya adalah class yang akan implement class DAO harus extends `JdbcDaoSupport`. Kodenya dapat dilihat seperti berikut ini

<pre class="wp-block-code"><code>@Repository
public class MahasiswaRepository extends JdbcDaoSupport implements MahasiswaDao {

    private final String INSERT = "INSERT INTO mahasiswa (nim, nama, ipk, jurusan) "
            + "	VALUES (?,?,?,?)";
    private final String UPDATE = "UPDATE mahasiswa SET nama=?, ipk=?, jurusan=? WHERE nim=?";
    private final String DELETE = "DELETE FROM mahasiswa WHERE nim=?";
    private final String SELECT_ALL = "SELECT nim,nama,ipk,jurusan FROM mahasiswa";
    private final String SELECT_BY_NIM = "SELECT nim,nama,ipk,jurusan FROM mahasiswa WHERE nim=?";

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void init() {
        setDataSource(dataSource);
    }

    @Override
    public boolean insert(Mahasiswa mahasiswa) {
        return getJdbcTemplate().update(INSERT, new Object[]{mahasiswa.getNim(), mahasiswa.getNama(), mahasiswa.getIpk(), mahasiswa.getJurusan()}) > 0 ? true : false;
    }

    @Override
    public boolean update(Mahasiswa mahasiswa) {
        return getJdbcTemplate().update(UPDATE, new Object[]{mahasiswa.getNama(), mahasiswa.getIpk(), mahasiswa.getJurusan(), mahasiswa.getNim()}) > 0 ? true : false;
    }

    @Override
    public boolean delete(Mahasiswa mahasiswa) {
        return getJdbcTemplate().update(DELETE, new Object[]{mahasiswa.getNim()}) > 0 ? true : false;
    }

    @Override
    public Mahasiswa getByNim(String nim) {
        return getJdbcTemplate().queryForObject(SELECT_BY_NIM, new Object[]{nim}, new MahasiswaRowMapper());
    }

    @Override
    public List&lt;Mahasiswa> getAll() {
        return getJdbcTemplate().query(SELECT_ALL, new MahasiswaRowMapper());
    }

    private class MahasiswaRowMapper implements RowMapper&lt;Mahasiswa> {

        @Override
        public Mahasiswa mapRow(ResultSet resultSet, int i) throws SQLException {
            Mahasiswa mahasiswa = new Mahasiswa();
            mahasiswa.setNim(resultSet.getString("nim"));
            mahasiswa.setNama(resultSet.getString("nama"));
            mahasiswa.setJurusan(resultSet.getString("jurusan"));
            mahasiswa.setIpk(resultSet.getFloat("ipk"));
            return mahasiswa;
        }
    }
}</code></pre>

Terlihat bahwa kita harus `@Autowired Datasource`, selanjutnya melewatkan pertama kali ketika Spring melakukan scanning dengan memanggil method `setDatasource()` menggunakan anotasi `@PostConstruct`. Kemudaian mengambil instance `jdbcTemplate` dengan memanggil method `getJdbcTemplate()`, selanjutnya kita melakukan operasi-operasi pada database.

#### Testing Aplikasi {#Testing-Aplikasi}

Untuk melakukan unit test, silakan test method-method yang telah Anda buat. Berikut ini contohnya

<pre class="wp-block-code"><code>@RunWith(SpringRunner.class)
@SpringBootTest
public class JdbcApplicationTests {

    @Autowired
    private MahasiswaDao mahasiswaDao;

    @Test
    @Ignore
    public void insertTest() {
        Mahasiswa mahasiswa = new Mahasiswa("075410099", "Noprianto", 3.99F, "Teknik Informatika");
        assertTrue(mahasiswaDao.insert(mahasiswa));
    }

    @Test
    public void getByNimTest() {
        assertNotNull(mahasiswaDao.getByNim("075410099"));
    }

    @Test
    public void getAllTest() {
        assertTrue(!mahasiswaDao.getAll().isEmpty());
    }

}</code></pre>

Jika semuanya normal seharusnya methode `getByNimTest()` dan `getAllTest()` statusnya akan `Passed` ketika unit test dijalankan. Untuk full code silakan dapat Anda dapatkan di <a href="https://github.com/0d3ng/crud-spring-boot.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>, jangan lupa disesuaikan untuk branch-nya.

Demikianlah artikel saya mengenai jdbc menggunakan Spring, bagaimana mudah bukan? Semoga bermanfaat dan menambah semangat belajar mengkoding Java. 🙂

#### Referensi {#Referensi}

  * <https://docs.spring.io/spring/docs/2.0.x/reference/jdbc.html>
  * <https://www.mkyong.com/spring/spring-jdbctemplate-jdbcdaosupport-examples/>
  * <https://www.tutorialspoint.com/springjdbc/springjdbc_jdbctemplate>