<script setup lang="ts">
import { getNoticeApi, noticeDelApi } from "@/api/notice";
import Notice from "@/components/Notice/Notice.vue";
import { Action } from "element-plus";
const dataForm = ref({});
const dataList = ref([]);
const dataListLoading = ref(false);
const addOrUpdateVisible = ref(false);
// const resourcesUrl = "https://img.mall4j.com/";
const pageIndex = ref(1);
const pageSize = ref(10);
const pageTotal = ref(0);
const noticeIdProps = ref();
const titleProps = ref();
const getDataList = async () => {
  dataListLoading.value = true;
  const data = {
    current: pageIndex.value,
    size: pageSize.value,
    // prodName: dataForm.value.prodName,
    // status: dataForm.value.status,
  };
  const res = await getNoticeApi(data);
  dataList.value = res.data.records;
  if (res.data.size) pageSize.value = res.data.size;
  if (res.data.total) pageTotal.value = res.data.total;
  if (res.data.current) pageIndex.value = res.data.current;
  console.log(res);
};
const addOrUpdateHandle = (val: any) => {
  console.log(val);
  [JSON.parse(JSON.stringify(val))];
  // console.log(typeof val === "number");
  const is = typeof val === "number";
  if (is) {
    noticeIdProps.value = val;
    titleProps.value = "修改分类";
  } else {
    titleProps.value = "新增分类";
    noticeIdProps.value = val;
  }
  addOrUpdateVisible.value = true;
  console.log(11);
};
const deleteHandle = async (id) => {
  console.log(id);

  ElMessageBox.alert("确定删除？", "提示", {
    confirmButtonText: "OK",
    callback: async (action: Action) => {
      console.log(action);
      if (action === "confirm") {
        const res = await noticeDelApi([id]);
        console.log(res);
        if (res.success) {
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          await getDataList();
        }
      }
    },
  });
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
const handleRefreshDataList = async () => {
  console.log(11);

  await getDataList();
  addOrUpdateVisible.value = false;
};
onMounted(async () => {
  // deleteHandle();
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
        <el-table-column type="index" width="50" />
        <el-table-column
          prop="title"
          header-align="center"
          treeKey="categoryId"
          width="150"
          label="标签名称"
        />
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger"
              >撤销</el-tag
            >
            <el-tag v-else size="small">公布</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="isTop"
          header-align="center"
          align="center"
          label="是否置顶"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.isTop === 0" size="small">否</el-tag>
            <el-tag v-else size="small">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteHandle(scope.row.id)"
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
    <Notice
      v-if="addOrUpdateVisible"
      v-model="addOrUpdateVisible"
      v-model:noticeId="noticeIdProps"
      v-model:title="titleProps"
      @refreshDataList="handleRefreshDataList"
      ref="addOrUpdate"
    />
  </div>
</template>
