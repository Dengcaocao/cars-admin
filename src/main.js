import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
// 重置样式
import '@/assets/style/reset.css'

// ui组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '@/scss/main.scss'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
