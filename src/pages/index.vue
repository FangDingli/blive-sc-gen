<script setup lang="ts">
import type SuperChatM from '~/components/SuperChatM.vue'
import { getBase64FromUrl, userRoleDict, dom2image } from '~/utils'
import type { FormInst } from 'naive-ui'

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
})

const message = useMessage()

let timer = ref(0)
let interval: any = null

const startCountdown = () => {
  timer.value = 5
  setInterval(() => {
    if (timer.value === 0) {
      clearInterval(interval)
    } else {
      timer.value--
    }
  }, 1000)
}

const superChatMComp = ref<InstanceType<typeof SuperChatM>>()

let isLoading = ref<boolean>(false)

const setBase64Avatar = async () => {
  isLoading.value = true

  const { data } = await useFetch(
    `https://api.obfs.dev/api/bilibili/v3/user_info?uid=${formValue.value.uid}`
  )
    .get()
    .json()
  if (data.value.message === '0') {
    const base64 = (await getBase64FromUrl(data.value.data.card.face)) as string
    superChatMComp.value!.faceBase64 = base64
  } else {
    message.error('请求失败')
  }
  isLoading.value = false
  startCountdown()
}

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
</script>

<template>
  <NLayout>
    <NLayoutHeader>
      <Header></Header>
    </NLayoutHeader>
    <NLayoutContent embedded>
      <div class="container h-full m-x-auto app_main_container">
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
          ></SuperChat>
          <NButton type="info" @click="dom2image('SuperChat')">导出为png</NButton>
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
          ></SuperChatM>
          <NButton type="info" @click="dom2image('SuperChatM')">导出为png</NButton>
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
              <NFormItemGi v-show="formValue.showTrans" label="翻译内容">
                <NInput
                  v-model:value="formValue.transContent"
                  placeholder="输入翻译内容"
                  type="textarea"
                  class="min-w-50%"
                  :autosize="{ minRows: 1 }"
                ></NInput>
              </NFormItemGi>
            </NGrid>

            <NH3 prefix="bar" type="info">
              <NText type="info"> 样式1 </NText>
            </NH3>
            <NFormItem label="显示粉丝牌">
              <NSwitch v-model:value="formValue.showFansMedal"></NSwitch>
            </NFormItem>
            <NGrid v-show="formValue.showFansMedal" :cols="3" xGap="20" yGap="20">
              <NFormItemGi label="粉丝牌名称">
                <NInput
                  v-model:value="formValue.medalName"
                  @blur="cutFansMedalName"
                  placeholder="输入粉丝牌名称"
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
                  @click="setBase64Avatar"
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
            <NA href="https://space.bilibili.com/23598218" target="_blank">归墟_丶</NA>
          </p>
          <p text="20px">Inspired by</p>
          <ul text="16px">
            <li><NA href="https://www.bilibili.com/video/BV1AY41197ih">BV1AY41197ih</NA></li>
            <li><NA href="https://github.com/Hicircum/SC-Generator/">Circumcenter的在线版</NA></li>
          </ul>
          <p text="16px">十分感谢以上 项目 / 视频 提供的灵感，此项目是对以上项目的一些完善</p>
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
