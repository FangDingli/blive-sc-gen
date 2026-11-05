<script lang="ts" setup>
import { computed } from 'vue'
import FansMedal from './FansMedal.vue'
import { getScColorByBattery, getScBadgeByBattery } from '@/lib/scColors'
import { NAME_COLOR_BY_ROLE } from '@/lib/roles'
import type { ScConfig } from '@/composables/useScConfig'

interface Props {
  config: ScConfig
}

const props = defineProps<Props>()

const scColor = computed(() => getScColorByBattery(props.config.battery))
const cornerBadge = computed(() => getScBadgeByBattery(props.config.battery))
const nameColor = computed(() => NAME_COLOR_BY_ROLE[props.config.userRole])
</script>

<template>
  <div
    class="sc-card"
    :style="{ width: `${props.config.width}px` }"
  >
    <div class="card-item-top-right">{{ props.config.battery }} 电池</div>
    <div
      class="card-item-middle-top"
      :style="{ borderColor: scColor.content, backgroundColor: scColor.info }"
    >
      <div class="card-item-middle-top-right">
        <div class="superchat-base">
          <FansMedal
            v-if="props.config.showFansMedal"
            :user-role="props.config.userRole"
            :medal-name="props.config.medalName"
            :medal-level="props.config.medalLevel"
            :milestone="props.config.milestone"
            :guard-variant="props.config.medalGuardVariant"
            :expired="props.config.medalExpired"
          />
          <div
            class="common-nickname-wrapper card-item-name"
            :style="{ color: nameColor }"
          >
            {{ props.config.userName }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="card-item-middle-bottom"
      :style="{ backgroundColor: scColor.content }"
    >
      <div class="input-contain">
        <span class="text">{{ props.config.scContent }}</span>
      </div>
      <div v-show="props.config.showTrans" class="input-trans-contain">
        <span class="text">{{ props.config.transContent }}</span>
      </div>
      <div
        v-if="cornerBadge"
        class="bottom-background"
        :style="{ backgroundImage: `url(${cornerBadge})` }"
      ></div>
    </div>
  </div>
</template>

<!-- 1:1 还原 B 站弹幕历史里的 SC 卡片（SC.txt 样式1/弹幕历史框部分） -->
<style scoped>
.sc-card {
  position: relative;
  margin-left: -5px;
  margin-right: -5px;
  min-height: 38px;
  padding: 5px;
  color: #61666d;
  line-height: 18px;
  word-wrap: break-word;
  white-space: normal;
}

.card-item-top-right {
  padding: 0 4px;
  position: absolute;
  top: 10px;
  right: 8px;
  height: 20px;
  line-height: 20px;
  border-radius: 0 5px 0 4px;
  font-size: 14px;
  color: #333;
}

.card-item-middle-top {
  border-radius: 6px 6px 0 0;
  height: 34px;
  background-position: right top;
  background-size: contain;
  background-repeat: no-repeat;
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid;
  background-image: url('../../assets/SC-bg-img.png');
}

.card-item-middle-top-right {
  width: 231px;
  margin-left: 0;
  display: inline-block;
  color: #333;
}

.superchat-base {
  display: inline-flex;
  width: auto;
  vertical-align: text-bottom;
  height: 27px;
  line-height: 27px;
}

.fans-medal-item-ctnr {
  margin-right: 3px;
}

.common-nickname-wrapper {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  text-overflow: ellipsis;
  font-size: 12px;
  overflow: hidden;
}

.card-item-name {
  width: 125px;
  opacity: 0.78;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: text-bottom;
  height: 27px;
  line-height: 27px;
  margin-left: 4px;
  font-weight: 700;
}

.card-item-middle-bottom {
  position: relative;
  padding: 8px 10px;
  box-sizing: border-box;
  border-radius: 0 0 6px 6px;
  min-height: 38px;
}

.input-contain,
.input-trans-contain {
  position: relative;
  min-height: 12px;
  word-wrap: break-word;
}

.input-contain .text,
.input-trans-contain .text {
  font-size: 12px;
  color: #fff;
  text-align: left;
  line-height: 20px;
}

.input-trans-contain {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(245, 245, 245, 0.33);
}

.bottom-background {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
