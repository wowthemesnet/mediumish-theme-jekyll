---
layout: post
title:  "Team blog - 초심자라면 추천하는 공부들"
authors: [hyehyeonmoon]
tags: ["Git"]
image: assets/images/post-practice/practice-title.PNG
description: "PR리뷰를 위해 처음부터 끝까지 경험해보기"
featured: true
---

## Intro

 처음 "PR"이란 단어도 들었고, 처음 Visual Studio Code도 깔아봤다. Github으로 처음 협업을 해보는데 좀 재밌다..ㅎㅎ 역시 기초를 공부할 때가 가장 재미있는 것 같다.  

 요구된 공부를 다 하고 드디어 PR Review를 할 수 있나 싶었는데 막상 보니까 잘 모르는 게 많았다. 뭔가 잘못 건드려서 꼬이는 순간 걷잡을 수 없이 커질 것 같아 직접 PR을 날리고 내 PR을 내가 리뷰해 보는 과정을 해보기로 했다. 이게 마음이 편하다....

## Course

 여기까지 오는데 간단하게 겪었던 과정들을 이야기해 보려 한다.  
 크게 두 가지 과정으로 나눌 수 있다. 하나는 Blog 운영을 위한 공부이며 다른 하나는 PR Review를 하기 위한 공부이다.

### 1. Blog 운영

Html&CSS에 대해 기본적인 개념을 공부해야 했다. 생활코딩으로 첫 시작을 하면 좋다고 하셔서 생활코딩에서 "Html&Internet"과 "CSS" 과정을 1.5배속으로 들었다.^^ Atom도 깔아보고 Wamp도 깔아보면서 실습까지 함께 하니 그동안 언뜻 보았던 코드들이 무엇을 의미하는지 알 수 있었고, 개념도 확실히 이해할 수 있었다.  

하지만 실제로 Jekyll을 설치하고 블로그를 꾸민다거나 이슈를 찾으려 하니 "음... 그래서 어떻게 하지..?"하는 생각이 들면서 아직 부족함을 느꼈다. 그래서 Jekyll을 이용해 개인 블로그를 만들어 보기로 스스로 결정했다. 직접 만들어 보면 분명 더 구조와 방식을 잘 이해하고 이것이 UOS DSC 블로그 운영에 분명 도움이 될 것이다.

- 생활코딩
  - [Html&Internet](https://opentutorials.org/course/3084)
    - Atom Install
    - 태그란
    - 여러 태그 공부
    - 웹서버 운영(Bitnami-Wamp install)
  - [CSS](https://opentutorials.org/course/3086)
    - CSS의 등장
    - 속성과 선택자
    - 박스모델
    - 그리드
    - 반응형 디자인과 미디어 쿼리
    - 코드의 재사용
- Jekyll 블로그 만들어보기
  - Jekyll 설치
  - [포스팅 따라해보기](https://velog.io/@shg4821/%EA%B9%83%ED%97%88%EB%B8%8C-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-1)

### 2. PR Review

PR Review를 하기 위해서는 우선 Git과 Github에 대한 기본적인 이해와 PR을 날리는 방법에 대해 알아야 한다. 이전에 Github는 많이 이용해 봤기 때문에 Markdown이나 Github Desktop을 이용하는 것은 문제 되지 않았다.  

하지만 Github로 제대로 된 협업을 하는 것은 이번이 처음이었기에  PR이라는 용어조차 생소했다. 그래서 수빈 님이 친절히 알려주신 PR 날리는 법 강의를 다시 보며 구글링을 통해 PR의 개념에 대해 공부했다. 모든 공부가 끝나고 이제 드디어 PR Review를 할 수 있을 줄 알았는데... 웬걸 막상 하려 하니 감이 안 잡혔다.  

그래서 직접 PR을 작성해서 날리고 수정해보고 블로그에 올리는 과정을 경험해 보기로 했다. 그리고 현재 여러 번 피드백을 받으며 고치는 과정 중에서 이론으로 배웠던 것보다 훨씬 많은 것을 알게 되었고 (감히 말하건대..) PR Review를 할 수 있을 것 같다!

- [Git Pro book](https://git-scm.com/book/ko/v2)
  - Chapter1~3
    - Git의 역사와 기초
    - Git의 기초
    - Git 브랜치
- PR 날리기
  - [PR 개념공부]("https://wayhome25.github.io/git/2017/07/08/git-first-pull-request-story/)
  - Visual Studio Code Install
  - Github Desktop Install
  - [Markdownlint Install]("https://github.com/DSC-University-of-Seoul/2021-spring-web/blob/main/CONTRIBUTING.md)
  - 수빈 님의 친절한 DSC Blog Team.pptx 정독
  - 유현 님의 친절한 "PR은 어떻게 하는가?" 강의 다시듣기
- 직접 PR 날리고 PR 리뷰해보기

## 느낀 점

위의 공부 시간들을 합치면 (PR 완성까지 합치면) 이틀 좀 넘게 한 것 같다. 새로운 개념들이 많이 들어오고 설치도 많이 했는데 내용이 어렵지 않아서 오히려 재미있었다. 아직 Blog 운영은 생활코딩 강의와 실습으로는 잘 모르겠다. PR을 직접 한 것과 같이 블로그를 직접 만들어보면 많이 알 수 있을 것 같다.  

이번 공부 과정을 통해 배운 가장 큰 수확은 PR을 날릴 수 있다는 것과 VScode로 Markdownlint 사용해서 md파일 작성하하는 것이 너무 편하다는 것을 배운 것이다. 👍
