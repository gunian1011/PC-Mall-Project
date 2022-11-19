<template>
    <div class="checkout-address">
      <div class="text">
        <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
        <ul v-if="showAddress">
          <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
          <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
          <li><span>收货地址：</span>{{showAddress.fullLocation}}{{showAddress.address}}</li>
        </ul>
        <a @click="openAddressEdit(showAddress)" href="javascript:;">修改地址</a>
      </div>
      <div class="action">
        <XtxButton @click="openDialog()" class="btn">切换地址</XtxButton>
        <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
      </div>
    </div>
    <!-- 切换收货地址对话框组件 -->
    <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
      <div @click="selectedAddress=item" :class="{active:selectedAddress&&selectedAddress.id===item.id}" class="text item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
          <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
      <template #footer>
          <XtxButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</XtxButton>
          <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
    <!-- 收货地址的添加编辑组件 -->
    <AddressEdit @on-success="successHansler" ref="addressEditCom" />
  </template>
  <script>
  import { ref } from 'vue'
  import AddressEdit from './assress-edit.vue'
  export default {
    name: 'CheckoutAddress',
    components: {
      AddressEdit
    },
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    // 1. 在拥有根元素的组件中， 触发自定义事件 有没有emits选项都无所谓
    // 2. 如果组件渲染的片段，vue3.0规范 需要在emits中申明所触发的自定义事件
    // 3. 提倡： 触发自定义事件就要在emits中申明
    emits: ['change'],
    setup (props, { emit }) {
      // 1. 找到默认收货地址
      // 2. 没有默认收货地址 使用第一条收货地址
      // 3. 如果没有数据 提示添加
      const showAddress = ref(null)
      const defaultAddress = props.list.find(item => item.isDefault === 0)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        if (props.list.length) {
          // 加上一个注释：忽略下面代码的检查eslint
        // eslint-disable-next-line vue/no-setup-props-destructure
          showAddress.value = props.list[0]
        }
      }

      // 默认通知父组件一个收货地址id
      emit('change', showAddress.value && showAddress.value.id)

      // 显示隐藏
      const visibleDialog = ref(false)
      // 记录当前选中的地址id
      const selectedAddress = ref(null)
      const confirmAddressFn = () => {
        // 显示的地址换成选中的地址
        showAddress.value = selectedAddress.value
        // 把选中的地址ID通知结算给组件
        emit('change',selectedAddress.value?.id)
        visibleDialog.value = false
      }

      const openDialog = () => {
        // 数据使用完毕置空
        selectedAddress.value = null
        visibleDialog.value = true
      }

      // 打开添加编辑收货地址组件
      const addressEditCom = ref(null)
      const openAddressEdit = (address) => {
        addressEditCom.value.open(address)
      }

      const successHansler = (formData) => {
        const address = props.list.find(item => item.id === formData.id)
        if (address) {
          for (const key in address) {
            address[key] = formData[key]
          }
        } else {
        // 如果有添加就往list追加一条
        const jsonStr = JSON.stringify(formData)
         // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
        }
        
      }

      return { showAddress, 
        visibleDialog, selectedAddress, 
        confirmAddressFn, openDialog, openAddressEdit,
        addressEditCom, successHansler,

       }
    }
  }
  </script>
  <style scoped lang="less">
  .xtx-dialog {
    
    // padding: 3px 30px;
    // overflow-y: auto;
        height: 78vh;
        overflow: auto;

    // overflow: scroll; 
        width: 110%;  //隐藏侧边默认滚动条 （达不到效果可以自己试着微调） 如解决不了可尝试用 `margin-right -60px`
        height: 100%;  //隐藏底部滚动条  （100%如果达不到效果可以试着用110%）   

    .text {
      flex: 1;
      min-height: 90px;
      display: flex;
      align-items: center;
      
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
  .checkout-address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    .text {
      flex: 1;
      min-height: 90px;
      display: flex;
      align-items: center;
      
  
      .none {
        line-height: 90px;
        color: #999;
        text-align: center;
        width: 100%;
      }
      > ul {
        flex: 1;
        padding: 20px;
        li {
          line-height: 30px;
          span {
            color: #999;
            margin-right: 5px;
            > i {
              width: 0.5em;
              display: inline-block;
            }
          }
        }
      }
      > a {
        color: @xtxColor;
        width: 160px;
        text-align: center;
        height: 90px;
        line-height: 90px;
        border-right: 1px solid #f5f5f5;
      }
    }
    .action {
      width: 420px;
      text-align: center;
      .btn {
        width: 140px;
        height: 46px;
        line-height: 44px;
        font-size: 14px;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  </style>