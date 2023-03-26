<script lang="ts" setup>
import Index from './pages/index.vue'
import { currentTheme } from './utils'
</script>

<template>
  <NConfigProvider :theme="currentTheme">
    <NMessageProvider>
      <Index></Index>
    </NMessageProvider>
  </NConfigProvider>
</template>
