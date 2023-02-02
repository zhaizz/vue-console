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
	})
}

export const editUser = (params, data) => {
	return request({
		url: '/users/' + params,
		method: 'PUT',
		data
	})
}

export const addRole = (params, data) => {
	return request({
		url: '/users/' + params + '/role',
		method: 'PUT',
		data
	})
}

export const changeStatus = (id, type) => {
	return request({
		url: '/users/' + id + '/state/' + type,
		method: 'PUT'
	})
}

export const getInfo = (id) => {
	return request({
		url: '/users/' + id,
		method: 'GET'
	})
}
