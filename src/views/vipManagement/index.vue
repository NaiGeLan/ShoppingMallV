<script setup lang="ts">
import { getVipsApi } from "@/api/vip";
import Notice from "@/components/Notice/Notice.vue";
import { Action } from "element-plus";
const dataForm = ref({
  nickName: "",
  status: 1,
});
const dataList = ref([]);
const dataListLoading = ref(false);
const addOrUpdateVisible = ref(false);
const pageIndex = ref(1);
const pageSize = ref(10);
const pageTotal = ref(0);
const userIdProps = ref();
const titleProps = ref();
const getDataList = async () => {
  dataListLoading.value = true;
  const data = Object.assign(
    {
      current: pageIndex.value,
      size: pageSize.value,
    },
    dataForm.value
  );
  const res = await getVipsApi(data);
  dataList.value = res.data.records;
  if (res.data.size) pageSize.value = res.data.size;
  if (res.data.total) pageTotal.value = res.data.total;
  if (res.data.current) pageIndex.value = res.data.current;
  console.log(res);
};
const addOrUpdateHandle = (val: any) => {
  console.log(val);
  userIdProps.value = val;
  addOrUpdateVisible.value = true;
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

const handleQuery = async () => {
  await getDataList();
};
onMounted(async () => {
  await getDataList();
});
</script>

<template>
  <div>
    <div class="search-container">
      <el-form :inline="true">
        <el-form-item label="用户昵称" prop="nickName">
          <el-input
            v-model="dataForm.nickName"
            placeholder="用户昵称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="状态" clearable>
            <el-option :value="1" label="正常" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mod-category">
      <el-card>
        <el-table
          :data="dataList"
          border
          row-key="categoryId"
          style="width: 100%"
        >
          <el-table-column type="index" width="50" />
          <el-table-column
            prop="nickName"
            header-align="center"
            treeKey="categoryId"
            width="150"
            label="用户昵称"
          />
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="状态"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="danger"
                >异常</el-tag
              >
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="userRegtime"
            header-align="center"
            align="center"
            label="注册时间"
          />

          <el-table-column header-align="center" align="center" label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="addOrUpdateHandle(scope.row.userId)"
                >修改</el-button
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
      <VipInfo
        v-if="addOrUpdateVisible"
        v-model="addOrUpdateVisible"
        v-model:userId="userIdProps"
        @refreshDataList="handleRefreshDataList"
        ref="addOrUpdate"
      />
    </div>
  </div>
</template>
