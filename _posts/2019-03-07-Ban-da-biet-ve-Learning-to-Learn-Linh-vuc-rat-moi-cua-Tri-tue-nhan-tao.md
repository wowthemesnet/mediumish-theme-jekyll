---
id: loda1551933570178
layout: post
title: Bạn đã biết về "Learning to Learn" - Lĩnh vực rất mới của Trí tuệ nhân tạo?
author: loda
categories: [ Machine Learning, deep learning, neural network ]
image: https://cdn.ereka.vn/2018/04/09/c2958b20690f5b747b1fab63d9a488df.png
description:  Dữ liệu dán nhãn không luôn luôn có sẵn đối với mọi tác vụ, và chi phí để có thể thu thập một lượng dữ liệu dán nhãn đủ là rất đắt đỏ.
featured: false
hidden: false
rating: 0
---

Trong những năm qua, lĩnh vực *Trí tuệ Nhân tạo* nói chung và *Machine Learning* nói riêng đã đạt được rất nhiều thành công nổi bật, đặc biệt là khi có sự xuất hiện của *Deep Learning*. Tuy vậy, vẫn tồn tại một vấn đề rất lớn mà các nhà nghiên cứu trong lĩnh vực Trí tuệ Nhân tạo phải đối mặt, đó là các thuật toán Machine Learning đòi hỏi một lượng dữ liệu dán nhãn cực lớn, Deep Learning còn đòi hỏi một lượng dữ liệu lớn hơn nhiều lần. Dữ liệu dán nhãn không luôn luôn có sẵn đối với mọi tác vụ, và chi phí để có thể thu thập một lượng dữ liệu dán nhãn đủ để có thể training các thuật toán một cách tốt nhất là rất đắt đỏ.

Vì thế mà đã có nhiều nghiên cứu được thực hiện và một số phương pháp được đề xuất để phần nào đó giải quyết vấn đề nan giải này. Những phương pháp này thường được gọi là *“Learning to Learn”*:

#### Transfer Learning

Trước tiên, hãy nói về `Transfer Learning`, một khái niệm dường như phổ biến, được nhiều người biết đến hơn. Trong hội thảo `NIPS 2016`, *Andrew Ng* đã nhận định rằng Transfer Learning, sau Supervise Learning, sẽ là động lực chính để định hướng cho sự phát triển của Machine Learning trong tương lai.

<div class="wrapper-center">
    <img src="https://cdn.ereka.vn/2018/04/09/c2958b20690f5b747b1fab63d9a488df.png" alt="Machine learning, learning to learn, transfer learning"/>
</div>

Khái niệm Transfer Learning được nhắc đến lần đầu tiên tại workshop có tên là “Learning to learn”, bàn về những phương pháp Machine Learning cho phép lưu giữ và tái sử dụng những thông tin thuật toán đã học được, trong hội thảo NIPS-95. Kể từ đó, Transfer Learning thu hút ngày càng nhiều sự chú ý. Ý tưởng chung của Transfer Learning là chia sẻ các kiến thức mà hệ thống AI đã nhận được từ quá trình training của tác vụ/domain gốc (source) sang cho một tác vụ /domain mục tiêu (target).

#### Multitask Learning

*Multitask Learning* được phân chia như là một nhóm nhỏ trong Transfer Learning. Tuy vậy, không phải nhà khoa học nào cũng đồng ý với sự phân biệt này, một số coi Multitask Learning và Transfer Learning là những khái niệm tương đồng.

Sự khác biệt lớn nhất ở đây là trong Transfer Learning, có sự phân biệt giữa tác vụ/domain gốc và tác vụ/domain mục tiêu. Mà trong đó, tác vụ/domain mục tiêu có vai trò quan trọng hơn. Trong Multitask Learning, các tác vụ/domain có vai trò bình đẳng hơn.

#### Meta Learning

*Meta Learning* là một thuật ngữ xuất phát từ lĩnh vực Tâm lý Xã hội với định nghĩa gốc là _“the process by which learners become aware of and increasingly in control of habits of perception, inquiry, learning, and growth that they have internalized”._

Nói một cách ngắn gọn, Meta Learning được dùng để chỉ việc con người nhận thức và làm chủ được quá trình tiếp thu kiến thức của mình.



=> `Learning to Learn` vẫn còn là một lĩnh vực rất mới trong Trí tuệ Nhân tạo. 03 phương pháp tiếp cận được nêu trên cũng chỉ là những đại diện nổi bật nhất của Learning to Learn.



Thông tin ở bài viết trên đây được tham khảo từ nguồn `Tạp chí AI`.