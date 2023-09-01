<script setup lang="ts">
import { getProdListApi } from "@/api/prod";
import ProdInfo from "@/components/Prod/ProdInfo.vue";
const queryFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const dialog = reactive<DialogOption>({
  visible: false,
});

const prodData = ref();

const pageIndex = ref(1);
const pageSize = ref(10);
const pageTotal = ref(0);
const dataForm = ref({
  prodName: "",
  status: "",
});

const handleContentChange = (val) => {
  console.log(val);
  dataForm.value.content = val;
};
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
  dataForm.value = {
    prodName: "",
    status: "",
  };
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开弹窗
 *
 */
async function addOrUpdateHandle(row: any) {
  console.log(row.prodId);
  prodData.value = row.prodId;
  dialog.visible = true;

  // await getProdInfo(row.prodId);
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

/**
 * 打开弹窗
 *
 */
async function openDialog(row?: any) {
  prodData.value = row?.prodId;

  // await getProdInfo(row.prodId);
  if (row?.prodId) {
    dialog.title = "修改产品";
    // getDeptForm(deptId).then(({ data }) => {
    //   Object.assign(formData, data);
    // });
  } else {
    dialog.title = "新增产品";
    // formData.parentId = parentId ?? 0;
  }
  dialog.visible = true;
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
    // deleteDept(deptIds).then(() => {
    //   ElMessage.success("删除成功");
    //   resetQuery();
    // });
  });
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

const closeDialog = () => {
  dialog.visible = false;
};
onMounted(async () => {
  await handleQuery();
});
</script>
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :inline="true">
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
        <el-button type="success" @click="openDialog()"
          ><i-ep-plus />新增</el-button
        >
        <el-button
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
        <el-table-column type="selection" width="55" align="center" />
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
    <ProdInfo
      v-if="dialog.visible"
      v-model="dialog.visible"
      :data="prodData"
      v-model:title="dialog.title"
      @closeDialog="closeDialog"
    />
  </div>
</template>
