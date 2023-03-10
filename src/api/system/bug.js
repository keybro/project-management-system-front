import request from '@/utils/request'

// 查询bug列表列表
export function listBug(query) {
  return request({
    url: '/system/bug/list',
    method: 'get',
    params: query
  })
}

// 查询bug列表详细
export function getBug(bugId) {
  return request({
    url: '/system/bug/' + bugId,
    method: 'get'
  })
}

// 新增bug列表
export function addBug(data) {
  return request({
    url: '/system/bug',
    method: 'post',
    data: data
  })
}

// 修改bug列表
export function updateBug(data) {
  return request({
    url: '/system/bug',
    method: 'put',
    data: data
  })
}

// 删除bug列表
export function delBug(bugId) {
  return request({
    url: '/system/bug/' + bugId,
    method: 'delete'
  })
}
