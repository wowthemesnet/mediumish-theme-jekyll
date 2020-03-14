---
id: 229
title: Java Socket Programming
date: 2019-06-01T17:23:39+07:00
author: odeng
layout: post
guid: http://www.sinaungoding.com/wordpress/?p=229
permalink: /java-socket-programming/
wp_last_modified_info:
  - June 14, 2019 @ 2:52 pm
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
  - chatting
  - client
  - java
  - server
  - socket
  - tcp/ip
  - udp
---
Bismillah,  
Pada kesempatan kali ini saya akan menulis tentang pemrograman socket menggunakan Java, socket merupakan mekanisme yang digunakan untuk berkomunikasi antara komputer yang satu dengan komputer lainnya dalam sebuah jaringan komputer. Ketika berkomunikasi ada komputer yang bertindak sebagai server dan juga ada yang bertindak sebagai client. Contoh nyata penerapan socket ini adalah aplikasi untuk chatting dan juga aplikasi untuk mengirimkan data, perangkat-perangkat yang dimiliki bank seperti edc ataupun mesin atm banyak menggunakan socket untuk berkomunikasi dengan server mereka.

<blockquote class="wp-block-quote">
  <p>
    Dalam berkomunikasi socket membutuhkan protocol, protocol yang dapat digunakan ada dua jenis yaitu TCP/IP dan UDP. Protocol TCP/IP diperuntukkan untuk komunikasi dua arah antara client dan server dengan mengesampingkan kecepatan, misalkan aplikasi chatting. Ketika client mengirimkan pesan ke server, maka client harus menunggu balasan dari server. Sedangkan Protocol UDP adalah jenis protocol untuk kebutuhan komunikasi satu arah dengan kecepatan tinggi, biasanya diterapkan pada aplikasi broadcast.
  </p>
</blockquote>

<pre class="wp-block-code"><code>public class GreetServer {

    private ServerSocket serverSocket;
    private Socket clientSocket;
    private PrintWriter out;
    private BufferedReader in;

    public void start(int port) {
        try {
            serverSocket = new ServerSocket(port);
            clientSocket = serverSocket.accept();
            out = new PrintWriter(clientSocket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            String greeting = in.readLine();
            if ("hello server".equals(greeting)) {
                out.println("hello client");
            } else {
                out.println("unrecognised greeting");
            }
        } catch (IOException ex) {
            Logger.getLogger(GreetServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void stop() {
        try {
            in.close();
            out.close();
            clientSocket.close();
            serverSocket.close();
        } catch (IOException ex) {
            Logger.getLogger(GreetServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}</code></pre>

Class GreetServer digunakan untuk merepresentasikan sebuah fungsi server, skenario dari class tersebut adalah ketika client mengirimakan pesan &#8220;hello server&#8221; akan dibalas oleh server dengan pesan &#8220;hello client&#8221;. Secara teknis bahwa ketika class GreetServer sudah diinstance dan methode start() sudah dipanggil, ketika itu juga server akan siap menerima request dari client. Pada methode start() terdapat nomor port yang digunakan dalam server tersebut, penomoran port tersebut sebenarnya bisa berapa aja asalkan belum digunakan. Tetapi ada standard penggunaan port untuk TCP/IP dari range terendah sampai range tertinggi. Dalam class GreetServer terdapat class seperti

  * ServerSocket, class ini merupakan ciri khas bahwa class tersebut diperuntukkan untuk server. Ketika client tidak membutuhkan class tersebut.
  * Socket adalah sebuah class yang digunakan baik oleh client/server, instance dari class ini adalah nilai balik dari methode accept() yang dimiliki oleh class ServerSocket. Ketika methode accept() sudah dipanggil berapa sudah melakukan binding ke port tertentu dan siap untuk menerima request dari client.
  * PrintWriter digunakan untuk mengirimkan/menulis pesan ke client
  * BufferedReader digunakan untuk menerima/membaca pesan dari client

<pre class="wp-block-code"><code>public class GreetClient {

    private Socket clientSocket;
    private PrintWriter out;
    private BufferedReader in;

    public void startConnection(String ip, int port) {
        try {
            clientSocket = new Socket(ip, port);
            out = new PrintWriter(clientSocket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        } catch (IOException ex) {
            Logger.getLogger(GreetClient.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public String sendMessage(String msg) {
        String resp = null;
        try {
            out.println(msg);
            resp = in.readLine();
        } catch (IOException ex) {
            Logger.getLogger(GreetClient.class.getName()).log(Level.SEVERE, null, ex);
        }
        return resp;
    }

    public void stopConnection() {
        try {
            if (in != null) {
                in.close();
            }
            if (out != null) {
                out.close();
            }
            if (clientSocket != null) {
                clientSocket.close();
            }
        } catch (IOException ex) {
            Logger.getLogger(GreetClient.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}</code></pre>

Sedangkan pada class GreetClient sendiri, attribut-attribut yang terdapat pada class tersebut hampir sama dengan class GreetServer. Yang membedakan adalah pada class GreetClient tidak memiliki attribut ServerSocket, attribut tersebut khusus untuk kebutuhan server. Ketika sebuah socket client untuk mengikat pada ip dan port tertentu maka client tersebut sudah menjalin hubungan/keterikatan sehingga siap sudah bisa melakukan komunikasi.

<pre class="wp-block-code"><code>@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class GreetClientTest {

    GreetServer server;
    GreetClient instance;
    private final int PORT = 9000;
    private final String IP = "localhost";

    public GreetClientTest() {
    }

    @Before
    public void setUp() {
        server = new GreetServer();
        instance = new GreetClient();
    }

    @After
    public void tearDown() {
    }

    /**
     * Test of startConnection method, of class GreetClient.
     */
    @Test
    public void test1StartConnection() {
        System.out.println("startConnection");
        new Thread(() -> {
            server.start(PORT);
        }).start();
    }

    /**
     * Test of sendMessage method, of class GreetClient.
     */
    @Test
    public void test2SendMessage() {
        System.out.println("sendMessage");
        String msg = "hello server";
        String expResult = "hello client";
        instance.startConnection(IP, PORT);
        String result = instance.sendMessage(msg);
        assertEquals(expResult, result);
    }

    /**
     * Test of stopConnection method, of class GreetClient.
     */
    @Test
    public void test3StopConnection() {
        System.out.println("stopConnection");
        instance.stopConnection();
    }

}</code></pre>

Pada script test di atas memperlihatkan pengujian methode yang terdapat pada class GreetClient yaitu startConnection(), sendMessage(), dan StopConnection(). @FixMethodOrder(MethodSorters.NAME_ASCENDING) digunakan untuk mengurutkan pengujian methode berdasarkan nama methode secara ascending atau kecil ke besar, jadi kita menentukan pemanggilan methode sesuai dari alur aplikasi yang kita buat.

<pre class="wp-block-preformatted">T E S T S<br /> Running com.odeng.maven.socket.GreetClientTest<br /> startConnection<br /> sendMessage<br /> stopConnection<br /> Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.286 sec</pre>

Dari hasil pengujian di atas menjelaskan bahwa berhasil dilakukan, terbukti tidak yang Errors: 0. Contoh class GreetServer dan class GreetClient masih sangat sederhana, dimana ketika server dijalankan dan menyusul client dijalankan baik server dan client akan berhenti atau selesai. Bagaimana dengan contoh yang nyata, seperti aplikasi chatting dan pengiriman data dimana server selalu siap kapan saja untuk menerima request dari client. Ya, harus ada yang dimodifikasi terutama dari sisi server agar dapat terus menerus listening untuk menunggu client. 🙂

<pre class="wp-block-code"><code>public class EchoMultiClient {

    private ServerSocket serverSocket;

    public void start(int port) {
        try {
            System.out.println("Starting server on port " + port);
            serverSocket = new ServerSocket(port);
            while (true) {
                new EchoClientHandler(serverSocket.accept()).start();
            }
        } catch (IOException ex) {
            Logger.getLogger(EchoMultiClient.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void stop() {
        try {
            if (serverSocket != null) {
                serverSocket.close();
            }
        } catch (IOException ex) {
            Logger.getLogger(EchoMultiClient.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private static class EchoClientHandler extends Thread {

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

Dalam class EchoMultiClient merupakan sebuah server yang dapat menerima request dari multiple client, fungsi server hanya mengirimkan kembali pesan yang dikirimkan oleh client. Server akan terus berjalan atau dapat menerima request dari client selama client belum mengirimkan pesan &#8220;.&#8221;, ketika server menerima pesan &#8220;.&#8221; selanjutnya server akan membalas pesan client dengan &#8220;Jazzakalloh ^_^&#8221;.

Pada methode start() dalam class tersebut ketika dipanggil server akan binding port tertentu, selanjutnya akan looping secara infinity untuk siap siaga ketika ada client mengikat server tersebut. Kemudian dalam class EchoMultiClient juga terdapat inner class EchoClientHandler turunan dari Thread, dalam class tersebut yang mengolah data dari client. Kenapa menggunakan thread? Karena ketika ada request dari client maka akan secara independent diolah satu thread, kemudian jika ada request lagi client baru akan diolah thread yang baru.

<pre class="wp-block-code"><code>public class GreetMultiClientTest {

    EchoMultiClient server;
    private final int PORT = 9000;
    private final String IP = "localhost";

    public GreetMultiClientTest() {
    }

    @Before
    public void setUp() {
        server = new EchoMultiClient();
    }

    @After
    public void tearDown() {
        server.stop();
    }

    @Test
    public void testSendMessage() {
        new Thread(() -> {
            server.start(PORT);
        }).start();
        GreetClient client = new GreetClient();
        client.startConnection(IP, PORT);
        String message = "What'up!";
        assertEquals(client.sendMessage(message), message);
        message = "Ada apa?";
        assertEquals(client.sendMessage(message), message);
        String endMessage = "Jazzakalloh ^_^";
        assertEquals(client.sendMessage("."), endMessage);
        
        GreetClient client1 = new GreetClient();
        client1.startConnection(IP, PORT);
        message = "Py kabare?";
        assertEquals(client1.sendMessage(message), message);
        endMessage = "Jazzakalloh ^_^";
        assertEquals(client1.sendMessage("."), endMessage);
    }
}</code></pre>

Dalam script test di atas terdapat 2 client yang mengirimkan pesan ke server, kemudian jika client ingin mengakhiri ikatan dengan server dengan mengirimkan pesan &#8220;.&#8221;. 

<pre class="wp-block-preformatted">T E S T S<br /> Running com.odeng.maven.socket.GreetMultiClientTest<br /> Starting server on port 9000<br /> Request from 127.0.0.1<br /> Request from 127.0.0.1<br /> Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.287 sec</pre>

Dari output test di atas tidak ada kendala atau error ketika script test dijalankan. Silakan dimodifikasi pada class EchoClientHandler agar aplikasi berbasis socket sesuai dengan kasus yang Anda hadapi di dunia nyata. Untuk source code silakan bisa Anda dapatkan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/0d3ng/maven-multithreading.git" target="_blank">sini</a>.

Demikianlah tulisan saya tentang socket programing Java dipadukan dengan thread, semoga bermanfaat dan dapat menjadi pengetahuan baru bagi temen-temen yang baru belajar Java. Saya menyadari bahwa tulisan saya masih sangat jauh dari sempurna, kritik dan saran sangat saya harapkan untuk memperbaiki dan meningkatkan kwalitas blog ini. 🙂