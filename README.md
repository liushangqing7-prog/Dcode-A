# Dcode-A

## GitHub Pages 部署

前端项目位于 `dnove-web/`。为保证在 GitHub Pages 上“直接打开/刷新子路由”不 404，项目已改为 Hash 路由并提供专用构建命令。

```bash
cd dnove-web
npm install
npm run build:github-pages
```

将 `dnove-web/dist` 目录内容发布到 GitHub Pages 即可。
