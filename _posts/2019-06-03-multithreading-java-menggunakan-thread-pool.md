---
id: 232
title: Multithreading Java Menggunakan Thread Pool
date: 2019-06-03T22:15:11+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=232
permalink: /multithreading-java-menggunakan-thread-pool/
wp_last_modified_info:
  - June 14, 2019 @ 2:47 pm
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
  - thread pool
---
Bismillah,  
Jika pada tulisan yang <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="http://www.sinaungoding.com/wordpress/2019/06/01/java-socket-programming/" target="_blank">sebelumnya</a> saya telah menulis tentang thread dan socket pada Java, pada kali ini saya akan menulis masih dengan topik yang sama yaitu tentang thread. Kemudian apa yang membedakan? Sebelumnya saya pernah menyatakan bahwa aplikasi yang menggunakan konsep multithreading susah untuk dikontrol, selain itu juga ketika tidak menerapkan multithreading secara benar maka aplikasi kita akan overhead karena terlalu banyak membuat objek thread. Untuk mengatasi permasalah tersebut Java menyediakan Thread Pool. Thread Pool merupakan salah fitur yang disediakan oleh Java untuk programmer mengatur jumlah thread yang akan mengerjakan sebuah task, Thread pool juga menyediakan sarana-sarana untuk mengontrol/memantau thread. Misalkan mengetahui thread dalam pool atau juga mengetahui jumlah task yang sudah dikerjakan.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="http://www.sinaungoding.com/wordpress/wp-content/uploads/2019/06/thread-pool.png" alt="https://www.baeldung.com/thread-pool-java-and-guava" class="wp-image-233" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/06/thread-pool.png 768w, https://www.sinaungoding.com/wp-content/uploads/2019/06/thread-pool-300x168.png 300w" sizes="(max-width: 768px) 100vw, 768px" /><figcaption><a href="https://www.baeldung.com/thread-pool-java-and-guava" target="_blank" rel="noreferrer noopener" aria-label="Thread Pool (opens in a new tab)">Thread Pool</a></figcaption></figure>
</div>

Pada gambar di atas memperlihatkan ada 3 bagian dalam Thread Pool, yaitu

  * Task Submitters, mengirimkan task yang akan dieksekusi oleh thread ke dalam sebuah antrian task.
  * Task Queue, sebuah antrian task hasil pengiriman oleh submitter.
  * Thread Pool merupakan kumpulan thread yang siaga mengerjakan task di dalam sebuah antrian task. Misalkan jumlah task lebih besar daripada jumlah thread berarti akan ada proses menunggu task di dalam antrian sebelum dieksekusi oleh thread.

<pre class="wp-block-code"><code>public class ThreadPoolServer {

    private ServerSocket serverSocket;
    private ThreadPoolExecutor executor;

    public ThreadPoolExecutor getExecutor() {
        return executor;
    }

    public void start(int port, int nthreads) {
        try {
            System.out.println("Starting server on port " + port);
            serverSocket = new ServerSocket(port);
            executor = (ThreadPoolExecutor) Executors.newFixedThreadPool(nthreads);
            while (true) {
                executor.execute(new EchoClientHandler(serverSocket.accept()));
            }
        } catch (IOException ex) {
            Logger.getLogger(ThreadPoolServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void stop() {
        try {
            executor.shutdown();
            executor.awaitTermination(10, TimeUnit.SECONDS);
            if (serverSocket != null) {
                serverSocket.close();
            }
        } catch (IOException | InterruptedException ex) {
            Logger.getLogger(ThreadPoolServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private static class EchoClientHandler implements Runnable {

        private Socket clientSocket;
        private PrintWriter out;
        private BufferedReader in;

        public EchoClientHandler(Socket socket) {
            this.clientSocket = socket;
            System.out.println("Request from " + socket.getInetAddress().getHostAddress());
        }

        public void run() {
            try {
                out = new PrintWriter(clientSocket.getOutputStream(), true);
                in = new BufferedReader(
                        new InputStreamReader(clientSocket.getInputStream()));

                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    if (".".equals(inputLine)) {
                        out.println("Jazzakalloh ^_^");
                        break;
                    }
                    out.println(inputLine);
                }
                in.close();
                out.close();
                clientSocket.close();
            } catch (IOException ex) {
                Logger.getLogger(EchoClientHandler.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
}</code></pre>

Server yang sebelumnya tidak banyak berubah, hanya menambahkan class ThreadPoolExecutor dan menambahkan parameter pada konstuktor untuk menentukan jumlah thread pool. Karena ThreadPoolExecutor adalah turunan class abstract sehingga untuk membuat instance tidak bisa langsung tetapi menggunakan class Executors dan memanggil method static yaitu newFixedThreadPool() dengan paramter jumlah thread pool. 

Yang sebagai submitter adalah dengan memanggil method execute() pada object ThreadPoolExecutor, yang dilewatkan adalah sebuah Runnable. Yang terakhir perlu dimodifikasi adalah class EchoClientHandler. Class tersebut sebelum extends class Thread, diganti menjadi implement Runnable untuk menyesuaikan parameter yang dibutuhkan oleh class ThreadPoolExecutor ketika memanggi method execute().

Task yang dikerjakan pada server sebenarnya hanya berupa forward message yang dikirimkan oleh client, misalkan client mengirimkan message &#8220;hai&#8221; maka server akan meresponse dengan message &#8220;hai&#8221;. Untuk mengakhiri komunikasi dengan server yang dibutuhkan adalah mengirimkan message &#8220;.&#8221;.

<pre class="wp-block-code"><code>public class ThreadPoolServerTest {

    ThreadPoolServer server;
    private static final int NTHREADS = 20;
    private final int PORT = 9000;
    private final String IP = "localhost";

    public ThreadPoolServerTest() {
    }

    @Before
    public void setUp() {
        server = new ThreadPoolServer();
    }

    @After
    public void tearDown() {
        server.stop();
    }

    @Test
    public void testSendMessage() {
        new Thread(() -> {
            server.start(PORT, NTHREADS);
        }).start();
        for (int i = 0; i &lt; 100; i++) {
            GreetClient client = new GreetClient();
            client.startConnection(IP, PORT);

            String message = "What'up!";
            assertEquals(client.sendMessage(message), message);
            String endMessage = "Jazzakalloh ^_^";
            assertEquals(client.sendMessage("."), endMessage);
            System.out.println("Number of core pool : " + server.getExecutor().getCorePoolSize());
            System.out.println("Number of pool      : " + server.getExecutor().getPoolSize());
            System.out.println("Number of task count: " + server.getExecutor().getTaskCount());
        }
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ex) {
            Logger.getLogger(ThreadPoolServerTest.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
}</code></pre>

Jika dilihat dari script test di atas thread yang akan dibuat sebanyak 20 thread, akan mengerjakan sebanyak 100 task. Jika menggunakan thread biasa, logika yang paling sederhana adalah dengan menggunakan single thread atau membuat thread sebanyak task yaitu 100 thread. Ketika menggunakan thread pool dalam contoh di atas, masing-masing thread akan menghandle atau mengerjakan 5 task. Beberapa method yang dicontohkan misalkan 

  * getCorePoolSize() digunakan mengambil jumlah thread yang digunakan executor service, jumlahnya sama dengan jumlah thread pada konstruktor ketika membuat instance executor 
  * getPoolSize() digunakan untuk menampilkan jumlah thread pool
  * getTaskCount() method untuk mengambil task count yang sudah tereksekusi.

<pre class="wp-block-preformatted">T E S T S<br /> Running com.odeng.maven.socket.threadpool.ThreadPoolServerTest<br /> Starting server on port 9000<br /> Request from 127.0.0.1<br /> Number of core pool : 20<br /> Number of pool      : 1<br /> Number of task count: 1<br /> ...<br /> ...<br /> ...<br /> Request from 127.0.0.1<br /> Number of core pool : 20<br /> Number of pool      : 20<br /> Number of task count: 100<br /> Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.456 sec</pre>

Pada output dari script terlihat bahwa ketika pertama kali dijalankan, thread pada jumlah pool 1 dengan task 1. Jumlah thread pool akan bertambah sampai dengan jumlah thread yang digunakan, begitu juga dengan task. Untuk code bisa temen-temen dapatkan di <a href="https://github.com/0d3ng/maven-multithreading.git" target="_blank" rel="noreferrer noopener" aria-label="github (opens in a new tab)">github</a>. 

Demikianlah artikel saya mengenai thread pool di Java, semoga bertambah wawasan dan ilmu baru bagi temen-temen. Saya sangat mengharapkan kritik dan saran temen-temen agar blog ini semakin berkwalitas, memotivasi saya untuk dapat menulis artikel-artikel yang akan datang jauh menarik. 🙂