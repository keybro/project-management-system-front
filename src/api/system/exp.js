import request from '@/utils/request'

// 查询测试列表列表
export function listExp(query) {
  return request({
    url: '/system/exp/list',
    method: 'get',
    params: query
  })
}

// 查询测试列表详细
export function getExp(testId) {
  return request({
    url: '/system/exp/' + testId,
    method: 'get'
  })
}

// 新增测试列表
export function addExp(data) {
  return request({
    url: '/system/exp',
    method: 'post',
    data: data
  })
}

// 修改测试列表
export function updateExp(data) {
  return request({
    url: '/system/exp',
    method: 'put',
    data: data
  })
}

// 删除测试列表
export function delExp(testId) {
  return request({
    url: '/system/exp/' + testId,
    method: 'delete'
  })
}
