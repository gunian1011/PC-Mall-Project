<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{errors}" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" name="code" v-model="form.code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send()">
            {{time===0?'发送验证码':`${time}秒后发送`}}
        </span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindLogin, userQQBindCode } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
        type: String,
        default: ''
    }
  },
  setup (props) {
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_qq_1
        nickname.value = res.data.nickname
      })
    }

    // 表单数据
    const form = reactive({
        mobile: null,
        code: null
    })
    // 效验规则
    const mySchema = {
        mobile: schema.mobile,
        code: schema.code
    }

    // 发送短信验证码
    const formCom = ref(null)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
        // pause 暂停 resume 开始
        time.value--
        if (time.value <= 0) {
            pause()
        }
    },1000, false)
    onUnmounted(() => {
        pause()
    })
    // 发送短信
    const send = async () => {
        const valid = mySchema.mobile(form.mobile)
        if (valid === true) {
            // 通过
            // 没有倒计时才可以发送
            if (time.value === 0) {
                // 没有倒计时才可以发送
                await userQQBindCode(form.mobile)
                Message({ type: 'success', text: '发送成功' })
                time.value = 60
                resume()
            } 
        } else {
            // 失败 使用vee的错误函数显示错误信息  setField
            formCom.value.setFieldError('mobile', valid)
        }
    }

    // 立即绑定
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
        const valid = formCom.value.validate()
        if (valid) {
            userQQBindLogin({
                unionId: props.unionId,
                ...form
            }).then(data => {
                // 实现和之前登录一样的逻辑
                // 1. 存储用户信息
                const { id, account, avatar, mobile, nickname, token } = data.result
                store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
                store.dispatch('cart/mergeCart').then(() => {
                // 2. 跳转到来源页或者首页
                  router.push(store.state.user.redirectUrl)
                  // 3. 成功提示
                  Message({ type: 'success', text: 'QQ绑定成功' })
                })
            }).catch(e => {
                Message({ type: 'error', text: '绑定失败' })
            })
        }
    }

    return { nickname, avatar, form, mySchema, send, time, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
  .code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>