<template>
  <LoginHeader>联合登录</LoginHeader>
    <section class="container" v-if="isBind" >
        <div class="unbind">
            <div class="loading"></div>
        </div>
    </section>
  <section class="container">
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
    
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'PageCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    const hasAccount = ref(true)
    
    // 首先 默认认为已经注册并且已经绑定
    // 通过QQ的api获取openID就是后台需要的unionID人后进行登录

    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    // 确保QQ已经登录
    if (QC.Login.check()) {
        QC.Login.getMe((openId) => {
            unionId.value = openId
            userQQLogin(openId).then(data => {
                // 登录成功
                // 1. 存储用户信息
                const { id, account, avatar, mobile, nickname, token } = data.result
                store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
                store.dispatch('cart/mergeCart').then(() => {
                  // 2. 跳转到来源也或者首页
                router.push(store.state.user.redirectUrl)
                // 3. 成功提示
                Message({ type: 'success', text: 'QQ登录成功' })
                })
            }).catch(e => {
                // 登录失败
                isBind.value = false
            })
        })
    }


    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>