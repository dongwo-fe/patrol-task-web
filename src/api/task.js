import request from '@/utils/request';

// export function getTackList(params) {
//     return request.get('/api_test/test', params);
// }
// 列表
export function getTackList(params) {
    return request.get('/api_task/', params);
}
// 执行任务
export function runTack(params) {
  return request.post('/api_task/runTask', params);
}
// 创建任务
export function modifyTask(params) {
  return request.post('/api_task/modifyTask', params);
}
// 删除任务
export function delateTask(params) {
  return request.post('/api_task/delateTask', params);
}
// 启停任务
export function updateState(params) {
  return request.post('/api_task/updateTaskState', params);
}

// 获取任务详情
export function getTackDetails(params) {
  return request.get('/api_task/getTackDetails', params);
}

// 获取巡检记录
export function getTackRecord(params) {
  return request.post('/api_task/getTackRecord', params);
}