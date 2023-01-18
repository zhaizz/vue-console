import request from './request'

export const getRoles = () => {
	return request({
		url: '/roles',
		method: 'GET'

	})
}
