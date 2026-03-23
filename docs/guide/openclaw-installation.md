---
title: OpenClaw 完整安装指南
date: 2026-03-23
tags: [OpenClaw, AI, 安装教程]
category: 教程
---

# OpenClaw 完整安装指南

OpenClaw 是一个强大的 AI 智能体平台，支持多种大模型和多渠道消息接入。本文将详细介绍 OpenClaw 的安装、配置、验证和维护流程。

## 系统要求

### 必需环境

| 组件 | 要求 |
|------|------|
| **Node.js** | 22 或更高版本（推荐 LTS） |
| **操作系统** | Windows 10+、macOS 12+ 或 Linux（Ubuntu 20.04+、Debian 11+） |
| **内存** | 最低 2 GB，推荐 4 GB |
| **磁盘空间** | 约 500 MB（安装和依赖） |

### 可选组件

- **Python 3.10+**：部分技能需要
- **Git**：源码编译需要
- **网络**：调用 AI API 需要联网；通过 Ollama 跑本地模型可离线使用

## 安装方式

OpenClaw 提供多种安装方式，任你选择：

### 🚀 方式一：一键安装（推荐）

复制粘贴一行命令就完事，大多数人选这个。

#### macOS / Linux

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git
```

#### Windows (PowerShell)

```powershell
curl -fsSL https://openclaw.ai/install.cmd -o install.cmd
.\install.cmd --tag beta
del install.cmd
```

### 📦 方式二：使用 npm 安装

```bash
npm install -g openclaw@latest
```

### 📦 方式三：使用 pnpm 安装

```bash
pnpm add -g openclaw@latest
```

### 🔧 方式四：从源码安装（开发者）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

## 验证安装

安装完成后，运行以下命令确认 OpenClaw 安装正确。

### 1. 检查版本号

```bash
openclaw --version
```

应该输出已安装的版本号（如 `v2026.3.13`）。

### 2. 环境诊断

```bash
openclaw doctor
```

这会对你的环境做一次诊断检查：Node.js 版本、依赖、配置文件和网络连接。

### 3. 配置向导

```bash
openclaw onboard
```

交互式配置向导，带你设置 API Key、连接聊天平台和初始配置。

## 初始配置

安装完成后，`onboard` 向导会引导你完成配置。每一步的作用如下：

### 步骤 1：选择 AI 供应商

从以下供应商中选择一个：

- **Anthropic** (Claude)
- **OpenAI** (GPT)
- **Google** (Gemini)
- **Ollama** (本地模型)

> 💡 随时可以在配置里切换供应商。

### 步骤 2：添加 API Key

从供应商后台粘贴你的 API Key。

- Key 存在本地 `.env` 文件里
- 除了 AI 供应商，不会发到任何地方
- 安全且私密

### 步骤 3：连接聊天平台

接入你喜欢的聊天平台：

- **WhatsApp**：扫二维码
- **Telegram**：粘贴 @BotFather 的 Bot Token
- **Discord**：粘贴 Bot Token
- **Signal**：配置凭证
- 其他支持的平台...

### 步骤 4：发送测试消息

通过已连接的聊天软件给 OpenClaw 发条消息。如果它回复了，就说明一切就绪。

试试发：
```
你能做什么？
```

### 配置文件说明

所有配置存储在 `~/.openclaw/.env`。你可以直接编辑这个文件来：

- 切换 AI 供应商
- 添加或修改 API Key
- 调整其他设置

完整配置参考见 [OpenClaw 官方文档](https://docs.openclaw.ai/configuration)。

## 升级 OpenClaw

保持 OpenClaw 最新版本，获取最新功能、集成和安全补丁。

### 使用 npm 升级

```bash
npm update -g openclaw@latest
```

### 使用 pnpm 升级

```bash
pnpm update -g openclaw@latest
```

### 从源码升级

```bash
cd openclaw
git pull
pnpm install
pnpm run build
```

### Docker 升级

```bash
docker pull openclaw/openclaw:latest
docker restart openclaw
```

在 [GitHub Releases](https://github.com/openclaw/openclaw/releases) 查看更新日志，了解每个版本的新内容。

## 卸载 OpenClaw

如果你需要从系统中移除 OpenClaw，按照对应安装方式的步骤操作即可。

### npm 卸载

```bash
npm uninstall -g openclaw
```

### pnpm 卸载

```bash
pnpm remove -g openclaw
```

### 源码卸载

```bash
rm -rf ~/openclaw
```

### Docker 卸载

```bash
docker stop openclaw
docker rm openclaw
docker rmi openclaw/openclaw:latest
```

### 删除用户数据（可选）

⚠️ 这会清除你所有的对话记录、技能、配置和 API Key。操作前先备份好需要保留的内容。

#### macOS / Linux

```bash
rm -rf ~/.openclaw
```

#### Windows

```powershell
rmdir /s /q %USERPROFILE%\.openclaw
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

### Gateway 服务无法启动

```bash
# 检查服务状态
openclaw gateway status

# 重启服务
openclaw gateway restart

# 查看日志
openclaw gateway logs
```

### 遇到其他问题？

来 [OpenClaw Discord](https://discord.gg/clawd) 问问，总有人能帮到你。

## 下一步

安装完成后，建议：

1. **配置你喜欢的 LLM 提供商** - 在 `.env` 中设置 API Key
2. **安装常用 Skills** - 访问 [ClawHub](https://clawhub.com) 探索更多技能
3. **创建你的第一个工作区** - 开始你的 AI Agent 之旅

## 参考资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [ClawHub Skills 市场](https://clawhub.com)
- [GitHub 仓库](https://github.com/openclaw/openclaw)
- [Discord 社区](https://discord.gg/clawd)

---

有任何问题欢迎在评论区讨论！
