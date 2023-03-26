import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  exclude: [
    'node_modules',
    'dist',
    '.git',
    '.husky',
    '.vscode',
    'public',
    'build',
    'mock',
    './stats.html',
  ],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
    },
  ],
  rules: [
    [
      'font-yahei',
      { 'font-family': '"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf","微软雅黑"' },
    ],
  ],
  theme: {},
  presets: [presetUno(), presetIcons(), presetAttributify()],
})
