---
layout: post
title: "Fall intro team 10월 파이썬 과제"
authors: ["maybeluna"]
tags: ["Fall intro"]
image: https://www.bloter.net/wp-content/uploads/2016/09/navercast_python_01logo.png
description: "과제 1, 2, 3"
featured: false
---

개발의 '개'자도 모르고 코딩의 '코'자도 모르는 사람이

Don't panic 이라는 신념 하에 개발을 하는 과정을 적어나가도록 하겠습니다.

## 1. 목표

- Python 기본기를 다지고 Python을 응용하여 어떠한 프로그램을 만들 수 있는 지 생각해보기
- 개발에 익숙해지는 것

## 2. Python

파이썬은 '프로그래밍 언어'로 현재 우리가 파이썬을 깐다는 것은 파이썬 번역기를 깔았다는 것

즉 인터프리터 코드를 명령으로 변환해주는 번역기를 깔았다는 것이다.

## 3. Git (깃)

코드의 분산 버전  관리 시스템이라고 불리며 여러사람이 함께 코드를 짤 때 유용한 시스템

로컬 저장소(개인 컴퓨터)와 원격 저장소(중앙 관리 컴퓨터 환경)로 이루어져 있으며 앞으로 Git을 통해 채점이된다.

- 깃 사용하기

  - 깃은 기본적으로 CLI를 사용
  - git clone을 통해 원격저장소에서 로컬 저장소로 이동
  - git add <저장 파일>  저장할 파일 지정
  - git coomit -m "남길 메세지" add 했던 것 저장
  - git push <원격 저장소 이름> </branch 이름>

- 우당탕탕 깃

  - git leave

    git 설정이 꼬이면서 repository를 삭제한다는 것이 leave를 해버렸다!

    leave 기능은 소유 권한을 내려놓는 기능으로

    leave 한 원격저장소 제거하거나 다시 소유권 부여를 통해 해결이 가능했다...

    나의 경우 기존 원격저장소를 제거하고  git을 다시 생성하였고 다시 git을 사용할 수 있게 되었다.

  - git 꼬임

    leave를 할 때부터 알아봤어야 했는데 git은 과제 1을 하는 내내 나를 괴롭혔다.. ㅠ

    **error: failed to push some refs to 'origin'**이 계속 나왔고 가장 최근 원격저장소로 작업해야하는데 그렇지 않아서 발생한 문제라고 되어있었다.

    권고한대로 pull 명령어를 써보았는데 **refusing to merge unrelated histories** 가 나오면서 병합자체가 되지 않았다!

    그래서 강제로 pull(git -hard HEAD)도 해보고 유튜브에서 git add -A를 해보라고 해서 해보기도 했지만 결과는.. 여전히 이 상태 **error failed to push some refs to 'origin'**이 뜨면서 병합 불가!

    ![git_error](https://user-images.githubusercontent.com/72259053/116881834-b7791080-ac5e-11eb-9d97-5fc9adae0ec2.png)

    결국 git clone을 새 폴더에 다시 작업하여 시작!

    후.. ㅠ 애증의 git.. !

    git이 꼬인 이유를 대략 예상해보았는데

    leave를 하면서 기존 원격저장소를 제거하고 git을 새로 생성했는데 로컬 저장소에서는 기존 파일로 작업해서 그렇지 않았나싶다..?

## 4. Python & VScode

 코딩 초보자가 접근하기 쉽다는 python을 사용하여, 코딩이라는 것의 뼈대를 잡아가도록 하였다.
 문서 편집기로는 vscode를 사용하여 작업을 한다.

## 5. print

과제 1에서 주로 사용하는 명령어 'print'

print란 화면의 결과물을 출력하기 위해 사용되는 명령어로 다양한 방법으로 print를 활용해보았다.

- 문자 프린트

```python
>>> print("Hello World!")
Hello World 

>>> print("cake")
>>> print("cookie")
>>> print("tea")
cake
cookie
tea
```

- 변수 프린트

```python
>>> my_var = 10
>>> print(my_var)
10
```

- 연산

```python
>>> print(5+5)
>>> print(4-2)
>>> print(2*8)
>>> print(9/3)
10
2
16
3.0

>>> print(8 ** 2)
>>> print(53 // 7)
>>> print(7 % 4)
64
7
3
```

### 과제 1을 통해 배운 점

1. python은 대소문자 구분을 한다.

   실제로 Hello World를 프린트할 때 'W'를 소문자 'w'로 올려서 실패

2. 파이썬 데이터 타입이 매우 다양하기 때문에 이를 구별해주어야 한다.

   - str(string) 문자열
   - int(integer) 정수
   - float(floating-point number) 실수

3. 연산자 사용

   - ** (제곱)
   - // (몫)
   - % (나머지)

기존에 기본 사칙연산 관련된 연산자는 알았으나 제곱, 몫, 나머지는 잘 몰라서 매우 신기했다.

더불어 코딩을 처음 해보고 그랬는데 깃이 꼬이면서 머리가 터질 뻔하다가 겨우 진정하고 과제를 이어나갔다. don't panic이 왜 중요한지 깨닫게 된 고마운 경험이라고 생각한다,,,!

## 6. input과 if

과제 2에서는 주로 input과 if를 사용했다.

input 명령어란 사용자가 입력한 값을 어떤 변수에 대입할 때 쓰는 명령어로, input에 입력되는 모든 것은 문자열(str) 취급하기 때문에 이를 주의해야한다.

if문은 조건을 판단하고 그 조건에 맞는 상황이 오면 if문 안의 코드를 수행하는 기능을 가졌다. 여러가지 상황이 주어졌을 때 컴퓨터에서 이를 판단하고 정확한 수행을 하기 위해 쓰인다.

- 입력한 값 변수 대입해보기

```python
>>> my_var = input()
hello
>>> print(my_var)
hello

>>> money = input()
10
>>> print(int(money)*2)
20
```

- 비교 연산자

```python
>>> print(3<4)
>>> print(7==8)
>>> print(15>=1)
True
False
True
```

- 논리 연산자

```python
>>> print(3 == 3 and 4 == 4)
>>> print(4 < 2 or 1 > 3)
>>> print(not 3 < 4)
True
False
False
```

- 조건문

```python
>>> n = int(input())
28
>>> if n % 4 == 0 and n % 7 == 0:
...   print('FizzBuzz')
... elif n % 4 == 0:
...    print('Fizz')
... elif n % 7 == 0:
...    print('Buzz')
... else:
FizzBuzz

>>> n = int(input())
2
>>> if (n+1) % 3 == 0:
..   print('Clap')
... else:
...    print(n+1)
Clap
```

### 과제 2를 통해 배운 점

1. 비교 연산자

   - a < b (a가 b보다 작으면 True, 크거나 같으면 False)
   - a == b (a와 b가 똑같으면 True, 다르면 False)
   - a<=b (a가 b보다 작거나 같으면 True, 크면 False)
   - 연속적으로 있으면 is, is not, ==, !=, <, >, <=, >= 순서로 판단

2. 논리 연산자

   - a and b (a와 b값 모두 True일 때 True, 하나라도 False면 False)
   - a or b (a와 b값 중 하나만 True여도 True, 둘 다 False인 경우 False)
   - not x: 논리값이 False인 것을 True로 바꿔주고 True인 것을 False로 바꿔준다.
   - 연속적으로 있으면 not, and, or 순서로 판단한다.
   - 비교연산자가 논리연산자보다 우선으로 판단된다.

3. 조건문

   - 조건문 if 끝에는 항상 콜론(:)이 필요하다
   - else는 if를 분기해주는 것으로 이 역시 콜론(:)이 필요하다.
   - if 조건문에 맞는 상황에 수행할 문장(ex. print)에는 들여쓰기 필요하다.

우리가 아무런 생각없이 사용하는 무인키오스크, 인터넷의 수많은 웹사이트들이 이러한 조건문과 다양한 연산자를 통해 실행되고 있을거라 생각하니 프로그래머 분들에게 고마움이 생겼다. 아직 응용은 버겁지만 꾸준히 하는 것을 목표로 해야겠다.

## 3. for

과제 3에는 주로 반복문인 for이 쓰였다.

for문이란 순서형 자료(리스트, 튜플)의 첫 요소부터 마지막 요소까지 변수에 대입하여 수행되는 것으로 원하는 명령을 반복할 때 쓰인다.

- 순서형 자료

```python
>>> system = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']
>>> system.insert(2, 'Earth')
>>> print(system)
['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

>>> my_list = [1, 2, 3, 4, 5, 6, 7, 8]
>>> print(my_list[-3])
6
```

- 반복문

```python
>>> bag = [1, 3, 5, 7, 9]
>>> n = int(input())
3
>>> if n in bag:
...    print("YES")
...else:
...    print("NO")
YES

>>> for n in range(1,101):
...    print(n)
1
2
3
.
.
.
100

>>> qm = int(input())
3
>>> n = [2, 3, 5, 7, 13, 17, 19, 31, 61]
>>> ms = [2**t - 1 for t in n]
>>> if qm >= 2**64:
...    print("NO")
...    quit()
>>> for mer in ms:
...    if mer % qm == 0:
...        print("YES")
...        break
... else:
...    print("NO")
YES
```

### 과제 3을 통해 배운 점

1. 리스트

   - [a, b, c] 형식으로 이루어져 있다.
   - 위 리스트에서 a가 0번째이며 c는 -1번째로 표현 가능하다.

2. 반복문

   - while, for, continue, break 같은 명령어를 이용
   - while: 조건이 참인 동안 반복
   - for: 순서열 처음부터 끝까지 반복
   - continue: 조건이 참이면 반복문 계속
   - break: 조건이 참이면 반복문 중단
   - 반복문 끝에 콜론(:) 필수
   - 반복문을 수행할 문장에는 들여쓰기 필수

3. range

   - range(start, end, interval)
   - end 순서열은 포함되지 않는다.

마지막 메르센소수 문제가 어려웠다. 메르센 소수 자체를 구하는 코드를 너무 어렵게 짰던 탓이었다.

![mersenne](../assets/images/post-INTRO-Oct/mersenne.png)

이러한 방식으로 진행햇는데 자연수를 판단하는 코드를 짜지 못해 막혀버렸다.

결국 메르센 수 범위가 제한되어 있는 것을 보고 그 범위 안에 있는 메르센 소수를 리스트 안에 다 적용하였고 문제는 해결하였다.

멘토님의 조언으로 메르센 수를 판단하고 소수를 판단했으면 더 확장된 범위에서 진행할 수 있을 것같아 나중에 도전해보기로 하였다.

지난 한 달 동안 목표했던 과제 5까지 완수하지 못했다. 생각보다 시간이 없었고 게다가 시험기간이라 그런지 매일 밤새는게 일상이다보니 많이 해보지 못했던 것은 핑계일까..?

11월 달 스프린트의 경우 시험 기간이 아니니 부지런히 해서 목표를 완수할 계획이다. 그러려면 우선 쉘이라는 것과 친해져야할 듯 하다.
