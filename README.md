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
