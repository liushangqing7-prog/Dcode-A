# Dcode-A

## GitHub Pages 部署

前端项目位于 `dnove-web/`。为保证在 GitHub Pages 上“直接打开/刷新子路由”不 404，项目已改为 Hash 路由并提供专用构建命令。

```bash
cd dnove-web
npm install
npm run build:github-pages
```

将 `dnove-web/dist` 目录内容发布到 GitHub Pages 即可。


## 本地打开说明

仓库根目录新增了 `index.html`，会自动跳转到 `dnove-web/`，避免误以为项目入口缺失。

> 注意：`dnove-web/index.html` 是 Vite 开发入口，不能直接双击以 `file://` 方式运行。请使用开发服务器：

```bash
cd dnove-web
npm install
npm run dev
```

