<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { useTransition, TransitionPresets } from "@vueuse/core";
import { getVipsApi } from "@/api/vip";
import { getProdListApi } from "@/api/prod";
import { getOrderApi } from "@/api/order";
defineOptions({
  // eslint-disable-next-line
  name: "Dashboard",
  inheritAttrs: false,
});

const userStore = useUserStore();

const date: Date = new Date();

const greetings = computed(() => {
  const hours = date.getHours();
  if (hours >= 6 && hours < 8) {
    return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
  } else if (hours >= 8 && hours < 12) {
    return "上午好🌞！";
  } else if (hours >= 12 && hours < 18) {
    return "下午好☕！";
  } else if (hours >= 18 && hours < 24) {
    return "晚上好🌃！";
  } else if (hours >= 0 && hours < 6) {
    return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
  }
});

const duration = 5000;

onMounted(async () => {
  await getUserCount();
  await getProdCount();
  await getOrderCount();
});
const userCount = ref(0);
const getUserCount = async () => {
  const data = {
    current: 1,
    size: 10,
  };
  const res = await getVipsApi(data);
  console.log(res);
  userCount.value = res.data.total;
};

const prodCount = ref(0);
const getProdCount = async () => {
  const data = {
    current: 1,
    size: 10,
  };
  const res = await getProdListApi(data);
  prodCount.value = res.data.total;
};

// 订单数
const orderCount = ref(0);
const getOrderCount = async () => {
  const data = {
    current: 1,
    size: 10,
  };
  const res = await getOrderApi(data);
  orderCount.value = res.data.total;
};
</script>

<template>
  <div class="dashboard-container">
    <!-- github角标 -->
    <github-corner class="github-corner" />

    <!-- 用户信息 -->
    <el-row class="mb-8">
      <el-card class="w-full">
        <div class="flex justify-between flex-wrap">
          <div class="flex items-center">
            <img
              class="user-avatar"
              :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
            />
            <span class="ml-[10px] text-[16px]">
              {{ userStore.nickname }}
            </span>
          </div>

          <div class="leading-[40px]">
            {{ greetings }}
          </div>

          <div class="space-x-2 flex items-center justify-end">
            <el-divider direction="vertical" />
            <el-link
              target="_blank"
              type="primary"
              href="https://github.com/NaiGeLanF"
              >GitHub
            </el-link>
          </div>
        </div>
      </el-card>
    </el-row>

    <!-- 数据卡片 -->
    <el-row :gutter="40" class="mb-4">
      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div
            class="text-[#40c9c6] hover:!text-white hover:bg-[#40c9c6] p-3 rounded"
          >
            <svg-icon icon-class="uv" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">用户人数</div>
            <div class="text-lg text-right">
              {{ Math.round(userCount) }}
            </div>
          </div>
        </div>
      </el-col>

      <!--消息数-->
      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div
            class="text-[#36a3f7] hover:!text-white hover:bg-[#36a3f7] p-3 rounded"
          >
            <svg-icon icon-class="message" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">在线统计</div>
            <div class="text-lg text-right">
              {{ Math.round(userCount) }}
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div
            class="text-[#f4516c] hover:!text-white hover:bg-[#f4516c] p-3 rounded"
          >
            <svg-icon icon-class="money" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">商品数量</div>
            <div class="text-lg text-right">
              {{ Math.round(prodCount) }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="mb-2">
        <div class="data-box">
          <div
            class="text-[#34bfa3] hover:!text-white hover:bg-[#34bfa3] p-3 rounded"
          >
            <svg-icon icon-class="shopping" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">订单数</div>
            <div class="text-lg text-right">
              {{ Math.round(orderCount) }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Echarts 图表 -->
    <el-row :gutter="40">
      <!-- <el-col :sm="24" :lg="8" class="mb-4">
        <BarChart
          id="barChart"
          height="400px"
          width="100%"
          class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col> -->
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    border: 0;
  }

  .data-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  .svg-icon {
    fill: currentcolor !important;
  }
}
</style>
