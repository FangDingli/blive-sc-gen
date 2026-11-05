# blive-sc-gen · B站直播 SC 图片生成器

还原 B 站直播间 SuperChat 卡片样式，导出高清 PNG，供直播切片使用 —— 不需要在视频源里截图。

基于 Vue 3.5 + Vite + TypeScript + Tailwind CSS v4 + shadcn-vue 构建。

## 使用

```bash
npm install
npm run dev        # 开发
npm run build      # 构建产物到 dist/
npm run typecheck  # 类型检查（vue-tsc）
npm run typecheck:fast  # 纯 TS 快速检查（tsrs，原生 TS 7 checker）
```

### 功能

- **样式1**：弹幕历史里的 SC 卡片（粉丝牌 + 昵称 + 电池数 + 消息 + 右下角角标）
- **样式2**：点开详情后的 SC 卡片（头像 + 头像框 + 昵称 + 电池数）
- 粉丝牌支持 **1~60 级配色**（实测色表）、**大航海变体**、**失效样式**
- 舰长/提督/总督 × 普通/百舰/千舰/万舰 的徽章与头像框
- SC 价格自动映射 6 档配色与右下角角标（500 / 1314 / 3000 / 10000 专属图 + 大额徽章）
- 大会员昵称粉色、舰长体系昵称配色
- 导出倍率 1x / 2x / 4x / 8x，导出引擎可选
- **配置自动保存**：所有填写内容（含头像）自动存入 localStorage，刷新/关闭后再进不丢失

## 头像获取（重要，含坑点说明）

样式2 需要头像。三种方式：

1. **上传头像文件**（100% 可靠）：转 base64，导出必定带头像。
2. **粘贴头像直链**（可靠）：见下方「手动获取头像直链」；B 站图床直链允许跨域，会自动转为 base64，导出必定带头像。
3. **uid 获取**（仅预览）：填写 uid 点「获取头像」。

> ⚠️ **uid 获取的头像仅用于预览，导出的图片不会包含头像。**
> 页面上也有醒目提示，输入框旁的徽章会标明当前头像「导出可用」还是「仅预览」。

### 为什么 uid 获取的头像导不出来

B 站 CDN 的头像图片本身允许跨域（`Access-Control-Allow-Origin: *`），
但「uid → 头像」的第三方代理（`workers.vrp.moe`）是 **307 重定向**到真实图片，
而它的 307 响应**不带 CORS 头**。浏览器在 CORS 模式下要求重定向链上每一跳都通过检查：

- 普通 `<img>` 展示不检查 CORS → 预览正常
- 导出时（modern-screenshot / html2canvas）图片会以 `crossorigin` 重新加载 → 重定向那一跳直接失败
- **最终表现：预览有头像，导出的图永远缺头像，且无解**

### 第二个坑：B 站图床的 Referer 防盗链

B 站图床（`i*.hdslb.com`）对带**外站 Referer** 的请求返回 403（不带或带 bilibili.com
Referer 均为 200）。页面里的 `<img>` / CSS background-image / fetch 都会自动带上
本站 Referer，导致图床图片全部加载失败——与代理无关。
`index.html` 中的 `<meta name="referrer" content="no-referrer">` 让全站请求不带
Referer，一举解决预览、导出、直链转 base64 三个场景。

理论上自建一个服务端解析并直接返回图片字节的 Cloudflare Worker 可以解决，
但那要求使用者会部署 Cloudflare——这不是本工具的目标用户具备的条件，
因此 v2 直接把 uid 获取定位为「仅预览」，导出带头像走直链/上传两条路。

### 手动获取头像直链的方法

打开主播的 B 站动态页，鼠标悬停在任意一条动态的头像上，会弹出资料卡；
在资料卡的头像上点击右键，选择「**复制图片链接**」，粘贴到「头像直链」输入框即可。

> 本站已在 `index.html` 中声明 `<meta name="referrer" content="no-referrer">`，
> 页面发出的所有请求不带 Referer，可以正常加载 B 站图床图片。若你把本项目的
> 页面代码嵌入其他站点，务必保留这行 meta，否则 B 站图床会对带外站 Referer
> 的请求返回 403（防盗链）。

## 技术说明 / 已知取舍

- **粉丝牌色表**来自 2026-06 实测记录（1~60 级，普通/大航海两列）。部分等级无采样
  （如普通牌 41 级起），按相邻区间与同区间大航海色处理；41~50 级与 52 级以上的
  普通牌配色未实测，如与线上有出入欢迎提 issue 补充采样。
- **等级数字字体**：B 站线上使用私有 `fonteditor` 字体，无法合法获取，此处用系统
  粗体近似，数字形状略有差异。
- **图片资产全部本地化**：舰队徽章、头像框、角标共 20+ 张图已从 B 站 CDN 下载进
  `src/assets/`，避免 CDN 路径变更/防盗链/CORS 导致的导出残缺。
- **导出引擎**：默认 modern-screenshot（SVG 包裹路线，对伪元素与字体还原更好）；
  备选 html2canvas-pro（html2canvas 社区 fork，支持 Tailwind v4 的 `oklch` 颜色函数，
  原版 html2canvas 会因 oklch 解析失败导出空白）。遇到某个引擎效果不佳时切换重试即可。
- **TypeScript 工具链**：vue-tsc 目前只能工作在 TS 6.x（TS 7 原生编译器不再暴露
  JS API，`typescript/lib/tsc` 入口已移除），因此 `typescript` 钉在 ~6.0.3；
  `typecheck:fast` 使用社区原生方案 [tsrs](https://github.com/oxc-project/tsrs)
  作为补充，二者互为印证。

## 目录结构

```
src/
  assets/          # 全部图片资产（已本地化）
  components/sc/   # 还原层：与 B 站 DOM 结构 1:1 对应，不含业务判断
    FansMedal.vue      # 粉丝牌（含 ::after 0.5px 描边技巧）
    ScCardHistory.vue  # 样式1 · 弹幕历史卡片
    ScCardDetail.vue   # 样式2 · 详情卡片
  components/ui/   # shadcn-vue 生成的基础组件
  composables/     # useScConfig 全局配置 / useAvatar 头像获取
  lib/             # 纯函数层：粉丝牌色表、SC 配色、角色映射、导出
```

B 站再改 UI 时只需要动 `components/sc/`；改色表/价格档只需要动 `lib/`。

## 免责声明

- 此项目只为有需要的人员方便快捷地制作 SC 图片，请勿用于无中生有甚至造谣主播、人身攻击
- 任何因此项目生成的图片所产生的造谣、虚假事实等，开发者概不负责
- 本项目生成的图片一律不能作为证据

## 致谢

- [SC-Generator](https://github.com/Hicircum/SC-Generator/) 与相关视频提供的灵感
- [shadcn-vue](https://www.shadcn-vue.com/) / [reka-ui](https://reka-ui.com/)
- 作者：[归墟_丶](https://space.bilibili.com/23598218)

License · ISC
