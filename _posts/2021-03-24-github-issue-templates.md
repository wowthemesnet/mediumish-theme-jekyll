---
layout: post
title:  "Issues 템플릿을 만들면 재사용이 되더라고"
author: bomber
categories: [작업 환경]
tags: [GitHub, 사이트구축]
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

앞서 필자는 도서 지원 사이트로 GitHub을 쓰기로 했다고 결정한 바 있다. 
핑계가 궁금하다면 아래 포스트 참고하자.

* <a href="{{ site.baseurl }}/github/" target="_blank">도서 지원 사이트로 GitHub을 쓴다고?</a>

번역하는 책 대부분이 IT 관련서다보니 소스 코드나 다운로드 파일을 제공해야 한다. 사용한 소프트웨어가 업그레이드되거나, 서비스 공식 페이지가 리뉴얼되면 변경되는 부분도 많다. (적어도 1년에 2번은 업그레이드된다) 종이책을 늦게 받아보는 독자라면 다음 쇄가 나올 때까지 갱신된 내용을 받아볼 수 없다. 그것도 증쇄한다는 전제가 있었을 때 가능한 얘기다. 

의도했던 안 했던 초기 출간 형태에서 바뀌는 내용은 어떻게든 독자에게 전달해야하고, 전달하지 못한다면 독자의 문의에 대응할 수 있어야 한다. 그러기 위해서는 형상관리 툴이 필요하고 지구상에서 가장 인지도 있는 형상관리 툴이라면 단연 GitHub일 것이다. 

... 라는 건 듣기 좋은 핑계고 사실은 개인 도메인을 사이트에 연동하는 게 무료라는 점이 GitHub을 선택한 가장 큰 이유가 되겠다. (거짓말 못 하는 성격이라) 어쨌거나 그렇게 결정한 이상 툴의 능력을 최대한 끌어내는 것은 엔지니어의 도리. 그래서 바로 GitHub에 제공하는 리포지터리 템플릿 기능을 써 보기로 했다.

## 재사용은 코드만 하는 게 아니야 GitHub Template

템플릿이 뭐냐고 묻는다면 초등학생에게는 플라스틱 모양 자를, 어르신에게는 붕어빵 틀이라고 설명하겠다. 그밖의 연령대는 대충 뭔지 알 테니 굳이 설명하지 않아도 될 듯. 심지어 문과냐 이과를 막론하고 칼퇴근을 바라는 직장인은 다양한 형태의 업무 템플릿(template)을 쓴다. 심지어 사회 초년생도 자기 소개서, 이력서 템플릿을 활용할 정도이니 실로 생산성을 극대화할 수 있는 궁극의 비기임은 틀림없다.

GitHub는 개발자의 창의성과 개방성이 극대화된 <del>복붙의</del> 메카이자 성지다. <del>(그 말이 그 말이다)</del>
그래서인지 GitHub 리포지터리도 템플릿을 만들면 같은 형태의 리포지터리를 붕어빵 찍듯 얼마든지 찍을 수 있다. 아래는 새 번역서를 작업할 때마다 새 리포지터리를 만들기 위한 템플릿이다.   

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/template.png" alter="template">

대충 살펴보면 사실 별것 없다. 특이한 게 있다면 docs는 GitHub Pages로 정적 웹 사이트를 만들 때 사용할 폴더이고, .github 폴더는 GitHub이 내부적으로 쓸 파일을 두는 곳 정도다. 여기서 .github 폴더 아래를 보면 눈치챘겠지만 내가 템플릿으로 재사용하고 싶었던 건 다름 아닌 Issue Template다. 

## Issues 있슈?

Issue란 사전적 의미로 '주제, 안건, 쟁점, 사안' 등의 의미인데 한 층 더 추상적으로 말하자면 '걱정거리가 디는 문제' 정도가 되겠다. 소프트웨어에서 걱정 거리는 뭘까? 대체로 버그로 인한 오동작일 테고, 그밖에는 사용하면서 궁금한 점, 쓰다 보니 별견되는 개선할 점등이 되겠다. 그래서 이런 이슈를 관리하는 시스템을 ITS(Issue Tracking System), BTS(Bug Tracking System)이라고 부른다. <dev>방탄 아니다.</del>

책도 소프트웨어와 비슷해서 책이 릴리스 된 후에는 오탈자도 나오고, 질문도 들어오고, 제안을 받기도 한다. 그렇다. 우리가 흔히 보는 오탈자 제보 게시판이나 질문 게시판인 셈이다. 이렇게 이슈 관리 시스템은 제품 유형을 떠나서 피드백을 받을 수 있는 가장 기본적인 접점이 된다. 아래는 기본 이슈 설정을 책의 사후 관리에 맞게 커스텀 한 것이다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-000.png" alter="issues-000">

이슈 형태는 얼마든지 만들 수 있으나, 종류가 너무 많으면 어디에 무슨 내용을 입력을 해야 할 지 난감할 수 있으므로 직관적으로 구분되는 범위에서 큰 덩어리로 나눌 필요가 있다. <del>이봐, 이봐, 지금도 충분히 많은데?</del>

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-001.png" alter="issues-001">

우선 각 항목에 뭘 넣어야 할지 모를 수 있으므로 간단한 안내문을 넣을 수 있겠다. <del>간단하지 않아.</del>

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-002.png" alter="issues-002">

사실 정보를 수집하는 입장에서는 저렇게 형식을 갖춘 틀에 필요한 정보가 차곡차곡 들어오길 바란다. 하지만 정보를 입력하는 입장이라면 내가 할 말만 하고 싶을 뿐 저런 과잉 친절을 가장한 형식은 거부감만 유발한다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-003.png" alter="issues-003">

실제로 이 글을 쓰고 있는 나 자신도 저기에 내용을 채워 넣을 수 있을까 생각하니 짜증부터 앞선다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-004.png" alter="issues-004">

와, 내가 썼지만 진짜 입력하기 싫다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-005.png" alter="issues-005">

움... 그냥 꺼버릴까?

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-006.png" alter="issues-006">

어쨌거나 기능적으로는 템플릿이 있다면 무슨 책을 작업하더라도 파일 관리용 리포지터리를 똑같은 골격으로 찍을 수 있고, 덩달아 이슈 입력 포맷도 다시 입력하지 않고 재사용할 수 있다. 
단 사용자가 의도한대로 입력을 해줄지는 또 다른 얘기다. 
아, 큰일이다. 벌써 망한 느낌이 난다. 
그럼에도 불구하고 굳이 이슈 기능을 살려두는 이유는 사소한 오탈자라도 버그 리포팅하고 싶은 <del>변태</del> 열성 개발자를 위한 배려라고 할까. 

정보를 편하게 수집할 궁리만 하면 정보를 주는 사람이 불편할 수 있다. 사소한 의견이라도 받는 것이 목적이라면 당연히 편의는 정보를 주는 쪽이 가져야 한다. 메일, 문자, 전화, <del>봉화, 파발</del> 등 정보 전달 방법은 다양하고 개인의 호불호도 다르다. 그들이 가장 편한 방법으로 가장 편하게 피드백을 줄 수 있도록 가능한 한 많은 채널을 열어둬야 한다. 그게 소중한 정보라면 그걸 모아 보는 건 정보 이용자가 치러야 할 최소한의 노력인 것이다. 


