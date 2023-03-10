import request from '@/utils/request'

// 查询测试步骤列表
export function listStep(query) {
  return request({
    url: '/system/step/list',
    method: 'get',
    params: query
  })
}

// 查询测试步骤详细
export function getStep(stepId) {
  return request({
    url: '/system/step/' + stepId,
    method: 'get'
  })
}

// 新增测试步骤
export function addStep(data) {
  return request({
    url: '/system/step',
    method: 'post',
    data: data
  })
}

// 修改测试步骤
export function updateStep(data) {
  return request({
    url: '/system/step',
    method: 'put',
    data: data
  })
}

// 删除测试步骤
export function delStep(stepId) {
  return request({
    url: '/system/step/' + stepId,
    method: 'delete'
  })
}
