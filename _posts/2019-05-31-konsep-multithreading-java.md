---
id: 225
title: Konsep Multithreading Java
date: 2019-05-31T22:13:47+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=225
permalink: /konsep-multithreading-java/
wp_last_modified_info:
  - June 14, 2019 @ 3:36 pm
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
  - java
  - multithread
  - thread
---
Bismillah, Bagi temen-temen yang baru belajar Java mungkin belum banyak tahu salah satu fitur pemrograman Java adalah multithreading. Multithreading merupakan sebuah konsep untuk dapat menjalankan task atau tugas lebih dari satu secara paralel, sehingga dengan konsep ini task yang banyak akan cepat selesai karena tidak saling tunggu untuk menyelesaikan task. Selain itu dengan menggunakan konsep multithreading Anda benar-benar akan memanfaatkan semua core yang ada dalam processor komputer/laptop Anda.

<blockquote class="wp-block-quote">
  <p>
    Sebelum ke dalam bahasa pemrograman, konsep multithreading sudah lebih dulu diterapkan dalam sebuah sistem operasi. Misalkan unix/linux, atau sistem operasi lain yang sudah menerapkan itu.
  </p>
  
  <p>
    Contoh multithreading yang sudah Anda rasakan adalah browser, ketika menggunakan browser Anda bisa new tab atau new window lebih dari satu. Selain itu Anda juga bisa download ketika sedang browsing, bayangkan aja ketika Anda ingin menambah tab baru atau window tetapi harus menutup tab atau window sebelumnya terlebih dahulu. Atau ketika akan download Anda tidak melakukan aktifitas yang lain dengan browser Anda, pasti akan membosankan bukan?
  </p>
</blockquote>

#### Membuat Thread di Java

Untuk menciptakan Thread di Java dapat dilakukan dengan dua cara, yaitu mengimplement interface Runnable dan mengextends class Thread.

<pre class="wp-block-code"><code>public class ThreadHello implements Runnable {

    private final String name;

    public ThreadHello(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        System.out.println(name + ": Hello");
        try {
            Thread.sleep(250);
        } catch (InterruptedException ex) {
            Logger.getLogger(ThreadHello.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}</code></pre>

Class ThreadHello merupakan sebuah Thread yang mengimplement interface Runnable, ada satu methode yang harus dioverride yaitu run(). Di dalam methode tersebut kita bisa memberikan task atau tugas untuk thread yang Anda buat, sedangkan attribut name digunakan untuk pelabelan thread kelak jika thread tersebut berjalan atau running. Untuk sleep(250) sebenarnya hanya digunakan untuk mendelay sedikit agar nanti kelihatan urutan pengerjaan task, karena jika tidak diberikan sleep() task berjalan terlalu cepat dan susah untuk memperlihatkan prosesnya.

<pre class="wp-block-code"><code>@Test
    public void testRun() {
        for (int i = 0; i &lt; 5; i++) {
            ThreadHello instance = new ThreadHello(String.valueOf(i));
            Thread t = new Thread(instance);
            t.start();
        }
    }</code></pre>

Kode test di atas yaitu akan membuat sebanyak 5 thread yang akan mengeksekusi perintah di dalam methode run() class ThreadHello, instance dari ThreadHello harus dilewatkan dalam kontruktor class Thread. Untuk menjalankan panggil methode start().

<pre class="wp-block-preformatted">T E S T S<br /> Running com.odeng.maven.multithreading.ThreadHelloTest<br /> 0: Hello<br /> 3: Hello<br /> 2: Hello<br /> 4: Hello<br /> 1: Hello<br /> Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.147 sec</pre>

Ouput dari kode test menunjukkan bahwa urutan &#8220;Hello&#8221; tidak dijalankan serial atau bergantian, terbukti dengan label yang secara random tampil.

<pre class="wp-block-code"><code>public class ThreadWorld extends Thread {

    @Override
    public void run() {
        System.out.println(getName() + ": World");
        try {
            Thread.sleep(250);
        } catch (InterruptedException ex) {
            Logger.getLogger(ThreadHello.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}</code></pre>

Cara yang kedua yaitu dengan extends class Thread, sama halnya cara yang pertama kita harus melakukan override methode run(). Di dalam methode run() kita berikan perintah atau tugas sesuai yang kita inginkan, dalam contoh menampilkan pesan &#8220;World&#8221;. Ketika menggunakan cara ini, kita bisa memanfaatkan semua methode yang terdapat pada class Thread, misalkan getName() untuk mengambil label/nama thread yang diset atau diatur ketika memanggil thread.

<pre class="wp-block-code"><code>@Test
    public void testRun() {
        for (int i = 0; i &lt; 5; i++) {
            ThreadWorld instance = new ThreadWorld();
            instance.setName("" + i);
            instance.start();
        }
        
    }</code></pre>

Karena sebenarnya class ThreadWorld adalah extends Thread sehingga kita bisa langsung memanfaatkan semua methode yang dimilikinya, setName() digunakan untuk memberikan label/nama pada thread. start() dipanggil untuk menjalankan sebuah thread.

<pre class="wp-block-preformatted">T E S T S<br /> Running com.odeng.maven.multithreading.ThreadWorldTest<br /> 4: World<br /> 0: World<br /> 3: World<br /> 2: World<br /> 1: World<br /> Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.148 sec</pre>

Output dari kode test ingin menjelaskan bahwa message &#8220;World&#8221; ditampilkan secara acak dan tidak teratur, inilah konsep thread yang mengerjakan tugas dengan paralel.

#### Method Synchronized

Sebenarnya jika membicarakan method yang terdapat pada class Thread jumlahnya banyak, tetapi hanya akan saya bahas yang menurut saya sangat penting dan sering digunakan dalam real case yaitu synchronized. Method ini digunakan untuk memastikan bahwa ketika ada thread yang sedangkan menjalankan tugas tertentu, maka thread tersebut akan mengblock semua thread yang ada pada tugas yang sama. 

<blockquote class="wp-block-quote">
  <p>
    Contoh penggunaan method synchronized misalkan ketika mengakses resource secara bersama-sama, hal ini akan sangat berbahaya ketika thread tidak bisa dikontrol. Misalkan ada tugas untuk menulis ke sebuah file yang sama, proses ini thread harus dipastikan selesai terlebih dahulu kemudian bisa dilanjutkan thread yang lain untuk menulis juga.
  </p>
</blockquote>

<pre class="wp-block-code"><code>public class NumberGenerator {

    private final int low;
    private final int high;

    public NumberGenerator(int low, int high) {
        this.low = low;
        this.high = high;
    }

    public int randomNumber() {
        Random r = new Random();
        int result = r.nextInt(high - low) + low;
        return result;
    }
}</code></pre>

Class di atas digunakan untuk membuat random number dengan batas atas dan batas bawah tertentu, sehingga ketika methode randomNumber() dipanggil akan menghasilkan nilai random. Methode tersebut rencananya akan dipanggil oleh beberapa thread.

<pre class="wp-block-code"><code>public class ThreadNumber extends Thread {

    private final NumberGenerator ng;

    public ThreadNumber(NumberGenerator ng) {
        this.ng = ng;
    }

    @Override
    public void run() {
        callGenerator();
    }

    private void callGenerator() {
//        synchronized (ng) {
            for (int i = 0; i &lt; 3; i++) {
                System.out.println(getName() + " " + ng.randomNumber());

            }
//        }

    }</code></pre>

Selanjutnya class ThreadNumber yang merupakan turunan dari class Thread adalah sebuah thread yang di dalam methode run() akan memanggil callGenerator(), class NumberGenerator menjadi attribut pada class tersebut agar dapat memanggil methode randomNumber. callGenerator() berisi baris perintah menampilkan 3 random number, yaitu dengan memanggil methode randomNumber() pada object NumberGenerator. 

<pre class="wp-block-code"><code>@Test
    public void testRun() {
        NumberGenerator generator = new NumberGenerator(1000, 2000);
        for (int i = 0; i &lt; 3; i++) {
            new ThreadNumber(generator).start();
        }
    }</code></pre>

Script test di atas yaitu dengan membuat object dari class NumberGenerator dan parameter batas bawah 1000 serta batas atasnya 2000. Skenarionya adalah membuat 3 thread menggunakan perulangan kemudian masing-masing langsung dijalankan ketika dibuat dengan memanggil methode start().

<pre class="wp-block-preformatted">T E S T S<br /> Running com.odeng.maven.multithreading.ThreadNumberTest<br /> Thread-2 1049<br /> Thread-0 1523<br /> Thread-2 1234<br /> Thread-1 1494<br /> Thread-2 1371<br /> Thread-0 1025<br /> Thread-1 1880<br /> Thread-1 1585<br /> Thread-0 1945<br /> Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.152 sec</pre>

Terlihat bahwa output dari script test antara thread-0, thread-1, dan thread-2 masih tidak teratur, ini menandakan bahwa thread berjalan paralel tidak saling tunggu. Selanjutnya silakan comment pada methode callGenerator() dibuka agar mengaktifkan synchronized, jangan lupa dijalankan kembali script testnya.

<pre class="wp-block-preformatted">T E S T S<br /> Running com.odeng.maven.multithreading.ThreadNumberTest<br /> Thread-0 1893<br /> Thread-0 1086<br /> Thread-0 1648<br /> Thread-2 1166<br /> Thread-2 1272<br /> Thread-2 1717<br /> Thread-1 1161<br /> Thread-1 1661<br /> Thread-1 1193<br /> Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.138 sec</pre>

Ouput di atas adalah hasil penerapan synchronized, terlihat Thread-0 menampilkan 3 random number kemudian disusul dengan Thread-2, dan yang terakhir adalah Thread-1. Gimana mudah kan?

<blockquote class="wp-block-quote">
  <p>
    Walaupun menggunakan thread akan jauh lebih efisien dalam melakukan pengolahan atau pemrosesan, hati-hati juga ketika menggunakannya karena untuk melakukan control terhadap thread tidak mudah.
  </p>
</blockquote>

Demikianlah tulisan saya mengenai thread pada Java, semoga bermanfaat bagi pecinta Java yang baru belajar. Silakan ambil di <a href="https://github.com/0d3ng/maven-multithreading.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a> untuk sourcenya. Untuk meningkatkan kwalitas tulisan saya, kritik dan saran temen-temen sangat membantu. 😀