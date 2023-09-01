<script setup lang="ts">
import { ref } from "vue";
import { getGroupInfoApi, groupApi } from "@/api/group";
import { treeDataTranslate } from "@/utils";
const emit = defineEmits(["refreshDataList"]);
const adornUrl = (actionName: any) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return import.meta.env.VITE_APP_BASE_API + actionName;
};
const dialogImageUrl = ref("");
const dataFormSubmit = async () => {
  // console.log(formRef.value);
  console.log(dataForm.value);
  const method = dataForm.value.id ? "put" : "post";
  const res = await groupApi(method, dataForm.value);
  console.log(res);
  if (res.success) {
    console.log("success");

    ElMessage({
      message: dataForm.value[0].propId ? "修改成功" : "新增成功",
      type: "success",
    });
    emit("refreshDataList");
  }
  // console.log(await formRef.value.validate());
};
const props = defineProps({
  groupId: {
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
});
const formRef = ref();
const groupIdProps = ref();
const dataForm = ref({
  id: null,
  title: null,
  shopId: null,
  status: 1,
  isDefault: null,
  prodCount: null,
  seq: null,
  style: 0,
});
const imageList = ref([]);

const categoryList = ref([]);
const selectedCategory = ref([]);
const categoryTreeProps = ref({
  value: "categoryId",
  label: "categoryName",
});
const getCategoryInfo = async () => {
  const res = await getGroupInfoApi(groupIdProps.value);
  console.log(res);
  console.log(dataForm.value);

  // dataForm.value.categoryId = res.data.categoryId;
  // dataForm.value.grade = res.data.grade;
  // dataForm.value.categoryName = res.data.categoryName;
  // dataForm.value.seq = res.data.seq;
  // dataForm.value.status = res.data.status;
  // dataForm.value.parentId = res.data.parentId;
  // dataForm.value.pic = res.data.pic;
  // dialogImageUrl.value = res.data.pic;
  imageList.value.push(res.data.pic);
  console.log(dataForm.value);
};
const isSubmit = ref(false);
const handleChange = (val) => {
  dataForm.value.parentId = val[val.length - 1];
};

onMounted(async () => {
  console.log(props);
  groupIdProps.value = props.groupId;

  if (props.title === "修改分类") await getCategoryInfo();

  // await getCategoryList();
});
</script>

<template>
  <el-dialog :title="props.title" :close-on-click-modal="false">
    <el-form
      ref="formRef"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          v-model="dataForm.categoryName"
          controls-position="right"
          :min="0"
          label="标签名称"
        />
      </el-form-item>

      <el-form-item label="排序" prop="seq">
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
          label="排序号"
        />
      </el-form-item>
      <el-form-item label="列表样式" size="mini" prop="status">
        <el-radio-group v-model="dataForm.style">
          <el-radio :label="0">一列一个</el-radio>
          <el-radio :label="1">一列两个</el-radio>
          <el-radio :label="2">一列三个</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button size="small" @click="visible = false">取消</el-button> -->
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
