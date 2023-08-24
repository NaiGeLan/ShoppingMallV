<script setup lang="ts">
import { ref } from "vue";
import { getCategoryInfoApi } from "@/api/category";
const dataFormSubmit = async () => {};
const props = defineProps({
  categoryId: {
    type: String,
  },
});
const categoryIdProps = ref();
const dataForm = ref({
  categoryId: 0,
  currentId: 0,
  grade: 0,
  categoryName: "",
  seq: 1,
  status: 1,
  parentId: 0,
  pic: "",
});
const dataRule = ref({
  categoryName: [
    { required: true, message: "分类名称不能为空", trigger: "blur" },
    {
      pattern: /\s\S+|S+\s|\S/,
      message: "请输入正确的分类名称",
      trigger: "blur",
    },
  ],
  pic: [{ required: true, message: "分类图片不能为空", trigger: "blur" }],
});

const categoryList = ref([]);
const selectedCategory = ref([]);
const categoryTreeProps = ref({
  value: "categoryId",
  label: "categoryName",
});
const getCategoryInfo = async () => {
  const res = await getCategoryInfoApi(categoryIdProps.value);
  console.log(res);
  dataForm.value.categoryId = res.data.categoryId;
  dataForm.value.grade = res.data.grade;
  dataForm.value.categoryName = res.data.categoryName;
  dataForm.value.seq = res.data.seq;
  dataForm.value.status = res.data.status;
  dataForm.value.parentId = res.data.parentId;
  dataForm.value.pic = res.data.pic;
  console.log(dataForm.value);
};
const isSubmit = ref(false);
const handleChange = (val) => {
  dataForm.value.parentId = val[val.length - 1];
};
onMounted(async () => {
  JSON.parse(JSON.stringify(props));
  categoryIdProps.value = JSON.parse(JSON.stringify(props)).categoryId;
  console.log(JSON.parse(JSON.stringify(props)).categoryId);
  await getCategoryInfo();
});
</script>

<template>
  <!-- {{ dataForm }} -->
  <el-dialog :title="修改" :close-on-click-modal="false">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item v-if="dataForm.type !== 2" label="分类图片" prop="pic">
        <pic-upload v-model="dataForm.pic" />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="分类名称"
        prop="categoryName"
      >
        <el-input
          v-model="dataForm.categoryName"
          controls-position="right"
          :min="0"
          label="分类名称"
        />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          change-on-select
          :clearable="true"
          v-model="selectedCategory"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="seq">
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
          label="排序号"
        />
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">下线</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmit()"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>
