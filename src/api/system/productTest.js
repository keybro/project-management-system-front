import request from '@/utils/request'

// 查询产品测试列表
export function listProductTest(query) {
  return request({
    url: '/system/productTest/list',
    method: 'get',
    params: query
  })
}

// 查询产品测试详细
export function getProductTest(productId) {
  return request({
    url: '/system/productTest/' + productId,
    method: 'get'
  })
}

// 新增产品测试
export function addProductTest(data) {
  return request({
    url: '/system/productTest',
    method: 'post',
    data: data
  })
}

// 修改产品测试
export function updateProductTest(data) {
  return request({
    url: '/system/productTest',
    method: 'put',
    data: data
  })
}

// 删除产品测试
export function delProductTest(productId) {
  return request({
    url: '/system/productTest/' + productId,
    method: 'delete'
  })
}
