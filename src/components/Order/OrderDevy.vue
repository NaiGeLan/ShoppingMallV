<script setup lang="ts">
import { getDeliverListApi, deliverListApi } from "@/api/order";

interface dvyNamesType {
  dvyId: string;
  dvyName: string;
}

const props = defineProps({
  orderId: { type: Number },
});

const emits = defineEmits(["refreshDataList"]);
const dvyNames = ref([]);
const dvyId = ref();
const dvyFlowId = ref();
const dataFormSubmit = async () => {
  const data = {
    orderNumber: props.orderId,
    dvyId: dvyId.value,
    dvyFlowId: dvyFlowId.value,
  };
  const res = await deliverListApi(data);
  if (res.success) {
    ElMessage({
      message: "发货成功",
      type: "success",
    });
  }
  emits("refreshDataList");
  console.log(res);
};

const getDeliveryList = async () => {
  const res = await getDeliverListApi();
  console.log(res);
  dvyNames.value = res.data;
  console.log(dvyNames.value);
};

onMounted(async () => {
  console.log(props);
  await getDeliveryList();
});
</script>

<template>
  <el-dialog :modal="false" title="选择发货地址" :close-on-click-modal="false">
    <el-form
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <!-- {{ dataForm.dvyNames }} -->
      <el-form-item label="快递公司">
        <el-select v-model="dvyId" placeholder="请选择">
          <el-option
            v-for="item in dvyNames"
            :key="item.dvyId"
            :label="item.dvyName"
            :value="item.dvyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号" prop="dvyFlowId">
        <el-input
          v-model="dvyFlowId"
          controls-position="right"
          :min="0"
          label="快递单号"
          placeholder="请输入快递单号"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
