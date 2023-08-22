<script setup lang="ts">
import { ref } from "vue";
import { reqGet, reqCheck } from "@/api/verifition";
import { aesEncrypt } from "@/utils/ase";
const setSize = ref({
  imgHeight: 0,
  imgWidth: 0,
  barHeight: 0,
  barWidth: 0,
});
const barSize = ref({
  width: "310px",
  height: "40px",
});
const mode = ref("fixed");
const vSpace = ref(5);
const captchaType = ref("");
const defaultImg = ref("");
const barAreaColor = ref();
const barAreaBorderColor = ref();
const tempPoints = ref([]);
const showRefresh = ref(true);
const bindingClick = ref(true);
const pointBackImgBase = ref(); // 后端获取到的背景图片
const fontPos = ref([]); // 选中的坐标信息
const secretKey = ref(""); // 后端返回的ase加密秘钥
const checkNum = ref(3); // 默认需要点击的字数
const checkPosArr = ref([]); // 用户点击的坐标
const num = ref(1); // 点击的记数
const backToken = ref(""); // 后端返回的token值
const poinTextList = ref([]); // 后端返回的点击字体顺序
const text = ref();

const getMousePos = (e) => {
  var x = e.offsetX;
  var y = e.offsetY;
  return { x, y };
};
const createPoint = (pos) => {
  tempPoints.value.push(Object.assign({}, pos));
  return ++num.value;
};
const pointTransfrom = (pointArr, imgSize) => {
  let newPointArr = pointArr.map((p) => {
    const x = Math.round((310 * p.x) / parseInt(imgSize.imgWidth));
    const y = Math.round((155 * p.y) / parseInt(imgSize.imgHeight));
    return { x, y };
  });
  // console.log(newPointArr,"newPointArr");
  return newPointArr;
};
const getPictrue = () => {
  const data = {
    captchaType: captchaType.value,
    clientUid: localStorage.getItem("point"),
    ts: Date.now(), // 现在的时间戳
  };
  reqGet(data).then((res) => {
    if (res.repCode == "0000") {
      pointBackImgBase.value = res.repData.originalImageBase64;
      backToken.value = res.repData.token;
      secretKey.value = res.repData.secretKey;
      poinTextList.value = res.repData.wordList;
      text.value = "请依次点击【" + poinTextList.value.join(",") + "】";
    } else {
      text.value = res.repMsg;
    }

    // 判断接口请求次数是否失效
    if (res.repCode == "6201") {
      pointBackImgBase.value = null;
    }
  });
};
const refresh = () => {
  tempPoints.value.splice(0, tempPoints.value.length);
  barAreaColor.value = "#000";
  barAreaBorderColor.value = "#ddd";
  bindingClick.value = true;
  fontPos.value.splice(0, fontPos.value.length);
  checkPosArr.value.splice(0, checkPosArr.value.length);
  num.value = 1;
  getPictrue();
  text.value = "验证失败";
  showRefresh.value = true;
};

const canvasClick = (e) => {
  checkPosArr.value.push(getMousePos(e));
  if (num.value === checkNum.value) {
    num.value = createPoint(getMousePos(e));
    // 按比例转换坐标值
    checkPosArr.value = pointTransfrom(checkPosArr.value, setSize.value);
    // 等创建坐标执行完
    setTimeout(() => {
      // var flag = this.comparePos(this.fontPos, this.checkPosArr);
      // 发送后端请求
      var captchaVerification = secretKey.value
        ? aesEncrypt(
            backToken.value + "---" + JSON.stringify(checkPosArr.value),
            secretKey.value
          )
        : backToken.value + "---" + JSON.stringify(checkPosArr.value);
      const data = {
        captchaType: captchaType.value,
        pointJson: secretKey.value
          ? aesEncrypt(JSON.stringify(checkPosArr.value), secretKey.value)
          : JSON.stringify(checkPosArr.value),
        token: backToken.value,
      };
      reqCheck(data).then((res) => {
        if (res.repCode == "0000") {
          barAreaColor.value = "#4cae4c";
          barAreaBorderColor.value = "#5cb85c";
          text.value = "验证成功";
          bindingClick.value = false;
          if (mode.value == "pop") {
            setTimeout(() => {
              // this.$parent.clickShow = false;
              refresh();
            }, 1500);
          }
          // this.$parent.$emit("success", { captchaVerification });
        } else {
          // this.$parent.$emit("error", this);
          barAreaColor.value = "#d9534f";
          barAreaBorderColor.value = "#d9534f";
          text.value = "验证失败";
          setTimeout(() => {
            refresh();
          }, 700);
        }
      });
    }, 400);
  }
  if (num.value < checkNum.value) {
    num.value = createPoint(getMousePos(e));
  }
};
</script>

<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
          'margin-bottom': vSpace + 'px',
        }"
      >
        <div
          v-show="showRefresh"
          class="verify-refresh"
          style="z-index: 3"
          @click="refresh"
        >
          <i class="iconfont icon-refresh"></i>
        </div>
        <img
          ref="canvas"
          :src="
            pointBackImgBase
              ? 'data:image/png;base64,' + pointBackImgBase
              : defaultImg
          "
          alt=""
          style="width: 100%; height: 100%; display: block"
          @click="bindingClick ? canvasClick($event) : undefined"
        />

        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          class="point-area"
          :style="{
            'background-color': '#1abd6c',
            color: '#fff',
            'z-index': 9999,
            width: '20px',
            height: '20px',
            'text-align': 'center',
            'line-height': '20px',
            'border-radius': '50%',
            position: 'absolute',
            top: parseInt(tempPoint.y - 10) + 'px',
            left: parseInt(tempPoint.x - 10) + 'px',
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- 'height': this.barSize.height, -->
    <div
      class="verify-bar-area"
      :style="{
        width: setSize.imgWidth,
        color: barAreaColor,
        'border-color': barAreaBorderColor,
        'line-height': barSize.height,
      }"
    >
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
