# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 VitePress 构建的个人技术博客，主要分享 AI 开发相关内容，同时托管「找熊熊」等单文件小游戏与在线工具。网站采用极客风格的暗色主题；**线上站点由 Cloudflare Pages 部署**，GitHub 仅作为代码仓库与自动部署的触发源。

## 开发命令

```bash
# 开发服务器
pnpm docs:dev

# 构建生产版本
pnpm docs:build

# 预览生产构建
pnpm docs:preview
```

**注意**: 项目使用 `pnpm` 作为包管理器（指定版本 9.0.0），请始终使用 pnpm 而非 npm 或 yarn。

## 架构与结构

### 核心配置

- **VitePress 配置**: `.vitepress/config.mts` - 包含全局样式、导航、侧边栏、主题配置
- **自定义样式**: 内联在 config.mts 的 `<head>` 中，使用 CSS 变量定义品牌颜色（霓虹绿 `#00ff41`）

### 内容组织

```
docs/
├── index.md           # 首页
├── about.md           # 关于页面
├── projects.md        # 项目页（在线工具与小游戏入口）
├── blog/              # 博客文章
│   └── index.md       # 博客列表页
├── guide/             # 教程系列
│   └── index.md       # 教程列表页
└── public/            # 静态资源，构建时原样复制到 dist
    ├── _redirects     # Cloudflare Pages 重定向规则（纯文本，当前无生效规则）
    ├── _routes.json   # Functions 路由配置
    └── zhaoxiongxiong/
        └── index.html # 找熊熊：单文件游戏，独立 HTML 页
```

### 内容系列

博客和教程按系列组织：

1. **博客文章** (`/blog/`): 独立的技术文章
   - AI Agent 开发
   - RAG 实战
   - 本地 LLM 部署
   - Hermes Agent 教程

2. **教程系列** (`/guide/`): 系统化的教程内容
   - LangChain 教程（5篇）
   - Claude Code 教程（5篇）
   - 其他工具教程

### 侧边栏配置

侧边栏在 `.vitepress/config.mts` 中硬编码定义。添加新内容时需要同步更新：
- `/blog/` 侧边栏: 添加博客文章链接
- `/guide/` 侧边栏: 添加教程链接并按系列分组

### 部署配置

- **平台**: Cloudflare Pages，监听 GitHub `main` 分支，push 后自动构建部署
- **遗留工作流**: `.github/workflows/deploy.yml` 仍会部署到 GitHub Pages，但**不是线上访问入口**，不要以它判断站点状态
- **路由规则**: `docs/public/_redirects` 与 `_routes.json`（详见下方「找熊熊游戏页维护」）
- **构建输出**: `docs/.vitepress/dist/`（由 VitePress 生成，已 git 忽略）
- **推送**: 常规 `git push origin main`；若 HTTPS 被网络代理阻断，可改用 SSH 地址 `git@github.com:zhoujarvy/zhoujarvy.github.io.git`

## 内容开发指南

### 添加新博客文章

1. 在 `docs/blog/` 创建新的 `.md` 文件
2. 在 `.vitepress/config.mts` 的 `/blog/` 侧边栏添加链接
3. 可选：更新 `docs/blog/index.md` 添加文章摘要

### 添加新教程系列

1. 在 `docs/guide/` 创建新的 `.md` 文件（建议命名：`series-name-01-title.md`）
2. 在 `.vitepress/config.mts` 的 `/guide/` 侧边栏添加新系列分组
3. 更新 `docs/guide/index.md` 添加系列介绍

### 找熊熊游戏页维护

- 游戏本体是单文件 `docs/public/zhaoxiongxiong/index.html`，原生 HTML/CSS/JS 零依赖，不走 VitePress 路由，直接由 `/zhaoxiongxiong/` 提供。
- 源工程维护在 WorkBuddy 工作区 `找熊熊/index.html`；改动后需同步到本仓库副本。生成副本时保留 4 项博客专属内容：带博客名的 `<title>`、`meta description`、`.back-link` 样式、返回项目页链接；其余内容（尤其两段 `<script>`）必须与源文件一致。
- 项目页「立即试玩」链接必须带 `target="_self"`，否则 VitePress SPA 路由会拦截并落到 404。
- `_redirects` 只接受纯文本规则，不要写 TOML；也**不要**添加 `/* -> /index.html 200` 这类通配重写——Cloudflare Pages 会先于静态资源执行它，破坏 `/assets/*` 与 `/zhaoxiongxiong/`。
- `_routes.json` 的 `exclude` 需包含 `/zhaoxiongxiong` 与 `/zhaoxiongxiong/*`，避免 Functions 接管游戏静态页。
- 每次改动后执行 `pnpm docs:build`，确认 `docs/.vitepress/dist/zhaoxiongxiong/index.html` 与 `public` 中的副本字节一致。
- 若构建在「清空旧 dist」时被批量删除保护拦截，先把 `docs/.vitepress/dist` 移到临时目录再构建。

### 游戏交互约定

- 移动端：短按打叉、原地长按放熊熊、按住滑动连续打叉（从已有叉起手则连续擦除）；桌面右键等价长按。
- 「提示一只」有 60 秒冷却，按钮直接显示倒计时，冷却时间写入 localStorage。
- 主界面锁定为一屏（`100dvh` + 禁止页面滚动），棋盘内 `touch-action:none`；玩法说明用弹窗展示。
- 关卡卡片内含 10 段进度条展示小关进度，顶部标注只保留「关卡 / 尺寸 / 完成数」，最佳成绩在选关弹窗查看。
- 界面不设常驻文字反馈条：冲突靠棋盘红框、色块描边与顶部「冲突」计数呈现；`flash()` 在无反馈条时仍会触发 `render()`，不可直接删掉这个调用。

### 样式约定

- 使用 VitePress Markdown 扩展语法
- 代码块自动应用终端暗色主题
- 标题自动应用霓虹绿高亮效果
- 遵循现有的极客风格设计语言

## 注意事项

- 所有配置更改需要重新构建才能生效
- public 目录中的静态文件会直接复制到构建输出
- Git 忽略 `.vitepress/cache/` 和 `.vitepress/dist/`
- 中文为主，所有 UI 文本使用简体中文
