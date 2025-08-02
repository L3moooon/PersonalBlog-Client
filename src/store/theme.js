import { defineStore } from "pinia";

export const useThemeStore = defineStore('Theme', {
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