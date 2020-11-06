---
title:  "[ Kotlin ] Coroutine 기본 정리 및 Android에서의 사용 방법"
authors: [sheele41]
tags: ["Mobile"]
image: https://oasisfores.com/wp-content/uploads/2020/11/post_main.png
---

# 시작하기 전에...
![coroutine\_gif](https://oasisfores.com/wp-content/uploads/2020/11/1_OEX52nKgM1SHGO4l1mvV1A.gif)  

**Coroutine**을 굳이 한 문장으로 표현하자면 **비선점(Non-Preemptive), 협력형(Cooperative) 멀티태스킹의 서브 루틴 형태로서 동시성(Concurrency)을 지원하며, 비동기 작업을 쉽게 처리할 수 있도록 도와주는 것**... 이라고 할 수 있습니다.  

네. 이렇게만 보면 대체 무슨 소리인지 이해가 하나도 되지 않습니다.  
Coroutine이라는 개념은 **Kotlin에만 국한된 것이 아니며** 세상에 모습을 드러낸 것은 이미 한참 전 일이기 때문에 동작 원리부터 하나하나 설명하기 시작하면 끝이 없어집니다.  

하지만 제목에도 적혀있듯이 이 글은**Android에서의 Kotlin Coroutine 사용법**을 알려주기 위한 글이고, 이 제목을 클릭하여 들어오신 분들은 Coroutine이 무엇인지, 어디에 쓰는지는 대충 알고 계신 상태일 것이라고 생각합니다.  
따라서 이번 글에서는 Coroutine의 개념적인 부분보다는 **실제로 Kotlin Android 앱 개발에서 Coroutine이 어떤 방식으로 사용되는지**를 위주로 진행하려고 합니다. (여러분의 시간은 소중하니까요.)  
Coroutine이 무엇이고 어떻게 동작하는지에 대해서는 인터넷에 잘 쓰여진 글들이 정말 많으니 개인적으로 찾아보시면 도움이 될 것입니다.  
<br>
<br>

# Coroutine 사용을 위한 사전 준비
긴 말 필요 없이 바로 Coroutine을 만들어보...기 전에 우선 **Dependency를 추가**해주어야 합니다.  
간단히 **build.gradle (:app)** 파일에 다음 코드를 입력해줌으로써 Coroutine을 사용할 수 있습니다.  
``` {.lang:default .decode:true}
dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.9'
}
```
이 외에도 다양한 요소에 대한 Coroutine을 사용하고 싶다면 다음 링크를 참조하시기 바랍니다. ([https://developer.android.com/kotlin/ktx?hl=ko\#viewmodel](https://developer.android.com/kotlin/ktx?hl=ko#viewmodel))  
<br>
<br>

# Coroutine 만들기

이제 진짜 Coroutine을 만들어봅시다. 기본적으로 Coroutine은 다음과 같은 형태로 만들 수 있습니다.  

![basic\_coroutine](https://oasisfores.com/wp-content/uploads/2020/11/basic_coroutine.png) 

아이고... 뭔가 또 복잡하죠? 일단 위에건 잊어버리고 그냥 아주 단순한 Coroutine을 하나 만들어봅시다.  
1초 뒤에 Work is Done! 문자열이 출력되는 간단한 루틴입니다.  
위 사진과 비교했을 때 **어떤 자리에 어떤 단어가 들어갔는지**를 잘 보시면 이해에 도움이 되실 겁니다.  

``` {.lang:default .decode:true}
val scope = CoroutineScope(Dispatchers.IO)    // CoroutineScope 생성
val job = scope.launch{    // 아래 코드를 방금 만들어준 CoroutineScope에서 실행
    delay(1000)
    println("Work is done!")
}
```

우선 **전체적인 흐름**을 설명드리면
1. **CoroutineContext**를 이용하여 Coroutine이 실행될 **CoroutineScope**를 만들고
2. 만들어준 **CoroutineScope**에서 **CoroutineBuilder**를 이용하여 { } 안의 코드를 Coroutine으로 실행시킵니다.

Coroutine이라는 단어가 너무 많네요. 위 코드를 기준으로 바꿔볼까요? 
1. **Dispatchers.IO**를 이용하여 Coroutine이 실행될**CoroutineScope**를 만들고
2. 만들어준 **CoroutineScope**에서 **launch**를 이용하여 { } 안의 코드를 Coroutine으로 실행시킵니다.

어떠신가요? 아직 잘 와닿지 않으시죠?  
각 요소가 무엇을 의미하는지는 이후 차근차근 설명드릴테니 우선 **Coroutine의 세 가지 구성 요소와 흐름**만 기억해주세요!

#### **Context**로 **Scope**를 만들고, **Builder**를 이용하여 그 **Scope** 안에서 실행!  
<br>
<br>


# 첫 번째, CoroutineContext

Coroutine 구성 요소 그 첫 번째, **CoroutineContext**입니다.  
말 그대로 Coroutine이 실행될 **Context**, '맥락'을 지정해주는 것인데요.  
간단한 예로 **올림픽 경기**를 생각해볼 수 있습니다.  
'Coroutine 얘기 하다 말고 갑자기 웬 올림픽이냐' 라고 하실 수도 있겠지만 일단 그냥 생각해보자구요. \^\^  

올림픽 경기에는 수영, 달리기, 양궁, 등과 같이 여러가지 종목이 있습니다.  
여러가지 종목이 있는 만큼 경기장 또한 여러 개 존재하겠죠?  
이 때 경기에 참가하는 선수들은 **자신의 종목에 맞게 각 경기장에 위치**해있을 것입니다.  
Coroutine 또한 이와 같습니다. 무슨 소리냐구요?  
우리가 만들어줄 **Coroutine을 선수, CoroutineContext를 경기장**으로 생각하시면 됩니다.  

결국 CoroutineContext를 설정해준다는 것은 **Coroutine의 실행 목적에 맞게 실행될 특정 Thread Pool을 지정**해주는 것이라고 할 수 있습니다.  
(수영 선수가 육상 경기장에 가있으면 안되겠죠? \^\^)  

![basic\_coroutine](https://oasisfores.com/wp-content/uploads/2020/11/basic_coroutine.png)  

위 그림을 보시면 알 수 있듯이 CoroutineContext에는 Job, Dispatcher.Main, IO, Default... 등이 있고 각각이 의미하는 것은 아래와 같습니다. (Job에 대한 내용은 이후에 다룰 것입니다.)  

**Dispatcher.Main : UI를 구성하는 작업이 모여있는 쓰레드 풀**  
**Dispatcher.IO : (파일 혹은 소켓을) 읽고 쓰는 작업이 모여있는 쓰레드 풀**  
**Dispatcher.Default : 기본 쓰레드 풀, CPU 사용량이 많은 작업에 적합**  
(이외에도 잘 쓰이지는 않지만 특정 목적을 위해 사용되는 몇몇 쓰레드 풀이 존재하니 자세한 것은 공식 문서를 참조하시면 좋습니다.)  

위 내용을 참조하여 만들어줄 Coroutine의 작업 내용에 맞게 Thread Pool을 선택하면 됩니다.  
파일을 읽고 쓰는 작업이라면 IO를, UI 관련 작업이라면 Main을 선택하면 되겠죠?  

Coroutine에서 CoroutineContext를 지정해주는 방법은 아래와 같이 **CoroutineScope, 혹은 CoroutineBuilder에서 넘겨주는 것**인데 이 두 방식의 차이점은 이후에 따로 설명하도록 하겠습니다.  

``` {.lang:default .decode:true}
val scope = CoroutineScope(Dispatchers.Main)

scope.launch {
    // Foreground
}

scope.launch(Dispatchers.Default) {
    // Background
}
```

<br>
<br>

# 두 번째, CoroutineScope
Coroutine 구성 요소 그 두 번째, **CoroutineScope**입니다.  
CoroutineContext로 Coroutine이 어디서 실행될지를 정해주었다면 이 **Coroutine을 제어할 수 있는 Scope, '범위'를 지정**해주어야 합니다.  
이때 말하는 제어라는 것은 **작업을 취소**시키거나, **어떤 작업이 끝날 때까지 기다리는 것**을 의미합니다.  

**CoroutineScope의 종류**는 크게 두 가지가 있습니다.  

**1. 사용자 지정 CoroutineScope**  

``` {.lang:default .decode:true}
val scope = CoroutineScope(CoroutineContext ex. Dispatchers.Main...)
val job = scope.launch{
    // TODO
}
```

가장 기본이 되는 방식의 CoroutineScope입니다.  
이를 이용하면 **특정 Coroutine이 필요해질 때마다 새로 선언해주고, 필요 없어지면 종료**되도록 할 수 있습니다.  

예를 들어 어떤 Activity에 보여줄 데이터를 Coroutine으로 불러오고 있다고 생각해봅시다.  
만약 해당 Activity가 도중에 갑자기 종료된다면 **불러오고 있는 데이터는 더 이상 필요가 없으므로 Coroutine도 함께 종료**되어야 합니다.  
이 때 **CoroutineScope를 Activity의 Life-Cycle에 맞춰주면 Activity가 종료될 때 Coroutine도 함께 종료**되도록 만들어 줄 수 있습니다.  

<br>

**2. GlobalScope**  

``` {.lang:default .decode:true}
public object GlobalScope : CoroutineScope {
    /**
     * Returns [EmptyCoroutineContext].
     */
    override val coroutineContext: CoroutineContext
        get() = EmptyCoroutineContext
}
```

``` {.lang:default .decode:true}
GlobalScope.launch{
    // TODO
}
```

CoroutineScope의 특별한 형태로, **앱이 실행될 때부터 앱이 종료될 때까지 Coroutine을 실행시킬 수 있는 Scope**입니다.  
어떤 Activity에서 GlobalScope를 통해 실행된 Coroutine은 **Activity가 종료되어도 해당 Coroutine이 완료될 때까지 동작**합니다.  
**앱이 실행되는 동안 장시간, 혹은 주기적으로 실행되어야 하는 Coroutine에 적합**하며, **필요할 때만 수행되어야 하는 Coroutine은 사용자 지정 CoroutineScope 사용이 권장**됩니다.  
CoroutineScope에 대한 자세한 사용 방법은 아래에서 실제 예시와 함께 다룰 예정입니다.  
<br>
<br>

# 세 번째, CoroutineBuilder
대망의 마지막, **CoroutineBuilder**입니다.  
**CoroutineBuilder의 본질**은 결국 **설정해준 Context와 Scope를 통해 Coroutine을 실행시켜주는 '함수'**입니다.  
미사일을 쏠 때 launch 버튼을 누르는 것과 같이 **launch(혹은 async)로 시작된 Coroutine은 내 손을 떠나 제 갈길을 가게 되죠.**  

**CoroutineBuilder의 종류**로는 **launch{}, async{}**이 있으며 CoroutineScope의 확장함수로써 **{} 내부의 코드를 Coroutine으로 실행시켜주는 역할**을 합니다.

**{} 내부의 Coroutine들이 모두 완료될 때까지 현재 Thread를 Blocking하는 runBlocking{}도 있지만 Coroutine의 장점인 '일시 중단'을 못 쓰게 되어버리므로 사용이 권장되지 않습니다.**  
**특히 UI 작업을 관장하는 Main Thread에서 runBlocking을 사용하여 Thread를 장시간 점유하고 있을 경우 ANR (Application Not Responding)이 발생할 수 있습니다.**

그렇다면 **launch와 async의 차이**는 무엇일까요?  
**두 함수는 동일한 기능을 하지만 다른 객체를 반환**합니다.  
**launch로 실행된 Coroutine은 Job 객체를 반환**하고, **async로 실행된 Coroutine은 Deferred 객체를 반환**합니다.  
(Job과 Deferred의 차이점은 Coroutine을 제어만 하는가 Coroutine의 결과도 받을 수 있는가인데 내용이 길어지므로 생략하도록 하겠습니다.)

``` {.lang:default .decode:true}
val job = scope.launch {    // Job
    // launch TODO
}

val deferred = scope.async {    // Deferred
    // async TODO
}
```

이렇게 반환된 **Job, Deferred 객체를 이용하여 각 Coroutine을 제어(취소, 대기...)** 할 수 있으며 각 객체에 대한 확장함수 및 필드는 [공식 문서](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html)에 기술되어 있습니다.

아래 코드는 Job의 확장함수인**join()을 이용하여 Coroutine이 완료될 때까지 기다리는 예시** 로, 결과는 **Hello, World!** 입니다.

``` {.lang:default .decode:true}
val job = GlobalScope.launch { // launch a new coroutine and keep a reference to its Job
    delay(1000L)
    println("Hello, ")
}
job.join() // wait until child coroutine completes
println("World!")
```

**추가) GlobalScope와 Job** GlobalScope 사용을 지양해야하는 이유는 바로 이 Job에 있습니다.  
**GlobalScope에는 연결된 Job이 없기 때문**에 구조화된 동시성에서 얻을 수 있는 모든 이점이 사라지며, GlobalScope를 사용하는 코루틴에서 예외를 발생해도 다른 코루틴에 영향을 미치지 않습니다.  
**구조화된 동시성이 느슨해지는 것입니다.**  
<br>
<br>

# Coroutine 사용법 바로잡기
이제 Coroutine의 기본 구성 요소들은 전부 알아보았으니 **실제로 Coroutine이 어떤 형식으로 사용되는지** 알아봅시다.  
**비슷비슷하지만 조금씩 다른 코드가 완전히 다른, 혹은 동일한 기능**을 할 수도 있기 때문에 헷갈리는 부분을 분명하게 잡아두는 것이 중요합니다.

#### 1. CoroutineContext의 위치

  

``` {.lang:default .decode:true}
val scope = CoroutineScope(Dispatchers.Main)

scope.launch {    // Main에서 실행
    // Coroutine1
}

scope.launch(Dispatchers.Default) {    // Default에서 실행
    // Coroutine2
}
```

앞서 말씀드렸듯이 **CoroutineContext는 CoroutineScope에서 지정될 수도 있고 CoroutineBuilder에서 지정될 수도 있는데요.**  
결론부터 말씀드리자면 **어떤 CoroutineScope에서 작동되는 Coroutine들은 기본적으로 자신이 속해있는 CoroutineScope의 CoroutineContext를 그대로 받아오지만, CoroutineBuilder에서 따로 CoroutineContext 설정을 해준다면 해당 CoroutineBuilder로 실행되는 Coroutine은 그 CoroutineContext를 따라갑니다.**  
최대한 간단하게 설명하려고 한건데 제가 봐도 잘 안 읽히네요... 

예를 들자면 **UI 작업을 진행하는 여러개의 Coroutine들이 모여있는 CoroutineScope에서 하나의 Coroutine만 Background 작업으로 돌리고 싶을 때** 이러한 방식을 사용합니다.  
위 코드를 한번 볼까요?
1) 제일 처음에 CoroutineScope에서 Dispatchers.Main으로 CoroutineContext가 한 번 지정되고 
2) 그 아래에서 launch로 Coroutine1이 실행된 다음 3) 그 아래에서 launch(Dispatchers.Default)로 Coroutine2가 실행됩니다. 

이때 **Coroutine1은 Main(Foreground) Thread**에서 실행되고 **Coroutine2는 Default(Background) Thread**에서 실행됩니다.  
**CoroutineScope에 기본값(Default)이 될 CoroutineContext를 지정해주고 특정 CoroutineBuilder에는 특별한 CoroutineContext를 지정**해준다는 느낌으로 이해하시면 됩니다. 

그렇다면 다음과 같은 경우는 어떨까요? 


``` {.lang:default .decode:true}
val scope = CoroutineScope(Dispatchers.Main)    // CoroutineScope1

CoroutineScope(Dispatchers.Default).launch {
    // CoroutineScope2, Background Running
}

scope.launch(Dispatchers.Default) {
    // CoroutineScope1, Background Running
}
```

**첫 번째 Coroutine**은 처음에 선언한 CoroutineScope - 1과 **별개로 새로운 CoroutineScope - 2(Dispatchers.Default)를 선언**하여 **Dispatchers.Default 상에서 실행**됩니다.  
**두 번째 Coroutine은 처음**에 선언한 CoroutineScope - 1(Dispatchers.Main)에서 돌아가는 Coroutine이지만 **CoroutineBuilder 단에서 CoroutineContext를 Dispatchers.Default로 재설정해주므로 역시 Dispatchers.Default 상에서 실행**됩니다.  
결과적으로 **두 Coroutine 모두 Background(Dispatchers.Default)에서 실행**된다는 것을 알 수 있는데요.   이때 두 Coroutine의 CoroutineScope가 서로 다르므로 둘 중 하나의 작업을 취소해도 나머지 작업은 영향을 받지 않습니다.  
<br>

#### 2. Job

``` {.lang:default .decode:true}
val job = scope.launch {    // Job
    // launch TODO
}
```

우리는 위와 같은 방식으로 **각 Coroutine에 대한 Job 객체를 반환받아 각각의 Coroutine을 제어**할 수 있다는 사실을 알고있습니다.  
하지만 만약 **한 CoroutineScope 내에 여러 개의 자식 Coroutine이 존재하고 그 Coroutine들을 한번에 관리**하려면 어떻게 해야할까요?  
동시에 종료되어야 하는 모든 Coroutine에 각각의 job1, job2, job3...를 연결해주고 마지막에 하나하나 .cancel로 취소해주는 것은 상상하기만 해도 끔찍합니다.  

다행히도 **Job 또한 CoroutineContext의 일종**이라는 것을 이용하면 그럴 필요가 없습니다.  

``` {.lang:default .decode:true}
suspend fun main() = coroutineScope {
    val job = Job()
    CoroutineScope(Dispatchers.Default + job).launch {
        launch{
            println("Coroutine1 Start")
            delay(1000)
            println("Coroutine1 End")
        }
        launch{
            println("Coroutine2 Start")
            delay(2000)
            println("Coroutine2 End")
        }
    }
    delay(300)
    job.cancel()
    delay(3000)
    println("All Done!")
}
```

**하나의 Job 객체를 선언하고 새로 생성될 CoroutineScope에서 객체를 초기화**하면 이 CoroutineScope의 Child까지 모두 영향을 받는 Job으로 활용이 가능합니다.  
**어떤 CoroutineScope 내부의 Coroutine들은 기본적으로 자신이 속한 CoroutineScope의 Context를 상속받으니까요.**  

이러한 표현 방식은 이후 **Activity의 Life-Cycle을 따르는 Coroutine을 생성할 때 유용하게 사용**됩니다.

![result\_coroutine](https://oasisfores.com/wp-content/uploads/2020/11/result_coroutine-e1604513656990.png) 

부모 CoroutineScope의 Job을 cancel 하므로 위 코드의 결과는 **Coroutine1 Start Coroutine2 Start** 가 됩니다.  
코드의 실행 결과는 [https://kotlinlang.org/\#try-kotlin](https://kotlinlang.org/#try-kotlin)에서 직접 확인하실 수 있습니다.  
<br>

#### 3. Coroutine의 부모 - 자식 관계

**Coroutine에는 부모 - 자식 관계**가 있으며 다음과 같은 특징이 존재합니다.  
(위와 같은 방법이 사용 가능한 이유도 바로 이 특징 덕분입니다.) 

**부모 Coroutine이 취소되면 자식 Coroutine도 Recursive하게 취소된다.**  
**부모 Coroutine은 자식 Coroutine이 모두 완료될 때 까지 대기한다.**  

그런데 여기서 또 헷갈리기 쉬운게 어떤 **CoroutineScope 안에 코드가 적혀있다고 모두 자식 Coroutine은 아니라는 것**입니다.

``` {.lang:default .decode:true}
suspend fun main() = coroutineScope {
    val job = Job()
    CoroutineScope(Dispatchers.Default + job).launch {
        launch{    // Child / Cancel
            println("Coroutine1 Start")
            delay(1000)
            println("Coroutine1 End")
        }
        CoroutineScope(Dispatchers.IO).launch{    // Not Child / No Cancel
            println("Coroutine2 Start")
            delay(1500)
            println("Coroutine2 End")
        }
        CoroutineScope(Dispatchers.IO + job).launch{    // Child / Cancel
            println("Coroutine3 Start")
            delay(2000)
            println("Coroutine3 End")
        }
    }
    delay(300)
    job.cancel()
    delay(3000)
    println("Final Done")
}
```

위 코드를 한 번 보시죠. 아까와 비슷한 코드입니다.  
**하나의 launch 안에 Coroutine이 여러 개 존재**하고 있는 것을 확인할 수 있는데요.  
결론부터 말씀드리면 **job.cancel()을 이용하여 최상위 Coroutine을 취소해도 두 번째 Coroutine은 취소되지 않습니다.**

![result\_coroutine2](https://oasisfores.com/wp-content/uploads/2020/11/result_coroutine2-e1604513673714.png)

이러한 결과가 나타나는 이유가 무엇일까요?  
바로 **제어 범위, 즉 CoroutineScope가 다르기 때문**입니다.

``` {.lang:default .decode:true}
CoroutineScope(Dispatchers.IO).launch{    // Not Child / No Cancel
    println("Coroutine2 Start")
    delay(1500)
    println("Coroutine2 End")
}
```

두 번째 Coroutine은 **기존 Scope와 관계없이 새로운 CoroutineScope를 생성하여 Coroutine을 실행**시키는 방식입니다.  
따라서 **외부 CoroutineScope.launch의 취소 여부는 두 번째 Coroutine에 어떠한 영향도 미치지 않으므로 계속 실행**될 수 있는 것입니다.

그런데 여기서 이상한 점이 하나 있습니다. **세 번째 Coroutine 또한 CoroutineScope를 새로 생성하는 방식인데 왜 취소된 걸까요?**

``` {.lang:default .decode:true}
CoroutineScope(Dispatchers.IO + job).launch{    // Child / Cancel
    println("Coroutine3 Start")
    delay(2000)
    println("Coroutine3 End")
}
```

그에 대한 해답은 바로 **CoroutineContext의 + job**에 있습니다.  
**따로 생성한 CoroutineScope를 이용하는 것도 모자라 Thread Pool까지 다르지만 이 + job 덕분에 상위 Coroutine의 영향을 받는 것입니다.**  
이처럼 CoroutineContext의 일종인 Job을 잘 이용하면 **상위 Coroutine과 하위 Coroutine 사이의 관계**를 나타낼 수 있습니다.  
<br>

#### 4. suspend

``` {.lang:default .decode:true}
suspend fun myCoroutine() {
    delay(1000)
    println("myCoroutine")
}
```

위와 같이 **어떠한 함수 내부에서 Coroutine(suspend function)을 실행할 수 있게** 만들어주려면 **suspend** 라는 단어를 붙여주어야 합니다.  
**suspend**를 붙여줌으로써 **해당 함수는 하나의 Coroutine으로 동작하기 위한 자격**을 얻게되며, **일시중지 및 재개(suspend & resume)이 가능**해집니다.  
이렇게 만들어진 **suspend function**은 아무데서나 사용될 수 없고 어떠한 **Coroutine 혹은 suspend function 내부에서 사용**되어야 합니다. (일반 영역에서 사용 시 Compile Error)   
<br>
<br>

# Android에서 Kotlin Coroutine 사용하기

최대한 간결한 글을 쓰고 싶었는데 이것저것 넣다보니 앞부분이 너무 길어졌네요.  
그래도 드디어 본론! **Android에서 Kotlin Coroutine 사용하기**입니다.  
앞부분에서 대부분의 내용을 다 설명해버렸기 때문에 간단한 예시만 보여드리고 글을 마치려고 합니다.

Android 환경에서는 Coroutine을 사용할 때 **Activity에 CoroutineScope를 상속받아 Coroutine을 Activity Life-Cycle에 맞추는 것을 권장**하고 있습니다.  
이제 이 정도는 무슨 내용인지 다 이해할 수 있으시죠? \^\^ 

위 내용을 MainActivity에 적용한 코드는 아래와 같습니다. 

``` {.lang:default .decode:true}
class MainActivity : AppCompatActivity(), CoroutineScope {
    lateinit var job: Job
    override val coroutineContext: CoroutineContext
        get() = Dispatchers.Default + job

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        job = Job()

        launch {
            // Coroutine
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        job.cancel()    // Activity 종료 시 진행 중인 Coroutine 취소
    }
}
```

어려울 것 전혀 없습니다.  
MainActivity에 **CoroutineScope interface를 상속**받아 CoroutineContext를 설정해주고, **onDestroy() 함수에 job.cancel()을 작성하여 Activity 종료 시 진행중인 Coroutine이 모두 취소**되게 한 것입니다.  
CoroutineContext를 설정하는 방식에 약간의 거부감이 있을 수는 있겠지만 찬찬히 살펴보면 결국 우리가 알고 있는 방식과 별 다를 바가 없다는 것을 알 수 있습니다.

위와 같이 Coroutine을 사용하기 위한 기본 설정이 끝났다면 **onCreate, onResume과 같은 함수에서 CoroutineScope 선언 없이 바로 launch{} 혹은 async{}를 이용하여 Coroutine을 실행**시킬 수 있습니다.  
이 때 onCreate 함수 자체는 CoroutineBuilder의 { } 내부가 아니므로 **job.join()과 같은 suspend 함수를 바로 사용할 수는 없음**에 주의해야 합니다. 

Activity는 따로 제공되는 Coroutine 모듈이 없지만 ViewModel이나 Room과 같은 몇몇 객체를 위한 Coroutine 모듈은 [공식적으로 배포](https://developer.android.com/kotlin/ktx?hl=ko)되고 있으니 참고하시면 더욱 다채로운 기능 구현이 가능할 것입니다.  
<br>
<br>

# 마치며...

이렇게 길고도 긴 **'Android에서 Kotlin Coroutine 사용하기'** 가 끝났습니다.  
정신차려보니 Android는 온데간데 없고 Kotlin Coroutine만 남아있네요 \^\^; 

글을 마치기 전에 제가 설명하지 않았던 부분을 마지막으로 정리해드리려고 합니다.  
글의 길이가 너무 길어질 것 같아서 뺐던 내용들인데, 중요하지 않은 내용인 것은 아니니 따로 찾아서 공부하시면 반드시 도움이 될 것입니다.

**1. Coroutine은 무엇인지, 그리고 동작 원리**  
**2. Job과 Deferred의 차이점**  
**3. 예외 처리 및 디버깅**  
**4. Dispatchers의 다른 필드**  

이상으로 글을 마치겠습니다. 감사합니다. \^\^
