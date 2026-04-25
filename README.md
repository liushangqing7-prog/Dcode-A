# Dcode-A（Python 纯命令行版）

按你的要求，仓库根目录入口已重写为**纯 Python 命令行工具**，不再提供网页跳转与本地静态站点服务。

## 快速开始

```bash
python3 app.py --help
```

## 核心命令

### 1) 初始化项目

```bash
python3 app.py init --title "我的小说" --author "作者名" --description "一句话简介" --tags 奇幻 冒险
```

会在当前目录创建：

- `.dcodea/project.json`（项目信息）
- `.dcodea/chapters/`（章节目录）

### 2) 新增章节

```bash
python3 app.py add --title "初遇" --content "这里写正文"
```

### 3) 查看章节列表

```bash
python3 app.py list
```

### 4) 查看某一章

```bash
python3 app.py show 1
```

### 5) 查看统计

```bash
python3 app.py stats
```

### 6) 导出整本为 Markdown

```bash
python3 app.py export --output novel.md
```

## 数据结构

```text
.
├─ app.py
└─ .dcodea/
   ├─ project.json
   └─ chapters/
      ├─ 0001.md
      ├─ 0002.md
      └─ ...
```

## 说明

- 工具仅使用 Python 标准库。
- 默认使用当前目录作为项目根目录。
- 可通过 `--root /path/to/workspace` 在其他目录操作。
