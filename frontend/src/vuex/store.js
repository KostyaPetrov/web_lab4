import { createStore } from 'vuex'
import VuexPersist from 'vuex-persist';
import axios from "axios";

const SUCCESS_CODE = 200

const vuexLocal = new VuexPersist({
    storage: window.localStorage
})

let store = createStore({
    plugins: [vuexLocal.plugin],
    state () {
        return {
            authData: null,
            tableData: Array(),
        }
    },
    mutations: {
        SET_AUTH_DATA (state, auth_data) {
            state.authData = auth_data
        },
        CLEAN_UP_LOGIN (state) {
            state.authData = null
        },
        ADD_TABLE_DATA (state, value) {
            state.tableData.push({
                x_axis: value.x,
                y_axis: value.y,
                radius: value.radius,
                is_hit: value.is_hit,
            })
        },
        SET_TABLE_DATA (state, value) {
            state.tableData = value.map(item => ({
                x_axis: item.x,
                y_axis: item.y,
                radius: item.radius,
                is_hit: item.is_hit,
            }))
        },
        DELETE_TABLE_DATA (state) {
            state.tableData = Array()
        }
    },
    actions: {
        LOGIN({commit}, payload) {
            const auth_data = {
                username: payload.login,
                password: payload.password
            }
            return new Promise((resolve, reject) => {
                axios.post(process.env.VUE_APP_BACKEND_URL + '/login', {}, {
                    auth: auth_data
                })
                .then((response) => {
                    commit('SET_AUTH_DATA', auth_data)
                    resolve(response.status === SUCCESS_CODE)
                })
                .catch(() => {
                    reject(false)
                })
            })
        },
        SIGN_UP({commit}, payload) {
            const auth_data = {
                username: payload.login,
                password: payload.password
            }
            return new Promise((resolve, reject) => {
                axios.post(process.env.VUE_APP_BACKEND_URL + '/users', {
                    login: auth_data.username,
                    password: auth_data.password
                })
                .then((response) => {
                    if (response.status === SUCCESS_CODE){
                        commit('SET_AUTH_DATA', auth_data)
                        resolve({isSuccess: true, msg: ""})
                    } else {
                        resolve({isSuccess: false, msg: response.data})
                    }
                })
                .catch((response) => {
                    reject({isSuccess: false, msg: response.response.data})
                })
            })
        },
        SEND_DATA({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(process.env.VUE_APP_BACKEND_URL + '/compile', {
                    "x": payload.x,
                    "y": payload.y,
                    "radius": payload.radius
                }, {auth: this.state.authData})
                .then((response) => {
                    if (response.status === SUCCESS_CODE){
                        commit('ADD_TABLE_DATA', {
                            "x": payload.x,
                            "y": payload.y,
                            "radius": payload.radius,
                            "is_hit": response.data.is_hit
                        })
                        resolve({isSuccess: true, data: response.data})
                    } else {
                        resolve({isSuccess: false, data: response.data})
                    }
                })
                .catch((response) => {
                    reject({isSuccess: false, data: response.response.data})
                })
            })
        },
        GET_ALL_DATA({commit}) {
            return new Promise((resolve, reject) => {
                axios.get(process.env.VUE_APP_BACKEND_URL + '/all-data', {auth: this.state.authData})
                .then((response) => {
                    if (response.status === SUCCESS_CODE){
                        commit('SET_TABLE_DATA', response.data.items)
                        resolve({isSuccess: true, data: this.state.tableData})
                    } else {
                        resolve({isSuccess: false, data: this.state.tableData})
                    }
                })
                .catch(() => {
                    reject({isSuccess: false, data: this.state.tableData})
                })
            })
        },
        DELETE_ALL_DATA({commit}) {
            return new Promise((resolve, reject) => {
                axios.delete(process.env.VUE_APP_BACKEND_URL + '/all-data', {auth: this.state.authData})
                    .then((response) => {
                        if (response.status === SUCCESS_CODE){
                            commit('DELETE_TABLE_DATA')
                            resolve({isSuccess: true})
                        } else {
                            resolve({isSuccess: false})
                        }
                    })
                    .catch(() => {
                        reject({isSuccess: false})
                    })
            })
        },
        LOG_OUT({commit}) {
            return new Promise(() => {
                commit('CLEAN_UP_LOGIN')
                commit('DELETE_TABLE_DATA')
            })
        }
    },
    getters: {
        IS_AUTHED(state) {
            return Boolean(state.authData)
        },
        TABLE_DATA(state) {
            return state.tableData
        }
    }
})

export default store;