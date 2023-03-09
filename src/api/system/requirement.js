import request from '@/utils/request'

// 查询研发需求列表
export function listRequirement(query) {
  return request({
    url: '/system/requirement/list',
    method: 'get',
    params: query
  })
}

// 查询研发需求详细
export function getRequirement(productRequirementId) {
  return request({
    url: '/system/requirement/' + productRequirementId,
    method: 'get'
  })
}

// 新增研发需求
export function addRequirement(data) {
  return request({
    url: '/system/requirement',
    method: 'post',
    data: data
  })
}

// 修改研发需求
export function updateRequirement(data) {
  return request({
    url: '/system/requirement',
    method: 'put',
    data: data
  })
}

// 删除研发需求
export function delRequirement(productRequirementId) {
  return request({
    url: '/system/requirement/' + productRequirementId,
    method: 'delete'
  })
}
