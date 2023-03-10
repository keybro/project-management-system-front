import request from '@/utils/request'

// 查询执行团队列表
export function listExe(query) {
  return request({
    url: '/system/exe/list',
    method: 'get',
    params: query
  })
}

// 查询执行团队详细
export function getExe(groupId) {
  return request({
    url: '/system/exe/' + groupId,
    method: 'get'
  })
}

// 新增执行团队
export function addExe(data) {
  return request({
    url: '/system/exe',
    method: 'post',
    data: data
  })
}

// 修改执行团队
export function updateExe(data) {
  return request({
    url: '/system/exe',
    method: 'put',
    data: data
  })
}

// 删除执行团队
export function delExe(groupId) {
  return request({
    url: '/system/exe/' + groupId,
    method: 'delete'
  })
}
