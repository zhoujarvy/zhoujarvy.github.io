---
title: "Claude Code 高级配置与技巧"
date: 2026-04-04
tags: [Claude Code, AI, 高级配置, 教程]
category: 教程
---

# Claude Code 高级配置与技巧

## 概述

掌握高级配置可以大幅提升 Claude Code 的效率和安全性。本文涵盖 MCP 扩展、自定义命令、权限策略等内容。

## CLAUDE.md 进阶

### 多层级配置

Claude Code 支持多级 CLAUDE.md：

```
~/.claude/CLAUDE.md          # 全局配置（所有项目）
project/CLAUDE.md            # 项目配置
project/src/CLAUDE.md        # 子目录配置
```

### 全局配置示例

```markdown
# ~/.claude/CLAUDE.md

## 通用偏好
- 回答使用中文
- 代码注释使用英文
- 优先使用函数式编程风格
- 使用 pnpm 而非 npm

## 代码风格
- 使用 2 空格缩进
- 字符串优先使用单引号
- 末尾加分号
- 组件使用 PascalCase
- 函数使用 camelCase
```

### 项目配置模板

```markdown
# CLAUDE.md

## 项目概述
[一句话描述项目做什么]

## 技术栈
- Runtime: Node.js 20
- Framework: Next.js 14 (App Router)
- Database: PostgreSQL + Prisma
- Auth: NextAuth.js
- Deploy: Vercel

## 目录结构
src/
├── app/          # Next.js App Router 页面
├── components/   # React 组件
├── lib/          # 工具函数和配置
├── server/       # 服务端逻辑
└── types/        # TypeScript 类型定义

## 关键命令
pnpm dev       # 开发服务器
pnpm build     # 构建
pnpm lint      # 代码检查
pnpm db:push   # 推送数据库变更

## 编码规范
- Server Components by default，只在需要交互时用 Client Components
- 使用 Zod 做运行时类型校验
- API 路由统一错误处理
- 数据库查询用 Prisma，禁止原生 SQL

## 已知问题
- prisma/user.ts 中的 findMany 在数据量大时性能差，需要分页
- auth 回调在 Safari 有 Cookie 问题
```

## MCP 服务器配置

### 什么是 MCP

MCP（Model Context Protocol）让 Claude Code 能连接外部工具和数据源。

### 配置文件

在项目根目录创建 `.claude/mcp.json`：

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/mydb"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    }
  }
}
```

### 常用 MCP 服务器

| 服务器 | 用途 |
|--------|------|
| `server-postgres` | 查询 PostgreSQL 数据库 |
| `server-github` | 操作 GitHub PR/Issue/Repo |
| `server-filesystem` | 安全的文件系统访问 |
| `server-puppeteer` | 浏览器自动化 |
| `server-memory` | 持久化记忆 |

### 使用场景

配置 GitHub MCP 后：

```
> 列出本仓库 open 的 issue
> 创建一个 PR，把 feature/auth 分支合并到 main
> 查看 PR #42 的 review 评论
```

配置数据库 MCP 后：

```
> 查看当前数据库有哪些表
> users 表有多少条记录？
> 帮我写一个查询，统计最近 7 天每天的注册用户数
```

## 自定义斜杠命令

### 创建自定义命令

在 `.claude/commands/` 目录下创建 `.md` 文件：

```bash
mkdir -p .claude/commands
```

**`.claude/commands/review.md`**：
```markdown
审查当前 git staged 的变更。关注以下方面：
1. 安全漏洞（SQL 注入、XSS 等）
2. 性能问题（N+1 查询、不必要的重渲染）
3. 错误处理是否完善
4. 代码风格是否一致

给出具体的改进建议。
```

**`.claude/commands/test.md`**：
```markdown
为当前文件生成单元测试。要求：
- 使用 Jest
- 覆盖正常路径和边界情况
- Mock 外部依赖
- 测试文件放在同目录的 __tests__ 下
```

### 使用自定义命令

```
> /review
> /test
```

### 带参数的自定义命令

**`.claude/commands/fix-issue.md`**：
```markdown
查看 GitHub Issue #$ARGUMENTS 的内容，
分析问题原因，提出修复方案并实施。
修复后运行相关测试验证。
```

使用：

```
> /fix-issue 42
```

## 权限与安全

### 权限模式

```bash
# 默认模式：每次操作都需要确认
claude

# 信任编辑操作，自动接受文件修改
claude --allowedTools "Edit,Write"

# 完全自动（慎用！）
claude --allowedTools "Edit,Write,Bash(*)"
```

### .claude/settings.json

项目级权限配置：

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(dropdb:*)",
      "Bash(DROP TABLE:*)"
    ]
  }
}
```

### 环境变量隔离

```bash
# 只提供必要的 API Key
export ANTHROPIC_API_KEY="sk-xxx"

# 不要在 CLAUDE.md 或 MCP 配置中硬编码密钥
# 使用环境变量引用
```

## Hook 系统

Claude Code 支持 Hook，可以在特定事件触发时执行自定义脚本。

### 配置 Hook

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx prettier --write $FILE"
      }
    ],
    "PostPrompt": [
      {
        "command": "echo 'Session started at $(date)' >> .claude/session.log"
      }
    ]
  }
}
```

### 常用 Hook 场景

| Hook | 场景 |
|------|------|
| `PostToolUse` | 文件保存后自动格式化 |
| `PreToolUse` | 禁止修改特定文件 |
| `PostPrompt` | 记录会话日志 |
| `Stop` | 会话结束时的清理工作 |

## 性能优化技巧

### 1. 控制上下文大小

```
# 使用 .claudeignore 排除不需要的文件
node_modules/
dist/
.git/
*.lock
*.min.js
coverage/
```

创建 `.claudeignore`：

```
node_modules
dist
.git
*.lock
*.min.js
*.min.css
coverage
.next
```

### 2. 选择合适的模型

```bash
# 简单任务用 Haiku（快+便宜）
claude --model claude-haiku-4-20250414

# 复杂任务用 Sonnet（平衡）
claude --model claude-sonnet-4-20250514

# 超复杂架构设计用 Opus（最强）
claude --model claude-opus-4-20250115
```

### 3. 合理使用 Compact

```
> /compact

# 可以在 compact 时指定保留的内容
> /compact 保留我们讨论的数据库设计方案
```

### 4. 精准的文件引用

```
❌ "看看代码"
✅ "看看 src/api/auth.ts 第 30-50 行的 token 验证逻辑"
```

## 团队协作

### 共享项目配置

把以下文件纳入 Git 管理：

```
.claude/
├── commands/       # 团队共享的自定义命令
├── mcp.json        # MCP 服务器配置（不含密钥）
├── settings.json   # 权限配置
CLAUDE.md           # 项目说明
.claudeignore       # 忽略规则
```

### 每人独立配置

```
# 个人配置不提交到 Git
.gitignore 添加：
.claude/settings.local.json
.claude/mcp.local.json
```

## 故障排除

### 常见问题

**Q: Claude Code 响应变慢？**
- 使用 `/compact` 压缩上下文
- 检查 `.claudeignore` 是否排除了大文件
- 尝试更快的模型（Haiku）

**Q: MCP 服务器连接失败？**
- 检查命令路径是否正确
- 确认 Node.js 版本兼容
- 查看 Claude Code 日志：`claude --debug`

**Q: 文件修改被拒绝？**
- 检查文件权限
- 确认没有被 `.claudeignore` 排除
- 查看 settings.json 的 deny 规则

## 总结

高级配置让 Claude Code 从"好用"变成"极度高效"：

1. **CLAUDE.md** — 让 AI 真正理解你的项目
2. **MCP** — 连接外部工具，扩展能力边界
3. **自定义命令** — 把常用操作封装成一键命令
4. **权限管理** — 安全可控地自动化
5. **Hook** — 无缝融入现有工作流

下一步：[Claude Code 与其他 AI 编程工具对比](./claude-code-05-comparison)
