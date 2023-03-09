import request from '@/utils/request'

// 查询产品计划列表列表
export function listPlan(query) {
  return request({
    url: '/system/plan/list',
    method: 'get',
    params: query
  })
}

// 查询产品计划列表详细
export function getPlan(panId) {
  return request({
    url: '/system/plan/' + panId,
    method: 'get'
  })
}

// 新增产品计划列表
export function addPlan(data) {
  return request({
    url: '/system/plan',
    method: 'post',
    data: data
  })
}

// 修改产品计划列表
export function updatePlan(data) {
  return request({
    url: '/system/plan',
    method: 'put',
    data: data
  })
}

// 删除产品计划列表
export function delPlan(panId) {
  return request({
    url: '/system/plan/' + panId,
    method: 'delete'
  })
}
