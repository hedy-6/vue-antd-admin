# vue-admin

## 安装vue-cli

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli

vue --version
# @vue/cli 4.2.3
```

## 创建一个vue项目

```
vue create appname
# Project setup
yarn install
# Compiles and hot-reloads for development
yarn serve
# Compiles and minifies for production
yarn build
# Run your unit tests
yarn test:unit
# Lints and fixes files
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 选择UI

- [Ant Design Vue](https://www.antdv.com/docs/vue/introduce-cn/)
- [elementUI](https://element.eleme.cn/#/zh-CN/component/installation)
- [iviewUI](https://www.iviewui.com/docs/introduce)

这里选择 Ant Design Vue
```
yarn add ant-design-vue
```

在 main.js 中引入：

```
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(DatePicker);
```

如果想要引入 less 文件，则需在 vue.config.js 配置如下：（或给less版本降级2.x）

```
module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
};
```

### Antd 按需加载

```
yarn add babel-plugin-import --dev
```

在babel.config.js中添加如下配置：

```
plugins: [
    [
        "import",
        { 
            libraryName: "ant-design-vue", 
            libraryDirectory: "es", 
            style: true 
        }
    ] 
// `style: true` 会加载 less 文件;如果是 css 文件，`style: "css"`
]
```

在 main.js 中引入：

```
import { DatePicker } from 'ant-design-vue';

Vue.use(DatePicker);
```

## 配置路由

### 页面路由跳转进度条
```
yarn add nprogress
```

```
import NProgress from "nprogress";
import "nprogress/nprogress.css";

router.beforeEach((to, form, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});
```

## 菜单与路由结合

* hideInMenu 该路由在菜单中隐藏
* hideChildrenInMenu 该路由的子路由在菜单中隐藏
* meta: { icon: "dashboard", title: "仪表盘" }
* name: 不是实际路由，如 ```path: "/"``` 不设置name，则在菜单中不予渲染

```
getMenuData(routes = [], parentKeys = [], selectedKey) {
  const menuData = [];
  for (let item of routes) {
    if (item.meta && item.meta.authority && !check(item.meta.authority)) {
      break;
    }
    if (item.name && !item.hideInMenu) {
      this.openKeysMap[item.path] = parentKeys;
      this.selectedKeysMap[item.path] = [selectedKey || item.path];
      const newItem = { ...item };
      delete newItem.children;
      if (item.children && !item.hideChildrenInMenu) {
        newItem.children = this.getMenuData(item.children, [
          ...parentKeys,
          item.path
        ]);
      } else {
        this.getMenuData(
          item.children,
          selectedKey ? parentKeys : [...parentKeys, item.path],
          selectedKey || item.path
        );
      }
      menuData.push(newItem);
    } else if (
      !item.hideInMenu &&
      !item.hideChildrenInMenu &&
      item.children
    ) {
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          );
        }
      }
      return menuData;
    }
```

## 权限设计

### 全局注册组件

```
import Authorized from "./components/Authorized.vue";
Vue.component("Authorized", Authorized);
```

```
import { check } from "@/utils/auth";

export default {
  functional: true, // 使组件无状态 (没有 data) 和无实例 (没有 this 上下文)。他们用一个简单的 render 函数返回虚拟节点使它们渲染的代价更小。
  props: {
    authority: {
      type: Array,
      required: true
    }
  },
  render(h, context) {
    const { props, scopedSlots } = context;
    return check(props.authority) ? scopedSlots.default() : null;
  }
};
```

### 指令

```
import Auth from "./directives/auth";
Vue.use(Auth);
```

```
import { check } from "../utils/auth";

function install(Vue, option = {}) {
  Vue.directive(option.name || "auth", {
    inserted(el, binding) {
      if (!check(binding.value)) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  });
}

export default {
  install
};
```


* 全局注册组件能够响应权限的变化，而作出改变；缺点是需要嵌套在每个组件上； ```<Authorized :authority="['admin']"><Custom /></Authorized>```
* 指令只能在第一次加载的时候，判断权限；优点是不需要嵌套，直接在组件上 ```v-auth="['admin']"```

## 常用插件

- [lodash](https://www.lodashjs.com/)