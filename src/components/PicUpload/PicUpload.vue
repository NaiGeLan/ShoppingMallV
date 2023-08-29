<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="httpProv + '/admin/file/upload/element'"
      :headers="{ Authorization: userStore.token }"
      :show-file-list="false"
      @on-success="handleUploadSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="value" :src="resourcesUrl + value" class="pic" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
const httpProv = import.meta.env.VITE_APP_BASE_API;
const resourcesUrl = "https://img.mall4j.com/";
const picValue = ref("");
const userStore = useUserStore();
console.log(userStore);
const props = defineProps({
  value: {
    default: "",
    type: String,
  },
});
const handleUploadSuccess = (response, file, fileList) => {
  picValue.value = file.response.data;
};
onMounted(() => {
  picValue.value = props.value;
});
const beforeAvatarUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  const isJPG =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/gif" ||
    file.type === "image/jpg";
  if (!isJPG) {
    // Use Vue 3's composition API `app.config.globalProperties.$message.error` for message error
    app.config.globalProperties.$message.error(
      "上传图片只能是jpeg/jpg/png/gif 格式!"
    );
  }
  if (!isLt2M) {
    // Use Vue 3's composition API `app.config.globalProperties.$message.error` for message error
    app.config.globalProperties.$message.error("上传图片大小不能超过 2MB!");
  }
  return isLt2M && isJPG;
};
</script>

<style>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
