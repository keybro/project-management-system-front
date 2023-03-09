import request from '@/utils/request'

// 查询项目集列表
export function listItem_set(query) {
  return request({
    url: '/system/item_set/list',
    method: 'get',
    params: query
  })
}

// 查询项目集详细
export function getItem_set(itemSetId) {
  return request({
    url: '/system/item_set/' + itemSetId,
    method: 'get'
  })
}

// 新增项目集
export function addItem_set(data) {
  return request({
    url: '/system/item_set',
    method: 'post',
    data: data
  })
}

// 修改项目集
export function updateItem_set(data) {
  return request({
    url: '/system/item_set',
    method: 'put',
    data: data
  })
}

// 删除项目集
export function delItem_set(itemSetId) {
  return request({
    url: '/system/item_set/' + itemSetId,
    method: 'delete'
  })
}
