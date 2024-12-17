import { defineStore } from "pinia";

export const useUserStore = defineStore('User', {
  state: () => {
    return {
      nickname: '',
      portrait: '',
      saying: [],
      url: [],
    }
  },
  getters: {},
  actions: {},
})