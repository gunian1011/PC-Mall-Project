import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  
  modules: {
    user,
    cart,
    category,
  },
  plugins: [
    createPersistedstate({
      key:"erabbit-client-pc-124-store",
      paths:['user','cart']
    })
  ]
})
