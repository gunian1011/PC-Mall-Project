import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'

export const useLazyData = (apiFn) => {
    const result = ref([])
    const target = ref(null)
    // stop 停止观察
    const { stop } = useIntersectionObserver (
        // 监听的目标元素
        target,
          // isIntersecting 是否进入可视区域，true是进入 false是移出
        ([{isIntersecting }],observerElement) => {
            if(isIntersecting ) {
                stop()
                // 调用API函数
                apiFn().then(data => {
                    result.value = data.result
                })
            }
        },
        // 配置选项，相交的比例大于0就触发
        {
            threshold: 0
        }
    )
    return {result, target}
}

// 支付倒计时的函数  countdown 倒计时的秒数
export const usePayTime = () => {
    // 倒计时封装
    const time = ref(0)
    const timeText = ref('')
    const { pause, resume } = useIntervalFn(() => {
        time.value--
        timeText.value = dayjs.unix(time.value).format('mm分ss秒')
        if (time.value <= 0) {
            pause()
        }
    }, 1000, false)
    onUnmounted(() => {
        pause()
    })

    // 开启定时器
    const start = (countdown) => {
        time.value = countdown
        timeText.value = dayjs.unix(time.value).format('mm分ss秒')
        resume()
    }

    return {
        start,
        timeText
    }
}