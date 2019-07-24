<template>
  <table :id="id" style="border-collapse: collapse;" v-if="data&&data.length">
    <tr>
      <th colspan="3">质押方:{{data[0].pledgeCargo}}</th>
      <th colspan="3">质权方:{{data[0].bankName}}</th>
      <th colspan="2">业务类别:{{data[0].pledgeType&&Dict.PLEDGE_BUSINESS_TYPE[data[0].pledgeType]}}</th>
    </tr>
    <tr>
      <th>货主</th>
      <th>质押数量</th>
      <th>质押重量</th>
      <th>质押金额</th>
      <th>放款金额</th>
      <th>开始时间</th>
      <th>终止时间</th>
    </tr>
    <tr class="alt" v-for="(item,index) in data" :key="index">
      <td>{{item.pledgeCargo || ""}}</td>
      <td>{{item.pledgeNums || ""}}</td>
      <td>{{item.pledgeWeight || ""}}</td>
      <td>{{item.pledgeSum || ""}}</td>
      <td>{{item.LoanSum || ""}}</td>
      <td>{{item.createdTime}}</td>
      <td>{{item.endTime || ""}}</td>
    </tr>

  </table>
</template>

<script>
import Dict from "@/util/dict.js";
export default {
  name: "pledgeticket",
  props:{
    id: {
      type: String,
      required: true
    }, 
    data:{
     type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return []
      }        
    }     
  },
  data(){
    return {
      Dict
    }
  }
};
</script>

<style scoped lang="less">
#customers {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  width: 100%;
  border-collapse: collapse;
  font-size:12px;
}
#customers td,
#customers th {
  font-size:1em;
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