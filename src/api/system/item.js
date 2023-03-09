import request from '@/utils/request'

// 查询项目列表列表
export function listItem(query) {
  return request({
    url: '/system/item/list',
    method: 'get',
    params: query
  })
}

// 查询项目列表详细
export function getItem(itemId) {
  return request({
    url: '/system/item/' + itemId,
    method: 'get'
  })
}

// 新增项目列表
export function addItem(data) {
  return request({
    url: '/system/item',
    method: 'post',
    data: data
  })
}

// 修改项目列表
export function updateItem(data) {
  return request({
    url: '/system/item',
    method: 'put',
    data: data
  })
}

// 删除项目列表
export function delItem(itemId) {
  return request({
    url: '/system/item/' + itemId,
    method: 'delete'
  })
}
