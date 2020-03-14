---
id: 450
title: Yuk Belajar Web Menggunakan Spring Boot(2)
date: 2019-08-08T11:30:22+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=450
permalink: /yuk-belajar-web-menggunakan-spring-boot2/
wp_last_modified_info:
  - August 8, 2019 @ 11:30 am
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
  - bootstrap
  - flyway
  - java
  - spring boot
  - thymeleaf
---
<figure class="wp-block-image"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-1024x729.jpg" alt="" class="wp-image-447" /></figure> 

Bismillah,  
Artikel kali ini adalah lanjutan dari artikel <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/yuk-belajar-web-menggunakan-spring-boot/" target="_blank">sebelumnya</a> yang terakhir fiturnya adalah menampilkan semua data pada sebuah halaman web. Sementara kali ini, akan kita coba mengimplementasikan edit data, hapus data, validation, dan beberapa fungsi menarik lainnya. Tampilan utama aplikasi yang kita bangun adalah sebagai berikut.<figure class="wp-block-image">

<img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-1024x426.png" alt="" class="wp-image-451" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-1024x426.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-300x125.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2-768x319.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot2.png 1157w" sizes="(max-width: 1024px) 100vw, 1024px" /> </figure> 

Beberapa point yang akan kita bahas adalah sebagai berikut

  * [Menambahkan Halaman Simpan atau Edit Data](#Menambahkan-Halaman-Simpan-atau-Edit-Data)
  * [Menambahkan Halaman Hapus Data](#Menambahkan-Halaman-Hapus-Data)
  * [Menambahkan Halaman Detail](#Menambahkan-Halaman-Detail)
  * [Menambahkan Validasi](#Menambahkan-Validasi)
  * [Menampilkan Alert](#Menampilkan-Alert)
  * [Referensi](#Referensi)

#### Menambahkan Halaman Simpan atau Edit Data {#Menambahkan-Halaman-Simpan-atau-Edit-Data}

Untuk mengimplementasikan fungsi edit dan tambah, sebenarnya aksi tersebut hampir sama karena di JPA method yang dipanggil juga sama yaitu `save(Object o)`. Kita persiapkan halaman html dan controller untuk dapat membuatnya, controller pada class `MahasiswaController` adalah sebagai berikut

<pre class="wp-block-code"><code>@GetMapping("/mahasiswa/form")
    public ModelMap tampilFormedit(@RequestParam(required = false, value = "id") Mahasiswa mahasiswa) {
        if (mahasiswa == null) {
            mahasiswa = new Mahasiswa();
        }
        return new ModelMap().addAttribute("mahasiswa", mahasiswa);
    }

    @PostMapping("/mahasiswa/form")
    public String editMahasiswa(@ModelAttribute @Valid Mahasiswa mahasiswa, BindingResult errors, SessionStatus status) {
        LOGGER.info(mahasiswa.toString());
        LOGGER.info(errors.toString());
        LOGGER.info("" + errors.hasErrors());
        LOGGER.info("" + errors.hasGlobalErrors());
        if (errors.hasErrors())
            return "/mahasiswa/form";
        try {
            mahasiswaDao.save(mahasiswa);
            status.setComplete();
            return "redirect:/index";
        } catch (DataAccessException e) {
            errors.reject("error.object", e.getMessage());
            LOGGER.error(e.getMessage());
            return "/mahasiswa/form";
        }
    }</code></pre>

Penjelasan kode di atas adalah di bawah ini

  * `@GetMapping("/mahasiswa/form")`, untuk mengakses form ini berarti yang digunakan adalah `GET`. 
  * `@RequestParam(required = false, value = "id") Mahasiswa mahasiswa`, parameter pada method `tampilFormedit()` berarti ketika mengakses method tersebut membutuhkan request parameter. Cara memanggilnya seperti ini `.../mahasiswa/form?id=xxx` dan objek `mahasiswa` secara automatis Spring akan query berdasarkan `id` tersebut.
  * `return new ModelMap().addAttribute("mahasiswa", mahasiswa)`, nilai balik method tersebut berarti akan mengembalikan objek mahasiswa. Tujuannya adalah akan ditampilkan ke halaman html nantinya.
  * `@PostMapping("/mahasiswa/form")`, berarti untuk mengakses method tersebut menggunakan `POST`. 
  * `@ModelAttribute @Valid Mahasiswa mahasiswa, BindingResult errors, SessionStatus status`; parameter-parameter tersebut terdapat pada method `editMahasiswa()`, `@ModelAttribute` berarti ada parameter objek mahasiswa yang bisa dilewatkan, `@Valid` maksudnya adalah untuk memvalidasi objek mahasiswa sebelum disimpan, objek `errros` digunakan untuk menampung data error dan objek `status` untuk menghandle sebuah session.

Setelah itu, kita perlu membuat halaman html yang digunakan menampilkan form edit atau simpan. Potongan kodenya yang digunakan adalah sebagai berikut

<pre class="wp-block-code"><code>&lt;form method="post" th:object="${mahasiswa}" th:action="@{/mahasiswa/form}" class="needs-validation" novalidate>
        &lt;input type="hidden" th:field="*{id}">
        &lt;div class="form-group">
            &lt;label for="nim" class="col-form-label">Nim&lt;/label>
            &lt;input type="text" class="form-control" id="nim" th:field="*{nim}" placeholder="Nim mahasiswa" required>
            &lt;div class="invalid-feedback">
                Nim tidak boleh kosong.
            &lt;/div>
        &lt;/div>
        &lt;div class="form-group">
            &lt;label for="nama" class="col-form-label">Nama&lt;/label>
            &lt;input type="text" class="form-control" id="nama" th:field="*{nama}" placeholder="Nama mahasiswa"
                   required>
            &lt;div class="invalid-feedback">
                Nama tidak boleh kosong.
            &lt;/div>
        &lt;/div>
        &lt;div class="form-group">
            &lt;label for="ipk" class="col-form-label">IPK&lt;/label>
            &lt;input type="number" step="any" class="form-control" id="ipk" th:field="*{ipk}"
                   placeholder="IPK mahasiswa"
                   required>
        &lt;/div>
        &lt;div class="form-group">
            &lt;label for="jurusan" class="col-form-label">Jurusan&lt;/label>
            &lt;input type="text" class="form-control" id="jurusan" th:field="*{jurusan}"
                   placeholder="Jurusan mahasiswa" required>
            &lt;div class="invalid-feedback">
                Jurusan tidak boleh kosong.
            &lt;/div>
        &lt;/div>
        &lt;button type="submit" class="btn btn-primary mb-3">Submit&lt;/button>

        &lt;div th:if="${#fields.hasErrors('all')}">
            &lt;div class="form-group">
                &lt;div class="alert alert-warning alert-dismissible fade show">
                    &lt;label th:errors="*{all}">xxx&lt;/label>
                    &lt;button type="button" class="close" data-dismiss="alert">&times;&lt;/button>
                &lt;/div>
            &lt;/div>
        &lt;/div>
    &lt;/form></code></pre>

Dari kode di atas, pada tag form method yang digunakan adalah `post` sesuai yang terdapat di controller. `th:object="${mahasiswa}` adalah salah satu penerapan tag thymeleaf untuk menampung objek `mahasiswa`, objek `mahasiswa` berasal dari controller. `th:action="@{/mahasiswa/form}` maksudnya adalah path yang diakses ketika button di-submit, sedangkan `th:field="*{id}"` bertujuan untuk mengisikan data `id` objek `mahasiswa` pada input text. Form tersebut digunakan untuk melakukan edit data dan simpan data, ketika data menggunakan yang sebelumnya berarti edit dan ketika menggunakan data baru artinya adalah simpan data. Tampilannya adalah sebagai berikut

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Edit-Data-1024x409.png" alt="Spring Boot Edit Data" class="wp-image-453" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Edit-Data-1024x409.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Edit-Data-300x120.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Edit-Data-768x306.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Edit-Data.png 1148w" sizes="(max-width: 1024px) 100vw, 1024px" /><figcaption>Spring Boot Edit Data</figcaption></figure>
</div>

#### Menambahkan Halaman Hapus Data {#Menambahkan-Halaman-Hapus-Data}

Selanjutnya untuk menghapus data, terlebih dahulu buat fungsi untuk menghadle kebutuhan tersebut pada controller. Methodnya adalah sebagai berikut

<pre class="wp-block-code"><code>@DeleteMapping("/mahasiswa/hapus")
    public String hapusMahasiswa(@RequestParam(name = "id") String id) {
        mahasiswaDao.deleteById(id);
        return "redirect:/index";
    }</code></pre>

Kode di atas sederhana, methode yang digunakan adalah `DELETE` dan menggunakan request parameter dengan nama `id` untuk mengaksesnya. Setelah berhasil menghapus, akan `redirect` ke halaman `index`. Sementara untuk halaman html menggunakan kode berikut ini

<pre class="wp-block-code"><code>&lt;form method="post" th:action="@{/mahasiswa/hapus(id=${mhs.id})}" class="d-inline">
                    &lt;input type="hidden" name="_method" value="delete"/>
                    &lt;button type="button" class="btn btn-link btn-sm" data-toggle="modal"
                            data-target="#exampleModalCenter">Hapus
                    &lt;/button>
                    &lt;!-- Modal -->
                    &lt;div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
                         aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        &lt;div class="modal-dialog modal-dialog-centered" role="document">
                            &lt;div class="modal-content">
                                &lt;div class="modal-header">
                                    &lt;h5 class="modal-title" id="exampleModalCenterTitle">Hapus data mahasiswa&lt;/h5>
                                    &lt;button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        &lt;span aria-hidden="true">&times;&lt;/span>
                                    &lt;/button>
                                &lt;/div>
                                &lt;div class="modal-body">
                                    Apakah Anda yakin akan menghapus data?
                                &lt;/div>
                                &lt;div class="modal-footer">
                                    &lt;button type="button" class="btn btn-secondary" data-dismiss="modal">Tidak&lt;/button>
                                    &lt;button type="submit" class="btn btn-primary">Ya&lt;/button>
                                &lt;/div>
                            &lt;/div>
                        &lt;/div>
                    &lt;/div>
                &lt;/form></code></pre>

Kode di atas tertulis pada tag form mengunakan method `post`, sementara pada controller adalah `DELETE` berarti kita butuh `<input type="hidden" name="_method" value="delete"/>`. Kemudian untuk kode di bawahnya adalah digunakan untuk menampilkan dialog/modal karena prosesnya hapus, sehingga perlu mengkonfirmasi ke pengguna. Hasilnya adalah sebagai berikut

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Hapus-Data-1024x386.png" alt="Spring Boot Hapus Data" class="wp-image-455" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Hapus-Data-1024x386.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Hapus-Data-300x113.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Hapus-Data-768x289.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Hapus-Data.png 1155w" sizes="(max-width: 1024px) 100vw, 1024px" /><figcaption>Spring Boot Hapus Data</figcaption></figure>
</div>

#### Menambahkan Halaman Detail {#Menambahkan-Halaman-Detail}

Untuk halaman detail digunakan melihat detail data mahasiswa, seperti pada pembahasan sebelumnya kita membutuhkan fungsi pada controller. Yang perlu ditambahkan adalah sebagai berikut

<pre class="wp-block-code"><code>@GetMapping("/mahasiswa/detail_form")
    public ModelMap tampilFormDetail(@RequestParam(required = false, value = "id") Mahasiswa mahasiswa) {
        if (mahasiswa == null) {
            mahasiswa = new Mahasiswa();
        }
        return new ModelMap().addAttribute("mahasiswa", mahasiswa);
    }</code></pre>

Isi kode di atas sebenarnya sama dengan untuk form edit dan simpan, bedanya adalah alamat path yang digunakan yaitu `"/mahasiswa/detail_form"`. Kemudian untuk halaman html implementasinya adalah sebagai berikut

<pre class="wp-block-code"><code>&lt;div class="container">
    &lt;h4>Detail Mahasiswa&lt;/h4>
    &lt;table class="table table-hover">
        &lt;tbody>
        &lt;tr>
            &lt;th scope="row">NIM&lt;/th>
            &lt;td th:text="${mahasiswa.nim}">&nbsp;&lt;/td>
        &lt;/tr>
        &lt;tr>
            &lt;th scope="row">Nama&lt;/th>
            &lt;td th:text="${mahasiswa.nama}">&nbsp;&lt;/td>
        &lt;/tr>
        &lt;tr>
            &lt;th scope="row">IPK&lt;/th>
            &lt;td th:text="${mahasiswa.ipk}">&nbsp;&lt;/td>
        &lt;/tr>
        &lt;tr>
            &lt;th scope="row">Jurusan&lt;/th>
            &lt;td th:text="${mahasiswa.jurusan}">&nbsp;&lt;/td>
        &lt;/tr>
        &lt;/tbody>
    &lt;/table>
    &lt;a th:href="@{/index}" class="btn btn-primary">Kembali&lt;/a>
&lt;/div></code></pre>

Untuk menampilkan menggunakan tabel, kemudian tag `th:text="${mahasiswa.nim}"` digunakan untuk mengambil nilai `nim` pada objek `mahasiswa`. Objek mahasiswa dihasilkan ketika mengakses `/mahasiswa/detail_form` pada controller. Tampilan detailnya adalah sebagai berikut

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Detail-Data-1024x286.png" alt="Spring Boot Detail Data" class="wp-image-456" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Detail-Data-1024x286.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Detail-Data-300x84.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Detail-Data-768x215.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Detail-Data.png 1145w" sizes="(max-width: 1024px) 100vw, 1024px" /><figcaption>Spring Boot Detail Data</figcaption></figure>
</div>

#### Menambahkan Validasi {#Menambahkan-Validasi}

Validasi sangat penting dibutuhkan untuk memastikan data sebelum di simpan adalah data yang sesuai dengan format yang kita inginkan, validasi dapat dilakukan menggunakan 2 cara yaitu dari sisi client dan dari sisi server. Berikut ini adalah contoh penerapan validasi dari sisi client

<pre class="wp-block-code"><code>&lt;div class="form-group">
            &lt;label for="nim" class="col-form-label">Nim&lt;/label>
            &lt;input type="text" class="form-control" id="nim" th:field="*{nim}" placeholder="Nim mahasiswa" required>
            &lt;div class="invalid-feedback">
                Nim tidak boleh kosong.
            &lt;/div>
        &lt;/div></code></pre>

Kata kunci yang dibutuhkan menggunakan `required` pada tag `input` dan kita butuh menambahkan `<div class="invalid-feedback">` untuk menampilkan pesan ketika inputan tidak valid. Kemudian jika dari sisi server, sebelumnya telah dituliskan yaitu menggunakan anotasi `@Valid.` Berikut ini tampilan ketika data yang diinputkan tidak valid

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Validasi-Data-1024x426.png" alt="Spring Boot Validasi Data" class="wp-image-457" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Validasi-Data-1024x426.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Validasi-Data-300x125.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Validasi-Data-768x319.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Validasi-Data.png 1149w" sizes="(max-width: 1024px) 100vw, 1024px" /><figcaption>Spring Boot Validasi Data</figcaption></figure>
</div>

#### Menampilkan Alert {#Menampilkan-Alert}

Alert kadang disebut juga dengan notifikasi, hal tersebut penting untuk menginfokan sebuah kondisi pada seorang pengguna. Misalkan ketika terjadi error akan menampilkan sebuah pesan error, contoh penggunaannya adalah sebagai berikut

<pre class="wp-block-code"><code>&lt;div th:if="${#fields.hasErrors('all')}">
            &lt;div class="form-group">
                &lt;div class="alert alert-warning alert-dismissible fade show">
                    &lt;label th:errors="*{all}">xxx&lt;/label>
                    &lt;button type="button" class="close" data-dismiss="alert">&times;&lt;/button>
                &lt;/div>
            &lt;/div>
        &lt;/div></code></pre>

Thymeleaf memiliki tag untuk menangkap error ketika atau mendeteksi error, bisa menggunakan `th:if="${#fields.hasErrors('all')}`. Sementara untuk menampilkan pesan error digunakan tag `th:errors="*{all}"`, hasilnya adalah sebagai berikut<figure class="wp-block-image">

<img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Alert-1024x217.png" alt="Spring Boot Alert" class="wp-image-458" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Alert-1024x217.png 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Alert-300x64.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Alert-768x163.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/08/Web-Thymeleaf-Spring-Boot-Alert.png 1156w" sizes="(max-width: 1024px) 100vw, 1024px" /> <figcaption>Spring Boot Alert</figcaption></figure> 

Demikianlah artikel saya mengenai web Java menggunakan Spring Boot dikombinasikan dengan Bootstrap, semoga bermanfaat dan menambah wawasan baru bagi temen-temen yang ingin dan sedang belajar Java. Kritik dan saran sangat diharapkan untuk meningkatkan kwalitas tulisan saya, kode lengkap dapat didapatkan di [sini](https://github.com/0d3ng/demo-thymeleaf.git). 🙂

#### Referensi {#Referensi}

  * <https://docs.spring.io/spring-boot/docs/2.1.6.RELEASE/reference/htmlsingle/boot-features-developing-web-applications.html>
  * <https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html>
  * <https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc>
  * <https://www.youtube.com/playlist?list=PL9oC_cq7OYbyhdZmCECQqp7OcS8J5QpAo>