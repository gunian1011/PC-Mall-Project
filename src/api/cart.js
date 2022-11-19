import request from '@/utils/request'

/**
 * 获取新的商品信息
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}

/**
 * 修改购物车商品（状态，数量）
 * @param {String} skuId - SKUID
 * @param {Integer} count - 加入购物车数量
 * @param {Boolean} selected - 选中状态
 * @returns
 */
 export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'put', { selected, count })
}

/**
 * 删除购物车商品，支批量
 * @param {Array<string>} ids - skuId 的集合
 */
 export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', { ids })
}

/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
 export const getGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
 export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

/**
 * 获取登录后的购物车列表
 * @returns Promise
 */
 export const findCart = () => {
  return request('/member/cart', 'get')
}

/**
 * 加入购物车
 * @param {String} skuId - 商品SKUID
 * @param {Integer} count - 商品数量
 * @returns Promise
 */
 export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}

/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
 export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}