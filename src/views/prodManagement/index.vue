<script setup lang="ts">
import {
  getDeptForm,
  deleteDept,
  updateDept,
  addDept,
  listDeptOptions,
  listDepts,
} from "@/api/dept";
import ProdTransport from "@/components/Prod/ProdTransport.vue";
import { treeDataTranslate } from "@/utils/index.ts";
import SkuTag from "@/components/Prod/SkuTag.vue";
import SkuTable from "@/components/Prod/SkuTable.vue";
import {
  getProdListApi,
  getTagListApi,
  getListCategoryApi,
  getProdInfoApi,
} from "@/api/prod";
import { DeptVO, DeptForm, DeptQuery } from "@/api/dept/types";

defineOptions({
  name: "Dept",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const deptFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams = reactive<DeptQuery>({});
const deptList = ref<DeptVO[]>();

const deptOptions = ref<OptionType[]>();

const formData = reactive<DeptForm>({
  status: 1,
  parentId: 0,
  sort: 1,
});

const rules = reactive({
  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
  name: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
});

const pageIndex = ref(1);
const pageSize = ref(10);
const pageTotal = ref(0);
const dataForm = ref({
  prodName: "",
  status: "",
});
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
console.log(infoForm.value);

const category = ref({
  list: [],
  selected: [],
  props: {
    value: "categoryId",
    label: "categoryName",
  },
});
const prodList = ref([]);
/** 查询 */
async function handleQuery() {
  loading.value = true;
  const data = {
    current: pageIndex.value,
    size: pageSize.value,
    prodName: dataForm.value.prodName,
    status: dataForm.value.status,
  };
  const res = await getProdListApi(data);
  prodList.value = res.data.records;
  console.log(res);
  pageTotal.value = res.data.total;
  loading.value = false;
}

/**重置查询 */
function resetQuery() {
  dataForm.value = {};
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 获取部门下拉数据  */
async function getDeptOptions() {
  listDeptOptions().then((response) => {
    deptOptions.value = [
      {
        value: 0,
        label: "顶级部门",
        children: response.data,
      },
    ];
  });
}

/**
 * 打开弹窗
 *
 * @param parentId 父部门ID
 * @param deptId 部门ID
 */
async function openDialog(row) {
  // await getDeptOptions();
  console.log(row);

  dialog.visible = true;
  // console.log(row.prodId);

  await getProdInfo(row.prodId);
  // if (deptId) {
  //   dialog.title = "修改部门";
  //   getDeptForm(deptId).then(({ data }) => {
  //     Object.assign(formData, data);
  //   });
  // } else {
  //   dialog.title = "新增部门";
  //   formData.parentId = parentId ?? 0;
  // }
}

/** 表单提交 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    if (valid) {
      const deptId = formData.id;
      loading.value = true;
      if (deptId) {
        updateDept(deptId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addDept(formData)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 删除部门 */
function handleDelete(deptId?: number) {
  const deptIds = [deptId || ids.value].join(",");

  if (!deptIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm(`确认删除已选中的数据项?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteDept(deptIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

/** 关闭弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单  */
function resetForm() {
  deptFormRef.value.resetFields();
  deptFormRef.value.clearValidate();
  formData.id = undefined;
  formData.parentId = 0;
  formData.status = 1;
  formData.sort = 1;
}

const handleSizeChange = async (val) => {
  pageSize.value = val;
  await handleQuery();
  console.log(val);
};
const handleCurrentChange = async (val) => {
  console.log(val);
  pageIndex.value = val;
  await handleQuery();
};
const handleCategoryChange = (val) => {
  console.log(val);

  infoForm.categoryId = val[val.length - 1];
};
const tags = ref([]);
const getTagList = async () => {
  const res = await getTagListApi();
  console.log(res);
  tags.value = res.data;
};
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

const getProdInfo = async (prodId) => {
  const res = await getProdInfoApi(prodId);
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

  console.log(res);
};
onMounted(async () => {
  await handleQuery();
  await getTagList();
  await getCategoryList();
});
</script>
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="产品名字" prop="prodName">
          <el-input
            v-model="dataForm.prodName"
            placeholder="产品名字"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="状态" clearable>
            <el-option :value="1" label="上架" />
            <el-option :value="0" label="下架" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
          <el-button @click="resetQuery"> <i-ep-refresh />重置 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <template #header>
        <el-button
          v-hasPerm="['sys:dept:add']"
          type="success"
          @click="openDialog(0, undefined)"
          ><i-ep-plus />新增</el-button
        >
        <el-button
          v-hasPerm="['sys:dept:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
          ><i-ep-delete />删除
        </el-button>
      </template>

      <el-table
        v-loading="loading"
        :data="prodList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column prop="prodName" label="产品名字" min-width="50" />
        <el-table-column prop="oriPrice" label="商品原价" width="100" />

        <el-table-column prop="price" label="商品现价" width="100" />

        <el-table-column prop="totalStocks" label="商品库存" width="100" />
        <el-table-column prop="pic" label="商品图片" width="100">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.pic"
              fit="fill"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="imgs" label="状态" width="100" /> -->
        <el-table-column prop="status" label="状态" width="180">
          <template #default="scope">
            <el-tag class="ml-2" type="success" v-if="scope.row.status === 1">
              在售
            </el-tag>
            <el-tag class="ml-2" type="danger" v-else> 下架 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row)"
              ><i-ep-edit />编辑
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
            >
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      :page-sizes="[5, 10, 15, 20]"
      v-model:current-page="pageIndex"
    />

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="600px"
      @closed="closeDialog"
    >
      <el-form :model="infoForm" label-width="100px">
        {{ infoForm }}
        <el-form-item label="产品图片">
          <!-- <mul-pic-upload v-model="infoForm.imgs" /> -->
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
        {{ infoForm.deliveryMode }}
        <el-form-item label="配送方式">
          <el-radio-group v-model="infoForm.deliveryMode">
            <el-radio :label="'ShopDelivery'">商家配送</el-radio>
            <el-radio :label="'UserPickUp'">用户自提</el-radio>
          </el-radio-group>
          <!-- <el-checkbox v-model="infoForm.deliveryMode.hasShopDelivery"
            >商家配送</el-checkbox
          >
          <el-checkbox v-model="infoForm.deliveryMode.hasUserPickUp"
            >用户自提</el-checkbox
          > -->
        </el-form-item>
        <!-- {{ infoForm.deliveryMode.hasShopDelivery }} -->
        <prod-transport
          v-show="infoForm.deliveryMode === 'ShopDelivery'"
          v-model="infoForm"
          @update="handleTransportUpdate"
        />
        <sku-tag
          ref="skuTag"
          :skuList="infoForm.skuList"
          @change="skuTagChangeSkuHandler"
        />
        <sku-table
          ref="skuTable"
          v-model="infoForm.skuList"
          v-model:prodName="infoForm.prodName"
          :skuList="infoForm.skuList"
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
  </div>
</template>
