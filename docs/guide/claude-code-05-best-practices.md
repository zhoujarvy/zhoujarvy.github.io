---
title: "Claude Code 最佳实践与进阶技巧"
date: 2026-04-04
tags: [Claude Code, AI, 编程工具, 教程]
category: 教程
---

# Claude Code 最佳实践与进阶技巧

## 概述

本篇汇总 Claude Code 的最佳实践、进阶技巧和常见问题解决，帮助你最大化发挥 AI 编程助手的效率。

## 最佳实践

### 1. 写好 CLAUDE.md

CLAUDE.md 是影响 Claude Code 表现的最重要文件。

**好的 CLAUDE.md 示例**：

```markdown
# CLAUDE.md

## 项目概述
电商平台后端服务，使用 NestJS + TypeORM + PostgreSQL。

## 技术栈
- NestJS 10 + TypeScript 5
- TypeORM + PostgreSQL 15
- Redis 7（缓存和队列）
- Jest 单元测试
- Docker + Docker Compose

## 目录结构
src/
├── modules/           # 业务模块
│   ├── auth/          # 认证模块
│   ├── user/          # 用户模块
│   └── order/         # 订单模块
├── common/            # 公共模块
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
└── config/            # 配置

## 代码规范
- 使用 class-validator 做参数校验
- Service 负责业务逻辑，Controller 只做路由
- 每个模块一个目录，包含 module、controller、service、dto、entity
- 错误使用自定义异常类（src/common/exceptions/）
- 返回统一格式：{ code, message, data }

## 测试规范
- 每个模块必须有 .spec.ts 测试文件
- 使用 e2e 测试覆盖 API 端点
- Mock 外部依赖，不 Mock 内部 Service

## 常用命令
- pnpm start:dev - 启动开发服务器
- pnpm test - 运行单元测试
- pnpm test:e2e - 运行 e2e 测试
- pnpm migration:run - 执行数据库迁移
```

**关键原则**：
- **具体**：不说"写好代码"，而是说"使用 class-validator 做参数校验"
- **完整**：包含技术栈、目录结构、代码规范、常用命令
- **持续更新**：项目变化时同步更新 CLAUDE.md

### 2. 高效的提示词写法

#### 结构化描述

```
✅ 好的提示：
> 在 src/modules/order/service/order.service.ts 中添加一个 cancelOrder 方法：
> - 参数：orderId (string), userId (string)
> - 只有订单所有者才能取消
> - 只有 pending 或 processing 状态的订单可以取消
> - 取消后需要通知库存服务释放库存
> - 记录操作日志

❌ 差的提示：
> 帮我加个取消订单的功能
```

#### 分而治之

```
✅ 分步骤：
> 任务：给订单模块添加导出功能
> Step 1: 先分析现有的 order 模块结构
> Step 2: 设计导出接口（支持 CSV 和 Excel）
> Step 3: 实现导出服务
> Step 4: 添加控制器端点
> Step 5: 编写测试
> 一步步来，每步完成后确认

❌ 一口吃成胖子：
> 帮我实现订单导出功能，支持 CSV 和 Excel，要有分页、筛选、排序
```

#### 提供示例

```
> 创建一个新的 DTO，参考 src/modules/user/dto/create-user.dto.ts 的风格
```

### 3. 上下文管理策略

#### 何时压缩

```
# 当你注意到回复变慢或开始"忘记"之前的内容时
> /compact
```

#### 何时清除

```
# 切换到完全不同的任务时
> /clear
```

#### 使用多会话

```bash
# 为不同任务使用不同会话
claude              # 会话1：功能开发
# Ctrl+D 退出后
claude              # 会话2：新任务，干净上下文
```

## 进阶技巧

### 1. MCP 服务器配置

通过 MCP 扩展 Claude Code 的能力边界。

#### 数据库查询

```json
// .claude/mcp.json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/mydb"]
    }
  }
}
```

配置后可以：

```
> 查看一下 users 表的结构
> 帮我写一个查询：找出最近 30 天没有登录的用户
```

#### GitHub 操作

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
      }
    }
  }
}
```

配置后可以：

```
> 创建一个 PR，标题是"feat: add order export"
> 查看 issue #42 的讨论
> 列出当前仓库所有 open 的 PR
```

#### 自定义 MCP 服务器

可以编写自己的 MCP 服务器，连接内部工具和 API：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({
  name: "internal-api",
  version: "1.0.0",
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "search_docs",
      description: "搜索内部技术文档",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
      },
    },
  ],
}));
```

### 2. Headless 自动化

#### 代码质量检查脚本

```bash
#!/bin/bash
# scripts/ai-quality-check.sh

REPORT_FILE="quality-report-$(date +%Y%m%d).md"

echo "# 代码质量报告 - $(date +%Y-%m-%d)" > "$REPORT_FILE"

echo "## 代码风格检查" >> "$REPORT_FILE"
claude --print "检查项目代码风格问题，列出需要改进的地方" >> "$REPORT_FILE"

echo -e "\n## 安全审计" >> "$REPORT_FILE"
claude --print "审计项目中的安全问题" >> "$REPORT_FILE"

echo "报告已生成：$REPORT_FILE"
```

#### 自动生成变更日志

```bash
#!/bin/bash
# scripts/auto-changelog.sh
claude --print "分析最近的 git 提交记录，生成变更日志" >> CHANGELOG.md
```

### 3. 权限精细控制

```bash
# 只允许读取和搜索，不允许修改
claude --allowedTools "Read,Glob,Grep"

# 允许编辑但禁止执行命令
claude --allowedTools "Read,Edit,Write,Glob,Grep"
```

在 CLAUDE.md 中也可以限制工作范围：

```markdown
## 工作范围
- 只修改 src/ 目录下的文件
- 不要修改 .github/、docker/ 下的配置文件
- 测试文件可以新建，不要修改已有的测试断言
```

### 4. 模型选择策略

```bash
# 简单任务用 Haiku（快速、便宜）
claude --model haiku "给这个函数添加 JSDoc 注释"

# 复杂任务用 Sonnet（强、贵）
claude --model sonnet "重构这个模块，提高可测试性"

# 默认使用 Sonnet
claude "帮我开发新功能"
```

**模型选择建议**：

| 任务类型 | 推荐模型 | 原因 |
|----------|----------|------|
| 添加注释/文档 | Haiku | 简单快速 |
| 代码格式调整 | Haiku | 成本低 |
| Bug 修复 | Sonnet | 需要理解上下文 |
| 功能开发 | Sonnet | 需要深度推理 |
| 架构重构 | Sonnet | 复杂度高 |
| 代码审查 | Sonnet | 需要发现细微问题 |

### 5. 与 Git 协同

#### 规范 Commit Message

在 CLAUDE.md 中约定 commit 格式：

```markdown
## Git 规范
- Commit message 使用 Conventional Commits 格式
- 格式：type(scope): description
- Type: feat/fix/docs/style/refactor/test/chore
- 示例：feat(order): add export functionality
```

#### PR 描述生成

```
> 根据 main...HEAD 的差异，生成 PR 描述，包含改动概述、主要变更列表、测试说明
```

## 常见问题解决

### 响应变慢

**原因**：上下文过长

**解决**：使用 `/compact` 压缩上下文，或缩小提问范围。

### 忘记之前的约定

**原因**：上下文被压缩或清除

**解决**：把重要约定写入 CLAUDE.md。

### 修改了不该改的文件

**解决**：
1. 在 CLAUDE.md 中明确写明哪些文件不要动
2. 使用 `--allowedTools` 限制操作
3. 每次修改都仔细审查 diff

### API 费用过高

**解决**：
1. 简单任务用 Haiku 模型
2. 定期 `/compact` 压缩上下文
3. 精准描述需求，减少来回对话

### 代码风格不符合项目规范

**解决**：在 CLAUDE.md 中添加详细的代码规范说明和示例。

## 总结

用好 Claude Code 的核心在于：

1. **写好 CLAUDE.md** — 这是最重要的投资
2. **结构化描述需求** — 具体、分步、有示例
3. **管理好上下文** — 适时压缩和清除
4. **利用 MCP 扩展** — 连接数据库、GitHub、内部工具
5. **自动化重复工作** — 用 headless 模式脚本化

---

**Claude Code 系列教程完结！** 🎉

回顾整个系列：
1. [Claude Code 入门教程](./claude-code-01-introduction) — 安装和基本使用
2. [Claude Code 核心功能详解](./claude-code-02-features) — 文件操作、搜索、命令执行
3. [Claude Code 实战：自动化开发工作流](./claude-code-03-workflow) — 实际案例演示
4. [Claude Code 与其他 AI 工具对比](./claude-code-04-comparison) — 选型指南
5. [Claude Code 最佳实践与进阶技巧](./claude-code-05-best-practices) — 高效使用秘籍

希望这个系列能帮助你充分利用 Claude Code 提升开发效率！
