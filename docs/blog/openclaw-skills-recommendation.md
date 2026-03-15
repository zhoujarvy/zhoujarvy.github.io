---
title: OpenClaw 好用的 Skill 推荐
date: 2026-03-15
tags: [OpenClaw, Skills, 推荐]
category: 教程
---

# OpenClaw 好用的 Skill 推荐

OpenClaw 的强大之处在于其 Skills 系统。Skills 可以扩展智能体的功能，从简单的工具到复杂的自动化工作流。本文推荐一些实用的 Skills。

## 什么是 Skills？

Skills 是 OpenClaw 的功能扩展包，类似于插件。每个 Skill 是一个包含 `SKILL.md` 文件的文件夹，定义了特定场景下的行为和工具。

## 如何安装 Skills？

使用 [ClawHub](https://clawhub.com) CLI：

```bash
# 安装 CLI
npm install -g clawhub

# 搜索 Skills
clawhub search "calendar"

# 安装 Skill
clawhub install <skill-slug>

# 更新所有 Skills
clawhub update --all
```

## 推荐的实用 Skills

### 1. coding-agent

**功能：** 委托编码任务给 Codex、Claude Code 或 Pi 智能体

**适用场景：**
- 构建新功能或应用
- 代码审查
- 大型代码库重构
- 迭代式编码

**不适用：**
- 简单的一行代码修复（直接编辑即可）
- 在 `~/clawd` 工作区中的工作

```bash
clawhub search "coding"
clawhub install coding-agent
```

### 2. 1password

**功能：** 设置和使用 1Password CLI（op）

**适用场景：**
- 安装 CLI
- 启用桌面应用集成
- 登录（单账号或多账号）
- 读取/注入/运行密钥

```bash
clawhub install 1password
```

### 3. weather

**功能：** 通过 wttr.in 或 Open-Meteo 获取当前天气和预报

**适用场景：**
- 查询任何地点的天气
- 温度和天气预报
- 无需 API 密钥

```bash
clawhub install weather
```

### 4. node-connect

**功能：** 诊断 OpenClaw 节点连接和配对失败

**适用场景：**
- Android/iOS/macOS 配套应用的 QR 码/设置码/手动连接失败
- 本地 Wi-Fi 可用但 VPS/tailnet 不可用
- 配对错误、未授权、引导令牌无效或过期

```bash
clawhub install node-connect
```

### 5. feishu-doc / feishu-drive / feishu-wiki

**功能：** 飞书文档/云盘/知识库读写

**适用场景：**
- 飞书文档编辑
- 云存储文件管理
- 知识库导航

```bash
clawhub install feishu-doc
clawhub install feishu-drive
clawhub install feishu-wiki
```

### 6. healthcheck

**功能：** OpenClaw 部署的主机安全加固和风险容忍度配置

**适用场景：**
- 安全审计
- 防火墙/SSH/更新加固
- 风险姿态评估
- 暴露评估
- 定期安全检查

```bash
clawhub install healthcheck
```

### 7. clawhub

**功能：** 使用 ClawHub CLI 搜索、安装、更新和发布 Skills

**适用场景：**
- 从 clawhub.com 获取新 Skills
- 同步已安装 Skills 到最新版本
- 发布新的/更新的 Skill 文件夹

```bash
clawhub install clawhub
```

## 开发相关 Skills

### skill-creator

**功能：** 创建、编辑、改进或审核 AgentSkills

**适用场景：**
- 从零开始创建新 Skill
- 改进/审查/审计现有 Skill
- 清理和重组 Skill 目录

```bash
clawhub install skill-creator
```

## 如何创建自己的 Skill？

参考 `skill-creator` Skill 的文档，通常需要：

1. 创建一个文件夹
2. 添加 `SKILL.md` 文件，定义：
   - 描述（何时激活）
   - 触发条件
   - 工具使用方式
   - 特殊行为
3. 可选：添加辅助文件（脚本、参考文档）
4. 发布到 ClawHub

```bash
clawhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0
```

## 技巧和建议

1. **批量更新：** 定期运行 `clawhub update --all` 保持 Skills 最新
2. **搜索技巧：** 使用自然语言搜索，如 "backup postgres database"
3. **备份 Skills：** 使用 `clawhub sync` 备份你的自定义 Skills
4. **查看 Skill 详情：** 在 [clawhub.com](https://clawhub.com) 浏览所有可用 Skills

## 总结

OpenClaw 的 Skills 生态系统非常丰富，从日常工具到开发辅助应有尽有。建议先安装几个基础的 Skills，熟悉其使用方式，再根据需要探索更多功能。

你有什么特别推荐的 Skill 吗？欢迎在评论区分享！
