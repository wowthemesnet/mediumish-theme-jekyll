---
layout: post
title:  "Issues 템플릿을 만들면 재사용이 되더라고"
author: bomber
categories: [작업 환경]
tags: [GitHub, 사이트구축, 가나다라마바사아자차카타파하]
image: assets/images/github-issue-templates/recycle-237874_1280.jpg
image-caption: 이미지 출처 <a href="https://pixabay.com/ko/users/imordaf-117056/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=237874">imordaf</a>
description: "GitHub 이슈로 질문 게시판 만들었는데, GitHub 디스커션으로 갈아타야 했던 썰"
featured: false
hidden: false
toc: true
comments: true
rating: # 1~5까지 점수
last_modified_at: # YYYY-MM-DD
---

앞서 도서 지원 사이트로 GitHub을 쓰기로 했다고 결정한 바 있다. 
왜 그랬는지 궁금하다면 아래 포스트 참고하자.

* <a href="{{ site.baseurl }}/github/" target="_blank">도서 지원 사이트로 GitHub을 쓴다고?</a>

작업하는 책이 대부분 IT 관련서이고 소스코드나 다운로드 파일을 제공해야 한다는 점, 변경된 내용을 독자 스스로가 watch 할 수 있다는 면에서 이만한 툴도 없다는 생각이었는데, 사실 도메인 연결이 무료라는 점이 크게 작용한 것도 사실이다. 어쨌거나 그렇게 결정한 이상 툴의 능력을 최대한 끌어내는 것은 엔지니어의 도리. 그래서 바로 GitHub에 제공하는 Repository Template 기능을 써 보기로 했다.

## 재사용은 코드만 하는 게 아니야 GitHub Template

템플릿이 뭐냐고 묻는다면 초등학생에게는 플라스틱 모양자를, 어르신에게는 붕어빵 틀이라고 설명하겠다. 그밖의 연령대는 대충 뭔지 알테니 굳이 설명하지 않아도 될 듯. 심지어 문과냐 이과를 막론하고 칼퇴근을 바라는 직장인은 템플릿(template) 신공을 쓴다. 심지어 사회 초년생도 자기 소개서, 이력서 템플릿을 활용할 정도이니 실로 생산성을 극대화할 수 있는 궁극의 비기임은 틀림없다.

GitHub는 개발자의 창의성과 개방성이 극대화된 <del>복붙의</del> 메카이자 성지다. <del>(그 말이 그 말이다.)</del>
그래서인지 GitHub Repository도 템플릿을 만들면 같은 형태의 Repository를 얼마든지 찍어낼 수 있다.  아래는 번역서를 작업할 때마다 관련 파일을 관리할 Repository를 찍는 템플릿이다.   

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/template.png" alter="template">

대충 살펴봐도 별 것 없다. 특이한 게 있다면 docs는 GitHub Pages로 정적 웹 사이트를 만들 때 사용할 폴더, .github 숨김 폴더는 GitHub이 내부적으로 쓸 파일을 두는 곳 정도다. 여기서 .github 폴더 아래를 보면 눈치챘겠지만 내가 템플릿으로 재사용하고 싶었던 건 다름아닌 Issue Template다. 

## Issues 있슈?

Issue란 사전적 의미로 '주제, 안건, 쟁점, 사안' 등의 의미인데 한 층 더 추상적으로 말하자면 '걱정거리가 디는 문제' 정도가 되겠다. 소프트웨어에서 걱정 거리는 뭘까? 대체로 버그로 인한 오동작일테고, 그밖에는 사용하면서 궁금한 점, 쓰다보니 별견되는 개선할 점등이 되겠다. 그래서 이런 이슈를 관리하는 시스템을 ITS(Issue Tracking System), BTS(Bug Tracking System)이라고 부른다. <dev>방탄 아니다.</del>

책도 소프트웨어와 비슷해서 책이 릴리스된 후에는 오탈자도 나오고, 질문도 들어오고, 제안을 받기도 한다. 그래서 이슈 관리 시스템은 제품 유형을 떠나서 피드백을 받을 수 있는 가장 기본적인 접점이 된다. 아래는 기본 이슈 설정을 책의 사후 관리에 맞게 커스텀한 것이다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-000.png" alter="issues-000">

이슈 형태는 얼마든지 만들 수 있으나 종류가 너무 많아지면 어디에 입력을 해야할 지 난감할 수 있으므로 직관적으로 구분되는 범위에서 큰 덩어리를 만들 필요가 있다. <del>지금도 많은데?</del>

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-001.png" alter="issues-001">

각 항목을 선택했을 때 어떤 내용을 어떻게 넣어야 하는지 안내문을 표시할 수 있다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-002.png" alter="issues-002">

사실 정보를 수집하는 입장에서는 저렇게 형식을 갖춘 틀에 필요한 정보가 차곡차곡 들어오길 바란다. 하지만 정보를 입력하는 입장이라면 내가 할 말만 하고 싶을 뿐 저런 과잉 친절을 가장한 형식은 거부감만 유발한다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-003.png" alter="issues-003">

실제로 이 글을 쓰고 있는 나 자신도 저기에 내용을 채워 넣을 수 있을까 생각하니 짜증부터 앞선다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-004.png" alter="issues-004">

와, 진짜 입력하기 싫다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-005.png" alter="issues-005">

움... 그냥 꺼버릴까?

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-006.png" alter="issues-006">

어쨌거나 기능적으로는 이렇게 템플릿을 만들면 어떤 책을 작업하더라도 파일 관리를 위한 Repository를 같은 형태로 찍어낼 수 있고, 덩달아 이슈 입력 받는 형식도 다시 입력할 필요없이 재사용할 수 있다. 

다만 그걸 사용자가 입력을 해주느냐는 건 또 다른 문제다. 
아, 큰일이다. 벌써 망한 느낌이 난다. 
그럼에도 불구하고 굳이 이슈 트래킹 기능에 버그 리포팅을 하고 싶어하는 <del>변태</del> 개발자는 있을테니 그들을 위해서라도 이 기능은 살려놔야겠다. 
