import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () =>
        h('span', {
          class: 'custom-site-title',
        }, "Jarvy's Tech Blog")
    })
}
