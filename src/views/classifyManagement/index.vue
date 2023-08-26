<script setup lang="ts">
import { getCategoryListApi, getCategoryInfoApi } from "@/api/category";
import ClassifyInfo from "@/components/ClassifyManagement/ClassifyInfo.vue";
const dataForm = ref({});
const dataList = ref([]);
const dataListLoading = ref(false);
const addOrUpdateVisible = ref(false);
const resourcesUrl = "https://img.mall4j.com/";
const pageIndex = ref(1);
const pageSize = ref(10);
const pageTotal = ref(0);
const categoryIdProps = ref();
const titleProps = ref();
const getDataList = async () => {
  dataListLoading.value = true;
  const data = {
    current: pageIndex.value,
    size: pageSize.value,
    // prodName: dataForm.value.prodName,
    // status: dataForm.value.status,
  };
  const res = await getCategoryListApi(data);
  dataList.value = res.data;
  if (res.data.total) pageTotal.value = res.data.total;
  pageTotal.value = res.data.length;
  console.log(res);
};
const addOrUpdateHandle = (val: any) => {
  console.log(typeof val === "number");
  const is = typeof val === "number";
  if (is) {
    categoryIdProps.value = val;
    titleProps.value = "修改分类";
  } else {
    titleProps.value = "新增分类";
  }
  addOrUpdateVisible.value = true;
  console.log(11);
};
const deleteHandle = () => {
  console.log(22);
};
const handleSizeChange = async (val: number) => {
  pageSize.value = val;
  await getDataList();
  console.log(val);
};
const handleCurrentChange = async (val: number) => {
  console.log(val);
  pageIndex.value = val;
  await getDataList();
};

onMounted(async () => {
  deleteHandle();
  await getDataList();
});
</script>

<template>
  <div class="mod-category">
    {{ addOrUpdateVisible }}
    <div class="search-container">
      <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-button
            style="margin-left: 1em"
            type="primary"
            @click="addOrUpdateHandle"
          >
            <i-ep-refresh />新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <el-table
        :data="dataList"
        border
        row-key="categoryId"
        style="width: 100%"
      >
        <el-table-column
          prop="categoryName"
          header-align="center"
          treeKey="categoryId"
          width="150"
          label="分类名称"
        />
        <el-table-column
          prop="pic"
          header-align="center"
          align="center"
          label="图片"
        >
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="resourcesUrl + scope.row.pic"
              fit="fill"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger"
              >下线</el-tag
            >
            <el-tag v-else size="small">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="seq"
          header-align="center"
          align="center"
          label="排序号"
        />
        <el-table-column header-align="center" align="center" label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="addOrUpdateHandle(scope.row.categoryId)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteHandle(scope.row.categoryId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="pageTotal"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <ClassifyInfo
      v-if="addOrUpdateVisible"
      v-model="addOrUpdateVisible"
      v-model:categoryId="categoryIdProps"
      v-model:title="titleProps"
      @refreshDataList="getDataList"
      ref="addOrUpdate"
    />
  </div>
</template>
