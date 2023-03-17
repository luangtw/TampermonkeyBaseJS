# TampermonkeyBaseJS
油猴插件开发，类JQ库，操作交互组件。

## 使用
* 使用选择器获取元素
``` javascript
  // 赋值要使用的方法
  let { $, openFtn } = { ... window.base };

```

``` javascript
  // 使用ID获取元素
  let element = $('#id');

```

``` javascript
  // 使用class获取元素
  let element = $('.class');

```

``` javascript
  // 使用find查找子元素
  let child = element.find('.child');

```

``` javascript
  // 使用getPromiseFtn包装异步函数
  let sleep = getPromiseFtn(function sleep(reslove, reject, arg) {
    let seconds = [...arg];

    if (!seconds) return;

    setTimeout(() => {
      reslove()
    }, seconds * 1000);

  });

```

## 方法
* jQuery & $：使用查找获取元素
* parent：返回父元素
* parents：返回父元素及所有祖宗元素
* getchildren：返回所有直接子元素
* find：查找符合的子元素
* siiblings：返回同胞元素
* prev：返回上一个同胞元素
* prevall：返回上一个同胞元素开始往上所有同胞元素
* next：返回下一个同胞元素
* nextAll：返回下一个同胞元素开始往下所有同胞元素
* removeElement：删除此元素
* css：设置或返回样式
* openFtn.sleep.getPromiseFtn：异步任务包装一下Proimse
* openFtn.sleep：等待函数
* openFtn.findDialog：动态查找元素：在一定的时间内循环查找
