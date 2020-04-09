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

### [axios](https://github.com/axios/axios)

```
yarn add axios
```

### [lodash](https://www.lodashjs.com/)

```
yarn add lodash
```

### [echarts](https://www.echartsjs.com/zh/index.html)

```
yarn add echarts
yarn add resize-detector
```

#### echarts封装

```
<template>
  <div ref="chartDom"></div>
</template>
<script>
import echarts from "echarts";
import debounce from "lodash/debounce";
import { addListener, removeListener } from "resize-detector";
export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    option(val) {
      this.chart.setOption(val);
    }
  },
  created() {
    this.resize = debounce(this.resize, 300); // 防抖动
  },
  mounted() {
    this.renderChart();
    addListener(this.$refs.chartDom, this.resize);
  },
  beforeDestroy() {
    removeListener(this.$refs.chartDom, this.resize);
    this.chart.dispose(); // 销毁实例
    this.chart = null;
  },
  methods: {
    resize() {
      this.chart.resize();
    },
    renderChart() {
      this.chart = echarts.init(this.$refs.chartDom);
      this.chart.setOption(this.option);
    }
  }
};
</script>
```

## 本地模拟数据

在根目录下新建mock目录，目录下文件名命名规则为```moduleName_functionName```

在```vue.config.js```中配置

```
devServer: {
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      bypass: function (req, res) {
        if (req.headers.accept.indexOf("html") !== -1) {
          console.log("Skipping proxy for browser request.");
          return "/index.html";
        } else {
          const name = req.path
            .split("/api/")[1]
            .split("/")
            .join("_");
          const mock = require(`./mock/${name}`);
          const result = mock(req.method);
          delete require.cache[require.resolve(`./mock/${name}`)]; // 清除require缓存
          return res.send(result);
        }
      }
    }
  }
}
```

## IE 浏览器兼容

> browserslist 

```package.json``` 文件里的 ```browserslist``` 字段 (或一个单独的 ```.browserslistrc``` 文件)，指定项目的目标浏览器的范围。这个值会被 @babel/preset-env 和 Autoprefixer 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。

> Polyfill

**```useBuiltIns: 'usage'```**

根据源代码中出现的语言特性自动检测需要的 polyfill。这确保了最终包里 polyfill 数量的最小化。然而，这也意味着如果其中一个依赖需要特殊的 polyfill，默认情况下 Babel 无法将其检测出来。

如果有依赖需要 polyfill，你有几种选择：

1. 如果该依赖基于一个目标环境不支持的 ES 版本撰写: 将其添加到 vue.config.js 中的 transpileDependencies 选项。这会为该依赖同时开启语法转换和根据使用情况检测 polyfill。

2. 如果该依赖交付了 ES5 代码并显式地列出了需要的 polyfill: 你可以使用 @vue/babel-preset-app 的 polyfills 选项预包含所需要的 polyfill。注意 es.promise 将被默认包含，因为现在的库依赖 Promise 是非常普遍的。

```
// babel.config.js
module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es.promise',
        'es.symbol'
      ]
    }]
  ]
}
```

3. 如果该依赖交付 ES5 代码，但使用了 ES6+ 特性且没有显式地列出需要的 polyfill (例如 Vuetify)：请使用 useBuiltIns: 'entry' 然后在入口文件添加 import 'core-js/stable'; import 'regenerator-runtime/runtime';。这会根据 browserslist 目标导入所有 polyfill，这样你就不用再担心依赖的 polyfill 问题了，但是因为包含了一些没有用到的 polyfill 所以最终的包大小可能会增加。
