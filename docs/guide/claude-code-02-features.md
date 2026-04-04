---
title: "Claude Code 核心功能详解"
date: 2026-04-04
tags: [Claude Code, AI, 编程工具, 教程]
category: 教程
---

# Claude Code 核心功能详解

## 概述

Claude Code 不仅仅是一个代码补全工具，它是一个完整的 AI 编程代理。本文将深入介绍它的核心功能。

## 文件操作

### 读取文件

Claude Code 可以读取项目中的任何文件：

```
> 看看 src/utils/helpers.ts 的内容
> 列出 components 目录下的所有文件
> 找出项目中所有使用了 axios 的文件
```

### 创建文件

```
> 在 src/components 下创建一个 Button 组件，支持 primary 和 secondary 两种样式
> 创建 .env.example 文件，列出所有需要的环境变量
```

Claude Code 会生成文件内容并展示给你确认。

### 编辑文件

```
> 在 user.service.ts 中添加一个 deleteUser 方法
> 把 class 组件重构为函数式组件
> 给所有公共方法添加 JSDoc 注释
```

编辑操作会以 diff 形式展示：

```diff
  export function formatDate(date: Date): string {
-   return date.toISOString();
+   const year = date.getFullYear();
+   const month = String(date.getMonth() + 1).padStart(2, '0');
+   const day = String(date.getDate()).padStart(2, '0');
+   return `${year}-${month}-${day}`;
  }
```

## 代码搜索与分析

### 全局搜索

```
> 搜索项目中所有 TODO 注释
> 找出所有使用了 deprecated API 的地方
> 哪些文件导入了 lodash？
```

### 代码分析

```
> 分析 src/api 目录的模块依赖关系
> 这个函数的复杂度如何？有优化空间吗？
> 找出项目中可能的内存泄漏
```

### Bug 定位

```
> 运行项目时报错 ECONNREFUSED，帮我排查
> 这个测试为什么失败了？
> 用户反馈登录后偶尔被踢出，帮我分析可能的原因
```

## 命令执行

Claude Code 可以在你的终端中执行命令：

```
> 运行 pnpm test 看看测试结果
> 帮我启动开发服务器
> 查看 git log 最近的提交
> 运行 lint 并修复可以自动修复的问题
```

::: warning 注意
命令执行也需要你的确认，确保安全。
:::

## 多文件重构

Claude Code 的强项之一是跨文件的重构：

```
> 把 getUserInfo 改成 fetchUserProfile，更新所有引用它的地方
> 将 utils.ts 拆分成多个独立模块，更新所有导入路径
> 把所有 .js 文件迁移到 TypeScript，先从入口文件开始
```

它会：
1. 分析所有受影响的文件
2. 逐个修改并展示 diff
3. 确保导入导出关系正确

## Git 集成

### 提交管理

```
> 查看当前的 git 状态
> 帮我写个 commit message 并提交
> 创建一个新分支 feature/user-profile 并切换过去
```

### 代码审查

```
> 审查最近的 3 个 commit，看看有没有问题
> 比较 main 和当前分支的差异
> 帮我生成 PR 描述
```

### 冲突解决

```
> 帮我解决 git merge 冲突
> rebase 到 main 上，处理可能的冲突
```

## 上下文管理

### 项目级上下文（CLAUDE.md）

`CLAUDE.md` 是 Claude Code 理解项目的关键：

```markdown
# CLAUDE.md

## 架构
项目采用 Clean Architecture，分层如下：
- domain/ - 业务实体和规则
- application/ - 用例
- infrastructure/ - 外部服务实现
- presentation/ - UI 层

## 约定
- 依赖只能从外层指向内层
- 使用依赖注入
- 测试放在对应模块的 __tests__ 目录
```

### 会话级上下文

在对话中提供临时上下文：

```
> 我正在实现一个支付功能，参考 Stripe 的 API 设计，
  先帮我设计接口，然后实现核心逻辑
```

### 多会话管理

Claude Code 支持恢复之前的会话：

```bash
# 查看历史会话
claude --resume

# 继续最近的会话
claude --continue
```

## MCP（Model Context Protocol）

Claude Code 支持 MCP 协议，可以扩展连接外部工具：

```json
// .claude/mcp.json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://..."
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}
```

配置 MCP 后，Claude Code 就可以：
- 直接查询数据库
- 操作 GitHub PR/Issue
- 连接内部 API 和工具

## 快捷操作

### 斜杠命令

在交互模式中可以使用：

| 命令 | 说明 |
|------|------|
| `/help` | 显示帮助信息 |
| `/clear` | 清除对话历史 |
| `/compact` | 压缩上下文，减少 token 消耗 |
| `/cost` | 显示当前会话费用 |
| `/model` | 切换模型 |

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送消息 |
| `Shift+Enter` | 换行 |
| `Ctrl+C` | 取消当前操作 |
| `Ctrl+D` | 退出 |
| `↑/↓` | 浏览历史输入 |

## 性能优化

### 减少上下文消耗

```
> /compact
```

当对话过长时，使用 compact 命令压缩历史，保留关键信息。

### 精准指定范围

```
❌ "看看代码有什么问题"
✅ "看看 src/api/auth.ts 有什么问题"
```

范围越小，响应越快，质量越高。

### 分段处理大文件

```
❌ "重写这个 2000 行的文件"
✅ "先帮我分析 src/legacy/processor.ts 的结构，
   然后我们一段一段重构"
```

## 总结

Claude Code 的核心能力：

1. **文件读写** — 理解和修改项目代码
2. **命令执行** — 运行测试、构建、Git 操作
3. **代码搜索** — 跨文件查找和分析
4. **MCP 扩展** — 连接外部工具和服务
5. **上下文管理** — 通过 CLAUDE.md 和对话保持理解

下一步：[Claude Code 实战：自动化开发工作流](./claude-code-03-workflow)
