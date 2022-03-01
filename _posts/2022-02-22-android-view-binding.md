---
layout: post
title:  "안드로이드 [Kotlin] - 뷰 바인딩 (View Binding)"
authors: [jminie-o8o]
tags: ["Android", "Kotlin"]
image: assets/images/post-android-view-binding/android-logo.png
description: "Android-logo"
featured: true
---
## 📌 왜 View Binding?  
##
Kotlin의 장점 중 하나는 findViewById를 쓰지 않아도 되는 점이다. kotlin extension으로 바로 접근이 가능했다. 그러나 코틀린 익스텐션이 deprecated 되었다.

[안드로이드 공식문서](#https://developer.android.com/topic/libraries/view-binding)

> 코틀린 안드로이드 익스텐션은 2021년 7월 지원이 중단되었다. 
> 따라서, 기존에 코틀린 안드로이드 익스텐션에서 제공하는 뷰 바인딩 기능을 사용하고 있던 개발자들은 이를 안드로이드 뷰 바인딩으로 이전해야 한다.
#
그렇다면 왜 지원이 중단되었을까?
- 전역 네임 스페이스를 오염시킨다.
- Kotlin 전용이다.
- View 가 null 허용 여부를 알려주지 않는 경우가 있다.

뷰 바인딩은 뷰와 상호작용하는 코드를 쉽게 해주는 기능이다. 뷰 바인딩을 허용하면 각 xml레이아웃마다 바인딩 클래스를 자동으로 생성하는데, 레이아웃에 ID가 있는 뷰에 직접 참조를 할 수 있다. 대부분의 상황에서 뷰 바인딩은 findViewById를 대체한다. 

## 📌 findViewById 와의 차이점
##
공식문서에서는 다음과 같이 설명한다.

뷰 바인딩에는 findViewById를 사용하는 것에 비해 다음과 같은 중요한 장점이 있다.

- **Null Safe** : 뷰 바인딩은 뷰의 direct references 즉 직접 참조를 생성하므로 유효하지 않은 뷰 ID로 인해 null 포인터 예외(NPE)가 발생할 위험이 없다. 즉 레이아웃에 아직 생성되지 않은 뷰의 참조를 얻어(null 상태) 해당 뷰의 속성을 사용하려 할 때 발생하는 NPE를 방지한다는 것이다. 또한 레이아웃의 일부 구성에만 뷰가 있는 경우 결합 클래스에서 참조를 포함하는 필드가 @Nullable로 표시된다.
- **Type Safe** : 각 바인딩 클래스에 있는 필드의 유형이 XML 파일에서 참조하는 뷰와 일치한다. 즉, 클래스 변환 예외가 발생할 위험이 없다. 쉽게 말해 타입을 가지고 있기 때문에 imageView.text 같이 타입이 다른 경우 발생하는 오류를 방지할 수 있다.

## 📌 코틀린에서 뷰 바인딩 설정 방법
### gradle 설정

```html
// 안드로이드 스튜디오 4.0 이상
android {
    ...
    buildFeatures {
        viewBinding = true
    }
}
```

```html
// 안드로이드 스튜디오 3.6 ~ 4.0
        android {
        ...
        viewBinding {
        enabled true
        }
}
```

안드로이드 3.6 보다 낮은 버전에서는 적용 되지 않는다는 점을 조심하자.  

### Activity에서 설정
###
```kotlin
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.viewbasic.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        val view = binding.root
        setContentView(view)
    }
}
```

클래스를 만들기 위하여 위와 같이 적어준다. inflate는 xml에 있는 뷰를 객체화해준다고 생각하면 된다.

원래는 R.layout.activity_main을 넘겨주지만 이번에는 우리가 생성한 루트 뷰를 넘겨준다.

### 바인딩 클래스 이름 규칙
###
바인딩 클래스 이름은 규칙이 정해져 있다.  

| Activity 이름  | Binding 클래스 이름  |
|:----------|:----------|
| MainActivity  | ActivityMainBinding  |
| SubActivity   | ActivitySubBinding   |
| XXXActivity   | ActivityXXXBinding   |

아래와 같이 binding 된 객체 안에 있는 id에 접근하여 사용하면 된다.

```kotlin
binding.button1.text = "안녕"
binding.button2.setBackgroundColor(Color.BLACK)
```

### Fragment에서 설정
###
```kotlin
class BlankFragment : Fragment() {
 
    private var _binding: ResultProfileBinding? = null
    
    // 이 프로퍼티는 onClickView 와 onDestroyView 사이에서만 유효하다.
    private val binding get() = _binding!!
 
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = ResultProfileBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.textView.text = "안녕"
    }
 
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

Activity 와 다른 점은 **onDestroyView** 에서 **binding** 에 **null** 을 집어넣어 준다는 것이다.  

그 이유를 공식문서에서는 다음과 같이 설명한다.
> Fragments outlive their views. Make sure you clean up any references to the binding class instance in the fragment's onDestroyView() method.

프래그먼트는 뷰보다 더 오래 살아남는다.

바인딩 클래스는 뷰에 대한 참조를 가지고 있는데 뷰가 제거될 때 즉 onDestroyView() 메서드가 작동할 때 이 바인딩 클래스의 인스턴스도 같이 정리해준다.

### 마치며
###

안드로이드 생태계는 최근 1,2년간 굉장히 급변하고 있다. 불과 1년 전에 나온 책으로 공부해도 수 많은 요소들이 deprecated 되어 그 책을 유물로 만들어 버린다.  
모바일 앱 생태계에서 살아남는 법은 꾸준히 공부하고 뒤쳐지지 않는 것임을 또 한번 느끼는 순간이다.



