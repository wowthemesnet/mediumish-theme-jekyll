---
id: 377
title: Yuk Belajar Spring Boot!
date: 2019-07-11T14:29:09+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=377
permalink: /yuk-belajar-spring-boot/
wp_last_modified_info:
  - July 11, 2019 @ 2:33 pm
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
  - depedency injection
  - java
  - spring
  - spring boot
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-logo.png" alt="Spring Boot" class="wp-image-378" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-logo.png 600w, https://www.sinaungoding.com/wp-content/uploads/2019/07/spring-boot-logo-300x158.png 300w" sizes="(max-width: 600px) 100vw, 600px" /></figure>
</div>

Bismillah,  
Pada kesempatan kali ini saya akan menuliskan artikel tentang Spring Boot karena setelah beberapa lama tidak menulis lagi karena ada urusan kampus. Spring Boot merupakan framework yang sangat penting dipelajari apalagi Anda ingin menjadi seorang maniac Java, jika pada pada postingan lalu saya sering membahas <a rel="noreferrer noopener" aria-label="hibernate (opens in a new tab)" href="https://www.sinaungoding.com/validasi-menggunakan-hibernate-validator/" target="_blank">hibernate</a> seharusnya setelah mempelajari Spring Boot skill kita akan meningkat untuk membuat sebuah aplikasi Java berbasis Spring Boot.

Tetapi sebelum lebih jauh mempelajari Spring Boot, sebenarnya Spring Boot sendiri adalah salah satu framework Spring dengan less konfigurasi ketika akan membangun aplikasi Java. Sementara Spring sendiri feature core-nya yang terkenal adalah `depedency injection`, spring menyediakan resource berupa objek tanpa kita membuat secara manual. Beberapa point yang akan kita bahas adalah sebagai berikut

  * [Konfigurasi Spring Boot &#8211; Browser](#Konfigurasi-Spring-Boot---Browser)
  * [Konfigurasi Spring Boot &#8211; Editor](#Konfigurasi-Spring-Boot---Editor)
  * [Hello World Spring Boot](#Hello-World-Spring-Boot)
  * [Referensi](#Referensi)

#### Konfigurasi Spring Boot &#8211; Browser {#Konfigurasi-Spring-Boot---Browser}

Untuk dapat memulai project Spring Boot dengan `Spring Initializr`, langkah awal yang dapat dilakukan adalah melakukan konfigurasi melalui browser. Silakan menuju ke halaman website <a rel="noreferrer noopener" aria-label="ini (opens in a new tab)" href="https://start.spring.io/" target="_blank">ini</a>. Kira-kira tampilannya adalah sebagai berikut<figure class="wp-block-image is-resized">

<img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-01.png" alt="Spring Initializr Browser" class="wp-image-380" width="602" height="503" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-01.png 802w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-01-300x251.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-01-768x642.png 768w" sizes="(max-width: 602px) 100vw, 602px" /> <figcaption>Spring Initializr Browser</figcaption></figure> 

Dari tampilan di atas ada beberapa inputan yang perlu diisi ketika akan membuat sebuah projek menggunakan Spring Boot, dijelaskan seperti di bawah ini

  * `Poject`; build tool yang akan kita gunakan dalam project, silakan dipilih sesuai preferensi masing-masing. Jika pada project-project yang saya buat sebelumnya menggunakan Maven.
  * `Language`; bahasa pemrograman yang akan digunakan, ternyata spring tidak hanya support Java. Tetapi Kotlin maupun Groovy juga bisa.
  * `Spring Boot`; Spring Boot yang digunakan dalam project.
  * `Project Metadata`; hal ini terkait dengan nama packet atau folder, biasanya penamaan mirip sebauh domain tetap membacanya dari belakang.
  * `Depedencies`; library-library yang dibutuhkan, silakan ketikkan nama library yang dibutuhkan kemudian tambahkan. Sebenarnya untuk menambahkan setelah dari langkah ini juga bisa, tambahkan di file `pom.xml` jika menggunakan Maven.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-04.png" alt="Spring Initializr Browser(2)" class="wp-image-383" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-04.png 431w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-04-300x235.png 300w" sizes="(max-width: 431px) 100vw, 431px" /><figcaption>Spring Initializr Browser(2)</figcaption></figure>
</div>

Untuk konfigurasi yang lebih lagi, silakan pilih `Options` sehingga tampilannya dapat dilihat seperti pada gambar di atas. Beberapa pointnya kira-kira seperti berikut

  * `Packaging`; output dari aplikasi kita yang akan dibangun, Jar berarti aplikasi yang berjalan di desktop base ataupun CLI. Sedangkan War adalah aplikasi web base.
  * `Java`; versi Java yang digunakan, defaultnya adalah Java 8.

#### Konfigurasi Spring Boot &#8211; Editor {#Konfigurasi-Spring-Boot---Editor}

Selain `Spring Initializr` versi browser, sebenarnya tersedia juga untuk versi desktop yaitu pada editor. Pada kesempatan ini saya menggunakan editor Intellij IDEA versi full menggunakan akun akademik. Silakan buat projek baru kemudian pilih `Spring Initializr`<figure class="wp-block-image is-resized">

<img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-02.png" alt="Spring Initializr Editor(1)" class="wp-image-381" width="659" height="421" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-02.png 879w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-02-300x191.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-02-768x490.png 768w" sizes="(max-width: 659px) 100vw, 659px" /> <figcaption>Spring Initializr Editor(1)</figcaption></figure> 

Sebenarnya mirip dengan Spring Initializr versi browser untuk property-property yang perlu kita sesuaikan, yang berbeda terkait dengan `Version` untuk menginfokan versi dari aplikasi.<figure class="wp-block-image is-resized">

<img src="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-03.png" alt="Spring Initializr Editor(2)" class="wp-image-382" width="660" height="420" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-03.png 880w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-03-300x191.png 300w, https://www.sinaungoding.com/wp-content/uploads/2019/07/Spring-boot-03-768x489.png 768w" sizes="(max-width: 660px) 100vw, 660px" /> <figcaption>Spring Initializr Editor(2)</figcaption></figure> 

Terkait dengan depedensi silakan dipilih sesuai dengan kebutuhan Anda, misalkan jika ingin menggunakan hibernate bisa dipilih pada kategori `SQL-Spring Data JPA` atau dengan mengetikkan pada icon cari seperti pada gambar di atas.

#### Hello World Spring Boot {#Hello-World-Spring-Boot}

Kita akan coba membuat aplikasi yang sederhana menggunakan Spring Boot, sebelumnya silakan buat project menggunakan `Spring Initializr` bisa menggunakan browser ataupun editor. Sementara kita menggunakan Maven untuk build tool dan tidak membutuhkan depedency yang digunakan. Ketika kita membuat project menggunakan Spring Boot, secara automatis akan dibuatkan class yang isinya seperti di bawah ini.

<pre class="wp-block-code"><code>import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HelloWorldApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloWorldApplication.class, args);
    }

    @Bean
    public HelloService helloService() {
        return new ConsoleHelloService();
    }
}</code></pre>

Terdapat anotasi `@SpringBootApplication` yang artinya adalah aplikasi tersebut menggunakan Spring Boot, sedangkan `@Bean` akan dijelaskan nanti. Kemudian buat interface seperti di bawah ini

<pre class="wp-block-code"><code>public interface HelloService {
    public void KatakanHai(String s);
}</code></pre>

Sebenarnya fungsi interface di atas hanya berisi methode untuk menampilkan message atau pesan sederhana. Jangan lupa tambahkan class untuk mengimplementasikan interface di atas, class tersebut adalah di bawah ini

<pre class="wp-block-code"><code>public class ConsoleHelloService implements HelloService {
    public ConsoleHelloService() {
    }

    @Override
    public void KatakanHai(String s) {
        System.out.println(s);
    }
}</code></pre>

Karena class `ConsoleHelloService` mengimplement interface `HelloService`, sehingga harus meng-override dan meng-implementasikan method `KatakanHai()`. Selanjutnya buatlah sebuah class yang mengimplement interface `CommandLineRunner` karena kita akan membuat aplikasi command line.

<pre class="wp-block-code"><code>import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class HelloCommandLineRunner implements CommandLineRunner {
    private final HelloService helloService;

    public HelloCommandLineRunner(HelloService helloService) {
        this.helloService = helloService;
    }

    @Override
    public void run(String... args) throws Exception {
        helloService.KatakanHai("Hai...!");
    }
}</code></pre>

Pada class di atas terdapat anotasi `@Component`, fungsinya adalah agar Spring menandai class tersebut komponen Spring. Jika dilihat ada instance dari interface `HelloService`, hanya saja ada sebuah kontruktor dengan instance `helloService`. Hal tersebut bisa terjadi karena menggunakan fungsi Spring, `depedency injection`. Silakan lihat kembali class `HelloWorldApplication`, terdapat anotasi `@Bean` pada method `helloService` itu digunakan untuk meng-instance sebuah class. Jika dijalankan hasilnya adalah sebagai berikut

<pre class="wp-block-preformatted">:: Spring Boot ::        (v2.1.6.RELEASE)
2019-07-11 13:32:36.195  INFO 67145 --- [           main] c.s.helloworld.HelloworldApplication     : Starting HelloworldApplication on Od3ngs-MacBook-Pro.local with PID 67145 (/Users/od3ng/IdeaProjects/helloworld/target/classes started by od3ng in /Users/od3ng/IdeaProjects/helloworld)
2019-07-11 13:32:36.198  INFO 67145 --- [           main] c.s.helloworld.HelloworldApplication     : No active profile set, falling back to default profiles: default
2019-07-11 13:32:36.725  INFO 67145 --- [           main] c.s.helloworld.HelloworldApplication     : Started HelloworldApplication in 15.88 seconds (JVM running for 21.591)
 Hai…!</pre>

Jika dilihat output di atas pada baris terakhir terdapat `"Hai...!"`, walapun contohnya masih sederhana tetapi konsep Spring dan penggunaan framework Spring Boot insya alloh sudah dapat tersajikan. Untuk full code dapat didapatkan di <a href="https://github.com/0d3ng/helloworld.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah tulisan saya mengenai pengenalan framework Spring dengan Spring Boot, semoga menjadi ilmu yang baru bagi temen-temen yang sedang belajar Java khususnya Spring Boot. Kritik dan saran sangat diharapkan untuk meningkatkan kwalitas blog ini. Happy coding. ^_^

#### Referensi {#Referensi}

  * <https://spring.io/projects/spring-boot>
  * <https://content.pivotal.io/springone-platform-2017/its-a-kind-of-magic-under-the-covers-of-spring-boot-brian-clozel-st%C3%A9phane-nicoll>
  * <https://content.pivotal.io/springone-platform-2017/from-zero-to-hero-with-spring-boot-brian-clozel>
  * <https://www.baeldung.com/spring-component-repository-service>