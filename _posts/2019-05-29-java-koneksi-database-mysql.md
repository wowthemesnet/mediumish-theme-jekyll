---
id: 205
title: 'Java &#8211; Koneksi Database MySQL'
date: 2019-05-29T11:30:44+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=205
permalink: /java-koneksi-database-mysql/
wp_last_modified_info:
  - June 14, 2019 @ 3:46 pm
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
  - DBMS
  - jdbc
  - JUnit
  - Maven
  - MySQL
---
Bismillah,  
MySQL merupakan salah DBMS(Database Management System) yang sangat terkenal di dunia perkodingan. Aplikasi yang kita bangun sepertinya bagai sayur tanpa garam jika tidak bisa melakukan penyimpanan secara permanen, artinya data yang sudah kita simpan sebelumnya dapat dipanggil atau ditampilkan kembali kemudian. Beberapa contoh DBMS(Database Management System) yang lain seperti Oracle, Microsoft Access, PostgreSQL, SQLite, dan yang lainnya. Agar Java dapat berkomunikasi ke database MySQL dibutuhkan sebuah driver yaitu JDBC(Java Database Conectivity).

<blockquote class="wp-block-quote">
  <p>
    Contoh kode yang digunakan dalam tulisan ini dibuat menggunakan editor Netbeans 8.2 Java 8 dengan build tool Maven. Kemudian juga menggunakan junit untuk melakukan unit testing, Insya alloh perlengkapan tempur di atas adalah tool familiar yang digunakan oleh programmer java.
  </p>
  
  <p>
    Kenapa menggunakan Maven? tidak Ant aja, bawaan Netbeans ketika membuat project Java. Maven merupakan sebuah package manager atau sebuah tool untuk mengorganisasi library, selain itu juga digunakan untuk membungkus aplikasi yang akan kita deploy. Misalnya seperti ini, jika kita menggunakan Maven kita tidak perlu include library yang dibutuhkan sehingga ketika upload ke github akan lebih ringan(ngirit bandwidth). Selanjutnya project yang dibuat menggunakan Maven juga dapat dibuka oleh editor apapun yang support Maven. Semua konfigurasi project Maven terdapat di dalam file pom.xml
  </p>
</blockquote>

#### Fungsi CRUD MySQL dengan Java

Ya, biasanya ketika akan mencoba teknologi yang baru dalam programming hal yang pertama biasanya adalah membuat aplikasi CRUD(Create, Read, Update, dan Delete). Kenapa demikian karena ketika kita membangun sebuah aplikasi, pasti di dalam aplikasi tersebut ada fitur atau fungsi CRUD.

<pre class="wp-block-code"><code>import com.mysql.cj.jdbc.MysqlDataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Koneksi {

    private static Connection connection;

    public static Connection getConnection() {
        if (connection == null) {
            try {
                MysqlDataSource dataSource = new MysqlDataSource();
                dataSource.setUser("root");
                dataSource.setPassword("");
                dataSource.setUrl("jdbc:mysql://localhost:3306/akademik?useLegacyDatetimeCode=false&serverTimezone=UTC");
                connection = dataSource.getConnection();
            } catch (SQLException ex) {
                Logger.getLogger(Koneksi.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return connection;
    }

}</code></pre>

Potongan program di atas adalah sebuah class yang berfungsi untuk membangun koneksi ke MySQL, kita deklarasikan interface Connection dengan akses modifier private dan static dan dibuat metode getConnection() untuk mendapatkan koneksi. Di dalam methode tersebut terdapat pengecekan untuk memastikan bahwa koneksi hanya dilakukan sekali ketika aplikasi berjalan, konsep seperti ini sering disebut sebagai singleton. Mengapa singleton? Bayangkan saja misalkan kita punya aplikasi multihreading yang mengakses resource database secara paralel, akibatnya penggunaan CPU akan tinggi dan jika tidak terkontrol aplikasi kita akan mengakibatkan lag. Salah satu cara untuk melakukan setting parameter database koneksi MySQL adalah dengan membuat instance dari objek MysqlDataSource, selanjutnya kita bisa panggil methode set untuk melakukan setting parameter yang kita butuhkan. Contoh di atas yang dilakukan set adalah user, password, dan url.

<pre class="wp-block-code"><code>public class Mahasiswa {
    
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;

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

    @Override
    public String toString() {
        return "Mahasiswa{" + "nim=" + nim + ", nama=" + nama + ", ipk=" + ipk + ", jurusan=" + jurusan + '}';
    }
    
    
}</code></pre>

Rencananya kita akan membuat sebuah tabel yang dimanfaatkan untuk menampung informasi mahasiswa, sehingga kita representasikan ke dalam sebuah class yaitu Mahasiswa. Jika di Java sering disebut dengan entitas atau juga POJO, dimana di dalam class tersebut hanya terdapat getter dan setter. Kenapa hanya terdapat setter dan getter, karena kita tidak diizinkan sembarangan untuk mengubah dan mengambil nilai yang terdapat pada class mahasiswa. Konsep seperti ini sering disebut dengan enkapsulasi.

<pre class="wp-block-code"><code>public interface MahasiswaDao {

    public boolean insert(Mahasiswa m);

    public boolean update(Mahasiswa m);

    public boolean delete(String nim);

    public Mahasiswa getMahasiswaByNim(String nim);

    public List&lt;Mahasiswa> getAllMahasiswa();

}</code></pre>

Selanjutnya kita membuat sebuah DAO, atau kepanjangan dari Data Access Object adalah sebuah interface yang menyediakan fungsi-fungsi pada entitas mahasiswa. Dengan menggunakan DAO ini, kode yang berisi tentang business proses(query ke database) akan dipisahkan secara jelas dan baik.

<pre class="wp-block-code"><code>import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author od3ng
 */
public class MahasiswaImpl implements MahasiswaDao {

    private final Connection connection;

    private final String INSERT = "INSERT INTO mahasiswa (nim, nama, ipk, jurusan) "
            + "	VALUES (?,?,?,?)";
    private final String UPDATE = "UPDATE mahasiswa SET nama=?, ipk=?, jurusan=? WHERE nim=?";
    private final String DELETE = "DELETE FROM mahasiswa WHERE nim=?";
    private final String SELECT_ALL = "SELECT nim,nama,ipk,jurusan FROM mahasiswa";
    private final String SELECT_BY_NIM = "SELECT nim,nama,ipk,jurusan FROM mahasiswa WHERE nim=?";

    public MahasiswaImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public boolean insert(Mahasiswa m) {
        PreparedStatement prepareStatement = null;
        try {
            prepareStatement = connection.prepareStatement(INSERT);
            prepareStatement.setString(1, m.getNim());
            prepareStatement.setString(2, m.getNama());
            prepareStatement.setFloat(3, m.getIpk());
            prepareStatement.setString(4, m.getJurusan());
            return prepareStatement.executeUpdate() > 0;
        } catch (SQLException ex) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (prepareStatement != null) {
                try {
                    prepareStatement.close();
                } catch (SQLException ex) {
                    Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return false;
    }

    @Override
    public boolean update(Mahasiswa m) {
        PreparedStatement prepareStatement = null;
        try {
            prepareStatement = connection.prepareStatement(UPDATE);
            prepareStatement.setString(1, m.getNama());
            prepareStatement.setFloat(2, m.getIpk());
            prepareStatement.setString(3, m.getJurusan());
            prepareStatement.setString(4, m.getNim());
            return prepareStatement.executeUpdate() > 0;
        } catch (SQLException ex) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (prepareStatement != null) {
                try {
                    prepareStatement.close();
                } catch (SQLException ex) {
                    Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return false;
    }

    @Override
    public boolean delete(String nim) {
        PreparedStatement prepareStatement = null;
        try {
            prepareStatement = connection.prepareStatement(DELETE);
            prepareStatement.setString(1, nim);
            return prepareStatement.executeUpdate() > 0;
        } catch (SQLException ex) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (prepareStatement != null) {
                try {
                    prepareStatement.close();
                } catch (SQLException ex) {
                    Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return false;
    }

    @Override
    public Mahasiswa getMahasiswaByNim(String nim) {
        PreparedStatement prepareStatement = null;
        ResultSet executeQuery = null;
        Mahasiswa m = null;
        try {
            prepareStatement = connection.prepareStatement(SELECT_BY_NIM);
            prepareStatement.setString(1, nim);
            executeQuery = prepareStatement.executeQuery();
            if (executeQuery.next()) {
                System.out.println(""+SELECT_BY_NIM);
                m = new Mahasiswa(executeQuery.getNString("nim"), executeQuery.getString("nama"), executeQuery.getFloat("ipk"), executeQuery.getString("jurusan"));
            }
        } catch (SQLException ex) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
        } finally {

            try {
                if (prepareStatement != null) {
                    prepareStatement.close();
                }
                if (executeQuery != null) {
                    executeQuery.close();
                }
            } catch (SQLException ex) {
                Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
        return m;
    }

    @Override
    public List&lt;Mahasiswa> getAllMahasiswa() {
        List&lt;Mahasiswa> mahasiswas = new ArrayList&lt;>();
        Statement statement = null;
        ResultSet executeQuery = null;
        try {
            statement = connection.createStatement();
            executeQuery = statement.executeQuery(SELECT_ALL);
            while (executeQuery.next()) {
                Mahasiswa m = new Mahasiswa(executeQuery.getNString("nim"), executeQuery.getString("nama"), executeQuery.getFloat("ipk"), executeQuery.getString("jurusan"));
                mahasiswas.add(m);
            }
        } catch (SQLException ex) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
        } finally {

            try {
                if (statement != null) {
                    statement.close();
                }
                if (executeQuery != null) {
                    executeQuery.close();
                }
            } catch (SQLException ex) {
                Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
        return mahasiswas;
    }

}</code></pre>

Kode yang sebelumnya adalah sebuah interface dari sebuah DAO, jika ada sebuah interface maka tentunya kita membutuhkan sebuah class untuk mengimplementasikan semua fungsi-fungsi yang terdapat dalam DAO. Kode di atas mengimplementasikan semua operasi-operasi pada mahasiswa. 

Jika dilihat dari kode di atas, class yang sering digunakan adalah PrepareStatement, Statement, dan Resultset. Fungsi dari class PrepareStatement dan Statement sebenarnya sama-sama melakukan query ke database, perbedaannya adalah untuk menuliskan query menggunakan PrepareStatement diizinkan menggunakan &#8220;?&#8221; ketika melewatkan parameter sedangkan Statement biasanya langsung variabel. Sebaiknya menggunakan PrepareStatement jika query tersebut melewatkan sebuah parameter. Resultset sendiri digunakan untuk menampung nilai hasil dari query ke database, jangan lupa ketika setelah melakukan akses ke database untuk melakukan release resource dengan memanggil fungsi close() baik pada PrepareStatement, Statement ataupun Resultset. 

<pre class="wp-block-code"><code>public interface MahasiswaService {
    
    public boolean insert(Mahasiswa m);

    public boolean update(Mahasiswa m);

    public boolean delete(String nim);

    public Mahasiswa getMahasiswaByNim(String nim);

    public List&lt;Mahasiswa> getAllMahasiswa();
    
}</code></pre>

Interface di atas saya sebut sebagai service, nama methodenya pun sama dengan yang terdapat pada DAO. Service di sini berfungsi penyedia layanan-layanan yang ada pada mahasiswa, dari sini nanti akan request ke DAO.

<pre class="wp-block-code"><code>public class MahasiswaServiceImpl implements MahasiswaService {

    private final MahasiswaDao mahasiswaDao;

    public MahasiswaServiceImpl(MahasiswaDao mahasiswaDao) {
        this.mahasiswaDao = mahasiswaDao;
    }

    @Override
    public boolean insert(Mahasiswa m) {
        return mahasiswaDao.insert(m);
    }

    @Override
    public boolean update(Mahasiswa m) {
        return mahasiswaDao.update(m);
    }

    @Override
    public boolean delete(String nim) {
        return mahasiswaDao.delete(nim);
    }

    @Override
    public Mahasiswa getMahasiswaByNim(String nim) {
        return mahasiswaDao.getMahasiswaByNim(nim);
    }

    @Override
    public List&lt;Mahasiswa> getAllMahasiswa() {
        return mahasiswaDao.getAllMahasiswa();
    }

}</code></pre>

Seperti biasa, karena service berupa interface kita harus membuat class untuk mengimplementasikannya, dalam hal ini adalah class MahasiswaServiceImpl. Terlihat lebih sederhana kodenya kan dan jauh lebih rapih. 🙂

<pre class="wp-block-code"><code>public class JdbcUtils {

    private static MahasiswaDao mahasiswaDao;

    public static MahasiswaDao getMahasiswaDao() {
        if (mahasiswaDao == null) {
            mahasiswaDao = new MahasiswaImpl(Koneksi.getConnection());
        }
        return mahasiswaDao;
    }

}</code></pre>

Sedangkan class di atas adalah class helper penyedia semua DAO, jadi nanti jika akan ada DAO yang lain silahkan ditambahkan ke class tersebut. Yang terakhir kita bisa menjalankan class-class yang sudah kita buat, sebenarnya sudah bisa dijalankan tetapi akan kita unit test dari salah satu class di atas.

<pre class="wp-block-code"><code>public class AppTest {

    MahasiswaService ms;

    @Before
    public void setUp() {
        ms = new MahasiswaServiceImpl(JdbcUtils.getMahasiswaDao());
    }

    @After
    public void tearDown() {
    }

    @Ignore
    @Test
    public void testInsert() {
        Mahasiswa m = new Mahasiswa("075410200", "Singgih Kuncoro", 2.75F, "Teknik Mesin");
        assertTrue(ms.insert(m));
    }

    @Ignore
    @Test
    public void testUpdate() {
        Mahasiswa m = new Mahasiswa("075410200", "Singgih Kuncoro Aji", 2.80F, "Teknik Mesin");
        assertTrue(ms.update(m));
    }

    @Test
    public void testGetMahasiswaByNim() {
        assertTrue(ms.getMahasiswaByNim("075410099") != null);
    }

    @Ignore
    @Test
    public void testGetAllMahasiswa() {
        assertTrue(ms.getAllMahasiswa().size() > 0);
    }

    @Ignore
    @Test
    public void testDelete() {
        assertTrue(ms.delete("075410200"));
    }

}</code></pre>

Sebenarnya sebuah yang unit test adalah wajib hukumnya sebelum nanti menuju integration test, unit test digunakan untuk mengecek semua bagian-bagian kecil dari program yang Anda bangun apakah outputnya sudah sesuai yang diharapkan. Untuk melakukan hal tersebut digunakan junit jika di java, sebenarnya ada juga namanya mockito. Disana ada beberapa annotation yang digunakan untuk melakukan testing seperti

  * @Test digunakan untuk menandai methode yang akan dilakukan testing
  * @Ignore sebagai penanda bahwa methode tersebut tidak akan dilakukan testing
  * @Before berarti methode yang ada annotation tersebut akan dieksekusi sebelum methode yang ada @Test dieksekusi
  * @After artinya adalah kebalikan dari @Before, setelah methode yang ada @Test dieksekusi.

<pre class="wp-block-preformatted"><br /> T E S T S<br /> Running com.odeng.maven.crud.mysql.AppTest<br /> Tests run: 5, Failures: 0, Errors: 0, Skipped: 4, Time elapsed: 1.013 sec<br /> Results :<br /> Tests run: 5, Failures: 0, Errors: 0, Skipped: 4<br /> <br /> BUILD SUCCESS</pre>

Ketika dijalankan class untuk test yang kita buat, outputnya adalah kira-kira seperti di atas. Berarti nama class tesnt adalah AppTest, @Test ada 5 methode dan yang dilakukan @Ignore 4 methode. Untuk membuat class test, Netbeans juga sudah memfasilitasi dari klik kanan project &#8211; New &#8211; Other &#8211; Piilh kategori &#8211; Unit Tests &#8211; Test for Existing Class.

Oh ya kemudian dalam project Maven yang paling penting adalah file pom.xml, semua konfigurasi ada di sana. Kira-kira contohnya adalah sebagai berikut

<pre class="wp-block-code"><code>&lt;?xml version="1.0" encoding="UTF-8"?>
&lt;project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    &lt;modelVersion>4.0.0&lt;/modelVersion>
    &lt;groupId>com.odeng&lt;/groupId>
    &lt;artifactId>maven-crud-mysql&lt;/artifactId>
    &lt;version>1.0-SNAPSHOT&lt;/version>
    &lt;packaging>jar&lt;/packaging>
    &lt;properties>
        &lt;project.build.sourceEncoding>UTF-8&lt;/project.build.sourceEncoding>
        &lt;maven.compiler.source>1.8&lt;/maven.compiler.source>
        &lt;maven.compiler.target>1.8&lt;/maven.compiler.target>
    &lt;/properties>
    &lt;dependencies>
        &lt;dependency>
            &lt;groupId>mysql&lt;/groupId>
            &lt;artifactId>mysql-connector-java&lt;/artifactId>
            &lt;version>8.0.16&lt;/version>
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
        &lt;/dependency>
    &lt;/dependencies>
    &lt;build>
        &lt;plugins>
            &lt;plugin>
                &lt;groupId>org.apache.maven.plugins&lt;/groupId>
                &lt;artifactId>maven-jar-plugin&lt;/artifactId>
                &lt;version>2.3.2&lt;/version>
                &lt;configuration>
                    &lt;archive>
                        &lt;manifest>
                            &lt;mainClass>com.odeng.maven.crud.mysql.App&lt;/mainClass>
                        &lt;/manifest>
                    &lt;/archive>
                &lt;/configuration>
            &lt;/plugin>
        &lt;/plugins>
    &lt;/build>
&lt;/project></code></pre>

Jika dilihat file pom.xml di atas adalah berisi tentang deskripsi dari sebuah project di beberapa awal baris, depedency atau library yang dibutuhkan pada baris selanjutnya, dan yang terakhir terkait dengan build aplikasi kita. File pom.xml akan dibuatkan secara automatis ketika kita membuat project Maven dengan Netbeans, jadi jangan kwatir untuk membuat secara manual. Silakan clone di <a href="https://github.com/0d3ng/maven-crud-mysql.git" target="_blank" rel="noreferrer noopener" aria-label="github (opens in a new tab)">github</a> codingan di atas.

Demikianlah artikel saya terkait dengan koneksi database MySQL menggunakan Java, semoga bermanfaat. Saya yakin artikel yang saya tulis masih jauh dari kata sempurna, dimohon saran dan kritiknya. Happy Coding ^_^