import Vue from "vue";
import { Layout, Drawer, Menu, Radio, Button, Icon } from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.less";

Vue.config.productionTip = false;

Vue.use(Layout);
Vue.use(Drawer);
Vue.use(Menu);
Vue.use(Radio);
Vue.use(Button);
Vue.use(Icon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
