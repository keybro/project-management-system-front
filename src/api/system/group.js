import request from '@/utils/request'

// 查询团队列表列表
export function listGroup(query) {
  return request({
    url: '/system/group/list',
    method: 'get',
    params: query
  })
}

// 查询团队列表详细
export function getGroup(groupId) {
  return request({
    url: '/system/group/' + groupId,
    method: 'get'
  })
}

// 新增团队列表
export function addGroup(data) {
  return request({
    url: '/system/group',
    method: 'post',
    data: data
  })
}

// 修改团队列表
export function updateGroup(data) {
  return request({
    url: '/system/group',
    method: 'put',
    data: data
  })
}

// 删除团队列表
export function delGroup(groupId) {
  return request({
    url: '/system/group/' + groupId,
    method: 'delete'
  })
}
