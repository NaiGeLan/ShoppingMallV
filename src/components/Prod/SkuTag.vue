<template>
  <div class="mod-prod-sku-tag">
    <el-form-item label="商品规格">
      <el-button size="mini" @click="shopTagInput()">添加规格</el-button>
      <el-divider />
      <br />
      <!-- {{ skuTags }} -->
      <div v-for="(tag, tagIndex) in skuTags" :key="tagIndex">
        <span>{{ tag.tagName }}</span>
        <el-button
          class="button-new-tag"
          type="text"
          icon="el-icon-delete"
          @click="removeTag(tagIndex)"
          >删除</el-button
        >
        <br />
        <el-tag
          v-for="(tagItem, tagItemIndex) in tag.tagItems"
          :key="tagItem.valueId"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tagIndex, tagItemIndex)"
        >
          <!-- {{ tagItem.propValue }} -->
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="tagItemInputs[tagIndex] && tagItemInputs[tagIndex].visible"
          v-model="tagItemInputs[tagIndex].value"
          :ref="`saveTagInput${tagIndex}`"
          size="small"
          @keyup.enter.native="handleInputConfirm(tagIndex)"
          @blur="handleInputConfirm(tagIndex)"
        />
        <!-- <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showTagInput(tagIndex)"
          >+ 添加</el-button
        > -->
        <br />
      </div>
    </el-form-item>
    <el-form-item label="规格名" v-show="isShowTagInput">
      <el-col :span="8">
        <el-select
          v-model="addTagInput.propName"
          filterable
          allow-create
          default-first-option
          placeholder="请选择"
          @change="handleTagClick"
        >
          <el-option
            v-for="item in unUseTags"
            :key="item.propId"
            :label="item.propName"
            :value="item.propName"
          />
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item label="规格值" v-show="isShowTagInput">
      <el-col :span="8">
        <el-select
          v-model="addTagInput.selectValues"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择"
        >
          <el-option
            v-for="item in dbTagValues"
            :key="item.valueId"
            :label="item.propValue"
            :value="item.propValue"
          />
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        @click="addTag()"
        v-show="isShowTagInput"
        >确定</el-button
      >
      <el-button size="mini" @click="hideTagInput()" v-show="isShowTagInput"
        >取消</el-button
      >
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from "element-plus";
import { ref, reactive, computed, watch, nextTick, onMounted } from "vue";
import {
  getListSpecValueApi,
  getSpecListApi,
  getListSpecMaxValueIdApi,
} from "@/api/prod";
const emit = defineEmits(["change"]);
const skuList = ref([]);
const value = ref([]);
const isShowTagInput = ref(false);
const props = defineProps({
  skuListProps: {
    required: false,
  },
});
const addTagInput = reactive({
  propName: "",
  selectValues: [],
});

const type = ref(0);
const tagItemName = ref("");
const tagName = ref("");
const tagNameIndex = ref(0);
const tagItemInputs = ref([]);
const dbTags = ref([]);
const dbTagValues = ref([]);
const specs = ref([]);
const maxValueId = ref(0);
const maxPropId = ref(0);
const initing = ref(false);
const unUseTags = computed(() => {
  console.log(dbTags.value);
  console.log(skuTags.value);

  let res = [];
  if (!skuTags.value) return dbTags.value;
  for (let i = 0; i < dbTags.value.length; i++) {
    const dbTag = dbTags.value[i];
    // console.log(skuTags.value[i]);

    let specIndex = skuTags.value.findIndex(
      (tag) => tag.tagName === dbTag.propName
    );

    if (specIndex === -1) {
      res.push(dbTag);
    }
  }
  return res;
});

const skuTags = ref([]);
// const defalutSku = computed(() => {
//   // return store.state.prod.defalutSku;
// });

watch(skuTags, (val, oldVal) => {
  if (initing.value) {
    initing.value = false;
    return;
  }
  let skuList = [];
  // Rest of your watch logic
});

const init = (skuList) => {
  value.value = skuList;
  if (!skuList || !skuList.length) {
    skuTags.value = [];
    // Emit change event
    return;
  }
  initing.value = true;
  let skuTags = [];
  // Rest of your init logic
};
const shopTagInput = () => {
  isShowTagInput.value = !isShowTagInput.value;
};
const hideTagInput = () => {
  isShowTagInput.value = false;
  cleanTagInput();
};

const cleanTagInput = () => {
  addTagInput.propName = "";
  addTagInput.selectValues = [];
  dbTagValues.value = [];
};

const handleTagClick = async () => {
  console.log(111);

  dbTagValues.value = [];
  addTagInput.selectValues = [];
  let specsIndex = dbTags.value.findIndex(
    (spec) => spec.propName === addTagInput.propName
  );
  console.log(specsIndex);

  if (specsIndex === -1) return;
  console.log(dbTags.value[specsIndex]);

  const res = await getListSpecValueApi(dbTags.value[specsIndex].propId);
  console.log(res);

  dbTagValues.value = res.data;
};

const handleTagClose = (tagIndex, tagItemIndex) => {
  tagName.value = skuTags.value[tagIndex].tagName;
  tagNameIndex.value = tagIndex;
  tagItemName.value = skuTags.value[tagIndex].tagItems[tagItemIndex].propValue;
  if (skuTags.value[tagIndex].tagItems.length === 1) {
    return;
  }
  type.value = 4;
};

const removeTag = (tagIndex) => {
  type.value = 3;
};

const handleInputConfirm = (tagIndex) => {
  if (checkTagItem(tagIndex)) {
    return;
  }

  const tag = skuTags.value[tagIndex];
  const tagItems = tag.tagItems;
  const itemValue = tagItemInputs.value[tagIndex].value;
  const index = tagItems.length - 1;

  const tagName = tag.tagName;
  const tagItemName = tagItemInputs.value[tagIndex].value;
  const maxValue = getMaxValueId(tagItems);
  const tagItem = {
    propId: index === -1 ? 0 : tagItems[index].propId,
    propValue: itemValue,
    valueId: index === -1 ? 0 : maxValue + 1,
  };
};

const showTagInput = (tagIndex) => {
  tagItemInputs.value.push({ visible: false, value: "" });
  tagItemInputs.value[tagIndex].visible = true;

  // Use nextTick to focus on the input element
  nextTick(() => {
    const inputElement = document.querySelector(
      `#saveTagInput${tagIndex} input`
    );
    if (inputElement) {
      inputElement.focus();
    }
  });
};
const getSpecList = async () => {
  const res = await getSpecListApi();
  console.log(res);

  dbTags.value = res.data;
  if (res.success) {
    maxPropId.value = Math.max.apply(
      Math,
      res.data.map((item) => {
        return item.propId;
      })
    );
  } else {
    maxPropId.value = 0;
  }
};

const getlistSpecMaxValueId = async () => {
  const res = await getListSpecMaxValueIdApi();
  if (res.success) {
    maxValueId.value = res.data;
  } else {
    maxValueId.value = 0;
  }
};

const addTag = () => {
  let selectValues = addTagInput.selectValues;
  console.log(addTagInput);
  console.log(selectValues);

  if (!addTagInput.propName) {
    // this.$message.error("请输入规格名");
    ElNotification({
      // title: "Success",
      message: "请输入规格名",
      type: "warning",
    });
    return;
  }
  if (!selectValues.length) {
    // this.$message.error("请输入规格值");
    ElNotification({
      // title: "Success",
      message: "请输入规格值",
      type: "warning",
    });
    return;
  }
  for (let i = 0; i < selectValues.length; i++) {
    const element = selectValues[i];
    let is = Object.prototype.toString.call(element) === "[object Object]";
    if (!is) {
      maxPropId.value = maxPropId.value + 1;
      break;
    }
  }
  let tagItems: any[] = [];
  for (let i = 0; i < selectValues.length; i++) {
    const element = selectValues[i];
    let is = Object.prototype.toString.call(element) === "[object Object]";
    if (is) {
      tagItems.push(element);
    } else {
      maxValueId.value = maxValueId.value + 1;
      tagItems.push({
        propId: maxPropId.value,
        propValue: element,
        valueId: maxValueId.value,
      });
    }
  }
  skuTags.value.push({
    tagName: addTagInput.propName,
    tagItems: tagItems,
  });
  console.log(tagItems);

  type.value = 1;
  emit("change", skuTags.value);
  cleanTagInput();
};
onMounted(async () => {
  await getSpecList();
  await getlistSpecMaxValueId();
  if (props.skuListProps.length > 0) {
    console.log(props.skuListProps);
    skuTags.value = props.skuListProps;
  }
});
</script>

<style lang="scss">
.mod-prod-sku-tag {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}

// 新增规格外部边框
.sku-border {
  border: 1px solid #ebeef5;
  width: 70%;
}
.sku-background {
  background-color: #f6f6f6;
  margin: 12px 12px;
  .el-button {
    margin-left: 10px;
    span {
      color: #000 !important;
    }
  }
  .el-form-item__label {
    padding: 0 24px 0 0;
  }
}
.sku-tag {
  margin: 12px 12px;
}
.tagTree {
  margin-left: 18px;
  padding-bottom: 8px;
}
</style>
