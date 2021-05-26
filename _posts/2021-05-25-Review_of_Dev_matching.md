---
layout: post
title:  "프로그래머스 데브매칭 후기"
authors: [hyehyeonmoon]
tags: ["Deep Learning"]
image: assets/images/post-Review-of-Dev-maching/dev_matching.PNG
description: "비전 초보자의 3일 동안의 고군분투기"
featured: true
---

## Intro

5월 23일에 열린 프로그래머스 "Dev-Matching 머신러닝 개발자"에 참여했다. 과제는 이전에 공지되었던 대로 이미지 분류 문제였고, 8시간 안에 결과를 제출하는 것이었다.  
결과적으로 공개 리더보드에서는 92.857로 75등, 파이널 리더보드에서는 89.143으로 97등을 하였다. 그리고 불합격... ㅎㅎㅎ  
그래도 많은 것을 겪었고 느낀 게 많았기 때문에 좋은 경험으로 남았고 이에 관해서 이야기해 보려 한다.

## 시작

시작은 유현님이었다. Dev-Matching 공지를 보았지만, 자연어처리를 주로 공부해 왔고 모델 하나 제대로 돌려본 경험이 없는 내가 이미지 과제를 제대로 할 수 없다고 생각해 지원하지 않았었다. 그러던 중 유현님께서 공지를 알려주시면서 도전해보라 하셨다. 안 하는 것보다 하는 게 낫다고 하시면서 권해주셨다.  

그래서 그 뒤로 진지하게 고민을 하다가 승현님에게 도달하게 된다. 승현님께서 감사하게도 이미지 과제를 하는데 도움이 되는 모델, 사이트 등을 정리하신 것들을 공유 해주시고 설명도 해주셨다. (Kaggle 팀의 10시 모각코에서는 코딩 말고도 많은 일이 일어나지요.^^ )  

그래서 두 분 덕분에 용기를 얻었고 5월 21일부터 본격적으로 공부하기 시작했다.  

## 2일 간의 여정

### 참고자료

이틀 동안 다음 세 가지 자료를 중점적으로 공부했다.  
최종 목표는 Multi-label clasification, Multi-class classification 두 task를 모두 다룰 수 있고, Efficient Net+OOF를 task에 적용하는 것이었다.

1. [Daycon Multi-label Resnet101+OOF](https://dacon.io/competitions/official/235697/codeshare/2368?page=2&dtype=recent)
2. [Programmers Dev Matching_승현님 Notion](https://www.notion.so/Programmers-Dev-Matching-f8b984920e4b48e38fbf4d763dd3ede6)
3. [김윤수 분의 MNIST kaggle](https://github.com/tobigs-datamarket/tobigs-14th/blob/master/7wk_%EC%8B%A0%EA%B2%BD%EB%A7%9D%EC%8B%AC%ED%99%94/%EC%8B%A0%EA%B2%BD%EB%A7%9D%EC%8B%AC%ED%99%94_14%EA%B8%B0%20%EA%B9%80%EC%9C%A4%EC%88%98.ipynb)

### Multi-label Resnet101+OOF

이미지는 MNIST를 CNN, Resnet으로 분류한 경험이 다이다. 진짜 이게 끝이다. 그래서 막막했다.  
그래서 이 자료를 보았을 때 이해가 거의 안 됐다. 심지어 dataset, dataloader의 작동방식도 거의 잊었었다.  

class, def 하나하나 해체해서 코드를 모두 실행시키고 실행 결과를 보면서 코드의 흐름을 이해했고, 모르는 개념은 모두 구글링을 했다.  아래는 공부하면서 찾은 개념들과 사이트를 정리해 놓은 것이다.  

- [이미지 데이터는 어떻게 불러오지?](https://data-panic.tistory.com/13)
- [Transform에 대해 이해해보자](https://www.notion.so/OOF-6e6c1009f835412198e9554f564effc9#389aa52162f24128b7d375c94512263d)
- [왜 Normalize는 벡터가 3차원인가](https://discuss.pytorch.org/t/understanding-transform-normalize/21730)
- [Normalize는 무슨 역할을 수행하는가](https://mjdeeplearning.tistory.com/81)
- [Normalize는 왜 정규화를 특정 숫자로 해주는가](https://www.notion.so/OOF-6e6c1009f835412198e9554f564effc9#2e73ebfec1b449a9a2b11beecb00a0f0)
- [data_loader에서 num_workers는 왜 지정하는가](https://www.inflearn.com/questions/25485)
- [nn.DataParallel은 어느 때에 쓰는것인가](https://tutorials.pytorch.kr/beginner/blitz/data_parallel_tutorial.html)
- [scaler=Gradscaler()란 무엇인가?](https://www.notion.so/OOF-6e6c1009f835412198e9554f564effc9#499b2b75d6024774a220293abdfb9245)
- [왜 pretrained model의 output shape은 항상 (1000,1,1)인가?](https://www.notion.so/OOF-6e6c1009f835412198e9554f564effc9#378deda590a74af9976114ae09c4cf64)

처음에는 생소하고 막막했고 시간도 오래 걸렸지만, 위의 과정들을 모두 지나고 나서 특정 코드가 왜 쓰이고, 어떻게 작동하며, 어디에서 사용이 되어야 하는지 보이기 시작했다.  이때부터 희망이 보이기 시작했다.

### 승현님 Notion

승현님께서 Dev-Matching을 준비하시면서 각종 모델과 사이트를 정리한 Notion이다. 이 곳에서 Pretrained Efficient Net과 Pretrained CLIP Model 사용법을 알 수 있었다.  
(혼자 공부했다면 절대 알지 못했을 고급 자료들과 정보를 공유해주셔서 정말 감사하다.)

- Pretrained Efficient Net

```Python
!pip install efficientnet_pytorch
from efficientnet_pytorch import EfficientNet


class CustomModel(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.feature_extractor = EfficientNet.from_pretrained('efficientnet-b5')
        self.classifier = nn.Linear(1000, 26)

    def forward(self, x):
        x = self.feature_extractor(x)
        x = self.classifier(x)

        return x

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = CustomModel().to(device)
# print(summary(model, input_size=(1, 3, 256, 256), verbose=0))
```

- Pretrained CLIP Model

```Python
import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

image = preprocess(Image.open("CLIP.png")).unsqueeze(0).to(device)
text = clip.tokenize(["a diagram", "a dog", "a cat"]).to(device)

with torch.no_grad():
    image_features = model.encode_image(image)
    text_features = model.encode_text(text)
    
    logits_per_image, logits_per_text = model(image, text)
    probs = logits_per_image.softmax(dim=-1).cpu().numpy()

print("Label probs:", probs)  # prints: [[0.9927937  0.00421068 0.00299572]]
```

### MNIST Classification의 좋은 코드

정말 정말 능력자이신 분께서 작성하신 코드로 알고 있다. 코드를 보는 내내 감탄이 나왔다. 사용하기 편하게 코드가 작성되었고, Jupyter Notebook으로 되어 있어 가독성이 매우 좋다.  

다만, 데이터를 직접 적용하면서 코드를 하나하나 살피기에 시간이 부족해서 전체적으로 코드를 훑으면서 좋다고 생각되는 코드들을 차용하여 사용했다.

## 끝없는 오류

### 로컬에서 GPU 돌리기

이제까지 Colab만 사용해 왔다. 하지만 Colab의 경우 Google Drive에 용량이 큰 파일을 올리는 데 시간이 오래 걸리기 때문에 local에서 gpu를 돌리려 했다. 시작은 미세하였고 오류는 창대했다. 제대로 돌리기까지 8시간이 걸렸다...  
(~~anaconda 가상환경을 사용하였는데 경로 오류 너무 싫다. 앞으로 docker도 사용해야 하는데 나만 경로 오류 싫은가...~~)

1. GPU Driver는 최신 것으로 업그레이드  하자.  
딥러닝에 사용되는 GPU는 대부분 NIVIDA 제품인 것으로 안다. 이 [페이지](https://www.nvidia.co.kr/Download/index.aspx?lang=kr)에 간다면 아주 친절하게 제품에 맞는 것을 다운받을 수 있었다.

2. Window에서는 cuda와 cudnn을 다운로드 받아서 설치해 주어야 한다.  
"!pip install" 만 계속 하면서 "왜 안되지.."하다가 알아내었다. 아래 두 사이트들이 매우 친절하게 잘 가르쳐준다. 나는 PyTorch를 쓰는데 Tensorflow로 안내하는 것을 따라가도 되나? 싶으면 cuda의 경우 상관없이 모두 잘 돌아간다고 한다. (이거 때문에 또 삽질했던 경험이...)

    -[Tensorflow와 호환되는 CUDA, cuDNN 설치하는 법](https://coding-groot.tistory.com/87)  
    -[윈도우에 PyTorch 설치, GPU 설정, 자세하게](https://chancoding.tistory.com/90)  

3. Visual Studio Code 재부팅 꼭 하자.
위의 과정을 모두 완료했음에도 오류가 뜬다. 성공했다 생각하고 간식 먹고 돌아오니까 torch.cuda.is_available()=True 에서 False가 된 순간도 있었다. library를 새롭게 설치했거나 외부에서 무언가 관련된 것을 다운로드 받았다면 항상 재부팅을 하자.

4. 그래도 오류가 뜨는가? Python, cuda, cudnn, 라이브러리 버전을 항상 체크하자.
5. 그래도 오류가 뜬다고? pip install과 conda install의 혼용이 무언가 문제를 일으켰을 수도...

### Memory 문제

데스크톱을 사용했고 RAM 16 Giga, GPU는 Nivida gegorce gtx 960 1개이었다. 꽤 괜찮다고 생각했고 그래서 로컬에서 GPU를 돌리려 했었다. 그렇지만 매우 오산이었다.  

이제까지 용량이 큰 데이터를 다루어본 적 없던 것이 화근이었던 건가. 학습시키려 시도했던 것은 "Daycon Multi-label Resnet101+OOF"의 코드였고 3Giga의 image train set을 가졌으며 Resnet101이었다. Daycon 게시된 코드를 보면 GPU만 4개인 것이 보이는데 어떻게든 GPU 1개로 해보겠다고 정말 많은 시도를 했고 실패했다.  

이 일을 계기로 딥러닝 실행에 있어 중요한 문제인 Memory를 인식하게 되었고, epoch, batch_siz 등의 값에 따라 시간과 용량이 얼마나 달라지는지를 감을 잡을 수 있었다.

- [RAM, CPU, GPU는 무슨 일을 하는가](https://deepinsight.tistory.com/103)  
- [용량에 문제가 생겼다면 batch size를 줄여라](https://towardsdatascience.com/how-to-break-gpu-memory-boundaries-even-with-large-batch-sizes-7a9c27a400ce)

## 결전

5월 23일 Dev-Matching이 열렸고 널널할 줄 알았던 8시간은 예상하지 못한 오류, 아직 익숙하지 않은 코드 등등으로 시간이 촉박했다. 그래서 제출을 아예 못 할 수도 있겠다고 절망했다.

하지만 시간 내에 제출을 할 수 있었고 100등 안에 들 수 있었다. 물론 아쉬운 점은 많이 남았다. 그중 이 4가지가 가장 아쉬웠다.  

- Augmentation을 Normalization 이외에 적용하지 않은 것
- epoch을 30~50으로 더 많이 돌리지 못한 것
- Best model을 .pth로 save 하는 코드를 다듬지 못한 것  
- Clip model 적용을 안 한 것(쓰면 바로 100점 나온다고 한다....ㅠㅠ)

## 소감

이틀 동안 합쳐서 5시간 잔 것 같다. 공부한 시간 반절, 오류 잡는 시간 반절이었다. Dev-Matcing을 끝낸 소감은 아래와 같다.

- 계속해서 생기는 오류를 하나하나 다 찾아가면서 어떻게든 해결하는 과정을 반복하면서 개발분야의 어려움을 확실히 겪었던 것 같다. (~~그래도 오류 해결할 때의 짜릿함은 꽤 컸다~~)
- 이렇게 집중해서 오랫동안 코딩을 한 적은 처음인 것 같다. 사실 엄청 힘들지 않았고 "실행시켜야 해"라는 생각만 갖고 있었던 것 같다. 그래서 개발 적성을 완전히 맞지 않는 건 아니구나 하고 느꼈다.
- Clone coding과 자료수집의 중요성을 알았다. Clip model 하나와 좋은 코딩자료 하나만으로도 높은 성과를 낼 수 있었을 것 같다.
- 딥러닝에 대해서 어려운 것, 코드를 잘 짜야 되라는 압박으로 이제까지 계속해서 돌려보는 것을 미루어 두었던 것 같다. 이제는 자신감이 생겨서 마음에 드는 구조를 직접 짜서 AI 대회에 나가 높은 성능을 내고 싶어졌다.
