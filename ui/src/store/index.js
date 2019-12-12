import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../lib/axios';

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
      const { data } = await axios.post('register', payload);
      commit('LOGIN', data);
    },
    async login({ commit }, payload) {
      const { data } = await axios.post('login', payload);
      commit('LOGIN', data);
    },
    async logout({ commit }) {
      await axios.get('logout');
      commit('LOGOUT');
    },
    isAuthenticated({ getters }) {
      return getters.auth;
    }
  },
  modules: {
  }
});
