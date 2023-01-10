import request1 from './request'

export const login = (data) => {
  return request1({
    url: '/login',
    method: 'POST',
    data
  })
}
