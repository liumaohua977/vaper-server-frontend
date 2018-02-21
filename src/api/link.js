import request from '@/utils/request'

export function fetchLinks(query) {
  return request({
    url: '/netrelation/fetch',
    method: 'get',
    params: query
  })
}
