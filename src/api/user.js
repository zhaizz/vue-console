import request from './request'

export const user = (params) => {
	return request({
		url: '/users',
		method: 'GET',
		params
	})
}
