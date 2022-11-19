// 提供首页相关API函数
import request from '@/utils/request'


// limit品牌个数
export const findBrand = (limit = 6) => {
    return request('/home/brand','get',{ limit })
}

// 获取广告区轮播图
export const findBanner = () => {
    return request('/home/banner', 'get')
}

// 新鲜好物
export const findNew = () => {
    return request('home/new', 'get')
}

// 好物推荐
export const findHot = () => {
    return request('/home/hot', 'get')
}

// 商品板块
export const findGoods = () => {
    return request('/home/goods', 'get')
}

// 最新专辑
export const findSpecial = () => {
    return request('/home/special', 'get')
}