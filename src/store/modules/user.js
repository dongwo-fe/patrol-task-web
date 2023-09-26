import { login } from '@/api/user';
import { loginos, checkUser } from '@/api/login';
import { getToken, setToken, removeToken, setData, getData } from '@/utils/auth';
import { resetRouter } from '@/router';
import md5 from 'js-md5';

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        phone: '',
        userId: '',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        roles: [],
    };
};

const state = getDefaultState();
const roles = getData('roles');
if (roles) {
    state.roles = roles.split(',');
}

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_DATA: (state, data) => {
        state.name = data.name;
        state.phone = data.phone;
        state.userId = data.userId;
        // state.roles = data.roles ? data.roles.split(',') : [];
    },
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { phone, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ phone: phone.trim(), password: md5(password), type: 1 })
                .then((data) => {
                    commit('SET_TOKEN', data.jwtToken);
                    setToken(data.jwtToken);
                    commit('SET_DATA', data);
                    setData('nickname', data.userName);
                    setData('roles', data.roles);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    // 三方登录接口
    async loginos({ commit }, code) {
        try {
            const data = await loginos(code);
            if (!data) return new Error('登录失败');
            commit('SET_TOKEN', data.token);
            setToken(data.token);
            commit('SET_DATA', data);
            setData('nickname', data.nickname);
            setData('roles', data.roles);
            data.avatar && commit('SET_AVATAR', data.avatar);
        } catch (error) {
            commit('SET_TOKEN', '');
            setToken('');
        }
    },

    // get user info
    async getInfo({ commit, state }) {
        // nickname
        // roles
        // uidentity
        // username
        try {
            const data = await checkUser();
            console.log(data);
            commit('SET_DATA', data);
            data.avatar && commit('SET_AVATAR', data.avatar);
            setData('nickname', data.nickname);
            setData('roles', data.roles);
        } catch (error) {
            console.log(error);
        }
        return {
            token: state.token,
            name: state.name,
            roles: [],
        };
    },

    // user logout
    logout({ commit, state }) {
        removeToken(); // must remove  token  first
        commit('RESET_STATE');
        resetRouter();
        // return new Promise((resolve, reject) => {
        //   logout(state.token).then(() => {
        //     removeToken(); // must remove  token  first
        //     resetRouter();
        //     commit('RESET_STATE');
        //     resolve();
        //   }).catch(error => {
        //     reject(error);
        //   });
        // });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken(); // must remove  token  first
            commit('RESET_STATE');
            resolve();
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
