import Vue from "vue";
import {
  Layout,
  Drawer,
  Menu,
  Dropdown,
  Radio,
  DatePicker,
  Button,
  Icon,
  LocaleProvider
} from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Authorized from "./components/Authorized.vue";
import Auth from "./directives/auth";
import VueI18n from "vue-i18n";
import en_US from "./locale/en_US";
import zh_CN from "./locale/zh_CN";
import queryString from "query-string";

Vue.config.productionTip = false;

Vue.use(Layout);
Vue.use(Drawer);
Vue.use(Menu);
Vue.use(Dropdown);
Vue.use(Radio);
Vue.use(DatePicker);
Vue.use(Button);
Vue.use(Icon);
Vue.use(LocaleProvider);
Vue.component("Authorized", Authorized);
Vue.use(Auth);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: queryString.parse(location.search).locale || "zh_CN",
  messages: {
    zh_CN: { message: zh_CN },
    en_US: { message: en_US }
  }
});

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1749607_ngj29yuthrr.js"
});
Vue.component("IconFont", IconFont);

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
