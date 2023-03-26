<script lang="ts" setup>
import { getColorByPrice, scBadgeByPrice } from '~/utils'

interface Props {
  width: number
  battery: number
  userName: string
  userRole: string
  scContent: string
  showTrans: boolean
  transContent: string
  isVip: boolean
}

const props = defineProps<Props>()

const scColor = ref<{ info: string; content: string }>({ info: '', content: '' })

const faceBase64 = ref<string>(
  'data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAABQBwCdASooACgAPpE2l0gloqIhMdM9+LASCWkA0B2oJRzaerG1y/CiQon5hkroB/ojjG+3W2sidrms3QzlYpC5r/+AAP78d0Ii9cI0gLlmaXHYTxpHE9Gxb/XaWJ8amCgRRcYbm28+2UixrqWu4Of9gcasQPHrbDHcTHhFzX2rUiah/rafZzMplvieT3bEwON0P3t35YVzSXCCO25vjTIMITJtMK+46CZOyQ4NxNARpCNhexBGPgFIQAA='
)
// https://i0.hdslb.com/bfs/face/member/noface.jpg@30w_30h.webp
let faceFrame = ''

defineExpose({
  faceBase64,
})

watchEffect(() => {
  scColor.value = getColorByPrice(props.battery)
})
watchEffect(() => {
  faceFrame = new URL(`../assets/images/face-frame-${props.userRole}.png`, import.meta.url).href
})
</script>

<template>
  <div id="SuperChatM" class="relative min-h-88px m-y-10px" :style="{ width: `${props.width}px` }">
    <div
      class="h-50px box-border flex justify-start items-center sc_card_head"
      bg="contain no-repeat right-top"
      p="y-8px x-10px"
      border="1px solid rd-t-6px"
    >
      <div>
        <div
          class="w40px h40px b-rd-17px"
          bg="cover center-center no-repeat"
          :style="{ backgroundImage: `url(${faceBase64})` }"
        ></div>
        <div
          class="w42px h42px b-rd-17px absolute"
          pos="top-4px left-10px"
          bg="cover center-center no-repeat"
          :style="{ backgroundImage: `url(${faceFrame})` }"
        ></div>
      </div>
      <div class="w-full text-#333" m="t-2px r-0 b-0 l-6px" flex="~ col">
        <div class="op-78 text-12px" :style="{ color: isVip ? '#f9708e' : '#333' }">
          {{ props.userName }}
        </div>
        <div class="flex justify-start items-baseline" flex="~ ">
          <div class="lh-16px mt-2px text-14px">{{ props.battery }} 电池</div>
        </div>
      </div>
    </div>
    <!-- sc bottom start -->
    <div
      class="relative box-border min-h-38px"
      p="y-8px x-10px"
      border="rd-t-2px rd-b-6px"
      :style="{ backgroundColor: scColor.content }"
    >
      <div class="relative min-h-12px break-words">
        <span class="lh-20px" text="12px white left">{{ props.scContent }}</span>
      </div>
      <div
        v-show="props.showTrans"
        class="relative min-h-12px break-words mt-6px p-t-6px input-trans-contain"
      >
        <span class="lh-20px" text="12px white left">{{ props.transContent }}</span>
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
  /* background-position: 130% center; */
}
.input-trans-contain {
  border-top: 1px solid rgba(245, 245, 245, 0.33);
}
</style>
