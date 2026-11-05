<script lang="ts" setup>
import { computed } from 'vue'
import { getMedalStyle, EXPIRED_MEDAL_STYLE } from '@/lib/medalStyles'
import { getMedalDecoUrl, isGuard } from '@/lib/roles'
import type { GuardMilestone, UserRole } from '@/lib/roles'

interface Props {
  userRole: UserRole
  medalName: string
  medalLevel: number
  milestone: GuardMilestone
  guardVariant: boolean
  expired: boolean
}

const props = defineProps<Props>()

const style = computed(() =>
  props.expired
    ? EXPIRED_MEDAL_STYLE
    : getMedalStyle(props.medalLevel, props.guardVariant || isGuard(props.userRole)),
)

const decoUrl = computed(() =>
  props.expired ? null : getMedalDecoUrl(props.userRole, props.milestone),
)
</script>

<template>
  <div class="fans-medal-item-ctnr">
    <div
      class="fans-medal-item"
      :style="{
        '--borderColor': style.borderColor,
        backgroundImage: `linear-gradient(45deg, ${style.gradient}, ${style.gradient})`,
      }"
    >
      <div class="fans-medal-label" :class="{ guard: decoUrl }">
        <i
          v-if="decoUrl"
          class="medal-deco medal-guard"
          :style="{ backgroundImage: `url(${decoUrl})` }"
        ></i>
        <div class="fans-medal-content" style="color: #ffffff">{{ props.medalName }}</div>
      </div>
      <div class="fans-medal-level">
        <div class="fans-medal-level-font" style="color: #ffffff">
          {{ props.expired ? '-' : props.medalLevel }}
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 以下样式 1:1 抄自 B 站线上 DOM（SC.txt / SC.html），勿随意调整数值 -->
<style scoped>
.fans-medal-item-ctnr {
  cursor: default;
  margin-left: 1px;
  height: 16px;
}

.fans-medal-item {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  height: 15px;
  line-height: 15px;
  color: #fff;
  white-space: nowrap;
  border-radius: 8px;
  padding: 2px 6px 2px 2px;
  font-family:
    'Microsoft YaHei', 'Microsoft Sans Serif', 'Microsoft SanSerf', '微软雅黑';
  font-size: 12px;
  position: relative;
  cursor: default;
  vertical-align: middle;
}

.fans-medal-item .fans-medal-label.guard {
  padding-left: 12px;
}

.fans-medal-item .fans-medal-label {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 12px;
  height: 12px;
  color: #fff;
}

.fans-medal-item .fans-medal-label,
.fans-medal-item .fans-medal-level {
  /* B 站抓下来的 CSS 里此处被后面的 display:block 覆盖，导致名字沉底、
     等级数字上浮（SC.html 参考文件同病）。保持 flex 垂直居中为正确渲染。 */
  display: flex;
  box-sizing: content-box;
  height: 100%;
  text-align: center;
  z-index: 1;
  position: relative;
}

.fans-medal-item .fans-medal-label .medal-deco.medal-guard {
  margin-left: -12px;
  width: 20px;
  height: 20px;
}

.fans-medal-item .fans-medal-label .medal-deco {
  display: block;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  width: 14px;
  height: 14px;
  margin-right: 2px;
  position: absolute;
  left: 6px;
  z-index: 1;
}

.fans-medal-item .fans-medal-label .fans-medal-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  line-height: 18px;
  transform: scale(0.8333);
  margin-right: 2px;
}

.fans-medal-item .fans-medal-level {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 12px;
  width: 8px;
  font-size: 12px;
  text-align: center;
  color: transparent;
  position: relative;
}

.fans-medal-item .fans-medal-level .fans-medal-level-font {
  font-family: sans-serif;
  font-weight: 700;
  height: 18px !important;
  line-height: 19px !important;
  letter-spacing: -0.3px !important;
  transform: scale(0.917) !important;
}

.fans-medal-item::after {
  position: absolute;
  content: '';
  border: 1px solid var(--borderColor);
  width: 200%;
  height: 200%;
  transform: translateX(-50%) translateY(-50%) scale(0.5, 0.5);
  border-radius: 15px;
  left: 50%;
  top: 50%;
  background-image: inherit;
}
</style>
