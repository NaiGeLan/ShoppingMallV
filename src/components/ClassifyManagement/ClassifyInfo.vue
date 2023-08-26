<script setup lang="ts">
import { ref } from "vue";
import { getCategoryInfoApi, getListCategoryApi } from "@/api/category";
import { treeDataTranslate } from "@/utils";
const adornUrl = (actionName: any) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return import.meta.env.VITE_APP_BASE_API + actionName;
};
const dialogImageUrl = ref("");
const dataFormSubmit = async () => {
  console.log(formRef.value);

  console.log(await formRef.value.validate());
};
const props = defineProps({
  categoryId: {
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
});
const formRef = ref();
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
const imageList = ref([]);
const rules = reactive({
  categoryName: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
  ],
  parentCategory: [
    {
      required: false,
      message: "请输入上级名称",
      trigger: "change",
    },
  ],
  seq: [
    {
      required: true,
      message: "请输入排序号",
      trigger: "change",
    },
  ],
  status: [
    {
      required: true,
      message: "请选择状态",
      trigger: "change",
    },
  ],
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
  console.log(dataForm.value);

  dataForm.value.categoryId = res.data.categoryId;
  dataForm.value.grade = res.data.grade;
  dataForm.value.categoryName = res.data.categoryName;
  dataForm.value.seq = res.data.seq;
  dataForm.value.status = res.data.status;
  dataForm.value.parentId = res.data.parentId;
  dataForm.value.pic = res.data.pic;
  dialogImageUrl.value = res.data.pic;
  imageList.value.push(res.data.pic);
  console.log(dataForm.value);
};
const isSubmit = ref(false);
const handleChange = (val) => {
  dataForm.value.parentId = val[val.length - 1];
};
const getCategoryList = async () => {
  const res = await getListCategoryApi();
  console.log(res);
  categoryList.value = treeDataTranslate(res.data, "categoryId", "parentId");
};
onMounted(async () => {
  // JSON.parse(JSON.stringify(props));
  categoryIdProps.value = JSON.parse(JSON.stringify(props)).categoryId;
  console.log(props.title);
  if (props.title === "修改分类") await getCategoryInfo();

  await getCategoryList();
});
</script>

<template>
  <el-dialog :title="props.title" :close-on-click-modal="false">
    {{ props }}
    {{ dataForm }}
    <el-form
      ref="formRef"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
      :rules="rules"
    >
      <el-form-item v-if="dataForm.type !== 2" label="分类图片" prop="pic">
        <pic-upload v-model="dataForm.pic" />
        <el-upload
          :action="adornUrl('/admin/file/upload/element')"
          list-type="picture-card"
          :file-list="imageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
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
      <el-form-item label="上级分类" prop="parentCategory">
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
      <!-- <el-button size="small" @click="visible = false">取消</el-button> -->
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
