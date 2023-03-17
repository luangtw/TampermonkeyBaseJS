/**
 * Tampermonkey Base Javascript v0.0.1
 * name: Edward-chen
 * descript: 类似jq对js底层封装，用于油猴的js开发
 * Released under the MIT license
 * Date:2023-3-15
 * E-Mail:2523306721@qq.com
 */

(function () {

  "use strict";

  window.base = {
    jQuery: jQuery,
    $: jQuery,
    openFtn: {},
  };
  window.base.openFtn.getPromiseFtn = getPromiseFtn;

  HTMLElement.prototype.parent = parent;
  HTMLElement.prototype.parents = parents;
  HTMLElement.prototype.getChildren = getChildren;
  HTMLElement.prototype.find = find;
  HTMLElement.prototype.siblings = siblings;
  HTMLElement.prototype.next = next;
  HTMLElement.prototype.nextAll = nextAll;
  HTMLElement.prototype.prev = prev;
  HTMLElement.prototype.prevAll = prevAll;
  HTMLElement.prototype.removeElement = removeElement;
  HTMLElement.prototype.css = css;


  // -------------------------------- 主题函数 ---------------------------------------------
  /**
   * 返回元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function jQuery(selector) { //type:selector,js原生对象

    let isID = selector?.startsWith('#');

    return isID ? document.querySelector(selector) : document.querySelectorAll(selector);
  }

  /**
   * 返回父元素
   * @returns HTML元素
   */
  function parent() {

    return this.parentNode;
  }

  /**
   * 返回父元素及所有祖宗元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function parents(selector) {

    let arr = [];
    let parent, elem = this;

    do {
      parent = elem.parentNode;
      elem = parent;
      arr.push(parent);
    }
    while (parent);

    if (selector) {
      arr = getElement(selector, arr);
    }

    return arr;
  }

  /**
   * 返回所有直接子元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function getChildren(selector) {
    let children = arrayFrom(this.children);

    if (selector) {
      children = getElement(selector, children)
    }

    return children;
  }

  /**
   * 查找符合的子元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function find(selector) {

    let children = arrayFrom(this.children);
    let resultFind;

    // 进行选择器判断
    let isID = selector.trim().startsWith('#');

    resultFind = (function findChildren(children) {
      let resultFind, result;
      result = getElement(selector, children);
      resultFind = result

      if (Boolean(isID && resultFind)) return resultFind;   // ID选择器结束查找

      for (let element of children) {
        let result;
        let elChildren = arrayFrom(element.children);

        if (elChildren.length) {
          result = findChildren(elChildren);

          if (Boolean(isID && result)) return resultFind = result;     // ID选择器结束查找

          if (!isID && result.length) resultFind = [...result, ...resultFind];

        }
      }

      return resultFind;
    })(children);

    return resultFind;        // ID: Element || undefined class,tap: [elements] | []
  }

  /**
   * 返回同胞元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function siblings(selector) {

    let arr = this.prevAll().concat(this.nextAll());

    if (selector) {
      arr = getElement(selector, arr);
    }

    return arr;
  }

  /**
   * 返回上一个同胞元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function prev() {

    return this.previousElementSibling;
  }

  /**
   * 返回上一个同胞元素开始往上所有同胞元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function prevAll(selector) {

    let prevs = [], prev;
    let elem = this;
    do {
      prev = elem.previousElementSibling;
      if (prev) {
        prevs.push(prev)
        elem = prev;
      }
    }
    while (prev)

    if (selector) {
      prevs = getElement(selector, prevs);
    }

    return prevs;
  }

  /**
   * 返回下一个同胞元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function next() {

    return this.nextElementSibling;
  }

  /**
   * 返回下一个同胞元素开始往下所有同胞元素
   * @param {String} selector 选择器
   * @returns HTML元素
   */
  function nextAll(selector) {

    let nexts = [], next, elem = this;
    do {
      next = elem.nextElementSibling;
      if (next) {
        nexts.push(next);
        elem = next;
      }
    }
    while (next);

    if (selector) {
      nexts = getElement(selector, nexts);
    }

    return nexts;
  }

  /**
   * 删除此元素
   */
  function removeElement() {

    let parent = this.parentNode;

    parent.removeChild(this);

  }

  /**
   * 设置或返回样式
   * @param {Object} style 样式对象：属性：值
   */
  function css(style) {

    if (typeof style == 'object') {
      Object.assign(this.style, style);
    } else {
      return this.style[style];
    }

    return
  }

  // -------------------------------- 内部方法 ---------------------------------------------
  /**
   * 以特定选择器在元素数组中查找合适的元素
   * @param {String} selector 选择器
   * @param {Array} elements 用于查找的数组
   * @returns {Array,HTMLElement} arr 返回的元素或元素数组
   */
  function getElement(selector, elements = []) {
    let result;   // Type: any

    /**
     * 解析selector
     */
    try {
      selector = selector.trim()
    }
    catch {
      throw new Error('参数类型不正确')
    }

    let type = null;
    type = selector.startsWith('#') ? 0 : type;  // 类型为id
    type = selector.startsWith('.') ? 1 : type;  // 类型为class
    type = type === null ? 2 : type;  // 类型为标签

    let selectBody = type == 2 ? selector.toUpperCase() : selector.slice(1);

    switch (type) {
      case 0:
        // id选择器查找
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i];
          if (!element) continue;
          if (element.id == selectBody) {
            result = element;
            break;
          }
        }

        break;
      case 1:
        // 类选择器
        result = elements.filter(elem => {

          if (elem.tagName == 'svg' || elem.tagName == 'path') return;

          return elem?.className.split(' ').includes(selectBody);
        })

        break;
      case 2:
        // 标签
        result = elements.filter(elem => {
          return elem?.tagName == selectBody
        });

        break;
    }

    return result;      // ID: Element || undefined class,tap: [elements] | []
  }
  /**
   * 初始化一个数组
   * @param {Any} init 初始的数据
   * @returns 
   */
  function arrayFrom(init) {

    if (init == undefined || null) {
      return init;
    }

    let arr;
    arr = Array.from(init);
    if (arr.length == 0 && init.length == 'undefined') {
      arr.push(init)
    }

    return arr;
  }

  // -------------------------------- 对外开放方法 -------------------------------------------
  /**
   * 异步任务包装一下Proimse
   * 使用此方法包装Promise：
   *      任务函数参数中返回reslove:解决方法，arg,任务函数参数列表
   * 
   * @param {Function} ftn 任务函数
   * @returns Function：包装了Promise的任务函数
   */
  function getPromiseFtn(ftn = () => { }) {
    return function () {
      let arg = arguments;
      return new Promise((reslove, reject) => {
        ftn(reslove, reject, arg);
      })
    }
  }

  /**
   * 等待函数
   * @param {Number} seconds 秒数
   * @returns Promise
   */
  window.base.openFtn.sleep = getPromiseFtn(function sleep(reslove, reject, arg) {
    let seconds = [...arg];

    if (!seconds) return;

    setTimeout(() => {
      reslove()
    }, seconds * 1000);

  });

  /**
   * 动态查找元素：在一定的时间内循环查找
   * @param { String } selector 选择器
   * @param { Number, String } timeout 超时时间
   * @returns 返回查找的元素 
   */
  window.base.openFtn.findDialog = getPromiseFtn(function findDialog(reslove, reject, arg) {

    let index = 0;
    let selector = arg[0], timeout = Number(arg[1]) || 5000;

    let timer = setInterval(() => {
      index++;
      let result = jQuery(selector);
      let finded = result && (result.length !== 0);
      if (finded || index >= (timeout / 1000)) {
        clearInterval(timer);

        if (finded) {
          reslove(result);
        } else {
          reject({ message: '元素未出现！' });
        }
      }
    }, 100)

  });
})();