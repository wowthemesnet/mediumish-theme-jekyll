---
layout: post
title:  "Web Mission2 - 회전목마, carousel 구현하기"
authors: [MOBUMIN]
tags: ["Web"]
image: assets/images/post-WEB-Mission2/01.clone.PNG
description: "Git 생초보 분들께 추천드리는 포스트."
featured: false
---

WEB 팀의 Mission2는 아래 링크된 사이트를 clone하는 것입니다! Mission 제작하느라 고생하셨을 웹 스터디 팀의 형진님께 박수를 보냅니다👏👏

> <https://patbuomo.cargo.site/>

[형진님의 미션이 궁금하시다면 이곳을 클릭해주세요.](https://www.notion.so/2-Mission-Clone-using-Carousel-af5c2b2aad87451c91b022f47c005f04){: target="_blank"}

미션 페이지에서도 알 수 있듯, 이번 미션의 목표는 아래와 같습니다.

1. 주어진 웹사이트와 동일한 형태와 내용
1. 주어진 사진 4장으로 2개의 carousel 배치
1. Github Pages로 배포

지금부터 기억을 더듬으며 제가 만들었던 과정을 적어볼까 합니다.

## position:fixed

주어진 웹사이트의 가장 위에는 Pat Buomo ㅡ Curator, Journalist 라는 글자가 **고정**되어 있습니다. 스크롤을 내려도 그 자리에 유지되고 있죠.

해당 요소는 css에서 `position:fixed`로 쉽게 고정이 가능했습니다.

```css
header{
    position:fixed;
    width: 100%;
    height: 80px;
    top:0; left:0;
    text-align: center;
    font-size:1.5rem;
    color: rgba(0, 0, 0, 0.75);
    z-index: 1;
}
```

저는 이 요소에 조금 다른 효과도 주고 싶었어요. 범위에 들어오면, 글자가 바뀌면서 메뉴가 나오게 하도록요!

이것은 아주 간단한 js로 해결이 가능합니다.

먼저 html에서 내가 해당 기능을 넣고자 하는 div에 `onmouseover="함수이름()" onmouseout="함수이름()"` 을 넣어주고, js에서 아래처럼 해줍니다.

```javascript
var menutxt=document.getElementsByClassName("menu-text");
var nav=document.getElementsByClassName("nav");
function on_menu(){
    menutxt[0].style.display="none";
    for(var i=0;i<nav.length;i++)
        nav[i].style.display="block";
}
function off_menu(){
    menutxt[0].style.display="inline";
    for(var i=0;i<nav.length;i++)
        nav[i].style.display="none";
}
```

이 부분을 만들 때, jQuery를 쓰다가 자꾸 알 수 없는 오류가 나지 뭐에요. 그래서 제이쿼리를 버리고 순수 js로 갈아탔습니다.

그러면서 처음 알게 된 점이, `document.getElementByClassName("")`은 배열 형식으로 target을 받아온다는 것이었습니다. 이거 때문에 삽질을 많이 했었어요.

위의 코드대로 하면, 마우스가 div 안에 들어오게 되면, `on_menu()` 함수를 동작하게 됩니다. 반대로 div 밖에 있다면, `off_menu()` 함수를 동작하게 됩니다.

이렇게 상단의 고정된 요소 배치에 끝났으면, 가장 큰 부분인 캐러셀(carousel)을 구현할 차례입니다.

## Carousel 구현하기

Web 팀의 형진님이 참고하셨다는 사이트를 저도 참고했습니다.

> <https://www.w3schools.com/howto/howto_js_slideshow.asp>

위의 사이트에서는 carousel이 하나인 경우와 여러개인 경우 모두 설명해주고 있습니다. 사이트에 나온 대로 따라하면 그냥 구현이 되는 수준입니다. 좋은 사이트 공유해주신 형진님께 감사드립니다. 헤헤😊

위의 링크를 참고하여 작성한 코드는 아래와 같습니다.

```javascript
/* arrow */
var left=document.getElementsByClassName("prev");
var right=document.getElementsByClassName("next");
var left2=document.getElementsByClassName("prev2");
var right2=document.getElementsByClassName("next2");
function on_arrow(){
    left[0].style.display="block";
    right[0].style.display="block";
    left2[0].style.display="block";
    right2[0].style.display="block";
}
function off_arrow(){
    left[0].style.display="none";
    right[0].style.display="none";
    left2[0].style.display="none";
    right2[0].style.display="none";
}

/* carousel */
var slideIdx=[0,0];
var slideID=["slide","slide2"]
showSlides(0,0);
showSlides(0,1);

function plusSlides(n, no){
    showSlides(slideIdx[no] += n, no);
}
function showSlides(n, no){
    var i;
    var x = document.getElementsByClassName(slideID[no]);
    if (n > x.length-1) {slideIdx[no] = 0}
    if (n < 0) {slideIdx[no] = x.length-1}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
  x[slideIdx[no]].style.display = "block";
}
```

이렇게 바로 사이트가 쨘 완성되었으면 좋았겠지만, 저는 이 carousel을 구현할 때 문제점에 봉착했습니다.

클론할 사이트처럼 화살표가 아닌 다른 곳을 클릭하더라도 슬라이드가 넘어가도록 `plusSlides`를 슬라이드를 감싸고 있는 div에도 줬더니, 오른쪽 화살표는 슬라이드가 두 장씩 넘어가고 왼쪽 화살표는 먹히지 않는 문제가 있었어요.

이 issue로 오랫동안 애먹었는데, 문제점과 해결방안을 제시해주신 **형진님** 덕분에 정말 간단하게 해결할 수 있었습니다.

`plusSlides`를 arrow와 슬라이드를 감싸고 있는 div에 줬을 때, 범위가 겹쳐 버려서 함수가 두 번 적용되어 이런 문제가 생기고 있었던 것이었습니다.

그래서 간단하게, arrow를 div 밖으로 빼주고 먼저 선언해주었더니 해결이 되었습니다.

[제가 만든 클론 페이지가 궁금하시다면 이곳을 클릭해주세요!](https://mobumin.github.io/DSC-web/missionpage/mission2.html)

## 마치며

Mission 2까지 완수하면서, 이론적으로만 대충 사용할 줄 알았던 html, css, js를 실전에서 사용해볼 수 있었습니다. 아직도 걸음마도 못 뗀 수준이지만, 강의만 듣던 때보다는 미션을 해결하면서 비약적인 성장을 이룬 것 같아요.

현재는 Mission3을 진행중인데, Mission3 미션 페이지를 보자마자 아직 멀었다는 것을 깨달을 수 있었습니다.

웹 프론트엔드 & 백엔드 개발자가 되기 위해서 열심히 해야겠다는 생각이 듭니다. 웹 팀 다 같이 힘내봐요!🙌
