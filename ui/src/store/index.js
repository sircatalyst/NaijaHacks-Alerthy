import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
  },
  getters: {
    auth: state => !!state.token,
    token: state => state.token,
  },
  mutations: {
    LOGIN(state, { token }) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    LOGOUT(state) {
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  actions: {
    async register({ commit }, payload) {
      const { data } = await axios.post('http://localhost:5000/api/v1/register', payload);
      commit('LOGIN', data);
    },
    async login({ commit }, payload) {
      const { data } = await axios.post('http://localhost:5000/api/v1/login', payload);
      commit('LOGIN', data);
    },
    async logout({ commit }) {
      await axios.get('http://localhost:5000/api/v1/logout');
      commit('LOGOUT');
    },
    isAuthenticated({ getters }) {
      return getters.auth;
    }
  },
  modules: {
  }
});
