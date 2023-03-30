<script lang="ts" setup>
import { getMedalColorByLevel, medalBorderColor } from '../utils'

interface Props {
  userRole: UserRole
  medalName: string
  medalLevel: number
  guardMileStone: '0' | 'k' | 'w'
}

const props = defineProps<Props>()

let guardImg = ''

const medalColor = ref<{ start: string; end: string }>({ start: '', end: '' })

watchEffect(() => {
  medalColor.value = getMedalColorByLevel(props.medalLevel)
})
watchEffect(() => {
  guardImg = new URL(
    `../assets/images/guard-${props.userRole}-${
      props.guardMileStone === 'w' ? 'k' : props.guardMileStone
    }.png`,
    import.meta.url
  ).href
})
</script>

<template>
  <div
    class="mr-5px ml-6px relative v-middle inline-block lh-18px text-12px"
    title="这是 TA 的粉丝勋章 (●'◡'●)ﾉ♥"
  >
    <div
      class="relative block box-content h-14px lh-14px ws-nowrap font-yahei"
      border="1px solid transparent rd-2px"
      text="white 12px"
      :style="{ borderColor: userRole === '0' ? medalColor.start : medalBorderColor[userRole] }"
    >
      <div
        class="flex flex-center float-left box-content min-w-12px h-full lh-14px p-x-4px b-rd-l-1px"
        text="white 12px center ws-nowrap"
        :style="{ backgroundImage: `linear-gradient(45deg,${medalColor.start},${medalColor.end})` }"
      >
        <i
          v-show="props.userRole !== '0'"
          class="block -ml-12px mr-2px w22px h22px"
          bg="no-repeat contain center-center"
        >
          <img class="w-full h-full" :src="props.userRole === '0' ? '' : `${guardImg}`" alt="" />
        </i>
        <span class="block">{{ props.medalName }}</span>
      </div>
      <div
        class="block box-content h-full w16px bg-#fff float-left fans-medal-level"
        text="center transparent"
        :style="{ color: medalColor.start }"
      >
        {{ props.medalLevel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.fans-medal-level {
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
}
</style>
