import request from '@/utils/request';

// 列表
export function getVariableList(params) {
    return request.get('/api_variable/', params);
}

export function getAllVar(params) {
    return request.get('/api_variable/allVar', params);
}

// 创建
export function modifyVariable(params) {
  return request.post('/api_variable/modifyVariable', params);
}

// 删除
export function delateVariable(params) {
  return request.post('/api_variable/delateVariable', params);
}

export function getByID(params) {
  return request.post('/api_variable/getListById', params);
}