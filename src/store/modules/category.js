// 分类模块
import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'
export default {
    namespaced: true,
    state() {
        return {
            // 如果默认是[]数组，看不见默认的9个分类，等你数据加载完毕才会看到。
            // 分类信息集合  依赖topCategory重新设置  保证初始化就要有数据
            list: topCategory.map(item => ({name:item}))
        }
    },
    // 修改分类函数
    mutations: {
        // payload 所有的分类集合
        setList (state, payload) {
            state.list = payload
        },
        // 定义show和hide函数 控制当前分类的二级分类显示和隐藏
        show (state, id){
            const curreCategory = state.list.find(item => item.id === id)
            curreCategory.open = true
        },
        hide (state, id){
            const curreCategory = state.list.find(item => item.id === id)
            curreCategory.open = false
        }
    },
    // 获取分类函数
    actions: {
        async getList ({ commit }) {
            const data = await findAllCategory()
            // 给每个分类加上控制二级分类显示隐藏的数据
            data.result.forEach(top => {
                top.open = false
            })
            // 获取数据成功  提交mutations进行数据修改
            commit('setList', data.result)
        }
    }
}

