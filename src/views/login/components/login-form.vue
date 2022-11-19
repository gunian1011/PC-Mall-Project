<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- Form 添加上 autocomplete="off" 就是取消自动填充 -->
    <Form ref="formCom" class="form" :validation-schema="schema" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field v-model="form.password" name="password" type="password" placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>

        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field v-model="form.code" name="code" type="text" placeholder="请输入验证码" />
            <span class="code" @click="send()">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a @click="login()" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
        <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { onUnmounted, reactive, ref, watch } from 'vue'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
// import QC from 'qc'
export default {
  name: 'LoginForm',
  components: {
    Form,
    Field
  },
  setup () {
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // vee-validate 效验的基本步骤
    // 1. 导入Form Field 组件 将 form 和input 进行替换 需要加上name用来指定将来的效验规则
    // 2. field 需要进行数据绑定  字段名称和后台最好一致
    // 3. 定义name属性 指定的效验规则函数
    // 4. 自定义组件需要效验必须先支持v-model 然后Field使用as指定为组件名称
    const MySchema = {
        account: schema.account,
        password: schema.password,
        mobile: schema.mobile,
        code: schema.code,
        isAgree: schema.isAgree
    }

    //  监听isMsgLogin来重置表单(数据+效验结果)
    const formCom = ref(null)
    watch(isMsgLogin,() => {
        form.isAgree = true,
        form.account = null,
        form.password = null,
        form.mobile = null,
        form.code = null
        // 如果没有销毁field组件 之前的效验结果就不会消耗
        // form组件提供了一个 resetForm 函数清除效验结果
        formCom.value.resetForm()
    })

    // 需要在点击登录的时候对整体表单进行效验
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
        // Form 组件提供了一个 validate 函数作为整体表单效验 当时返回的是promise
        const valid = await formCom.value.validate()
        // Message({ type:'error', text:'用户名或密码错误' })
        
        if (valid) {
            try {
                let data = null
                if (isMsgLogin.value) {
                    // 手机号登录
                    // 1. 发送验证码
                    // 1.1 绑定发送验证码按钮 点击事件
                    // 1.2 效验手机号  如果成功才去发送验证码  开始60秒倒计时
                    // 1.3 如果失败 失败的验证码样式显示出来
                    // 2. 手机号登录
                    // 2.1 准备一个手机号API
                    const { mobile, code } = form
                    data = await userMobileLogin({ mobile, code })
                } else {
                    // 账号登录
                    // 准备一个API账号登录
                    // 调用API函数
                    // 成功  跳到来源页首页
                    // 失败 消息提示
                    const { account, password } = form
                    data = await userAccountLogin({ account, password })
                }
                // 存储用户信息
                const { id, account, avatar, mobile, nickname, token } = data.result
                store.commit('user/setUser', {id, account, avatar, mobile, nickname, token})
                store.dispatch('cart/mergeCart').then(() => {
                // 进行跳转
                router.push(route.query.redirectUrl || '/')
                  // 成功消息提示
                  Message({ type: 'success', text: '登录成功' })
                })
                } catch (e) {
                    // 失败的提示
                    if (e.response.data) {
                        Message({ type: 'error', text: e.response.data.message || '登录失败' })
                    }
                }
            }
        }

    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
        // pause  暂停  resume 开始
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
        const valid = MySchema.mobile(form.mobile)
        if (valid === true) {
            // 通过
            // 没有倒计时才可以发送
            if (time.value === 0) {
                await userMobileLoginMsg(form.mobile)
                Message({ type: 'success', text: '发送成功' })
                time.value = 60
                resume()
            }   
        } else {
            // 失败 使用vee的错误函数显示错误信息  setField
            formCom.value.setFieldError('mobile', valid)
        }
    }

    // 初始化QQ
    // onMounted(() => {
    //     QC.Login({ btnId:'qqLoginBtn' })
    // })

    return { isMsgLogin, form, schema: MySchema, formCom, login, send, time }
  },

}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>