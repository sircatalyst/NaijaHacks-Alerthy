import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../lib/axios';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    recipient: localStorage.getItem('recipient') || [],
    message: localStorage.getItem('message') || [],
    alert: localStorage.getItem('alert') || [],
    trigger: localStorage.getItem('trigger') || '',
  },
  getters: {
    auth: state => !!state.token,
    token: state => state.token,
    recipient: state => state.recipient,
    message: state => state.message,
    alert: state => state.alert,
    trigger: state => state.trigger,
  },
  mutations: {
    LOGIN(state, { token }) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    RECIPIENT(state, { data }) {
      state.recipient.unshift(data);
      localStorage.setItem('recipient', JSON.stringify(state.recipient));
    },
    MESSAGE(state, { data }) {
      state.message.unshift(data);
      localStorage.setItem('message', JSON.stringify(state.message));
    },
    ALERT(state, { data }) {
      state.alert.unshift(data);
      localStorage.setItem('alert', JSON.stringify(state.alert));
    },
    TRIGGER(state, { message }) {
      state.trigger = message;
      localStorage.setItem('trigger', message);
    },
    STOPTRIGGER(state, { message }) {
      state.trigger = message;
      localStorage.setItem('stopTrigger', message);
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
    async recipientCreate({ commit }, payload) {
      const { data } = await axios.post('recipients', payload);
      commit('RECIPIENT', data);
    },
    async messageCreate({ commit }, payload) {
      const { data } = await axios.post('messages/main', payload);
      commit('MESSAGE', data);
    },
    async alertCreate({ commit }, payload) {
      const { data } = await axios.post('alerts', payload);
      commit('ALERT', data);
    },
    async triggerCreate({ commit }, payload) {
      const { data } = await axios.patch('alerts/send/main', payload);
      commit('TRIGGER', data);
    },
    async triggerStop({ commit }) {
      const { data } = await axios.get('alerts/stop/main');
      commit('STOPTRIGGER', data);
    },
    isAuthenticated({ getters }) {
      return getters.auth;
    }
  },
  modules: {
  }
});
