import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Jarvy's Tech Blog",
  description: 'AI 开发技术分享',
  head: [
    ['link', { rel: 'stylesheet', href: '/.vitepress/theme/custom.css' }]
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
            { text: '本地 LLM 部署完全指南', link: '/blog/local-llm-deployment' }
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
