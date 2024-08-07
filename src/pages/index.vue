<script setup lang="ts">
import type SuperChatM from '~/components/SuperChatM.vue'
import { userRoleDict, exportPngFile } from '~/utils'
import type { FormInst, DropdownOption } from 'naive-ui'

const formRef = ref<FormInst | null>(null)
const formValue = ref<ConfigOption>({
  width: 269,
  battery: 300,
  userName: '归墟_丶',
  userRole: '3',
  scContent: '点歌 月牙湾',
  showTrans: false,
  transContent: '',
  showFansMedal: true,
  medalName: '苑大头',
  medalLevel: 27,
  uid: '23598218',
  isVip: true,
  guardMileStone: '0',
})

const message = useMessage()

let timer = ref(0)
let interval: any = null

const startCountdown = () => {
  isLoading.value = true
  timer.value = 5
  setInterval(() => {
    if (timer.value === 0) {
      clearInterval(interval)
      isLoading.value = false
    } else {
      timer.value--
    }
  }, 1000)
}

const superChatMComp = ref<InstanceType<typeof SuperChatM>>()

// 图片被设置防盗链，因此转为base64
let isLoading = ref<boolean>(false)

const setAvatar = async () => {
  // isLoading.value = true

  /* const { data, isFetching } = await useFetch(
    `https://api.obfs.dev/api/bilibili/v3/user_info?uid=${formValue.value.uid}`
  )
    .get()
    .json()
  isLoading.value = isFetching.value
  if (data.value.message === '0') {
    superChatMComp.value!.face = data.value.data.card.face
  } else {
    message.error('请求失败' + data.value.message)
  } */
  superChatMComp.value!.face = `https://workers.vrp.moe/api/bilibili/avatar/${formValue.value.uid}`
  startCountdown()
}

/* const setBase64Avatar = async () => {
  isLoading.value = true

  const { data } = await useFetch(
    `https://api.obfs.dev/api/bilibili/v3/user_info?uid=${formValue.value.uid}`
  )
    .get()
    .json()
  if (data.value.message === '0') {
    const base64 = (await getBase64FromUrl(data.value.data.card.face)) as string
    superChatMComp.value!.face = base64
  } else {
    message.error('请求失败')
  }
  isLoading.value = false
  startCountdown()
} */

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)

function reBytesStr(str: string, len: number) {
  if (!str || str == undefined) return ''
  let num = 0
  let result = ''
  for (let i = 0; i < str.length; i++) {
    num += str.charCodeAt(i) > 255 ? 2 : 1
    if (num > len) {
      break
    } else {
      result = str.substring(0, i + 1)
    }
  }
  return result
}

const cutFansMedalName = () => {
  formValue.value.medalName = reBytesStr(formValue.value.medalName!, 6)
}

const dropDownMenu = ref<DropdownOption[]>([
  {
    label: '8x放大',
    key: 8,
  },
  {
    label: '4x放大',
    key: 4,
  },
  {
    label: '2x放大',
    key: 2,
  },
  {
    label: '默认大小',
    key: 1,
  },
])

const handleDropDownSelect = (key: number, domid: string) => {
  exportPngFile(domid, key)
}

const guardRadioOpt = ref([
  {
    label: '其他',
    value: '0',
  },
  {
    label: '千舰',
    value: 'k',
  },
  {
    label: '万舰',
    value: 'w',
  },
])
</script>

<template>
  <NLayout>
    <NLayoutHeader>
      <Header></Header>
    </NLayoutHeader>
    <NLayoutContent embedded>
      <div class="container h-full m-x-auto app_main_container">
        <!-- <NAlert type="warning" title="提醒改标题小助手" closable>
          即将六月初，直播间标题以及个人头像、ID、签名等信息的修改将被暂时禁止，请及时提醒自家主播修改好相关信息
        </NAlert> -->
        <NCard>
          <NH3 prefix="bar" type="info">
            <NText type="info"> 效果预览 </NText>
          </NH3>
          <NH5>
            <NText type="primary"> 样式1 </NText>
          </NH5>
          <SuperChat
            ref="superChatComp"
            :width="formValue.width"
            :battery="formValue.battery"
            :userName="formValue.userName"
            :userRole="formValue.userRole"
            :scContent="formValue.scContent"
            :showTrans="formValue.showTrans"
            :transContent="formValue.transContent"
            :showFansMedal="formValue.showFansMedal"
            :medalName="formValue.medalName"
            :medalLevel="formValue.medalLevel"
            :guardMileStone="formValue.guardMileStone"
          ></SuperChat>
          <NDropdown
            trigger="click"
            :options="dropDownMenu"
            @select="$event => handleDropDownSelect($event, 'SuperChat')"
          >
            <NButton class="m-y-10px" type="info">导出为png</NButton>
          </NDropdown>

          <NH5>
            <NText type="primary"> 样式2 </NText>
          </NH5>
          <SuperChatM
            ref="superChatMComp"
            :width="formValue.width"
            :battery="formValue.battery"
            :userName="formValue.userName"
            :userRole="formValue.userRole"
            :scContent="formValue.scContent"
            :showTrans="formValue.showTrans"
            :transContent="formValue.transContent"
            :isVip="formValue.isVip"
            :guardMileStone="formValue.guardMileStone"
          ></SuperChatM>
          <NDropdown
            trigger="click"
            :options="dropDownMenu"
            @select="$event => handleDropDownSelect($event, 'SuperChatM')"
          >
            <NButton class="m-y-10px" type="info">导出为png</NButton>
          </NDropdown>
        </NCard>
        <NCard>
          <NForm ref="formRef" :model="formValue" labelPlacement="left" labelWidth="auto">
            <NH3 prefix="bar" type="info">
              <NText type="info"> 通用设置 </NText>
            </NH3>

            <NFormItem label="宽度">
              <NSlider v-model:value="formValue.width" :min="269" :max="700"></NSlider>
            </NFormItem>
            <NGrid :cols="3" xGap="20" yGap="20">
              <NFormItemGi label="昵称">
                <NInput v-model:value="formValue.userName" placeholder="输入用户昵称"></NInput>
              </NFormItemGi>
              <NFormItemGi label="电池数">
                <NInputNumber
                  v-model:value="formValue.battery"
                  placeholder="SC电池数，最小300"
                  :min="300"
                  :max="9999999"
                  :step="100"
                ></NInputNumber>
              </NFormItemGi>
              <NFormItemGi label="SC内容">
                <NInput
                  v-model:value="formValue.scContent"
                  placeholder="输入SC内容"
                  type="textarea"
                  class="min-w-50%"
                  :autosize="{ minRows: 1 }"
                ></NInput>
              </NFormItemGi>
              <NFormItemGi label="用户身份">
                <NSelect v-model:value="formValue.userRole" :options="userRoleDict"></NSelect>
              </NFormItemGi>
              <NFormItemGi label="显示翻译">
                <NSwitch v-model:value="formValue.showTrans"></NSwitch>
              </NFormItemGi>
              <!-- 本来此处应该使用 v-show 但这样会触发 naive-ui grid 布局的一个bug，显示以后无法隐藏且控制台报错 -->
              <NFormItemGi v-if="formValue.showTrans" label="翻译内容">
                <NInput
                  v-model:value="formValue.transContent"
                  placeholder="输入翻译内容"
                  type="textarea"
                  class="min-w-50%"
                  :autosize="{ minRows: 1 }"
                ></NInput>
              </NFormItemGi>
              <!-- <NFormItemGi label="千舰图标">
                <NSwitch v-model:value="formValue.isThousandsGuard"></NSwitch>
              </NFormItemGi>
              <NFormItemGi label="万舰头像框">
                <NSwitch v-model:value="formValue.overTenKGuard"></NSwitch>
              </NFormItemGi> -->
              <NFormItemGi label="舰队里程碑">
                <NRadioGroup v-model:value="formValue.guardMileStone">
                  <NRadio v-for="item in guardRadioOpt" :key="item.value" :value="item.value">{{
                    item.label
                  }}</NRadio>
                </NRadioGroup>
              </NFormItemGi>
            </NGrid>

            <NH3 prefix="bar" type="info">
              <NText type="info"> 样式1 </NText>
            </NH3>
            <NFormItem label="显示粉丝牌">
              <NSwitch v-model:value="formValue.showFansMedal"></NSwitch>
            </NFormItem>
            <NGrid v-if="formValue.showFansMedal" :cols="3" xGap="20" yGap="20">
              <NFormItemGi label="粉丝牌名称">
                <NInput
                  v-model:value="formValue.medalName"
                  placeholder="输入粉丝牌名称"
                  @blur="cutFansMedalName"
                ></NInput>
              </NFormItemGi>
              <NFormItemGi label="粉丝牌等级">
                <NInputNumber
                  v-model:value="formValue.medalLevel"
                  placeholder="粉丝牌等级，只能输入正整数"
                  :min="1"
                  :max="40"
                ></NInputNumber>
              </NFormItemGi>
            </NGrid>

            <NH3 prefix="bar" type="info">
              <NText type="info"> 样式2 </NText>
            </NH3>
            <NGrid :cols="3" xGap="20" yGap="20">
              <NFormItemGi label="用户uid">
                <NInput
                  v-model:value="formValue.uid"
                  placeholder="输入uid"
                  :allowInput="onlyAllowNumber"
                ></NInput>
                <NButton
                  class="m-x-10px"
                  type="info"
                  :loading="isLoading"
                  :disabled="timer !== 0"
                  @click="setAvatar"
                  >获取头像{{ timer === 0 ? '' : timer }}</NButton
                >
              </NFormItemGi>
              <NFormItemGi label="是否大会员">
                <NSwitch v-model:value="formValue.isVip"></NSwitch>
              </NFormItemGi>
            </NGrid>
          </NForm>
        </NCard>
        <NCard>
          <NH3 prefix="bar" type="info">
            <NText type="info"> 关于 </NText>
          </NH3>
          <p text="20px">
            作者的bilibili:
            <NA class="no-underline" href="https://space.bilibili.com/23598218" target="_blank"
              >归墟_丶</NA
            >
          </p>
          <p text="20px">Inspired by</p>
          <ul text="16px">
            <li><NA href="https://www.bilibili.com/video/BV1AY41197ih">BV1AY41197ih</NA></li>
            <li><NA href="https://github.com/Hicircum/SC-Generator/">Circumcenter的在线版</NA></li>
          </ul>
          <p text="16px">十分感谢以上 项目 / 视频 提供的灵感，此项目是对以上项目的一些完善</p>
          <p>2024 - 07 - 12</p>
          <p>
            感谢
            <NA href="https://subspace.institute/docs/open-platform/bilibili-avatar"
              >Laplace 开放平台</NA
            >
            提供的新头像接口
          </p>
        </NCard>
        <NCard>
          <NH3 prefix="bar" type="info">
            <NText type="info"> 免责声明 </NText>
          </NH3>

          <ul text="16px">
            <li>
              此项目只为有需要的人员进行方便快捷的制作 SC
              图片，请勿用于无中生有甚至造谣主播、人身攻击
            </li>
            <li>任何因此项目生成的图片所产生的的造谣、虚假事实等，开发者概不负责</li>
            <li>本项目生成的图片一律不能作为证据</li>
          </ul>
        </NCard>
      </div>
    </NLayoutContent>
    <NLayoutFooter></NLayoutFooter>
  </NLayout>
</template>

<style>
.app_main_container {
  background-color: var(--n-color);
}

.n-card {
  margin: 10px 0;
}
</style>
