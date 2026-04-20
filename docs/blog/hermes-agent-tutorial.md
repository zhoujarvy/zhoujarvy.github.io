---
title: "Hermes Agent 使用教程：打造你的 AI 智能助手"
date: 2026-04-20
tags: [AI, Agent, Hermes, 教程]
category: 教程
---

# Hermes Agent 使用教程：打造你的 AI 智能助手

## 前言

Hermes Agent 是由 NousResearch 开发的开源 AI 智能体框架，它不仅仅是一个聊天机器人，而是一个具备自我改进能力、持久化记忆、子 Agent 委派等高级功能的智能助手平台。

本文将从安装到实战，手把手教你如何使用 Hermes Agent。

## 什么是 Hermes Agent？

Hermes Agent 的核心能力包括：

- **自我改进的 Skill 系统** — Agent 可以不断学习新技能并优化现有能力
- **持久化记忆** — 基于 FTS5 全文搜索 + LLM 摘要，记忆跨会话保留
- **子 Agent 委派** — 复杂任务可以拆分给专门的子 Agent 处理
- **MCP 集成** — 支持 Model Context Protocol，连接外部工具和数据源
- **浏览器自动化** — 可以自主浏览网页、提取信息
- **代码执行** — 安全沙箱内执行代码，完成编程任务

## 安装

### 1. 环境要求

- Python 3.10+
- pip 或 uv 包管理器
- 至少一个 LLM API Key（支持 OpenAI、Anthropic、本地模型等）

### 2. 安装 Hermes CLI

```bash
# 使用 pip 安装
pip install hermes-agent

# 或使用 uv（更快）
uv pip install hermes-agent
```

### 3. 验证安装

```bash
hermes --version
hermes doctor
```

`hermes doctor` 会检查你的环境配置，确保一切就绪。

## 配置

### 设置 LLM Provider

编辑 `~/.hermes/config.yaml`：

```yaml
# 使用 OpenAI
provider: openai
model: gpt-4o

# 或使用 Anthropic
# provider: anthropic
# model: claude-sonnet-4-20250514

# 或使用本地模型（通过 Ollama）
# provider: ollama
# model: hermes3
```

### 设置 API Key

编辑 `~/.hermes/.env`：

```bash
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# 或 Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## 基础使用

### 快速问答

最简单的用法，直接提问：

```bash
hermes run "什么是 RAG 技术？" --non-interactive --no-stream
```

参数说明：
- `--non-interactive` — 非交互模式，执行完自动退出
- `--no-stream` — 不流式输出，等待完整结果

### 带上下文问答

当你需要 Hermes 参考特定文档时：

```bash
hermes run "总结这个项目的架构" --context-file ./README.md --non-interactive
```

### 交互模式

不加参数直接运行，进入交互对话：

```bash
hermes chat
```

## 记忆系统

Hermes 的记忆系统是其最强大的功能之一，所有记忆跨会话持久保存。

### 搜索记忆

```bash
hermes memory search "部署"
```

Hermes 会使用 FTS5 全文搜索快速定位相关记忆。

### 查看笔记

```bash
hermes memory notes list
```

### 添加笔记

```bash
hermes memory notes add "项目使用 pnpm 管理依赖，构建命令是 pnpm run build"
```

下次你问 Hermes 关于项目的问题时，它会自动参考这些记忆。

### 记忆如何工作

1. **短期记忆** — 当前对话的上下文
2. **长期笔记** — 你主动添加的笔记
3. **自动摘要** — LLM 会自动总结重要对话内容并存储
4. **全文检索** — FTS5 引擎支持快速模糊搜索

## Skill 系统

Skill 是 Hermes 的可扩展能力模块，类似插件系统。

### 查看已安装 Skills

```bash
hermes skills list
```

### 创建自定义 Skill

```bash
hermes skills create "code-review" --description "自动代码审查，检查安全漏洞和代码规范"
```

创建后，Hermes 可以在需要时自动调用这个 Skill。

### Skill 自我改进

Hermes 会在使用 Skill 的过程中不断优化：
- 记录哪些 Skill 在什么场景下最有效
- 根据使用反馈调整调用策略
- 自动组合多个 Skill 完成复杂任务

## 子 Agent 委派

对于复杂任务，Hermes 可以委派给专门的子 Agent：

```bash
hermes run "使用 delegate_task 来：研究 2026 年 LLM 的最新发展趋势" --non-interactive --no-stream
```

子 Agent 的工作流程：
1. **任务分析** — Hermes 分析任务，确定需要哪些子 Agent
2. **委派执行** — 将子任务分配给专门的 Agent
3. **结果汇总** — 收集所有子 Agent 的结果
4. **整合输出** — 生成最终的统一回复

## 实战案例

### 案例 1：自动化代码审查

```bash
# 让 Hermes 审查代码变更
hermes run "审查 ./src 目录下的最近修改，关注安全问题和性能优化" \
  --context-file ./src/ \
  --non-interactive
```

### 案例 2：技术文档生成

```bash
# 基于 README 生成详细文档
hermes run "为这个 API 生成完整的接口文档" \
  --context-file ./api/routes.ts \
  --non-interactive
```

### 案例 3：学习助手

```bash
# 交互式学习
hermes chat
> 我在学习 Transformer 架构，请从注意力机制开始讲解
> 能给我一个简单的 self-attention 实现吗？
> 这个实现的时间复杂度是多少？
```

Hermes 会记住你的学习进度，下次继续时无缝衔接。

## 与 OpenClaw 集成

如果你使用 OpenClaw，可以通过 ClawHub 安装 Hermes Agent Skill：

```bash
clawhub install hermes-agent-v2
```

安装后，你可以直接通过 OpenClaw 调用 Hermes：

- 「使用 hermes 帮我分析这段代码」
- 「调用 hermes 搜索记忆中的部署方案」
- 「hermes run 帮我写一个 Python 爬虫」

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `hermes run "问题"` | 单次问答 |
| `hermes chat` | 交互对话 |
| `hermes status` | 查看状态 |
| `hermes doctor` | 环境检查 |
| `hermes memory search "关键词"` | 搜索记忆 |
| `hermes memory notes list` | 查看笔记 |
| `hermes memory notes add "内容"` | 添加笔记 |
| `hermes skills list` | 查看 Skills |
| `hermes skills create "名称"` | 创建 Skill |

## 常见问题

### Q: 支持哪些 LLM？

A: 支持 OpenAI、Anthropic、Google、本地模型（通过 Ollama/vLLM）等。在 `config.yaml` 中配置即可。

### Q: 记忆数据存在哪里？

A: 存储在 `~/.hermes/` 目录下，使用 SQLite + FTS5 引擎。

### Q: 子 Agent 会消耗更多 Token 吗？

A: 是的，子 Agent 独立运行，每个都有自己的上下文。建议在复杂任务中使用，简单任务直接运行即可。

### Q: 如何备份记忆和配置？

A: 备份 `~/.hermes/` 目录即可：

```bash
tar -czf hermes-backup.tar.gz ~/.hermes/
```

## 总结

Hermes Agent 是一个功能强大的开源 AI 智能体框架，它的核心优势在于：

1. **记忆持久化** — 真正的跨会话记忆，不是每次从零开始
2. **Skill 自我改进** — 越用越聪明
3. **子 Agent 协作** — 复杂任务自动拆解
4. **开放集成** — MCP 协议支持，可连接各种工具

如果你在寻找一个不只是聊天、而是真正能学习和成长的 AI 助手，Hermes Agent 值得一试。

---

**相关链接：**
- GitHub: https://github.com/NousResearch/hermes-agent
- OpenClaw Skill: 通过 `clawhub install hermes-agent-v2` 安装
