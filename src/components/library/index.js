// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import defaultImg from '@/assets/images/200.png'
import Message from './Message'
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'


// 导入librry文件下的所有组件
// 批量导入需要使用的一个函数require.context(dir,deep,matching)
// 参数 目录 是否加载子目录 加载的正则匹配
const importFn = require.context('./',false,/\.vue$/)



export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBread)
    // 定义指令
    defineDirective(app)

    // 定义一个原型函数
    app.config.globalProperties.$message = Message


    // 批量注册全局组件
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default
      app.component(component.name,component)
    })
  }
}

// 定义指令
const defineDirective = (app) => {
  // 1. 图片懒加载的指令
  // 图片懒加载的原理： 先存储图片的地址不能在src上 当图片进入可视化区域  将你存储图片的地址设置给图片元素即可
  app.directive('lazy',{
    // vue2.0 监听使指令的DOM是否创建好 钩子函数 inserted
    // vue3.0 的指令拥有的钩子函数额组件的一样 使指令的DOM是否创建好 钩子函数 Mounted
    mounted(el, binding) {
      // console.log('mounted')
      // 2. 创建一个观察对象  来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 停止观察
          observe.unobserve(el)
          // 3.把指令的值设置给el的src属性  binding.value就是指令的值
          // 4.处理图片加载失败
          el.onerror = () => {
            // 图片加载失败显示默认图片
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0
      })

      // 开启观察
      observe.observe(el)
    }
  })
}