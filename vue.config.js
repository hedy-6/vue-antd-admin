module.exports = {
  transpileDependencies: [
    "ant-design-vue",
    "axios",
    "echarts",
    "lodash",
    "nprogress",
    "resize-detector"
  ],
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        bypass: function(req, res) {
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
};
