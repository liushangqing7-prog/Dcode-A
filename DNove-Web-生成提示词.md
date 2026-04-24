# 网页版 DNove 写作辅助工具（生成提示词）

## 使用方式
将以下提示词直接发送给 AI 编码助手（如 GPT、Claude、DeepSeek），用于生成完整的 `Vue 3 + TypeScript` 网页应用代码。

---

你是一名资深全栈工程师。请基于以下需求，生成一个**可运行、可构建、可离线使用（PWA）**的 DNove 小说写作辅助 Web 应用完整代码。

## 一、产品目标
- 技术栈：Vue 3 + TypeScript + Pinia + Vite + PWA。
- 形态：纯前端、离线优先。
- 数据：默认存浏览器本地（IndexedDB/localStorage），并优先支持 File System Access API 直接读写用户选择的本地工作区文件夹。
- 主题：暗色主题。
- 布局：三栏可调整（左大纲 / 中编辑器 / 右 AI 草案）。

## 二、核心功能

### 1) 工作区管理
- 首次使用或点击“打开工作区”时，弹窗选择本地文件夹（`window.showDirectoryPicker`）。
- 若浏览器不支持 File System Access API：自动降级为 IndexedDB，并支持导入/导出 zip。
- 目录结构参考：
  - `workspace/小说A/novel.json`
  - `chapters/`
  - `settings/`
  - `snapshots/`
  - `vectors/`
- 支持：切换工作区、导出工作区 zip、导入 zip 恢复。

### 2) 三栏编辑界面
- 左栏：大纲树（分卷/章节）
  - 支持拖拽排序、右键菜单（新增/删除/重命名）、折叠。
- 中栏：Markdown 编辑器（Monaco 或 CodeMirror 6）
  - 编辑/预览分屏或切换。
  - 底部状态栏：字数、段落数、预计阅读时长、快捷键提示。
- 右栏：AI 草案区
  - 每条草案可：勾选、编辑、丢弃、采用。
  - 采用时支持：插入到光标位置或替换选中文本。
  - 右栏还需提供“设定库入口”（人物/世界观/大纲草稿）。

### 3) 设定卡系统（Markdown + YAML Front Matter）
- 支持：
  - 人物卡：`.char.md`
  - 世界观卡：`.world.md`
  - 大纲：`.outline.md`
- 编辑器内划词后支持：
  - 查询设定（弹窗展示相关片段）
  - AI 生成补充设定（结果进入右侧草案区）
- 每个设定实体需维护：
  - `confirmed`（确认版）
  - `proposals[]`（AI 提案）
  - 支持“采用/合并”。

### 4) AI 调用中心
- 前端直接请求用户配置的 API（用户自带 key）。
- 兼容 OpenAI 风格接口（如 OpenAI、DeepSeek、通义千问等）。
- 可配置项：`endpoint`, `apiKey`, `model`, `temperature`, `maxTokens`。
- Prompt 模板：`prompts/*.txt`，支持占位符：
  - `{{selectedText}}`
  - `{{recentSummary}}`
  - `{{characters}}`
- 生成流程：选中正文/大纲 → 点击 AI 续写/扩写 → 拼接上下文 + 模板 → 请求 API → 结果入草案区。
- 支持并行生成 2-3 个分支。
- 记录 token 用量与费用估算；支持月度预算提醒（前端提醒，不强制拦截）。

### 5) “一句话创世”
- 入口：首页按钮或导航按钮。
- 流程：输入一句脑洞 → AI 生成结构化草案（JSON：风格、冲突、角色雏形、关键节点） → 用户确认编辑 → 自动创建新小说。
- 创建后写入：
  - `novel.json`
  - 初始角色卡/世界观卡草稿（`status: draft`）

### 6) 长篇记忆与上下文注入
- 每章可保存“章节摘要”（手动或 AI 辅助）。
- AI 请求时自动拼接最近 5 章摘要 + 当前章节开头。
- 人物卡含动态状态字段（位置/伤势/等级等），支持“更新角色状态”。
- 可选：本地向量检索框架
  - `@xenova/transformers`（embedding）
  - 向量存储于 IndexedDB
  - 余弦相似度检索
  - 根据光标前 100 字检索 Top-3 历史片段注入 prompt。

### 7) 版本快照与回滚
- 手动保存章节或采纳 AI 草案时，自动创建快照。
- 快照内容：正文 + 设定状态。
- 快照管理：列表、差异对比（diff）、一键回滚。
- 支持手动分支标签（如“剧情分支A”）。

### 8) 辅助工具
- 本地错别字/重复词检测（可用 WASM 方案）。
- 敏感词过滤与替换建议。
- 专注模式（全屏/字数目标/遮罩非核心 UI）。
- 导出 DOCX/TXT。

## 三、技术与工程要求
- 框架：Vue 3 + Composition API + TypeScript
- 状态：Pinia
- 路由：Vue Router（首页、编辑器页、设置页）
- UI：Naive UI / Element Plus / Tailwind 任选，但必须暗色可用
- 编辑器：CodeMirror 6 或 Monaco（Markdown 扩展）
- Markdown：`marked`
- Front matter：`front-matter`
- YAML：`js-yaml`
- 打包：Vite + `vite-plugin-pwa`
- AI 请求：`fetch`，支持流式输出

## 四、建议目录结构
```txt
dnove-web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── LeftPanel.vue
│   │   │   ├── CenterEditor.vue
│   │   │   └── RightPanel.vue
│   │   ├── ai/
│   │   │   ├── DraftArea.vue
│   │   │   ├── PromptTemplateSelector.vue
│   │   │   └── ModelSettings.vue
│   │   ├── settings/
│   │   └── worldbuilding/
│   ├── composables/
│   │   ├── useFileSystem.ts
│   │   ├── useAI.ts
│   │   ├── useWorkSpace.ts
│   │   └── useVectorStore.ts
│   ├── stores/
│   │   ├── workspace.ts
│   │   ├── novel.ts
│   │   ├── settings.ts
│   │   └── ai.ts
│   ├── services/
│   │   ├── ai/
│   │   │   ├── AIService.ts
│   │   │   └── OpenAIAdapter.ts
│   ├── types/
│   ├── utils/
│   ├── views/
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 五、输出格式要求（非常重要）
请直接按以下格式输出：
1. 逐文件输出完整代码。
2. 每个文件前标注路径，例如：`### 文件：src/main.ts`。
3. 不要省略任何关键文件。
4. 代码必须可运行，不要伪代码。
5. 所有注释清晰，遵循 Vue 3 Composition API 最佳实践。

## 六、必须包含的实现清单
1. 完整 `package.json`
2. `vite.config.ts`（含 PWA 配置）
3. `src/types/*`：`Novel`, `Chapter`, `Character`, `WorldSetting`, `AIConfig`, `PromptTemplate` 等
4. Pinia：`useWorkSpaceStore`, `useNovelStore`, `useAIStore`
5. `src/composables/useFileSystem.ts`：封装 `saveFile/readFile/listDirectory`，支持 File System Access API 与 IndexedDB 双后端自动切换
6. 左侧大纲树组件（拖拽排序 + 递归显示）
7. 中间编辑器组件（Markdown + 预览 + 字数统计）
8. 右侧 AI 草案组件（采用/编辑/丢弃）
9. AI Service 抽象 + OpenAI 适配器（流式/非流式）
10. 一句话创世流程（弹窗→生成→确认创建）
11. 本地向量检索功能代码框架（可选启用）
12. 清晰注释、低耦合、高可维护

---

如果你认为某些浏览器能力不稳定（例如 File System Access API），请在代码中实现能力检测和降级逻辑，并在 UI 中明确提示当前运行模式（文件系统模式 / 本地数据库模式）。
