import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Jarvy's Tech Blog",
  description: 'AI 开发技术分享',

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
          text: 'OpenClaw 教程',
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
