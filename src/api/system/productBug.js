import request from '@/utils/request'

// 查询产品bug列表列表
export function listProductBug(query) {
  return request({
    url: '/system/productBug/list',
    method: 'get',
    params: query
  })
}

// 查询产品bug列表详细
export function getProductBug(bugId) {
  return request({
    url: '/system/productBug/' + bugId,
    method: 'get'
  })
}

// 新增产品bug列表
export function addProductBug(data) {
  return request({
    url: '/system/productBug',
    method: 'post',
    data: data
  })
}

// 修改产品bug列表
export function updateProductBug(data) {
  return request({
    url: '/system/productBug',
    method: 'put',
    data: data
  })
}

// 删除产品bug列表
export function delProductBug(bugId) {
  return request({
    url: '/system/productBug/' + bugId,
    method: 'delete'
  })
}
