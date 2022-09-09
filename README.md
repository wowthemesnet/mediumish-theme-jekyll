## 설치 및 설정 방법

* Ruby 2.6 버전 사용할 것
* Windows download: https://rubyinstaller.org/downloads/ 

```
gem install bundler:2.0.1
gem install bundle
bundle update --bundler
bundle install
bundle add webrick
bundle exec jekyll serve
```

## 스포일러 기능 사용 방법

```html
<span class="spoiler">My hidden paragraph here.</span>
```

## 리뷰 기능 사용 방법

'rating' 항목에 별점을 입력한다.

```
---
layout: post
title:  "Inception Movie"
author: bomber
categories: [ Jekyll, tutorial ]
tags: [red, yellow]
image: assets/images/11.jpg
description: "My review of Inception movie. Actors, directing and more."
rating: 4.5
---
```

## 외부 피처 이미지 사용 방법

'image' 항목에 URL을 입력한다.

```
---
layout: post
title:  "External Featured Image"
author: admin
categories: [ Jekyll, tutorial, web development ]
image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a20c472bc23308e390c8ffae3dd90c60&auto=format&fit=crop&w=750&q=80"
---
```

## 인용 사용 방법

markdown의 '>' 기호를 사용한다.

```
> We are prone to let our mental life become invaded by legions of half truths, prejudices, and propaganda. At this point, I often wonder whether or not education is fulfilling its purpose. A great majority of the so-called educated people do not think logically and scientifically. 
```

## 포매팅 사용 방법

+ ~~strike through~~
+ ==highlight==
+ \*escaped characters\*

```
+ ~~strike through~~
+ ==highlight==
+ \*escaped characters\*
```

## 코드 블록 사용 방법

\```과 \``` 사이에 코드를 넣는다.
\``` 뒤에 언어 이름을 넣는다.


```html
<li class="ml-1 mr-1">
    <a target="_blank" href="#">
    <i class="fab fa-twitter"></i>
    </a>
</li>
```

```css
.highlight .c {
    color: #999988;
    font-style: italic; 
}
.highlight .err {
    color: #a61717;
    background-color: #e3d2d2; 
}
```

```js
// alertbar later
$(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 280) {
        $('.alertbar').fadeIn();
    } else {
        $('.alertbar').fadeOut();
    }
});
```
```python
print("Hello World")
```

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

```c
printf("Hello World");
```

## 이미지 삽입 방법

* 추천 이미지 폭: 1280 ~ 750px

```
![walking]({{ site.baseurl }}/assets/images/8.jpg)
```

## YouTube 이미지 삽입 방법

markdown 문서에 다음과 같이 iframe을 삽입한다.

```
<p><iframe style="width:100%;" height="360" src="https://www.youtube.com/embed/Cniqsc9QfDo?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></p>
```

## 강조 방법

백틱 문자로 감싼다.

```
When you run `bundle exec jekyll serve`, `Bundler` uses the gems and versions as specified in `Gemfile.lock` to ensure your Jekyll site builds with no compatibility or dependency conflicts.
```

## TOC 사용 방법

'beforetoc', 'toc' 항목을 활용한다.

```
---
layout: post
title:  "Education must also train one for quick, resolute and effective thinking."
author: bomber
categories: [ Jekyll, tutorial ]
image: assets/images/3.jpg
beforetoc: "Markdown editor is a very powerful thing. In this article I'm going to show you what you can actually do with it, some tricks and tips while editing your post."
toc: true
---
```

## 목록 나열 방법

'-' 로 항목을 열거한다.

```
- To install the Jekyll site into the directory you're currently in, run `jekyll new` . If the existing directory isn't empty, you can pass the --force option with jekyll new . --force.
- `jekyll new` automatically initiates `bundle install` to install the dependencies required. (If you don't want Bundler to install the gems, use `jekyll new myblog --skip-bundle`.)
- By default, the Jekyll site installed by `jekyll new` uses a gem-based theme called Minima. With gem-based themes, some of the directories and files are stored in the theme-gem, hidden from your immediate view.
```

## 게시물 메타 정보

```
---
layout: post
title:  제목
subtitle: 부제목
author: 작성자 계정
categories: [카테고리1, 카테고리2]
tags: [태그1], 태그2]
image: assets/images/파일명.확장자 
# image: "http://경로/파일명.확장자"
description: 설명
featured: false / false # featured 노출 여부
hidden: false / false # featured, all stories 중복 노출 방지
comments: true / false # page comment 사용 여부
rating: 1~5까지 점수
last_modified_at: YYYY-MM-DD
---
```
