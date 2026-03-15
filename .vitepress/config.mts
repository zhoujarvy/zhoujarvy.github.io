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
          text: '博客文章',
          items: [
            { text: '最新文章', link: '/blog/' }
          ]
        }
      ],
      '/guide/': [
        {
          text: '技术教程',
          items: [
            { text: '快速开始', link: '/guide/' }
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
