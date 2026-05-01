# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 VitePress 构建的个人技术博客，主要分享 AI 开发相关内容。网站采用极客风格的暗色主题，使用 GitHub Pages 托管。

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
├── blog/              # 博客文章
│   └── index.md       # 博客列表页
├── guide/             # 教程系列
│   └── index.md       # 教程列表页
└── public/            # 静态资源
    ├── _redirects     # Cloudflare Pages 路由规则
    └── _routes.json   # 路由配置
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

- **平台**: Cloudflare Pages（通过 GitHub Actions）
- **路由规则**: `docs/public/_redirects` 和 `_routes.json`
- **构建输出**: `.vitepress/dist/`（由 VitePress 生成）

## 内容开发指南

### 添加新博客文章

1. 在 `docs/blog/` 创建新的 `.md` 文件
2. 在 `.vitepress/config.mts` 的 `/blog/` 侧边栏添加链接
3. 可选：更新 `docs/blog/index.md` 添加文章摘要

### 添加新教程系列

1. 在 `docs/guide/` 创建新的 `.md` 文件（建议命名：`series-name-01-title.md`）
2. 在 `.vitepress/config.mts` 的 `/guide/` 侧边栏添加新系列分组
3. 更新 `docs/guide/index.md` 添加系列介绍

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
