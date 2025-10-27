import { defineStore } from "pinia";
import { debounce } from "lodash";
export const useThemeStore = defineStore("Theme", {
  state: () => {
    return {
      nickname: "",
      portrait: "",
      saying: [],
      url: [],
      themeData: {},
      screenWidth: window.innerWidth,
      breakpoints: {
        mobile: 768,
        // tablet: 1024,
      },
    };
  },
  actions: {
    setThemeData(data) {
      this.themeData = data;
    },
    // 是否为移动端
    isMobile() {
      return this.screenWidth < this.breakpoints.mobile;
    },
    // 是否为桌面端
    isDesktop() {
      return this.screenWidth >= this.breakpoints.mobile;
    },

    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
      console.log(1111111111);
    },
    listenResize() {
      const handleResize = debounce(() => {
        this.updateScreenWidth();
      }, 100);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
  },
});
