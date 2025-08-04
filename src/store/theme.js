import { defineStore } from "pinia";

export const useThemeStore = defineStore('Theme', {
  state: () => {
    return {
      nickname: '',
      portrait: '',
      saying: [],
      url: [],
      themeData: {}
    }
  },
  actions: {
    setThemeData(data) {
      this.themeData = data
    }
  },
})