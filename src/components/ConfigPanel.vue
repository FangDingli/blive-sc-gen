<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Minus, Plus } from '@lucide/vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useScConfig, clampMedalName } from '@/composables/useScConfig'
import { useAvatar } from '@/composables/useAvatar'
import {
  USER_ROLE_OPTIONS,
  GUARD_MILESTONE_OPTIONS,
} from '@/lib/roles'
import type { ExportEngine } from '@/lib/exporter'

const config = useScConfig()
const { status: avatarStatus, source: avatarSource, exportable: avatarExportable, message: avatarMessage, fetchPreviewAvatar, applyAvatarUrl, applyAvatarFile } = useAvatar()

const avatarUrlInput = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

/** reka-ui Slider 的模型是数组，包一层适配标量 */
const widthModel = computed({
  get: () => [config.width],
  set: (v: number[]) => {
    if (typeof v[0] === 'number') config.width = v[0]
  },
})

const engineModel = computed({
  get: () => config.exportEngine,
  set: (v: unknown) => {
    config.exportEngine = v as ExportEngine
  },
})

const onMedalNameBlur = () => {
  config.medalName = clampMedalName(config.medalName)
}

const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) await applyAvatarFile(file)
  input.value = ''
}
</script>

<template>
  <Accordion
    type="multiple"
    :default-value="['general']"
    class="flex flex-col gap-3"
  >
    <AccordionItem value="general" class="border-none">
      <AccordionTrigger class="text-sm font-semibold text-muted-foreground hover:no-underline">通用设置</AccordionTrigger>
      <AccordionContent class="flex flex-col gap-4 pb-2">

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0">卡片宽度</Label>
        <Slider
          v-model="widthModel"
          :min="269"
          :max="700"
          :step="1"
          class="flex-1"
        />
        <span class="w-14 text-right text-sm tabular-nums">{{ config.width }}px</span>
      </div>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0" for="battery">电池数</Label>
        <!-- 根 step=1 避免手输价格（如 1314）失焦被吸附到步进值；±100 按钮自行实现 -->
        <div class="flex flex-1 items-center gap-1.5">
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-md border hover:bg-accent"
            aria-label="减少 100"
            @click="config.battery = Math.max(300, config.battery - 100)"
          >
            <Minus class="size-4" />
          </button>
          <NumberField
            v-model="config.battery"
            :min="300"
            :max="9999999"
            :step="1"
            :format-options="{ useGrouping: false }"
            class="flex-1"
          >
            <NumberFieldInput id="battery" />
          </NumberField>
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-md border hover:bg-accent"
            aria-label="增加 100"
            @click="config.battery = Math.min(9999999, config.battery + 100)"
          >
            <Plus class="size-4" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0" for="username">昵称</Label>
        <Input id="username" v-model="config.userName" placeholder="用户昵称" />
      </div>

      <div class="flex items-start gap-3">
        <Label class="w-24 shrink-0 pt-2" for="sc-content">SC 内容</Label>
        <Textarea
          id="sc-content"
          v-model="config.scContent"
          :auto-size="{ minRows: 1, maxRows: 6 }"
          placeholder="SC 内容"
        />
      </div>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0" for="show-trans">显示翻译</Label>
        <Switch id="show-trans" v-model="config.showTrans" />
      </div>

      <div v-if="config.showTrans" class="flex items-start gap-3">
        <Label class="w-24 shrink-0 pt-2" for="trans-content">翻译内容</Label>
        <Textarea
          id="trans-content"
          v-model="config.transContent"
          :auto-size="{ minRows: 1, maxRows: 6 }"
          placeholder="翻译内容"
        />
      </div>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0">用户身份</Label>
        <Select v-model="config.userRole">
          <SelectTrigger class="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in USER_ROLE_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0">舰队里程碑</Label>
        <RadioGroup v-model="config.milestone" class="flex flex-1 flex-wrap gap-x-3 gap-y-1">
          <label
            v-for="opt in GUARD_MILESTONE_OPTIONS"
            :key="opt.value"
            class="flex items-center gap-1.5 text-sm whitespace-nowrap"
          >
            <RadioGroupItem :value="opt.value" />
            {{ opt.label }}
          </label>
        </RadioGroup>
      </div>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0" for="is-vip">大会员</Label>
        <Switch id="is-vip" v-model="config.isVip" />
      </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="medal" class="border-none">
      <AccordionTrigger class="text-sm font-semibold text-muted-foreground hover:no-underline">粉丝牌（样式1）</AccordionTrigger>
      <AccordionContent class="flex flex-col gap-4 pb-2">

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0" for="show-medal">显示粉丝牌</Label>
        <Switch id="show-medal" v-model="config.showFansMedal" />
      </div>

      <template v-if="config.showFansMedal">
        <div class="flex items-center gap-3">
          <Label class="w-24 shrink-0" for="medal-name">粉丝牌名称</Label>
          <Input
            id="medal-name"
            v-model="config.medalName"
            placeholder="最多 3 个汉字 / 6 字符"
            @blur="onMedalNameBlur"
          />
        </div>

        <div class="flex items-center gap-3">
          <Label class="w-24 shrink-0" for="medal-level">粉丝牌等级</Label>
          <NumberField
            v-model="config.medalLevel"
            :min="1"
            :max="60"
            :step="1"
            :format-options="{ useGrouping: false }"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput id="medal-level" />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <div class="flex items-center gap-3">
          <Label class="w-24 shrink-0" for="medal-guard">大航海样式</Label>
          <Switch id="medal-guard" v-model="config.medalGuardVariant" />
        </div>

        <div class="flex items-center gap-3">
          <Label class="w-24 shrink-0" for="medal-expired">失效样式</Label>
          <Switch id="medal-expired" v-model="config.medalExpired" />
        </div>
      </template>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="avatar" class="border-none">
      <AccordionTrigger class="text-sm font-semibold text-muted-foreground hover:no-underline">头像（样式2）</AccordionTrigger>
      <AccordionContent class="flex flex-col gap-4 pb-2">

      <Alert class="border-amber-500/50 bg-amber-500/5 text-amber-600 dark:text-amber-400">
        <AlertDescription>
          通过 uid 获取的头像<b>仅用于预览，导出的图片不会包含头像</b>（浏览器安全限制，无解）。
          想让导出图片也附带头像：点「打开B站动态页」→ 按下方提示复制头像直链 → 粘贴到「头像直链」，或直接「上传头像文件」。
        </AlertDescription>
      </Alert>

      <div class="flex flex-wrap items-center gap-3">
        <Label class="w-24 shrink-0" for="uid">用户 uid</Label>
        <Input id="uid" v-model="config.uid" placeholder="纯数字 uid" />
        <button
          class="shrink-0 rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
          :disabled="avatarStatus === 'loading'"
          @click="fetchPreviewAvatar(config.uid)"
        >
          {{ avatarStatus === 'loading' ? '获取中…' : '获取头像' }}
        </button>
        <a
          v-if="config.uid"
          class="shrink-0 text-xs text-primary underline hover:no-underline"
          :href="`https://space.bilibili.com/${config.uid}/dynamic`"
          target="_blank"
          rel="noopener"
          title="跳转到该用户的 B 站动态页，按下方提示两步拿到头像直链"
        >
          打开B站动态页 ↗
        </a>
        <span v-if="avatarSource !== 'default'"
          class="shrink-0 rounded-full px-2 py-0.5 text-xs"
          :class="avatarExportable
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'"
        >
          {{ avatarExportable ? '导出可用' : '仅预览' }}
        </span>
      </div>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0" for="avatar-url">头像直链</Label>
        <Input
          id="avatar-url"
          v-model="avatarUrlInput"
          placeholder="粘贴头像图片链接"
        />
        <button
          class="shrink-0 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          @click="applyAvatarUrl(avatarUrlInput)"
        >
          应用
        </button>
      </div>
      <details class="pl-24 text-xs text-muted-foreground">
        <summary class="cursor-pointer select-none">手动获取头像直链的方法</summary>
        <p class="mt-2 leading-relaxed">
          打开对应用户的 B 站动态页，鼠标悬停在任意一条动态的头像上，会弹出资料卡；
          在资料卡的头像上点击右键，选择「复制图片链接」，粘贴到「头像直链」输入框即可。
        </p>
      </details>

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0">上传头像</Label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="text-sm file:mr-2 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm hover:file:bg-accent"
          @change="onFileChange"
        />
      </div>

      <p v-if="avatarMessage" class="pl-24 text-xs text-destructive">
        {{ avatarMessage }}
      </p>

      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="export" class="border-none">
      <AccordionTrigger class="text-sm font-semibold text-muted-foreground hover:no-underline">导出</AccordionTrigger>
      <AccordionContent class="flex flex-col gap-4 pb-2">

      <div class="flex items-center gap-3">
        <Label class="w-24 shrink-0">导出引擎</Label>
        <Select v-model="engineModel">
          <SelectTrigger class="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern-screenshot">modern-screenshot（默认）</SelectItem>
            <SelectItem value="html2canvas-pro">html2canvas-pro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
