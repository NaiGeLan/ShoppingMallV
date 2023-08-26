<script setup lang="ts">
import { ref } from "vue";
import { noticeApi, getNoticeInfoApi } from "@/api/notice";
// import { treeDataTranslate } from "@/utils";
import HtmlEditor from "../HtmlEditor/HtmlEditor.vue";
import { ElMessage } from "element-plus";
const emit = defineEmits(["refreshDataList"]);

const dialogImageUrl = ref("");
const dataFormSubmit = async () => {
  // console.log(formRef.value);
  console.log(dataForm.value);
  const method = dataForm.value.id ? "put" : "post";
  const res = await noticeApi(method, dataForm.value);
  console.log(res);
  if (res.success) {
    console.log("success");

    ElMessage({
      message: dataForm.value.id !== 0 ? "修改成功" : "新增成功",
      type: "success",
    });
    emit("refreshDataList");
  }
};
const props = defineProps({
  noticeId: {
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
});
const formRef = ref();
const noticeIdProps = ref();
const dataForm = ref({
  id: 0,
  title: null,
  content: null,
  url: null,
  status: 1,
  isTop: 0,
});

const getCategoryInfo = async () => {
  const res = await getNoticeInfoApi(noticeIdProps.value);
  console.log(res);
  console.log(dataForm.value);

  dataForm.value.id = res.data.id;
  dataForm.value.title = res.data.title;
  dataForm.value.content = res.data.content;
  dataForm.value.url = res.data.url;
  dataForm.value.isTop = res.data.isTop;
  dataForm.value.status = res.data.status;
  // dataForm.value.pic = res.data.pic;
  // dialogImageUrl.value = res.data.pic;
  // imageList.value.push(res.data.pic);
  console.log(dataForm.value);
};
// const isSubmit = ref(false);
// const handleChange = (val) => {
//   dataForm.value.parentId = val[val.length - 1];
// };
const handleContentChange = (val) => {
  console.log(val);
  dataForm.value.content = val;
};
onMounted(async () => {
  console.log(props);
  noticeIdProps.value = props.noticeId;

  if (props.title === "修改分类") await getCategoryInfo();

  // await getCategoryList();
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
    >
      <el-form-item label="公告标题" prop="categoryName">
        <el-input
          v-model="dataForm.title"
          controls-position="right"
          :min="0"
          label="标签名称"
        />
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">公布</el-radio>
          <el-radio :label="0">撤销</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="置顶" prop="isTop">
        <el-radio-group v-model="dataForm.isTop">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <HtmlEditor
          v-model:info="dataForm.content"
          @handleChange="handleContentChange"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button size="small" @click="visible = false">取消</el-button> -->
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
