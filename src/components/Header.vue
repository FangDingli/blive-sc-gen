<script lang="ts" setup>
import { darkTheme, useOsTheme } from 'naive-ui'
import { currentTheme } from '~/utils'

const osThemeRef = useOsTheme()
currentTheme.value = osThemeRef.value === 'light' ? null : darkTheme

const switchTheme = () => {
  if (currentTheme.value) {
    currentTheme.value = null
  } else {
    currentTheme.value = darkTheme
  }
}

const openGithub = () => {
  window.open('https://github.com/FangDingli/blive-sc-gen')
}
</script>

<template>
  <div class="flex items-center">
    <h2 class="w-full h-full" text="center">
      <NText type="info"> bilibili直播SC图片生成器 </NText>
    </h2>
    <div class="ml-auto flex">
      <button
        class="w-22px h-22px mr-30px"
        :class="currentTheme ? 'i-uil-moon' : 'i-uil-sun'"
        @click="switchTheme"
      ></button>
      <button class="w-22px h-22px mr-30px" i-uil-github @click="openGithub"></button>
    </div>
  </div>
</template>
