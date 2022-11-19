// 用户模块
export default {
    namespaced: true,
    state () {
      return {
        // 用户信息
        profile: {
          account:'',
          id: '',
          avatar: '',
          nickname: '',
          account: '',
          mobile: '',
          token: ''
        },
        // 登录后跳回路径
        redirectUrl: '/'
      }
    },
    mutations: {
      // 修改用户信息，payload就是用户信息对象
      setUser (state, payload) {
        state.profile = payload
      },
      // 修改回跳地址
      setRedirectUrl (state, url) {
        state.redirectUrl = url
      }
    }
  }