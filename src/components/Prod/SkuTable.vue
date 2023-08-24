<script setup lang="ts">
import { ref, computed } from "vue";
import { getSpecListApi } from "@/api/prod";
const dbSpecs = ref([]);
const dbSpecValues = ref([]);
const specs = ref([]);
const initing = ref(false);
const props = defineProps({
  // value: {
  //   default: [],
  //   type: Array,
  // },
  prodName: {
    default: "",
  },
  skuList: {
    default: [],
    type: Array,
  },
});

const changeSkuStatus = (tagIndex) => {};
const getSpecList = async () => {
  console.log(JSON.parse(JSON.stringify(props)).skuList);
  console.log(111);

  const res = await getSpecListApi();
  console.log(res);
  dbSpecs.value = res.data;
};
const skuTags = computed(() => {
  return JSON.parse(JSON.stringify(props)).skuList;
});
const tableLeftTitles = computed(() => {
  console.log(skuTags.value);

  let res = [];
  // for (let i = 0; i <= skuTags.value.length; i++) {
  //   const skuTag = JSON.parse(JSON.stringify(props))[i];
  //   console.log(JSON.parse(JSON.stringify(props)));
  //   res.push(skuTag.tagName);
  // }
  return res;
});

// const tableLeftTitles = computed(() => {})
onMounted(async () => {
  await getSpecList();
});
</script>

<template>
  <!-- {{ props }} -->
  <div class="mod-prod-sku-table">
    <el-form-item>
      <el-table
        :data="props.skuList"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="(leftTitle, index) in tableLeftTitles"
          :key="index"
          :label="leftTitle"
        >
          <template #default="scope">
            {{ scope.row.properties.split(";")[index].split(":")[1] }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableLeftTitles.length"
          prop="pic"
          label="sku图片"
          width="180"
        >
          <template #default="scope">
            <pic-upload v-model="scope.row.pic" />
          </template>
        </el-table-column>
        <el-table-column
          prop="prodName"
          label="商品名称"
          width="250"
          v-if="tableLeftTitles.length"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.prodName"
              type="textarea"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售价" width="160">
          <template #default="scope">
            <el-input-number
              size="small"
              v-model="scope.row.price"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="oriPrice" label="市场价" width="160">
          <template #default="scope">
            <el-input-number
              size="small"
              v-model="scope.row.oriPrice"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="stocks" label="库存" width="160">
          <template #default="scope">
            <el-input-number
              size="small"
              :min="0"
              controls-position="right"
              v-model="scope.row.stocks"
              type="number"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="商品重量(kg)" width="210">
          <template #default="scope">
            <el-input-number
              :precision="2"
              :min="0"
              controls-position="right"
              v-model="scope.row.weight"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="volume" label="商品体积(m³)" width="210">
          <template #default="scope">
            <el-input-number
              :precision="2"
              :min="0"
              controls-position="right"
              v-model="scope.row.volume"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="changeSkuStatus(`${scope.$index}`)"
              v-if="scope.row.status"
              >禁用</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="changeSkuStatus(`${scope.$index}`)"
              v-else
              >启用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<style lang="scss">
.mod-prod-sku-table {
  .pic-uploader-component .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .pic {
      width: 120px;
      height: 120px;
      display: block;
    }
  }
  .pic-uploader-component .el-upload:hover {
    border-color: #409eff;
  }
}
</style>
