# CONTRIBUTING

## 블로그 포스트를 작성할 사람

1. 블로그 포스트 작성하기
    1. `_posts` 폴더에 포스트를 markdown형식으로 작성해주세요.
    1. 포스트 상단의 속성을 설정해주세요. (영어로 된 부분은 그대로 두고 한글 부분을 변경하시면 됩니다! 이해가 안가시면 다른 분들의 포스트를 참고해주세요.)
        * `layout: post`
        * `title: 포스트 제목`
        * `authors: [작성자명]`
        * `tags: [태그1, 태그2, 태그3]`
        * `image: 포스트 커버 이미지`
        * `featured: true`
    1. 포스트 작성 중, 이미지에 캡션 달기
        1. 다음과 같이 작성해주세요(띄어쓰기 주의)

        ```markdown
            ![image](../assets/images/xxxx/xxxx)
            *캡션으로 달고 싶은 메시지*
        ```

1. PR을 작성해주세요!
    * ***이 레포지토리의 master 브랜치로 Pull Request를 날려주세요!***

## 블로그 author 추가하는 방법

1. `_data` 폴더에 `author.yml`을 수정해주세요.
    1. author 속성은 다음과 같습니다.

    ```markdown
        [닉네임]:
            name: [이름]
            display_name: [표시되는 이름]
            email: [본인 이메일]
            github: [Github 닉네임]
            role: [역할, lead || core || normal ]
            alumni: [alumni 여부]
            blog_team: [블로그 팀 테두리 입히기]
            web: [블로그 주소]
    ```
