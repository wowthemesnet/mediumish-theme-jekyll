---
id: 210
title: 'Java &#8211; Transaction MySQL'
date: 2019-05-30T11:02:27+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=210
permalink: /java-transaction-mysql/
wp_last_modified_info:
  - June 14, 2019 @ 3:42 pm
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
  - auto commit
  - autocommit
  - commit
  - java
  - MySQL
  - roolback
  - transaction
---
Bismillah,  
Jika pada artikel <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/05/29/java-koneksi-database-mysql/" target="_blank">sebelumnya</a> kita sudah belajar terkait dengan koneksi database menggunakan MySQL, pada kesempatan ini kita akan mempelajari yang lebih advance lagi yaitu terkait dengan transaction di MySQL dengan Java. Sebenarnya transaction sendiri itu apa sih? Transaction merupakan sebuah rangkaian perintah manipulasi data dalam database yang dilakukan secara serial dimana antara perintah yang satu dengan yang lain saling berhubungan, sehingga jika ada salah satu perintah yang gagal maka perintah yang lain harus digagalkan semua.

Contoh di dalam dunia nyata misalkan ketika kita akan transfer uang di bank, skenarionya adalah kurangi nominal rekening nasabah a, tambahkan nominal rekening nasabah b dari nasabah a, dan catat history transfer. Kemudian karena suatu hal, ketika proses penambahan nominal rekening nasabah b dari nasabah a terjadi kegagalan sehingga proses pengurangan rekening nasabah a juga harus dibatalkan.

<pre class="wp-block-code"><code>CREATE DATABASE IF NOT EXISTS akademik;

USE akademik;

CREATE TABLE IF NOT EXISTS mahasiswa(
nim VARCHAR(10) NOT NULL,
nama VARCHAR(50) NOT NULL,
ipk FLOAT(4,2) NOT NULL,
jurusan VARCHAR(25) NOT NULL,
PRIMARY KEY(nim)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alamat(
id_alamat INT AUTO_INCREMENT,
nim VARCHAR(10) NOT NULL, 
nama_jalan VARCHAR(50),
rt VARCHAR(3) NOT NULL,
rw VARCHAR(3) NOT NULL,
kode_desa VARCHAR(5) NOT NULL,
kode_kec VARCHAR(5) NOT NULL,
kode_kab VARCHAR(5) NOT NULL,
kode_prop VARCHAR(5) NOT NULL,
PRIMARY KEY(id_alamat)
)ENGINE=InnoDB;

ALTER TABLE alamat
ADD FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO mahasiswa VALUES('075410099','Noprianto',4.00,'Teknologi Informasi');
INSERT INTO mahasiswa VALUES('075410100','Noureen Akhlema Shannum',4.00,'Pendidikan Bahasa Inggris');
INSERT INTO mahasiswa VALUES('075410101','Uwais Al-Qarny',3.99,'Teknik Sipil');

INSERT INTO alamat(nim,nama_jalan,rt,rw,kode_desa,kode_kec,kode_kab,kode_prop) VALUES('075410099','Jln. Beo No.2','01','02','01','01','01','01');
INSERT INTO alamat(nim,nama_jalan,rt,rw,kode_desa,kode_kec,kode_kab,kode_prop) VALUES('075410100','Jln. Cenderawasih No.2','01','02','02','01','01','08');
INSERT INTO alamat(nim,nama_jalan,rt,rw,kode_desa,kode_kec,kode_kab,kode_prop) VALUES('075410101','Jln. Cucak Rowo No.2','01','02','02','01','01','09');</code></pre>

Potongan SQL di atas digunakan untuk membuat sebuah tabel dan mengisikan data ke tabel tersebut, agar dapat memanfaatkan fitur transaction tabel yang digunakan harus berjenis InnoDB dengan menambahkan keyword _ENGINE=InnoDB_. Kemudian jangan lupa menambahkan foreign key pada tabel alamat, _ON DELETE CASCADE ON UPDATE CASCADE_ agar ketika terjadi perubahan data atau penghapusan data pada tabel mahasiswa akan terjadi perubahan data juga pada tabel alamat.

<blockquote class="wp-block-quote">
  <p>
    Engine InnoDB digunakan untuk tabel-tabel yang memuat informasi transactional dengan integrasi data yang akurat, sedangkan Engine MyISAM diperuntukan tabel-tabel yang sifatnya historical atau pencatatan-pencatatan dengan integrasi data yang dapat ditolerir. Misalkan menyimpan informasi logging
  </p>
</blockquote>

<pre class="wp-block-code"><code>public class Alamat {
    
    private long id;
    private String nama_jalan;
    private String RT;
    private String RW;
    private String kode_desa;
    private String kode_kec;
    private String kode_kab;
    private String kode_prop;

    public Alamat(String nama_jalan, String RT, String RW, String kode_desa, String kode_kec, String kode_kab, String kode_prop) {
        this.nama_jalan = nama_jalan;
        this.RT = RT;
        this.RW = RW;
        this.kode_desa = kode_desa;
        this.kode_kec = kode_kec;
        this.kode_kab = kode_kab;
        this.kode_prop = kode_prop;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNama_jalan() {
        return nama_jalan;
    }

    public void setNama_jalan(String nama_jalan) {
        this.nama_jalan = nama_jalan;
    }

    public String getRT() {
        return RT;
    }

    public void setRT(String RT) {
        this.RT = RT;
    }

    public String getRW() {
        return RW;
    }

    public void setRW(String RW) {
        this.RW = RW;
    }

    public String getKode_desa() {
        return kode_desa;
    }

    public void setKode_desa(String kode_desa) {
        this.kode_desa = kode_desa;
    }

    public String getKode_kec() {
        return kode_kec;
    }

    public void setKode_kec(String kode_kec) {
        this.kode_kec = kode_kec;
    }

    public String getKode_kab() {
        return kode_kab;
    }

    public void setKode_kab(String kode_kab) {
        this.kode_kab = kode_kab;
    }

    public String getKode_prop() {
        return kode_prop;
    }

    public void setKode_prop(String kode_prop) {
        this.kode_prop = kode_prop;
    }

    @Override
    public String toString() {
        return "Alamat{" + "id=" + id + ", nama_jalan=" + nama_jalan + ", RT=" + RT + ", RW=" + RW + ", kode_desa=" + kode_desa + ", kode_kec=" + kode_kec + ", kode_kab=" + kode_kab + ", kode_prop=" + kode_prop + '}';
    }
    
    
}</code></pre>

Class di atas merupakan representasi dari tabel alamat di dalam database, informasi yang dapat di tampung berupa nama jalan sampai dengan kode provinsi.

<pre class="wp-block-code"><code>public class Mahasiswa {
    
    private String nim;
    private String nama;
    private float ipk;
    private String jurusan;
    private Alamat alamat;

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

    public Alamat getAlamat() {
        return alamat;
    }

    public void setAlamat(Alamat alamat) {
        this.alamat = alamat;
    }

    @Override
    public String toString() {
        return "Mahasiswa{" + "nim=" + nim + ", nama=" + nama + ", ipk=" + ipk + ", jurusan=" + jurusan + ", alamat=" + alamat + '}';
    }
    
    
}</code></pre>

Sementara untuk class Mahasiswa harus dimodifikasi dengan menambahkan attribut class Alamat lengkap dengan getter dan setter, kenapa di dalam classs Mahasiswa karena class Alamat bergantung dengan class Mahasiswa. Maksudnya adalah seorang mahasiswa pasti punya alamat, sedangkan nggak mungkin alamatnya ada tanpa mahasiswa.

<pre class="wp-block-code"><code>private final String INSERT_ALAMAT = "INSERT INTO alamat(nim,nama_jalan,rt,rw,kode_desa,kode_kec,kode_kab,kode_prop) VALUES(?,?,?,?,?,?,?,?)";
private final String UPDATE_ALAMAT = "UPDATE alamat SET nama_jalan=?, rt=?, rw=?,kode_desa=?,kode_kec=?,kode_kab=?,kode_prop=? WHERE nim=?";</code></pre>

Jangan lupa pada class implementasi yang mengimplement DAO juga harus ditambahkan pada bagian query dan dimodifikasi pada semua methodenya. Sebagai contoh seperti potongan program di atas untuk insert dan update alamat.

<pre class="wp-block-code"><code>@Override
    public boolean insert(Mahasiswa m) {
        PreparedStatement prepareStatementMhs = null;
        PreparedStatement prepareStatementAlamat = null;
        try {
            connection.setAutoCommit(false);
            prepareStatementMhs = connection.prepareStatement(INSERT);
            prepareStatementMhs.setString(1, m.getNim());
            prepareStatementMhs.setString(2, m.getNama());
            prepareStatementMhs.setFloat(3, m.getIpk());
            prepareStatementMhs.setString(4, m.getJurusan());
            boolean isInserted = prepareStatementMhs.executeUpdate() > 0;

            prepareStatementAlamat = connection.prepareStatement(INSERT_ALAMAT);
            prepareStatementAlamat.setString(1, m.getNim());
            prepareStatementAlamat.setString(2, m.getAlamat().getNama_jalan());
            prepareStatementAlamat.setString(3, m.getAlamat().getRT());
            prepareStatementAlamat.setString(4, m.getAlamat().getRW());
            prepareStatementAlamat.setString(5, m.getAlamat().getKode_desa());
            prepareStatementAlamat.setString(6, m.getAlamat().getKode_kec());
            prepareStatementAlamat.setString(7, m.getAlamat().getKode_kab());
            prepareStatementAlamat.setString(8, m.getAlamat().getKode_prop());
            boolean isInsertedAlamat = prepareStatementAlamat.executeUpdate() > 0;
            if (isInserted && isInsertedAlamat) {
                connection.commit();
                return true;
            } else {
                connection.rollback();
            }
        } catch (SQLException ex) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
            try {
                connection.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                connection.setAutoCommit(true);
                if (prepareStatementMhs != null) {
                    prepareStatementMhs.close();
                }
                if (prepareStatementAlamat != null) {
                    prepareStatementAlamat.close();
                }
            } catch (SQLException ex) {
                Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return false;
    }

    @Override
    public boolean update(Mahasiswa m) {
        PreparedStatement prepareStatementMhs = null;
        PreparedStatement prepareStatementAlmt = null;
        try {
            connection.setAutoCommit(false);
            prepareStatementMhs = connection.prepareStatement(UPDATE);
            prepareStatementMhs.setString(1, m.getNama());
            prepareStatementMhs.setFloat(2, m.getIpk());
            prepareStatementMhs.setString(3, m.getJurusan());
            prepareStatementMhs.setString(4, m.getNim());
            boolean updatedMhs = prepareStatementMhs.executeUpdate() > 0;

            prepareStatementAlmt = connection.prepareStatement(UPDATE_ALAMAT);
            prepareStatementAlmt.setString(1, m.getAlamat().getNama_jalan());
            prepareStatementAlmt.setString(2, m.getAlamat().getRT());
            prepareStatementAlmt.setString(3, m.getAlamat().getRW());
            prepareStatementAlmt.setString(4, m.getAlamat().getKode_desa());
            prepareStatementAlmt.setString(5, m.getAlamat().getKode_kec());
            prepareStatementAlmt.setString(6, m.getAlamat().getKode_kab());
            prepareStatementAlmt.setString(7, m.getAlamat().getKode_prop());
            prepareStatementAlmt.setString(8, m.getNim());
            boolean updatedAlmt = prepareStatementMhs.executeUpdate() > 0;
            if (updatedMhs && updatedAlmt) {
                connection.commit();
                return true;
            } else {
                connection.rollback();
            }
        } catch (SQLException ex) {
            Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
            try {
                connection.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                connection.setAutoCommit(true);
                if (prepareStatementMhs != null) {
                    prepareStatementMhs.close();
                }
                if (prepareStatementAlmt != null) {
                    prepareStatementAlmt.close();
                }
            } catch (SQLException ex) {
                Logger.getLogger(MahasiswaImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return false;
    }</code></pre>

Untuk memulai sebuah transaction pada Java kita harus mengubah auto commit menjadi false, karena defaultnya adalah true. Kemudian panggil commit ketika berhasil insert ke tabel mahasiswa dan alamat, sedangkan panggil roolback ketika terjadi error atau ketika gagal insert ke alamat. Jangan lupa kembalikan kembali auto commit menjadi true ketika proses transaction sudah selesai.

<pre class="wp-block-code"><code>@Test
    public void testInsert() {
        Alamat a = new Alamat("Jln. Prenjak no.99", "02", "04", "01", "01", "01", "01");
        Mahasiswa m = new Mahasiswa("075410200", "Singgih Kuncoro", 2.75F, "Teknik Mesin");
        m.setAlamat(a);
        assertTrue(ms.insert(m));
    }

    @Test
    public void testUpdate() {
        Alamat a = new Alamat("Jln. Semut no.99", "02", "04", "01", "01", "01", "01");
        Mahasiswa m = new Mahasiswa("075410200", "Singgih Kuncoro Aji", 2.80F, "Teknik Mesin");
        m.setAlamat(a);
        assertTrue(ms.update(m));
    }</code></pre>

Sekarang yang terakhir adalah tambahkan baris perintah pada unit test ketika skenario insert data dan update data, contoh update di atas dari ipk yang sebelumnya 2.75 menjadi 2.80. Untuk full source code bisa temen-temen dapatkan di <a href="https://github.com/0d3ng/maven-crud-mysql.git" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">github</a>, sebenarnya githubnya masih sama dengan sebelumnya hanya saya bedakan nama branch-nya.

Demikianlah tulisan saya terkait dengan transaction MySQL menggunakan Java, semoga bermanfaat dan saya doakan tambah semangat untuk belajar ataupun coding menggunakan Java. Masih banyak kekurangan di sana sini tulisan saya, saran dan kritik temen-temen sangat dibutuhkan untuk meningkatkan kwalitas blog ini. 🙂