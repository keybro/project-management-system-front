import request from '@/utils/request'

// 查询执行列表列表
export function listExecute(query) {
  return request({
    url: '/system/execute/list',
    method: 'get',
    params: query
  })
}

// 查询执行列表详细
export function getExecute(executeId) {
  return request({
    url: '/system/execute/' + executeId,
    method: 'get'
  })
}

// 新增执行列表
export function addExecute(data) {
  return request({
    url: '/system/execute',
    method: 'post',
    data: data
  })
}

// 修改执行列表
export function updateExecute(data) {
  return request({
    url: '/system/execute',
    method: 'put',
    data: data
  })
}

// 删除执行列表
export function delExecute(executeId) {
  return request({
    url: '/system/execute/' + executeId,
    method: 'delete'
  })
}
