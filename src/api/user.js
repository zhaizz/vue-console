import request from './request'

export const getUserList = (params) => {
	return request({
		url: '/users',
		method: 'GET',
		params
	})
}

export const addUser = (data) => {
	return request({
		url: '/users',
		method: 'POST',
		data
	})
}

export const delUser = (params) => {
	return request({
		url: '/users/' + params,
		method: 'DELETE'
		// params
	})
}

export const editUser = (params, data) => {
	return request({
		url: '/users/' + params,
		method: 'PUT',
		data
	})
}
