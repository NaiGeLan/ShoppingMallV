<script setup lang="ts">
import { ref } from "vue";

const dataForm = ref({});
const dataRange = ref([]);
const options = [
  {
    value: 1,
    label: "待付款",
  },
  {
    value: 2,
    label: "待发货",
  },
  {
    value: 3,
    label: "待收货",
  },
  {
    value: 4,
    label: "待评价",
  },
  {
    value: 5,
    label: "成功",
  },
  {
    value: 6,
    label: "失败",
  },
];
const resourcesUrl = "https://img.mall4j.com/";
const dataList = ref([]);
const page = ref({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10, // 每页显示多少条
});
const dataListLoading = ref(false);
const dataListSelections = ref([]);
const addOrUpdateVisible = ref(false);
const consignmentInfoVisible = ref(false);
</script>

<template>
  <div class="mod-order-order">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList(page)"
    >
      <el-form-item label="订单编号:">
        <el-input
          v-model="dataForm.orderNumber"
          placeholder="订单编号"
          clearable
        />
      </el-form-item>
      <el-form-item label="下单时间:">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="订单状态:">
        <template>
          <el-select
            v-model="dataForm.status"
            clearable
            placeholder="请选择订单状态"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getDataList()"
          >查询</el-button
        >
        <el-button
          v-if="isAuth('order:order:waitingConsignmentExcel')"
          @click="showConsignmentInfo()"
          type="primary"
          size="small"
          >导出待发货订单</el-button
        >
        <el-button
          v-if="isAuth('order:order:soldExcel')"
          @click="getSoldExcel()"
          type="primary"
          size="small"
          >导出销售记录</el-button
        >
        <el-button @click="clearDatas()" size="small">清空</el-button>
      </el-form-item>
    </el-form>
    <div class="main">
      <div class="content">
        <div class="tit">
          <el-row style="width: 100%">
            <el-col :span="10"><span class="item product">商品</span></el-col>
            <el-col :span="3"
              ><span class="item">成交单价/购买数量</span></el-col
            >
            <el-col :span="3"><span class="item">实付金额</span></el-col>
            <el-col :span="3"><span class="item">支付方式</span></el-col>
            <el-col :span="3"><span class="item">订单状态</span></el-col>
            <el-col :span="2"><span class="item">操作</span></el-col>
          </el-row>
        </div>
        <div class="prod" v-for="order in dataList" :key="order.orderId">
          <div class="prod-tit">
            <span>订单编号：{{ order.orderNumber }}</span>
            <span>下单时间：{{ order.createTime }}</span>
            <!-- <span>买家：19999999999</span>
            <span >联系电话：19999999999</span> -->
          </div>
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col :span="12">
                <div class="prod-item">
                  <div
                    class="items name"
                    v-for="orderItem in order.orderItems"
                    :key="orderItem.orderItemId"
                  >
                    <div class="prod-image">
                      <img :src="resourcesUrl + orderItem.pic" style="height:
                      100px; width: 100px" //>
                    </div>
                    <div class="prod-name">
                      <span>{{ orderItem.prodName }}</span>
                      <span class="prod-info">{{ orderItem.skuName }}</span>
                    </div>
                    <div class="prod-price">
                      <span>￥{{ orderItem.price }}</span>
                      <span>×{{ orderItem.prodCount }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div>
                    <span class="totalprice">￥{{ order.actualTotal }}</span>
                    <span v-if="order.freightAmount"
                      >（含运费：￥{{ order.freightAmount }}）</span
                    >
                    <span>共{{ order.productNums }}件</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div>
                    <span v-if="order.payType === 1">微信支付</span>
                    <span v-else-if="order.payType === 2">支付宝</span>
                    <span v-else>手动代付</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <span v-if="order.status === 1" size="small" type="danger"
                    >待付款</span
                  >
                  <span
                    v-else-if="order.status === 2"
                    size="small"
                    type="danger"
                    >待发货</span
                  >
                  <span
                    v-else-if="order.status === 3"
                    size="small"
                    type="danger"
                    >待收货</span
                  >
                  <span
                    v-else-if="order.status === 4"
                    size="small"
                    type="danger"
                    >待评价</span
                  >
                  <span
                    v-else-if="order.status === 5"
                    size="small"
                    type="danger"
                    >成功</span
                  >
                  <span v-else size="small">失败</span>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div class="operate">
                    <!-- <button onclick="">打印订单</button><br> -->
                    <el-button
                      v-if="isAuth('order:order:update')"
                      type="text"
                      size="small"
                      @click="addOrUpdateHandle(order.orderNumber)"
                      >查看</el-button
                    >
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="remark">
            <div class="buyer-remark">
              <span>备注:{{ order.remarks }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 空 -->
    <div class="empty-tips">暂无数据</div>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
    <consignment-info
      v-if="consignmentInfoVisible"
      ref="consignmentInfo"
      @inputCallback="getWaitingConsignmentExcel"
    />
  </div>
</template>
