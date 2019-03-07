---
id: loda1551933570178
layout: post
title: Hướng dẫn chi tiết tự xây dựng một mạng neural với Python
author: loda
categories: [ Machine Learning, deep learning, neural network, Python ]
image: https://cdn.ereka.vn/2018/06/24/c41f7da2e8698e1a8616572f668b3a5d.jpg
description: Đây là bài viết nói về cả quá trình và các bước thực hiện trong 1 mạng neural, nên sẽ không đi sau chi tiết từng phần nhưng vẫn cung cấp cho bạn kiến thức để hiểu được vai trò của nó trong cả kiến trúc.
featured: true
hidden: true
rating: 5
---

Google đã xây dựng tensorflow như một công cụ để xây dựng các mô hình deep learning một các đơn giản và tối ưu chỉ với vài dòng code. Tuy nhiên, nếu chỉ sử dụng các API này thì thật khó để biết được các cách thức hoạt động đằng sau của từng thành phần trong mô hình. Bài viết này sẽ hướng dẫn các bạn cách xây dựng mạng neural một cách chi tiết qua từng dòng lệnh, từ đó có một cái nhìn rõ ràng hơn về cách hoạt động của chúng.

Đây là bài viết nói về cả quá trình và các bước thực hiện trong 1 mạng neural, nên sẽ không đi sau chi tiết từng phần nhưng vẫn cung cấp cho bạn kiến thức để hiểu được vai trò của nó trong cả kiến trúc.
#### Mạng neural là gì?

`Mạng neural` có thể coi là một phương thức để miêu tả cách hoạt động trong bộ não của con người. Nói một cách đơn giản hơn, mạng neural là một hàm nhận một đầu vào `x`, xử lý nó và đưa ra một đầu ra `y` tương ứng. Mạng neural gồm những thành phần sau:

* Một lớp biểu diễn đầu vào `x`
* Một số lượng các lớp ẩn - `hidden layers`
* Một lớp biểu diễn đầu ra `y`
* Một bộ các chỉ số `weights(W)` và `bias(b)` giữa các lớp
* Một hàm kích hoạt - `activation function` giữa các lớp

Hình dưới đây miêu tả một kiến trúc mạng neural gồm 2 lớp (lớp đầu vào `x` thường không được tính vào số lượng lớp của mạng)

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/c41f7da2e8698e1a8616572f668b3a5d.jpg"
    alt="Neural network, mạng nơ ron, neurol"/>
</div>

Giờ thì chúng ta sẽ bắt đầu xây dựng kiến trúc trên với Python. Đầu tiên là khởi tạo class `NeuralNetwork`. Để đơn giản hóa mô hình, ta sẽ mặc định là các biến `bias` bằng 0.

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/e5ea3a08be22cc40f7d3ebc7b1536ec9.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

#### Huấn luyện mạng neural

Với kiến trúc trên, biến `ŷ` thể hiển đầu ra của mạng sẽ được tính theo công thức:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/0ae2983de3bf3868aaf3b2a8a03cbe50.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Theo công thức trên, có thể thấy được rằng các biến weights `W` và bias `b` đóng vai trò quyết định đầu ra `ŷ`. Giá trị của các biến này cần được tinh chỉnh để tăng độ chính xác trong những dự đoán của mạng neural. Quá trình tinh chỉnh các biến này được gọi là quá trình huấn luyện mạng. Quá trình này là một vòng lặp gồm các bước:

* Feedforward: Tính toán đầu ra ŷ
* Backpropagation: Cập nhật các giá trị W và b

Mỗi vòng lặp trong quá trình huấn luyện diễn ra như sau:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/0826eda2cb11e6b19dfbcd642eea15d9.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Chúng  ta sẽ đi vào chi tiết từng phần

#### Feedforward

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/b78d20ec7ad65706669e51ccb33001f7.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Code hàm feedforward:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/140c1d14416323166b5d48b1bebede80.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Sau bước feedforward, ta đã tính được đầu ra `ŷ` của mạng neural. Tuy nhiên ta vẫn chưa xây dựng một cách thức để đánh giá mức độ đúng đắn của dự đoán này. Phương thức phổ biến nhất dùng để đánh giá mức độ chênh lệch giữa dự đoán `ŷ` (Giá trị output của mạng) với kết quả mong muốn `y` (Giá trị output thực sự mà ta muốn) là sử dụng `hàm mất mát` - `Loss function`.

#### hàm mất mát - Loss function

Là một hàm để tính toán mức độ chênh lệch giữa `ŷ` và `y`. Vì giá trị độ chênh lệch này biểu diễn sự sai sót trong quá trình dự đoán của mạng nên giá trị này còn được gọi là giá trị lỗi. Giá trị lỗi càng nhỏ thì dự đoán của mạng neural càng chính xác. Có rất nhiều biến thể của hàm mất mát phù hợp cho từng bài toán khác nhau, trong bài viết này ta sẽ sử dụng `hàm tổng bình phương lỗi (Sum of square error)`:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/e1598a29bf04dca6891f788c9f4231bc.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Giống như cái tên hàm tổng bình phương lỗi, giá trị lỗi được tính theo tổng bình phương của độ chệnh lệch của từng dự đoán `ŷ` với mong muốn `y` tương ứng. Mục tiêu của việc huấn luyện mạng là giảm giá trị lỗi này đến mức tối thiểu và quá trình `backpropagation` sẽ thực hiện điều đó.

#### Backpropagation

Sau khi đã tính được giá trị lỗi, ta cần phải cập nhật các biến `W` và `b` sao cho các dự đoán `ŷ` về sau có giá trị lỗi nhỏ nhất có thể. Nhắc lại kiến thức về giải tích, để tìm cực tiểu của một hàm số ta phải tính đạo hàm của hàm số đó theo từng biến. Các giá trị đạo hàm nói cho ta biết về các "hướng" cần di chuyển các biến để hàm số đi về cực tiểu. Vì vậy, một khi ta đã có đạo hàm của hàm mất mát theo từng biến `W` và `b`, ta sẽ cập nhật các giá trị của chúng theo giá trị các đạo hàm tương ứng. Phương pháp này được gọi là `gradient descent`.

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/197db08dfd1c6c9468107d4c24a35234.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Để tính toán các đạo hàm của hàm mất mát theo từng biến `W` và `b`, ta sử dụng quy tắc tính đạo hàm của hàm số hợp như sau:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/30a1b23a77916951aaf216e53ceb1542.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Code hàm Backpropagate:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/e3ad28c8cf81dd1c0dbaeb16e1f77072.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Để có thể hiểu rõ hơn nữa về quá trình backpropagate và các tính toán đằng sau nó, các bạn nên xem video này:

<div class="youtube-container">
    <iframe src="https://www.youtube.com/embed/tIeHLnjs5U8" frameborder="0" allowfullscreen></iframe>
</div>

#### Tổng hợp lại

Vậy là mạng neural 2 lớp đã được xây dựng xong, cũng không quá phức tạp phải không. Giờ ta sẽ chạy thử nó với một ví dụ đơn giản:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/95e45a0bf6717825a6770b56bee22a19.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Ta có một tập hợp đầu vào `X` và đầu ra `Y` như trên. Ta sẽ bắt đầu quá trình huấn luyện với 1500 vòng lặp của các bước `feedforward - backpropagate` và xem biểu đồ biến thiên của hàm mất mát:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/7cf9e5d1155085493585753787dfcec6.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Sau khi đã học xong, với mỗi đầu vào theo thứ tự trên ta có đầu ra ŷ như sau:

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/06/24/5ec4357674b15aa963d88439f47a3ec8.jpg"
    alt="Neurol network, mạng nơ ron"/>
</div>

Khá tốt phải không. Mỗi dự đoán `ŷ` đã ở rất gần so với mong muốn `y` rồi. Vậy là mạng neural đã được huấn luyện thành công. Hy vọng các bạn học được nhiều điều mới qua bài viết này :D.