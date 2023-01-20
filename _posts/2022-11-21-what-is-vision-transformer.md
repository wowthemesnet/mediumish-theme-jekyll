---
layout: post
title:  "CNN의 시대는 끝났다 - vision transformer 리뷰"
authors: [SSUHYUNKIM]
tags: ["Web" , "PWA"]
#image: ../assets/images/post-what-is-gatsby/cover.jpg
featured: true
---

## INTRO

2019년 구글팀에서 발표한 **Vision Transformer(An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale)**의 등장은 게임 체인저가 되어, 이후 **CNN(Convolutional Neural Network)**알고리즘 기반에서 **transformer** 기반으로 옮겨갔습니다. 많은 거대한 데이터를 사전학습한 transformer 구조를 사용한 모델들이 SOTA를 갱신하고 있습니다. 대표적인 예로 가장 유명한 데이터 중 하나인 ImageNet 분류 문제에서 상위 10개 모델 중 9개가 transformer 기법을 사용하였습니다. 

이제는 필수로 알아야 하는 구조가 된 만큼, 본 글에서는 Vision transformer 모델을 이해하는데 알아야하는 선행지식인 NLP 영역의 전반적인 지식과 함께 transformer에서 사용된 기법들을 요약하겠습니다.

## attention

디코더에서 출력 단어를 예측하는 매 시점(time step)마다, 인코더에서의 전체 입력 문장을 다시 한 번 참고한다는 점입니다. 단, 전체 입력 문장을 전부 다 동일한 비율로 참고하는 것이 아니라, 해당 시점에서 예측해야할 단어와 연관이 있는 입력 단어 부분을 좀 더 집중(attention)해서 보게 됩니다.

**JAM Stack** 공식 홈페이지에서는 이렇게 설명하고 있습니다.
> Jamstack is an architecture designed to make the web faster, more secure, and easier to scale.

> JAM Stack 은 더 빠르고, 안전하며, 스케일링하기 쉬운 웹을 만들기 위해 디자인된 아키텍처입니다.

**JAM Stack**을 사용한 방식은 기존 웹 사이트의 방식과 다르게 절차가 간단합니다.

마크업 요소와 다양한 `API`를 통해 만든 정적 웹 사이트를 Pre-Render 한 것을 CDN(Content Delivery Network)을 통해 웹 사이트를 열람할 수 있습니다.

## Gatsby란 무엇인가?

`Gatsby JS`는 가공할 정보를 `GraphQL`에서 가져와서 빌드 시점에 정적 페이지를 만들어 내는 방식을 취하고 있습니다. 

- 그래프 형태의 데이터 인터페이스를 제공한다.
- 데이터 노드를 구성한다. 프리셋인 플러그인을 통해 확장할 수도 있다.
- 구성한 데이터를 `GraphQL`로 쿼리 해서 페이지 코드에서 사용한다.
- 사이트의 모든 페이지를 사전에 렌더링 하여 경로에 `index.html`을 생성한다.


## 왜 Gatsby를 사용해야 하는가

**1. 정적 사이트 생성**
- `Gatsby`는 서버 없이, 오로지 정적 사이트 생성을 위해 사용하는 프레임워크입니다.
그래서 서비스 및 기업 소개 페이지, 블로그, 포트폴리오 등에 많이 사용됩니다.

**2. 검색 엔진 최적화와 성능 모두 챙기기**
- `JavaScript`가 실행되면 빈 `HTML` 페이지 안에 마크업을 추가해 주는 SPA(Single Page Application)와 다르게, 개발 후 Build 과정에서 마크업이 생성됩니다.
- `Gatsby`는 단순히 정적 페이지를 만들어 주는 것으로 끝나는 것이 아니라, 필요에 따라 CSR(Client Side Rendering) 과 SSR(Server Side Rendering), lazy loading 을 적절히 섞어 사용할 수 있어 성능 면에서도 단순 정적 페이지보다 큰 장점이 있습니다.

**3. React 기반 프레임워크**
- `Gatsby`는 `React` 기반의 정적 페이지 생성 프레임워크입니다. 
- 프로젝트의 구조를 component, modules, pages로 나누며 컴포넌트 계층 구조로 개발을 할 수 있습니다.

**4. 친절한 [Gatsby 공식 문서](https://www.gatsbyjs.com/docs/)**
- 초반에 `Gatsby`가 어떻게 동작하는지, 어떤 템플릿이 있는지 알고 싶다면 다양한 Gatsby Starter를 사용하면 됩니다.
- `Gatsby` 공식 문서에서 적용 가능한 각각의 CMS 템플릿도 있고 홈페이지/블로그/포트폴리오 등의 다양한 스타터들이 있습니다.

**5. 다양한 Gatsby Plugin**
- Gatsby에는 다양한 [Gatsby Plugin](https://www.gatsbyjs.com/plugins) 들이 있습니다. 

## 설치 및 시작하기

먼저 `gatsby`를 설치한 후, 새 프로젝트를 생성합니다.

```shell
$ npm install -g gatsby-cli
$ gatsby new gatsby-site
```

gatsby-site 디렉토리 안에 프로젝트가 생성됩니다.
gatsby develop 커맨드를 실행하면 localhost:8000에서 페이지를 확인할 수 있습니다.


## 마크다운 파일로 블로그 만들기
gatsby-transformer-remark 플러그인을 사용하면 마크다운 파일을 `HTML`로 변환할 수 있습니다. 

### 플러그인 설치

```shell
$ npm install --save gatsby-source-filesystem gatsby-transformer-remark
```

gatsby-source-filesystem 플러그인은 파일을 읽어옵니다. 
플러그인을 사용하기 위해서는 gatsby-config.js 파일에 사용할 플러그인을 등록해야 합니다.

```javascript
// gatsby-config.js
plugins: [
    {
        resolve: "gatsby-source-filesystem",
        options: {
            name: "markdown-pages",
            path: `${__dirname}/src/markdown-pages`
        }
    },
    "gatsby-transformer-remark"
];
```

plugins 배열에 사용할 플러그인의 이름과 설정을 추가합니다. 
options의 path에는 파일이 들어있는 디렉토리를 지정합니다.

### 마크다운 파일 만들기

마크다운 파일에는 ---로 둘러싸인 블록 안에 정보를 추가할 수 있습니다. 이 정보는 gatsby-markdown-remark가 frontmatter로 파싱 합니다. 

```markdown
---
- date: "2019-10-20"
- title: "테스트용 게시글입니다."
- description: "게시글에 대한 설명입니다."
- template: "post"
- path: "/posts/test-post"
- draft: false
---

## 게시글(게시글 내용은 여기에 작성합니다.)
```

## 마치며
이번에는 짧은 시간에 정보를 찾아 글을 작성하다 보니 실제로 코드를 작성하거나 검증해 보지 못하고 구글링을 통해 여러 블로그의 정보를 가져와 나열하고 마칠 수밖에 없어서 아쉬움이 컸습니다. 
해당 기술을 실제로 사용할 일이 생길지는 모르겠지만 기회가 된다면 다음 기회에는 좀 더 구체적인 내용도 공부해 보면서 `gatsby` 이용해서 결과물을 만들어보고 싶다는 생각을 하였습니다. 
다음번에는 좀 더 시간을 들여서 더 좋은 정보를 제공할 수 있도록 하겠습니다.
끝!

## Reference

[Gatsby로 개인 블로그 만들기 -클론부터 배포까지-](https://suitee.me/getting-started-gatsby/)  
[Gatsby는 처음이라 :: 개념부터 프로젝트 시작까지](https://mnxmnz.github.io/gatsby/what-is-gatsby/)  
[Gatsby로 블로그 만들기](https://devsoyoung.github.io/posts/gatsby-blog/)  
[올리브영 테크블로그 Gatsby 전환&개발기](https://oliveyoung.tech/blog/2022-07-04/How-to-Develop-And-Migration-Blog-With-Gatsby/)  
