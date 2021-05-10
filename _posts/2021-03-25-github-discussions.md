---
layout: post
title:  "Issues는 써 보지도 못하고 Discussions로 갈아엎었다"
author: bomber
categories: [작업 환경]
tags: [GitHub, 사이트구축]
image: assets/images/github-discussions/silhouette-1082129_1280.jpg
image-caption: 이미지 출처 <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1082129">Pixabay</a>
description: "GitHub 이슈로 질문 게시판 만들었는데, GitHub 디스커션으로 갈아타야 했던 썰"
featured: false
hidden: false
beforetoc: 
toc: true
comments: true
rating: # 1~5까지 점수
last_modified_at: # YYYY-MM-DD
---

앞서 필자는 독자 피드백을 받는 방법으로 GitHub의 Issue 기능을 쓰기로 했다고 결정한 바 있다. 
핑계가 궁금하다면 아래 포스트 참고하자.

* <a href="{{ site.baseurl }}/-github-issue-templates/" target="_blank">Issues 템플릿을 만들면 재사용이 되더라고</a>

이슈로 피드백을 하는 방법은 IT 분야를 경험한 사람에겐 그리 어렵지 않은 방법이다. 다만 일반 사용자가 처음 이슈 기능을 사용하면 다소 당황하게 되는데, 게시판이라고 생각하고 쓴 글이 소스 코드를 변경하고, 병합하는 데 활용되다 보니 뒤에서 벌어지는 동작에 부담을 느끼기 때문이다. 
특히나 제기한 이슈가 반려<sub>(reject)</sub>되거나 <sub>(duplicated)</sub> 되었다고 통보받는 날엔 기껏 도움되는 얘길 한 것 같은데 찬밥 신세가 된 것 같아 섭섭한 마음도 생길 터이다. 

GitHub을 비롯한 각종 형상 관리 툴은 이슈가 곧 소스 코드의 병합<sub>(merge)</sub>을 유발하는 트리거가 되므로 소스 코드가 변경되는 배경을 투명하게 관리하기 위해서라도 다소 엄격한 프로세스와 일정한 형식을 갖출 필요가 있다. 그리고 이런 절차와 형식은 피드백을 주는 주체가 개발자일 때 유용하다. 하지만 피드백을 할 사람이 이런 배경지식이 없는 일반인이라면 어떨까? 

## 그런데 Discussions 기능이 나왔지 뭐야

2020년 12월쯤인가 GitHub에 새로운 기능이 추가되었다. 'Discussions'라는 기능인데 일종의 포럼 기능이다. 이슈가 소스 코드에 직접적인 변화를 가한다면 디스커션은 상대적으로 그 연결고리가 약하다. 자유롭게 생각을 주고받을 수 있으니 우리가 아는 일반적인 '게시판' 성격에 좀 더 가깝다. 

아래는 커스텀을 따로 하지 않은 디스커션 화면이다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/discussions.png" alter="discussions">

대충 살펴보면 일반적인 내용과 새 기능에 대한 아이디어, 다른 이의 도움이 필요한 질문, 내가 만든 기능의 자랑질(?)을 포스팅하는 카테고리가 있다. 물론 카테고리는 커스텀 할 수 있는데 커스텀 방법도 어렵지 않다. 우선 제일 만만한 Q&A 카테고리를 'Edit' 해서 어떤 부분을 손댈 수 있는지 살펴보자.  

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-000.png" alter="custom-000">

일단 제목<sub>(title)</sub>과 설명<sub>(description)</sub>을 한국어로 현지화 할 수 있고 토론(?) 형식을 일반적인 게시판 형태로 할지, 문답 게시판 형태로 할지 정할 수 있다. 어디까지 다리를 뻗을지 확인했다면 이제 집도를 시작하자. 

## 그래서 난 이렇게 커스텀 했다

GitHub은 기본적으로 한국어를 지원하지 않기 때문에 처음 보는 이에겐 이게 어디에 쓰는 물건인지 당황하게 만들 수 있다. 모든 부분이 영어일 때 일부가 한국어라면 자연스럽게 거기에 시선이 가기 마련. 더도 말도 덜도 말고 딱 3개의 카테고리로 정리해봤다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-001.png" alter="custom-001">

문의, 제보, 제안 정도면 어디에 뭘 써야 할 지 헛갈리지 않을 거란 계산인데 사실 엉뚱한 곳에 썼다고 하더라도 정보를 수집하는 쪽에서 내용만 이해할 수 있으면 큰 문제가 될 건 없다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-002.png" alter="custom-002">

일단 문답형 기능을 테스트해봤다. 그냥 입력도 가능하지만, 이전 내용을 인용하며 코멘트를 달 수도 있다. 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-003.png" alter="custom-003">

Issues 기능과는 달리 기본 입력되는 템플릿이 없다 보니 입력은 자유롭다. 형식을 버리는 대신 참여도를 높일 수 있겠다. 워낙에 자유로운 입력 방식이라 이 정보를 작업 근거로 이용할 수 있을까 걱정될 수도 있겠다. 다행히 GitHub은 디스커션 내용을 이슈로 연결하는 기능을 제공한다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-004.png" alter="custom-004">

결국 독자가 자유롭게 의견을 주거나 질문한 내용을 검토한 후, 파일 변경이 필요하다고 판단되면 그걸 이슈와 연결하면 된다. 정보 제공은 자유롭게, 작업 근거는 투명하게, 두 마리 토끼를 잡은 셈이다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-005.png" alter="custom-005">

일단 이슈로 전환되면 통상적인 이슈 트래킹 기능을 활용할 수 있다. 작업 유형을 정하거나 작업자를 할당할 수 있고, 완료 여부 같은 상태 지정도 가능하다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-006.png" alter="custom-006">

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/custom-007.png" alter="custom-007">

결국 독자의 오탈자 제보나 질의응답, 개선 요청에 대해 원고의 내용을 변경해야 할 때, 근거가 되는 이슈도 살릴 수 있고, 이슈 트래킹 기능에 익숙지 않은 독자에게는 일반 게시판과 같은 디스커션 기능을 활용할 수 있게 되었다. 

## ...라며 끝날 줄 알았는데 망했다

자, 이제 디스커션 기능도 설정했으니 테스트를 해볼까? 하는 순간 뭔가 싸한 느낌이 온몸을 감싸는 걸 느꼈다. 
<blockquote>'아라, 게시판은 보이는데 글을 쓸 수 없는데?'</blockquote>
그렇다. 'New' 버튼이 활성화되어 있지 않다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/discussions-new.png" alter="discussions new">

그렇다. 이 기능은 GitHub 계정이 있어야 쓸 수 있다. 어라? 그럼 이슈 기능은? 하며 확인을 해보니 이러하다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-new.png" alter="issues new">

어라? 이건 'New' 버튼이 활성화되어 있는데? 하고 눌러보면... 

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-issue-templates/issues-login.png" alter="issues login">

아... 그럼 그렇지. ㅜㅜ 자 이쯤 되면 GitHub에 뭐라도 쓰고 싶으면 GitHub 계정이 필요하다는 아주 당연한 사실을 새삼스레 깨닫게 되며, 난 왜 이게 된다고 생각했지? 하며 자괴감에 빠지게 된다.

어쨌거나 그런 당연한 사실을 받아들이기로 하고, 이 문제를 해결할 방법을 생각해보자. 할 말을 남기고 싶은 독자 모두가 과연 개발자일까? GitHub 계정이 없는 사람은, 혹은 계정을 만들고 싶지 않은 사람은 어떻게 해야 할까?

이미 앞에서도 언급했지만, 정보를 수집하는 자와 정보를 제공하는 자가 있다면 아쉬운 건 정보를 수집하는 쪽이다. 정보를 제공하는 쪽이 더 쉽고 간편하게 정보를 내놓게 하려면 그들이 가장 편안하게 생각하는 채널로 정보를 받아야 한다. 일원화된 채널, 접점은 보기도 좋고 운영하기도 좋지만, 과연 그게 최선의 방법인지는 정보를 제공하는 쪽의 입장도 들어봐야 한다. 

그래서 결국은 다음과 같은 형태로 운영할 예정이다.

<img class="shadow" src="{{ site.baseurl }}/assets/images/github-discussions/supports.png" alter="custom-003">

<blockquote>뭐야, 이 혼종은?</blockquote>

사용성 면에서는 카카오톡 채널도 괜찮겠지만 카톡은 정보가 흘러서 지나가면 다시 찾기 어려우므로 그나마 정보가 고여있고 장시간의 생명 주기를 가지는 플랫폼 위주로 활용해봐야겠다. 어차피 당분간 들어올 트래픽도 없을 테니 우선은 이 정도로 작게(?) 시작해보는 거로... <del>작지 않아!</del>

그래서 오늘의 엔딩 곡은 이거로...<br/>
'안녕'이 부릅니다. <br/>
Why Am I Like This?(난 왜 이럴까)

<div class="center"><iframe width="640" height="360" src="https://www.youtube.com/embed/4XzV7_JbLjE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>