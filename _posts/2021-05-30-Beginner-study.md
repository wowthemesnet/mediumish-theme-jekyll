---
layout: post
title: "Beginner Study"
authors: [gganada]
tags: ["Web"]
image: assets/images/post-Beginner-study/main.gif
description: "Web 비기너의 2달동안 성장과정"
featured: false
---

이 포스트에서는 웹린이가 두달간 학습하며 만들었던 간단한 웹페이지를 소개해드리고자 합니다.
[NyanCat_Party](https://gganada.github.io/JH_WebStudy/)
에서 보실 수 있습니다.

## 만든 목적

`2021-spring-web-beginner` 팀에서 [생활코딩](https://www.opentutorials.org/course/3084)
를 보며 웹에 대해 학습하였고, 실제로 만들어 보면서 학습하면 도움이 된다고 판단하여 조금씩 만들어 봤습니다.

## 기능 소개

주요 기능들에 대해서 설명하도록 하겠습니다.

### 1. PaRtYtImE! 버튼

이 기능을 만들기 위해서 가장 공을 들였습니다. `partytime` 버튼을 누르게 되면,
메인 페이지의 배경화면이 투명해지고, 틱마다 배경의 고양이들의 크기와 배경색이 랜덤으로 바뀝니다.
또, 좌측 고양이의 점프 속도가 빨라지며, 가운데 고양이가 회전합니다.

[main.gif](../assets/images/post-Beginner-study/main.gif)

`partytime()` 이벤트가 실행되면, 점프하는 고양이(`box`)의 애니메이션 시간이 짧아져, 점프 속도가 빨라집니다.
메인 페이지(`sodyd`)의 배경색을 투명하게 만들어 뒤의 고양이 배경이 보이게 됩니다.
그리고, 틱 이벤트를 발생시키는 `randColor()`이벤트를 발생시킵니다.

아래는 `partytime` 버튼을 누르면 실행되는 `partytime()`의 코드입니다.

```javascript
function partyTime() {
    if (letsparty) {
        letsparty = 0;
        document.getElementById('box').style.animationDuration = '2s';
        if (currentColorMode == 'black') {
            document.getElementById('sodyd').style.backgroundColor = 'rgba(31,32,35,1)';
        }
        else if(currentColorMode =='white'){
            document.getElementById('sodyd').style.backgroundColor = 'rgba(255,255,255,1)';
        }
        document.getElementById('partytime').value = 'PaRtYtImE';

    }
    else {
        document.getElementById('partytime').value = 'StopParty';
        letsparty = 1;
        document.getElementById('box').style.animationDuration = '0.3s';
        document.getElementById('sodyd').style.backgroundColor = 'rgba(0,0,0,0)';
       
        randColor();
        

    }
    menuUpdate();
}
```

`randColor()` 이벤트에서는, 배경색을 바꾸고, 배경 이미지의 크기를 변경합니다.
이후 고양이를 -0.05rad 회전시키고 다시 함수를 실행시킵니다.

아래는 `randColor()` 코드입니다.

```javascript
function randColor() {
    
    document.querySelector('body').style.backgroundColor = '#' + Math.round(Math.random() * 0xFFFFFF).toString(16);
    document.querySelector('body').style.backgroundSize = Math.floor((Math.random() + 0.1) * 300) + 'px';
    partyRot = partyRot - 0.05;
    rot = partyRot;
    RotUpdate();


    setTimeout(function () {
        if (letsparty) {
            randColor();
        }
    }, 5);
}
```

### 2. 회전 고양이

회전 고양이는 아래 GIF와 같이 고양이가 마우스를 보는 고양이입니다.

[rotate.gif](../assets/images/post-Beginner-study/rotate.gif)

고양이의 각도는 코사인법칙을 이용하여 구현하였는데, 각도를 구하는 코드는 다음과 같습니다.

```javascript
     rot = Math.acos((event.clientX - lef) / (Math.sqrt(Math.pow(event.clientX - lef, 2) + Math.pow(event.clientY - topp, 2))));
```

이때 `rot`은 고양이의 각도이고, `event.clientX`, `event.clientY`는 마우스의 x, y 좌표입니다.
`lef`, `topp`는 고양이의 x, y 좌표입니다.

마우스의 좌표를 `A`, 고양이의 좌표를 `B` 라고 할 때, 아래 그림과 같은 직각삼각형이 만들어집니다.
고양이를 회전시켜야 하는 각을 `X` 라고 하면, 다음과 같은 식이 성립합니다.

[tri.png](../assets/images/post-Beginner-study/tri.png)

```javascript
     rot = Math.acos((event.clientX - lef) / (Math.sqrt(Math.pow(event.clientX - lef, 2) + Math.pow(event.clientY - topp, 2))));
```

## 맺음말

비기너 팀에 들어와 아무것도 모르는 상태에서 두 달간 웹을 공부해보았습니다.
공부하면서 느낀점은 제가 디자인 감각이 매우 구리다는 것입니다...^%^
지금 공부하고 있는 node.js로 서버 열기 부분을 어느정도 학습한 후에는 c++ graphics에 대해 학습해보고 싶습니다.
