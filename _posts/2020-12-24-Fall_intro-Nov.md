---
layout: post
title: "Fall intro team 11월 파이썬 과제"
authors: ["maybeluna"]
tags: ["Fall intro"]
image: https://www.bloter.net/wp-content/uploads/2016/09/navercast_python_01logo.png
description: "과제 4, 5 & 강의 듣기"
featured: false
---


## 1. shell 너의 정체가 무엇이냐? feat. 생활코딩

1. shell vs kernel

   - Kernel: 컴퓨터 운영체제의 핵심으로, 쉘로부터 전달받은 명령을 수행하면서 하드웨어를 직접 제어한다.
   - Shell: 사용자가 입력한 명령을 해석하여 커널에게 전달한다.  

2. 대표적인 shell 종류

   - bash: shell의 기본 카테고리 프로그램으로 가장 대중적으로 쓰인다.

   - zsh: 따로 설치해야하며 bash보다 진입장벽이 있다.

   - bash와 zsh는 명령어 차이가 약간씩 다르기 때문에 이를 확인해주어야 한다.

   - 현재 쓰는 쉘 종류를 알고 싶을 때

     ```shell
     echo $0
     ```

3. shell script

   - 쉘 실행 순서 방법을 각본을 짜서 저장하는 것

   - ```shell
     ### 빈파일 생성 (a.log, b.log 생성)
     touch a.log b.log 
     ### 디렉토리 생성 후 디렉토리에 로그 모든 파일 복사
     mkdir bak
     cp *.log bak
     ### backup이라는 nano 프로그램 생성
     nano backup 
     ### backup 실행 (권한 부여 및 실행)
     chmod +x backup
     ./ backup
     ```

4. nano

   - 저장: ctrl + o (저장 전 이름 입력)
   - 나가기: ctrl + x
   - 전체 파일 보기: ls -l
   - 일부 확장자 파일 보기: ls -al *.(확장자)
   - 파일 읽기: ctrl + r
   - 헬로 파일 열기: nano hello.html OR (파일명) + tap
   - 오려두기: ctrl+k
   - 붙여넣기: ctrl+u
   - 영역 선택: ctrl+6 (방향키를 이동하며 일정 영역 텍스트 선택)
   - 특정 파일 혹은 텍스트 찾기: ctrl + w
   - 매뉴얼 보기: ctrl + g

5. 파일과 디렉토리의 개념

   - file: 정보 저장 수단, 여러 정보가 모인 덩어리
   - directory: 파일 정리정돈 해주는 수납공간

## 2. 우분투에 git을 깔아보자

**목적: 과제 4의 경우 두 환경(window, ubuntu)에서 진행되기 때문에 각 코드를 짜고 깃에 병합을 해야하므로 우분투에 git 환경을 구현해야한다.**

1. vscode에서 ex 03 ~ 05 작업 완료 후 깃 push
2. 우분투에서 깃 clone or pull
3. 우분투에서 ex 01 ~ 02 작업 완료 후 깃 push

```shell
### 패키지 리스트 업데이트
sudo apt-get install.git
### 깃 설치 및 버전 알기
sudo apt install git
git --version
### 깃 push 했을 때 올라갈 정보 입력
git config --global user.name maybeluna
git config. --global user.mail ksb9817@gmail.com
### 깃 clone을 통해 내가 원하는 프로젝트 내려받기
git clone <url 주소> <저장 폴더명>
```

***항상 pull을 하면 error가 떠서 늘 clone을 쓰고 있는데 왜 자꾸 에러가 뜰까?

## 3. Assignment-4

### Ex 01. Show me the score - shell

- 제출할 폴더 : `ex01/`
- 제출할 파일 : `score`

다음과 같이 결과가 나오는 `score` 파일을 작성하세요

```bash
$ cat score
> A
$ 
```

- 나의 작업

  ```shell
  ### nano 프로그램에서 score 파일 만들기
  $ nano score
  ### nano
  A
  ### 우분투
  $ cat score
  > A
  ```

  => clear 😘

---

### Ex 02. Hello World with sh -shell

- 제출할 폴더 : `ex02/`
- 제출할 파일 : `greet`

다음과 같이 결과가 나오는 `greet` 파일을 작성하세요

```bash
$ sh greet
> Hello World!
$ 
```

- 나의 작업

  ```shell
  ### nano 프로그램에서 greet 파일 만들기
  $ nano greet
  ### nano
  echo "Hello World!"
  ### 우분투
  $ sh greet
  > Hello World!
  ```

  **echo는 유닉스 계열 운영 체제(ex. linux)에서 문자열을 컴퓨터 터미널에 출력하는 명령어로 python의 print 명령어와 비슷한 역할을 한다.

  => clear 😊

  "명령어 자체는 쉬웠지만 우분투라는 낯선 환경을 사용하는 것이 어려웠다. 그리고 윈도우 환경과 우분투 환경을 어떻게 통합해서 과제를 제출해야하는 지 계속 고민하다가 결국 SOS를 치고서 방법을 터득하게 되었다."

---

### Ex 03. Sort is awesome

- 제출할 폴더 : `ex03/`
- 제출할 파일 : `awesome_sort.py`
- 사용 **금지**된 코드 : `sort()`, `sorted()` 등의 내장 정렬 함수
- 리스트 `my_list`를 오름차순으로 정렬하는 코드를 작성하세요.

```python
my_list = [1, 3, 2, 4, 5]

...

print(my_list) # [1, 2, 3, 4, 5]
```

- 정렬 알고리즘

  - 버블 정렬: 인접한 두 원소 검사하여 크기가 순서대로 되어 있지 않으면 교환
  - 선택 정렬: 제자리 정렬 알고리즘의 하나로, 주어진 리스트 중 최솟값을 찾고 그 값을 맨 앞에 위치한 값과 교환한다. 맨 처음 위치를 뺀 나머지 리스트도 같은 방법으로 교체
  - 삽입 정렬: 자료 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘

- 나의 작업 (삽입 정렬 이용)

  ```python
  my_list = [1,3,2,4,5]
  for i in range(1, len(my_list)):
      for j in range(i, 0, -1):
          if my_list[j] < my_list[j-1]:
              my_list[j], my_list[j-1] = my_list[j-1], my_list[j]
          else:
              break
  print(my_list)
  ```

  => clear 😍

  "처음에는 정렬 알고리즘 자체를 이해하기 어려웠다. 수식을 하나하나 더듬어가며 과정을 따라가보았는데도 어려웠다. 제대로 이해하기 위해서 가시적인 자료가 필요했는데 정렬을 포크댄스로 표현해준 동영상이 많이 도움이 되었다."

---

### Ex 04. This Stop is, Yaksu, Yaksu

- 제출할 폴더 : `ex04/`
- 제출할 파일 : `yaksu.py`
- 사용 가능한 함수 : `print()`

어떤 정수 `N`을 **입력**받았을 때, 이 N의 **약수**를 공백으로 구분하여 출력하는 코드를 작성하시오

```python
# 예시 1
6

# 예시 출력 1
1 2 3 6

# 예시 입력 2
12 

# 예시 출력 2
1 2 3 4 6 12
```

- range 범위: range(1, 10) > 1 ~ 9

- 공백을 만드는 법: end=" "

- 나의 작업

  ```python
  yaksu = int(input())
  for a in range(1, yaksu+1):
      if yaksu%a == 0:
          print(a, end=" ")
  ```

  => clear 😆

  "range 범위를 자꾸 잊어버리는데 꼭 기억하게다고 다짐했다."

---

### Ex 05. I Love Combination Pizza

- 제출할 폴더 : `ex05/`

- 제출할 파일 : `combination.py`
- 사용 **금지**된 코드 : `itertools`

다음과 같이 출력하는 코드를 작성하시오.

```python
01 02 03 ... 09 12 13 ... 78 79 89
```

- 규칙 찾기: 1의 자리수가 10의 자리수보다 모두 작다

- 나의 작업

  ```python
  for i in range(0,10):
      for j in range(1,10):
          if i < j:
            print(str(i)+str(j), end=" ")
  ```

  **문자열을 통해 i와 j가 합산이 안되게 조정

  => clear 😚

  "for의 개념을 서서히 이해하고 있는 것 같다. 전에는 그저 구글링을 통해 코드를 찾아봤다면 이 코드는 내 스스로 짜보았고 통과를 해서 너무 기분이 좋았다."

> *과제 4는 shell 개념이 들어오면서 멘붕에다가 넘쳐나는 팀플로 다소 소홀히 했는데 자꾸 멀어지려는 나를 붙들고 정신차리고 다시 시작했다. 그 결과 shell의 개념도 더 정확히 알게되었고 머리에 그저 뜬구름처럼 퍼져있었던 지식이 점차 범주화가 되는 것 같았다.*

## 4. Assignment-5

- 모르는 문제가 있다면 질문합시당!
- **Don't Panic!**
- [숙제 시작하기](https://classroom.github.com/a/MHXkaASM)

### EX 01. Uptown Func

- 제출할 폴더 : `ex01/`

- 제출할 파일 : `my_first_function.py`
- 사용 가능한 함수 : `print()`

**Hello World!**를 출력하는 함수 `print_hello()`를 작성하세요

  ```python
  print_hello()
  ```

- 매개변수(parameter) : 없음
- 반환값(return value) : 없음

  ```python
  print_hello()

  # 출력
  Hello World!
  ```

- 함수를 만드는 명령어 'def'

  - 함수: 어떠한 입력값을 가지고 어떤 일을 수행한 다음 결과물을 내놓는 것으로 반복 작업이 필요할 때 주로 사용한다.

  - def 함수명(매개변수):

    ​<수행할 문장>

- 매개변수: 함수에 입격으로 전달된 값을 받는 변수
- 반환값: 함수를 처리하고 나온 결과
- 매개변수와 반환값 유무로 함수 형태 4가지 존재
  - 매개변수&반환값 有 / 반환값만 有 / 매개변수만 有 / 매개변수&반환값 無
  - 반환값이 없는 경우 print가 된다하더라도 수행할 문장을 이행하는 것이지 그것이 반환값이 아니다.

- 나의 작업 > 매개변수 및 반환값 無

  ```python
  def print_hello():
      print("Hello World!")
      
  print_hello()
  ```

  => clear 😉

  "이전에 'def'라는 명령어를 지나가다가 많이 보았는데 도통 어디에 사용하는 지 의문이었습다. 그러한 궁금증을 해결한 과제였습다. 다만 많은 예시가 반환값이 존재하는 경우가 많아 반환값이 없는 경우와 차이를 구별하는 것이 힘들었습다. "

---

## Ex 02. +_+

- 제출할 폴더 : `ex02/`
- 제출할 파일 : `insert_underbar.py`

두 문자열이 인자로 주어졌을 때, 이 둘을 언더바(_)를 이용해 연결한 문자열을 반환하는 함수 `insert_underbar()` 를 작성하세요

```python
insert_underbar()
```

- 매개변수(parameter) : 문자열 x, y
- 반환값(return value) : x와 y를 '_'를 기준으로 연결한 문자열

```python
# 예시 1
print(insert_underbar('py', 'thon'))

# 예시 출력 1
py_thon

# 예시 2
print(insert_underbar('to', 'mok'))

# 예시 출력 2
to_mok
```

- 반환값을 돌려주는 명령어 'return'
- 나의 작업 > 매개변수 및 반환값 有

  ```python
  def insert_underbar(x, y) :
      return str(x + '_' + y)

  print(insert_underbar('py', 'thon'))
  ```

  => clear 😉

  "반환값을 처음 써보았는데 실제로 반환값이 있는지 확인해보기 위해서 변수를 통해 확인해보았습니다."

---

## Ex 03. C To F

- 제출할 폴더 : `ex02/`
- 제출할 파일 : `convert_temp.py`

섭씨 온도가 인자로 주어졌을 때, 화씨 온도를 반환하는 함수 `ctof()`를 작성하세요

```python
ctof()
```

- 매개변수(parameter) : 섭씨 온도 n (n은 정수)
- 반환값(return value) : n을 화씨 온도로 변환한 값

```python
# 예시 1
print(ctof(0))

# 예시 출력 1
32

# 예시 2
print(ctof(100))

# 예시 출력 2
212
```

Hint 💡 : 섭씨에서 화씨로 바꾸는 공식은.. 검색해봐야겠죠?

- 섭씨 화씨 변환 공식: (0°C × 9/5) + 32 = 32°F
- 나의 작업 > 매개변수 및 반환값 有

  ```python
  def ctof(n):
      return n * 9/5 + 32

  print(ctof(100))
  ```

  => clear 😉

  "2번 문제를 응용한 것으로 섭씨, 화씨 변환 공식만 안다면 간단 한 문제였습니다."

---

## Ex 04. Fibonacci

- 제출할 폴더 : `ex04/`
- 제출할 파일 : `fibonacci.py`

**재귀**를 이용하여 다음 점화식을 만족하는 함수 `fibo()`를 만드세요

- `fibo()`
  - 매개변수(parameter) : 숫자 n ($n>0$)
  - 반환값(return value) : n번째 피보나치 수열에 해당하는 숫자
- 피보나치 수열은 다음 점화식을 만족하는 수열입니다
- $fibo(n) = fibo(n-1) + fibo(n-2)$
- $fibo(0)=0, fibo(1)=1$

```python
# 예시 1
print(fibo(2))

# 예시 출력 1
1

# 예시 2
print(fibo(10))

# 예시 출력 2
55
```

- 재귀: 자기 자신을 호출하는 함수
- 나의 작업 > 매개변수 및 반환값 有

  ```python
  def fibo(n):
      if n == 0:
          result = 0
      elif n == 1:
          result = 1
      elif n > 1:
          result = fibo(n-1) + fibo(n-2)
      return result

  print(fibo(10))
  ```

=> clear 😉

"n이 0일 때와 1일때와 같이 예외 사항을 어떻게 처리해야하나 고민했던 문제입니다. 그러나 그전에 배웠단 조건문 if와 elif를 이용하여 해결하였습니다."

> *과제 5는 함수의 초행자를 위한 파트인 것 같습니다. 어렵지는 않았지만 함수를 잘 이해했는지 함수의 조건은 무엇인지 문제를 풀면서 이해해나갔습니다. 다만 함수란 프로그램의 꽃으로 이것으로 완전히 이해했다고는 어렵습니다. 앞으로 더 많은 과제를 해내가면서 익힐 생각입니다*
