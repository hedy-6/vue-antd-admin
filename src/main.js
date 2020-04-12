import Vue from "vue";
import { Layout, Drawer, Menu, Radio, Button, Icon } from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Authorized from "./components/Authorized.vue";
import Auth from "./directives/auth";

Vue.config.productionTip = false;

Vue.use(Layout);
Vue.use(Drawer);
Vue.use(Menu);
Vue.use(Radio);
Vue.use(Button);
Vue.use(Icon);
Vue.component("Authorized", Authorized);
Vue.use(Auth);

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1749607_ngj29yuthrr.js"
});
Vue.component("IconFont", IconFont);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
