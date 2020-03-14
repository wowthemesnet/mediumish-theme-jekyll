---
id: 246
title: Mengenal Framework Hibernate Java
date: 2019-06-14T14:23:29+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=246
permalink: /mengenal-framework-hibernate-java/
wp_last_modified_info:
  - June 14, 2019 @ 2:23 pm
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
  - framework
  - hibernate
  - java
  - orm
---
Bismillah,  
Artikel saya <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/java-koneksi-database-mysql/" target="_blank">sebelumnya</a> tentang jdbc adalah langkah awal untuk belajar framework hibernate. Ketika menggunakan jdbc kita harus mempersiapkan semua struktur database yang kita butuhkan untuk aplikasi yang akan kita bangun, penderitaan tidak berhenti di sana. Selanjutnya kita akan bermainan dengan SQL ketika akan melakukan pengolahan data, sebagai contoh query insert ke tabel yang kolomnya banyak. Bayangkan jika tabelnya ada puluhan, bahkan ratusan tentunya tidak akan efisien karena waktu kita terkuras untuk permasalahan tersebut. 

Hibernate merupakan salah satu framework _Object Relational Mapping_(ORM) di Java untuk mengatasi permasalahan di atas. Hibernate menyediakan sebuah template untuk melakukan operasi-operasi data seperti _insert, update, delete, dan select_. _Object Relational Mapping_(ORM) adalah sebuah paradigma untuk mengubah model database relational menjadi object oriented programming. Sehingga dengan demikian kita hanya fokus pada programmingnya bukan databasenya, selain itu ketika aplikasi kita akan migrasi ke database relational yang lain tidak berpengaruh terhadap aplikasi. Hanya sedikit konfigurasi yang perlu dilakukan yaitu _dialect database_ dan _driver class_, tidak perlu compile ulang aplikasi. Dalam melakukan mapping class Java ke dalam sebuah database pada hibernate dapat dilakukan menggunakan 2 cara yaitu file xml dan anotasi. Pada kesempatan ini saya akan coba menggunakan anotasi, karena penggunaan file xml tergolong bertele-tele menurut saya. Beberapa yang perlu dipersiapkan adalah sebagai berikut

  * [Buat class entitas](#Buat-class-entitas)
  * [Hibernate session factory](#Hibernate-session-factory)
  * [Membuat DAO](#Membuat-DAO)
  * [Buat service](#Buat-service)
  * [Konfigurasi hibernate](#Konfigurasi-hibernate)
  * [Test](#Test)

<blockquote class="wp-block-quote">
  <p>
    Seperti pada project-project yang sebelumnya telah saya buat, build tool yang digunakan adalah menggunakan maven sehingga ketika pertama kali project dibuka akan membutuhkan koneksi internet ketika di lokal repository tidak menemukan depedency yang dibutuhkan. Hibernate yang saya gunakan adalah versi 5, versi tersebut adalah versi yang terbaru.
  </p>
</blockquote>

#### Buat class entitas {#Buat-class-entitas}

Class entitas adalah pendefinisian mapping class yang akan diubah ke dalam tabel pada database oleh framework hibernate, dalam penerapannya biasanya satu class merepresentasikan satu tabel. Jika tanpa framework hibernate atau menggunakan jdbc fokus kita terpecah memikirkan database tetapi kali ini tidak, kita hanya fokus ke class. Biasanya untuk memudahkan kita buat design terlebih dahulu menggunakan class diagram sehingga relasi antara class akan terlihat, untuk implementasinya kurang lebih seperti berikut

<pre class="wp-block-code"><code>import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author od3ng
 */
@Entity
@Table(name = "Mahasiswa")
public class Mahasiswa implements Serializable {

    @Id
    @Column(name = "NIM", nullable = false, length = 12, unique = true)
    private String nim;
    @Column(name = "NAMA", nullable = false, length = 50)
    private String nama;
    @Column(name = "IPK", nullable = false, length = 4)
    private float ipk;
    @Column(name = "JURUSAN", nullable = false, length = 50)
    private String jurusan;

    public Mahasiswa() {
    }

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

Untuk membuat entitas semua kebutuhan terdapat di dalam paket _javax.persistence_, terlihat bahwa pendefinisian attribut-attribut pada class entitas di atas menggunakan anotasi atau simbol &#8220;@&#8221;. `@entity` menandakan bahwa class Mahasiswa merupakan class entitas, sedangkan `@table` menginformasikan pembuatan tabel di dalam database. Pada `@table` terdapat property name digunakan untuk memberikan nama tabel di dalam database, jika property nama tidak disebutkan defaultnya adalah nama class yang digunakan yaitu Mahasiswa. `@Id` adalah wajib ada untuk class entitas, jika dalam database nanti digunakan primary key. Selanjutnya `@Column` berfungsi sebagai pendefinisian kolom di dalam database, terdapat beberapa property seperti `name`, `nullable, length, unique`. Property `name` digunakan untuk memberikan nama kolom, `nullable` artinya diizinkan boleh kosong atau tidak, `length` adalah panjang field, `unique` artinya tidak boleh ada nilai yang sama. Jika tidak disebutkan secara implisit maka akan menggunakan nilai default, misalkan `name` dengan default adalah nama attribut/filed dalam class entitas. 

#### Hibernate session factory {#Hibernate-session-factory}

Session factory menyediakan object Session dan dibuat dari object Configuration, object Session sendiri digunakan untuk melakukan koneksi ke dalam database. Object tersebut mirip dengan interface Connection jika menggunakan jdbc, object Session Factory dibuat pada class HibernateUtil seperti dicontohkan di bawah ini 

<pre class="wp-block-code"><code>public class HibernateUtil {

    private static final SessionFactory sessionFactory;
    private static MahasiswaDao mahasiswaDao;

    static {
        try {
            // Create the SessionFactory from standard (hibernate.cfg.xml) 
            // config file.
            sessionFactory = new Configuration().configure().buildSessionFactory();
        } catch (Throwable ex) {
            // Log the exception. 
            Logger.getLogger(HibernateUtil.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static MahasiswaDao getMahasiswaDao() {
        if (mahasiswaDao == null) {
            mahasiswaDao = new MahasiswaImpl(getSessionFactory().openSession());
        }
        return mahasiswaDao;
    }

    private static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
}</code></pre>

Object Session Factory adalah object thread safe dan digunakan oleh semua thread yang terdapat dalam aplikasi, selain itu satu database biasanya memiliki 1 object Session Factory sehingga hanya dibuat satu instance dalam aplikasi. `HibernateUtil` juga menyediakan dao semua entitas, dalam hal ini adalah MahasiswaDao.

#### Membuat DAO {#Membuat-DAO}

DAO yang merupakan kependekan dari Data Access Object bertujuan agar terpisah antara low level data atau operasi dengan bisnis proses pada aplikasi yang Anda bangun. DAO untuk class Mahasiswa kurang lebih dibuat seperti di bawah ini

<pre class="wp-block-code"><code>public interface MahasiswaDao {

    public boolean insert(Mahasiswa m);

    public boolean update(Mahasiswa m);

    public boolean delete(Mahasiswa m);

    public Mahasiswa getMahasiswaByNim(String nim);

    public List&lt;Mahasiswa> getAllMahasiswa();
}</code></pre>

MahasiswaDao merupakan sebuah interface yang menyediakan semua operasi-operasi yang dibutuhkan untuk entitas class `Mahasiswa`. Sebaiknya method-method dalam DAO memiliki nilai balik agar ketika dipanggil method tersebut bisa diketahui status dari operasi yang dilakukan.

<pre class="wp-block-code"><code>public class MahasiswaImpl implements MahasiswaDao {

    private final Session session;

    public MahasiswaImpl(Session session) {
        this.session = session;
    }

    @Override
    public boolean insert(Mahasiswa m) {
        try {
            session.beginTransaction();
            String nim = (String) session.save(m);
            session.getTransaction().commit();
            return nim != null;
        } catch (Exception e) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, e);
            session.getTransaction().rollback();
        } finally {
            session.close();
        }
        return false;
    }

    @Override
    public boolean update(Mahasiswa m) {
        try {
            session.beginTransaction();
            session.update(m);
            session.getTransaction().commit();
            return true;
        } catch (Exception e) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, e);
            session.getTransaction().rollback();
        } finally {
            session.close();
        }
        return false;
    }

    @Override
    public boolean delete(Mahasiswa m) {
        try {
            session.beginTransaction();
            session.delete(m);
            session.getTransaction().commit();
            return true;
        } catch (Exception e) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, e);
            session.getTransaction().rollback();
        } finally {
            session.close();
        }
        return false;
    }

    @Override
    public Mahasiswa getMahasiswaByNim(String nim) {
        try {
            Query query = session.createQuery("FROM Mahasiswa m WHERE m.nim=:nim");
            query.setParameter("nim", nim);
            return (Mahasiswa) query.uniqueResult();
        } catch (Exception e) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, e);
        } finally {
            session.close();
        }
        return null;
    }

    @Override
    public List&lt;Mahasiswa> getAllMahasiswa() {
        try {
            return session.createQuery("FROM Mahasiswa", Mahasiswa.class).list();
        } catch (Exception e) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, e);
        } finally {
            session.close();
        }
        return null;
    }

}</code></pre>

Karena DAO merupakan interface sehingga kita butuh class yang mengimplementasikan DAO tersebut dalam hal ini adalah class MahasiswaImpl. Seperti yang telah disebutkan di atas bahwa object `Session` seperti interface `Connection` pada jdbc, session tersebut bagaikan roh dari hibernate karena yang terkoneksi dengan database.

Untuk melakukan operasi data alurnya hibernate yaitu diawali dengan `beginTransaction()`, melakukan operasi di database, dan akhiri transaksi dengan commit jika berhasil sebaliknya jika gagal roolback. Jika dilihat untuk melakukan insert ke database, kita cukup memanggil `save()` dari object `Session` dengan parameter object yang akan kita insert. Bandingkan dengan jdbc biasa ketika akan insert kita harus ubah `autocomit()` menjadi false, menyiapkan preparestatement, execute, dan juga commit jika berhasil sebaliknya roolback jika gagal. Terus yang paling menderita adalah query yang panjang untuk insert tergantung dari jumah kolom dan harus set parameter ke preparestatement semuah fieldnya.

#### Membuat service {#Membuat-service}

Hampir mirip dengan DAO, service merupakan interface yang berisi sama dengan method-method yang terdapat pada `MahasiswaDao`.

<pre class="wp-block-code"><code>public interface MahasiswaService {
    
    public boolean insert(Mahasiswa m);

    public boolean update(Mahasiswa m);

    public boolean delete(Mahasiswa m);

    public Mahasiswa getMahasiswaByNim(String nim);

    public List&lt;Mahasiswa> getAllMahasiswa();
    
}</code></pre>

Interface `MahasiswaService` harus diimplementasikan dalam sebuah class, class yang mengimplementasikan adalah class `MahasiswaServiceImpl`. Interface di sini nanti yang akan dikonsumsi oleh aplikasi utama sehingga benar-benar memisahkan dari low level data.

<pre class="wp-block-code"><code>public class MahasiswaServiceImpl implements MahasiswaService{

    private final MahasiswaDao dao;

    public MahasiswaServiceImpl(MahasiswaDao dao) {
        this.dao = dao;
    }
    
    @Override
    public boolean insert(Mahasiswa m) {
        return dao.insert(m);
    }

    @Override
    public boolean update(Mahasiswa m) {
        return dao.update(m);
    }

    @Override
    public boolean delete(Mahasiswa m) {
        return dao.delete(m);
    }

    @Override
    public Mahasiswa getMahasiswaByNim(String nim) {
        return dao.getMahasiswaByNim(nim);
    }

    @Override
    public List&lt;Mahasiswa> getAllMahasiswa() {
        return dao.getAllMahasiswa();
    }
    
}</code></pre>

Jika dilihat class implementasi di atas terdapat attribut `MahasiswaDao`, interface tersebut dilewatkan dalam sebuah kontruktor. Berbeda dengan class yang mengimplementasikan interface `MahasiswaDao`, class `MahasiswaServiceImpl` lebih sederhana implementasinya. 

#### Konfigurasi hibernate {#Konfigurasi-hibernate}

Konfigurasi dalam hibernate bisa menggunakan file properties atau xml, dalam file tersebut berisi tentang dialect dari database yang digunakan, class diver yang digunakan, konfigurasi database, class-class yang dilakukan mapping, dan masih banyak lagi yang lain. Berikut ini contoh konfigurasi sederhana yang bisa Anda digunakan.

<pre class="wp-block-code"><code>&lt;?xml version="1.0" encoding="UTF-8"?>
&lt;!DOCTYPE hibernate-configuration PUBLIC "-//Hibernate/Hibernate Configuration DTD 3.0//EN" "http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">
&lt;hibernate-configuration>
  &lt;session-factory>
    &lt;property name="hibernate.dialect">org.hibernate.dialect.MariaDBDialect&lt;/property>
    &lt;property name="hibernate.connection.driver_class">com.mysql.jdbc.Driver&lt;/property>
    &lt;property name="hibernate.connection.url">jdbc:mysql://localhost:3306/hibernate_db?useLegacyDatetimeCode=false&serverTimezone=UTC&lt;/property>
    &lt;property name="hibernate.show_sql">true&lt;/property>
    &lt;property name="hbm2ddl.auto">update&lt;/property>
    &lt;property name="hibernate.connection.username">root&lt;/property>
    &lt;mapping class="com.odeng.maven.crud.hibernate.entitas.Mahasiswa"/>
  &lt;/session-factory>
&lt;/hibernate-configuration></code></pre>

Konfigurasi di atas menunjukkan dialect yang digunakan `MariaDBDialect` karena saya install MariaDB, dialect yang digunakan tergantung dengan database yang Anda gunakan. Misalkan database yang digunakan MySQL dengan versi 5 maka dialect yang digunakan adalah `MySQL5`, begitu juga database yang lain. Kemudian property yang menarik lagi adalah `hbm2ddl.auto`, berfungsi dalam urusan pembuatan tabel secara automatis oleh hibernate. Nilai pada property tersebut antara lain `create-only`, `drop`, `create`, `create-drop`, `validate`, dan `update`. Penjelasan masing-masing dari nilai tersebut adalah sebagai berikut 

  * `create-only`: akan dibuatkan tabel tanpa pengecekan tabel yang akan dibuat ada atau tidak
  * `drop`: menghapus tabel yang ada
  * `create`: akan dibuatkan tabel, jika sebelumnya ada tabelnya maka akan dilakukan drop
  * `create-drop`: ketika Session Factory start up maka akan dibuatkan tabel, ketika Session Factory di-shutdown tabel tersebut akan dilakukan drop. Shutdown Session Factory yaitu dengan memanggil method close() dari object Session Factory.
  * `validate`: akan memvalidasi stuktur tabel
  * `update`: akan dibuatkan tabel jika tidak ada tabel, jika ada perubahan struktur tabel maka akan disesuaian. Seperti perintah alter jika menggunakan sql

#### Test {#Test}

Saya menggunakan unit test untuk mencoba program yang telah kita buat, unit test tersebut menggunakan junit. Potongan program untuk melakukan testing adalah sebagai berikut

<pre class="wp-block-code"><code>public class MahasiswaServiceTest {

    MahasiswaService ms;

    @Before
    public void setUp() {
        ms = new MahasiswaServiceImpl(HibernateUtil.getMahasiswaDao());
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
        Mahasiswa m = new Mahasiswa("075410200", "Singgih Kuncoro Aji", 2.75F, "Teknik Mesin");
        assertTrue(ms.update(m));
    }

    @Ignore
    @Test
    public void testDelete() {
        Mahasiswa m = new Mahasiswa("075410200", "Singgih Kuncoro Aji", 2.75F, "Teknik Mesin");
        assertTrue(ms.delete(m));
    }

    @Test
    public void testGetMahasiswaByNim() {
        Mahasiswa mhs = ms.getMahasiswaByNim("075410200");
        if (mhs != null) {
            System.out.println("" + mhs);
        }
        assertNotNull(mhs);
    }

    @Ignore
    @Test
    public void testGetAllMahasiswa() {
        List&lt;Mahasiswa> allMahasiswa = ms.getAllMahasiswa();
        if (allMahasiswa != null) {
            allMahasiswa.forEach((mahasiswa) -> {
                System.out.println("" + mahasiswa);
            });
        }
        assertNotNull(allMahasiswa);
    }

}</code></pre>

Unit test di atas tujuannya adalah hanya untuk test apakah sudah sesuai yang kita harapkan atau belum, hilangkan anotasi `@Ignore` jika setiap method dilakukan tesing. Eksekusi unit test berdasarkan abjad dari nama method yang digunakan, misalkan methode `insert()` dijalankan kira-kira output yang dihasilkan adalah sebagai berikut

<pre class="wp-block-preformatted">T E S T S
 Running com.odeng.maven.crud.hibernate.service.MahasiswaServiceTest
 Jun 14, 2019 1:38:34 PM org.hibernate.Version logVersion
 INFO: HHH000412: Hibernate Core {5.4.3.Final}
 Jun 14, 2019 1:38:34 PM org.hibernate.boot.jaxb.internal.stax.LocalXmlResourceResolver resolveEntity
 WARN: HHH90000012: Recognized obsolete hibernate namespace http://hibernate.sourceforge.net/hibernate-configuration. Use namespace http://www.hibernate.org/dtd/hibernate-configuration instead.  Support for obsolete DTD/XSD namespaces may be removed at any time.
 Jun 14, 2019 1:38:35 PM org.hibernate.annotations.common.reflection.java.JavaReflectionManager 
 INFO: HCANN000001: Hibernate Commons Annotations {5.1.0.Final}
 Jun 14, 2019 1:38:35 PM org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl configure
 ...
 ...
 ...
 Hibernate: create table Mahasiswa (NIM varchar(12) not null, IPK float not null, JURUSAN varchar(50) not null, NAMA varchar(50) not null, primary key (NIM)) engine=InnoDB
 Jun 14, 2019 1:38:38 PM org.hibernate.engine.transaction.jta.platform.internal.JtaPlatformInitiator initiateService
 INFO: HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]
 Hibernate: insert into Mahasiswa (IPK, JURUSAN, NAMA, NIM) values (?, ?, ?, ?)
 Jun 14, 2019 1:38:38 PM org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
 INFO: HHH10001008: Cleaning up connection pool [jdbc:mysql://localhost:3306/hibernate_db?useLegacyDatetimeCode=false&serverTimezone=UTC]
 Tests run: 5, Failures: 0, Errors: 0, Skipped: 4, Time elapsed: 4.67 sec</pre>

Output di atas memperlihatkan logging tentang konfigurasi framework hibernate, selain itu juga menunjukkan sql yang digunakan. Untuk menghilangkan sql tersebut dapat dilakukan dengan mengubah value `false` pada property `hibernate.show_sql` dalam file konfigurasi hibernate. Source code dapat temen-temen dapatkan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/maven-crud-hibernate.git" target="_blank">sini</a>.

Demikianlah tulisan saya mengenai hibernate, semoga menambah pengetahuan baru buat temen-temen dan menjadi amal jariyah buat saya. Kritik dan saran sangat dibutuhkan untuk meningkatkan kwalitas blog ini, jangan sungkan untuk meninggalkan komentar. 🙂