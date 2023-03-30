<script lang="ts" setup>
import { getColorByPrice, nameColorByRole, scBadgeByPrice } from '~/utils'

interface Props {
  width: number
  battery: number
  userName: string
  userRole: string
  scContent: string
  showTrans: boolean
  transContent: string
  showFansMedal: boolean
  medalName: string
  medalLevel: number
  guardMileStone: '0' | 'k' | 'w'
}

const props = defineProps<Props>()

const scColor = ref<{ info: string; content: string }>(getColorByPrice(props.battery))

watchEffect(() => {
  scColor.value = getColorByPrice(props.battery)
})
</script>

<template>
  <div
    id="SuperChat"
    class="relative p-5px break-words ws-normal -m-x-5px min-w-130px min-h-38px"
    text="12px #61666D"
    :style="{ width: `${props.width}px` }"
  >
    <div class="h-20px lh-20px" text="14px #333" pos="absolute top-10px right-8px">
      {{ `${props.battery} 电池` }}
    </div>
    <div
      class="h-34px flex justify-start items-center p-x-5px box-border sc_card_head"
      bg="no-repeat right-top contain"
      border="1px solid rd-t-6px rd-b-0"
    >
      <div class="w-90% inline-block ml-0 text-#333">
        <div v-show="showFansMedal" class="inline-block w-auto v-text-bottom h-27px lh-27px">
          <FansMedal
            :userRole="props.userRole"
            :medalName="props.medalName"
            :medalLevel="props.medalLevel"
            :guardMileStone="props.guardMileStone"
          ></FansMedal>
        </div>
        <div
          class="inline-block w-105px op-78 text-14px truncate v-text-bottom h-27px lh-27px ml-4px fw-700"
          :style="{ color: nameColorByRole[~~props.userRole] }"
        >
          {{ props.userName }}
        </div>
      </div>
    </div>
    <div
      class="relative p-y-8px p-x-10px box-border"
      border="rd-t-0 rd-b-6px min-h-38px"
      :style="{ backgroundColor: scColor.content }"
    >
      <div class="relative min-h-12px break-words">
        <span text="12px #fff left" class="lh-20px">{{ props.scContent }}</span>
      </div>
      <div
        v-show="props.showTrans"
        class="relative min-h-12px break-words mt-6px p-t-6px input-trans-contain"
      >
        <span text="12px #fff left" class="lh-20px">{{ props.transContent }}</span>
      </div>
      <div
        v-show="props.battery >= 5000"
        pos="absolute right-0 bottom-0"
        class="w-16px h-16px"
        bg="center cover no-repeat"
        :style="{ backgroundImage: `url(${scBadgeByPrice(props.battery)})` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.sc_card_head {
  background-image: url('~/assets/images/SC-bg-img.png');
  border-color: v-bind('scColor.content');
  background-color: v-bind('scColor.info');
}
.input-trans-contain {
  border-top: 1px solid rgba(245, 245, 245, 0.33);
}
</style>
