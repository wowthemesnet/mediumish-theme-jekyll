# CONTRIBUTING

## 블로그 포스트를 작성할 사람

1. author.yml 채우기

    `_data/author.yml`에 아래 양식에 맞게 본인의 정보를 업데이트 해주세요.

    ```yaml
    깃허브 닉네임:
        name: 본인의 이름
        display_name: 성을 제외한 이름
        email: 개인 이메일
        web: 개인 웹페이지가 있다면 해당 항목 추가 후 주소
    ```

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
