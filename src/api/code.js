import request from '@/utils/request';

export function getCodelist(data) {
  return request.get('/code', data);
}

export function updateCode(data) {
  return request.post('/code/edit', data);
}
