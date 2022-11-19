<template>
    <!-- 顶部 -->
    <AppTopnav />
    <!-- 头部 -->
    <AppHeader />
    <!-- 吸顶导航 -->
    <AppHeaderNav />
    <!-- 容量容器 -->
    <div class="app-body">
        <!-- 二级路由 -->
        <RouterView />
    </div>
    <!-- 底部 -->
   <AppFooter />
</template>

<script>
import AppTopnav from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderNav from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
    name: 'Layout',
    components: {
        AppTopnav,
        AppHeader,
        AppFooter,
        AppHeaderNav,
    },
    // 获取下分类数据
    setup() {
        const store = useStore()
        store.dispatch('category/getList')
    }

}
</script>

<style scoped lang="less">
    .app-body {
        min-height: 600px;
    }
</style>