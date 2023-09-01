<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { specApi } from "@/api/spec";
const emit = defineEmits(["refreshDataList"]);
const dataFormSubmit = async () => {
  if (dataForm.value[0].prodPropValues) {
    let temp = [];
    for (const key in dataForm.value[0].prodPropValues) {
      if (dataForm.value[0].prodPropValues.hasOwnProperty(key)) {
        const element = dataForm.value[0].prodPropValues[key];
        if (element.propValue) {
          temp.push(dataForm.value[0].prodPropValues[key]);
        }
      }
    }
    dataForm.value[0].prodPropValues = temp;
  }
  if (!dataForm.value[0].propName.trim()) {
    dataForm.value[0].propName = "";
    ElMessage({
      message: "属性名不能为空",
      type: "warning",
    });
    // this.$message.error("属性名不能为空");
    return;
  }
  if (dataForm.value[0].prodPropValues.length < 1) {
    dataForm.value[0].prodPropValues = [{ valueId: 0 }];
    ElMessage({
      message: "规格项不能为空",
      type: "warning",
    });
    return;
  }
  if (dataForm.value[0].propName.length > 10) {
    ElMessage({
      message: "属性名不能为空",
      type: "warning",
    });
    // this.$message.error("属性名称长度不能大于10");
    return;
  }
  if (dataForm.value[0].prodPropValues.find((el) => !el.propValue.trim())) {
    ElMessage({
      message: "属性值不能为空",
      type: "warning",
    });
    // this.$message.error("属性值不能为空");
    return;
  }
  if (dataForm.value[0].prodPropValues.find((el) => el.propValue.length > 20)) {
    ElMessage({
      message: "属性值长度不能大于20",
      type: "warning",
    });
    return;
  }
  console.log(dataForm.value);
  const data = {
    propId: dataForm.value[0].propId || undefined,
    propName: dataForm.value[0].propName,
    prodPropValues: dataForm.value[0].prodPropValues,
  };
  const method = dataForm.value[0].propId ? "put" : "post";
  const res = await specApi(method, data);
  console.log(res);
  if (res.success) {
    ElMessage({
      message: dataForm.value[0].propId ? "修改成功" : "新增成功",
      type: "success",
    });
    emit("refreshDataList");
  }

  // console.log(await formRef.value.validate());
};
const props = defineProps({
  specInfo: {
    type: Object,
  },
  title: {
    required: true,
    type: String,
  },
});
const formRef = ref();

const dataForm = ref([
  { propId: 0, propName: "", prodPropValues: [{ valueId: 0 }] },
]);

const addInput = () => {
  let temp = dataForm.value[0].prodPropValues;
  if (temp[temp.length - 1].propValue) {
    temp.push({
      valueId: 0,
    });
  }
};
const init = () => {
  console.log(props.specInfo);
  if (props.title === "修改分类") {
    dataForm.value = [props.specInfo];
  } else {
    dataForm.value = [
      { propId: 0, propName: "", prodPropValues: [{ valueId: 0 }] },
    ];
  }
};

const clearProdPropValues = () => {
  if (dataForm.value[0].prodPropValues.length === 1) {
    return;
  }
  for (let i = 0; i < dataForm.value[0].prodPropValues.length; i++) {
    const element = dataForm.value[0].prodPropValues[i];
    if (!element.propValue) {
      dataForm.value[0].prodPropValues.splice(i, 1);
    }
  }
};
onMounted(async () => {
  init();
});
</script>

<template>
  <el-dialog :title="props.title" :close-on-click-modal="false">
    <el-table :data="dataForm" border style="width: 100%">
      <el-table-column
        prop="propName"
        header-align="center"
        align="center"
        label="属性名称"
      >
        <template #default="scope">
          <el-input
            placeholder="请输入内容"
            v-model="scope.row.propName"
            maxlength="10"
            show-word-limit
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="prodPropValues"
        header-align="center"
        align="center"
        label="属性值"
      >
        <template #default="scope">
          <el-col
            :span="12"
            v-for="item in scope.row.prodPropValues"
            :key="item.valueId"
          >
            <el-input
              placeholder="请输入内容"
              v-model="item.propValue"
              class="prop-value-input"
              @clear="clearProdPropValues"
              maxlength="20"
              show-word-limit
              clearable
            />
          </el-col>
          <el-col :span="4">
            <el-button
              v-show="
                scope.row.prodPropValues[scope.row.prodPropValues.length - 1]
                  .propValue
              "
              type="primary"
              class="add-input"
              icon="el-icon-circle-plus"
              @click="addInput()"
            />
          </el-col>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<style scoped>
.prop-value-input {
  padding: 3px;
}

.add-input {
  margin: 3px;
}

.dialog-footer {
  margin-top: 1em;
}
</style>
