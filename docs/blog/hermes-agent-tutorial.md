---
title: "Hermes Agent 使用教程：打造你的 AI 智能助手"
date: 2026-04-20
updated: 2026-05-06
tags: [AI, Agent, Hermes, 教程]
category: 教程
---

# Hermes Agent 使用教程：打造你的 AI 智能助手

## 前言

Hermes Agent 是由 NousResearch 开发的开源 AI 智能体框架，它不仅仅是一个聊天机器人，而是一个具备自我改进能力、持久化记忆、多平台网关、子 Agent 委派等高级功能的智能助手平台。

本文将从安装到实战，手把手教你如何使用 Hermes Agent。

## 什么是 Hermes Agent？

Hermes Agent 与 Claude Code、Codex、OpenClaw 属于同一类别——自主编码和任务执行型 AI Agent。它的核心能力包括：

- **自我改进的 Skill 系统** — Agent 可以不断学习新技能并优化现有能力，越用越聪明
- **持久化记忆** — 基于 FTS5 全文搜索 + LLM 摘要，跨会话记住你是谁、你的偏好、环境细节
- **子 Agent 委派** — 复杂任务可以拆分给专门的子 Agent 并行处理
- **多平台网关** — 同一个 Agent 可以在 Telegram、Discord、Slack、WhatsApp、飞书、微信等 15+ 平台运行
- **Provider 无关** — 支持 OpenRouter、Anthropic、OpenAI、DeepSeek、本地模型等 20+ 供应商，可中途切换
- **MCP 集成** — 支持 Model Context Protocol，连接外部工具和数据源
- **定时任务** — 内置 Cron 调度器，支持定时执行任务
- **浏览器自动化** — 可以自主浏览网页、提取信息
- **代码执行** — 安全沙箱内执行代码，完成编程任务

## 安装

### 1. 一键安装

```bash
# 官方安装脚本
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### 2. 验证安装

```bash
hermes --version
hermes doctor
```

`hermes doctor` 会检查你的环境配置，确保一切就绪。

### 3. 初始配置

```bash
# 交互式配置向导
hermes setup

# 或只配置模型
hermes model
```

## 配置

### 设置 LLM Provider

Hermes 支持 20+ 供应商，以下是常用配置：

编辑 `~/.hermes/config.yaml`：

```yaml
# 使用 OpenRouter（推荐，一个 Key 访问所有模型）
provider: openrouter
model: anthropic/claude-sonnet-4

# 或使用 Anthropic 直连
# provider: anthropic
# model: claude-sonnet-4

# 或使用 DeepSeek
# provider: deepseek
# model: deepseek-chat

# 或使用 Google Gemini
# provider: google
# model: gemini-2.5-pro
```

### 设置 API Key

编辑 `~/.hermes/.env`：

```bash
# OpenRouter（推荐）
OPENROUTER_API_KEY=sk-or-your-key

# 或 Anthropic
# ANTHROPIC_API_KEY=sk-ant-your-key

# 或 DeepSeek
# DEEPSEEK_API_KEY=your-key
```

### OAuth 登录（部分供应商）

```bash
# Nous Portal OAuth
hermes login --provider nous

# OpenAI Codex OAuth
hermes login --provider openai-codex
```

## 基础使用

### 交互对话

最常用的方式，直接运行进入对话：

```bash
hermes chat
```

### 单次提问

不需要交互，直接获取答案：

```bash
hermes chat -q "什么是 RAG 技术？"
```

参数说明：
- `-q, --query TEXT` — 单次查询，非交互模式
- `-m, --model MODEL` — 临时切换模型
- `--provider PROVIDER` — 临时切换供应商

### 恢复会话

```bash
# 恢复最近的会话
hermes --continue

# 按名称恢复
hermes --continue my-project

# 按会话 ID 恢复
hermes --resume 20260506_143052_a1b2c3
```

### 预加载 Skill

```bash
# 启动时加载特定 Skill
hermes -s code-review,deployment

# 使用特定 Profile
hermes -p work
```

## 记忆系统

Hermes 的记忆系统是其最强大的功能之一，所有记忆跨会话持久保存。

### 记忆如何工作

1. **用户画像** — 记住你的名字、角色、偏好、沟通风格
2. **个人笔记** — 环境信息、项目约定、工具使用经验
3. **自动摘要** — LLM 会自动总结重要对话内容
4. **全文检索** — FTS5 引擎支持快速模糊搜索

### 在对话中管理记忆

```
> 记住我的项目使用 pnpm 管理依赖
> 记住我喜欢直接沟通，不要废话
```

Hermes 会自动将这些信息存入持久记忆，下次对话时自动参考。

### 搜索过去会话

```
> 我们之前讨论过部署方案，能找出来吗？
```

Hermes 会用全文搜索从历史会话中找到相关内容。

## Skill 系统

Skill 是 Hermes 的可扩展能力模块，类似插件系统。每个 Skill 是一个包含指令、脚本、模板的文档。

### 查看已安装 Skills

```bash
hermes skills list
```

### 搜索和安装社区 Skills

```bash
# 搜索
hermes skills search "code review"

# 安装
hermes skills install <skill-id>

# 从 URL 直接安装
hermes skills install https://example.com/SKILL.md

# 浏览所有可用 Skills
hermes skills browse
```

### 创建自定义 Skill

```bash
hermes skills create "my-skill"
```

创建后编辑 `~/.hermes/skills/my-skill/SKILL.md`，定义触发条件、步骤和注意事项。

### Skill 自我改进

Hermes 会在使用 Skill 的过程中不断优化：
- 遇到新问题自动记录解决方案
- 根据使用反馈调整步骤
- 发现错误时自动 patch 更新

## 子 Agent 委派

对于复杂任务，Hermes 可以委派给专门的子 Agent 并行处理：

```
> 帮我研究 2026 年 LLM 的最新发展趋势，并写一份总结报告
```

Hermes 会自动：
1. **任务分析** — 将复杂任务拆解为子任务
2. **并行委派** — 启动多个子 Agent 同时工作
3. **结果汇总** — 收集所有子 Agent 的结果
4. **整合输出** — 生成最终的统一回复

## 多平台网关

Hermes 最大的特色之一是多平台支持。同一个 Agent 可以在多个平台运行：

### 支持平台

Telegram、Discord、Slack、WhatsApp、Signal、飞书、微信（企业微信/公众号）、邮件、SMS、Matrix、Mattermost、Home Assistant、API Server 等。

### 启动网关

```bash
# 前台运行
hermes gateway run

# 安装为后台服务
hermes gateway install
hermes gateway start

# 查看状态
hermes gateway status
```

### 配置平台

```bash
hermes gateway setup
```

配置完成后，你在 Telegram/Discord/飞书上发消息，Hermes 就会响应，拥有和终端版相同的工具能力。

## 定时任务（Cron）

Hermes 内置任务调度器，可以定时执行任务：

```bash
# 查看任务列表
hermes cron list

# 创建定时任务
hermes cron create "0 9 * * *"  # 每天 9 点执行
hermes cron create "30m"         # 每 30 分钟执行

# 管理任务
hermes cron pause <id>
hermes cron resume <id>
hermes cron run <id>             # 手动触发
hermes cron remove <id>
```

### 典型场景

- 每天早上推送待办事项摘要
- 定时监控网站变化
- 周报自动生成
- 服务器健康检查

## Profile（多实例）

可以创建多个独立的 Hermes 实例，各自拥有隔离的配置、会话、Skill 和记忆：

```bash
# 创建 Profile
hermes profile create work --clone

# 切换 Profile
hermes profile use work

# 在特定 Profile 下运行
hermes -p work chat
```

## 实战案例

### 案例 1：自动化代码审查

```bash
hermes chat -q "审查 ./src 目录下的最近修改，关注安全问题和性能优化"
```

### 案例 2：技术文档生成

```bash
hermes chat -q "为 ./api/routes.ts 生成完整的接口文档"
```

### 案例 3：学习助手

```bash
hermes chat
> 我在学习 Transformer 架构，请从注意力机制开始讲解
> 能给我一个简单的 self-attention 实现吗？
> 这个实现的时间复杂度是多少？
```

Hermes 会记住你的学习进度，下次继续时无缝衔接。

### 案例 4：多平台助手

配置网关后，你可以：
- 在 Telegram 上让 Hermes 帮你查资料
- 在 Discord 上让 Hermes 帮你管理项目
- 在飞书上让 Hermes 帮你处理文档
- 所有平台共享同一套记忆和 Skill

### 案例 5：定时任务自动化

```bash
# 每天早上 9 点推送日报
hermes cron create "0 9 * * *"
# 提示词：查看今天的日历和待办，生成一份简要日报发给我
```

## 会话管理

```bash
# 列出所有会话
hermes sessions list

# 交互式浏览会话
hermes sessions browse

# 重命名会话
hermes sessions rename <id> "项目名称"

# 导出会话
hermes sessions export output.jsonl

# 清理旧会话
hermes sessions prune --older-than 30
```

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `hermes` | 启动交互对话 |
| `hermes chat -q "问题"` | 单次提问 |
| `hermes setup` | 配置向导 |
| `hermes model` | 切换模型/供应商 |
| `hermes config` | 查看配置 |
| `hermes config set KEY VAL` | 修改配置 |
| `hermes doctor` | 环境检查 |
| `hermes tools` | 管理工具集 |
| `hermes skills list` | 查看已安装 Skills |
| `hermes skills browse` | 浏览社区 Skills |
| `hermes gateway run` | 启动多平台网关 |
| `hermes cron list` | 查看定时任务 |
| `hermes sessions list` | 查看会话历史 |
| `hermes profile list` | 查看 Profile |

## 常见问题

### Q: 支持哪些 LLM？

A: 支持 20+ 供应商：OpenRouter、Anthropic、OpenAI、DeepSeek、Google Gemini、xAI、Hugging Face、本地模型（Ollama/vLLM）等。在 `config.yaml` 中配置或运行 `hermes model` 交互选择。

### Q: 记忆数据存在哪里？

A: 存储在 `~/.hermes/` 目录下，使用 SQLite + FTS5 引擎。

### Q: 子 Agent 会消耗更多 Token 吗？

A: 是的，每个子 Agent 独立运行，有自己的上下文。建议在复杂任务中使用，简单任务直接对话即可。

### Q: 如何备份？

A: 备份 `~/.hermes/` 目录即可：

```bash
tar -czf hermes-backup.tar.gz ~/.hermes/
```

### Q: 如何在不同平台使用？

A: 运行 `hermes gateway setup` 配置平台，然后 `hermes gateway run` 或安装为后台服务。所有平台共享同一个 Agent。

### Q: 配置修改后不生效？

A: CLI 模式需要重新启动 Hermes；网关模式使用 `/restart` 命令；工具和 Skill 的变更使用 `/reset` 开启新会话。

## 总结

Hermes Agent 是一个功能强大的开源 AI 智能体框架，它的核心优势在于：

1. **记忆持久化** — 真正的跨会话记忆，不是每次从零开始
2. **Skill 自我改进** — 越用越聪明，自动积累经验
3. **子 Agent 协作** — 复杂任务自动拆解并行处理
4. **多平台网关** — 同一个 Agent 覆盖所有沟通渠道
5. **Provider 无关** — 随时切换模型，不受单一供应商限制
6. **定时任务** — 自动化重复工作

如果你在寻找一个不只是聊天、而是真正能学习和成长的 AI 助手，Hermes Agent 值得一试。

---

**相关链接：**
- GitHub: https://github.com/NousResearch/hermes-agent
- 官方文档: https://hermes-agent.nousresearch.com/docs/
- Skill 目录: 通过 `hermes skills browse` 浏览
