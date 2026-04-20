import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Jarvy's Tech Blog",
  description: 'AI 开发技术分享',
  head: [
    ['style', { content: `
:root {
  --vp-c-brand: #00ff41;
  --code-font: 'JetBrains Mono', 'Fira Code', monospace;
}

/* 全局样式 */
body {
  font-family: var(--code-font);
  background: linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%);
}

/* 终端风格背景 */
.VPContent {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 1px, #0d1117 1px, #0d1117 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, #0d1117 1px, #0d1117 2px);
  background-size: 20px 20px;
  background-blend-mode: overlay;
}

/* 霓虹灯效果 */
.VPNavBar {
  background: rgba(13, 17, 23, 0.95);
  border-bottom: 1px solid #00ff41;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
}

.VPNavBar .container {
  backdrop-filter: blur(10px);
}

/* 链接悬停效果 */
a {
  transition: all 0.3s ease;
}

a:hover {
  color: #00ff41;
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
}

/* Hero 区域 */
.VPHero {
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(13, 17, 23, 0.9) 100%);
  border: 1px solid #00ff41;
  box-shadow: 0 0 50px rgba(0, 255, 65, 0.2), inset 0 0 50px rgba(0, 255, 65, 0.1);
}

.VPHero h1 {
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
  background: linear-gradient(135deg, #00ff41 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 特性卡片 */
.VPFeatures {
  gap: 2rem;
}

.VPFeature {
  background: rgba(22, 27, 34, 0.8);
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.VPFeature:hover {
  border-color: #00ff41;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 255, 65, 0.3);
}

.VPFeature h2 {
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}

/* 侧边栏 */
.VPSidebar {
  background: rgba(13, 17, 23, 0.95);
  border-right: 1px solid #30363d;
}

.VPSidebarItem a:hover {
  color: #00ff41;
  background: rgba(0, 255, 65, 0.1);
}

/* 内容区域 */
.VPDoc h1,
.VPDoc h2,
.VPDoc h3 {
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}

/* 代码块 */
div[class*='language-'] {
  background: #0d1117 !important;
  border: 1px solid #30363d;
  border-radius: 4px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
}

div[class*='language-']::before {
  color: #00ff41;
  font-size: 0.85em;
  font-weight: bold;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0d1117;
}

::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00ff41;
}
    ` }]
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '教程', link: '/guide/' },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      '/blog/': [
        {
          text: '最新文章',
          items: [
            { text: 'OpenClaw 好用的 Skill 推荐', link: '/blog/openclaw-skills-recommendation' },
            { text: 'AI Agent 开发入门指南', link: '/blog/ai-agent-development' },
            { text: 'RAG 实战：构建智能知识库问答系统', link: '/blog/rag-practical-guide' },
            { text: '本地 LLM 部署完全指南', link: '/blog/local-llm-deployment' },
            { text: 'Hermes Agent 使用教程', link: '/blog/hermes-agent-tutorial' }
          ]
        }
      ],
      '/guide/': [
        {
          text: 'LangChain 教程',
          items: [
            { text: 'LangChain 入门教程', link: '/guide/langchain-01-introduction' },
            { text: 'LangChain 核心概念详解', link: '/guide/langchain-02-concepts' },
            { text: 'LangChain 实战：构建问答系统', link: '/guide/langchain-03-qa-system' },
            { text: 'LangChain 实战：构建文档分析工具', link: '/guide/langchain-04-document-analyzer' },
            { text: 'LangChain 高级技巧与最佳实践', link: '/guide/langchain-05-best-practices' }
          ]
        },
        {
          text: 'Claude Code 教程',
          items: [
            { text: 'Claude Code 入门教程', link: '/guide/claude-code-01-introduction' },
            { text: 'Claude Code 核心功能详解', link: '/guide/claude-code-02-features' },
            { text: 'Claude Code 实战：自动化开发工作流', link: '/guide/claude-code-03-workflow' },
            { text: 'Claude Code 高级配置与技巧', link: '/guide/claude-code-04-advanced' },
            { text: 'Claude Code 与其他 AI 编程工具对比', link: '/guide/claude-code-05-comparison' }
          ]
        },
        {
          text: 'Claude Code 教程',
          items: [
            { text: 'Claude Code 入门教程', link: '/guide/claude-code-01-introduction' },
            { text: 'Claude Code 核心功能详解', link: '/guide/claude-code-02-features' },
            { text: 'Claude Code 实战：自动化开发工作流', link: '/guide/claude-code-03-workflow' },
            { text: 'Claude Code 与其他 AI 工具对比', link: '/guide/claude-code-04-comparison' },
            { text: 'Claude Code 最佳实践与进阶技巧', link: '/guide/claude-code-05-best-practices' }
          ]
        },
        {
          text: '其他教程',
          items: [
            { text: 'OpenClaw 中文安装教程', link: '/guide/openclaw-installation' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhoujarvy' }
    ],

    // 极客风格 - 暗色主题
    darkMode: 'dark',

    // 中文语言
    lang: 'zh-CN',

    footer: {
      message: 'Released under MIT License.',
      copyright: 'Copyright © 2026-present Jarvy'
    }
  },

  // 默认使用暗色主题
  appearance: 'dark',

  lang: 'zh-CN'
})
