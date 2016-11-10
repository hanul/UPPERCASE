# UPPERCASE-CORE-BROWSER
UPPERCASE-CORE-BROWSER는 웹 브라우저 환경에서 사용할 수 있는 모듈입니다. [UPPERCASE-COMMON-CORE](UPPERCASE-COMMON-CORE.md)를 포함하고 있습니다.
* [API 문서](../../API/UPPERCASE-CORE/BROWSER/README.md)

## 목차
* [사용방법](#사용방법)
* [`BROWSER_CONFIG`](#browser_config)
* [`INFO`](#info)
* [창 관련 기능](#창_관련_기능)
* [DOM 객체 생성](#dom_객체_생성)
* [DOM 객체의 이벤트](#dom_객체의_이벤트)
* [DOM 객체의 스타일](#dom_객체의_스타일)
* [DOM 객체의 애니메이션](#dom_객체의 애니메이션)
* [뷰 기능](#뷰_기능)
* [HTTP 요청 기능](#http-요청-기능)
* [`CONNECT_TO_WEB_SOCKET_SERVER`](#connect_to_web_socket_server)
* [`STORE`](#store)
* [`MSG({ko:, en:, ...})`](#msgko-en-)
* [`SHOW_ERROR`](#show_error)
* [`SOUND`](#sound)

## 사용방법
`UPPERCASE-CORE` 폴더를 복사하여 사용합니다.

```html
<script src="/UPPERCASE-CORE/BROWSER.js"></script>
```

## `BROWSER_CONFIG`
UPPERCASE 기반 프로젝트에서 웹 브라우저 환경 전용 설정값들을 저장하는 데이터입니다. UPPERCASE의 다른 모듈들도 이를 확장하여 사용합니다. UPPERCASE-CORE-BROWSER에서는 아래와 같은 설정값들을 가지고 있습니다.

* `host` 현재 접속한 URL의 호스트
* `port` 현재 접속한 URL의 포트 번호
* `isSecure` 현재 접속한 URL이 HTTPS 프로토콜인지 여부

## `INFO`
웹 브라우저 정보를 담고 있는 객체

`INFO`의 함수들은 다음과 같습니다.

### `INFO.getLang()`
2글자로 이루어진 현재 웹 애플리케이션의 언어 설정 코드를 가져옵니다. 기본은 브라우저의 언어 설정으로 설정됩니다.

```javascript
INFO.getLang(); // 'ko'
```

### `INFO.changeLang(lang)`
현재 웹 애플리케이션의 언어 설정을 변경합니다. 이는 [`MSG`](#msg)에 영향을 끼칩니다.

```javascript
INFO.changeLang('ko');
```

### `INFO.checkIsTouchMode()`
터치 모드인지 확인합니다. 터치로만 조작이 가능한 기기에서는 항상 `true`를 반환하고, 마우스로만 조작이 가능한 기기에서는 항상 `false`를 반환합니다. 터치와 마우스 조작 둘 다 가능한 기기에서는 터치를 하는 순간 혹은 마우스를 조작하는 순간 변경됩니다.

```javascript
INFO.checkIsTouchMode(); // 스마트폰에서는 true, PC에서는 false
```

### `INFO.getBrowserInfo()`
웹 브라우저의 정보를 반환합니다.

```javascript
INFO.getBrowserInfo(); // ex) {name : "Chrome", version : 53}
```

## 창 관련 기능
### `TITLE()` `TITLE(title)`
브라우저 창에 표시되는 문서의 제목을 가져오거나 변경합니다.
```javascript
TITLE('Welcome!');

TITLE(); // 'Welcome!'
```

### `WIN_WIDTH()`
브라우저 창의 가로 길이를 픽셀 단위로 가져옵니다.

### `WIN_HEIGHT()`
브라우저 창의 세로 길이를 픽셀 단위로 가져옵니다.

### `SCROLL_LEFT()`
가로 스크롤의 현재 위치를 픽셀 단위로 가져옵니다.

### `SCROLL_TOP()`
세로 스크롤의 현재 위치를 픽셀 단위로 가져옵니다.

## DOM 객체 생성
웹 서비스가 단순히 정보를 제공하기 위한 웹 사이트였던 과거와는 달리, 현대에는 SNS나 게임과 같은 동적인 애플리케이션이 많아지고 있습니다. 이러한 웹 애플리케이션이 작동하기 위해서는 웹 페이지를 구성하는 DOM 객체가 시시각각 변해야 합니다.

### HTML로 DOM 객체 생성
HTML 코드와 JavaScript 코드가 분리되어 있는 기존 웹 개발 방식으로는, DOM 객체를 다루는 코드를 작성하기가 굉장히 불편합니다. JavaScript 코드에서 DOM 객체를 일일히 찾아내어 다뤄야 하기 때문입니다. 또한 DOM 객체를 찾기 위하여, HTML 요소에 `id` 나 `class` 속성을 반드시 지정해야 합니다. 이는 HTML이 원래 정보 제공을 위한 문서 작성을 목적으로 만들어졌기 때문입니다.

```html
<html>
    <head>
        <style>
            #hello {
                color : red;
            }
        </style>
    </head>
    <body>
        <p id="hello">안녕하세요.</p>
        <script>
        
            var
            // hello
            hello = document.getElementById('hello');
            
            // 빨간색인 글자 색을 파란색으로 변경
            hello.style.color = 'blue';
        
        </script>
    </body>
</html>
```

### JavaScript로 DOM 객체 생성
위와 같이 HTML 요소를 JavaScript에서 일일히 찾는 방식은 **웹 애플리케이션**을 개발하는데에는 적합하지 않습니다. 그렇다면, JavaScript에서 DOM 객체를 직접 생성하여 다루면 어떨까요? 그러면 DOM 객체를 찾는 과정이 없어지기 때문에 좀 더 쉽게 DOM 객체를 다룰 수 있습니다. 그러나 이 방법은 JavaScript 코드가 복잡해진다는 단점이 있습니다.

```javascript
var
// hello
hello = document.createElement('p');
hello.style.color = 'red';
hello.appendChild(document.createTextNode('안녕하세요.'));
document.body.appendChild(hello);

// 빨간색인 글자 색을 파란색으로 변경
hello.style.color = 'blue';
```

### UPPERCASE의 DOM 객체 생성 기능
UPPERCASE의 DOM 객체 생성 기능을 사용하면, JavaScript에서의 DOM 객체 생성을 명료하게 표현할 수 있어 보다 이해하기 쉬운 코드를 만들어 냅니다.

```javascript
var
// hello
hello = P({
    style : {
        color : 'red'
    },
    c : '안녕하세요.'
}).appendTo(BODY);

// 빨간색인 글자 색을 파란색으로 변경
hello.addStyle({
    color : 'blue'
});
```

### `NODE`
일반적으로 웹 페이지를 구성하는 DOM 요소들은 [트리 구조](https://ko.wikipedia.org/wiki/%ED%8A%B8%EB%A6%AC_%EA%B5%AC%EC%A1%B0)로 이루어지게 됩니다. 따라서 DOM 객체를 살펴보기 전에, 노드로 이루어진 트리 구조를 정의하기 위한 `NODE` 클래스를 먼저 살펴보겠습니다. 아래의 DOM 객체를 생성하는 모든 기능들은 이 `NODE` 클래스를 상속하여 구현되어 있습니다. 또한 개발자가 `NODE`를 상속하여 새로운 종류의 노드를 만들어 낼 수 있습니다.

```javascript
// 이미지와 텍스트를 동시에 보여주는 NODE 요소
ImageAndText = CLASS({

	preset : function() {
		return NODE;
	},

	init : function(inner, self, params) {
		//REQUIRED: params
		//REQUIRED: params.img
		//REQUIRED: params.text

		var
		// img
		img = params.img,

		// text
		text = params.text,

		// wrapper
		wrapper,
		
		// content
		content;
		
		wrapper = DIV({
		    c : content = P({
    			c : [img, BR(), text]
    		})
		});
		
		inner.setWrapperDom(wrapper);
		inner.setContentDom(content);
	}
});
```

`NODE`를 상속한 클래스 내부에서 사용 가능한 함수들은 다음과 같습니다.

- `inner.setWrapperDom(dom)` 외부 DOM을 지정합니다.
- `inner.setContentDom(dom)` 내부 DOM을 지정합니다.
- `inner.setDom(dom)` 외부 DOM과 내부 DOM이 동일한 경우 둘을 같은 DOM으로 지정합니다. `inner.setWrapperDom`과 `inner.setContentDom`을 같은 `dom`으로 동시에 실행한 것과 같습니다.

`NODE`를 상속한 클래스로 생성한 객체에 존재하는 함수들은 다음과 같습니다.

### 내부, 외부 DOM 관련
- `getWrapperDom()` 외부 DOM을 반환합니다.
- `getContentDom()` 내부 DOM을 반환합니다.
- `getWrapperEl()` 외부 DOM의 [`HTML element`](https://en.wikipedia.org/wiki/HTML_element)를 반환합니다.
- `getContentEl()` 내부 DOM의 [`HTML element`](https://en.wikipedia.org/wiki/HTML_element)를 반환합니다.

### 트리 구조 관련
```javascript
var
// div
div = DIV().appendTo(BODY);

div.append(P({
    c : '동해물과 백두산이 마르고 닳도록'
}));

P({
    c : '하느님이 보우하사 우리 나라 만세'
}).appendTo(div);

div.prepend(H1({
    c : '애국가'
}));
```
다음 함수들을 통해, 노드를 추가하거나 제거하는 등 트리 구조를 구현할 수 있습니다.
- `append(node)` 주어진 노드를 현재 노드 내의 맨 뒤에 자식 노드로 붙힙니다.
- `appendTo(node)` 현재 노드가 주어진 노드 내의 맨 뒤에 자식 노드로 붙습니다.
- `prepend(node)` 주어진 노드를 현재 노드 내의 맨 앞에 자식 노드로 붙힙니다.
- `prependTo(node)` 현재 노드가 주어진 노드 내의 맨 앞에 자식 노드로 붙습니다.
- `after(node)` 주어진 노드를 현재 노드의 바로 뒤에 붙힙니다.
- `insertAfter(node)` 현재 노드를 주어진 노드의 바로 뒤에 붙힙니다.
- `before(node)` 주어진 노드를 현재 노드의 바로 앞에 붙힙니다.
- `insertBefore(node)` 현재 노드를 주어진 노드의 바로 앞에 붙습니다.
- `getChildren()` 현재 노드의 모든 자식 노드들을 반환합니다.
- `getParent()` 현재 노드의 부모 노드를 반환합니다.
- `empty()` 현재 노드의 모든 자식 노드들을 지웁니다.
- `remove()` 현재 노드를 지웁니다.

### 이벤트 관련
```javascript
var
// button
button = DIV({
    c : '저를 눌러주세요.'
}).appendTo(BODY);

button.on('tap', function() {
    alert('아야! 너무 세게 누르셨어요!');
});
```
현재 노드에 이벤트를 추가하거나 제거할 수 있습니다. 이벤트에 관한 자세한 내용은 [DOM 객체의 이벤트](#dom_객체의_이벤트)를 참고하시기 바랍니다.
- `on(eventName, eventHandler)` 현재 노드에 이벤트를 추가합니다.
- `off(eventName, eventHandler)` `off(eventName)` 현재 노드에서 주어진 이벤트를 제거합니다. `eventHandler`를 지정하지 않으면, `eventName`의 이름으로 등록된 모든 이벤트를 제거합니다.

### 스타일 관련
```javascript
var
// red box
redBox = DIV({
    c : '빨간 박스'
}).appendTo(BODY);

redBox.addStyle({
    backgroundColor : 'red',
    color : 'yellow',
    padding : 10
});
```
현재 노드에 스타일을 추가할 수 있습니다. 스타일에 관한 자세한 내용은 [DOM 객체의 스타일](#dom_객체의_스타일)를 참고하시기 바랍니다.
- `addStyle(style)` 현재 노드의 스타일을 지정합니다.
- `getStyle()` 현재 노드의 스타일 정보를 반환합니다.
- `getWidth()` 현재 노드의 가로 길이를 반환합니다.
- `getInnerWidth()` 외부 여백을 제외한 가로 길이를 반환합니다.
- `getHeight()` 현재 노드의 세로 길이를 반환합니다.
- `getInnerHeight()` 외부 여백을 제외한 세로 길이를 반환합니다.
- `getLeft()` 현재 노드가 화면에서 왼쪽으로부터 얼마나 떨어져 있는지 반환합니다.
- `getTop()` 현재 노드가 화면에서 위쪽으로부터 얼마나 떨어져 있는지 반환합니다.
- `hide()` 현재 노드를 숨깁니다.
- `show()` 현재 노드를 숨기지 않습니다.
- `checkIsShowing()` 현재 노드가 보여지고 있는지 확인합니다.

#### 스크롤 관련
```javascript
var
// div
div = DIV({
    style : {
        overflow : 'scoll',
        width : 100,
        height : 100
    },
    c : '이 DIV는 스크롤이 가능합니다!'
}).appendTo(BODY);

div.scrollTo({
    left : 50
});
```
현재 노드가 `overflow`가 `scroll`로 지정되어 노드 내에 스크롤 바가 있는 경우, 스크롤 바의 위치를 지정하거나 현재 위치 및 스크롤의 길이를 가져올 수 있습니다.
- `scrollTo({left:, top:})` 현재 노드 내 스크롤의 위치를 지정합니다.
- `getScrollLeft()` 현재 노드 내의 왼쪽으로부터의 스크롤 위치를 가져옵니다.
- `getScrollTop()` 현재 노드 내의 위쪽으로부터의 스크롤 위치를 가져옵니다.
- `getScrollWidth()` 현재 노드 내의 스크롤 너비를 가져옵니다.
- `getScrollHeight()` 현재 노드 내의 스크롤 높이를 가져옵니다.

### 데이터 관련
```javascript
var
// div
div = DIV({
    c : '나는 누구?'
}).appendTo(BODY);

div.setData({
    name : 'YJ Sim',
    age : 29
});

div.getData();
```
노드내에 필요한 데이터를 저장하거나 반환할 수 있습니다.
- `setData(data)` 현재 노드에 데이터를 저장합니다.
- `getData()` 현재 노드의 저장된 데이터를 반환합니다.

노드를 꾸미거나 이벤틑를 지정하기 위해 위에서 설명한 함수들을 사용하여도 되지만, 다음과 같이 `NODE`를 상속한 클래스에 파라미터로 관련 정보를 포함할 수 있습니다.

```javascript
DIV({
    style : {
        backgroundColor : 'blue',
        color : 'white',
        padding : 10,
    },
    c : [H1({
        c : '애국가'
    }),
    P({
        c : '동해물과 백두산이 마르고 닳도록'
    }),
    P({
        c : '하느님이 보우하사 우리 나라 만세'
    })],
    on : {
        tap : function() {
            alert('무궁화 삼천리 화려강산, 대한 사람 대한으로 길이 보전하세');
        }
    }
}).appendTo(BODY);
```

사용 가능한 파라미터는 다음과 같습니다.
- `style` 스타일을 지정합니다.
- `c` 자식 노드를 지정합니다. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
- `on` 이벤트를 지정합니다.

### `DOM`
DOM 객체를 생성하고 다루는 클래스입니다. `NODE` 클래스를 상속하기 때문에, `NODE`로부터 파생되는 모든 함수들을 사용할 수 있습니다. UPPERCASE는 `DOM` 클래스를 상속한, 각 HTML 태그들과 대응되는 클래스들을 갖고 있습니다. 만약 UPPERCASE가 제공하지 않는 종류의 HTML 요소가 필요한 경우, `DOM`을 상속하여 직접 구현할 수 있습니다.

```javascript
DOM({
    tag : 'div',
    c : [DOM({
        tag : 'h1',
        style : {
            fontWeight : 'bold'
        },
        c : 'UPPERCASE'
    }), DOM({
        tag : 'p',
        c : 'UPPERCASE는 JavaScript 기반 웹 애플리케이션 프레임워크입니다.'
    })]
}).appendTo(BODY);
```

`DOM`를 상속한 클래스 내부에서 사용 가능한 함수들은 다음과 같습니다.

- `inner.setEl(el)` DOM 객체의 HTML element를 지정합니다.
- `inner.setAttr({name:, value:})` DOM 객체의 HTML element에 속성을 지정합니다.

`DOM`를 상속한 클래스로 생성한 객체에 존재하는 함수는 다음과 같습니다.

- `getEl()` DOM 객체의 HTML element를 가져옵니다.

사용 가능한 파라미터는 다음과 같습니다.
- `tag` 생설할 DOM 객체에 해당하는 태그를 지정합니다.
- `el` 태그를 지정하지 않고 HTML element를 직접 지정합니다.
- `style` 스타일을 지정합니다.
- `c` 자식 노드를 지정합니다. 하나의 노드를 지정하거나, 노드들의 배열을 지정할 수 있습니다.
- `on` 이벤트를 지정합니다.

### `BODY`
HTML `body` 태그와 대응되는 객체입니다. (`BODY`는 웹 페이지에 단 하나만 존재할 수 있기 때문에 클래스가 아니라 객체라는 점에 주의하시기 바랍니다.

```javascript
// BODY는 새로 생성할 수 없이 그 자체로 객체이다.
BODY.append(DIV({
    c : 'Hello!'
}));
```

### `DIV`
HTML `div` 태그와 대응되는 클래스입니다.

```javascript
DIV({
    c : 'Hello!'
}).appendTo(BODY);
```

### `P`
HTML `p` 태그와 대응되는 클래스입니다.

### `SPAN`
HTML `span` 태그와 대응되는 클래스입니다.

### `BR`
HTML `br` 태그와 대응되는 클래스입니다. 다른 태그와 다르게 아무런 파라미터가 지정되지 않는다는 점에 주의하시기 바랍니다.

```javascript
P({
    c : ['My', BR(), 'name', BR(), 'is', BR(), 'YJ.']
}).appendTo(BODY);
```

### `H1`
HTML `h1` 태그와 대응되는 클래스입니다.

### `H2`
HTML `h2` 태그와 대응되는 클래스입니다.

### `H3`
HTML `h3` 태그와 대응되는 클래스입니다.

### `H4`
HTML `h4` 태그와 대응되는 클래스입니다.

### `H5`
HTML `h5` 태그와 대응되는 클래스입니다.

### `H6`
HTML `h6` 태그와 대응되는 클래스입니다.

### `A`
HTML `a` 태그와 대응되는 클래스입니다. `href`와 `target` 파라미터를 추가로 사용할 수 있습니다. 아무런 내용이 없으면 이동할 경로를 그대로 표시합니다.

```javascript
A({
    href : 'http://uppercase.io',
    target : '_blank', // 새 창에서 열기
    c : 'UPPERCASE 공식 사이트'
}).appendTo(BODY);

// 아무런 내용이 없으면 이동할 경로를 그대로 표시합니다.
A({
    href : 'http://uppercase.io'
}).appendTo(BODY);
```

또한 `DOM`를 상속함으로 인해 생성된 함수들과 함께, 추가적으로 `A`로 생성한 객체의 함수들은 다음과 같습니다.

- `setHref(href)` 이동할 경로를 재지정합니다.
- `tap()` 마치 눌러진 것 처럼 터치 혹은 클릭 이벤트를 발생시킵니다.

### `IMG`
HTML `img` 태그와 대응되는 클래스입니다. `src` 파라미터를 추가로 사용할 수 있습니다.

```javascript
IMG({
    src : 'logo.png'
}).appendTo(BODY);
```

또한 `DOM`를 상속함으로 인해 생성된 함수들과 함께, 추가적으로 `IMG`로 생성한 객체의 함수들은 다음과 같습니다.

- `getWidth()` 이미지의 가로 크기를 가져옵니다.
- `getHeight()` 이미지의 세로 크기를 가져옵니다.
- `setSize({width:})` `setSize({height:})` `setSize({width:, height})` 이미지의 크기를 지정합니다.
- `getSrc()` 이미지의 경로를 가져옵니다.
- `setSrc(src)` 이미지의 경로를 재지정합니다.

### `UL`
HTML `ul` 태그와 대응되는 클래스입니다.

```javascript
UL({
    c : [LI({
        c : '홈'
    }), LI({
        c : '소개'
    }), LI({
        c : '게시판'
    })]
}).appendTo(BODY);
```

### `LI`
HTML `li` 태그와 대응되는 클래스입니다.

### `TABLE`
HTML `table` 태그와 대응되는 클래스입니다.

```javascript
TABLE({
    c : [TR({
        c : [TH({
            c : '이름'
        }), TH({
            c : '나이'
        }), TH({
            c : '성별'
        })]
    }), TR({
        c : [TD({
            c : 'YJ Sim'
        }), TD({
            c : 29
        }), TD({
            c : '남'
        })]
    }), TR({
        c : [TD({
            c : 'DS Hwang'
        }), TD({
            c : 26
        }), TD({
            c : '여'
        })]
    })]
}).appendTo(BODY);
```

### `TR`
HTML `tr` 태그와 대응되는 클래스입니다.

### `TH`
HTML `th` 태그와 대응되는 클래스입니다. `rowspan`과 `colspan` 파라미터를 추가로 사용할 수 있습니다.

### `TD`
HTML `td` 태그와 대응되는 클래스입니다. `rowspan`과 `colspan` 파라미터를 추가로 사용할 수 있습니다.

### `FORM`
HTML `form` 태그와 대응되는 클래스입니다. 아래와 같은 파라미터들을 추가로 사용할 수 있습니다.

- `action` 폼 데이터를 전송할 경로
- `target` 경로가 이동될 타겟. 지정하지 않으면 현재 창에서 이동됩니다.
- `method` 요청 메소드. `GET`, `POST`를 설정할 수 있습니다.
- `enctype` 폼 데이터를 전송할때 사용할 인코딩 방법. 업로드 기능 구현에 사용됩니다.

```javascript
var
// form
form = FORM({
    action : 'account/create',
    method : 'POST',
    c : [INPUT({
        name : 'name',
        placeholder : '이름'
    }), INPUT({
        name : 'age',
        placeholder : '나이'
    }), SELECT({
        name : 'sex',
        placeholder : '성별',
        c : [OPTION({
            value : 'male',
            c : '남자'
        }), OPTION({
            value : 'female',
            c : '여자'
        })]
    }), TEXTAREA({
        name : 'introduce',
        placeholder : '소개'
    }), INPUT({
        type : 'submit',
        value : '가입 완료'
    })]
}).appendTo(BODY);

form.setData({
    name : 'YJ Sim',
    age : 29,
    sex : 'male',
    introduce : '안녕하세요.'
});

form.getData();
```

또한 `DOM`를 상속함으로 인해 생성된 함수들과 함께, 추가적으로 `FORM`로 생성한 객체의 함수들은 다음과 같습니다.

- `getData()` 현재 폼에 작성된 데이터를 가져옵니다. (`DOM`의 `getData`와 다릅니다.)
- `setData(data)` 주어진 데이터를 폼에 반영합니다. (`DOM`의 `setData`와 다릅니다.)
- `submit()` 폼 데이터를 `action`에 지정한 경로로 전송합니다. `action`이 지정되어 있지 않은 경우에는 `submit` 이벤트만 발생시키고, 페이지를 이동하지 않습니다. 

### `INPUT`
HTML `input` 태그와 대응되는 클래스입니다. 아래와 같은 파라미터들을 추가로 사용할 수 있습니다.

- `name`
- `type`
- `placeholder` 값이 없는 경우 표시되는 짧은 설명
- `value`
- `accept` 파일 선택시 특정 파일만 선택 가능하도록 설정(예: `'.gif, .jpg, .png'`, `'image/gif, image/jpeg, image/png'`, `'image/*'` 등). 업로드 기능 구현에 사용됩니다.
- `isMultiple` `true`인 경우 여러 파일 선택 가능. 업로드 기능 구현에 사용됩니다.
- `isOffAutocomplete` `true`인 경우 브라우저가 제공하는 자동 완성 기능을 사용하지 않음

```javascript
var
// input
input;

FORM({
    action : 'upload',
    method : 'POST',
    enctype : 'multipart/form-data',
    c : [input = INPUT({
		name : 'fileName',
		placeholder : '저장할 파일명'
    }), INPUT({
        type : 'file',
		name : 'file',
		accept : 'image/*',
		isMultiple : true
    }), INPUT({
        type : 'submit',
        value : '업로드'
    })]
}).appendTo(BODY);

input.focus();
input.getName();
```

또한 `DOM`를 상속함으로 인해 생성된 함수들과 함께, 추가적으로 `INPUT`으로 생성한 객체의 함수들은 다음과 같습니다.

- `getName()` `name` 파라미터의 값을 가져옵니다.
- `getValue()` 현재 작성되어 있는 값을 가져옵니다. `type` 파라미터가 `'checkbox'`거나 `'radio'`인 경우에는 결과가 `true`나 `false`가 됩니다.
- `setValue(value)` 값을 지정합니다.
- `select()` 현재 작성되어 있는 값을 블록 지정합니다. `type` 파라미터가 `'file'`인 경우에는 파일 선택 창이 뜨게 됩니다.
- `focus()` 포커스 이벤트를 발생시킵니다. 일반적으로, 키보드로 값을 바로 입력할 수 있도록 입력 바가 생성됩니다.
- `blur()` 포커스를 풉니다.
- `toggleCheck()` `type` 파라미터가 `'checkbox'`거나 `'radio'`인 경우 이미 눌려져 있는 경우에는 취소시키고, 눌러져 있지 않은 경우에는 누르는 것과 같은 처리를 합니다.
- `checkIsChecked()` `type` 파라미터가 `'checkbox'`거나 `'radio'`인 경우 눌러져 있는지 확인합니다.

### `TEXTAREA`
HTML `textarea` 태그와 대응되는 클래스입니다. `name`과 `placeholder`, `value` 파라미터를 추가로 사용할 수 있습니다.

또한 `DOM`를 상속함으로 인해 생성된 함수들과 함께, 추가적으로 `TEXTAREA`로 생성한 객체의 함수들은 다음과 같습니다.

- `getName()` `name` 파라미터의 값을 가져옵니다.
- `getValue()` 현재 작성되어 있는 값을 가져옵니다.
- `setValue(value)` 값을 지정합니다.
- `select()` 현재 작성되어 있는 값을 블록 지정합니다.
- `focus()` 포커스 이벤트를 발생시킵니다. 일반적으로, 키보드로 값을 바로 입력할 수 있도록 입력 바가 생성됩니다.
- `blur()` 포커스를 풉니다.

### `SELECT`
HTML `select` 태그와 대응되는 클래스입니다. `name`과 `placeholder`, `value` 파라미터를 추가로 사용할 수 있습니다.

```javascript
var
// select
select = SELECT({
    name : 'sex',
    placeholder : '성별',
    c : [OPTION({
        value : 'male',
        c : '남자'
    }), OPTION({
        value : 'female',
        c : '여자'
    })]
}).appendTo(form);

select.getName();
select.setValue('female');
select.getValue();
```

또한 `DOM`를 상속함으로 인해 생성된 함수들과 함께, 추가적으로 `SELECT`로 생성한 객체의 함수들은 다음과 같습니다.

- `getName()` `name` 파라미터의 값을 가져옵니다.
- `getValue()` 현재 작성되어 있는 값을 가져옵니다.
- `setValue(value)` 값을 지정합니다.
- `select()` 현재 작성되어 있는 값을 블록 지정합니다.
- `focus()` 포커스 이벤트를 발생시킵니다. 일반적으로, 키보드로 값을 바로 입력할 수 있도록 입력 바가 생성됩니다.
- `blur()` 포커스를 풉니다.

### `OPTGROUP`
HTML `optgroup` 태그와 대응되는 클래스입니다. `label` 파라미터를 추가로 사용할 수 있습니다.

```javascript
SELECT({
    name : 'nation',
    placeholder : '국가',
    c : [OPTGROUP({
        label : '아시아',
        c : [OPTION({
            value : 'korea',
            c : '대한민국'
        }), OPTION({
            value : 'japan',
            c : '일본'
        }), OPTION({
            value : 'china',
            c : '중국'
        })]
    }), OPTGROUP({
        label : '유럽',
        c : [OPTION({
            value : 'uk',
            c : '영국'
        }), OPTION({
            value : 'france',
            c : '프랑스'
        }), OPTION({
            value : 'italy',
            c : '이탈리아'
        })]
    })]
}).appendTo(form);
```

### `OPTION`
HTML `option` 태그와 대응되는 클래스입니다. `value` 파라미터를 추가로 사용할 수 있습니다.

또한 `DOM`를 상속함으로 인해 생성된 함수들과 함께, 추가적으로 `OPTION`으로 생성한 객체의 함수들은 다음과 같습니다.

- `getValue()` 현재 작성되어 있는 값을 가져옵니다.
- `setValue(value)` 값을 지정합니다.

### `CANVAS`
TODO:

### `AUDIO`
TODO:

### `VIDEO`
TODO:

### `IFRAME`
TODO:

### `CLEAR_BOTH`
TODO:

## DOM 객체의 이벤트
DOM 객체에 이벤트를 등록하는 방법에 대해 살펴보겠습니다.

### `EVENT`를 사용하여 이벤트 등록/해제
```javascript
var
// div
div = DIV({
    c : 'TOUCH ME!'
}).appendTo(BODY);

EVENT({
    node : div,
    name : 'tap'
}, function(e) {
    alert('WOW!');
});
```

### `NODE`의 `on`/`off`를 사용하여 이벤트 등록/해제
`NODE`를 상속한 클래스로 생성한 객체의 함수인 `on`과 `off`를 사용하여 이벤트를 등록하거나 해제할 수 있습니다. 두 함수는 내부적으로 `EVENT`를 통해 구현되어 있습니다.

```javascript
var
// div
div = DIV({
    c : 'TOUCH ME!'
}).appendTo(BODY);

div.on('tab', function(e) {
    alert('WOW!');
});
```

혹은, `on` 파라미터를 통해 이벤트를 등록할 수 있습니다.

```javascript
DIV({
    c : 'TOUCH ME!',
    on : {
        tab : function(e) {
            alert('WOW!');
        }
    }
}).appendTo(BODY);
```

### `EVENT(params, eventHandler)`
노드의 이벤트 처리를 담당하는 `EVENT` 클래스

```javascript
EVENT({
    node : div,
    name : 'tap'
}, function(e) {
    alert('WOW!');
});
```

사용 가능한 파라미터 목록은 다음과 같습니다.
- `node` 이벤트를 등록 및 적용할 노드
- `lowNode` 이벤트 '등록'은 `node` 파라미터에 지정된 노드에 하지만, 실제 이벤트의 동작을 '적용'할 노드는 다른 경우 해당 노드
- `name` 이벤트 이름

[UPPERCASER가 지원하는 이벤트 목록](UPPERCASE-CORE-BROWSER/EVENT-LIST.md)은 해당 문서를 참고하시기 바랍니다.

`EVENT`로 생성한 객체의 함수들은 다음과 같습니다.

- `remove()` 이벤트를 제거합니다.
- `fire()` 이벤트를 임의로 발생시킵니다.
- `getEventHandler()` 이벤트 핸들러를 가져옵니다.

`EVENT`의 함수들은 다음과 같습니다.

- `EVENT.fireAll({node:, name:})` `EVENT.fireAll(name)` `name`의 이름을 가진 모든 이벤트를 발생시킵니다. `node`가 지정되지 않은 경우 글로벌 이벤트를 발생시킵니다.
- `EVENT.removeAll({node:, name:})` `EVENT.removeAll({node:})` `EVENT.removeAll(name)` `EVENT.removeAll()` `name`의 이름을 가진 모든 이벤트를 제거합니다. `name`가 지정되지 않은 경우 해당 노드의 모든 이벤트를 제거하며, `node`가 지정되지 않은 경우 글로벌 이벤트를 제거합니다.
- `EVENT.remove({node:, name:}, eventHandler)` `EVENT.remove(name, eventHandler)` `name`의 이름을 가지며 이벤트 핸들러가 주어진 `eventHandler`에 해당하는 이벤트를 제거합니다. `node`가 지정되지 않은 경우 글로벌 이벤트를 제거합니다.

이벤트 핸들러의 파라미터로 넘어오는 `e` 객체에는 다음과 같은 함수들이 있습니다.

```javascript
EVENT({
    node : div,
    name : 'tap'
}, function(e) {
    
    console.log('이벤트가 발생한 화면 왼쪽으로부터의 위치: ' + e.getLeft());
    console.log('이벤트가 발생한 화면 위쪽으로부터의 위치: ' + e.getTop());
    
    // 이벤트 버블링 중단
    e.stopBubbling();
});
```

- `e.stopDefault()` 특정 이벤트가 발생했을 때의 브라우저 기본 동작을 수행하지 않습니다.
- `e.stopBubbling()` 현재 노드의 상위 노드로 이벤트가 전파되는, 일명 `이벤트 버블링`을 방지합니다. 상위 노드에 같은 이름의 이벤트가 등록되어 있더라도, 이 함수를 실행함으로써 상위 노드에서는 이벤트가 처리되지 않습니다.
- `e.stop()` 브라우저의 기본 동작을 수행하지 않으며 이벤트 버블링 또한 방지합니다. 이는 `e.stopDefault`와 `e.stopBubbling`을 함께 실행하는 것과 같습니다.
- `e.getLeft()` 마우스/터치 관련 이벤트(`'tab'`, `'touchstart'`, `'touchend'` 등)가 발생한 화면 왼쪽으로부터의 위치를 가져옵니다.
- `e.getTop()` 마우스/터치 관련 이벤트(`'tab'`, `'touchstart'`, `'touchend'` 등)가 발생한 화면 위쪽으로부터의 위치를 가져옵니다.
- `e.getKey()` 키보드 관련 이벤트(`'keydown'`, `'keyup'` 등)가 발생한 경우 입력된 키를 가져옵니다.
- `e.getWheelDelta()` 마우스 휠 이벤트(`'mousewheel'`)가 발생한 경우 얼마나 휠이 돌아갔는지에 대한 값을 가져옵니다.

### `EVENT_ONCE(params, eventHandler)`
이벤트가 한번 발생하면 자동으로 제거되는 `EVENT_ONCE` 클래스

```javascript
EVENT_ONCE({
    node : div,
    name : 'tap'
}, function(e) {
    alert('WOW!');
    // 더 이상 이벤트가 처리되지 않습니다.
});
```

## DOM 객체의 스타일
TODO: CSS 비판, vh 등을 들먹이며

[UPPERCASER가 지원하는 스타일 목록](UPPERCASE-CORE-BROWSER/STYLE-LIST.md)은 해당 문서를 참고하시기 바랍니다.

## DOM 객체의 애니메이션
TODO:

## 뷰 기능
TODO:

## HTTP 요청 기능
TODO:

## `CONNECT_TO_WEB_SOCKET_SERVER`
* `CONNECT_TO_WEB_SOCKET_SERVER(port, connectionListenerOrListeners)`
* `CONNECT_TO_WEB_SOCKET_SERVER({host:, port:}, connectionListenerOrListeners)`

[UPPERCASE-CORE-NODE의 `WEB_SOCKET_SERVER`](UPPERCASE-COMMON-NODE.md#web_socket_server)로 생성한 웹 소켓 서버에 연결합니다.

```javascript
CONNECT_TO_WEB_SOCKET_SERVER(8125, {
	error : function(errorMsg) {
		console.log('오류가 발생했습니다. 오류 메시지: ' + errorMsg);
	},
	success : function(on, off, send, disconnect) {
        // on           메소드를 생성합니다.
        // off          메소드를 제거합니다.
        // send         서버의 메소드에 데이터를 전송합니다.
        // disconnect   서버와의 연결을 끊습니다.

		send({
			methodName : 'message',
			data : {
				name : 'YJ Sim'
			}
		}, function(retMsg) {
		    console.log('서버로부터의 메시지:' + retMsg);
		});
		
		on('__DISCONNECTED', function() {
			console.log('연결이 끊어졌습니다.');
		});
	}
});
```

클라이언트에서 사용하는 함수들은 다음과 같습니다.

#### `on(methodName, method)`
`on` 함수는 클라이언트에 메소드를 생성하는 함수로써, 서버에서 `send` 함수로 전송한 데이터를 받습니다.

#### `off(methodName)` `off(methodName, method)`
`off` 함수는 클라이언트에 생성된 메소드를 제거합니다.

#### `send(params)` `send(params, callback)`
`send`는 서버로 데이터를 전송하며, 서버에서 `on` 함수로 생성한 메소드가 데이터를 받습니다.

사용 가능한 파라미터는 다음과 같습니다.
* `methodName` 서버에 `on` 함수로 설정된 메소드 이름
* `data` 전송할 데이터

#### `disconnect()`
서버와의 연결을 끊습니다.

## `STORE`
저장소 클래스

웹 브라우저가 종료되어도 저장된 값들이 보존됩니다.

```javascript
var
// store
store = STORE('testStore');

store.save({
    name : 'name',
    value : 'YJ Sim'
});

store.get(name); // 'YJ Sim'

store.remove(name);
```

`STORE`로 생성한 객체의 함수들은 다음과 같습니다.

### `save({name:, value:})`
특정 `name`에 `value`를 저장합니다.

### `get(name)`
`name`에 해당하는 값을 가져옵니다.

### `remove(name)`
`name`에 해당하는 값을 지웁니다.

## `MSG({ko:, en:, ...})`
[`INFO`](#info)의 [웹 애플리케이션 언어 설정 코드](#getlang)에 해당하는 문자열을 반환합니다. 만약 알 수 없는 언어 설정 코드라면, 첫 문자열을 반환합니다.

```javascript
// 브라우저 언어 설정이 한국어일 경우, '집'
// 브라우저 언어 설정이 영어일 경우, 'Home'
// 브라우저 언어 설정이 한국어나 영어가 아닌 경우, 알 수 없는 언어 설정 코드이므로 첫 문자열인 '집'
MSG({
    ko : '집',
    en : 'Home'
});
```

## `SHOW_ERROR(tag, errorMsg)` `SHOW_ERROR(tag, errorMsg, params)`
콘솔에 오류 메시지를 출력합니다.

다음 코드를 실행하면,
```javascript
SHOW_ERROR('샘플 오류', '엄청난 오류가 발생했습니다!');
```
콘솔에 다음과 같은 오류 메시지를 빨간색으로 출력합니다.
```
[샘플 오류] 오류가 발생했습니다. 오류 메시지: 엄청난 오류가 발생했습니다!
```

다음 코드를 실행하면,
```javascript
SHOW_ERROR('샘플 오류', '엄청난 오류가 발생했습니다!', {
    a : 1,
    b : 2,
    c : 3
});
```
콘솔에 다음과 같은 오류 메시지를 빨간색으로 출력합니다.
```
[샘플 오류] 오류가 발생했습니다. 오류 메시지: 엄청난 오류가 발생했습니다!
다음은 오류를 발생시킨 파라미터입니다.
{
    "a": 1,
    "b": 2,
    "c": 3
}
```

## `SOUND`
TODO: