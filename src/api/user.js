import request from '@/utils/request';

export function login(data) {
    return request.post('/user/login', data);
}

// export function logout() {
//     return request({
//         url: '/vue-admin-template/user/logout',
//         method: 'post',
//     });
// }

export function UserList(data) {
    return request.get('/user/list', data);
}

export function SetUserRoles(data) {
    return request.post('/user/roles', data);
}
