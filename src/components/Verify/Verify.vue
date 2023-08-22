<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import VerifySlide from "./VerifyComponents/VerifySlide";
import VerifyPoints from "./VerifyComponents/VerifyPoints";

const captchaType = ref("");
const verifyType = ref("");
const componentType = ref("");
const clickShow = ref(false);

const explain = ref("向右滑动完成验证");
const locale = ref("");
const figure = ref(0);
const arith = ref(0);
const mode = ref("pop");
const vSpace = ref(0);
const imgSize = ref({
  width: "310px",
  height: "155px",
});
const blockSize = ref({});
const barSize = ref({});

const instance = ref({});

const showBox = computed(() => {
  return mode.value === "pop" ? clickShow.value : true;
});

onMounted(() => {
  uuid();
});

const uuid = () => {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  const slider = "slider" + "-" + s.join("");
  const point = "point" + "-" + s.join("");
  if (!localStorage.getItem("slider")) {
    localStorage.setItem("slider", slider);
  }
  if (!localStorage.getItem("point")) {
    localStorage.setItem("point", point);
  }
};

const refresh = () => {
  if (instance.value.refresh) {
    instance.value.refresh();
  }
};

const closeBox = () => {
  clickShow.value = false;
  refresh();
};

const show = () => {
  if (mode.value === "pop") {
    clickShow.value = true;
  }
};

const handleCaptchaTypeChange = (newCaptchaType) => {
  captchaType.value = newCaptchaType;
  switch (captchaType.value.toString()) {
    case "blockPuzzle":
      verifyType.value = "2";
      componentType.value = "VerifySlide";
      break;
    case "clickWord":
      verifyType.value = "";
      componentType.value = "VerifyPoints";
      break;
  }
};

watch(
  captchaType,
  (newCaptchaType) => {
    switch (newCaptchaType.toString()) {
      case "blockPuzzle":
        verifyType.value = "2";
        componentType.value = "VerifySlide";
        break;
      case "clickWord":
        verifyType.value = "";
        componentType.value = "VerifyPoints";
        break;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-show="showBox" :class="mode == 'pop' ? 'verify-mask' : ''">
    <div
      :class="mode == 'pop' ? 'verifybox' : ''"
      :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }"
    >
      <div v-if="mode == 'pop'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div
        class="verifybox-bottom"
        :style="{ padding: mode == 'pop' ? '15px' : '0' }"
      >
        <!-- 验证码容器 -->
        <components
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
          :default-img="defaultImg"
        />
      </div>
    </div>
  </div>
</template>
