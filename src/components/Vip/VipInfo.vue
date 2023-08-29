<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getVipInfoApi, vipApi } from "@/api/vip";

import { ElMessage } from "element-plus";
const emit = defineEmits(["refreshDataList"]);

const dataFormSubmit = async () => {
  console.log(dataForm.value);
  const method = dataForm.value.userId ? "put" : "post";
  const res = await vipApi(dataForm.value, method);
  console.log(res);
  if (res.success) {
    console.log("success");

    ElMessage({
      message: "修改成功",
      type: "success",
    });
    emit("refreshDataList");
  }
};
const props = defineProps({
  userId: {
    type: String,
  },
});
const formRef = ref();
const userIdProps = ref();
const dataForm = ref({
  userId: 0,
  nickName: "",
  status: 1,
});

const getCategoryInfo = async () => {
  const res = await getVipInfoApi(userIdProps.value);
  console.log(res);
  console.log(dataForm.value);

  dataForm.value.userId = res.data.userId;
  dataForm.value.nickName = res.data.nickName;
  dataForm.value.status = res.data.status;
  console.log(dataForm.value);
};

onMounted(async () => {
  console.log(props);
  userIdProps.value = props.userId;
  await getCategoryInfo();

  // await getCategoryList();
});
</script>

<template>
  <el-dialog title="编辑用户" :close-on-click-modal="false">
    {{ props }}
    {{ dataForm }}
    <el-form
      ref="formRef"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="dataForm.nickName"
          :disabled="true"
          placeholder="用户昵称"
        />
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button size="small" @click="visible = false">取消</el-button> -->
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
