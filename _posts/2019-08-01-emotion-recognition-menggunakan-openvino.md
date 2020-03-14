---
id: 437
title: Emotion Recognition Menggunakan OpenVINO
date: 2019-08-01T14:42:53+07:00
author: odeng
layout: post
guid: https://www.sinaungoding.com/?p=437
permalink: /emotion-recognition-menggunakan-openvino/
wp_last_modified_info:
  - August 1, 2019 @ 2:42 pm
wplmi_shortcode:
  - '[lmt-post-modified-info]'
site-sidebar-layout:
  - default
site-content-layout:
  - default
theme-transparent-header-meta:
  - default
categories:
  - Raspberry Pi
tags:
  - emotion-recognition
  - openvino
  - raspberry-pi
---
<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/emotion-recognition-vino-1024x768.jpg" alt="" class="wp-image-439" srcset="https://www.sinaungoding.com/wp-content/uploads/2019/08/emotion-recognition-vino-1024x768.jpg 1024w, https://www.sinaungoding.com/wp-content/uploads/2019/08/emotion-recognition-vino-300x225.jpg 300w, https://www.sinaungoding.com/wp-content/uploads/2019/08/emotion-recognition-vino-768x576.jpg 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></figure>
</div>

Bismillah,  
Jika pada kesempatan <a rel="noreferrer noopener" aria-label="sebelumnya (opens in a new tab)" href="https://www.sinaungoding.com/openvino-object-detection-yolo3/" target="_blank">sebelumnya</a> saya telah posting penerapan YOLO V3 untuk pengenalan object, pada kali ini akan saya coba menulis untuk pengenalan emosi. Hasil pengenalan tersebut saya coba di Raspberry Pi 3B+ dan Neural Compute Stick 2. 

Untuk model emotion recognition sendiri sebenarnya sudah disediakan di dokumetnasi OpenVino, sedangkan konsep penerapannya sendiri menggunakan Thread dan Queue. Kenapa menggunakan Thread, yang jelas agar proses paralel yang dilakukan bisa lebih cepat. Karena untuk emotion recognition ada 2 proses di dalamnya yaitu untuk mendeteksi wajah dan untuk mendeteksi ekpresi wajah. Beberapa point yang akan disampaikan dalam tulisan ini adalah sebagai berikut;

  *  [Download Model yang Dibutuhkan](#Download-Model-yang-Dibutuhkan)
  * [Konfigurasi Depedency](#Konfigurasi-Depedency)
  * [Implementasi Kode](#Implementasi-Kode)
  * [Testing Aplikasi](#Testing-Aplikasi)
  * [Referensi](#Referensi)

#### Download Model yang Dibutuhkan {#Download-Model-yang-Dibutuhkan}

Langkah awal yang perlu dilakukan adalah download model yang tersedia pada website OpenVINO Toolkit menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>wget --no-check-certificate https://download.01.org/opencv/2019/open_model_zoo/R1/models_bin/face-detection-adas-0001/FP16/face-detection-adas-0001.bin
wget --no-check-certificate https://download.01.org/opencv/2019/open_model_zoo/R1/models_bin/face-detection-adas-0001/FP16/face-detection-adas-0001.xml</code></pre>

Perintah di atas digunakan untuk mengambil model pre-trained dan topologi network dari face detection. Selanjutnya perlu download juga untuk model pre-trained dan topologi network untuk emotion detection.

<pre class="wp-block-code"><code>wget --con-check-certificate https://download.01.org/opencv/2019/open_model_zoo/R1/models_bin/emotions-recognition-retail-0003/FP16/emotions-recognition-retail-0003.bin
wget --con-check-certificate https://download.01.org/opencv/2019/open_model_zoo/R1/models_bin/emotions-recognition-retail-0003/FP16/emotions-recognition-retail-0003.xml</code></pre>

#### Konfigurasi Depedency {#Konfigurasi-Depedency}

Beberapa paket yang perlu diinstall bisa Anda dapatkan di <a href="https://github.com/0d3ng/emotion-recognition-vino/blob/master/requirements.txt" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>, sudah saya `freeze` menggunakan perintah `pip`. Kira-kira yang perlu diinstall adalah sebagai berikut

<pre class="wp-block-code"><code>imutils==0.5.2
numpy==1.17.0
opencv-python==4.1.0.25</code></pre>

Jika menggunakan virtual environment, ada dapat menggunakan perintah pip untuk install paket-paket di atas seperti berikut ini

<pre class="wp-block-code"><code>pip install requirements.txt</code></pre>

Secara berurutan paket-paket di atas digunakan untuk load audio/video, memanipulasi data array, dan yang terakhir library computer vision.

#### Implementasi Kode {#Implementasi-Kode}

Sebenarnya untuk kode saya tidak buat dari awal, contoh kode dapat di dapatkan di <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="https://github.com/PINTO0309/OpenVINO-EmotionRecognition.git" target="_blank">sini</a>. Seperti telah saya sebutkan di atas bahwa implementasi kodenya menggunakan thread dan queue, ada 5 ekspresi yang dapat dideteksi yaitu `"neutral", "happy", "sad", "surprise", "anger".`Dataset yang digunakan didapatkan dari <a rel="noreferrer noopener" aria-label="sini (opens in a new tab)" href="http://mohammadmahoor.com/affectnet/" target="_blank">sini</a>, dengan 2500 image untuk validasi. Sedangkan tingkat akurasi sebesar 70,20%. Beberapa potongan kode yang penting adalah sebagai berikut

<pre class="wp-block-code"><code>def camThread(LABELS, resultsEm, frameBuffer, camera_width, camera_height, vidfps, number_of_camera, mode_of_camera):
    global fps
    global detectfps
    global lastresults
    global framecount
    global detectframecount
    global time1
    global time2
    global cam
    global vs
    global window_name

    if mode_of_camera == 0:
        cam = cv2.VideoCapture(number_of_camera)
        if cam.isOpened() != True:
            print("USB Camera Open Error!!!")
            sys.exit(0)
        cam.set(cv2.CAP_PROP_FPS, vidfps)
        cam.set(cv2.CAP_PROP_FRAME_WIDTH, camera_width)
        cam.set(cv2.CAP_PROP_FRAME_HEIGHT, camera_height)
        window_name = "USB Camera"
    else:
        vs = PiVideoStream((camera_width, camera_height), vidfps).start()
        sleep(3)
        window_name = "PiCamera"

    cv2.namedWindow(window_name, cv2.WINDOW_AUTOSIZE)

    while True:
        t1 = time.perf_counter()

        # USB Camera Stream or PiCamera Stream Read
        color_image = None
        if mode_of_camera == 0:
            s, color_image = cam.read()
            if not s:
                continue
        else:
            color_image = vs.read()

        if frameBuffer.full():
            frameBuffer.get()
        frames = color_image

        height = color_image.shape[0]
        width = color_image.shape[1]
        frameBuffer.put(color_image.copy())
        res = None

        if not resultsEm.empty():
            res = resultsEm.get(False)
            # print("[LOG] ".format(type(res)))
            # print(res)
            detectframecount += 1
            imdraw = overlay_on_image(frames, res)
            lastresults = res
        else:
            imdraw = overlay_on_image(frames, lastresults)

        cv2.imshow(window_name, cv2.resize(imdraw, (width, height)))

        if cv2.waitKey(1) & 0xFF == ord('q'):
            sys.exit(0)

        ## Print FPS
        framecount += 1
        if framecount >= 25:
            fps = "(Playback) {:.1f} FPS".format(time1 / 25)
            detectfps = "(Detection) {:.1f} FPS".format(detectframecount / time2)
            framecount = 0
            detectframecount = 0
            time1 = 0
            time2 = 0
        t2 = time.perf_counter()
        elapsedTime = t2 - t1
        time1 += 1 / elapsedTime
        time2 += elapsedTime</code></pre>

Penjelasan kode di atas digunakan untuk melalui streaming video melalui camera yang terdapat di raspberry, dari parameter bisa ditentukan apakah menggunakan picamera atau mengunakan usb camera. Potongan kode selanjutnya adalah sebagai berikut

<pre class="wp-block-code"><code>    def predict_async(self):
        try:

            if self.resultsFd.empty():
                return

            resultFd = self.resultsFd.get()
            detection_list = resultFd[0]
            face_image_list = resultFd[1]
            emotion_list = []
            max_face_image_list_cnt = len(face_image_list)
            image_idx = 0
            end_cnt_processing = 0
            heapflg = False
            cnt = 0
            dev = 0

            if max_face_image_list_cnt &lt;= 0:
                detection_list.extend([""])
                self.resultsEm.put([detection_list])
                return

            while True:
                reqnum = searchlist(self.inferred_request, 0)

                if reqnum > -1 and image_idx &lt;= (max_face_image_list_cnt - 1) and len(face_image_list[image_idx]) > 0:

                    if len(face_image_list[image_idx]) == []:
                        image_idx += 1
                        continue
                    else:
                        prepimg = self.image_preprocessing(face_image_list[image_idx])
                        image_idx += 1

                    self.exec_net.start_async(request_id=reqnum, inputs={self.input_blob: prepimg})
                    self.inferred_request[reqnum] = 1
                    self.inferred_cnt += 1
                    if self.inferred_cnt == sys.maxsize:
                        self.inferred_request = [0] * self.num_requests
                        self.heap_request = []
                        self.inferred_cnt = 0
                    heapq.heappush(self.heap_request, (self.inferred_cnt, reqnum))
                    heapflg = True

                if heapflg:
                    cnt, dev = heapq.heappop(self.heap_request)
                    heapflg = False

                if self.exec_net.requests[dev].wait(0) == 0:
                    self.exec_net.requests[dev].wait(-1)
                    out = self.exec_net.requests[dev].outputs["prob_emotion"].flatten()
                    emotion = LABELS[int(np.argmax(out))]
                    detection_list.extend([emotion])
                    self.resultsEm.put([detection_list])
                    self.inferred_request[dev] = 0
                    end_cnt_processing += 1
                    if end_cnt_processing >= max_face_image_list_cnt:
                        break
                else:
                    heapq.heappush(self.heap_request, (cnt, dev))
                    heapflg = True

        except:
            import traceback
            traceback.print_exc()</code></pre>

Potongan kode di atas berfungsi untuk melakukan prediksi image hasil deteksi wajah, setelah mendapatkan hasilnya kemudian indexnya dicari pada daftar emosi yang sebelumnya telah didefiniskan. Nilai kembalian berupa `String`, yaitu `"neutral", "happy", "sad", "surprise", "anger"`. Selanjutnya dimasukan ke dalam list dan queue.

<pre class="wp-block-code"><code>def overlay_on_image(frames, object_infos):
    try:

        color_image = frames

        if isinstance(object_infos, type(None)):
            return color_image

        # Show images
        height = color_image.shape[0]
        width = color_image.shape[1]
        img_cp = color_image.copy()
        for object_info in object_infos:

            if object_info[2] == 0.0:
                break

            if (not np.isfinite(object_info[0]) or
                    not np.isfinite(object_info[1]) or
                    not np.isfinite(object_info[2]) or
                    not np.isfinite(object_info[3]) or
                    not np.isfinite(object_info[4]) or
                    not np.isfinite(object_info[5]) or
                    not np.isfinite(object_info[6])):
                continue

            min_score_percent = 60

            percentage = int(object_info[2] * 100)

            if (percentage &lt;= min_score_percent):
                continue

            box_left = int(object_info[3])
            box_top = int(object_info[4])
            box_bottom = int(object_info[6])
            emotion = str(object_info[7])

            label_text = emotion + " (" + str(percentage) + "%)"
            label_text_color = (255, 255, 255)

            # info fps
            cv2.putText(img_cp, fps, (width - 170, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (38, 0, 255), 1, cv2.LINE_AA)
            cv2.putText(img_cp, detectfps, (width - 170, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (38, 0, 255), 1,
                        cv2.LINE_AA)

            # background of expression list
            overlay = img_cp.copy()
            opacity = 0.4
            cv2.rectangle(img_cp, (box_left + box_bottom + 10 - 250, box_top - 25),
                          (box_left + box_bottom - 50, box_top + 25),
                          (64, 64, 64), cv2.FILLED)
            cv2.addWeighted(overlay, opacity, img_cp, 1 - opacity, 0, img_cp)

            # connect face and expressions
            cv2.line(img_cp, (int((box_left + box_left + box_bottom - 250) / 2), box_top + 15),
                     (box_left + box_bottom - 250, box_top - 20),
                     (255, 255, 255), 1)
            cv2.line(img_cp, (box_left + box_bottom - 250, box_top - 20),
                     (box_left + box_bottom + 10 - 250, box_top - 20),
                     (255, 255, 255), 1)

            cv2.putText(img_cp, label_text, (int(box_left + box_bottom + 15 - 250), int(box_top - 12 + 20)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, label_text_color,
                        1)

        return img_cp

    except:
        import traceback
        traceback.print_exc()</code></pre>

Method di atas digunakan untuk menampilkan hasil dari deteksi emosi pengolahan sebelumnya, selain itu perlu dipastikan tingkat kepercayaan emosi yang akan ditampilkan adalah >= 60.

#### Testing Aplikasi {#Testing-Aplikasi}

Selanjutnya akan kita coba kode lengkap yang telah dibuat, untuk dapat menjalankan silakan menggunakan perintah di bawah ini

<pre class="wp-block-code"><code>python main.py</code></pre>

Sebenarnya ada beberapa parameter yang digunakan, silakan cek pada fungsi main, atau bisa menambahkan parameter `-h` di belakang `main.py` ketika menjalankan program. Kira-kira hasilnya adalah sebagai berikut

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://www.sinaungoding.com/wp-content/uploads/2019/08/OpenVINO-emotion-recognition.gif" alt="OpenVINO-emotion-recognition" class="wp-image-438" /><figcaption>OpenVINO-emotion-recognition</figcaption></figure>
</div>

Sebenarnya masih ada beberupa kekurangan untuk contoh di atas, misalkan belum bisa deteksi multiple objek orang belum bisa dilakukan. Selanjutnya ketika tidak mendeteksi objek, label masih tampil. Hal tersebut bisa disolusikan dengan tidak menggunakan queue dan perlu dilakukan refresh ketika tidak mendeteksi. Untuk full kode bisa didapatkan di <a href="https://github.com/0d3ng/emotion-recognition-vino.git" target="_blank" rel="noreferrer noopener" aria-label="sini (opens in a new tab)">sini</a>.

Demikianlah tulisan saya terkait dengan emotion recognition memanfaatkan OpenVINO menggunakan Raspberry Pi 3B+. Semoga bermanfaat dan menjadi ilmu yang baru buat temen-temen, kritik dan saran masih dibutuhkan untuk meningkatkan kwalitas konten blog ini. 🙂

#### Referensi {#Referensi}

  * [https://docs.openvinotoolkit.org/latest/\_docs\_install\_guides\_installing\_openvino\_raspbian.html#run-inference-opencv](https://docs.openvinotoolkit.org/latest/_docs_install_guides_installing_openvino_raspbian.html#run-inference-opencv)
  * [https://docs.openvinotoolkit.org/latest/\_intel\_models_index.html](https://docs.openvinotoolkit.org/latest/_intel_models_index.html)
  * [https://docs.openvinotoolkit.org/latest/\_intel\_models\_emotions\_recognition\_retail\_0003\_description\_emotions\_recognition\_retail_0003.html](https://docs.openvinotoolkit.org/latest/_intel_models_emotions_recognition_retail_0003_description_emotions_recognition_retail_0003.html)
  * <https://github.com/PINTO0309/OpenVINO-EmotionRecognition>