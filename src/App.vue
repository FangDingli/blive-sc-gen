<script lang="ts" setup>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun } from '@lucide/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import ScCardHistory from '@/components/sc/ScCardHistory.vue'
import ScCardDetail from '@/components/sc/ScCardDetail.vue'
import ConfigPanel from '@/components/ConfigPanel.vue'
import { useScConfig } from '@/composables/useScConfig'
import { exportPng } from '@/lib/exporter'

const config = useScConfig()

// 暗黑模式：初始跟随系统，切换后持久化到 localStorage
const isDark = useDark()
const toggleDark = useToggle(isDark)

const historyEl = ref<HTMLElement | null>(null)
const detailEl = ref<HTMLElement | null>(null)
const exporting = ref(false)

const scales = [1, 2, 4, 8]

const doExport = async (el: HTMLElement | null, scale: number) => {
  if (!el || exporting.value) return
  exporting.value = true
  try {
    await exportPng(el, scale, config.exportEngine)
  } catch (e) {
    alert(`导出失败：${e instanceof Error ? e.message : e}\n可尝试切换导出引擎后重试`)
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <!-- 应用壳布局：大屏下视口固定、页面永不滚动，滚动只发生在左右两列内部 -->
  <div class="mx-auto max-w-7xl px-4 py-6 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
    <header class="mb-6 flex shrink-0 items-end justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">B站直播 SC 图片生成器</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          还原 B 站 SuperChat 卡片样式，导出高清 PNG，供直播切片使用
        </p>
      </div>
      <button
        class="rounded-md border p-2 hover:bg-accent"
        :title="isDark ? '切换到亮色' : '切换到暗色'"
        @click="toggleDark()"
      >
        <Sun v-if="isDark" class="size-4" />
        <Moon v-else class="size-4" />
      </button>
    </header>

    <div
      class="grid gap-6 lg:min-h-0 lg:flex-1 lg:content-start lg:grid-cols-[1fr_440px] lg:grid-rows-[minmax(0,auto)]"
    >
      <!-- 预览区：内容超出视口时此列内部滚动 -->
      <div class="flex flex-col gap-6 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle class="text-base">样式1 · 弹幕历史卡片</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                  :disabled="exporting"
                >
                  导出 PNG
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>选择倍率</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  v-for="s in scales"
                  :key="s"
                  @click="doExport(historyEl, s)"
                >
                  {{ s === 1 ? '默认大小' : `${s}x 放大` }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent class="overflow-x-auto">
            <div class="preview-surface py-10">
              <div ref="historyEl" class="w-fit">
                <ScCardHistory :config="config" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle class="text-base">
              样式2 · 详情卡片
              <Badge variant="secondary" class="ml-2 align-middle">需要头像</Badge>
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                  :disabled="exporting"
                >
                  导出 PNG
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>选择倍率</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  v-for="s in scales"
                  :key="s"
                  @click="doExport(detailEl, s)"
                >
                  {{ s === 1 ? '默认大小' : `${s}x 放大` }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent class="overflow-x-auto">
            <div class="preview-surface py-10">
              <div ref="detailEl" class="w-fit">
                <ScCardDetail :config="config" />
              </div>
            </div>
          </CardContent>
        </Card>

        <footer class="border-t pt-6 text-sm text-muted-foreground">
          <p>
            本项目只为方便制作 SC 图片，请勿用于无中生有甚至造谣主播、人身攻击；任何因此生成的图片所产生的造谣、虚假事实，开发者概不负责；生成的图片一律不能作为证据。
          </p>
          <p class="mt-2">
            作者：<a
              class="underline hover:text-foreground"
              href="https://space.bilibili.com/23598218"
              target="_blank"
              rel="noopener">归墟_丶</a> with GLM5.3-flash
            · 灵感来自
            <a class="underline hover:text-foreground" href="https://github.com/Hicircum/SC-Generator/" target="_blank" rel="noopener">SC-Generator</a>
          </p>
        </footer>
      </div>

      <!-- 配置区：卡片绝对定位铺满格子，高度恒等于左列内容高度，
           展开的配置超出时走内部滚动，行高与页面高度始终由左列决定 -->
      <div class="lg:relative lg:min-h-0">
        <Card class="flex flex-col min-h-0 lg:absolute lg:inset-0">
          <CardHeader class="shrink-0 pb-4">
            <CardTitle class="text-base">配置</CardTitle>
          </CardHeader>
          <CardContent class="min-h-0 flex-1 overflow-y-auto">
            <ConfigPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 预览底板：给卡片一个中性棋盘格背景，暗色下换深灰 */
.preview-surface {
  background:
    repeating-conic-gradient(#f4f4f5 0% 25%, #fafafa 0% 50%) 50% / 16px 16px;
  display: flex;
  justify-content: center;
}

.dark .preview-surface {
  background:
    repeating-conic-gradient(#27272a 0% 25%, #1f1f23 0% 50%) 50% / 16px 16px;
}
</style>
