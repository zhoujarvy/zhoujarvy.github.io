---
title: OpenClaw 中文安装教程
date: 2026-03-15
tags: [OpenClaw, AI, 安装教程]
category: 教程
---

# OpenClaw 中文安装教程

OpenClaw 是一个强大的 AI 智能体平台，支持多种大模型和多渠道消息接入。本文将详细介绍 OpenClaw 的安装和配置流程。

## 系统要求

- **Node.js >= 22**
- macOS、Linux 或 Windows（通过 WSL2）
- 建议内存：至少 2GB

## 快速安装（推荐）

### macOS / Linux

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Windows（PowerShell）

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

## 安装器说明

安装器会自动完成以下步骤：

1. 全局安装 `openclaw` CLI
2. 运行新手引导
3. 安装和配置 Gateway 服务

### 非交互式安装

跳过新手引导：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

## 手动安装

### 使用 npm 全局安装

```bash
npm install -g openclaw@latest
```

### 使用 pnpm 全局安装

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
pnpm add -g openclaw@latest
```

### 从源码安装（开发者）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
openclaw onboard --install-daemon
```

## 安装后配置

### 运行新手引导

```bash
openclaw onboard --install-daemon
```

这会引导你完成：
- 选择大模型提供商（OpenAI、Anthropic、Google 等）
- 配置 API 密钥
- 设置消息渠道（Signal、Telegram、WhatsApp 等）

### 检查状态

```bash
openclaw doctor      # 诊断环境
openclaw status      # 查看状态
openclaw health      # 检查健康
openclaw dashboard   # 打开仪表板
```

## 常见问题

### 找不到 `openclaw` 命令

检查 PATH：

```bash
echo $PATH
npm prefix -g
```

将 npm 全局路径添加到 PATH：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

### sharp 安装失败

强制使用预构建二进制：

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

## 更新和卸载

### 更新

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 卸载

```bash
npm uninstall -g openclaw
```

## 下一步

安装完成后，建议：
1. 配置你喜欢的 LLM 提供商
2. 安装一些常用 Skills（[ClawHub](https://clawhub.com)）
3. 创建你的第一个工作区

## 参考资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [ClawHub Skills 市场](https://clawhub.com)
- [GitHub 仓库](https://github.com/openclaw/openclaw)

---

有任何问题欢迎在评论区讨论！
