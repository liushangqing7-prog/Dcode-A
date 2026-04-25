# Dcode-A

## Python 本地入口（功能保留版）

仓库根目录提供了 `app.py`，使用 Python 启动静态服务并在访问根路径时自动跳转到 `dnove-web/`，与原先根目录 `index.html` 的跳转功能一致。

```bash
python3 app.py --host 127.0.0.1 --port 8000
```

启动后访问：`http://127.0.0.1:8000/`

---

## GitHub Pages 部署

前端项目位于 `dnove-web/`。为保证在 GitHub Pages 上“直接打开/刷新子路由”不 404，项目已改为 Hash 路由并提供专用构建命令。

```bash
cd dnove-web
npm install
npm run build:github-pages
```

将 `dnove-web/dist` 目录内容发布到 GitHub Pages 即可。

## 前端开发环境

```bash
cd dnove-web
npm install
npm run dev
```
