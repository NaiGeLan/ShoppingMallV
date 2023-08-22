<template>
  <div style="position: relative">
    <div
      v-if="type === '2'"
      class="verify-img-out"
      :style="{ height: parseInt(setSize.imgHeight) + vSpace + 'px' }"
    >
      <div
        class="verify-img-panel"
        :style="{ width: setSize.imgWidth, height: setSize.imgHeight }"
      >
        <img
          :src="backImgUrl"
          alt=""
          style="width: 100%; height: 100%; display: block"
        />
        <div v-show="showRefresh" class="verify-refresh" @click="refresh">
          <i class="iconfont icon-refresh"></i>
        </div>
        <transition name="tips">
          <span
            v-if="tipWords"
            class="verify-tips"
            :class="passFlag ? 'suc-bg' : 'err-bg'"
            >{{ tipWords }}</span
          >
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :style="{
        width: setSize.imgWidth,
        height: barSize.height,
        'line-height': barSize.height,
      }"
    >
      <span class="verify-msg" v-text="text"></span>
      <div
        class="verify-left-bar"
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          height: barSize.height,
          'border-color': leftBarBorderColor,
          transition: transitionWidth,
        }"
      >
        <span class="verify-msg" v-text="finishText"></span>
        <div
          class="verify-move-block"
          :style="{
            width: barSize.height,
            height: barSize.height,
            'background-color': moveBlockBackgroundColor,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <i
            :class="['verify-icon iconfont', iconClass]"
            :style="{ color: iconColor }"
          ></i>
          <div
            v-if="type === '2'"
            class="verify-sub-block"
            :style="{
              width: Math.floor((parseInt(setSize.imgWidth) * 47) / 310) + 'px',
              height: setSize.imgHeight,
              top: '-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
              'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
            }"
          >
            <img
              :src="blockBackImgUrl"
              alt=""
              style="width: 100%; height: 100%; display: block"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { aesEncrypt } from "./../utils/ase";
import { resetSize } from "./../utils/util";
import { reqGet, reqCheck } from "./../api/index";

const secretKey = ref(""); // 后端返回的加密秘钥 字段
const passFlag = ref(""); // 是否通过的标识
const backImgBase = ref(""); // 验证码背景图片
const blockBackImgBase = ref(""); // 验证滑块的背景图片
const backToken = ref(""); // 后端返回的唯一token值
const startMoveTime = ref(""); // 移动开始的时间
const endMovetime = ref(""); // 移动结束的时间
const tipsBackColor = ref(""); // 提示词的背景颜色
const tipWords = ref("");
const text = ref("");
const finishText = ref("");
const setSize = ref({
  imgHeight: 0,
  imgWidth: 0,
  barHeight: 0,
  barWidth: 0,
});
const top = ref(0);
const left = ref(0);
const moveBlockLeft = ref(undefined);
const leftBarWidth = ref(undefined);
const moveBlockBackgroundColor = ref(undefined); // 移动中样式
const leftBarBorderColor = ref("#ddd");
const iconColor = ref(undefined);
const iconClass = ref("icon-right");
const status = ref(false); // 鼠标状态
const isEnd = ref(false); // 是否验证完成
const showRefresh = ref(true);
const transitionLeft = ref("");
const transitionWidth = ref("");

// Compute the URLs for the background and block images
const backImgUrl = ref(
  backImgBase.value ? `data:image/png;base64,${backImgBase.value}` : defaultImg
);
const blockBackImgUrl = ref(`data:image/png;base64,${blockBackImgBase.value}`);

// Watch the 'type' prop for changes
onMounted(() => {
  init();
});

// Event listeners for touch and mouse events
onMounted(() => {
  window.addEventListener("touchmove", move);
  window.addEventListener("mousemove", move);
  window.addEventListener("touchend", end);
  window.addEventListener("mouseup", end);
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  window.removeEventListener("touchmove", move);
  window.removeEventListener("mousemove", move);
  window.removeEventListener("touchend", end);
  window.removeEventListener("mouseup", end);
});

// Initialize the component
const init = () => {
  text.value = explain;
  getPictrue();
  setSize.value = resetSize();
  // Emit 'ready' event
  emit("ready", this);
};

// Handle the slider movement start
const start = (e) => {
  e = e || window.event;
  const x = e.touches ? e.touches[0].pageX : e.clientX;
  startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left);
  startMoveTime.value = +new Date();
  if (!isEnd.value) {
    text.value = "";
    moveBlockBackgroundColor.value = "#337ab7";
    leftBarBorderColor.value = "#337AB7";
    iconColor.value = "#fff";
    e.stopPropagation();
    status.value = true;
  }
};

// Handle the slider movement
const move = (e) => {
  e = e || window.event;
  if (status.value && !isEnd.value) {
    const x = e.touches ? e.touches[0].pageX : e.clientX;
    const bar_area_left = barArea.value.getBoundingClientRect().left;
    let move_block_left = x - bar_area_left;
    if (
      move_block_left >=
      barArea.offsetWidth - parseInt(parseInt(blockSize.width) / 2) - 2
    ) {
      move_block_left =
        barArea.offsetWidth - parseInt(parseInt(blockSize.width) / 2) - 2;
    }
    if (move_block_left <= 0) {
      move_block_left = parseInt(parseInt(blockSize.width) / 2);
    }
    moveBlockLeft.value = `${move_block_left - startLeft.value}px`;
    leftBarWidth.value = `${move_block_left - startLeft.value}px`;
  }
};

// Handle the slider movement end
const end = () => {
  endMovetime.value = +new Date();
  // Handle the slider movement end
  if (status.value && !isEnd.value) {
    const moveLeftDistance = parseInt(
      (moveBlockLeft.value || "").replace("px", "")
    );
    const moveLeftDistanceScaled =
      (moveLeftDistance * 310) / parseInt(setSize.value.imgWidth);
    const data = {
      captchaType: captchaType.value,
      pointJson: secretKey.value
        ? aesEncrypt(
            JSON.stringify({ x: moveLeftDistanceScaled, y: 5.0 }),
            secretKey.value
          )
        : JSON.stringify({ x: moveLeftDistanceScaled, y: 5.0 }),
      token: backToken.value,
    };

    reqCheck(data).then((res) => {
      res = res.data;

      if (res.repCode === "0000") {
        moveBlockBackgroundColor.value = "#5cb85c";
        leftBarBorderColor.value = "#5cb85c";
        iconColor.value = "#fff";
        iconClass.value = "icon-check";
        showRefresh.value = false;
        isEnd.value = true;

        if (mode.value === "pop") {
          setTimeout(() => {
            emit("update:clickShow", false);
            refresh();
          }, 1500);
        }

        passFlag.value = true;
        tipWords.value = `${(
          (endMovetime.value - startMoveTime.value) /
          1000
        ).toFixed(2)}s验证成功`;
        const captchaVerification = secretKey.value
          ? aesEncrypt(
              backToken.value +
                "---" +
                JSON.stringify({ x: moveLeftDistanceScaled, y: 5.0 }),
              secretKey.value
            )
          : backToken.value +
            "---" +
            JSON.stringify({ x: moveLeftDistanceScaled, y: 5.0 });

        setTimeout(() => {
          tipWords.value = "";
          emit("closeBox");
          emit("success", { captchaVerification });
        }, 1000);
      } else {
        moveBlockBackgroundColor.value = "#d9534f";
        leftBarBorderColor.value = "#d9534f";
        iconColor.value = "#fff";
        iconClass.value = "icon-close";
        passFlag.value = false;

        setTimeout(() => {
          refresh();
        }, 1000);

        emit("error", this);
        tipWords.value = "验证失败";

        setTimeout(() => {
          tipWords.value = "";
        }, 1000);
      }
    });

    status.value = false;
  }
};

// Refresh the verification
const refresh = () => {
  showRefresh.value = true;
  finishText.value = "";

  transitionLeft.value = "left .3s";
  moveBlockLeft.value = 0;

  leftBarWidth.value = undefined;
  transitionWidth.value = "width .3s";

  leftBarBorderColor.value = "#ddd";
  moveBlockBackgroundColor.value = "#fff";
  iconColor.value = "#000";
  iconClass.value = "icon-right";
  isEnd.value = false;

  getPictrue();
  setTimeout(() => {
    transitionWidth.value = "";
    transitionLeft.value = "";
    text.value = explain;
  }, 300);
};

// Request background images and verification images
const getPictrue = () => {
  const data = {
    captchaType: captchaType.value,
    clientUid: localStorage.getItem("slider"),
    ts: Date.now(),
  };

  reqGet(data).then((res) => {
    if (res.data.repCode === "0000") {
      backImgBase.value = res.data.repData.originalImageBase64;
      blockBackImgBase.value = res.data.repData.jigsawImageBase64;
      backToken.value = res.data.repData.token;
      secretKey.value = res.data.repData.secretKey;
      backImgUrl.value = backImgBase.value
        ? `data:image/png;base64,${backImgBase.value}`
        : defaultImg;
      blockBackImgUrl.value = `data:image/png;base64,${blockBackImgBase.value}`;
    } else {
      tipWords.value = res.data.repMsg;
    }

    // Check if the interface request times out
    if (res.data.repCode === "6201") {
      backImgBase.value = null;
      blockBackImgBase.value = null;
    }
  });
};
</script>
