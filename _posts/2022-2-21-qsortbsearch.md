---
layout: post
title: "C언어로 퀵정렬과 이분탐색 사용하기"
authors: [simpack0513]
tags: ["C Language", "Algorithm"]
image: ../assets/images/post-qsortbsearch/intro.png
featured: true
use_math: true
---

# C언어로 코테 준비하기(?)

파이썬을 배운지 오래되었고 대학 전공수업 때문에 C언어가 가장 익숙하다면, 필자처럼 C언어로 코테를 준비할 수도 있습니다. 코테 언어로 많이 사용하지는 않지만 혹여나 사용하게 될 여러분들을 위해 이번 포스팅에서는 퀵정렬과 이분탐색 함수 사용법에 대해 다뤄보도록 하겠습니다.

## 들어가기 앞서..

**C언어를 쓰면 퀵정렬과 이분탐색을 직접 구현해야 하는 거 아닌가요?**

저도 처음에는 재귀함수로 직접 구현하였습니다. 그러나 `stdlib.h`에 이미 함수가 선언되어 있습니다.

포인터의 개념만 잘 알고 있다면 쉽게 사용할 수 있고 이번 포스팅에서는 배열뿐만 아니라 구조체 배열도 퀵정렬과 이분탐색을 해보겠습니다.

### 퀵정렬(qsort)

퀵정렬은 O(nlog₂n)의 시간복잡도로 일반적인 버블정렬, 선택정렬, 삽입정렬에 비해 빠른 속도로 정렬할 수 있습니다. 코테에서는 시간제한이 있으므로 퀵정렬 사용법을 익히는 것은 기본입니다.

C언어는 qsort 함수를 이용하면 되는데, 함수의 형식은 다음과 같습니다.

```C
void qsort(void *base, size_t num, size_t width, int(*compare)(const void *key, const void *element));
```

매개변수는 총 4개입니다.

+ `base`는 퀵정렬을 할 배열의 주소입니다. 정렬할 시작 주소를 전달하면 됩니다.

+ `num`은 전체 배열의 원소 개수입니다. size_t은 부호 없는 정수 자료형으로 일반적으로 2 이상의 정수를 입력합니다.

> size_t와 unsigned int의 차이는 운영체제에 따라 크기가 변하는지 차이가 있습니다. size_t는 같은 비트의 운영체제에서는 동일한 크기지만 unsigned int와 같이 int형은 비트가 같아도 다를 수 있습니다.

+ `width`는 정렬할 배열 데이터 값 하나의 메모리 크기로, 예를들어 base가 int형 배열이라면 width는 sizeof(int)가 됩니다.

+ `compare`은 함수 포인터로 배열의 원소들을 비교할 함수입니다. 원소들이 오름차순으로 정렬될지 내림차순으로 정렬될지는 여기서 결정합니다! compare 함수는 int형으로 반환 값을 가지고 void형 포인터 변수 2개를 매개변수로 가집니다.

compare 함수로 사용할 함수를 따로 선언하고 함수명을 매개변수로 주면 되는데, 기본적으로 다음과 같이 작성합니다.

```C
int compare (const void *a, const void *b)
{
  int num1 = *((int *)a);
  int num2 = *((int *)b);

  return (num1 - num2);
}
```

이 함수는 int형 배열의 원소를 오름차순으로 정렬하도록 했습니다.

매개변수로 void형 포인터 변수가 오기 때문에 타입 형 변환을 통해 어떤 자료형을 가리키는 포인터인지 알려주어야 합니다. (int *)을 통해 a를 void형에서 int형 포인터 변수로 형 변환하고 *(a)로 포인터가 가리키는 주소에 접근하여 값을 num1에 저장합니다.

그리고 반환 값이 양수이면 a가 b보다 오른쪽에 정렬되고 0이면 a와 b는 같다는 뜻이며 음수이면 a는 b 왼쪽에 정렬됩니다. 이때 비교할 값이 매개변수에서 첫 번째 변수입니다. 위 같은 코드로 짜면 num1이 num2보다 클 때만 반환 값이 양수이므로 오름차순으로 정렬됩니다.

이제 예시코드입니다. int배열에 5개 원소를 초기화하고 정렬해보겠습니다.

```C
#include <stdio.h>
#include <stdlib.h>

int compare (const void *a, const void *b)
{
  int num1 = *((int *)a);
  int num2 = *((int *)b);

  return (num1 - num2);
}

int main()
{
    int arr[5] = {5, 2, 1, 10, 13};

    qsort(arr, 5, sizeof(int), compare);

    for(int i=0; i<5; i++)
        printf("%d ", arr[i]);
}
```

```
출력
1 2 5 10 13
```

이때, arr 배열의 첫 번째 원소는 무시하고 두 번째 원소부터 정렬하고 싶다면 qsort의 첫 번째 매개변수를 다음과 같이 주어 정렬할 수 있습니다.

```C
#include <stdio.h>
#include <stdlib.h>

int compare (const void *a, const void *b)
{
  int num1 = *((int *)a);
  int num2 = *((int *)b);

  return (num1 - num2);
}

int main()
{
    int arr[5] = {5, 2, 1, 10, 13};

    qsort(&arr[1], 4, sizeof(int), compare);

    for(int i=1; i<5; i++)
        printf("%d ", arr[i]);
}
```

```
출력
1 2 10 13
```

qsort할 주소의 시작 값을 1번 인덱스의 주소로 주어 그 뒤로 4개의 원소만 정렬할 수 있습니다.

포인터 개념을 잘 익혔다면 쉽게 변형하여 사용할 수 있다는 점이 좋습니다.

### 구조체 배열 퀵정렬하기

그렇다면 구조체 배열도 정렬해보도록 하겠습니다. 구조체는 여러 맴버 변수가 있는데 이를 입맛대로 원하는 맴버를 기준으로 정렬할 수 있습니다.

예를들어, 이름과 번호를 가진 학생 구조체를 만들어 이름을 기준으로 한번 정렬하고 번호로도 정렬해보겠습니다.

구조체는 다음과 같이 선언합니다.

```C
typedef struct Student
{
    char name[100];
    int  num;
}Student;
```

구조체 배열이므로 compare 함수에서 void *형으로 들어온 매개변수를 구조체 포인터로 형 변환을 해주겠습니다. 또한, 문자열을 비교하기 위해서 `string.h`에 선언된 strcmp를 활용하겠습니다.

>strcmp는 문자열 주소 a,b를 매개변수로 받아 첫 문자부터 알파벳 순서대로 a가 크다면 양수, b가 크면 음수, 같다면 0을 반환합니다.

오름차순으로 정렬할 것이므로 strcmp의 반환 값을 그대로 활용하여도 괜찮습니다.

아래는 임의의 학생 5명을 구조체 배열에 초기화한 후 정렬한 예시입니다.

```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int compare (const void *a, const void *b)
{
  Student *s1 = (Student *)a;
  Student *s2 = (Student *)b;

  return (strcmp(s1->name, s2->name));
}

int main()
{
    Student s[5] = { {"Jiho", 2}, {"Simon", 5}, {"Apple", 3}, {"He", 1}, {"Jaemin", 4} };

    qsort(s, 5, sizeof(s[0]), compare);
    for(int i=0; i<5; i++)
        printf("%s : %d\n", s[i].name, s[i].num);
}
```

```
출력
Apple : 3
He : 1
Jaemin : 4
Jiho : 2
Simon : 5
```

이번에는 compare 함수만 수정하여 학생들을 번호로 정렬해보겠습니다.

오름차순으로 정렬할 것이므로 반환 값을 두 번호의 차로 하겠습니다.

```C
#include <stdio.h>
#include <stdlib.h>

int compare (const void *a, const void *b)
{
  Student *s1 = (Student *)a;
  Student *s2 = (Student *)b;

  return (s1->num - s2->num);
}

int main()
{
    Student s[5] = { {"Jiho", 2}, {"Simon", 5}, {"Apple", 3}, {"He", 1}, {"Jaemin", 4} };

    qsort(s, 5, sizeof(s[0]), compare);
    for(int i=0; i<5; i++)
        printf("%s : %d\n", s[i].name, s[i].num);
}
```

```
출력
He : 1
Jiho : 2
Apple : 3
Jaemin : 4
Simon : 5
```

### 이분탐색(bsearch)

이분탐색은 정렬된 배열에서 원하는 값이 있는지 알아내기 위해 사용합니다.

배열의 인덱스를 처음부터 차례로 탐색하는 순차탐색보다 시간이 혁명적으로 빠르며 시간복잡도는 O(log₂n)으로 코테에서 자주 사용됩니다.

이분탐색 함수 역시 `stdlib.h`에 선언되어 있으며, 다음과 같이 정의됩니다.

```C
void *bsearch(const void *key, const void *base, size_t num, size_t size,int (*compare)(const void *key, const void *element));
```

앞서 퀵정렬과 유사하나 key라는 매개변수가 추가되었습니다. key는 탐색할 값으로 base 배열에서 찾을 값입니다.

또한, 반환 값이 존재하는데 이는 base에서 key를 찾았을 때 그 주소를 반환합니다. 이를 통해 찾은 값이 몇 번째 인덱스에 있는지 알 수 있습니다. 만약 key를 찾지 못했다면 NULL을 반환하기 때문에 배열에 존재하는지 아닌지를 알 수 있습니다.

주의할 점은 반드시 오름차순으로 정렬된 배열에 사용해야 합니다. compare 함수는 찾고자 하는 key를 배열의 중앙값과 비교하는데 key가 중앙값보다 오른쪽에 있다면 양수, 왼쪽에 있다면 음수, 중앙값과 같다면 0을 반환해야 합니다.

예시로 위 학생들을 이름순으로 오름차순 정렬한 뒤 "Jiho"와 "Min"학생이 각각 배열에 있는지, 있다면 몇 번째 인덱스인지 구해보겠습니다.

```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int compare (const void *a, const void *b)
{
  Student *s1 = (Student *)a;
  Student *s2 = (Student *)b;

  return (strcmp(s1->name, s2->name));
}

int main()
{
    Student s[5] = { {"Jiho", 2}, {"Simon", 5}, {"Apple", 3}, {"He", 1}, {"Jaemin", 4} };
    Student *p;

    qsort(s, 5, sizeof(s[0]), compare);

    for(int i=0; i<5; i++)
        printf("%s : %d\n", s[i].name, s[i].num);

    printf("\n");

    p = bsearch("Jiho", s, 5, sizeof(s[0]), compare);
    if (p == NULL)
        printf("Not Found\n");
    else
        printf("Found!! index : %ld\n", p - &s[0]);

    p = bsearch("Min", s, 5, sizeof(s[0]), compare);
    if (p == NULL)
        printf("Not Found\n");
    else
        printf("Found!! index : %ld\n", p - &s[0]);

}
```

```
Apple : 3
He : 1
Jaemin : 4
Jiho : 2
Simon : 5

Found!! index : 3
Not Found
```

Jiho 학생은 반환 값의 주소와 첫 원소의 주소의 차를 구해 3번 인덱스로 출력되었고, Min 학생은 탐색에 실패하여 NULL이 반환되어 Not Found가 출력되었습니다.

**만약 이름이 같은 학생이 있다면 어떤 값이 반환되나요?**

이름이 같은 학생 중 한 원소가 반환되는데 어떤 원소가 반환되는지는 상황에 따라 다릅니다. 항상 제일 오른쪽에 있는 원소가 반환되는 것이 아니므로 주의해야 합니다.

### 퀵정렬, 이분탐색을 활용하여 보자

마지막으로 백준 10816번 '숫자 카드 2'을 예시로 퀵정렬과 이분탐색을 활용하여 보겠습니다.

이 문제에서 상근이는 숫자 카드 N개를 가지고 있습니다. 정수 M개가 주어졌을 때, 이 수가 적혀있는 숫자 카드를 상근이가 몇 개 가졌는지 구해야합니다.

간단히 생각하면, 정수 M개의 배열 중 첫 번째부터 상근이의 모든 숫자카드를 차례로 비교하며 몇 번 등장했는지 세어 문제를 해결할 수 있습니다.

그러나, 상근이가 가지고 있는 숫자 카드의 개수는 최대 500000개이며, M 역시 최대 500000까지 주어집니다.

만약 위 방법처럼 **순차적으로** 탐색한다면, 최악의 경우에는 500000*500000으로 2500억 번의 연산을 해야합니다.

C언어는 1초에 대략 1억 번 연산을 하므로, 2500억 번의 연산은 2500초가 걸립니다. 이 문제에서 시간제한은 1초이므로 문제를 시간안에 해결할 수 없습니다.

따라서 퀵정렬로 상근이의 숫자 카드를 오름차순으로 정렬한 뒤 정수 M개를 하나씩 이분탐색으로 찾아야 합니다. 이분탐색은 절반씩 탐색하여 O(log₂n)의 시간복잡도이므로 최악의 경우여도 19번이면 500000개를 탐색할 수 있습니다. 총 시간은 19*500000으로 약 백만 번이므로 0.1초 안에 연산이 가능합니다.

이 외에도 문제를 풀다 보면 탐색을 해야 할 순간이 많습니다. 퀵정렬과 이분탐색을 하여 시간제한을 지키면서 풀어보세요! 다만 반드시 이분탐색 전에 정렬을 해야합니다.

### 마무리하며..

C언어는 다른 언어보다 코테를 보기에 귀찮은 점이 많은 것은 사실입니다. 그러나 다른 언어 못지않게 라이브러리 함수가 다양하고 특히 포인터 개념만 잘 안다면 활용하기 쉽습니다. C언어로 코테를 준비할 또 다른 분을 응원하며 마치도록 하겠습니다.












