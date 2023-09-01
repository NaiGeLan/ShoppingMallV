<script setup lang="ts">
import { ref } from "vue";
import { getGroupInfoApi, groupApi } from "@/api/group";
import { treeDataTranslate } from "@/utils";
import PicUpload from "../PicUpload/PicUpload.vue";
import ElMessage from "element-plus";
const emit = defineEmits(["refreshDataList"]);
// const adornUrl = (actionName: any) => {
//   // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
//   return import.meta.env.VITE_APP_BASE_API + actionName;
// };
const dialogImageUrl = ref("");
const dataFormSubmit = async () => {
  // console.log(formRef.value);
  console.log(dataForm.value);
  const method = dataForm.value.id ? "put" : "post";
  const res = await groupApi(method, dataForm.value);
  console.log(res);
  if (res.success) {
    console.log("success");

    ElMessage({
      message: dataForm.value[0].propId ? "修改成功" : "新增成功",
      type: "success",
    });
    emit("refreshDataList");
  }
  // console.log(await formRef.value.validate());
};
const props = defineProps({
  groupId: {
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
});
const formRef = ref();
const groupIdProps = ref();
const dataForm = ref({
  status: 1,
  des: "",
  imgUrl: "",
  seq: 0,
  imgId: 0,
  type: -1,
  relation: null,
});
const imageList = ref([]);

const categoryList = ref([]);
const selectedCategory = ref([]);
const categoryTreeProps = ref({
  value: "categoryId",
  label: "categoryName",
});
const getCategoryInfo = async () => {
  const res = await getGroupInfoApi(groupIdProps.value);
  console.log(res);
  console.log(dataForm.value);

  // dataForm.value.categoryId = res.data.categoryId;
  // dataForm.value.grade = res.data.grade;
  // dataForm.value.categoryName = res.data.categoryName;
  // dataForm.value.seq = res.data.seq;
  // dataForm.value.status = res.data.status;
  // dataForm.value.parentId = res.data.parentId;
  // dataForm.value.pic = res.data.pic;
  // dialogImageUrl.value = res.data.pic;
  imageList.value.push(res.data.pic);
  console.log(dataForm.value);
};
const isSubmit = ref(false);
const handleChange = (val) => {
  dataForm.value.parentId = val[val.length - 1];
};

onMounted(async () => {
  console.log(props);
  groupIdProps.value = props.groupId;

  if (props.title === "修改分类") await getCategoryInfo();

  // await getCategoryList();
});
</script>

<template>
  <el-dialog :title="props.title" :close-on-click-modal="false">
    <el-form
      ref="formRef"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="轮播图片" prop="imgUrl">
        <PicUpload v-model="dataForm.imgUrl" />
      </el-form-item>
      <el-form-item
        label="顺序"
        prop="seq"
        :rules="[
          {
            required: false,
            pattern: /\s\S+|S+\s|\S/,
            message: '请输入正确的顺序',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="dataForm.seq" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="dataForm.type" @change="deleteRelation">
          <el-radio :label="-1">无</el-radio>
          <el-radio :label="0">商品</el-radio>
        </el-radio-group>
        <div v-if="dataForm.relation != null">
          <el-card
            :body-style="{ padding: '0px' }"
            style="height: 160px; width: 120px"
          >
            <img :src="card.pic" style="height: 104px; width: 100%" />
            <div class="card-prod-bottom">
              <span class="card-prod-name">{{ card.name }}</span>
              <el-button
                type="text"
                class="card-prod-name-button"
                @click="deleteRelation"
                >删除</el-button
              >
            </div>
          </el-card>
        </div>
        <div v-if="dataForm.relation == null">
          <el-button @click="addProd" v-if="dataForm.type == 0" size="small"
            >选择商品</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
