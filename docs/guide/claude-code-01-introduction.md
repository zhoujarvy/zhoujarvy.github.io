---
title: "Claude Code 入门教程"
date: 2026-04-04
tags: [Claude Code, AI, 编程工具, 教程]
category: 教程
---

# Claude Code 入门教程

## 什么是 Claude Code？

Claude Code 是 Anthropic 推出的命令行 AI 编程助手。它直接运行在你的终端中，能够理解你的整个代码库，帮你编写、调试、重构代码。

与传统的代码补全工具不同，Claude Code 是一个**智能代理（Agent）**——它可以：

- 📂 读取和理解整个项目结构
- ✏️ 直接编辑和创建文件
- 🔧 运行命令、执行测试
- 🔍 搜索代码、分析 Bug
- 📝 生成文档和注释

## 核心优势

| 特性 | 说明 |
|------|------|
| 终端原生 | 在命令行中运行，无需离开开发环境 |
| 项目感知 | 理解整个代码库的上下文 |
| 自主执行 | 能够自主完成多步骤任务 |
| 多语言支持 | Python、JavaScript、Go、Rust 等主流语言 |
| 安全可控 | 每次文件修改都需要确认 |

## 安装

### 前置要求

- Node.js 18+
- npm 或 pnpm

### 安装步骤

```bash
# 使用 npm 全局安装
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

### API Key 配置

Claude Code 需要 Anthropic API Key：

```bash
# 设置环境变量
export ANTHROPIC_API_KEY="your-api-key-here"

# 建议添加到 shell 配置文件
echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.zshrc
source ~/.zshrc
```

::: tip 获取 API Key
访问 [console.anthropic.com](https://console.anthropic.com) 注册并获取 API Key。
:::

## 基本使用

### 启动 Claude Code

```bash
# 进入你的项目目录
cd my-project

# 启动 Claude Code
claude
```

启动后会进入交互式对话界面：

```
╭─────────────────────────────────────────╮
│  Claude Code                            │
│  Model: claude-sonnet-4-20250514        │
│  Project: /path/to/my-project           │
╰─────────────────────────────────────────╯
>
```

### 第一次对话

直接用自然语言描述你的需求：

```
> 帮我看看这个项目的结构，简单介绍一下
```

Claude Code 会自动浏览项目文件，然后给出分析。

### 常用命令

```
> 帮我创建一个 Express 服务器        # 创建文件
> 这个函数有什么 Bug？                 # 分析代码
> 重构这个模块，提高可读性              # 重构代码
> 运行测试并修复失败的用例              # 执行测试
> 帮我写个 README                      # 生成文档
```

## 工作模式

### 交互模式（默认）

一问一答，每步操作需要确认：

```bash
claude
```

### 自动接受模式

自动执行操作，无需逐步确认：

```bash
claude --allowedTools "Edit,Write,Bash"
```

### 管道模式（非交互）

适合脚本和自动化：

```bash
echo "解释这个文件的逻辑" | claude --print
```

### 只读模式

只分析和建议，不修改文件：

```bash
claude --readonly
```

## 项目配置

### CLAUDE.md 文件

在项目根目录创建 `CLAUDE.md`，让 Claude Code 更好地理解你的项目：

```markdown
# CLAUDE.md

## 项目简介
这是一个 React + TypeScript 前端项目。

## 技术栈
- React 18
- TypeScript 5
- Tailwind CSS
- Vite

## 代码规范
- 使用函数式组件
- 使用 ESLint + Prettier
- 组件文件使用 PascalCase 命名

## 常用命令
- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建项目
- `pnpm test` - 运行测试
```

::: tip
`CLAUDE.md` 就像是给 AI 助手的一份项目说明书，写得好能大幅提升协作效率。
:::

## 权限管理

Claude Code 的每次文件操作都需要你的许可：

```
Claude wants to edit src/index.ts:
  - Add import statement
  - Modify main function

Allow? (y/n/e = yes/no/edit)
```

- **y** - 允许本次操作
- **n** - 拒绝操作
- **e** - 编辑后再应用

## 实用技巧

### 1. 提供足够的上下文

```
❌ "修一下 Bug"
✅ "运行 pnpm test 后发现 user.test.ts 第 3 个测试失败了，
    错误信息是 'Cannot read property of undefined'，帮我修复"
```

### 2. 分步骤处理复杂任务

```
❌ "帮我重写整个项目"
✅ "第一步：帮我分析当前项目的模块依赖关系"
   "第二步：帮我重构 auth 模块"
   "第三步：更新对应的测试"
```

### 3. 利用 CLAUDE.md 传递规范

把团队编码规范、项目架构说明写在 CLAUDE.md 里，避免每次重复说明。

## 总结

Claude Code 把 AI 编程能力带到了终端，让开发者可以：

1. **用自然语言操控代码** — 不需要记住复杂的命令
2. **上下文感知** — 理解整个项目，不是孤立的补全
3. **安全可控** — 每步操作都需要确认
4. **灵活集成** — 可以融入现有的开发工作流

下一步：[Claude Code 核心功能详解](./claude-code-02-features)
