<template>
  <table :id="id" style="border-collapse: collapse;" v-if="data.list&&data.list.length">
    <tr>
      <td colspan="12">
          <div style="display:flex;justify-content:space-between">
          <div>制单日期:{{data.list&&data.list[0].createdTime || "-"}}</div>
          <div>NO.{{data.list&&data.list[0].incomingId || "-"}}</div>
        </div>
      </td>
    </tr>
    <tr>
      <th>提货单位</th>
      <th colspan="3"></th>
      <th>提单号</th>
      <th colspan="3"></th>
      <th>提货车船号</th>
      <th colspan="3"></th>
    </tr>
    <tr>
      <th>原始单据号</th>
      <th colspan="3"></th>
      <th>结算方式</th>
      <th colspan="3"></th>
      <th>证件号</th>
      <th colspan="3"></th>
    </tr>
    <tr>
      <th>区桩位</th>
      <th>炉号</th>
      <th>产地</th>
      <th>品名</th>
      <th>材质</th>
      <th>规格</th>
      <th>单位</th>
      <th>数量</th>
      <th>重量</th>
      <th>计量</th>
      <th>车船号</th>
      <th>备注</th>
    </tr>
    <tr class="alt" v-for="(item,index) in data.list" :key="index">
      <td>{{item.pilePosition || "--"}}</td>
      <td>--</td>
      <td>{{item.originPlaceName || "--"}}</td>
      <td>{{item.productName || "--"}}</td>
      <td>{{item.materialName || "--"}}</td>
      <td>{{item.specificationsName || "--"}}</td>
      <td>{{item.numUnitTypeEnum.text || "--"}}</td>
      <td>{{item.actualRemovalNum || "--"}}</td>
      <td>{{item.actualRemovalWeight || "--"}}</td>
      <td>{{item.measuringTypeEnum.text || "--"}}</td>
      <td>--</td>
      <td>--</td>
    </tr>
    <tr class="alt">
      <td colspan="6">合计:{{data.summation}}</td>
      <td>--</td>
      <td>--</td>
      <td>--</td>
      <td colspan="3"></td>
    </tr>
    <tr class="alt">
      <td colspan="12" height="50px"></td>
    </tr>
    <tr class="alt">
      <td colspan="12">出库说明:出库请当面点清数量,离库后概不负责。</td>
    </tr>

    <tr>
      <th colspan="12" height="300px">
        <div style="display:flex">
          <div style="flex:2;text-align:left">开单人:</div>
          <div style="flex:2;text-align:left">发货员:</div>
          <div style="flex:1;text-align:left">提货人:</div>
        </div>
      </th>
    </tr>
  </table>
</template>

<script>
import Dict from "@/util/dict.js";
import { normalTime } from "@/util/util.js";
export default {
  name: "outerticket",
  props: {
    id: {
      type: String,
      required: true
    },
    data:{
     type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return {
          list:[]
        }
      }        
    }  
  },
  data() {
    return {
      Dict,
      normalTime
    };
  }
};
</script>

<style scoped lang="less">
#customers {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
#customers td,
#customers th {
  font-size: 1em;
  border: 1px solid #000000;
  padding: 3px 7px 2px 7px;
}
#customers th {
  text-align: center;
  padding-top: 5px;
  padding-bottom: 4px;
  color: #000000;
}
#customers tr.alt td {
  color: #000000;
}
</style>