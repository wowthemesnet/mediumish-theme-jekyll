---
id: loda1551603987
layout: post
title:  "Mình đã làm xe tự lái như thế nào?"
author: loda
categories: [ Image Processing, Machine Learning, AI ]
image: assets/images/loda1551603987/1.png
description: "Cùng mình làm xe tự lái nào. Em xe này có tốc độ chạy tối đa 25 km/h"
featured: true
hidden: true
rating: 5
---

## Đôi nét về Xe tự hành

Chắc hẳn những cụm từ như `“Xe tự hành”` (hay `“Xe tự lái”`) đã không còn xa lạ đối với những người quan tâm tới công nghệ trong suốt thời gian qua. Đã có rất nhiều tập đoàn, công ty lớn tham gia vào vào cuộc đua nghiên cứu xe tự hành này, tiêu biểu có thể kể tới như `Uber`, `Apple`, `Ford`, `Honda`, `BWM`, `Liên minh Renault` – `Nissan` – `Mitsubishi`,.. Theo số liệu báo cáo từ KPMG thì tổng số tiền đầu tư vào lĩnh vực này trong 05 năm vừa qua đã đạt tới con số hơn 50 tỷ USD (ờ hớ ờ hớ)


Cho những bạn chưa biết, thì “xe tự hành” có thể hiểu là ôtô có khả năng hoạt động mà không cần đến sự điều khiển hay can thiệp của con người.

Nếu xe tự hành được nghiên cứu và áp dụng thành công thì những lợi ích mà nó đem lại sẽ có tác động rất tích cực đến chất lượng đời sống của con người như: giảm tỷ lệ tai nạn giao thông do bất cẩn của người lái, giảm thiểu chi phí sửa chữa ô tô; hỗ trợ người tàn tật, người già di chuyển dễ dàng, chủ động hơn.

## Hành trình đáng nhớ với “Cuộc đua số”

Đây là chân dung chiếc xe tự hành mini của chúng mình. Xe được xây dựng trên tỉ lệ 1:20 so với xe thật, có kích thước chiều dài khoảng 40cm và chiều cao 30cm. 

Em xe này có tốc độ chạy tối đa 25 km/h, có thể leo trèo bãi đất, bãi cát, leo dốc 45 độ, lội nước sâu tầm 10 cm, lội tuyết, sình lầy (cũng khá ngầu phải không :P)

<p>
<div class="wrapper-center">
![walking]({{ site.baseurl }}/assets/images/loda1551603987/2.jpg)
</div>
</p>

Chi tiết hơn thì chiếc xe gồm có:

1. Động cơ điều khiển bánh
2. Vi mạch Jetson TX1 
3. Camera
4. Cảm biến vật cản
5. Màn hình led và các phím chức năng
6. Dây nối tín hiệu cho mạch và dây nguồn cho động cơ/mạch

Sau đây, mình sẽ chia sẻ qua một chút về quá trình team mình lập trình chiếc xe này và đi vào từng bài toán mà bọn mình cần giải quyết. Thật đáng tiếc là cuộc thi đã trôi qua được 1 năm, và source code mình đã gửi lại cho ban tổ chức, cũng như không còn lưu giữ gì về nó :'( mình sẽ chia sẻ hướng giải quyết vấn đề. còn source code sẽ tự bổ sung lại dần dần sau này.

### Xác định 2 biên đường

Để xe có thể đi đúng thì cần xác định 2 biên đường để đảm bảo xe luôn đi trong đó. Đây là một bài toán xử lý ảnh cơ bản vì 2 làn đường có màu trắng trên nền đen và bỏ qua yếu tố ngoại cảnh như nhiễu hạt hay vật cản.

Ngoài ra, xe chỉ cần xác định đoạn đường trước nó không xa, nên mình cắt 1 nửa ảnh, lấy đoạn đường phía dưới để xử lý. Mình đã sử dụng lọc màu trên kênh HSV để làm nổi bật các đường màu trắng, sau đó sử dụng `thuật toán Canny` để cho ra biên ảnh. Từ Canny mình có thể xác định được các đường thẳng trong ảnh => chính là các làn đường trong ảnh.

<div class="wrapper-center">
![walking]({{ site.baseurl }}/assets/images/loda1551603987/3.png)
</div>

Tham khảo thuật toán Canny [tại đây.](https://docs.opencv.org/3.1.0/da/d22/tutorial_py_canny.html)

### Xác định tâm đường

Khi đã xác định được 2 làn đường, việc xác định tâm đường sẽ đơn giản với đoạn đường thẳng đó là lấy trung điểm của 2 làn đường.

Tại mỗi lần di chuyển, hình ảnh camera bắt được sẽ thay đổi theo thời gian nên tâm đường sẽ bị dịch chuyển, nhưng phải nằm trong giới hạn thay đổi nhất định, tâm đường mới không được quá lệch với tâm đường trước, thuật toán của bọn mình sẽ đặt ra 1 giới hạn để tránh tâm đường thay đổi đột ngột.

Tuy nhiên, có trường hợp đặc biệt là đoạn đường cong. Sẽ không thể lấy trung điểm nữa mà phải sử dụng thuật toán hồi quy để suy diễn từ các tâm đường trước đó.

Đây là thuật toán chính để giúp xe luôn đi trong đường quy định. Mình sẽ bổ sung thuật toán này sớm nhất khi nhớ lại source code huhu.

### Xe di chuyển

Khi đã xác định được tâm đường, thì việc cho xe di chuyển chỉ là đi theo cái tâm ý, và cứ nhăm nhăm mà đi thôi. Chỉ khó ở việc cho xe rẽ ở đoạn đường cong, sẽ phải điều chỉnh độ nghiêng của bánh lớn hơn 2 lần. Tốc độ di chuyển giảm xuống khoảng 0.65

### Xác định vật cản

Trên đường đi, vật cản được quy định là `khối hộp màu xanh` và `đỏ` điều này khá dễ dàng để có thể nhận biết, chỉ 1 vài phép biến đổi ảnh đơn giản như Color Filter, [Convex Hull](https://docs.opencv.org/3.1.0/dd/d49/tutorial_py_contour_features.html) là sẽ ra. Thuật toán bạn tham khảo tại đây [tại đây](https://docs.opencv.org/3.1.0/dd/d49/tutorial_py_contour_features.html)

<div class="youtube-container">
    <iframe src="https://www.youtube.com/embed/BaAmaIyCp2Y" frameborder="0" allowfullscreen></iframe>
</div>


### Xác định biển báo rẽ đường

Trong phần xác định biển báo rẽ trái hoặc rẽ phải. Mình sẽ dụng màu xanh nước biển là bộ lọc, sau đó xác định Contour và bao viền biển báo. Cái này cần ốp machine learning mạnh mẽ vào :v

Khi đã biết được biển báo ở đâu, mình sẽ sử dụng thuật toán trích đặc trưng của biển báo là HOG và đưa vào một bộ nhận dạng đã được huấn luyện từ trước là SVM để xác định xem biển báo là gì => Lúc này sẽ biết được biển báo đó là rẽ trái hay rẽ phải và điều khiển xe theo hướng đó

<div class="wrapper-center">
![walking]({{ site.baseurl }}/assets/images/loda1551603987/4.jpg)
</div>

Trên đây là toàn bộ những chia sẻ của mình về việc mình đã được tham gia lập trình một chiếc Xe tự hành ở level “đơn giản” như thế nào. Hy vọng là trong tương lai sẽ không còn là dạng “mô hình” hay “level đơn giản” nữa :D

Một lần nữa xin lỗi bạn đọc vì không có source code ở đây, nhưng mình sẽ bổ sung trong thời gian sớm nhất có thể. ít ra trong bài viết có những keywords khá quan trọng nếu bạn muốn tìm hiểu :D 
