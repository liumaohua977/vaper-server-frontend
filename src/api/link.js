import request from '@/utils/request'

export function fetchLinks(query) {
  return request({
    url: '/netflow/fetch',
    method: 'get',
    params: query
  })
}
