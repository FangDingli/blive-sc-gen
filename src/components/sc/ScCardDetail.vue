<script lang="ts" setup>
import { computed } from 'vue'
import { getScColorByBattery, getScBadgeByBattery } from '@/lib/scColors'
import { getAvatarFrameUrl } from '@/lib/roles'
import type { ScConfig } from '@/composables/useScConfig'

interface Props {
  config: ScConfig
}

const props = defineProps<Props>()

const scColor = computed(() => getScColorByBattery(props.config.battery))
const cornerBadge = computed(() => getScBadgeByBattery(props.config.battery))
const frameUrl = computed(() =>
  getAvatarFrameUrl(props.config.userRole, props.config.milestone),
)
const nameColor = computed(() =>
  props.config.isVip ? '#f9708e' : '#333333',
)
</script>

<template>
  <div class="card-detail" :style="{ width: `${props.config.width}px` }">
    <div
      class="card-item-middle-top"
      :style="{ borderColor: scColor.content, backgroundColor: scColor.info }"
    >
      <div class="card-item-middle-top-left">
        <div
          class="icon-face"
          :style="{ backgroundImage: `url(${props.config.avatar})` }"
        ></div>
        <div
          v-if="frameUrl"
          class="icon-face-frame"
          :style="{ backgroundImage: `url(${frameUrl})` }"
        ></div>
      </div>
      <div class="card-item-middle-top-right">
        <div class="superchat-name" :style="{ color: nameColor }">
          {{ props.config.userName }}
        </div>
        <div class="content-bottom">
          <div class="price">{{ props.config.battery }} 电池</div>
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

<!-- 1:1 还原 B 站点开 SC 详情后的卡片（SC.txt 样式2 部分） -->
<style scoped>
.card-detail {
  position: relative;
  z-index: 2;
  min-height: 88px;
}

.card-item-middle-top {
  border-radius: 6px 6px 0 0;
  height: 50px;
  background-position: 100% center;
  background-size: contain;
  background-repeat: no-repeat;
  padding: 8px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid;
  background-image: url('../../assets/SC-bg-img.png');
}

.card-item-middle-top-left .icon-face,
.card-item-middle-top-left .icon-face-frame {
  width: 30px;
  height: 30px;
  border-radius: 17px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-item-middle-top-left .icon-face-frame {
  width: 34px;
  height: 34px;
  position: absolute;
  top: 9px;
  left: 9px;
}

.card-item-middle-top-right {
  margin: 2px 0 0 6px;
  display: flex;
  flex-direction: column;
  color: #333;
  width: 100%;
}

.superchat-name {
  opacity: 0.78;
  font-size: 12px;
}

.content-bottom {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.price {
  margin-top: 2px;
  font-size: 14px;
  line-height: 16px;
}

.card-item-middle-bottom {
  position: relative;
  padding: 8px 10px;
  box-sizing: border-box;
  border-radius: 2px 2px 6px 6px;
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
