<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const resourcesUrl = "https://img.mall4j.com/";

const emit = defineEmits(["update:value"]);
const props = defineProps({
  imgs: {
    default: "",
    type: String,
  },
});

const imageList = computed(() => {
  let res = [];
  if (props.imgs) {
    let imageArray = props.imgs.split(",");
    for (let i = 0; i < imageArray.length; i++) {
      res.push({ url: resourcesUrl + imageArray[i], response: imageArray[i] });
    }
  }
  emit("update:value", props.imgs);
  return res;
});

const handleUploadSuccess = (response: any, file: any, fileList: any[]) => {
  let pics = fileList
    .map((file: { response: { data: any } }) => {
      if (typeof file.response === "string") {
        return file.response;
      }
      return file.response.data;
    })
    .join(",");
  emit("update:value", pics);
};

const beforeAvatarUpload = (file: { type: string; size: number }) => {
  const isJPG =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/gif" ||
    file.type === "image/jpg";
  if (!isJPG) {
    // this.$message.error('上传图片只能是jpeg/jpg/png/gif 格式!');
    // 你可以使用一个全局的消息提示库来代替 this.$message
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    // this.$message.error('上传图片大小不能超过 2MB!');
    // 同样，你可以使用一个全局的消息提示库来代替 this.$message
  }
  return isLt2M && isJPG;
};

const handleRemove = (file: any, fileList: any[]) => {
  let pics = fileList
    .map((file: { response: { data: any } }) => {
      if (typeof file.response === "string") {
        return file.response;
      }
      return file.response.data;
    })
    .join(",");
  emit("update:value", pics);
};

const handlePictureCardPreview = (file: { url: string }) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
const adornUrl = (actionName: any) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return import.meta.env.VITE_APP_BASE_API + actionName;
};
</script>

<template>
  <div>
    <el-upload
      :action="adornUrl('/admin/file/upload/element')"
      :headers="{ Authorization: userStore.token }"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :file-list="imageList"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog v-model:visible="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
