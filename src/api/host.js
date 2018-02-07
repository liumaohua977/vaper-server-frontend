import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/host/search',
    method: 'post',
    params: query
  })
}

export function fetchListByIdNDeepth(query) {
  return request({
    url: '/host/search/by/id/deepth',
    method: 'post',
    data: query
  })
}

export function fetchListByUids(query) {
  return request({
    url: '/host/search/by/uids',
    method: 'post',
    data: query
  })
}

export function getHostCount(query) {
  return request({
    url: '/host/count',
    method: 'get',
    data: query
  })
}
export function getLinksCount(query) {
  return request({
    url: '/netrelation/count',
    method: 'get',
    data: query
  })
}

export function updateTags(query) {
  return request({
    url: '/host/updateTags',
    method: 'post',
    data: query
  })
}
