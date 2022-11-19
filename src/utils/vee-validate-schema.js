import { userAccountCheck } from '@/api/user'
export default {
    // 效验规则 返回true就是效验成功  返回一个字符串就是失败 字符串就是错误
    // 用户名的效验
    //  6-20个字符，需要以字母开头
    account (value) {
        if (!value) return '请输入用户名'
        if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
        return true
    },
    // 密码的效验规则
    // 6-24个字符
    password (value) {
      if (!value) return '请输入密码'
      if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
      return true
    },
    // 手机号的效验规则
    mobile (value) {
      if (!value) return '请输入手机号'
      if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
      return true
    },
    // 验证码的效验规则
    // 1开头 3-9之间 9位数字
    code (value) {
      if (!value) return '请输入验证码'
      if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
      return true
    },
    // 同意用户协议
    isAgree (value) {
      if (!value) return '请勾选同意用户协议'
      return true
    },
    async accountApi (value) {
      if (!value) return '请输入用户名'
      if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
      // 服务端校验
      const { result } = await userAccountCheck(value)
      if (result.valid) return '用户名已存在'
      return true
    },
    rePassword (value, { form }) {
      if (!value) return '请输入密码'
      if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
      // 校验密码是否一致  form表单数据对象
      if (value !== form.password) return '两次输入的密码不一致'
      return true
    },
}