import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Jarvy's Tech Blog",
  description: 'AI 开发技术分享',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }]
  ],

  themeConfig: {
    siteTitle: false,

    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '教程', link: '/guide/' },
      { text: '项目', link: '/projects' },
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
          text: '其他教程',
          items: [
            { text: 'OpenClaw 中文安装教程', link: '/guide/openclaw-installation' },
            { text: 'Hermes Agent 使用教程', link: '/blog/hermes-agent-tutorial' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhoujarvy' }
    ],

    footer: {
      message: 'Released under MIT License.',
      copyright: 'Copyright © 2026-present Jarvy'
    }
  },

  appearance: 'force-dark',
  lang: 'zh-CN'
})
