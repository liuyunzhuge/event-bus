[![npm](https://img.shields.io/npm/dm/breif-event-bus.svg)](https://www.npmjs.com/package/breif-event-bus)
[![npm](https://img.shields.io/npm/v/breif-event-bus.svg)](https://www.npmjs.com/package/breif-event-bus)
[![npm](https://img.shields.io/npm/l/breif-event-bus.svg)](https://www.npmjs.com/package/breif-event-bus)

# event-bus

一个简单的event-bus实现，提供最简单的`on off trigger once`四个api，同时支持类似jq命名空间的事件管理。可应用于单页应用、小程序进行页面之间的通信。

## 用法
安装：
```bash
npm install breif-event-bus --save
```
浏览器环境，可通过上面的npm命令安装后，到`node_modules/breif-event-bus/dist`目录下，直接引用`index.umd.min.js`。

**注意：** 本库在实际使用上，可能需要做额外的polyfill。

示例：
```js
import EventBus from "breif-event-bus"

let bus = new EventBus 

// 添加单个事件、单个监听
bus.on('some', ()=> {

})

// 为多个事件注册一个监听
bus.on([
    'some',
    'other',
    'else'
], ()=> {

})

// 带命名空间
bus.on('some.n1.n2', ()=> {

})

// 派发事件
bus.trigger('some')

// 派发带命名空间的事件
bus.trigger('some.n1')


// 移除特定的监听
let handler = ()=>{}
bus.on('some', handler)
bus.off('some', handler)

// 带命名空间的移除监听
bus.off('some.n1')

// 根据命名空间来移除事件监听
bus.off('.n1') 

// 注册仅执行一次的监听
bus.once('some', ()=>{}) // on 替换为 once

```
**说明：** 命名空间的特性，与jquery相同。

## api
只有四个：`on off once trigger`。

### on( event, callback )
- 作用：注册事件监听。
- 参数：
    - {string | Array<string>} event
    - {Function} callback

### once( event, callback )
- 作用：注册仅执行一次的事件监听。
- 参数：
    - {string | Array<string>} event
    - {Function} callback

### off( event, callback )
- 作用：移除事件监听。
- 参数：
    - {string | Array<string>} event
    - {Function} callback

### trigger( event )
- 作用：派发事件。
- 参数：
    - {string} event

## demo
将代码clone到本地，然后运行：
```bash
npm install
node server
```
就能通过`demo`文件下的文件来测试此库的用法。

## 补充
为什么有vuex这种专门用来管理单页全局状态的工具，还要用连vue官方都不推荐使用的`event-bus`模式来做消息同步呢？因为不是每个项目都一定要用`vuex`，有些应用的模式，并没有那么多全局使用的数据状态，借助一个简单的`event-bus`工具，就可以轻松完成多页面之间的消息通知；比如说某个应用有一个功能做了微信支付，其它已经打开的页面需要在支付事件完成之后做点什么，那么借助`event-bus`来完成支付事件的消息传递，其它监听了支付消息的页面，在收到支付事件通知时，可能只需要调用一下自身刷新方法即可。

## 应用
此库在vue中的应用可使用[vue-event-bus](https://github.com/liuyunzhuge/event-bus)；
此库也可以在Hybrid应用中使用，参考[hybrid-jssdk-backbone](https://github.com/liuyunzhuge/hybrid-jssdk-backbone)中的说明。
