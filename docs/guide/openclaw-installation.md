---
title: OpenClaw 完整安装指南
date: 2026-03-23
updated: 2026-05-06
tags: [OpenClaw, AI, 安装教程]
category: 教程
---

# OpenClaw 完整安装指南

OpenClaw 是一个开源的个人 AI 助手平台，你可以在自己的设备上运行它。它通过你已经在用的聊天渠道与你对话，支持语音交互和可视化 Canvas，网关是控制平面，真正的产品是你的 AI 助手。

如果你想要一个私有的、本地的、快速响应且永远在线的 AI 助手，这就是它。

## 系统要求

### 必需环境

| 组件 | 要求 |
|------|------|
| **Node.js** | 24（推荐）或 22.14+ |
| **操作系统** | Windows 10+（WSL2 推荐）、macOS 12+ 或 Linux（Ubuntu 20.04+） |
| **内存** | 最低 2 GB，推荐 4 GB |
| **磁盘空间** | 约 500 MB（安装和依赖） |

### 可选组件

- **Python 3.10+**：部分 Skill 需要
- **Git**：源码编译需要
- **Docker**：沙盒模式需要
- **网络**：调用 AI API 需要联网；通过 Ollama 跑本地模型可离线使用

## 安装方式

### 🚀 方式一：npm/pnpm 全局安装（推荐）

```bash
# 使用 npm
npm install -g openclaw@latest

# 或使用 pnpm
pnpm add -g openclaw@latest

# 或使用 bun
bun add -g openclaw@latest
```

安装后运行引导：

```bash
openclaw onboard --install-daemon
```

`onboard` 会引导你完成网关、工作区、渠道和 Skill 的设置，并安装为后台守护进程（macOS 使用 launchd，Linux 使用 systemd），保持始终运行。

### 📦 方式二：Docker 安装

```bash
docker pull openclaw/openclaw:latest
```

详见 [Docker 安装指南](https://docs.openclaw.ai/install/docker)。

### 🔧 方式三：从源码安装（开发者）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

## 验证安装

### 1. 检查版本号

```bash
openclaw --version
```

### 2. 环境诊断

```bash
openclaw doctor
```

这会对你的环境做一次全面诊断：Node.js 版本、依赖、配置文件和网络连接。

### 3. 配置向导

```bash
openclaw onboard
```

交互式配置向导，带你完成所有初始设置。

## 初始配置

`onboard` 向导会引导你完成以下步骤：

### 步骤 1：选择 AI 供应商

从以下供应商中选择：

- **Anthropic** (Claude)
- **OpenAI** (GPT / Codex)
- **Google** (Gemini)
- **DeepSeek**
- **xAI** (Grok)
- **Ollama** (本地模型)
- **OpenRouter**（一个 Key 访问多个模型）

> 💡 随时可以在配置里切换供应商，也支持多个供应商自动故障转移。

### 步骤 2：添加 API Key

从供应商后台粘贴你的 API Key。Key 存在本地，除了 AI 供应商不会发到任何地方。

### 步骤 3：连接聊天平台

接入你喜欢的聊天平台：

- **WhatsApp**：扫二维码
- **Telegram**：粘贴 @BotFather 的 Bot Token
- **Discord**：粘贴 Bot Token
- **Slack**：配置 OAuth
- **飞书 (Feishu)**：配置应用凭证
- **微信 (WeChat)**：企业微信或个人微信
- **Signal**：配置凭证
- **Google Chat**：配置服务账号
- **iMessage**：通过 BlueBubbles
- 其他支持的平台：IRC、Matrix、Microsoft Teams、LINE、Mattermost、QQ 等

> 共计 25+ 个渠道，详见 [渠道文档](https://docs.openclaw.ai/channels)。

### 步骤 4：发送测试消息

通过已连接的聊天软件给 OpenClaw 发条消息。如果它回复了，就说明一切就绪。

试试发：
```
你能做什么？
```

### 配置文件说明

主要配置文件：

- `~/.openclaw/openclaw.json` — 主配置
- `~/.openclaw/.env` — API Key 和密钥
- `~/.openclaw/workspace/` — 工作区目录

完整配置参考见 [OpenClaw 官方文档](https://docs.openclaw.ai/gateway/configuration)。

## 核心功能

安装完成后，你可以使用 OpenClaw 的以下核心功能：

### 🗣️ 语音交互

支持 Voice Wake（唤醒词）+ Talk Mode（连续对话）：

- macOS/iOS：唤醒词触发
- Android：ElevenLabs + 系统 TTS
- Google Meet：语音桥接参会
- 电话：Twilio 拨入

配置语音后，你可以像和真人对话一样与 AI 交流。

### 🎨 Live Canvas

Agent 驱动的可视化工作区，通过 A2UI（AI to UI）协议实时渲染界面。macOS 菜单栏应用和 iOS/Android 节点都支持。

### 🤖 多 Agent 路由

可以将不同的渠道/账号/对话路由到隔离的 Agent（独立工作区 + 独立会话），实现工作/生活/项目分离。

### 🛡️ 安全模型

- 默认：工具在宿主机上运行（仅限你自己的 `main` 会话）
- 沙盒模式：设置 `agents.defaults.sandbox.mode: "non-main"` 让非主会话在 Docker 沙盒中运行
- DM 配对：陌生人发消息需要配对码验证，防止未授权访问

### ⏰ 定时任务

```bash
openclaw cron list
openclaw cron create "0 9 * * *"
```

支持 Cron 定时执行任务，如每日日报、定期监控等。

### 🧩 Skill 系统

```bash
# 浏览社区 Skill
openclaw skills browse

# 安装 Skill
openclaw skills install <skill-id>
```

Skill 是 OpenClaw 的可扩展能力模块，从 [ClawHub](https://clawhub.ai) 安装社区贡献的 Skill。

### 💬 会话管理

聊天命令：

- `/status` — 查看状态
- `/new` 或 `/reset` — 新建会话
- `/compact` — 压缩上下文
- `/think <level>` — 设置思考深度
- `/verbose on|off` — 详细输出
- `/usage` — 查看 Token 用量
- `/restart` — 重启网关

## 升级 OpenClaw

保持最新版本，获取最新功能和安全补丁。

### 使用 npm 升级

```bash
npm update -g openclaw@latest
```

### 使用 pnpm 升级

```bash
pnpm update -g openclaw@latest
```

### 推荐：使用内置更新

```bash
openclaw update
openclaw doctor
```

### 从源码升级

```bash
cd openclaw
git pull
pnpm install
pnpm run build
```

在 [GitHub Releases](https://github.com/openclaw/openclaw/releases) 查看更新日志。

## 卸载 OpenClaw

### npm 卸载

```bash
npm uninstall -g openclaw
```

### pnpm 卸载

```bash
pnpm remove -g openclaw
```

### 删除用户数据（可选）

⚠️ 这会清除你所有的对话记录、Skill、配置和 API Key。操作前先备份。

```bash
# macOS / Linux
rm -rf ~/.openclaw

# Windows
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

# 深度诊断
openclaw doctor --fix
```

### 安全相关

- 默认 DM 配对模式，陌生人需要验证码才能交互
- 使用 `openclaw doctor` 检查安全配置是否正确
- 详见 [安全文档](https://docs.openclaw.ai/gateway/security)

### 遇到其他问题？

- [常见问题 FAQ](https://docs.openclaw.ai/help/faq)
- [Discord 社区](https://discord.gg/clawd)

## 下一步

安装完成后，建议：

1. **配置你喜欢的 LLM 供应商** — 在 `onboard` 或 `.env` 中设置
2. **安装常用 Skills** — 访问 [ClawHub](https://clawhub.ai) 探索
3. **配置语音交互** — 在 macOS/Android 上启用 Voice Wake
4. **设置定时任务** — 自动化重复工作
5. **安装 Companion App**（可选）— macOS 菜单栏应用或 iOS/Android 节点

## 参考资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [ClawHub Skills 市场](https://clawhub.ai)
- [GitHub 仓库](https://github.com/openclaw/openclaw)（36.8万⭐）
- [Discord 社区](https://discord.gg/clawd)
- [快速入门](https://docs.openclaw.ai/start/getting-started)
- [更新指南](https://docs.openclaw.ai/install/updating)

---

有任何问题欢迎在评论区讨论！
