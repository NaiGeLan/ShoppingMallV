<script setup lang="ts">
import SkuTag from "@/components/Prod/SkuTag.vue";
import SkuTable from "@/components/Prod/SkuTable.vue";
import ProdTransport from "@/components/Prod/ProdTransport.vue";
import MulPicUpload from "./mul-pic-upload.vue";
import { treeDataTranslate } from "@/utils/";
import {
  getProdListApi,
  getTagListApi,
  getListCategoryApi,
  getProdInfoApi,
} from "@/api/prod";
const infoForm = reactive({
  prodName: "",
  brief: "",
  pic: "",
  imgs: "",
  categoryId: 0,
  prodId: 0,
  skuList: [],
  tagList: [],
  content: "",
  status: 1,
  deliveryMode: "ShopDelivery",
  deliveryTemplateId: "",
});
const props = defineProps({
  visible: {
    type: Boolean,
  },
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["closeDialog"]);
const rules = reactive({
  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
  name: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
});

const category = ref({
  list: [],
  selected: [],
  props: {
    value: "categoryId",
    label: "categoryName",
  },
});

const tags = ref([]);
const getTagList = async () => {
  const res = await getTagListApi();
  console.log(res);
  tags.value = res.data;
};
const handleCategoryChange = (val) => {
  console.log(val);

  infoForm.categoryId = val[val.length - 1];
};
const deptFormRef = ref(ElForm);
/** 表单提交 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    // if (valid) {
    //   const deptId = formData.id;
    //   loading.value = true;
    //   if (deptId) {
    //     updateDept(deptId, formData)
    //       .then(() => {
    //         ElMessage.success("修改成功");
    //         closeDialog();
    //         handleQuery();
    //       })
    //       .finally(() => (loading.value = false));
    //   } else {
    //     addDept(formData)
    //       .then(() => {
    //         ElMessage.success("新增成功");
    //         closeDialog();
    //         handleQuery();
    //       })
    //       .finally(() => (loading.value = false));
    //   }
    // }
  });
}
/** 关闭弹窗 */
function closeDialog() {
  emit("closeDialog");
  resetForm();
}

/** 重置表单  */
function resetForm() {
  deptFormRef.value.resetFields();
  deptFormRef.value.clearValidate();
}

// 获取分类信息
const getCategoryList = async () => {
  const res = await getListCategoryApi();
  console.log(res);
  category.value.list = treeDataTranslate(res.data, "categoryId", "parentId");
};

const skuTagChangeSkuHandler = (val) => {
  console.log(val);
  infoForm.skuList = val;
};
const handleTransportUpdate = (val) => {
  console.log(val);
  infoForm.deliveryTemplateId = val;
};

const getProdInfo = async () => {
  const res = await getProdInfoApi(props.data);
  console.log(res);

  infoForm.prodId = res.data.prodId;
  infoForm.brief = res.data.brief;
  infoForm.prodName = res.data.prodName;
  infoForm.pic = res.data.pic;
  infoForm.imgs = res.data.imgs;
  infoForm.categoryId = res.data.categoryId;
  infoForm.skuList = res.data.skuList;
  infoForm.content = res.data.content;
  infoForm.tagList = res.data.tagList;
  infoForm.status = res.data.status;
  if (res.data.deliveryMode.hasUserPickUp) infoForm.deliveryMode = "UserPickUp";
  else infoForm.deliveryMode = "ShopDelivery";
  infoForm.deliveryTemplateId = res.data.deliveryTemplateId;
  category.value.selected = res.data.categoryId;
  console.log(category.value);
  console.log(props);
};
onMounted(async () => {
  await getTagList();
  await getCategoryList();
  if (props.data) {
    await getProdInfo();
  }
});
console.log(props);
</script>

<template>
  <el-dialog :title="visible" width="600px" @closed="closeDialog">
    <el-form :model="infoForm" label-width="100px">
      <!-- {{ infoForm }} -->
      <!-- {{ props }} -->
      <el-form-item label="产品图片">
        <MulPicUpload :imgs="infoForm.pic" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="infoForm.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="产品分类"
        :rules="[{ required: true, message: '请选择产品分类' }]"
        prop="categoryId"
      >
        <el-col :span="8">
          <el-cascader
            expand-trigger="hover"
            :options="category.list"
            :props="category.props"
            v-model="category.selected"
            change-on-select
            @change="handleCategoryChange"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        label="产品分组"
        :rules="[{ required: true, message: '请选择产品分组' }]"
      >
        <el-col :span="8">
          <el-select
            v-model="infoForm.tagList"
            multiple
            style="width: 250px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item
        label="产品名称"
        prop="prodName"
        :rules="[
          { required: true, message: '产品名称不能为空' },
          {
            pattern: /\s\S+|S+\s|\S/,
            message: '请输入正确的产品名称',
            trigger: 'blur',
          },
        ]"
      >
        <el-col :span="8">
          <el-input
            v-model="infoForm.prodName"
            placeholder="产品名称"
            maxlength="50"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        label="产品卖点"
        prop="brief"
        :rules="[
          {
            required: false,
            pattern: /\s\S+|S+\s|\S/,
            message: '请输入正确的产品卖点',
            trigger: 'blur',
          },
        ]"
      >
        <el-col :span="8">
          <el-input
            v-model="infoForm.brief"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="产品卖点"
          />
        </el-col>
      </el-form-item>
      <!-- {{ infoForm.deliveryMode }} -->
      <el-form-item label="配送方式">
        <el-radio-group v-model="infoForm.deliveryMode">
          <el-radio :label="'ShopDelivery'">商家配送</el-radio>
          <el-radio :label="'UserPickUp'">用户自提</el-radio>
        </el-radio-group>
      </el-form-item>

      <prod-transport
        v-show="infoForm.deliveryMode === 'ShopDelivery'"
        :deliveryTemplateId="infoForm.deliveryTemplateId"
        @update="handleTransportUpdate"
      />
      <sku-tag
        ref="skuTag"
        :skuListProps="infoForm.skuList"
        @change="skuTagChangeSkuHandler"
      />
      <sku-table
        ref="skuTable"
        v-model="infoForm.skuList"
        v-model:prodName="infoForm.prodName"
        :skuListProps="infoForm.skuList"
      />

      <!-- <el-form-item label="产品详情" prop="content">
          <tiny-mce
            v-model="infoForm.content"
            ref="content"
            style="width: 1000px"
          />
        </el-form-item>    -->
      <el-form-item>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
        <el-button @click="closeDialog"> 取 消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
